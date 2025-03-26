import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to Authorization header if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Upload prescription
export const uploadPrescription = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await api.post('/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Override for file upload
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Get user's prescriptions
export const getUserPrescriptions = async () => {
  try {
    const response = await api.get('/prescriptions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Get single prescription
export const getPrescription = async (id) => {
  try {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
}; 