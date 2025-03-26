from pydantic import BaseModel
from typing import Optional

class Medicine(BaseModel):
    brand_name: str
    generic_name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    
class GenericAlternative(BaseModel):
    generic_name: str
    equivalent_dosage: Optional[str] = None
    price_comparison: Optional[str] = None
    differences: Optional[str] = None
    
class MedicineWithAlternatives(BaseModel):
    brand_name: str
    brand_details: Optional[Medicine] = None
    generic_alternatives: list[GenericAlternative] = []
    source: str  # "rxnorm", "llm", or "cache"
