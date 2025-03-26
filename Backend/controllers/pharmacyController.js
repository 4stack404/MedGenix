import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from '@googlemaps/google-maps-services-js';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure environment variables are loaded
dotenv.config();

// Get the Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Setup logging
const setupLogging = () => {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return path.join(logDir, 'pharmacy-api.log');
};

const logPath = setupLogging();

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;
  
  console.log(message);
  
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

const client = new Client({});

// Keywords that might indicate a generic pharmacy
const GENERIC_KEYWORDS = [
  'generic', 'affordable', 'discount', 'low cost', 'budget', 
  'cheap', 'inexpensive', 'economical', 'reasonable',
  'wholesale', 'bulk', 'public', 'government', 'subsidized'
];

// Function to check if a pharmacy is likely to be generic
const isGenericPharmacy = (pharmacy) => {
  if (!pharmacy) return false;
  
  const nameAndVicinity = `${pharmacy.name} ${pharmacy.vicinity || ''} ${pharmacy.types?.join(' ') || ''}`.toLowerCase();
  
  return GENERIC_KEYWORDS.some(keyword => nameAndVicinity.includes(keyword.toLowerCase())) ||
         (pharmacy.rating && pharmacy.rating < 3.5) ||
         (pharmacy.types && pharmacy.types.includes('health'));
};

