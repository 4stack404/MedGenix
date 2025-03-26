import { useState, useEffect, useRef } from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Link
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
  LocationOn,
  Store,
  QuestionAnswer,
  MedicalInformation,
  Compare,
  RocketLaunch
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { styled } from '@mui/material/styles';

// Sample medicine data (would come from an API in a real app)
const genericMedicineData = {
  id: 2,
  name: 'Atorvastatin',
  brand: 'Generic',
  category: 'Cholesterol',
  usageInfo: 'Atorvastatin is used along with a proper diet to help lower "bad" cholesterol and fats (such as LDL, triglycerides) and raise "good" cholesterol (HDL) in the blood. It belongs to a group of drugs known as "statins." It works by reducing the amount of cholesterol made by the liver.',
  howItWorks: 'Atorvastatin belongs to a group of medicines called HMG-CoA reductase inhibitors, or "statins." It lowers the level of cholesterol and triglycerides in the blood by blocking an enzyme that is needed to make cholesterol.',
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
  brandId: 1,
  price: 85.30,
  priceComparison: [
    { 
      platform: 'PharmEasy', 
      price: 85.30, 
      discount: '10% OFF',
      link: 'https://pharmeasy.in',
      deliveryDays: '1-2 days',
      isAvailable: true
    },
    { 
      platform: 'Netmeds', 
      price: 90.20, 
      discount: '5% OFF',
      link: 'https://netmeds.com',
      deliveryDays: '2-3 days',
      isAvailable: true
    },
    { 
      platform: 'Apollo Pharmacy', 
      price: 82.50, 
      discount: '15% OFF',
      link: 'https://apollopharmacy.in',
      deliveryDays: '1 day',
      isAvailable: true
    },
    { 
      platform: 'MedPlus', 
      price: 88.75, 
      discount: '8% OFF',
      link: 'https://medplusmart.com',
      deliveryDays: '2-3 days',
      isAvailable: true
    }
  ],
  expertAdvice: {
    doctor: 'Dr. Meera Patel',
    qualification: 'M.D., Clinical Pharmacology',
    advice: 'Generic atorvastatin is biologically equivalent to the brand-name medication. When switching from brand to generic, maintain the same dosage and continue regular cholesterol monitoring. Report any unusual side effects to your healthcare provider immediately. The effectiveness of cholesterol reduction should remain consistent after switching.',
    date: 'February 2023'
  },
  faqs: [
    {
      question: 'Is generic atorvastatin as effective as the brand-name version?',
      answer: 'Yes, generic atorvastatin contains the same active ingredient and is required by law to be as safe and effective as the brand-name version. The FDA ensures that generic medications provide the same clinical benefits.'
    },
    {
      question: 'Can I switch between brand and generic versions?',
      answer: "Yes, you can switch between brand and generic versions of atorvastatin. However, it's recommended to consult with your healthcare provider before making any changes to your medication."
    },
    {
      question: 'Are there any differences in side effects between generic and brand?',
      answer: 'Generic and brand-name atorvastatin share the same potential side effects. Any differences are typically related to inactive ingredients, which rarely cause issues for most patients.'
    },
    {
      question: 'Why is generic atorvastatin less expensive?',
      answer: "Generic medications are less expensive because manufacturers don't have to repeat costly clinical trials that the brand-name manufacturers conducted. Additionally, competition among multiple generic manufacturers helps lower the price."
    }
  ],
  brandComparison: {
    efficacy: "The generic version contains the same active ingredient and provides the same therapeutic effect as the brand-name version.",
    cost: "The generic version typically costs 70-85% less than the brand-name equivalent.",
    quality: "Generic medications are regulated by the FDA and must meet the same quality standards as brand-name medications.",
    availability: "Generic atorvastatin is widely available at most pharmacies across India."
  }
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

const FindPharmacyButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(0, 128, 128, 0.4)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 128, 128, 0.5)',
  },
}));

const PriceTableRow = styled(TableRow)(({ theme, isHighlighted }) => ({
  background: isHighlighted ? 'rgba(0, 128, 128, 0.08)' : 'transparent',
  '&:hover': {
    background: 'rgba(0, 128, 128, 0.12)',
  },
  transition: 'background 0.3s ease, transform 0.3s ease',
}));

const PlatformLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginLeft: '4px',
  },
}));

