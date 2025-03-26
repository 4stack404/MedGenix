import 'dotenv/config';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Test coordinates (New York City)
const latitude = 40.7128;
const longitude = -74.0060;

async function testPlacesApi() {
  try {
    console.log('Testing Google Places API...');
    console.log('API Key:', GOOGLE_MAPS_API_KEY);
    
    // Call Google Places API to find nearby pharmacies
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${latitude},${longitude}`,
        radius: 5000,
        type: 'pharmacy',
        keyword: 'pharmacy medicine medical drugs',
        key: GOOGLE_MAPS_API_KEY
      }
    });
    
    const { results, status } = response.data;
    
    console.log('API Status:', status);
    console.log('Number of results:', results?.length || 0);
    
    if (results && results.length > 0) {
      console.log('First result:', {
        name: results[0].name,
        place_id: results[0].place_id,
        vicinity: results[0].vicinity
      });
    }
  } catch (error) {
    console.error('Error testing Places API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPlacesApi(); 