import json
import os
from datetime import datetime
from typing import Dict, Any

class CacheManager:
    def __init__(self, cache_file: str = "generics_cache.json"):
        self.cache_file = cache_file
        self.cache = self._load_cache()
        
    def _load_cache(self) -> Dict[str, Any]:
        """Load cache from file if it exists."""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading cache: {e}")
                return {}
        return {}
    
    def _save_cache(self) -> None:
        """Save cache to file."""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump(self.cache, f)
        except Exception as e:
            print(f"Error saving cache: {e}")
    
    def get(self, medicine_name: str) -> Dict[str, Any]:
        """Get cached generic alternatives for a medicine."""
        normalized_name = medicine_name.lower().strip()
        return self.cache.get(normalized_name)
    
    def set(self, medicine_name: str, data: Dict[str, Any], source: str) -> None:
        """Set generic alternatives for a medicine in the cache."""
        normalized_name = medicine_name.lower().strip()
        self.cache[normalized_name] = {
            "data": data,
            "source": source,
            "timestamp": datetime.now().isoformat()
        }
        self._save_cache()
