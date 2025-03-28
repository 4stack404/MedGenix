import React, { useState, useEffect } from 'react';
import { Box, keyframes, Typography } from '@mui/material';
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
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

const TipText = styled(Typography)(({ theme }) => ({
  maxWidth: '500px',
  marginTop: theme.spacing(3),
  textAlign: 'center',
  color: '#006666',
  fontWeight: '500',
  fontSize: '0.9rem',
  fontStyle: 'italic',
  animation: `${fadeInOut} 10s ease-in-out forwards`,
}));

// Tips and facts data
const tipsAndFacts = [
  // Do you know facts
  "Do you know? MedGenix uses advanced OCR technology to scan handwritten prescriptions, making it easier for users to digitize their medical information without manual entry.",
  "Do you know? The name \"MedGenix\" is a combination of \"Med\" (for medicine) and \"Genix\" (related to generics), highlighting the platform's focus on generic medicine alternatives.",
  "Do you know? MedGenix can help users save up to 80% on prescription costs by identifying equivalent generic alternatives to branded medications.",
  "Do you know? The platform uses AI algorithms to analyze prescriptions and provide real-time price comparisons across multiple pharmacies in your area.",
  "Do you know? MedGenix features a location-based service that can help users find the nearest generic medicine stores, making affordable healthcare more accessible.",
  "Do you know? The website's color scheme of teal and green was specifically chosen to evoke feelings of health, tranquility, and trust—colors commonly associated with healthcare and wellness.",
  "Do you know? MedGenix's interface is designed to be accessible to users of all ages, with special consideration for elderly users who may be less familiar with digital platforms.",
  "Do you know? The platform is available in multiple languages, making it accessible to diverse communities and ensuring healthcare information is understood correctly.",
  "Do you know? MedGenix maintains a comprehensive database of medications, their generic alternatives, and potential interactions, which is regularly updated with the latest pharmaceutical information.",
  "Do you know? The timeline-style layout in the \"About Us\" section was specifically designed to tell the company's story in an engaging, visually appealing way.",
  "Do you know? MedGenix was developed in response to research showing that many patients don't realize generic alternatives to their prescribed medications exist or where to find them.",
  "Do you know? The platform includes educational resources about generic medicines to help users understand how they compare to brand-name options in terms of efficacy and safety.",
  "Do you know? MedGenix implements stringent privacy and security measures to protect sensitive medical information, complying with healthcare data protection standards.",
  "Do you know? The platform's prescription scanning feature works with both digital and physical prescriptions, giving users flexibility in how they upload their medical information.",
  "Do you know? MedGenix's user interface undergoes regular usability testing to ensure that the medicine comparison process is intuitive and stress-free for all users.",
  
  // Tips
  "Tip: Always ask for generic medicines instead of branded ones— they have the same active ingredients but cost up to 90% less.",
  "Tip: Compare medicine prices across different pharmacies. The same drug can have widely different prices depending on where you buy it.",
  "Tip: Don't fall for pharmacy tricks! Expensive branded medicines are placed at eye level, while cheaper generics are often hidden on lower shelves.",
  "Tip: Read your prescription carefully. Poor handwriting by doctors is a common cause of medication errors. Digital prescriptions are always safer.",
  "Tip: Always check the composition, not just the brand name. Two medicines with different names might contain the same ingredients at vastly different prices.",
  "Tip: Pharmacies sometimes push expensive medicines instead of offering cheaper alternatives. Always ask if a lower-cost generic is available.",
  "Tip: Store medicines properly—some require refrigeration, while others must be kept in a dry, cool place to remain effective.",
  "Tip: Never self-prescribe! Even if you think you know what's wrong, taking the wrong medicine can be dangerous. Always consult a doctor.",
  "Tip: Follow dosage instructions strictly. Taking too much or too little can make the medicine ineffective or even harmful.",
  "Tip: Keep track of your prescription history. This helps avoid duplicate medications and allows your doctor to monitor your treatment effectively.",
  "Tip: Some medicines should not be taken together. Always inform your doctor about any medications or supplements you're already using.",
  "Tip: Timing matters! Some medications must be taken before meals, while others work best after food. Read the instructions carefully.",
  "Tip: Be careful with over-the-counter (OTC) drugs. Just because you don't need a prescription doesn't mean they're risk-free.",
  "Tip: Check for counterfeit medicines, especially when buying online. Always purchase from trusted pharmacies and look for proper labeling and packaging.",
  "Tip: Use technology to your advantage! Platforms like MedGenix can scan prescriptions, compare prices, and locate nearby pharmacies, making medicine shopping easier.",
  
  // Did you know facts
  "Did you know? Generic medicines are NOT cheap copies! They contain the exact same active ingredients as branded medicines but cost up to 90% less.",
  "Did you know? The price difference between branded and generic medicines mainly comes from branding and marketing costs, not the medicine itself.",
  "Did you know? Some generic medicines are manufactured in the same factory as their expensive branded counterparts.",
  "Did you know? The FDA requires generics to be just as effective as their branded versions, with the same strength, dosage, and performance.",
  "Did you know? India is known as the \"Pharmacy of the World,\" supplying over 40% of generic medicines used in the USA and Europe.",
  "Did you know? The first generic drug law (Hatch-Waxman Act) was passed in 1984, making generics more accessible to the public.",
  "Did you know? The global generic medicine market is worth over $400 billion and continues to grow rapidly.",
  "Did you know? Doctors in many countries are encouraged to prescribe generic medicines to make healthcare more affordable.",
  "Did you know? Some branded medicines were originally generic drugs before being patented under a new name.",
  "Did you know? A medicine's patent lasts 20 years—after that, any company can make a generic version at a much lower price.",
  "Did you know? Between 80-90% of all prescriptions in the U.S. are filled with generic medicines.",
  "Did you know? Pharmacies sometimes hide cheaper generic options to encourage customers to buy expensive branded drugs.",
  "Did you know? Doctors don't always write generic names on prescriptions—pharmaceutical companies often influence their choices.",
  "Did you know? Some medicines have over 100 different generic versions, and choosing the right one can save patients thousands of dollars per year.",
  "Did you know? A single medicine can have different prices in different areas, sometimes varying by up to 500%."
];

