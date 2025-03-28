import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  CheckCircle, 
  LocalHospital, 
  People, 
  Speed, 
  Security,
  EmojiEvents,
  TrendingUp,
  LightbulbOutlined,
  Timeline,
  TrendingUpOutlined
} from '@mui/icons-material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AboutUsPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Header />
      
      {/* Hero Image Section */}
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '500px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }
      }}>
        <Box
          component="img"
          src="https://media.istockphoto.com/id/1190193669/photo/doctor-filling-out-a-prescription.jpg?s=612x612&w=0&k=20&c=DUtf8Yt9fl--E-KQdRQjwrRdRHmoev-mSUPd8tdGrRM="
          alt="Doctor writing prescription"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%',
          zIndex: 2
        }}>
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3.5rem' },
              maxWidth: '900px',
              mx: 'auto',
              px: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.4
            }}
          >
            We make healthcare
            <br />
            Understandable, Accessible and Affordable
          </Typography>
        </Box>
      </Box>

      <Box sx={{ bgcolor: '#f5f9fc' }}>
        <Container maxWidth="lg" sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Hero Section */}
          <Box sx={{ mb: 8, textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              mb: 4
            }}>
              About MedGenix
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              MedGenix is India's leading healthcare platform, making healthcare accessible and affordable for all. By leveraging advanced OCR and AI technology, MedGenix scans prescriptions, identifies cheaper yet effective medicine substitutes, and provides real-time price comparisons from multiple online pharmacies. Our journey began in 2024 when we recognized the challenges faced by millions in accessing and understanding healthcare information. We provide accurate, authoritative & trustworthy information on medicines, helping people use their medications effectively and safely. Through our platform, we deliver medicines and health products to 1000+ cities across India from licensed pharmacies, offer diagnostic services from certified labs, and provide online doctor consultations. Our mission is to create a healthcare ecosystem that puts patients first, driven by innovation, trust, and continuous growth. We're committed to expanding our medical content in multiple local languages and fostering a supportive community where users can share experiences and find guidance in their healthcare journey.
            </Typography>
          </Box>

          {/* Our Story Section with Timeline */}
          <Box sx={{ mb: 8, width: '100%' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}>
              Our Story
            </Typography>

            <Grid container spacing={4}>
              {/* The Idea Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    width: 100,
                    height: 100,
                    bgcolor: 'rgba(0, 128, 128, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <LightbulbOutlined sx={{ fontSize: 50, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    The idea
                  </Typography>
                  <Typography variant="body1" paragraph>
                    In healthcare, the information around our medicines and lab tests is either unavailable or incomprehensible to us.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    So we decided to create a platform that stood for transparent, authentic and accessible information for all.
                  </Typography>
                  <Typography variant="body1">
                    This idea grew into a company and MedGenix was created in 2024.
                  </Typography>
                </Box>
              </Grid>

              {/* What we offer Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    width: 100,
                    height: 100,
                    bgcolor: 'rgba(0, 128, 128, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <Timeline sx={{ fontSize: 50, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    What we offer
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="We provide accurate, authoritative & trustworthy information on medicines and help people use their medicines effectively and safely."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="We get medicines and other health products delivered at home in 1000+ cities across India from licensed and verified pharmacies."
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="We also provide diagnostic services from certified labs and online doctor consults at any time, from anywhere."
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>

              {/* The journey so far Section */}
              <Grid item xs={12} sx={{ mt: -6.25 }}>
                <Box sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    width: 100,
                    height: 100,
                    bgcolor: 'rgba(0, 128, 128, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <TrendingUpOutlined sx={{ fontSize: 50, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    The journey so far
                  </Typography>
                  <Typography variant="body1" paragraph>
                    We've made health care accessible to millions by giving them quality care at affordable prices.
                  </Typography>
                  <Typography variant="body1" sx={{ mt: -2 }}>
                    We continue to expand our rich and extensive medical content and are working hard to make this information available in multiple local languages.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Our Mission Section */}
          <Box sx={{ mb: 8, textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 3
            }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              To make healthcare accessible and affordable for every Indian by leveraging technology and innovation. We aim to create a healthcare ecosystem that puts patients first, ensuring quality care and medications are available to all.
            </Typography>
          </Box>

          {/* What We Do Section */}
          <Box sx={{ mb: 8, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 3
            }}>
              What We Do
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospital sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Prescription Management
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    We help users understand their prescriptions, find generic alternatives, and manage their medications efficiently through our advanced prescription scanning and analysis system.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Affordable Generic Alternatives
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Get doctor-verified, cost-effective medicine substitutes with the same efficacy as branded drugs.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Why Use Generic Section */}
          <Box sx={{ mb: 8, width: '100%', textAlign: 'center', mt: 2.5 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 2
            }}>
              Why Use Generic Medicines?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 2 }}>
              Generic medicines are pharmaceutical drugs that contain the same active ingredients as their branded counterparts. They are manufactured once the patent for a brand-name drug expires, offering a more affordable alternative without compromising quality, safety, or effectiveness. These medicines undergo strict regulatory approvals and are widely used by healthcare professionals worldwide.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Same Effectiveness & Safety
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Generic medicines have the same active ingredients, dosage, strength, and intended use as branded drugs.
                  </Typography>
                  <Typography variant="body2">
                    They undergo rigorous testing by regulatory authorities like the CDSCO (India), FDA (USA), and WHO to ensure safety and effectiveness.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEvents sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Cost-Effective & Affordable
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Generic medicines are 70-90% cheaper than branded ones because they do not involve heavy research, development, and marketing costs.
                  </Typography>
                  <Typography variant="body2">
                    They provide budget-friendly treatment options without compromising on quality.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Approved by Health Authorities
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    In India, generic medicines are regulated by the Central Drugs Standard Control Organization (CDSCO) to meet strict quality standards.
                  </Typography>
                  <Typography variant="body2">
                    These medicines must prove bioequivalence, ensuring they work the same way as their branded versions.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospital sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Prescribed by Healthcare Professionals
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Many doctors recommend generic alternatives as they are clinically proven to be just as effective.
                  </Typography>
                  <Typography variant="body2">
                    Hospitals and government health programs also encourage generic medicines for cost-efficient treatments.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Our Values Section */}
          <Box sx={{ mb: 8, width: '100%', textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 2
            }}>
              Our Values
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Speed sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Innovation
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    We constantly innovate to provide better healthcare solutions and improve user experience.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Security sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Trust
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    We build trust through transparency, reliability, and commitment to user privacy.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ color: 'primary.main', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: 'primary.main' }}>
                      Growth
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    We focus on continuous growth and improvement to better serve our users.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Join Us Section */}
          <Box sx={{ 
            p: 4, 
            bgcolor: 'rgba(0, 128, 128, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(0, 128, 128, 0.1)',
            textAlign: 'center',
            maxWidth: '900px',
            width: '100%'
          }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              mb: 2
            }}>
              Join Us in Making Healthcare Better
            </Typography>
            <Typography variant="body1" paragraph>
              We're always looking for passionate individuals who want to make a difference in healthcare. Join our team and help us build a healthier India.
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
              careers@medgenix.com
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AboutUsPage; 