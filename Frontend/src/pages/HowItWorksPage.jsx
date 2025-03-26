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
                    Enter Your Medication
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Start by entering the name of your prescribed medication. Our system will identify it and prepare to find alternatives.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Search by brand or generic name" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Specify dosage and form" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Add multiple medications if needed" />
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
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter medication name..."
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.light,
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Popular searches:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {popularMedications.map((med, index) => (
                      <Chip
                        key={index}
                        label={med}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(103, 194, 124, 0.1)',
                          color: theme.palette.primary.dark,
                          '&:hover': {
                            backgroundColor: 'rgba(103, 194, 124, 0.2)',
                          },
                        }}
                      />
                    ))}
                  </Box>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MedicationIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Generic Alternatives for Lipitor
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Atorvastatin 10mg</Typography>
                        <Chip 
                          label="85% Savings" 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(103, 194, 124, 0.2)', 
                            color: '#4a9d5d',
                            fontWeight: 500 
                          }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Generic</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>$12.99</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Atorvastatin 20mg</Typography>
                        <Chip 
                          label="83% Savings" 
                          size="small" 
                          sx={{ 
                            backgroundColor: 'rgba(103, 194, 124, 0.2)', 
                            color: '#4a9d5d',
                            fontWeight: 500 
                          }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">Generic</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>$15.50</Typography>
                      </Box>
                    </Box>
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
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>2</Typography>
                  </Box>
                  <Typography variant="h4" sx={stepStyles.stepTitle}>
                    View Generic Alternatives
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    We'll show you FDA-approved generic alternatives to your medication that can save you money without compromising on quality.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Compare active ingredients" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="See potential savings percentages" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Read about bioequivalence" />
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
                    Compare Pharmacy Prices
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    We'll show you which pharmacies near you offer the best prices for your medication, helping you save even more.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Compare prices across multiple pharmacies" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="See distance and location information" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Filter by distance or price" />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalPharmacyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Pharmacy Prices for Atorvastatin 10mg
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>PharmaSave</Typography>
                        <Typography variant="body2" color="textSecondary">1.2 miles away</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">30 tablets</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>$12.99</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ pb: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>MediMart</Typography>
                        <Typography variant="body2" color="textSecondary">0.8 miles away</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="textSecondary">30 tablets</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>$14.50</Typography>
                      </Box>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SavingsIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Potential Savings
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>By switching to generic alternatives</Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 700,
                        backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      Save up to 85%
                    </Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>That's $77.00 per month or $924.00 per year</Typography>
                    <Button 
                      variant="contained" 
                      size="large"
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
                      Get Your Savings
                    </Button>
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
                    Save Money on Your Prescriptions
                  </Typography>
                  <Typography variant="body1" sx={stepStyles.stepDescription}>
                    Take your prescription to your chosen pharmacy or discuss the generic alternatives with your healthcare provider to start saving.
                  </Typography>
                  <List disablePadding>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Print or email your savings information" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Show to your pharmacist or doctor" />
                    </ListItem>
                    <ListItem disablePadding sx={stepStyles.listItem}>
                      <ListItemIcon sx={stepStyles.listIcon}>
                        <CheckCircleOutlineIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Track your savings over time" />
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
                MedGenix only recommends FDA-approved generic medications that have been proven to be bioequivalent to their brand-name counterparts. We prioritize your health and safety above all else.
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.dark }}>
                    FDA Approved
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    All recommended medications are FDA-approved and meet strict quality standards.
                  </Typography>
                </Paper>
              </Grid>
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
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px', textAlign: 'center', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.dark }}>
                    Verified Pharmacies
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    We only partner with licensed pharmacies that meet our quality standards.
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