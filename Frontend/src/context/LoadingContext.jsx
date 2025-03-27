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
});

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  // Show the loading animation
  const showLoading = (text) => {
    if (text) setLoadingText(text);
    setIsLoading(true);
  };

  // Hide the loading animation
  const hideLoading = () => {
    setIsLoading(false);
    setLoadingText('Loading...');
  };

  // Set loading state
  const setLoading = (loading, text) => {
    if (text) setLoadingText(text);
    setIsLoading(loading);
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