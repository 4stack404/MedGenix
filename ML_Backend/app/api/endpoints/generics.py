from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.models.medicine import Medicine, MedicineWithAlternatives
from app.services.generic_alternatives import GenericAlternativesService

router = APIRouter()
generic_service = GenericAlternativesService()

@router.post("/generic-alternatives/", response_model=List[MedicineWithAlternatives])
async def get_generic_alternatives(medicines: List[Medicine]):
    """
    Get generic alternatives for a list of medicines.
    
    This endpoint uses a hybrid approach:
    1. First checks a local cache
    2. Then tries the RxNorm API for reliable data
    3. Falls back to LLM-based generation if RxNorm doesn't have the information
    
    The response includes generic name, equivalent dosage, price comparison,
    and any notable differences between the brand and generic versions.
    """
    try:
        alternatives = await generic_service.get_alternatives(medicines)
        return alternatives
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get generic alternatives: {str(e)}")
