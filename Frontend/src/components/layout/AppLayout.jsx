import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import LoadingAnimation from '../common/LoadingAnimation';

/**
 * Custom hook to check if any loading sources are active
 * @returns {boolean} True if any loading source is active
 */
export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Initialize loading sources if not already done
    if (!window.loadingSources) {
      window.loadingSources = {};
    }
    
    // Create a function to update loading state
    const updateLoadingState = () => {
      const sources = window.loadingSources;
      const anyLoading = Object.values(sources).some(loading => loading === true);
      setIsLoading(anyLoading);
    };
    
    // Store the function globally so other components can trigger updates
    window.updateLoadingState = updateLoadingState;
    
    // Initial check
    updateLoadingState();
    
    // Cleanup
    return () => {
      window.updateLoadingState = null;
    };
  }, []);
  
  return isLoading;
};

/**
 * AppLayout component that wraps the application content
 * Shows loading animation when any loading source is active
 */
const AppLayout = ({ children }) => {
  const isLoading = useLoading();
  
  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            bgcolor: 'background.default'
          }}
        >
          <LoadingAnimation />
        </Box>
      ) : (
        <>
          <Header />
          <Box component="main" sx={{ minHeight: 'calc(100vh - 140px)' }}>
            {children}
          </Box>
          <Footer />
        </>
      )}
    </>
  );
};

export default AppLayout;
