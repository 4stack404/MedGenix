import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardMedia,
  Avatar
} from '@mui/material';
import {
  ExpandMore,
  VerifiedUser,
  LocalHospital,
  MedicalServices,
  ErrorOutline,
  CheckCircleOutline,
  KeyboardArrowRight,
  Science,
  InfoOutlined,
  ShoppingCart,
  CompareArrows,
  AlternateEmail
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { styled } from '@mui/material/styles';

// Sample medicine data (would come from an API in a real app)
const medicineData = {
  id: 1,
  name: 'Lipitor',
  brand: 'Pfizer',
  category: 'Cholesterol',
  usageInfo: 'Lipitor is used along with a proper diet to help lower "bad" cholesterol and fats (such as LDL, triglycerides) and raise "good" cholesterol (HDL) in the blood. It belongs to a group of drugs known as "statins." It works by reducing the amount of cholesterol made by the liver.',
  howItWorks: 'Lipitor belongs to a group of medicines called HMG-CoA reductase inhibitors, or "statins." It lowers the level of cholesterol and triglycerides in the blood by blocking an enzyme that is needed to make cholesterol.',
  activeIngredients: 'Each tablet contains atorvastatin calcium equivalent to 10 mg, 20 mg, 40 mg, or 80 mg atorvastatin.',
  sideEffects: [
    {
      severity: 'Common',
      effects: [
        'Diarrhea',
        'Upset stomach',
        'Muscle and joint pain',
        'Alterations in some laboratory tests'
      ]
    },
    {
      severity: 'Less Common',
      effects: [
        'Muscle problems',
        'Liver problems',
        'Memory problems or confusion',
        'Increased blood sugar'
      ]
    },
    {
      severity: 'Rare',
      effects: [
        'Allergic reactions',
        'Severe muscle damage (rhabdomyolysis)',
        'Liver damage',
        'Kidney problems'
      ]
    }
  ],
  doctorVerified: {
    name: 'Dr. Anand Sharma',
    specialty: 'Cardiologist',
    date: '15 Jan 2023'
  },
  genericId: 2,
  price: 325.75,
  dosageOptions: [
    { strength: '10 mg', form: 'Tablet', price: 325.75 },
    { strength: '20 mg', form: 'Tablet', price: 425.50 },
    { strength: '40 mg', form: 'Tablet', price: 525.25 },
    { strength: '80 mg', form: 'Tablet', price: 625.00 }
  ],
  patientTestimonials: [
    {
      name: 'Rajesh K.',
      age: 55,
      testimonial: 'I have been taking Lipitor for 3 years now, and my cholesterol levels have significantly improved. My doctor is very pleased with the results.',
      rating: 5
    },
    {
      name: 'Priya S.',
      age: 48,
      testimonial: "Initially had some muscle pain, but it subsided after a few weeks. Now I'm experiencing good results with minimal side effects.",
      rating: 4
    },
    {
      name: 'Amit G.',
      age: 62,
      testimonial: "This medication has been a life-changer for me. It's expensive compared to the generic version, but I prefer to stick with the brand I trust.",
      rating: 5
    }
  ]
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const GenericButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(0, 128, 128, 0.4)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 128, 128, 0.5)',
  },
}));

const TestimonialCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  overflow: 'visible',
  position: 'relative',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  },
  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
}));

const StarRating = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(1),
}));

const Star = styled(Box)(({ theme, filled }) => ({
  width: 16,
  height: 16,
  marginRight: 4,
  backgroundColor: filled ? theme.palette.warning.main : theme.palette.grey[300],
  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
}));

