import axios from 'axios';

// Using local proxy configured in vite.config.js
const API_URL = '/api';

// Get medicine information by name using POST request
export const getMedicineInfo = async (medicineName) => {
  try {
    // Extract only the first word of the medicine name
    const firstWord = medicineName.split(' ')[0];
    console.log('Using first word of medicine name:', firstWord);
    
    const response = await axios.post(`${API_URL}/medicine_info`, {
      name: firstWord
    });
    console.log('Medicine info API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching medicine info:', error);
    throw error;
  }
};

// Get generic medicine by ID
export const getGenericMedicineById = async (id) => {
  try {
    // Using the medicine_info endpoint with the ID as the medicine name
    const response = await getMedicineInfo(id);
    console.log('Generic medicine API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching generic medicine:', error);
    throw error;
  }
};

// Get branded medicine by ID
export const getBrandedMedicineById = async (id) => {
  try {
    // Using the medicine_info endpoint with the ID as the medicine name
    const response = await getMedicineInfo(id);
    console.log('Branded medicine API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching branded medicine:', error);
    throw error;
  }
};

// Search medicines by name
export const searchMedicinesByName = async (name) => {
  try {
    // For search, we also use the medicine_info endpoint
    const response = await getMedicineInfo(name);
    
    // The API returns a single medicine object, but our search UI expects an array
    // So we wrap it in an array
    return [
      {
        id: name,
        name: response.medicine_name || name,
        is_generic: true, // Assuming all medicines from this API are generic
        manufacturer: response.manufacturer || 'Generic',
        price: response.price || 0,
        // Add any other fields needed for display
      }
    ];
  } catch (error) {
    console.error('Error searching medicines:', error);
    throw error;
  }
};

export default {
  getMedicineInfo,
  getGenericMedicineById,
  getBrandedMedicineById,
  searchMedicinesByName
}; 