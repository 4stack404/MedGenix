from firecrawl import FirecrawlApp
import groq
from dotenv import load_dotenv
import os
from fastapi import FastAPI
import json
import logging
import urllib.parse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="Medicine Price Comparison API")

groq_api_key = os.getenv("GROQ_API_KEY")
firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY")

# Validate API keys
if not groq_api_key or not firecrawl_api_key:
    logger.error("Missing API keys. Please check your .env file.")
    raise ValueError("Missing required API keys")

firecrawl_app = FirecrawlApp(api_key=firecrawl_api_key)
groq_client = groq.Client(api_key=groq_api_key)

urls = {
    "1mg_url": "https://www.1mg.com/search/all?name=",
    "pharmeasy_url": "https://pharmeasy.in/search/all?name="
}

@app.get("/")
def base_url():
    return {"welcome": "Medicine Price Comparison API by Ayyub AB7"}

@app.get("/get_prices/{medicine}")
async def compare_prices(medicine: str):
    """
    Compare medicine prices across multiple pharmacy websites.
    
    Args:
        medicine: The name of the medicine to search for
        
    Returns:
        Dictionary containing price information from different sources
    """
    results = {}
    
    try:
        # Dictionary of pharmacy functions
        pharmacy_functions = {
            "1mg": get_1mg,
            "pharmeasy": get_pharmeasy
        }
        
        for pharmacy, func in pharmacy_functions.items():
            try:
                results[pharmacy] = func(medicine)
            except Exception as e:
                logger.error(f"Error getting prices from {pharmacy}: {str(e)}")
                results[pharmacy] = {"error": f"Failed to retrieve data: {str(e)}"}
        
        # Format results more cleanly
        formatted_results = format_comparison_results(results)
        return formatted_results
    except Exception as e:
        logger.error(f"Error in compare_prices: {str(e)}")
        return {"error": f"Error getting prices: {str(e)}"}

def get_1mg(medicine_name):
    """Get medicine prices from 1mg.com"""
    try:
        # Add filter=true to get more relevant results
        url = f"{urls['1mg_url']}{medicine_name}&filter=true&sort=popularity"
        scraped_data = get_llm_ready_data(url)
        result = process_with_llm(scraped_data)
        if isinstance(result, str):
            # Try to parse the result if it's a string
            try:
                result = json.loads(result)
            except json.JSONDecodeError:
                result = {"raw_response": result}
        
        return {
            "data": result,
            "source_url": url
        }
    except Exception as e:
        logger.error(f"Error in get_1mg: {str(e)}")
        return {"error": str(e)}

def get_pharmeasy(medicine_name):
    """Get medicine prices from pharmeasy.in"""
    try:
        # Use more specific parameters to get only medicines
        url = f"{urls['pharmeasy_url']}{medicine_name}&filter=true&categoryId=1"
        scraped_data = get_llm_ready_data(url)
        result = process_with_llm(scraped_data)
        if isinstance(result, str):
            try:
                result = json.loads(result)
            except json.JSONDecodeError:
                result = {"raw_response": result}
        
        return {
            "data": result,
            "source_url": url
        }
    except Exception as e:
        logger.error(f"Error in get_pharmeasy: {str(e)}")
        return {"error": str(e)}

def get_llm_ready_data(url: str, timeout=None) -> str:
    """
    Scrape data from the URL and prepare it for LLM processing.
    
    Args:
        url: The website URL to scrape
        timeout: Optional timeout in seconds
        
    Returns:
        Filtered content from the website
    """
    try:
        # Use only the supported parameters for firecrawl
        params = {'formats': ['markdown', 'html']}
        if timeout:
            params['timeout'] = timeout
            
        scrape_result = firecrawl_app.scrape_url(
            url, 
            params=params
        )
        
        # Get the content
        markdown_content = scrape_result.get('markdown', '')
        html_content = scrape_result.get('html', '')
        
        # If markdown is too short, use HTML instead
        content = markdown_content if len(markdown_content) > 500 else html_content
            
        # Immediately filter the content for medicine-related information
        return extract_medicine_info(content)
    except Exception as e:
        logger.error(f"Error in get_llm_ready_data: {str(e)}")
        raise

def extract_medicine_info(content):
    """
    Extract medicine-specific information from the content to reduce size.
    
    Args:
        content: The raw scraped content
        
    Returns:
        Filtered content with only medicine-related information
    """
    try:
        import re
        
        # Medicine name patterns to look for
        medicine_name_patterns = [
            r'(?:Tablet|Capsule|Syrup|Injection|Strip)(?:.{0,100})',
            r'\d+\s*(?:mg|ml|g)(?:.{0,100})'
        ]
        
        # Price patterns
        price_patterns = [
            r'(?:₹|Rs\.?|MRP|Price).{0,50}\d+\.?\d*',
            r'\d+\.?\d*\s*/-'
        ]
        
        # Extract sections that match our patterns
        extracted_content = []
        
        # Split content into manageable chunks
        chunks = content.split('\n')
        
        for chunk in chunks:
            # Check if the chunk contains medicine info
            if any(re.search(pattern, chunk, re.IGNORECASE) for pattern in medicine_name_patterns) or \
               any(re.search(pattern, chunk, re.IGNORECASE) for pattern in price_patterns):
                extracted_content.append(chunk)
        
        # If we have too little data, try a looser approach
        if len(extracted_content) < 5:
            # Look for product listing patterns
            product_patterns = [
                r'product',
                r'medicine',
                r'drug',
                r'tablet',
                r'capsule',
                r'strip'
            ]
            
            for chunk in chunks:
                if any(pattern.lower() in chunk.lower() for pattern in product_patterns) and \
                   chunk not in extracted_content:
                    extracted_content.append(chunk)
        
        # Limit content size
        result = '\n'.join(extracted_content[:100])  # Limit to top 100 lines
        
        # If result is still too long
        if len(result) > 2000:
            logger.info(f"Trimming content from {len(result)} to 2000 chars")
            result = result[:2000]
        
        return result
    except Exception as e:
        logger.warning(f"Error filtering content: {str(e)}")
        # Return a truncated version of the original
        return content[:1500]

