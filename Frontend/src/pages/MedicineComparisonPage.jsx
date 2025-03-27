import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
  Alert,
  AlertTitle,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SavingsIcon from '@mui/icons-material/Savings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import InfoIcon from '@mui/icons-material/Info';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Keyframes animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 rgba(103, 194, 124, 0); }
  50% { box-shadow: 0 0 10px rgba(103, 194, 124, 0.3); }
  100% { box-shadow: 0 0 0 rgba(103, 194, 124, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledCard = styled(Card)(({ theme, variant }) => ({
  height: '100%',
  borderRadius: 16,
  transition: 'transform 0.3s ease, box-shadow 0.3s',
  position: 'relative',
  overflow: 'hidden',
  background: variant === 'generic' 
    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 248, 240, 0.95) 100%)' 
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 242, 248, 0.95) 100%)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: variant === 'generic' 
      ? '0 8px 16px rgba(103, 194, 124, 0.15), 0 3px 6px rgba(0, 0, 0, 0.05)' 
      : '0 8px 16px rgba(25, 118, 210, 0.15), 0 3px 6px rgba(0, 0, 0, 0.05)',
    '&::after': {
      opacity: 1,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: variant === 'generic' ? theme.palette.success.main : theme.palette.primary.main,
    opacity: 0.5,
    transition: 'opacity 0.3s',
  }
}));

const FloatingIcon = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `${pulse} 3s infinite ${delay}s ease-in-out`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 1,
}));

const GlowingCard = styled(Paper)(({ theme, color = 'primary' }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  background: color === 'success' 
    ? 'linear-gradient(135deg, #e4f3ea 0%, #ffffff 100%)' 
    : 'linear-gradient(135deg, #e4eef3 0%, #ffffff 100%)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  animation: `${glow} 3s infinite ease-in-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: color === 'success' 
      ? theme.palette.success.main 
      : theme.palette.primary.main,
  }
}));

const ShimmerButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  transform: 'translate3d(0, 0, 0)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transform: 'translateX(-100%)',
  },
  '&:hover::before': {
    animation: `${shimmer} 1.5s infinite`,
  }
}));

const SavingsChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)',
  color: 'white',
  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .2)',
  height: 28,
  padding: '0 12px',
}));

const PriceChip = styled(Typography)(({ theme, discounted }) => ({
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: 16,
  fontWeight: 'bold',
  background: discounted 
    ? 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)' 
    : 'linear-gradient(45deg, #005f5f 30%, #008080 90%)',
  color: 'white',
  boxShadow: discounted 
    ? '0 3px 5px 2px rgba(76, 175, 80, .2)' 
    : '0 3px 5px 2px rgba(0, 128, 128, .2)',
}));

const BrandAvatar = styled(Avatar)(({ theme, variant }) => ({
  width: 60,
  height: 60,
  backgroundColor: variant === 'generic' ? theme.palette.success.light : theme.palette.primary.light,
  color: '#fff',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  marginRight: theme.spacing(2),
}));

const MedicineComparisonPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [originalMedicines, setOriginalMedicines] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [error, setError] = useState(null);

  // Helper function to format prices as ranges
  const formatPriceRange = (price) => {
    if (!price) {
      // Return dummy price range if price is not available
      return "100-150";
    }
    
    // If price is already a range, return it as is
    if (price.includes('-')) return price;
    
    // Convert price to number if it's a string
    const priceNum = typeof price === 'string' ? parseFloat(price) : price;
    
    // Calculate a range (approximately ±10%)
    const min = Math.floor(priceNum * 0.9);
    const max = Math.ceil(priceNum * 1.1);
    
    return `${min}-${max}`;
  };

  useEffect(() => {
    const fetchGenericAlternatives = async () => {
      try {
        // Get medicines from session storage
        const medicinesData = sessionStorage.getItem('prescriptionMedicines');
        if (!medicinesData) {
          setError('No medicines found to compare. Please upload a prescription first.');
          setLoading(false);
          return;
        }

        // Get the prescription image from prescriptionData in sessionStorage
        const prescriptionData = JSON.parse(sessionStorage.getItem('prescriptionData') || '{}');
        console.log('Prescription Data:', prescriptionData);

        const medicines = JSON.parse(medicinesData);
        setOriginalMedicines(medicines);

        // Make API call to fetch generic alternatives
        const response = await axios.post(
          'https://medgenix-production.up.railway.app/api/generic-alternatives/',
          medicines
        );

        setComparisonResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching generic alternatives:', err);
        setError(
          err.response?.data?.message ||
          'Failed to fetch generic alternatives. Please try again.'
        );
        setLoading(false);
      }
    };

    fetchGenericAlternatives();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <GradientBackground
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
          }}
        >
          <Box sx={{ position: 'relative', mb: 4 }}>
            <CircularProgress 
              size={60} 
              thickness={3} 
              sx={{ color: 'primary.main' }} 
            />
          </Box>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              textAlign: 'center',
              color: 'primary.main',
              mb: 2
            }}
          >
            Finding Generic Alternatives
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ textAlign: 'center', maxWidth: 400, mx: 'auto' }}
          >
            We're comparing your medicines with affordable generic options that have the same active ingredients
          </Typography>
        </GradientBackground>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <GradientBackground
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          position: 'relative'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 6, position: 'relative', zIndex: 5 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mb: 3 }}
            >
              Back to Prescription
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  color: 'primary.main',
                  mb: 2
                }}
              >
                Save Money with Generic Alternatives
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto', 
                  mb: 4,
                  fontWeight: 400
                }}
              >
                Same ingredients, same effectiveness, lower prices
              </Typography>
            </Box>
          </Box>

          {error ? (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4, 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' 
              }}
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          ) : comparisonResults.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{ 
                mb: 4, 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' 
              }}
            >
              <AlertTitle>No Results</AlertTitle>
              No generic alternatives found for your medicines. Please try with different medicine names.
            </Alert>
          ) : (
            <Grid container spacing={4}>
              {/* Prescription sidebar - Left column with increased width */}
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    background: 'white',
                    position: 'sticky',
                    top: 24,
                    height: 'fit-content',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 600,
                      color: 'primary.dark',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <HealthAndSafetyIcon sx={{ mr: 1 }} />
                    Original Prescription
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Improved Prescription Image with better error handling */}
                  <Box 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      height: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {(() => {
                      // Get the actual prescription image from sessionStorage
                      const prescriptionData = JSON.parse(sessionStorage.getItem('prescriptionData') || '{}');
                      const imageUrl = prescriptionData?.imageUrl;
                      
                      if (imageUrl && imageUrl.startsWith('data:image/')) {
                        // Display the actual prescription image
                        return (
                          <img 
                            src={imageUrl} 
                            alt="Prescription" 
                            style={{ 
                              width: '100%', 
                              height: 'auto', 
                              display: 'block',
                              maxHeight: '400px',
                              objectFit: 'contain',
                              borderRadius: 8
                            }}
                            onError={(e) => {
                              console.error('Image failed to load');
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        );
                      } else {
                        // Fallback to a nice placeholder
                        return (
                          <Box sx={{ 
                            width: '100%', 
                            padding: 3, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <MedicalServicesIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                              Prescription image not available
                            </Typography>
                          </Box>
                        );
                      }
                    })()}
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                    Always consult your doctor before changing any medication.
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Medicine comparison cards - Right column with adjusted width */}
              <Grid item xs={12} md={8} lg={8}>
                <Grid container spacing={3}>
                  {comparisonResults.map((result, index) => (
                    <Grid item xs={12} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Paper
                          elevation={2}
                          sx={{ 
                            borderRadius: 4,
                            background: 'white',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
                            overflow: 'hidden',
                            mb: 3,
                          }}
                        >
                          {/* Comparison table */}
                          <Box sx={{ p: 0 }}>
                            {result.generic_alternatives.length === 0 ? (
                              <Grid container>
                                {/* Table header for medicine without alternatives */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={12} sx={{ 
                                      p: 2, 
                                      bgcolor: 'rgba(25, 118, 210, 0.05)',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      <MedicationIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        {result.brand_details.brand_name}
                                      </Typography>
                                      <Chip 
                                        label="No Generic Alternative"
                                        size="small"
                                        color="info"
                                        sx={{ 
                                          ml: 'auto',
                                          fontWeight: 'bold',
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Medicine Name Row */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={12} sx={{ p: 2 }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Medicine Name
                                      </Typography>
                                      <Box 
                                        component="button"
                                        onClick={() => navigate(`/medicine/${encodeURIComponent(result.brand_details.brand_name)}`)}
                                        sx={{ 
                                          cursor: 'pointer',
                                          background: 'none',
                                          border: 'none',
                                          padding: 0,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          fontFamily: 'inherit',
                                          transition: 'color 0.2s',
                                          '&:hover': {
                                            color: 'primary.main'
                                          }
                                        }}
                                      >
                                        <Typography variant="body1" sx={{ 
                                          fontWeight: 500,
                                          textAlign: 'left',
                                          color: 'inherit',
                                          textDecoration: 'underline',
                                          textUnderlineOffset: '2px',
                                          textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                                        }}>
                                          {result.brand_details.brand_name}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Price Row */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={12} sx={{ p: 2 }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Price Range
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PriceChip variant="body2" discounted={false} sx={{ fontSize: '0.8rem' }}>
                                          ₹{formatPriceRange(result.brand_details.price)}
                                        </PriceChip>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Manufacturer Row */}
                                {result.brand_details.manufacturer && (
                                  <Grid item xs={12}>
                                    <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                      <Grid item xs={12} sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                          Manufacturer
                                        </Typography>
                                        <Typography variant="body1">
                                          {result.brand_details.manufacturer || "Not specified"}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )}

                                {/* No Alternative Info Row */}
                                <Grid item xs={12}>
                                  <Grid container>
                                    <Grid item xs={12} sx={{ 
                                      p: 2, 
                                      bgcolor: 'rgba(224, 224, 224, 0.1)'
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <InfoIcon sx={{ color: 'info.main', mr: 1, fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'info.main' }}>
                                          No Generic Alternative Available
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                        This medicine doesn't have a generic alternative in our database. 
                                        This could be because it's a unique formulation, recently developed, 
                                        or contains ingredients that don't have generic equivalents yet. 
                                        Please consult your doctor for possible alternatives.
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            ) : (
                              <Grid container>
                                {/* Table header */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={5} sx={{ 
                                      p: 2, 
                                      bgcolor: 'rgba(25, 118, 210, 0.05)',
                                      borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      <MedicationIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                        Brand Medicine
                                      </Typography>
                                      {result.generic_alternatives.length > 0 && (
                                        <Chip 
                                          label={`Save ${result.generic_alternatives[0].savings_percentage || "up to 50%"}`}
                                          size="small"
                                          color="success"
                                          sx={{ 
                                            ml: 'auto',
                                            fontWeight: 'bold',
                                            fontSize: '0.75rem'
                                          }}
                                        />
                                      )}
                                    </Grid>
                                    <Grid item xs={7} sx={{ 
                                      p: 2, 
                                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      <LocalPharmacyIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                        Generic Alternative
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Medicine Name Row */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={5} sx={{ 
                                      p: 2, 
                                      borderRight: '1px solid rgba(0, 0, 0, 0.08)'
                                    }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Medicine Name
                                      </Typography>
                                      <Box 
                                        component="button"
                                        onClick={() => navigate(`/medicine/${encodeURIComponent(result.brand_details.brand_name)}`)}
                                        sx={{ 
                                          cursor: 'pointer',
                                          background: 'none',
                                          border: 'none',
                                          padding: 0,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          fontFamily: 'inherit',
                                          transition: 'color 0.2s',
                                          '&:hover': {
                                            color: 'primary.main'
                                          }
                                        }}
                                      >
                                        <Typography variant="body1" sx={{ 
                                          fontWeight: 500,
                                          textAlign: 'left',
                                          color: 'inherit',
                                          textDecoration: 'underline',
                                          textUnderlineOffset: '2px',
                                          textDecorationColor: 'rgba(0, 0, 0, 0.2)',
                                        }}>
                                          {result.brand_details.brand_name}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={7} sx={{ p: 2 }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Medicine Name
                                      </Typography>
                                      <Box 
                                        component="button"
                                        onClick={() => navigate(`/generic/medicine/${encodeURIComponent(result.generic_alternatives[0].generic_name)}`)}
                                        sx={{ 
                                          cursor: 'pointer',
                                          background: 'none',
                                          border: 'none',
                                          padding: 0,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          fontFamily: 'inherit',
                                          transition: 'color 0.2s',
                                          '&:hover': {
                                            color: 'success.main'
                                          }
                                        }}
                                      >
                                        <Typography variant="body1" sx={{ 
                                          fontWeight: 500, 
                                          color: 'success.dark',
                                          textAlign: 'left',
                                          textDecoration: 'underline',
                                          textUnderlineOffset: '2px',
                                          textDecorationColor: 'rgba(0, 128, 0, 0.2)',
                                        }}>
                                          {result.generic_alternatives[0].generic_name}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Price Row */}
                                <Grid item xs={12}>
                                  <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                    <Grid item xs={5} sx={{ 
                                      p: 2, 
                                      borderRight: '1px solid rgba(0, 0, 0, 0.08)'
                                    }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Price Range
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PriceChip variant="body2" discounted={false} sx={{ fontSize: '0.8rem' }}>
                                          ₹{formatPriceRange(result.brand_details.price)}
                                        </PriceChip>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={7} sx={{ p: 2 }}>
                                      <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Price Range
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PriceChip variant="body2" discounted={true} sx={{ fontSize: '0.8rem', mr: 2 }}>
                                          ₹{formatPriceRange(result.generic_alternatives[0].price)}
                                        </PriceChip>
                                        {result.generic_alternatives[0].savings_percentage && (
                                          <Chip
                                            size="small"
                                            label={`Save ${result.generic_alternatives[0].savings_percentage}`}
                                            color="success"
                                            sx={{ height: 24 }}
                                          />
                                        )}
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Manufacturer Row */}
                                {(result.brand_details.manufacturer || result.generic_alternatives[0].manufacturer) && (
                                  <Grid item xs={12}>
                                    <Grid container sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                                      <Grid item xs={5} sx={{ 
                                        p: 2, 
                                        borderRight: '1px solid rgba(0, 0, 0, 0.08)'
                                      }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                          Manufacturer
                                        </Typography>
                                        <Typography variant="body1">
                                          {result.brand_details.manufacturer || "Not specified"}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={7} sx={{ p: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                          Manufacturer
                                        </Typography>
                                        <Typography variant="body1">
                                          {result.generic_alternatives[0].manufacturer || "Not specified"}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )}

                                {/* Differences/Information Row */}
                                {result.generic_alternatives[0].differences && (
                                  <Grid item xs={12}>
                                    <Grid container>
                                      <Grid item xs={5} sx={{ 
                                        p: 2, 
                                        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                                        bgcolor: 'rgba(0, 0, 0, 0.01)'
                                      }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                          Information
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                          Brand name medications often cost more due to research, development, and marketing expenses.
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={7} sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                          Information
                                        </Typography>
                                        <Typography variant="body2">
                                          {result.generic_alternatives[0].differences}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )}
                              </Grid>
                            )}
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </GradientBackground>
      <Footer />
    </>
  );
};

export default MedicineComparisonPage; 