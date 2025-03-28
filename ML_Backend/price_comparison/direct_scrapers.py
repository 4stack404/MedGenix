import aiohttp
import asyncio
import re
import logging
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
import json
from urllib.parse import quote

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Common headers to simulate a browser
DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

async def fetch_html(url: str, headers: Optional[Dict[str, str]] = None) -> str:
    """Fetch HTML content from a URL."""
    if headers is None:
        headers = DEFAULT_HEADERS
    
    try:
        # Use cookie_jar=aiohttp.DummyCookieJar() to ignore problematic cookies
        async with aiohttp.ClientSession(cookie_jar=aiohttp.DummyCookieJar()) as session:
            async with session.get(url, headers=headers, timeout=30) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    logger.warning(f"Error {response.status} fetching {url}")
                    return ""
    except Exception as e:
        logger.error(f"Error fetching {url}: {str(e)}")
        return ""

def extract_price(text: str) -> float:
    """Extract price from text."""
    if not text:
        return 0.0
    
    # Remove currency symbols, commas, and other non-numeric characters
    cleaned = re.sub(r'[^\d.]', '', text)
    try:
        return float(cleaned) if cleaned else 0.0
    except ValueError:
        return 0.0

async def scrape_1mg(medicine_name: str) -> Optional[Dict[str, Any]]:
    """Scrape medicine price from 1mg.com"""
    try:
        # Try different URL formats
        urls = [
            f"https://www.1mg.com/search/all?name={quote(medicine_name)}",
            f"https://www.1mg.com/search/all?filter=true&name={quote(medicine_name)}",
            f"https://www.1mg.com/drugs/search?name={quote(medicine_name)}"
        ]
        
        # Add more headers to simulate a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
            'TE': 'Trailers',
            'Pragma': 'no-cache'
        }
        
        html = None
        used_url = None
        
        # Try each URL until we get a response
        for url in urls:
            logger.info(f"Trying URL: {url}")
            html = await fetch_html(url, headers)
            if html and len(html) > 1000:  # Check if response is substantial
                used_url = url
                break
        
        if not html:
            logger.error(f"No HTML content returned from 1mg for {medicine_name}")
            return None
            
        soup = BeautifulSoup(html, 'html.parser')
        
        # Try to find the product list container first
        list_selectors = [
            'div[class*="style__container"]',
            'div[class*="style__listing"]',
            'div[class*="style__grid"]',
            'div[class*="search-content"]',
            'div[class*="style__product-list"]',
            'div[class*="SearchList"]'
        ]
        
        product_list = None
        for selector in list_selectors:
            product_list = soup.select_one(selector)
            if product_list:
                logger.info(f"Found product list with selector: {selector}")
                break
        
        # If we found a product list, search within it
        search_root = product_list if product_list else soup
        
        # Try multiple product selectors
        product_selectors = [
            'div[class*="style__product-box"]',
            'div[class*="style__horizontal-card"]',
            'div[class*="ProductCard__product-card"]',
            'div[class*="style__product-card"]',
            'div[class*="ProductList__product-card"]',
            'div[class*="product-card"]',
            'div[class*="Card__card"]'
        ]
        
        # Try to find all products first
        products = []
        for selector in product_selectors:
            products = search_root.select(selector)
            if products:
                logger.info(f"Found {len(products)} products with selector: {selector}")
                break
        
        if not products:
            # Try finding any div that contains both price and medicine name
            all_divs = soup.find_all('div')
            products = [div for div in all_divs if 
                      medicine_name.lower() in div.get_text().lower() and 
                      '₹' in div.get_text()]
            if products:
                logger.info(f"Found {len(products)} products by text search")
        
        if not products:
            logger.error(f"No products found on 1mg for {medicine_name}")
            return None
        
        # Get the first product that has both name and price
        for product in products:
            # Try multiple price selectors
            price_selectors = [
                'div[class*="PriceBox"]',
                'div[class*="price-box"]',
                'span[class*="price"]',
                'div[class*="price"]',
                'span[class*="Price"]',
                'div[class*="Price"]',
                'span[class*="mrp"]',
                'div[class*="mrp"]'
            ]
            
            price = None
            for selector in price_selectors:
                price_elem = product.select_one(selector)
                if price_elem:
                    price_text = price_elem.get_text().strip()
                    logger.info(f"Found price text: {price_text}")
                    # Try to extract price using regex
                    price_match = re.search(r'₹\s*(\d+(?:\.\d{1,2})?)', price_text)
                    if price_match:
                        price = float(price_match.group(1))
                        logger.info(f"Extracted price: {price}")
                        break
            
            # If no price found with selectors, try searching in all text
            if not price:
                price_text = product.get_text()
                price_match = re.search(r'₹\s*(\d+(?:\.\d{1,2})?)', price_text)
                if price_match:
                    price = float(price_match.group(1))
                    logger.info(f"Found price in text: {price}")
            
            if not price:
                continue
            
            # Try to get product name
            name_selectors = [
                'div[class*="style__pro-title"]',
                'div[class*="ProductName"]',
                'div[class*="product-name"]',
                'span[class*="style__pro-title"]',
                'a[class*="ProductName"]',
                'a[class*="product-name"]',
                'div[class*="style__title"]',
                'div[class*="style__name"]'
            ]
            
            product_name = None
            for selector in name_selectors:
                name_elem = product.select_one(selector)
                if name_elem:
                    text = name_elem.get_text().strip()
                    if len(text) > 5:
                        product_name = text
                        logger.info(f"Found product name: {product_name}")
                        break
            
            # If no name found with selectors, try finding the longest text that contains the medicine name
            if not product_name:
                text_elements = [elem.get_text().strip() for elem in product.find_all(text=True) if elem.strip()]
                text_elements.sort(key=len, reverse=True)
                for text in text_elements:
                    if medicine_name.lower() in text.lower() and len(text) > 5:
                        product_name = text
                        logger.info(f"Found product name in text: {product_name}")
                        break
            
            # If we found both price and name, return the result
            if price and product_name:
                return {
                    'website': '1mg.com',
                    'price': price,
                    'url': used_url,
                    'availability': True,
                    'product_name': product_name
                }
        
        logger.error(f"No valid product with both name and price found on 1mg for {medicine_name}")
        return None
        
    except Exception as e:
        logger.error(f"Error scraping 1mg: {str(e)}")
        return None

