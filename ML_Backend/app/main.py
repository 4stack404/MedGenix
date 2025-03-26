from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from PIL import Image
import io
from typing import List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()


from app.ocr import extract_text_from_image
from app.analysis.medication_extractor import extract_medications_with_llm
from app.api.endpoints import generics


class Medicine(BaseModel):
    brand_name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None

class PrescriptionResponse(BaseModel):
    original_text: str
    medicines: List[Medicine]


app = FastAPI(
    title="Prescription Analyzer API",
    description="API for analyzing prescription images and extracting medication information",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Prescription Analyzer API"}

@app.post("/process-prescription/", response_model=PrescriptionResponse)
async def process_prescription(file: UploadFile = File(...)):
    """
    Process a prescription image and extract medication information.
    
    Returns structured information about medications from the prescription.
    """
    try:
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        
        ocr_text = await extract_text_from_image(image)
        
        if not ocr_text:
            raise HTTPException(status_code=422, detail="Could not extract text from the image")
        
        
        medicine_info = await extract_medications_with_llm(ocr_text)
        
        return PrescriptionResponse(
            original_text=ocr_text,
            medicines=medicine_info
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/health")
async def health_check():
    """Check if the API is running"""
    return {"status": "healthy", "ocr_method": os.getenv("OCR_METHOD", "llama")}


@app.on_event("startup")
def startup_event():
    pass

app.include_router(generics.router, prefix="/api", tags=["medications"])


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True) 