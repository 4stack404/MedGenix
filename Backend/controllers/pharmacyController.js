import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure environment variables are loaded
dotenv.config();

// Get the Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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

/**
 * Controller to get nearby pharmacies using Google Places API
 */
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius, type } = req.query;
    
    logToFile(`Pharmacy API request received - lat: ${lat}, lng: ${lng}`);
    logToFile(`Environment variables loaded: NODE_ENV=${process.env.NODE_ENV}`);
    logToFile(`Google Maps API Key available: ${GOOGLE_MAPS_API_KEY ? 'Yes' : 'No'}`);
    
    if (!lat || !lng) {
      logToFile('Missing required parameters: lat, lng');
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }
    
    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      logToFile('Google Maps API key is not defined in environment variables');
      
      // Fall back to simulated data
      logToFile('Falling back to simulated pharmacy data due to missing API key');
      const simulatedPharmacies = generateSimulatedPharmacies(parseFloat(lat), parseFloat(lng));
      
      return res.json({
        success: true,
        pharmacies: simulatedPharmacies,
        note: 'Using simulated data due to API configuration issues'
      });
    }
    
    logToFile(`Using coordinates: lat=${lat}, lng=${lng}`);
    logToFile(`API Key (first 10 chars): ${GOOGLE_MAPS_API_KEY.substring(0, 10)}...`);
    
    try {
      // Construct the URL for debugging
      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const params = {
        location: `${lat},${lng}`,
        radius: radius || 5000,
        type: type || 'pharmacy',
        keyword: 'pharmacy medicine medical drugs generic',
        key: GOOGLE_MAPS_API_KEY
      };
      
      logToFile(`Making API request to: ${url}`);
      logToFile(`With params: ${JSON.stringify({
        ...params,
        key: params.key.substring(0, 10) + '...' // Mask most of the key for security
      })}`);
      
      // Call Google Places API to find nearby pharmacies
      const response = await axios.get(url, {
        params,
        timeout: 15000 // 15 second timeout
      });
      
      logToFile(`API Response status: ${response.status}`);
      logToFile(`Google Places API status: ${response.data.status}`);
      
      const { results, status, error_message } = response.data;
      
      // Log the raw response for debugging
      if (status !== 'OK') {
        logToFile(`API Error Response: ${JSON.stringify(response.data)}`);
      } else {
        logToFile(`API returned ${results.length} results`);
      }
      
      if (status !== 'OK') {
        logToFile(`Google Places API returned status: ${status}`);
        logToFile(`Error message: ${error_message || 'No specific error message provided'}`);
        
        // If the API key is invalid or unauthorized
        if (status === 'REQUEST_DENIED' || status === 'INVALID_REQUEST') {
          // Fall back to simulated data for development
          logToFile('Falling back to simulated pharmacy data due to API key issues');
          
          // Generate simulated data based on the provided coordinates
          const simulatedPharmacies = generateSimulatedPharmacies(parseFloat(lat), parseFloat(lng));
          
          return res.json({
            success: true,
            pharmacies: simulatedPharmacies,
            note: 'Using simulated data due to API key issues: ' + error_message
          });
        }
        
        // Handle zero results case
        if (status === 'ZERO_RESULTS') {
          logToFile('API returned ZERO_RESULTS');
          return res.json({
            success: true,
            pharmacies: [],
            message: 'No pharmacies found in this area'
          });
        }
        
        return res.status(500).json({ 
          success: false, 
          message: `Google Places API error: ${status}`,
          details: error_message || 'No details available'
        });
      }
      
      logToFile(`Found ${results.length} real pharmacies from Google API`);
      
      // Identify which pharmacies are likely generic
      const processedResults = results.map(pharmacy => {
        const isGeneric = identifyGenericPharmacy(pharmacy);
        return {
          ...pharmacy,
          isGeneric
        };
      });
      
      // Log generic pharmacies
      const genericPharmacies = processedResults.filter(p => p.isGeneric);
      logToFile(`Found ${genericPharmacies.length} potential generic pharmacies:`);
      genericPharmacies.forEach(pharmacy => {
        logToFile(`- ${pharmacy.name} (${pharmacy.vicinity})`);
      });
      
      // Return the results
      return res.json({
        success: true,
        pharmacies: processedResults
      });
    } catch (apiError) {
      logToFile(`Error calling Google Places API: ${apiError.message}`);
      if (apiError.response) {
        logToFile(`API Error Response data: ${JSON.stringify(apiError.response.data)}`);
        logToFile(`API Error Response status: ${apiError.response.status}`);
      }
      
      // Fall back to simulated data for any API call errors
      logToFile('API call failed, falling back to simulated pharmacy data');
      const simulatedPharmacies = generateSimulatedPharmacies(parseFloat(lat), parseFloat(lng));
      
      return res.json({
        success: true,
        pharmacies: simulatedPharmacies,
        note: 'Using simulated data due to API connectivity issues: ' + apiError.message
      });
    }
  } catch (error) {
    logToFile(`Error fetching nearby pharmacies: ${error.message}`);
    
    // Always return a valid response even on server error
    try {
      const simulatedPharmacies = generateSimulatedPharmacies(
        parseFloat(req.query.lat || 0), 
        parseFloat(req.query.lng || 0)
      );
      
      return res.json({
        success: true,
        pharmacies: simulatedPharmacies,
        note: 'Using simulated data due to server error: ' + error.message
      });
    } catch (fallbackError) {
      // If even the fallback fails, return an error
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching nearby pharmacies',
        details: error.message 
      });
    }
  }
};

