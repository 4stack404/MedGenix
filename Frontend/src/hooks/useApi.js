import { useState, useCallback } from 'react';
import axios from 'axios';
import { useLoading } from '../context/LoadingContext';

/**
 * Custom hook for handling API requests with integrated loading state
 */
const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { showLoading, hideLoading } = useLoading();

  /**
   * Make a GET request
   * @param {string} url - The API endpoint
   * @param {Object} options - Request options
   * @param {string} loadingText - Custom loading text
   */
  const get = useCallback(async (url, options = {}, loadingText = 'Loading...') => {
    setError(null);
    showLoading(loadingText);
    
    try {
      const response = await axios.get(url, options);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  /**
   * Make a POST request
   * @param {string} url - The API endpoint
   * @param {Object} data - The payload
   * @param {Object} options - Request options
   * @param {string} loadingText - Custom loading text
   */
  const post = useCallback(async (url, payload, options = {}, loadingText = 'Processing...') => {
    setError(null);
    showLoading(loadingText);
    
    try {
      const response = await axios.post(url, payload, options);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  /**
   * Make a PUT request
   * @param {string} url - The API endpoint
   * @param {Object} data - The payload
   * @param {Object} options - Request options
   * @param {string} loadingText - Custom loading text
   */
  const put = useCallback(async (url, payload, options = {}, loadingText = 'Updating...') => {
    setError(null);
    showLoading(loadingText);
    
    try {
      const response = await axios.put(url, payload, options);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  /**
   * Make a DELETE request
   * @param {string} url - The API endpoint
   * @param {Object} options - Request options
   * @param {string} loadingText - Custom loading text
   */
  const del = useCallback(async (url, options = {}, loadingText = 'Deleting...') => {
    setError(null);
    showLoading(loadingText);
    
    try {
      const response = await axios.delete(url, options);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return { data, error, get, post, put, delete: del };
};

export default useApi; 