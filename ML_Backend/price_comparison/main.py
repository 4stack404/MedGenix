from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os
import logging
from direct_scrapers import get_all_prices

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Medicine Price Comparison API",
    description="Compare medicine prices across different pharmacy websites",
    version="1.0.0"
)

class MedicinePrice(BaseModel):
    website: str
    price: float
    url: str
    availability: bool
    product_name: Optional[str] = None

class PriceComparisonResponse(BaseModel):
    medicine_name: str
    prices: List[MedicinePrice]
    timestamp: str

@app.get("/")
async def root():
    return {"message": "Welcome to Medicine Price Comparison API"}

@app.get("/compare/{medicine_name}", response_model=PriceComparisonResponse)
async def compare_prices(medicine_name: str):
    try:
        # Normalize medicine name (lowercase, remove extra spaces)
        normalized_medicine_name = ' '.join(medicine_name.lower().split())
        logger.info(f"Received request to compare prices for {normalized_medicine_name}")
        
        # Get prices from all websites
        results = await get_all_prices(normalized_medicine_name)
        
        logger.info(f"Found {len(results)} results for {normalized_medicine_name}")
        
        # Return results
        return {
            "medicine_name": normalized_medicine_name,
            "prices": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in compare_prices: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable for Railway.app compatibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 