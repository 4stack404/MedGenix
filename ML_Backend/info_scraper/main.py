from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import xml.etree.ElementTree as ET
import re
from firecrawl import FirecrawlApp
import json
from typing import Optional
import groq
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
firecrawl_api_key = os.getenv("FIRECRAWL_API_KEY")

app = FastAPI(title="Medicine Information API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add base endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to medicine_info_scrapper API made by Ayyub OP"}

# Add help endpoint
@app.get("/help")
async def help():
    return {
        "endpoints": [
            {
                "path": "/",
                "method": "GET",
                "description": "Welcome message"
            },
            {
                "path": "/help",
                "method": "GET",
                "description": "List all available endpoints"
            },
            {
                "path": "/medicine_info",
                "method": "POST",
                "description": "Get detailed information about a medicine",
                "request_body": {
                    "name": "string (required)",
                    "sitemap_url": "string (optional)"
                },
                "response": "Structured medicine information"
            }
        ]
    }

firecrawl_app = FirecrawlApp(api_key=firecrawl_api_key)
groq_client = groq.Client(api_key=groq_api_key)

class MedicineRequest(BaseModel):
    name: str
    sitemap_url: Optional[str] = "https://www.1mg.com/sitemap_generics_1.xml"

class MedicineResponse(BaseModel):
    medicine_name: str
    uses: list[str]
    how_it_works: str
    common_side_effects: list[str]
    content_details: dict
    expert_advice: list[str]
    faqs: list[dict]

@app.post("/medicine_info", response_model=MedicineResponse)
async def get_medicine_info(request: MedicineRequest):
    try:
        # Step 1: Get the exact link from sitemap
        medicine_link = get_medicine_link(request.name, request.sitemap_url)
        if not medicine_link:
            raise HTTPException(status_code=404, detail=f"No link found for medicine: {request.name}")
        
        # Step 2: Scrape the data using FirecrawlApp
        scraped_data = get_llm_ready_data(medicine_link)
        
        # Step 3: Process with LLM to extract structured data
        structured_data = process_with_llm(scraped_data, request.name)
        
        return structured_data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def get_medicine_link(medicine_name: str, sitemap_url: str) -> str:
    """Get the exact medicine link from the sitemap."""
    # Format the medicine name for URL matching
    formatted_name = medicine_name.lower().replace(' ', '-')
    partial_link = f"/generics/{formatted_name}"
    
    # Fetch the sitemap
    response = requests.get(sitemap_url)
    if response.status_code == 200:
        root = ET.fromstring(response.content)
        
        # Extract and filter links
        links = [elem.text for elem in root.iter() 
                if elem.text and re.search(rf"{partial_link}-\d+$", elem.text)]
        
        # Return the first matching link if found
        if links:
            return links[0]
    
    # Try another sitemap if first one didn't work
    # You might want to implement sitemap discovery logic here
    
    return None

def get_llm_ready_data(url: str) -> str:
    """Scrape data from the URL and prepare it for LLM processing."""
    scrape_result = firecrawl_app.scrape_url(url, params={'formats': ['markdown', 'html']})
    
    # Return the markdown content which is easier for LLMs to process
    return scrape_result.get('markdown', '')

def process_with_llm(content: str, medicine_name: str) -> MedicineResponse:
    """Process the scraped content with an LLM to extract structured data."""
    
    prompt = f"""
    Extract structured information about {medicine_name} from the following content.
    Focus on:
    1. Uses
    2. How it works
    3. Common side effects
    4. Content details (with each author and their image link, ("name": "image_link"))
    5. Expert advice
    6. FAQs
    
    You MUST return ONLY valid JSON with NO additional text, with these exact keys:
    - medicine_name
    - uses (list of strings)
    - how_it_works (string)
    - common_side_effects (list of strings)
    - content_details (object with string keys and string values)
    - expert_advice (list of strings)
    - faqs (list of objects with 'question' and 'answer' keys)
    
    Make sure your response is parseable as JSON. Do not include any markdown formatting, explanations, or code blocks.
    
    Content:
    {content}
    """
    
    try:
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-70b-8192",
            temperature=0.1  # Lower temperature for more consistent outputs
        )
        
        response_content = response.choices[0].message.content.strip()
        
        # Try to clean up the response if it contains markdown code blocks
        if response_content.startswith("```json"):
            response_content = response_content.replace("```json", "", 1)
            if response_content.endswith("```"):
                response_content = response_content[:-3]
        elif response_content.startswith("```"):
            response_content = response_content.replace("```", "", 1)
            if response_content.endswith("```"):
                response_content = response_content[:-3]
                
        # Remove any leading/trailing whitespace
        response_content = response_content.strip()
        
        # Parse the JSON response
        result = json.loads(response_content)
        
        # Validate that the result contains all required fields
        return MedicineResponse(**result)
        
    except json.JSONDecodeError as json_err:
        print(f"JSON parsing error: {json_err}")
        print(f"Response content: {response_content if 'response_content' in locals() else 'Not available'}")
        # Fall back to a default response
        return create_default_response(medicine_name)
        
    except Exception as e:
        print(f"Error processing LLM response: {str(e)}")
        # If we have a result but it's missing some fields
        if 'result' in locals() and isinstance(result, dict):
            return MedicineResponse(
                medicine_name=result.get("medicine_name", medicine_name),
                uses=result.get("uses", []),
                how_it_works=result.get("how_it_works", ""),
                common_side_effects=result.get("common_side_effects", []),
                content_details=result.get("content_details", {}),
                expert_advice=result.get("expert_advice", []),
                faqs=result.get("faqs", [])
            )
        else:
            # Complete fallback
            return create_default_response(medicine_name)

def create_default_response(medicine_name: str) -> MedicineResponse:
    """Create a default response when LLM processing fails."""
    return MedicineResponse(
        medicine_name=medicine_name,
        uses=["Information unavailable"],
        how_it_works="Information about how this medicine works could not be retrieved.",
        common_side_effects=["Information unavailable"],
        content_details={"note": "Content details could not be retrieved"},
        expert_advice=["Information unavailable"],
        faqs=[{"question": "Why is information missing?", "answer": "There was an error processing the medicine information."}]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
