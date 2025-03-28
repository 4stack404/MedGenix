import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Home,
  ErrorOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NotFoundPage = () => {
  const navigate = useNavigate();

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
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorOutline 
                sx={{ 
                  fontSize: 80, 
                  color: 'primary.main',
                  mb: 2
                }} 
              />
            </Box>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2
              }}
            >
              404
            </Typography>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              Page Not Found
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 600,
                mx: 'auto',
                mb: 4
              }}
            >
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              startIcon={<Home />}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              Return to Home
            </Button>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default NotFoundPage; 