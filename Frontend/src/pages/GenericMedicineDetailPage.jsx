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
  Link,
  CircularProgress
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
  RocketLaunch,
  Home
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { styled } from '@mui/material/styles';
import { getGenericMedicineById } from '../services/medicineService';
import { getMedicineDosages } from '../services/groqService';

// Sample medicine data as fallback
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
  const [selectedDosage, setSelectedDosage] = useState(null);
  const [dosages, setDosages] = useState([]);
  const [loadingDosages, setLoadingDosages] = useState(false);
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

  // For debugging
  useEffect(() => {
    console.log('Active FAQ state changed:', activeFaq);
  }, [activeFaq]);

  // Fetch medicine data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the API service to fetch medicine data
        const medicineData = await getGenericMedicineById(id);
        console.log('Fetched generic medicine data:', medicineData);
        
        if (!medicineData) {
          throw new Error('No data received from API');
        }
        
        // Extract content details - new format handling
        const contentDetails = medicineData.content_details || {};
        const contentDoctors = Object.keys(contentDetails);
        const author = contentDoctors.length > 0 ? contentDoctors[0] : 'Medical Professional';
        const authorImage = contentDoctors.length > 0 ? contentDetails[author] : null;
        const reviewer = contentDoctors.length > 1 ? contentDoctors[1] : 'Medical Professional';
        const reviewerImage = contentDoctors.length > 1 ? contentDetails[reviewer] : null;
        
        // Map the API response to the expected format
        const formattedData = {
          id: id,
          name: medicineData.medicine_name || id,
          brand: 'Generic',
          category: medicineData.category || 'Medication',
          usageInfo: medicineData.uses || [], // Keep as array instead of joining
          howItWorks: medicineData.how_it_works || 'Information not available',
          activeIngredients: medicineData.active_ingredients || 'Information not available',
          sideEffects: [
            {
              severity: 'Common',
              effects: medicineData.common_side_effects || []
            },
            {
              severity: 'Less Common',
              effects: medicineData.less_common_side_effects || []
            },
            {
              severity: 'Rare',
              effects: medicineData.rare_side_effects || []
            }
          ],
          doctorVerified: {
            name: author,
            specialty: '',
            date: '',
            image: authorImage
          },
          brandId: 1,
          price: medicineData.price || 0,
          priceComparison: [], // API doesn't provide this info
          expertAdvice: {
            doctor: reviewer,
            qualification: '',
            advice: medicineData.expert_advice || [], // Keep as array
            date: '',
            image: reviewerImage
          },
          faqs: medicineData.faqs?.map(faq => ({
            question: faq.question,
            answer: faq.answer
          })) || [],
          dosageOptions: medicineData.dosage_options || []
        };
        
        setMedicine(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
        setError('Failed to load medicine details');
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  // Add this new useEffect for fetching dosages
  useEffect(() => {
    const fetchDosages = async () => {
      if (medicine?.name) {
        setLoadingDosages(true);
        try {
          const availableDosages = await getMedicineDosages(medicine.name);
          setDosages(availableDosages);
        } catch (error) {
          console.error('Error fetching dosages:', error);
          // Set default dosages if API call fails
          setDosages([
            { strength: '1mg' },
            { strength: '2mg' },
            { strength: '5mg' },
            { strength: '10mg' },
            { strength: '50mg' }
          ]);
        } finally {
          setLoadingDosages(false);
        }
      }
    };

    fetchDosages();
  }, [medicine?.name]);

  // Navigate to branded medicine page
  const handleNavigateToBranded = () => {
    if (medicine?.brandId) {
      navigate(`/medicine/${medicine.brandId}`);
    }
  };

  // Find lowest price
  const getLowestPrice = () => {
    if (!medicine?.priceComparison || !medicine.priceComparison.length) return null;
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

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <MedicalInformation 
                sx={{ 
                  fontSize: 60, 
                  color: 'primary.main',
                  mb: 2
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 2
              }}
            >
              Information Not Available
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 600,
                mx: 'auto',
                mb: 3
              }}
            >
              Sorry, currently we do not have information related to this medicine in our database. 
              We are constantly expanding our database to provide you with comprehensive information 
              about medicines.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              startIcon={<Home />}
              sx={{ 
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Return to Home
            </Button>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  if (!medicine) {
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
                    <Box>
                      {medicine.usageInfo && medicine.usageInfo.length > 0 
                        ? medicine.usageInfo.map((use, index) => (
                            <Typography key={index} component="div" sx={{ mb: 1 }}>
                              • {use}
                            </Typography>
                          ))
                        : 'Information not available'}
                    </Box>
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
                      {medicine.sideEffects && medicine.sideEffects.map(sideEffect => 
                        sideEffect.effects && sideEffect.effects.map((effect, index) => (
                        <Box 
                            key={`${sideEffect.severity}-${index}`} 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                              bgcolor: sideEffect.severity === 'Common' ? 'rgba(103, 194, 124, 0.08)' : 
                                      sideEffect.severity === 'Less Common' ? 'rgba(0, 128, 128, 0.12)' : 
                                    'rgba(0, 128, 128, 0.16)',
                            border: '1px solid',
                              borderColor: sideEffect.severity === 'Common' ? 'rgba(103, 194, 124, 0.3)' : 
                                          sideEffect.severity === 'Less Common' ? 'rgba(0, 128, 128, 0.3)' : 
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
                                bgcolor: sideEffect.severity === 'Common' ? '#67c27c' : 
                                        sideEffect.severity === 'Less Common' ? '#008080' : 
                                      '#005f5f'
                            }} 
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {effect}
                          </Typography>
                        </Box>
                        ))
                      )}
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
                      <MedicalServices /> Content Details
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
                        src={medicine.doctorVerified.image}
                        alt={medicine.doctorVerified.name}
                      >
                        {!medicine.doctorVerified.image && medicine.doctorVerified.name.split(' ').map(word => word.charAt(0))}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {medicine.doctorVerified.name}
                        </Typography>
                        {medicine.doctorVerified.specialty && (
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {medicine.doctorVerified.specialty}
                        </Typography>
                        )}
                        <Typography variant="body2" color="primary.main">
                          Author
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'secondary.main', 
                          width: 60, 
                          height: 60,
                          mr: 2
                        }}
                        src={medicine.expertAdvice.image}
                        alt={medicine.expertAdvice.doctor}
                      >
                        {!medicine.expertAdvice.image && medicine.expertAdvice.doctor.split(' ').map(word => word.charAt(0))}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {medicine.expertAdvice.doctor}
                    </Typography>
                        {medicine.expertAdvice.qualification && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {medicine.expertAdvice.qualification}
                    </Typography>
                        )}
                        <Typography variant="body2" color="secondary.main">
                          Reviewer
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
                      Generic {medicine.name} ({medicine.category || 'Medication'}) Price Comparison
                    </Typography>
                    
                    {medicine.priceComparison && medicine.priceComparison.length > 0 ? (
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
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          Price comparison data is not available for this medication.
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      <InfoOutlined sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                      Prices and availability may vary. Last updated: Today
                    </Typography>
                  </StyledPaper>
                </motion.div>

                {/* Dosage Options Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <MedicalServices /> Available Dosages
                    </SectionTitle>
                    
                    {loadingDosages ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {dosages.map((dosage, index) => (
                          <Grid item xs={6} sm={4} key={index}>
                            <Paper
                              elevation={selectedDosage?.strength === dosage.strength ? 3 : 1}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                border: selectedDosage?.strength === dosage.strength ? '2px solid' : 'none',
                                borderColor: 'primary.main',
                                bgcolor: selectedDosage?.strength === dosage.strength ? 'white' : 'background.paper',
                                transition: 'all 0.3s ease',
                                aspectRatio: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 3,
                                  bgcolor: 'primary.light',
                                }
                              }}
                              onClick={() => setSelectedDosage(dosage)}
                            >
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: selectedDosage?.strength === dosage.strength ? 'primary.main' : 'text.primary'
                                }}
                              >
                                {dosage.strength}
                              </Typography>
                              {selectedDosage?.strength === dosage.strength && (
                                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                  <CheckCircleOutline sx={{ fontSize: 16, mr: 0.5 }} />
                                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    Selected
                                  </Typography>
                                </Box>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </StyledPaper>
                </motion.div>

                {/* Expanded FAQs Section */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <QuestionAnswer /> Frequently Asked Questions
                    </SectionTitle>
                    
                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                      Important information about {medicine.name} that patients commonly ask about
                    </Typography>
                    
                    {medicine.faqs && medicine.faqs.length > 0 ? (
                      medicine.faqs.map((faq, index) => (
                        <Box 
                          key={index}
                      sx={{ 
                        mb: 2, 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                            bgcolor: 'white'
                          }}
                        >
                          <Box
                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      sx={{ 
                              padding: '16px',
                              cursor: 'pointer',
                              backgroundColor: activeFaq === index ? 'rgba(0, 128, 128, 0.08)' : 'white',
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              transition: 'background-color 0.3s ease',
                        borderRadius: '8px',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 128, 128, 0.05)'
                              }
                            }}
                          >
                            <Typography 
                      sx={{ 
                                fontWeight: 600,
                                flex: 1,
                                pr: 2
                              }}
                            >
                              {faq.question}
                        </Typography>
                            <ExpandMore 
                      sx={{ 
                                transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                flexShrink: 0
                              }}
                            />
                          </Box>
                          
                          {activeFaq === index && (
                            <Box
                      sx={{ 
                                padding: '0 16px 16px 16px',
                                overflow: 'hidden',
                              }}
                            >
                              <Typography sx={{ 
                                whiteSpace: 'pre-wrap',
                                color: 'text.primary',
                                lineHeight: 1.6
                              }}>
                                {faq.answer}
                        </Typography>
                            </Box>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                          No FAQs available for this medication.
                        </Typography>
                      </Box>
                    )}
                  </StyledPaper>
                </motion.div>

                {/* Add new Expert Advice section on the right column below FAQs */}
                <motion.div variants={fadeInUp}>
                  <StyledPaper sx={{ mt: 4 }}>
                    <SectionTitle variant="h5">
                      <MedicalServices /> Expert Advice
                    </SectionTitle>
                    
                    <Box>
                      {medicine.expertAdvice.advice && medicine.expertAdvice.advice.length > 0 
                        ? medicine.expertAdvice.advice.map((advice, index) => (
                            <Typography key={index} component="div" sx={{ mb: 1.5 }}>
                              • {advice}
                        </Typography>
                          ))
                        : 'No expert advice available for this medication.'}
                    </Box>
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