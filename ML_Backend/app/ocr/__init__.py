import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import OCR functions
from app.ocr.preprocessing import preprocess_prescription
from app.ocr.llama_vision import extract_with_llama_vision
from app.ocr.fallbacks import extract_with_easyocr, extract_with_gpt4_vision

async def extract_text_from_image(image):
    """
    Extract text from prescription image using the best available method
    """
    # Get configuration from environment
    ocr_method = os.getenv("OCR_METHOD", "llama").lower()
    fallback_enabled = os.getenv("FALLBACK_ENABLED", "true").lower() == "true"
    
    # Preprocess the image to get multiple versions
    image_versions = preprocess_prescription(image)
    
    # Track results from different methods and versions
    results = {}
    
    # Try with the primary method and best image version first
    primary_version = "edge_enhanced" if "edge_enhanced" in image_versions else "original"
    
    if ocr_method == "llama":
        # Try Llama Vision first
        results["llama"] = await extract_with_llama_vision(image_versions[primary_version])
    elif ocr_method == "gpt4":
        # Try GPT-4 Vision
        results["gpt4"] = await extract_with_gpt4_vision(image_versions[primary_version])
    else:
        # Default to EasyOCR
        results["easyocr"] = await extract_with_easyocr(image_versions[primary_version])
    
    # Check if we have a result
    primary_result = results.get(ocr_method)
    if primary_result and len(primary_result.strip()) > 10:  # Non-empty result
        return primary_result
    
    # If primary method failed and fallbacks are enabled, try other methods
    if fallback_enabled:
        print(f"Primary method ({ocr_method}) failed. Trying fallbacks...")
        
        # Try with other image versions first
        for version_name, version_img in image_versions.items():
            if version_name != primary_version:
                if ocr_method == "llama":
                    version_result = await extract_with_llama_vision(version_img)
                elif ocr_method == "gpt4":
                    version_result = await extract_with_gpt4_vision(version_img)
                else:
                    version_result = await extract_with_easyocr(version_img)
                
                if version_result and len(version_result.strip()) > 10:
                    return version_result
        
        # If still no result, try other OCR methods
        if ocr_method != "gpt4" and os.getenv("OPENAI_API_KEY"):
            print("Trying GPT-4 Vision fallback...")
            results["gpt4"] = await extract_with_gpt4_vision(image_versions["original"])
            if results["gpt4"] and len(results["gpt4"].strip()) > 10:
                return results["gpt4"]
        
        if ocr_method != "llama" and os.getenv("TOGETHER_API_KEY"):
            print("Trying Llama Vision fallback...")
            results["llama"] = await extract_with_llama_vision(image_versions["original"])
            if results["llama"] and len(results["llama"].strip()) > 10:
                return results["llama"]
        
        # Last resort: EasyOCR
        if ocr_method != "easyocr":
            print("Trying EasyOCR fallback...")
            results["easyocr"] = await extract_with_easyocr(image_versions["original"])
            if results["easyocr"] and len(results["easyocr"].strip()) > 10:
                return results["easyocr"]
    
    # Return the best result we have, even if it's empty
    for method in [ocr_method, "gpt4", "llama", "easyocr"]:
        if method in results and results[method]:
            return results[method]
    
    # If everything failed, return empty string
    return "" 