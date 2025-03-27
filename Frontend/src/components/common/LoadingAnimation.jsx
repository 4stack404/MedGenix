import React from 'react';
import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Loading animation component displayed during page loading
 * In a production app, this could use Lottie animations
 */

// Define simplified keyframes for the animations
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 4px rgba(0, 128, 128, 0.2));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 6px rgba(0, 128, 128, 0.3));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 4px rgba(0, 128, 128, 0.2));
  }
`;

const gradientRotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled components with optimized properties
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '180px',
  position: 'relative',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80px',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const GradientSpinner = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: `conic-gradient(
    from 0deg,
    #008080,
    #3a9b9b,
    #8aedb9,
    #3a9b9b,
    #008080
  )`,
  animation: `${gradientRotateAnimation} 1.2s linear infinite`,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: ' 5%',
    borderRadius: '50%',
    background: '#fff',
  }
}));

const Logo = styled('img')(({ theme }) => ({
  width: '50%',
  height: '50%',
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
  zIndex: 2,
  position: 'relative',
}));

const LoadingText = styled(Box)(({ theme }) => ({
  color: '#008080', // Teal color directly applied
  fontSize: '0.9rem',
  fontWeight: 500,
  marginTop: theme.spacing(1.5),
  textAlign: 'center',
  opacity: 0.9,
}));

const LoadingAnimation = ({ text = 'Loading...' }) => {
  return (
    <LoadingContainer>
      <LogoContainer>
        <GradientSpinner />
        <Logo 
          src="/images/MedGenix Logo.png" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/medgenix-logo.svg";
          }}
          alt="MedGenix Logo"
        />
      </LogoContainer>
      <LoadingText>
        {text}
      </LoadingText>
    </LoadingContainer>
  );
};

export default LoadingAnimation;