const LoadingAnimation = ({ text = 'Loading...' }) => {
  const [currentTip, setCurrentTip] = useState('');
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  
  // This will run every time the component is mounted
  useEffect(() => {
    // Get a list of available tips that aren't in the recent history
    const getFilteredTips = () => {
      // Create a new array to avoid modifying the original
      const availableTips = [...tipsAndFacts];
      
      // Use sessionStorage to keep track of recent tips across renders
      const recentTipsJSON = sessionStorage.getItem('recentTips');
      const recentTips = recentTipsJSON ? JSON.parse(recentTipsJSON) : [];
      
      // Filter out recently shown tips if possible
      if (recentTips.length > 0 && recentTips.length < availableTips.length - 5) {
        return availableTips.filter(tip => !recentTips.includes(tip));
      }
      
      return availableTips;
    };
    
    // Get initial tip
    const filteredTips = getFilteredTips();
    const initialIndex = Math.floor(Math.random() * filteredTips.length);
    const initialTip = filteredTips[initialIndex];
    
    // Update recent tips in sessionStorage
    const recentTipsJSON = sessionStorage.getItem('recentTips');
    const recentTips = recentTipsJSON ? JSON.parse(recentTipsJSON) : [];
    const updatedRecentTips = [...recentTips, initialTip].slice(-5);
    sessionStorage.setItem('recentTips', JSON.stringify(updatedRecentTips));
    
    setCurrentTip(initialTip);
    
    // Set up interval to change tips every 7 seconds
    const interval = setInterval(() => {
      setShowTip(false);
      
      // Wait for fade out animation to complete
      setTimeout(() => {
        // Get updated filtered tips
        const updatedFilteredTips = getFilteredTips();
        // Get a new random tip
        const newIndex = Math.floor(Math.random() * updatedFilteredTips.length);
        const newTip = updatedFilteredTips[newIndex];
        
        // Update recent tips in sessionStorage
        const currentRecentTipsJSON = sessionStorage.getItem('recentTips');
        const currentRecentTips = currentRecentTipsJSON ? JSON.parse(currentRecentTipsJSON) : [];
        const newRecentTips = [...currentRecentTips, newTip].slice(-5);
        sessionStorage.setItem('recentTips', JSON.stringify(newRecentTips));
        
        setCurrentTip(newTip);
        setTipIndex(prevIndex => prevIndex + 1);
        setShowTip(true);
      }, 500); // Wait for the fade out animation
    }, 7000); // Change every 7 seconds
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

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
      {showTip && currentTip && (
        <TipText key={tipIndex}>
          {currentTip}
        </TipText>
      )}
    </LoadingContainer>
  );
};

export default LoadingAnimation;
