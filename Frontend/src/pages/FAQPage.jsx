import { 
  Box, 
  Container, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  useMediaQuery,
  Paper,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';

const faqs = [
  {
    question: "What is MedGenix?",
    answer: "MedGenix is a platform designed to help you find more affordable alternatives to your prescribed medications. We analyze medication information to identify generic equivalents that can save you up to 70% while maintaining the same efficacy and safety as brand-name drugs."
  },
  {
    question: "Is MedGenix free to use?",
    answer: "Yes, MedGenix's core features are completely free to use. You can view generic alternatives and compare prices at different pharmacies without any charge. We may offer premium features in the future, but our essential services will always remain free."
  },
  {
    question: "How accurate are the generic medicine recommendations?",
    answer: "MedGenix recommendations are highly accurate as they're based on FDA-approved bioequivalent medications. All generic alternatives contain the same active ingredients, dosage forms, safety profiles, and strength as their brand-name counterparts. Our database is regularly updated to ensure you receive the most current information."
  },
  {
    question: "Can I buy medicines directly from MedGenix?",
    answer: "No, MedGenix is not a pharmacy and does not sell medications directly. We provide information about generic alternatives and where to find them at the best prices. You'll need to purchase your medications from licensed pharmacies, either online or in-person, using the information we provide."
  },
  {
    question: "How does MedGenix compare medicine prices?",
    answer: "MedGenix connects to a comprehensive database of pharmacy pricing information across thousands of locations. When you search for a medication, we query this database in real-time to show you current prices at pharmacies near your location. This helps you find the most affordable option for your prescription."
  },
  {
    question: "Does MedGenix support multiple languages?",
    answer: "Yes, MedGenix currently supports several languages including English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, and Kannada. We're continually working to add more languages to make our platform accessible to a wider audience."
  },
  {
    question: "How does the \"Find Nearby Generic Pharmacy\" feature work?",
    answer: "The \"Find Nearby Generic Pharmacy\" feature uses your current location (with your permission) to identify pharmacies in your vicinity that carry the generic medications you need. We display these pharmacies on a map, along with their distance from you, operating hours, and the prices they offer for your specific medications."
  },
  {
    question: "Is my personal data safe on MedGenix?",
    answer: "Yes, we take data security very seriously. All personal information and medication data are encrypted using industry-standard protocols. We never share your personal health information with third parties without your explicit consent, and we comply with all relevant data protection regulations. Our systems undergo regular security audits to ensure your data remains protected."
  },
  {
    question: "How can I reset my password if I forget it?",
    answer: "If you forget your password, simply click on the \"Forgot Password\" link on the login page. Enter the email address associated with your account, and we'll send you a secure link to reset your password. For security reasons, the link will expire after 24 hours. If you don't receive the email, check your spam folder or contact our support team for assistance."
  }
];

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
          backgroundImage: 'url(https://images.squarespace-cdn.com/content/5f64c5c0089e7a2b75f39878/1625659197694-49OVEX1IN0UAFV8733XU/shutterstock_1898898127.jpg?content-type=image%2Fjpeg)',
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
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(1px)',
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
              mb: { xs: 6, md: 8 },
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
              Frequently Asked Questions
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
              Find answers to the most common questions about MedGenix
            </Typography>
          </Box>

          {/* FAQ Section */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ mb: { xs: 6, md: 10 } }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '1px solid rgba(0, 128, 128, 0.1)',
                mb: 4
              }}
            >
              {faqs.map((faq, index) => (
                <Accordion 
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  disableGutters
                  elevation={0}
                  sx={{
                    backgroundColor: 'transparent',
                    borderBottom: index !== faqs.length - 1 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                    '&:before': {
                      display: 'none',
                    },
                    '&.Mui-expanded': {
                      margin: 0,
                      backgroundColor: 'rgba(103, 194, 124, 0.05)',
                    },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon 
                        sx={{ 
                          color: theme.palette.primary.main,
                          transition: 'transform 0.3s ease',
                          transform: expanded === `panel${index}` ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    }
                    aria-controls={`panel${index}d-content`}
                    id={`panel${index}d-header`}
                    sx={{
                      padding: { xs: 2, md: 3 },
                      '&:hover': {
                        backgroundColor: 'rgba(103, 194, 124, 0.05)',
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: '0 !important',
                      },
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: expanded === `panel${index}` ? theme.palette.primary.main : theme.palette.text.primary,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      padding: { xs: 2, md: 3 },
                      paddingTop: 0,
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        lineHeight: 1.7,
                        maxWidth: '90%',
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Box>

          {/* Trust Section */}
          <Box 
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              p: 4, 
              borderRadius: '16px',
              backgroundColor: 'rgba(0,128,128, 0.15)',
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.dark }}>
                Still have questions?
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto', mb: 3 }}>
                Our customer support team is here to help. Contact us through email or our live chat feature to get personalized assistance.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                component={RouterLink}
                to="/contact"
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
                Contact Support
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default FAQPage;