async def scrape_pharmeasy(medicine_name: str) -> Optional[Dict[str, Any]]:
    """Scrape medicine price from pharmeasy.in"""
    try:
        url = f"https://pharmeasy.in/search/all?name={quote(medicine_name)}"
        html = await fetch_html(url)
        if not html:
            return None
            
        soup = BeautifulSoup(html, 'html.parser')
        
        # Try multiple product selectors
        product_selectors = [
            'div[class*="product-card"]',
            'div[class*="ProductCard"]',
            'div[class*="product"]',
            'div[class*="Product"]'
        ]
        
        product = None
        for selector in product_selectors:
            product = soup.select_one(selector)
            if product:
                break
                
        if not product:
            return None
            
        # Try multiple price selectors
        price_selectors = [
            'div[class*="price"]',
            'span[class*="price"]',
            'div[class*="mrp"]',
            'span[class*="mrp"]',
            'div[class*="amount"]',
            'span[class*="amount"]'
        ]
        
        price = None
        for selector in price_selectors:
            price_elem = product.select_one(selector)
            if price_elem:
                price_text = price_elem.get_text().strip()
                # Try to extract price using regex
                price_match = re.search(r'₹\s*(\d+(?:\.\d{1,2})?)', price_text)
                if price_match:
                    price = float(price_match.group(1))
                    break
                    
        # If no price found with selectors, try searching in all text
        if not price:
            price_text = product.get_text()
            price_match = re.search(r'₹\s*(\d+(?:\.\d{1,2})?)', price_text)
            if price_match:
                price = float(price_match.group(1))
                
        if not price:
            return None
            
        # Try to get product name
        name_selectors = [
            'div[class*="product-name"]',
            'div[class*="ProductName"]',
            'div[class*="title"]',
            'div[class*="Title"]',
            'h1', 'h2', 'h3'
        ]
        
        product_name = None
        for selector in name_selectors:
            name_elem = product.select_one(selector)
            if name_elem:
                product_name = name_elem.get_text().strip()
                break
                
        # If no name found with selectors, try getting first text element
        if not product_name:
            text_elements = [elem.get_text().strip() for elem in product.find_all(text=True) if elem.strip()]
            if text_elements:
                product_name = text_elements[0]
                
        return {
            'website': 'pharmeasy.in',
            'price': price,
            'url': url,
            'availability': True,
            'product_name': product_name
        }
        
    except Exception as e:
        logger.error(f"Error scraping PharmEasy: {str(e)}")
        return None

async def get_all_prices(medicine_name: str) -> List[Dict[str, Any]]:
    """Get prices from all pharmacy websites."""
    logger.info(f"Starting price fetch for {medicine_name}")
    
    tasks = [
        scrape_1mg(medicine_name),
        scrape_pharmeasy(medicine_name)
    ]
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out exceptions and None values
    valid_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error(f"Error in task {i}: {str(result)}")
        elif result is not None:
            valid_results.append(result)
    
    if not valid_results:
        logger.warning(f"No valid results found for {medicine_name}")
    
    return valid_results 