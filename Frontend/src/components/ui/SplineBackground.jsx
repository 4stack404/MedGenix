import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import Spline from '@splinetool/react-spline';

const SplineBackground = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handle successful load
  const handleSplineLoad = () => {
    setTimeout(() => setLoading(false), 800); // Short delay for smoother transition
  };

  // Handle load error
  const handleSplineError = () => {
    console.error('Failed to load Spline scene');
    setError(true);
    setLoading(false);
  };

  // Set a timeout to avoid long loading times
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 15000); // 15 seconds timeout

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh', 
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(248, 249, 250, 0.15)', // More transparent background color
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress color="primary" />
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Loading 3D Experience...
          </Box>
        </Box>
      )}

      {/* Spline 3D scene container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          opacity: loading ? 0 : 1,
          transition: 'opacity 1s ease',
        }}
      >
        <Spline 
          scene="https://prod.spline.design/m1oA04bJaPt6H7wF/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
        />
      </Box>
      
      {/* Very subtle gradient overlay to ensure content readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 70%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default SplineBackground;
