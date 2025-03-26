import os
import io
import base64
import numpy as np
import easyocr
import openai
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API keys from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize EasyOCR reader
easy_reader = None

def get_easy_reader():
    """Initialize EasyOCR reader if not already initialized"""
    global easy_reader
    if easy_reader is None:
        print("Initializing EasyOCR...")
        easy_reader = easyocr.Reader(['en'])
    return easy_reader

async def extract_with_easyocr(image):
    """
    Extract text using EasyOCR (fallback method)
    """
    try:
        # Get or initialize the OCR reader
        ocr_reader = get_easy_reader()
        
        # Convert PIL image to numpy array
        image_np = np.array(image)
        if len(image_np.shape) == 2:  # If grayscale, convert to RGB
            image_np = np.stack((image_np,)*3, axis=-1)
        
        # Perform OCR
        results = ocr_reader.readtext(image_np)
        
        # Extract text
        full_text = " ".join([text for _, text, _ in results])
        return full_text
        
    except Exception as e:
        print(f"EasyOCR Error: {str(e)}")
        return ""

async def extract_with_gpt4_vision(image):
    """
    Extract text using GPT-4 Vision (high-quality fallback)
    """
    try:
        if not OPENAI_API_KEY:
            print("OpenAI API key not set. Skipping GPT-4 Vision.")
            return ""
        
        # Set up OpenAI client
        openai.api_key = OPENAI_API_KEY
        
        # Convert PIL image to base64
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical professional specialized in reading doctor's handwriting on prescriptions."
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Read this doctor's prescription carefully. Extract all text, especially medication names, dosages, and instructions."
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
            max_tokens=1000
        )
        
        # Extract text from response
        extracted_text = response.choices[0].message['content']
        
        return extracted_text
        
    except Exception as e:
        print(f"GPT-4 Vision Error: {str(e)}")
        return "" 