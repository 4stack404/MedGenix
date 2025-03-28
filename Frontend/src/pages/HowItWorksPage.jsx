import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Button,
  Divider,
  useMediaQuery,
  InputAdornment,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import SavingsIcon from '@mui/icons-material/Savings';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const popularMedications = ['Lipitor', 'Metformin', 'Lisinopril', 'Advair', 'Humira'];

const HowItWorksPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stepStyles = {
    numberCircle: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(103, 194, 124, 0.15)',
      marginBottom: theme.spacing(2),
    },
    stepTitle: {
      fontWeight: 700,
      marginBottom: theme.spacing(2),
      color: theme.palette.primary.dark,
    },
    stepDescription: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2),
    },
    stepCard: {
      borderRadius: '16px',
      padding: theme.spacing(3),
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 128, 128, 0.1)',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 25px rgba(0, 128, 128, 0.15)',
        transform: 'translateY(-5px)',
      },
    },
    listItem: {
      marginBottom: theme.spacing(0.5),
      color: theme.palette.text.secondary,
    },
    listIcon: {
      color: theme.palette.primary.main,
      minWidth: '28px',
    }
  };

  return (
    <>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          pt: { xs: 12, md: 16 }, 
          pb: { xs: 8, md: 12 },
          backgroundColor: '#f8f9fa',
          backgroundImage: 'url(https://articles-1mg.gumlet.io/articles/wp-content/uploads/2024/08/shutterstock_2378382317.jpg?compress=true&quality=80&w=1000&dpr=2.6)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Hero Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ 
              textAlign: 'center', 
              mb: { xs: 6, md: 10 },
              p: { xs: 3, md: 5 },
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(103, 194, 124, 0.12), rgba(0, 128, 128, 0.12))',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 128, 128, 0.1)'
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.25rem', md: '3rem' },
                mb: 3,
                backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              How MedGenix Works
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
                mb: 2,
              }}
            >
              Find affordable medication alternatives and save on your prescriptions in just a few simple steps.
            </Typography>
          </Box>

          {/* Steps Section */}
          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            {/* Step 1 */}
            <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 } }} alignItems="center">
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ pr: { md: 4 } }}>
                  <Box sx={stepStyles.numberCircle}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>1</Typography>
                  </Box>
                  <Typography variant="h4" sx={stepStyles.stepTitle}>
                    Scan Your Prescription
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Simply scan or upload your prescription using our advanced OCR technology. Our AI-powered system will analyze it instantly to identify medications.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Instant digital recognition of handwritten prescriptions" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Accurate extraction of medication names and dosages" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Secure and private prescription processing" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Support for multiple prescription formats" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper sx={stepStyles.stepCard}>
                  <Box
                    component="img"
                    src="https://t4.ftcdn.net/jpg/02/14/68/61/360_F_214686197_9JhcTswvrd9jGYYbCNLuAVhvTIiLm9bm.jpg"
                    alt="Medicine Extraction through OCR"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>

            {/* Step 2 */}
            <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 } }} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper sx={stepStyles.stepCard}>
                  <Box
                    component="img"
                    src="https://labelyourdata.com/img/article-illustrations/ocr_light.jpg"
                    alt="Medicine Extraction through OCR"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ pl: { md: 4 } }}>
                  <Box sx={stepStyles.numberCircle}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>2</Typography>
                  </Box>
                  <Typography variant="h4" sx={stepStyles.stepTitle}>
                    Extract Medicine Through OCR
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Our advanced OCR technology automatically extracts and identifies medication names, dosages, and instructions from your prescription with high accuracy.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Intelligent text recognition and extraction" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Accurate dosage and frequency detection" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Automatic medicine name identification" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Real-time processing and verification" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>

            {/* Step 3 */}
            <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 } }} alignItems="center">
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ pr: { md: 4 } }}>
                  <Box sx={stepStyles.numberCircle}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>3</Typography>
                  </Box>
                  <Typography variant="h4" sx={stepStyles.stepTitle}>
                    Get Generic Alternatives
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Our system identifies generic alternatives for your prescribed medications, helping you save significantly on your healthcare costs.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Find equivalent generic medications" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Compare prices of brand vs generic" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="View detailed medication information" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper sx={stepStyles.stepCard}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src="https://drbest.in/wp-content/uploads/2024/07/generic-drugs.jpg"
                      alt="Generic Medicine Alternatives"
                      sx={{
                        width: '60%',
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Calpol
                      </Typography>
                      <ArrowForwardIcon sx={{ color: theme.palette.primary.main }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        Paracetamol
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Step 4 */}
            <Grid container spacing={4} sx={{ mb: { xs: 6, md: 10 } }} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper sx={stepStyles.stepCard}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src="https://media.licdn.com/dms/image/v2/C4E12AQE2_pEAGtFSQw/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1637585345564?e=2147483647&v=beta&t=5Qsmmxr5c3Lo4QeJAA5m6G3a67Jpt03DZ0Hl2DLPxPI"
                      alt="Price Comparison"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '300px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        mb: 2
                      }}
                    />
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                      By switching to generic alternatives
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Save up to 85%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} component={motion.div} 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ pl: { md: 4 } }}>
                  <Box sx={stepStyles.numberCircle}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>4</Typography>
                  </Box>
                  <Typography variant="h4" sx={stepStyles.stepTitle}>
                    Get Price Comparisons
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Compare prices across multiple platforms to find the best deals for your medications.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Compare prices across multiple platforms" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="View detailed price breakdowns" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Find the best deals and discounts" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Safety Section */}
          <Box 
            sx={{ 
              mb: { xs: 6, md: 10 }, 
              p: 4, 
              borderRadius: '16px',
              backgroundColor: 'rgba(103, 194, 124, 0.1)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.dark }}>
                Our Commitment to Safety
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto', mb: 4 }}>
                MedGenix only recommends generic medications that have been proven to be bioequivalent to their brand-name counterparts. We prioritize your health and safety above all else.
              </Typography>
            </Box>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.dark }}>
                    Bioequivalent
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Generic medications contain the same active ingredients and work the same way in the body.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Call to Action */}
          <Box 
            sx={{ textAlign: 'center' }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.dark }}>
              Ready to Start Saving?
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Join thousands of users who are already saving on their prescription medications with MedGenix.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              component={RouterLink}
              to="/"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(to bottom, #67c27c, #008080)',
                '&:hover': {
                  background: 'linear-gradient(to bottom, #5bb36f, #006666)',
                  boxShadow: '0 6px 15px rgba(0, 128, 128, 0.3)',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default HowItWorksPage; 