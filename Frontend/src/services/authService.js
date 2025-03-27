import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with credentials
export const api = axios.create({
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
      // Ensure token is properly formatted
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Register new user
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Login with email and password
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.token) {
      // Ensure token is properly stored
      localStorage.setItem('token', response.data.token.trim());
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Send OTP for login
export const sendLoginOTP = async (email) => {
  try {
    const response = await api.post('/auth/send-login-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Verify OTP and login
export const verifyLoginOTP = async ({ email, otp }) => {
  try {
    const response = await api.post('/auth/verify-login-otp', { email, otp });
    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Send password reset OTP
export const sendPasswordResetOTP = async (email) => {
  try {
    const response = await api.post('/auth/send-reset-otp', { email });
    return response.data;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

// Reset password with OTP
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      email,
      otp,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Check authentication status
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'No token found' };
    }

    const response = await api.get('/auth/is-authenticated');
    if (response.data.success) {
      // Update token if a new one is provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token.trim());
      }
      return response.data;
    } else {
      localStorage.removeItem('token');
      return { success: false, message: 'Authentication failed' };
    }
  } catch (error) {
    console.error('Auth check error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Send email verification code
export const sendVerificationEmail = async () => {
  try {
    const response = await api.post('/auth/send-verification-email');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
};

// Verify email with OTP
export const verifyEmail = async (data) => {
  try {
    const response = await api.post('/auth/verify-email', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Network error' };
  }
}; 