import os
import base64
import io
import requests
from PIL import Image
from dotenv import load_dotenv

load_dotenv()


TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
print(TOGETHER_API_KEY)
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo")

def encode_image_base64(image):
    """Convert PIL Image to base64 string"""
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

async def extract_with_llama_vision(image, model=None):
    """
    Extract text from prescription images using Llama 3 Vision via Together.ai
    
    Args:
        image: PIL Image object
        model: Optional model override (defaults to env variable)
        
    Returns:
        Extracted text from the prescription
    """
    if not TOGETHER_API_KEY:
        raise ValueError("TOGETHER_API_KEY not set in environment variables")
    
   
    model_name = model or LLAMA_MODEL
    
    
    base64_image = encode_image_base64(image)
    
   
    url = "https://api.together.xyz/v1/chat/completions"
    
    
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    
    payload = {
        "model": model_name,
        "messages": [
            {
                "role": "system",
                "content": """You are a medical professional with expertise in reading doctors' handwriting on prescriptions.
                Your task is to extract all text from prescription images exactly as written, with special attention to:
                1. Medication names (spelled correctly)
                2. Dosages (e.g., 10mg, 500mg)
                3. Frequencies (e.g., once daily, twice daily, BID, TID)
                4. Duration of treatment
                5. Special instructions
                
                Format your response in a clear structure separating each medication and its instructions.
                """
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Extract all text from this prescription, especially medication names, dosages, and instructions."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "temperature": 0.1,  
        "max_tokens": 1000   
    }
    
    try:
       
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        
        result = response.json()
        extracted_text = result["choices"][0]["message"]["content"]
        
        return extracted_text
        
    except Exception as e:
        print(f"Llama Vision API Error: {str(e)}")
        
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")
        return "" 