def process_with_llm(content: str):
    """
    Process the scraped content with an LLM to extract structured data.
    
    Args:
        content: The scraped website content
        
    Returns:
        Structured data extracted by the LLM
    """
    # Very concise prompt to save tokens
    prompt = f"""
    Extract exactly 3 medicines from this pharmacy website content:
    
    1. medicine_name: Full name with brand
    2. price: Numerical value only
    3. dosage: Strength (e.g., 500mg)
    4. quantity: Package amount (e.g., 10 tablets)
    
    FORMAT: JSON array of objects:
    [
      {{"medicine_name": "Name", "price": 33.70, "dosage": "650mg", "quantity": "15 tablets"}}
    ]
    
    Return [] if no medicines found.
    
    CONTENT:
    {content}
    """
    
    try:
        response = groq_client.chat.completions.create(
            messages=[{
                "role": "system", 
                "content": "Extract medicine data as JSON array. No explanations."
            },
            {
                "role": "user", 
                "content": prompt
            }],
            model="llama3-8b-8192",
            temperature=0.1,
            max_tokens=512
        )
        
        response_content = response.choices[0].message.content.strip()
        
        # Try to parse and fix JSON if needed
        return parse_and_fix_json(response_content)
            
    except Exception as e:
        logger.error(f"Error in process_with_llm: {str(e)}")
        return []  # Return empty array on error

def parse_and_fix_json(response_content):
    """
    Parse and fix potentially malformed JSON responses from LLM.
    
    Args:
        response_content: The LLM response content
        
    Returns:
        Properly formatted JSON data or error
    """
    # Try direct parsing first
    try:
        # Strip any markdown code blocks if present
        if response_content.startswith("```json"):
            response_content = response_content.replace("```json", "", 1)
        if response_content.startswith("```"):
            response_content = response_content.replace("```", "", 1)
        if response_content.endswith("```"):
            response_content = response_content[:-3]
            
        response_content = response_content.strip()
        return json.loads(response_content)
    except json.JSONDecodeError:
        # Handle common malformed JSON issues
        try:
            # Check if the content looks like individual JSON objects without the wrapping array
            if response_content.strip().startswith("{") and not response_content.strip().startswith("["):
                # Add missing array brackets and fix missing commas between objects
                fixed_content = "[" + response_content.replace("}\n{", "},{").replace("}\r\n{", "},{") + "]"
                return json.loads(fixed_content)
            
            # Try to extract the JSON part from a potentially larger text
            import re
            json_pattern = r'\[[\s\S]*\]'
            json_match = re.search(json_pattern, response_content)
            if json_match:
                return json.loads(json_match.group(0))
                
            # If we can't fix it, return the raw response
            return {"raw_response": response_content, "error": "Malformed JSON"}
        except Exception as e:
            logger.error(f"Error fixing JSON: {str(e)}")
            return {"raw_response": response_content, "error": "Malformed JSON that couldn't be fixed"}

def format_comparison_results(results):
    """
    Format the comparison results for better readability.
    
    Args:
        results: Raw results from pharmacy sites
        
    Returns:
        Formatted results focusing on medicine data
    """
    formatted = {}
    
    for pharmacy, data in results.items():
        if "error" in data:
            formatted[pharmacy] = {"error": data["error"]}
        else:
            try:
                # Extract medicine data
                medicines = []
                source_url = data.get("source_url", "")
                
                if "data" in data:
                    raw_data = data["data"]
                    # Handle both array and object formats
                    if isinstance(raw_data, list):
                        medicines = raw_data
                    elif isinstance(raw_data, dict) and not raw_data.get("error"):
                        # Sometimes data might be nested
                        if "medicines" in raw_data:
                            medicines = raw_data["medicines"]
                        else:
                            # Add the data as a single item if it looks like a medicine
                            if "medicine_name" in raw_data or "price" in raw_data:
                                medicines = [raw_data]
                
                formatted[pharmacy] = {
                    "medicines": medicines,
                    "source_url": source_url
                }
            except Exception as e:
                logger.error(f"Error formatting results for {pharmacy}: {str(e)}")
                formatted[pharmacy] = {
                    "error": f"Error formatting results: {str(e)}",
                    "raw_data": data
                }
    
    return formatted

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
     