// Main component
const GenericMedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const mapRef = useRef(null);

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

  // Fetch medicine data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we're using sample data
        setMedicine(genericMedicineData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
        setError('Failed to load medicine details. Please try again.');
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  // Navigate to branded medicine page
  const handleNavigateToBranded = () => {
    if (medicine?.brandId) {
      navigate(`/medicine/${medicine.brandId}`);
    }
  };

  // Find lowest price
  const getLowestPrice = () => {
    if (!medicine?.priceComparison?.length) return null;
    return medicine.priceComparison.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest, 
      medicine.priceComparison[0]
    );
  };
  
  const lowestPrice = medicine ? getLowestPrice() : null;

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
          {/* Generic Medicine Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              alignItems: { xs: 'center', md: 'flex-start' }, 
              justifyContent: 'space-between',
              mb: 4,
              pb: 2, 
              pt: 2,
              px: 3,
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(0, 128, 128, 0.15) 0%, rgba(103, 194, 124, 0.25) 100%)",
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  {medicine.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Chip 
                    label="Generic" 
                    color="secondary" 
                    icon={<Science />} 
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={medicine.category} 
                    variant="outlined" 
                    color="primary" 
                    sx={{ fontWeight: 500 }}
                  />
                  <Chip 
                    label={`₹${medicine.price.toFixed(2)}`} 
                    color="success" 
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: { xs: 2, md: 0 }, 
                alignSelf: { md: 'center' }
              }}>
                <FindPharmacyButton
                  variant="contained"
                  color="primary"
                  startIcon={<Store />}
                  component={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Find Nearby Pharmacies
                </FindPharmacyButton>
              </Box>
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
                {/* Uses Section (Previously Overview) */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper>
                    <SectionTitle variant="h5">
                      <MedicalInformation /> Uses
                    </SectionTitle>
                    <Typography paragraph>{medicine.usageInfo}</Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>How it works</Typography>
                    <Typography paragraph>{medicine.howItWorks}</Typography>
                  </StyledPaper>
                </motion.div>

                {/* Side Effects Section - Changed to paragraphs */}
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

                {/* Expert Advice Section - Revised with provided text */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <MedicalServices /> Expert Advice
                    </SectionTitle>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 3,
                      pb: 3,
                      borderBottom: '1px dashed rgba(0, 0, 0, 0.1)'
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
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          Dr. Anuj Saini
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          MMST, MBBS
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          Expert Opinion
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                          CONTENT DETAILS
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Expert advice for the medicine
                    </Typography>
                    
                    <Typography paragraph>
                      In general, Atorvastatin is safe. It may cause diarrhea, gas or an upset stomach. If any of these happen to you, take it with food.
                    </Typography>
                    
                    <Typography paragraph>
                      Inform your doctor if you experience fatigue, muscle weakness or muscle pain.
                    </Typography>
                    
                    <Typography paragraph>
                      Your doctor may check your liver function before starting the treatment and regularly thereafter. Inform your doctor if you notice signs of liver problems such as stomach pains, unusually dark urine or yellowing of skin or eyes.
                    </Typography>
                    
                    <Typography paragraph>
                      Inform your doctor if you have kidney disease, liver disease or diabetes before starting treatment with this medicine. If you are diabetic, monitor your blood sugar level regularly as Atorvastatin may cause an increase in your blood sugar level.
                    </Typography>
                    
                    <Typography paragraph>
                      Do not take Atorvastatin if you are pregnant, planning a pregnancy or breastfeeding.
                    </Typography>
                    
                    <Typography paragraph>
                      Atorvastatin treats high cholesterol by lowering "bad" cholesterol (LDL) and triglycerides (fats). It should be taken in addition to regular exercise and low-fat diet.
                    </Typography>
                    
                    <Typography paragraph>
                      It also reduces the risk of heart attack and stroke.
                    </Typography>
                    
                    <Typography paragraph>
                      In general, Atorvastatin is safe. It may cause diarrhea, gas or an upset stomach. If any of these happen to you, take it with food.
                    </Typography>
                    
                    <Typography paragraph>
                      Inform your doctor if you experience fatigue, muscle weakness or muscle pain.
                    </Typography>
                    
                    <Typography paragraph>
                      Your doctor may check your liver function before starting the treatment and regularly thereafter. Inform your doctor if you notice signs of liver problems such as stomach pains, unusually dark urine or yellowing of skin or eyes.
                    </Typography>
                    
                    <Typography paragraph>
                      Inform your doctor if you have kidney disease, liver disease or diabetes before starting treatment with this medicine. If you are diabetic, monitor your blood sugar level regularly as Atorvastatin may cause an increase in your blood sugar level.
                    </Typography>
                    
                    <Typography paragraph>
                      Do not take Atorvastatin if you are pregnant, planning a pregnancy or breastfeeding.
                    </Typography>
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
                {/* Price Comparison Section - Enhanced with logos and brand names */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper>
                    <SectionTitle variant="h5">
                      <Compare /> Price Comparison
                    </SectionTitle>
                    
                    {lowestPrice && (
                      <Box 
                        sx={{ 
                          bgcolor: 'success.main', 
                          color: 'white',
                          p: 3,
                          borderRadius: 2,
                          mb: 3,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          Best Price Available
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          ₹{lowestPrice.price.toFixed(2)}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          at {lowestPrice.platform} with {lowestPrice.discount}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Generic {medicine.name} ({medicine.category}) Price Comparison
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {medicine.priceComparison.map((platform, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper 
                            elevation={platform.platform === lowestPrice?.platform ? 2 : 0}
                            sx={{ 
                              p: 2, 
                              border: '1px solid',
                              borderColor: platform.platform === lowestPrice?.platform 
                                ? 'success.main' 
                                : 'rgba(0, 0, 0, 0.12)',
                              borderRadius: 2,
                              bgcolor: platform.platform === lowestPrice?.platform 
                                ? 'rgba(76, 175, 80, 0.05)' 
                                : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              }
                            }}
                          >
                            <Box 
                              sx={{ 
                                bgcolor: 'primary.light', 
                                width: 50, 
                                height: 50, 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'primary.contrastText',
                                fontWeight: 700,
                                mr: 2,
                                fontSize: '1rem'
                              }}
                            >
                              {platform.platform.slice(0, 2).toUpperCase()}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {platform.platform}
                                {platform.platform === lowestPrice?.platform && (
                                  <Chip
                                    label="BEST DEAL"
                                    color="success"
                                    size="small"
                                    sx={{ ml: 1, fontWeight: 600, fontSize: '0.65rem' }}
                                  />
                                )}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                                ₹{platform.price.toFixed(2)}
                              </Typography>
                              <Chip 
                                label={platform.discount} 
                                color="secondary" 
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      <InfoOutlined sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Prices and availability may vary. Last updated: Today
                    </Typography>
                  </StyledPaper>
                </motion.div>

                {/* Expanded FAQs Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <QuestionAnswer /> Frequently Asked Questions
                    </SectionTitle>
                    
                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                      Important information about Atorvastatin that patients commonly ask about
                    </Typography>
                    
                    {/* Existing FAQs */}
                    <Accordion 
                      expanded={activeFaq === 0}
                      onChange={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Is generic atorvastatin as effective as the brand-name version?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Yes, generic atorvastatin contains the same active ingredient and is required by law to be as safe and effective as the brand-name version. The FDA ensures that generic medications provide the same clinical benefits.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 1}
                      onChange={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Can I switch between brand and generic versions?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Yes, you can switch between brand and generic versions of atorvastatin. However, it's recommended to consult with your healthcare provider before making any changes to your medication.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 2}
                      onChange={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Are there any differences in side effects between generic and brand?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Generic and brand-name atorvastatin share the same potential side effects. Any differences are typically related to inactive ingredients, which rarely cause issues for most patients.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 3}
                      onChange={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Why is generic atorvastatin less expensive?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Generic medications are less expensive because manufacturers don't have to repeat costly clinical trials that the brand-name manufacturers conducted. Additionally, competition among multiple generic manufacturers helps lower the price.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    {/* Additional FAQs */}
                    <Accordion 
                      expanded={activeFaq === 4}
                      onChange={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          When should I take Atorvastatin – morning or evening?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Atorvastatin is usually taken once a day in the evening or at bedtime. This is because the body makes more cholesterol at night than during the day. Taking it in the evening ensures it works most effectively.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 5}
                      onChange={() => setActiveFaq(activeFaq === 5 ? null : 5)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Can I drink alcohol while taking Atorvastatin?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Drinking alcohol while taking Atorvastatin can increase the risk of liver damage. It's recommended to limit alcohol consumption and discuss this with your doctor if you regularly drink alcohol.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 6}
                      onChange={() => setActiveFaq(activeFaq === 6 ? null : 6)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          How long does it take for Atorvastatin to start working?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Atorvastatin starts working within 1-2 weeks, but the full effect on cholesterol levels may take up to 4-6 weeks. Regular blood tests will help your doctor monitor how well it's working for you.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 7}
                      onChange={() => setActiveFaq(activeFaq === 7 ? null : 7)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          What foods should I avoid while taking Atorvastatin?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Avoid grapefruit and grapefruit juice as they can increase the concentration of Atorvastatin in your blood, potentially increasing side effects. Also limit foods high in cholesterol and saturated fats, like fatty meats, full-fat dairy products, and fried foods.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 8}
                      onChange={() => setActiveFaq(activeFaq === 8 ? null : 8)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          What should I do if I miss a dose?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          If you miss a dose, take it as soon as you remember unless it's almost time for your next dose. In that case, skip the missed dose and continue with your regular schedule. Do not take a double dose to make up for a missed one.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 9}
                      onChange={() => setActiveFaq(activeFaq === 9 ? null : 9)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Do I need to follow a special diet while taking Atorvastatin?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          Yes, Atorvastatin works best when combined with a heart-healthy diet. This includes reducing saturated fats, trans fats, and cholesterol in your diet. Focus on fruits, vegetables, whole grains, lean proteins, and healthy fats like those found in olive oil and nuts.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Accordion 
                      expanded={activeFaq === 10}
                      onChange={() => setActiveFaq(activeFaq === 10 ? null : 10)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          Can I stop taking Atorvastatin once my cholesterol levels are normal?
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>
                          No, you should not stop taking Atorvastatin without consulting your doctor, even if your cholesterol levels return to normal. Atorvastatin helps maintain healthy cholesterol levels, and discontinuing it could cause your cholesterol to rise again.
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
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

export default GenericMedicineDetailPage; 