import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Button, 
  Chip, 
  Divider,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  LocalPharmacy, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  CheckCircle,
  ArrowForward,
  Fullscreen
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Demo prescription data with updated format
const demoMedicines = [
  { id: 1, brand_name: "Lipitor", dosage: "10 mg", frequency: "1 tab daily" },
  { id: 2, brand_name: "Glucophage", dosage: "500 mg", frequency: "1 tab BID" },
  { id: 3, brand_name: "Cozaar", dosage: "50 mg", frequency: "1 tab daily" },
  { id: 4, brand_name: "Synthroid", dosage: "25 mcg", frequency: "1 tab daily AM" },
  { id: 5, brand_name: "Norvasc", dosage: "5 mg", frequency: "1 tab daily" },
];

const PrescriptionPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedMed, setSelectedMed] = useState(null);
  const [processedImage, setProcessedImage] = useState('/images/Sample_Prescription.png');
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  // Handle medicine click
  const handleMedicineClick = (med) => {
    navigate(`/medicine/${med.id}`);
  };
  
  // Handle finding generic alternatives for all medicines
  const handleFindGenerics = () => {
    // In a real app, this would redirect to a page showing all generic alternatives
    navigate('/generic-alternatives', { state: { medicines: demoMedicines } });
  };
  
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: '#f7fdfd'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/images/MedGenix Logo.png" 
            alt="MedGenix Logo" 
            style={{ width: 100, marginBottom: 20 }} 
          />
        </motion.div>
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 4, md: 6 },
          backgroundColor: '#f7fdfd', 
          minHeight: 'calc(100vh - 150px)' 
        }}
      >
        <Container maxWidth="lg">
          {/* Page Title */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ mb: 4, textAlign: 'center' }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Your Prescription
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              We've analyzed your prescription and identified the medications below.
            </Typography>
          </Box>
          
          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Left Side - Prescription Image */}
            <Grid item xs={12} md={6} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    transition: 'all 0.3s ease-in-out',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 30px rgba(0, 128, 128, 0.15)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '6px',
                      background: 'linear-gradient(to right, #67c27c, #008080)',
                    }
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -5,
                          left: 0,
                          width: '40px',
                          height: '2px',
                          background: 'linear-gradient(to right, #67c27c, #008080)',
                          borderRadius: '4px',
                        }
                      }}
                    >
                      Uploaded Prescription
                    </Typography>
                    <Box>
                      <Tooltip title="Zoom In">
                        <IconButton 
                          onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(103, 194, 124, 0.08)'
                            }
                          }}
                        >
                          <ZoomIn />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom Out">
                        <IconButton 
                          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(103, 194, 124, 0.08)'
                            }
                          }}
                        >
                          <ZoomOut />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Full Size">
                        <IconButton 
                          onClick={() => window.open(processedImage, '_blank')}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'rgba(103, 194, 124, 0.08)'
                            }
                          }}
                        >
                          <Fullscreen />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      height: 450, 
                      overflow: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      mb: 2,
                      boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <Box
                      component="img"
                      src={processedImage}
                      alt="Prescription"
                      sx={{ 
                        width: `${zoom * 100}%`,
                        transition: 'all 0.3s ease',
                        transformOrigin: 'center',
                        maxWidth: '100%',
                        borderRadius: 1
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Button 
                        variant="outlined" 
                        startIcon={<Download />}
                        sx={{ 
                          borderRadius: 4,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          px: 3,
                          py: 1,
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'rgba(0, 128, 128, 0.04)',
                            boxShadow: '0 4px 8px rgba(0, 128, 128, 0.15)'
                          }
                        }}
                      >
                        Download Prescription
                      </Button>
                    </motion.div>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
            
            {/* Right Side - Extracted Medicines */}
            <Grid item xs={12} md={6} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '6px',
                      background: 'linear-gradient(to right, #67c27c, #008080)',
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main', 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '60px',
                        height: '3px',
                        background: 'linear-gradient(to right, #67c27c, #008080)',
                        borderRadius: '4px',
                      }
                    }}
                  >
                    <LocalPharmacy sx={{ mr: 1 }} /> Extracted Medicines
                    <Chip 
                      label={`${demoMedicines.length} found`} 
                      size="small" 
                      color="primary" 
                      sx={{ 
                        ml: 2, 
                        bgcolor: 'rgba(0, 128, 128, 0.1)', 
                        color: 'primary.main',
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Typography>
                  
                  <List sx={{ mb: 3, flexGrow: 1 }}>
                    {demoMedicines.map((med, index) => (
                      <motion.div 
                        key={med.id}
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 300,
                          delay: index * 0.1 
                        }}
                      >
                        <ListItem 
                          button 
                          sx={{ 
                            mb: 2, 
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: selectedMed === med.id ? 'primary.main' : 'rgba(0, 0, 0, 0.08)',
                            bgcolor: selectedMed === med.id ? 'rgba(103, 194, 124, 0.1)' : 'white',
                            transition: 'all 0.2s ease-in-out',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '6px',
                              height: '100%',
                              background: 'linear-gradient(to bottom, #67c27c, #008080)',
                              opacity: selectedMed === med.id ? 1 : 0.7,
                              transition: 'opacity 0.2s ease-in-out',
                            },
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'rgba(103, 194, 124, 0.05)',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                              '&::before': {
                                opacity: 1,
                              }
                            },
                            pl: 3,
                          }}
                          onClick={() => handleMedicineClick(med)}
                          onMouseEnter={() => setSelectedMed(med.id)}
                          onMouseLeave={() => setSelectedMed(null)}
                        >
                          <ListItemText 
                            primary={
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                                fontSize: '1.05rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}>
                                {med.brand_name}
                                <Chip 
                                  label={med.dosage} 
                                  size="small" 
                                  sx={{ 
                                    ml: 1.5, 
                                    fontSize: '0.75rem',
                                    backgroundColor: 'rgba(0, 128, 128, 0.08)',
                                    color: 'primary.main',
                                    fontWeight: 500,
                                    borderRadius: '4px',
                                    height: '22px'
                                  }} 
                                />
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& svg': {
                                      fontSize: '0.9rem',
                                      mr: 0.5,
                                      color: 'rgba(0, 128, 128, 0.7)'
                                    }
                                  }}
                                >
                                  <Box component="span" sx={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    mr: 2,
                                    p: 0.5,
                                    pl: 1,
                                    pr: 1,
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(103, 194, 124, 0.07)',
                                    fontSize: '0.8rem',
                                  }}>
                                    {med.frequency}
                                  </Box>
                                </Typography>
                              </Box>
                            }
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 36, 
                              height: 36, 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              backgroundColor: selectedMed === med.id ? 'rgba(103, 194, 124, 0.2)' : 'transparent',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: 'rgba(103, 194, 124, 0.2)',
                              }
                            }}>
                              <ArrowForward 
                                sx={{ 
                                  color: 'primary.main', 
                                  fontSize: '1.2rem',
                                  opacity: selectedMed === med.id ? 1 : 0.6,
                                  transition: 'all 0.2s ease-in-out'
                                }} 
                              />
                            </Box>
                          </Box>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.03,
                        y: -3
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10
                      }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<CheckCircle />}
                        onClick={handleFindGenerics}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontWeight: 600,
                          borderRadius: 8,
                          background: 'linear-gradient(45deg, #008080 30%, #67c27c 90%)',
                          boxShadow: '0 4px 15px rgba(0, 128, 128, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #006666 30%, #5bb26c 90%)',
                            boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Find Generic Alternatives
                      </Button>
                    </motion.div>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& svg': {
                          fontSize: '1rem',
                          mr: 0.5,
                          color: '#67c27c'
                        }
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, color: '#008080' }}>Save up to 85%</Box>&nbsp;by switching to generic alternatives
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PrescriptionPage; 