/**
 * Controller to get nearby pharmacies using Google Places API
 */
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    logToFile(`Pharmacy API request received - lat: ${lat}, lng: ${lng}`);
    
    if (!lat || !lng) {
      logToFile('Missing required parameters: lat, lng');
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }

    // Use Google Places API key for places search
    if (!GOOGLE_PLACES_API_KEY) {
      logToFile('Google Places API key is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }
    
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const params = {
        location: `${lat},${lng}`,
        radius: radius,
        type: 'pharmacy',
        keyword: 'pharmacy',
        key: GOOGLE_PLACES_API_KEY
      };
      
      logToFile(`Making API request to Places API with params: ${JSON.stringify({...params, key: '***'})}`);
      
      const response = await axios.get(url, {
        params,
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      logToFile(`Places API Response: ${JSON.stringify(response.data)}`);
      
      const { results, status, error_message } = response.data;
      
      if (status === 'REQUEST_DENIED') {
        logToFile(`Places API request denied: ${error_message}`);
        // Return simulated data for development
        const simulatedData = generateSimulatedPharmacies(parseFloat(lat), parseFloat(lng));
        return res.json({
          success: true,
          pharmacies: simulatedData,
          message: 'Using simulated data due to API configuration'
        });
      }
      
      if (status !== 'OK' && status !== 'ZERO_RESULTS') {
        logToFile(`Google Places API error: ${status} - ${error_message || 'No error message'}`);
        throw new Error(`Google Places API error: ${status}`);
      }
      
      if (status === 'ZERO_RESULTS' || !results?.length) {
        logToFile('No pharmacies found in the area');
        return res.json({
          success: true,
          pharmacies: [],
          message: 'No pharmacies found in this area'
        });
      }
      
      // Process and enhance the results
      const processedResults = results.map(pharmacy => ({
        ...pharmacy,
        isGeneric: isGenericPharmacy(pharmacy),
        geometry: {
          ...pharmacy.geometry,
          location: {
            lat: pharmacy.geometry.location.lat,
            lng: pharmacy.geometry.location.lng
          }
        }
      }));
      
      logToFile(`Found ${processedResults.length} pharmacies`);
      
      return res.json({
        success: true,
        pharmacies: processedResults
      });
      
    } catch (apiError) {
      logToFile(`Places API Error: ${apiError.message}`);
      if (apiError.response) {
        logToFile(`API Error Response: ${JSON.stringify(apiError.response.data)}`);
      }
      
      // Return simulated data as fallback
      const simulatedData = generateSimulatedPharmacies(parseFloat(lat), parseFloat(lng));
      return res.json({
        success: true,
        pharmacies: simulatedData,
        message: 'Using simulated data due to API error'
      });
    }
  } catch (error) {
    logToFile(`Server Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby pharmacies',
      error: error.message
    });
  }
};

/**
 * Controller to get details about a specific pharmacy
 */
export const getPharmacyDetails = async (req, res) => {
  try {
    const { placeId } = req.query;
    
    if (!placeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Place ID is required' 
      });
    }
    
    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Google Maps API key is not configured' 
      });
    }

    try {
      const response = await client.placeDetails({
        params: {
          place_id: placeId,
          key: GOOGLE_MAPS_API_KEY,
          fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'reviews', 'website', 'photos']
        }
      });

      return res.json({
        success: true,
        pharmacy: response.data.result
      });
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching pharmacy details',
        error: error.message 
      });
    }
  } catch (error) {
    console.error('Error in getPharmacyDetails:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Generate simulated pharmacy data for development when the API key is not working
 */
function generateSimulatedPharmacies(lat, lng) {
  // Create an array of simulated pharmacies around the given location
  // Use default coordinates if invalid input
  lat = isNaN(lat) ? 0 : lat;
  lng = isNaN(lng) ? 0 : lng;
  
  console.log(`Generating simulated pharmacies around: ${lat}, ${lng}`);
  
  return [
    {
      place_id: 'simulated-1',
      name: 'City Generic Pharmacy',
      vicinity: '123 Main St, Downtown',
      geometry: {
        location: { 
          lat: lat + 0.008, 
          lng: lng + 0.005 
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
      place_id: 'simulated-2',
      name: 'MedPlus Pharmacy',
      vicinity: '456 Oak Ave, Westside',
      geometry: {
        location: { 
          lat: lat - 0.006, 
          lng: lng + 0.009 
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
      place_id: 'simulated-3',
      name: 'Discount Medical Supplies',
      vicinity: '789 Pine Blvd, Eastside',
      geometry: {
        location: { 
          lat: lat + 0.012, 
          lng: lng - 0.007 
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
      place_id: 'simulated-4',
      name: 'Wellness Pharmacy',
      vicinity: '321 Elm St, Northside',
      geometry: {
        location: { 
          lat: lat - 0.009, 
          lng: lng - 0.008 
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
      place_id: 'simulated-5',
      name: 'Government Medical Store',
      vicinity: '555 Public Rd, Central District',
      geometry: {
        location: { 
          lat: lat + 0.003, 
          lng: lng + 0.015 
        }
      },
      rating: 3.5,
      user_ratings_total: 112,
      types: ['pharmacy', 'health', 'government'],
      photos: [{
        photo_reference: 'simulated-photo-5'
      }]
    },
    {
      place_id: 'simulated-6',
      name: 'Apollo Pharmacy',
      vicinity: '777 Market St, Business District',
      geometry: {
        location: { 
          lat: lat - 0.015, 
          lng: lng + 0.002 
        }
      },
      rating: 4.8,
      user_ratings_total: 256,
      types: ['pharmacy', 'health', 'store'],
      photos: [{
        photo_reference: 'simulated-photo-6'
      }]
    },
    {
      place_id: 'simulated-7',
      name: 'Affordable Meds',
      vicinity: '888 Economy Lane, Suburb',
      geometry: {
        location: { 
          lat: lat + 0.018, 
          lng: lng - 0.012 
        }
      },
      rating: 4.0,
      user_ratings_total: 67,
      types: ['pharmacy', 'health', 'store'],
      photos: [{
        photo_reference: 'simulated-photo-7'
      }]
    }
  ];
}

// Search for nearby pharmacies
export const searchNearbyPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await client.placesNearby({
      params: {
        location: { lat: latitude, lng: longitude },
        radius: radius,
        type: 'pharmacy',
        key: GOOGLE_PLACES_API_KEY
      }
    });

    // Process results and identify generic pharmacies
    const processedPharmacies = response.data.results.map(place => ({
      ...place,
      isGeneric: isGenericPharmacy(place)
    }));

    res.json(processedPharmacies);
  } catch (error) {
    console.error('Error searching pharmacies:', error);
    res.status(500).json({ error: 'Failed to search for pharmacies' });
  }
}; 