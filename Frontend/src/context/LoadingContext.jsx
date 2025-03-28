import React, { createContext, useContext, useState } from 'react';
import { Box } from '@mui/material';
import LoadingAnimation from '../components/common/LoadingAnimation';

// Create context
const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  showLoading: () => {},
  hideLoading: () => {},
  loadingText: 'Loading...',
  setLoadingText: () => {},
  disableForPage: () => {},
  enableForPage: () => {},
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  // Maintain a set of disabled pages
  const [disabledPages, setDisabledPages] = useState(new Set(['dashboard']));

  // Show the loading animation
  const showLoading = (text, page) => {
    if (text) setLoadingText(text);
    
    // Don't show loading if current page is in disabled pages 
    // (page can be passed from the component to identify itself)
    if (page && disabledPages.has(page.toLowerCase())) {
      return;
    }
    
    setIsLoading(true);
  };

  // Hide the loading animation
  const hideLoading = () => {
    setIsLoading(false);
    setLoadingText('Loading...');
  };

  // Set loading state
  const setLoading = (loading, text, page) => {
    if (text) setLoadingText(text);
    
    // Don't show loading if current page is in disabled pages
    if (loading && page && disabledPages.has(page.toLowerCase())) {
      return;
    }
    
    setIsLoading(loading);
  };
  
  // Disable loading for a specific page
  const disableForPage = (page) => {
    if (!page) return;
    setDisabledPages(prev => {
      const newSet = new Set(prev);
      newSet.add(page.toLowerCase());
      return newSet;
    });
  };
  
  // Enable loading for a specific page
  const enableForPage = (page) => {
    if (!page) return;
    setDisabledPages(prev => {
      const newSet = new Set(prev);
      newSet.delete(page.toLowerCase());
      return newSet;
    });
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        showLoading,
        hideLoading,
        loadingText,
        setLoadingText,
        disableForPage,
        enableForPage,
      }}
    >
      {children}
      
      {/* Global loading overlay - simplified for performance */}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999,
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, rgba(0, 128, 128, 0.02) 0%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none',
            }
          }}
        >
          <LoadingAnimation text={loadingText} />
        </Box>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider; 