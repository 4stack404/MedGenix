import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:8000/api';

// Find nearby pharmacies function
export const findNearbyPharmacies = async (lat, lng, radius = 5000) => {
  console.log(`Finding pharmacies near: ${lat}, ${lng}`);
  
  try {
    // Validate input parameters
    if (!lat || !lng) {
      console.error('Invalid coordinates provided');
      return {
        success: false,
        message: 'Invalid coordinates provided',
        pharmacies: []
      };
    }
    
    // Make API request to our backend
    console.log(`Making request to ${API_URL}/pharmacies/nearby with lat=${lat}, lng=${lng}`);
    const response = await axios.get(`${API_URL}/pharmacies/nearby`, {
      params: { lat, lng, radius },
      timeout: 10000 // 10 second timeout
    });
    
    // Log the response for debugging
    console.log(`Got response with ${response.data?.pharmacies?.length || 0} pharmacies`);
    console.log('Response includes simulated data note:', response.data?.note ? 'Yes - ' + response.data.note : 'No');
    
    // Validate the response structure
    if (!response.data) {
      console.error('Empty response from API');
      return generateLocalSimulatedResponse(lat, lng, 'Empty API response');
    }
    
    // If the API returned an error or no success flag
    if (response.data.success === false) {
      console.error('API reported an error:', response.data.message);
      return generateLocalSimulatedResponse(lat, lng, response.data.message || 'API reported failure');
    }
    
    // Return data directly from the API
    // This will include any notes about simulated data from the backend
    return response.data;
  } catch (error) {
    // Handle network errors
    console.error('Error in pharmacy service:', error.message);
    
    // Generate simulated data locally as fallback
    return generateLocalSimulatedResponse(lat, lng, `Network error: ${error.message}`);
  }
};

// Helper function to identify generic pharmacies
export const identifyGenericPharmacy = (pharmacy) => {
  // Keywords that might indicate a generic pharmacy
  const GENERIC_KEYWORDS = [
    'generic', 'Generic', 'GENERIC', 'affordable', 'discount', 'low cost', 'budget', 
    'cheap', 'inexpensive', 'economical', 'reasonable',
    'wholesale', 'bulk', 'public', 'government', 'subsidized'
  ];
  
  // Check if the pharmacy name or vicinity contains any generic keywords
  const nameAndVicinity = (
    (pharmacy.name || '') + ' ' + (pharmacy.vicinity || '')
  ).toLowerCase();
  
  return GENERIC_KEYWORDS.some(keyword => nameAndVicinity.includes(keyword));
};

// Get details for a specific pharmacy
export const getPharmacyDetails = async (placeId) => {
  try {
    // Make API request to get pharmacy details
    const response = await axios.get(`${API_URL}/pharmacies/details`, {
      params: { placeId },
      timeout: 8000
    });
    
    // If the API returned an error
    if (!response.data || response.data.success === false) {
      throw new Error(response.data?.message || 'Failed to get pharmacy details');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching pharmacy details:', error);
    
    // Return a simple error object
    return {
      success: false,
      message: `Error fetching pharmacy details: ${error.message}`,
      details: null
    };
  }
};

// Generate simulated pharmacy data for frontend fallback
const generateLocalSimulatedResponse = (lat, lng, errorMessage) => {
  console.log(`Generating local simulated data due to error: ${errorMessage}`);
  
  const simulatedPharmacies = [
    {
      place_id: 'simulated-local-1',
      name: 'City Generic Pharmacy (Local)',
      vicinity: '123 Main St, Downtown',
      geometry: {
        location: { 
          lat: parseFloat(lat) + 0.008, 
          lng: parseFloat(lng) + 0.005 
        }
      },
      rating: 4.2,
      user_ratings_total: 156,
      types: ['pharmacy', 'health', 'store'],
      photos: [{
        photo_reference: 'simulated-photo-1'
      }]
    },
    {
      place_id: 'simulated-local-2',
      name: 'MedPlus Pharmacy (Local)',
      vicinity: '456 Oak Ave, Westside',
      geometry: {
        location: { 
          lat: parseFloat(lat) - 0.006, 
          lng: parseFloat(lng) + 0.009 
        }
      },
      rating: 4.7,
      user_ratings_total: 203,
      types: ['pharmacy', 'store', 'health'],
      photos: [{
        photo_reference: 'simulated-photo-2'
      }]
    },
    {
      place_id: 'simulated-local-3',
      name: 'Discount Medical Supplies (Local)',
      vicinity: '789 Pine Blvd, Eastside',
      geometry: {
        location: { 
          lat: parseFloat(lat) + 0.012, 
          lng: parseFloat(lng) - 0.007 
        }
      },
      rating: 3.9,
      user_ratings_total: 89,
      types: ['pharmacy', 'store', 'health'],
      photos: [{
        photo_reference: 'simulated-photo-3'
      }]
    },
    {
      place_id: 'simulated-local-4',
      name: 'Wellness Pharmacy (Local)',
      vicinity: '321 Elm St, Northside',
      geometry: {
        location: { 
          lat: parseFloat(lat) - 0.009, 
          lng: parseFloat(lng) - 0.008 
        }
      },
      rating: 4.5,
      user_ratings_total: 178,
      types: ['pharmacy', 'health', 'store'],
      photos: [{
        photo_reference: 'simulated-photo-4'
      }]
    },
    {
      place_id: 'simulated-local-5',
      name: 'Government Medical Store (Local)',
      vicinity: '555 Public Rd, Central District',
      geometry: {
        location: { 
          lat: parseFloat(lat) + 0.003, 
          lng: parseFloat(lng) + 0.015 
        }
      },
      rating: 3.5,
      user_ratings_total: 112,
      types: ['pharmacy', 'health', 'government'],
      photos: [{
        photo_reference: 'simulated-photo-5'
      }]
    }
  ];
  
  return {
    success: true,
    pharmacies: simulatedPharmacies,
    note: `Using locally simulated data due to API error: ${errorMessage}`
  };
}; 