// Main component
const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDosage, setSelectedDosage] = useState(null);

  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, repeatType: "reverse" }
  };

  // Fetch medicine data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we're using sample data
        setMedicine(medicineData);
        setSelectedDosage(medicineData.dosageOptions[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
        setError('Failed to load medicine details. Please try again.');
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  // Navigate to generic medicine page
  const handleNavigateToGeneric = () => {
    if (medicine?.genericId) {
      navigate(`/generic/medicine/${medicine.genericId}`);
    }
  };

  // Handle dosage selection
  const handleDosageChange = (dosage) => {
    setSelectedDosage(dosage);
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, minHeight: '100vh' }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <LocalHospital color="primary" sx={{ fontSize: 60, mb: 2 }} />
            </motion.div>
            <Typography variant="h6" color="textSecondary">Loading medicine details...</Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !medicine) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, minHeight: '100vh' }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
            <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="error">{error || "Medicine not found"}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3 }}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #f0f7f4 0%, #e7f5ed 100%)',
          backgroundImage: 'none',
          '&::before': {
            content: 'none'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          {/* Medicine Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Box 
              sx={{ 
                mb: 4, 
                pb: 2, 
                pt: 2,
                px: 3,
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(0, 128, 128, 0.15) 0%, rgba(103, 194, 124, 0.25) 100%)",
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  {medicine.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label={`By ${medicine.brand}`} 
                    color="primary" 
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={medicine.category} 
                    variant="outlined" 
                    color="primary" 
                    sx={{ fontWeight: 500 }}
                  />
                  {selectedDosage && (
                    <Chip 
                      label={`₹${selectedDosage.price.toFixed(2)}`} 
                      color="success" 
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CompareArrows />}
                onClick={handleNavigateToGeneric}
                sx={{ 
                  mt: { xs: 2, md: 0 }, 
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  fontSize: '1rem',
                  bgcolor: '#008080',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0, 128, 128, 0.5)',
                  '&:hover': {
                    bgcolor: '#006666',
                    boxShadow: '0 6px 15px rgba(0, 128, 128, 0.7)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                View Generic Alternative
              </Button>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={7}>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* Usage Section (renamed from Overview) */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper>
                    <SectionTitle variant="h5">
                      <MedicalServices /> Usage
                    </SectionTitle>
                    <Typography paragraph>{medicine.usageInfo}</Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>How it works</Typography>
                    <Typography paragraph>{medicine.howItWorks}</Typography>
                  </StyledPaper>
                </motion.div>

                {/* Side Effects Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <ErrorOutline /> Possible Side Effects
                    </SectionTitle>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                      mb: 3
                    }}>
                      {[...medicine.sideEffects[0].effects, ...medicine.sideEffects[1].effects, ...medicine.sideEffects[2].effects].map((effect, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: index < 4 ? 'rgba(103, 194, 124, 0.08)' : 
                                    index < 8 ? 'rgba(0, 128, 128, 0.12)' : 
                                    'rgba(0, 128, 128, 0.16)',
                            border: '1px solid',
                            borderColor: index < 4 ? 'rgba(103, 194, 124, 0.3)' : 
                                        index < 8 ? 'rgba(0, 128, 128, 0.3)' : 
                                        'rgba(0, 128, 128, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Box 
                            component="span" 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              mr: 1.5,
                              bgcolor: index < 4 ? '#67c27c' : 
                                      index < 8 ? '#008080' : 
                                      '#005f5f'
                            }} 
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {effect}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ 
                      bgcolor: 'rgba(211, 47, 47, 0.15)', 
                      p: 2, 
                      borderRadius: 2,
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                    }}>
                      <Typography variant="body2" color="error.dark" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                        <InfoOutlined sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle', color: 'error.main' }} />
                        If you experience any severe or persistent side effects, contact your healthcare provider immediately.
                      </Typography>
                    </Box>
                  </StyledPaper>
                </motion.div>

                {/* Content Details Box */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <MedicalServices /> Content Detaills
                    </SectionTitle>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 2
                    }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 70, 
                          height: 70,
                          mr: 2
                        }}
                      >
                        AS
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Written By
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                          Dr. Anuj Saini
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          MMST, MBBS
                        </Typography>
                      </Box>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </motion.div>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={5}>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {/* Save Money Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper>
                    <SectionTitle variant="h5">
                      <CompareArrows /> Save Money with Generic
                    </SectionTitle>
                    
                    <Box sx={{ 
                      bgcolor: 'rgba(122, 186, 90, 0.85)', 
                      color: 'white',
                      p: 2,
                      borderRadius: 2,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(122, 186, 90, 0.3)'
                    }}>
                      <CheckCircleOutline sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Save up to 75% with generic alternatives
                      </Typography>
                    </Box>
                    
                    <GenericButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<AlternateEmail />}
                      onClick={handleNavigateToGeneric}
                      component={motion.button}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        bgcolor: '#008080',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(0, 128, 128, 0.7)',
                        '&:hover': {
                          bgcolor: '#006666',
                          boxShadow: '0 6px 20px rgba(0, 128, 128, 0.9)',
                        },
                        fontSize: '1.1rem',
                        py: 1.5
                      }}
                    >
                      View Generic Alternative
                    </GenericButton>
                  </StyledPaper>
                </motion.div>

                {/* Why Choose Generic Medicines Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <CheckCircleOutline /> Why Choose Generic Medicines?
                    </SectionTitle>
                    
                    <List disablePadding>
                      <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>1</Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Same Active Ingredients</Typography>}
                          secondary="Generic medicines contain the same active ingredients as brand-name drugs, ensuring the same effectiveness."
                        />
                      </ListItem>
                      
                      <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>2</Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>More Affordable</Typography>}
                          secondary="They cost up to 70% less than branded medicines, making healthcare more accessible."
                        />
                      </ListItem>
                      
                      <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>3</Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>FDA & Doctor Approved</Typography>}
                          secondary="Generics undergo strict quality checks and are verified for safety and efficacy."
                        />
                      </ListItem>
                      
                      <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>4</Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Trusted by Millions</Typography>}
                          secondary="Many doctors and healthcare professionals recommend generics for cost-effective treatment."
                        />
                      </ListItem>
                    </List>
                  </StyledPaper>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MedicineDetailPage; 