/**
 * Helper function to identify generic pharmacies
 */
function identifyGenericPharmacy(pharmacy) {
  // Keywords that might indicate a generic pharmacy
  const GENERIC_KEYWORDS = [
    'generic', 'affordable', 'discount', 'low cost', 'budget', 
    'cheap', 'inexpensive', 'economical', 'reasonable',
    'wholesale', 'bulk', 'public', 'government', 'subsidized',
    'apollo', 'jan aushadhi', 'janaushadhi', 'medplus'
  ];
  
  // Check if the pharmacy name or vicinity contains any generic keywords
  const nameAndVicinity = (
    (pharmacy.name || '') + ' ' + (pharmacy.vicinity || '')
  ).toLowerCase();
  
  return GENERIC_KEYWORDS.some(keyword => nameAndVicinity.includes(keyword));
}

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
      console.error('Google Maps API key is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'API configuration error: Missing API key'
      });
    }
    
    try {
      // Call Google Places API to get details about the pharmacy
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,types',
          key: GOOGLE_MAPS_API_KEY
        }
      });
      
      const { result, status, error_message } = response.data;
      
      if (status !== 'OK') {
        console.error(`Google Places API returned status: ${status}`);
        console.error('Error message:', error_message || 'No specific error message provided');
        
        // If the API key is invalid, return a simulated response for development
        if (status === 'REQUEST_DENIED') {
          const simulatedDetails = {
            name: 'Simulated Pharmacy',
            formatted_address: '123 Main St, Your City',
            formatted_phone_number: '+1 (555) 123-4567',
            website: 'https://example.com',
            rating: 4.5,
            user_ratings_total: 123,
            opening_hours: {
              open_now: true,
              weekday_text: [
                'Monday: 9:00 AM – 9:00 PM',
                'Tuesday: 9:00 AM – 9:00 PM',
                'Wednesday: 9:00 AM – 9:00 PM',
                'Thursday: 9:00 AM – 9:00 PM',
                'Friday: 9:00 AM – 9:00 PM',
                'Saturday: 10:00 AM – 8:00 PM',
                'Sunday: 10:00 AM – 6:00 PM'
              ]
            }
          };
          
          return res.json({
            success: true,
            details: simulatedDetails,
            note: 'Using simulated data due to API key issues'
          });
        }
        
        return res.status(500).json({ 
          success: false, 
          message: `Google Places API error: ${status}`,
          details: error_message || 'No details available'
        });
      }
      
      // Return the details
      return res.json({
        success: true,
        details: result
      });
    } catch (error) {
      console.error('Error fetching pharmacy details:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error fetching pharmacy details',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Error in getPharmacyDetails controller:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing pharmacy details request',
      details: error.message
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