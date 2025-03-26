import { identifyGenericPharmacy } from './pharmacyService';

/**
 * Transforms raw pharmacy API data into a consistent format for map display
 * 
 * @param {Array} apiPharmacies - The raw pharmacy data from API
 * @returns {Array} - Transformed pharmacy data ready for map display
 */
export const transformPharmacyData = (apiPharmacies) => {
  if (!apiPharmacies || !Array.isArray(apiPharmacies)) {
    console.warn('Invalid pharmacy data received:', apiPharmacies);
    return [];
  }
  
  console.log('Transforming pharmacy data:', apiPharmacies.length, 'pharmacies');
  // Log the first pharmacy for debugging
  if (apiPharmacies.length > 0) {
    console.log('Sample pharmacy data:', JSON.stringify(apiPharmacies[0], null, 2));
  }
  
  const transformed = apiPharmacies.map(pharmacy => {
    // Handle case where pharmacy is already transformed
    if (pharmacy.position && pharmacy.position.lat && pharmacy.position.lng) {
      return {
        ...pharmacy,
        isGeneric: pharmacy.isGeneric !== undefined 
          ? pharmacy.isGeneric 
          : identifyGenericPharmacy(pharmacy)
      };
    }
    
    // Check if we have location data in the expected format
    if (!pharmacy.geometry || !pharmacy.geometry.location) {
      console.warn('Pharmacy missing geometry data:', pharmacy);
      return null;
    }
    
    // Create properly formatted pharmacy object for the map component
    return {
      id: pharmacy.place_id || `generated-${Math.random().toString(36).substr(2, 9)}`,
      name: pharmacy.name || 'Unnamed Pharmacy',
      vicinity: pharmacy.vicinity || 'Address not available',
      // Position is required for map markers
      position: {
        lat: parseFloat(pharmacy.geometry.location.lat),
        lng: parseFloat(pharmacy.geometry.location.lng)
      },
      // Additional properties
      rating: pharmacy.rating,
      userRatingsTotal: pharmacy.user_ratings_total,
      types: pharmacy.types,
      photoReference: pharmacy.photos?.[0]?.photo_reference,
      isGeneric: pharmacy.isGeneric !== undefined 
        ? pharmacy.isGeneric 
        : identifyGenericPharmacy(pharmacy),
      isSimulated: pharmacy.place_id?.includes('simulated') || false
    };
  }).filter(Boolean); // Remove null items
  
  // Log any generic pharmacies found
  const genericPharmacies = transformed.filter(p => p.isGeneric);
  console.log(`Found ${genericPharmacies.length} generic pharmacies`);
  
  if (genericPharmacies.length > 0) {
    console.log('Generic pharmacies:', genericPharmacies.map(p => p.name));
  }
  
  return transformed;
};

export default transformPharmacyData; 