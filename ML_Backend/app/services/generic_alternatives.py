import os
import requests
import json
from typing import List, Dict, Any, Optional
import time
from groq import Groq

from app.models.medicine import Medicine, GenericAlternative, MedicineWithAlternatives
from app.services.cache_manager import CacheManager

class GenericAlternativesService:
    def __init__(self):
        self.cache = CacheManager()
        self.groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        
    async def get_alternatives(self, medicines: List[Medicine]) -> List[MedicineWithAlternatives]:
        """
        Get generic alternatives for a list of medicines using the hybrid approach.
        """
        results = []
        
        for medicine in medicines:
            brand_name = medicine.brand_name
            
            
            cached_result = self.cache.get(brand_name)
            if cached_result:
                alternatives = self._parse_cached_alternatives(cached_result, medicine)
                alternatives.source = "cache"
                results.append(alternatives)
                continue
                
            
            rxnorm_result = await self._get_rxnorm_alternatives(brand_name)
            
            if rxnorm_result and len(rxnorm_result) > 0:
                
                alternatives = self._format_rxnorm_alternatives(rxnorm_result, medicine)
                
                self.cache.set(brand_name, rxnorm_result, "rxnorm")
                alternatives.source = "rxnorm"
                results.append(alternatives)
            else:
                
                llm_result = await self._get_llm_alternatives(medicine)
                
                self.cache.set(brand_name, llm_result, "llm")
                
                alternatives = self._format_llm_alternatives(llm_result, medicine)
                alternatives.source = "llm"
                results.append(alternatives)
        
        return results
    
    async def _get_rxnorm_alternatives(self, brand_name: str) -> List[Dict[str, Any]]:
        """
        Get generic alternatives using RxNorm API.
        Steps:
        1. Get RxNorm concept ID (RxCUI) for the brand name
        2. Get related generic medications using the RxCUI
        3. Get detailed information for each generic alternative
        """
        try:
            
            search_url = f"https://rxnav.nlm.nih.gov/REST/rxcui.json?name={brand_name}&search=1"
            response = requests.get(search_url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "idGroup" not in data or "rxnormId" not in data["idGroup"] or not data["idGroup"]["rxnormId"]:
                return []
                
            rxcui = data["idGroup"]["rxnormId"][0]
            
            
            # SCD = Semantic Clinical Drug (generic)
            # SBD = Semantic Branded Drug (brand)
            # GPCK = Generic Pack
            # BPCK = Brand Pack
            related_url = f"https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/allrelated.json"
            related_response = requests.get(related_url, timeout=10)
            related_response.raise_for_status()
            related_data = related_response.json()
            
            alternatives = []
            
            
            if ("allRelatedGroup" in related_data and 
                "conceptGroup" in related_data["allRelatedGroup"]):
                
                for group in related_data["allRelatedGroup"]["conceptGroup"]:
                    
                    if ("tty" in group and 
                        group["tty"] in ["SCD", "SCDF", "SCDG"] and 
                        "conceptProperties" in group):
                        
                        for prop in group["conceptProperties"]:
                            
                            if "name" in prop and "rxcui" in prop:
                                
                                details = self._get_medication_details(prop["rxcui"])
                                
                                alternative = {
                                    "generic_name": prop["name"],
                                    "rxcui": prop["rxcui"],
                                    "details": details
                                }
                                alternatives.append(alternative)
            
            return alternatives
            
        except requests.RequestException as e:
            print(f"RxNorm API request error: {str(e)}")
            return []
        except Exception as e:
            print(f"RxNorm API processing error: {str(e)}")
            return []
    
    def _get_medication_details(self, rxcui: str) -> Dict[str, Any]:
        """Get detailed information about a medication from RxNorm."""
        try:
            
            props_url = f"https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/allProperties.json?prop=all"
            props_response = requests.get(props_url, timeout=10)
            props_response.raise_for_status()
            props_data = props_response.json()
            
            details = {"dosage": None, "form": None}
            
            if ("propConceptGroup" in props_data and 
                "propConcept" in props_data["propConceptGroup"]):
                
                for prop in props_data["propConceptGroup"]["propConcept"]:
                    if prop["propName"] == "STRENGTH" and "propValue" in prop:
                        details["dosage"] = prop["propValue"]
                    if prop["propName"] == "DOSE_FORM" and "propValue" in prop:
                        details["form"] = prop["propValue"]
            
            
            details["price_comparison"] = "Generally 80-85% cheaper than brand name"
            
            return details
            
        except Exception as e:
            print(f"Error getting medication details: {str(e)}")
            return {}
    
    async def _get_llm_alternatives(self, medicine: Medicine) -> Dict[str, Any]:
        """
        Get generic alternatives using LLM when RxNorm doesn't have the information.
        """
        dosage_info = f" with dosage {medicine.dosage}" if medicine.dosage else ""
        
        prompt = f"""
        As a pharmacist, provide information about the generic alternatives for the brand name medication: {medicine.brand_name}{dosage_info}.

        For each generic alternative, please provide:
        1. Generic name (chemical name)
        2. Equivalent dosage to match the brand medication
        3. Approximate price comparison (percentage cheaper than brand name)
        4. Any notable differences in efficacy, side effects, or bioavailability

        Format your response as a JSON object with an array of alternatives following this structure:
        {{
            "alternatives": [
                {{
                    "generic_name": "Generic Name",
                    "equivalent_dosage": "Equivalent Dosage",
                    "price_comparison": "X% cheaper than brand name",
                    "differences": "Any notable differences"
                }}
            ]
        }}

        If this is not a real medication or you don't have sufficient information, return an empty array.
        """
        
        try:
            
            time.sleep(0.5)
            
            response = self.groq_client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=800,
                response_format={"type": "json_object"}
            )
            
            result_text = response.choices[0].message.content
            alternatives = json.loads(result_text)
            return alternatives
            
        except Exception as e:
            print(f"LLM API error: {str(e)}")
            return {"alternatives": []}
    
    def _parse_cached_alternatives(self, cached_result: Dict[str, Any], medicine: Medicine) -> MedicineWithAlternatives:
        """Parse cached alternatives into the MedicineWithAlternatives model."""
        alternatives = []
        
        
        data = cached_result.get("data", {})
        
        
        if cached_result.get("source") == "rxnorm":
            for alt in data:
                details = alt.get("details", {})
                alternatives.append(GenericAlternative(
                    generic_name=alt.get("generic_name", "Unknown"),
                    equivalent_dosage=details.get("dosage"),
                    price_comparison=details.get("price_comparison"),
                    differences="Standard generic equivalent"
                ))
        
        
        elif cached_result.get("source") == "llm":
            alt_list = data.get("alternatives", [])
            for alt in alt_list:
                alternatives.append(GenericAlternative(
                    generic_name=alt.get("generic_name", "Unknown"),
                    equivalent_dosage=alt.get("equivalent_dosage"),
                    price_comparison=alt.get("price_comparison"),
                    differences=alt.get("differences")
                ))
        
        return MedicineWithAlternatives(
            brand_name=medicine.brand_name,
            brand_details=medicine,
            generic_alternatives=alternatives,
            source=cached_result.get("source", "unknown")
        )
    
    def _format_rxnorm_alternatives(self, rxnorm_result: List[Dict[str, Any]], medicine: Medicine) -> MedicineWithAlternatives:
        """Format RxNorm API results into the MedicineWithAlternatives model."""
        alternatives = []
        
        for alt in rxnorm_result:
            details = alt.get("details", {})
            alternatives.append(GenericAlternative(
                generic_name=alt.get("generic_name", "Unknown"),
                equivalent_dosage=details.get("dosage"),
                price_comparison=details.get("price_comparison", "Generally 80-85% cheaper than brand name"),
                differences="Standard generic equivalent"
            ))
        
        return MedicineWithAlternatives(
            brand_name=medicine.brand_name,
            brand_details=medicine,
            generic_alternatives=alternatives,
            source="rxnorm"
        )
    
    def _format_llm_alternatives(self, llm_result: Dict[str, Any], medicine: Medicine) -> MedicineWithAlternatives:
        """Format LLM API results into the MedicineWithAlternatives model."""
        alternatives = []
        
        alt_list = llm_result.get("alternatives", [])
        for alt in alt_list:
            alternatives.append(GenericAlternative(
                generic_name=alt.get("generic_name", "Unknown"),
                equivalent_dosage=alt.get("equivalent_dosage"),
                price_comparison=alt.get("price_comparison"),
                differences=alt.get("differences")
            ))
        
        return MedicineWithAlternatives(
            brand_name=medicine.brand_name,
            brand_details=medicine,
            generic_alternatives=alternatives,
            source="llm"
        )
