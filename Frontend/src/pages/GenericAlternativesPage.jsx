import React, { useState } from 'react';
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
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '800px',
  margin: '0 auto',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  marginBottom: theme.spacing(3),
}));

const GenericAlternativesPage = () => {
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState(null);
  const [medicines, setMedicines] = useState([{ id: 1, name: '' }]);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '' }]);
  };

  const handleRemoveMedicine = (id) => {
    // Get the medicine name before removing it
    const medicineToRemove = medicines.find(med => med.id === id);
    
    // Remove from medicines array
    setMedicines(medicines.filter(med => med.id !== id));

    // If there are alternatives and we found the medicine to remove
    if (alternatives.length > 0 && medicineToRemove) {
      // Remove the corresponding alternative from the alternatives array
      setAlternatives(alternatives.filter(alt => 
        alt.brand_details.brand_name.toLowerCase() !== medicineToRemove.name.toLowerCase()
      ));
    }
  };

  const handleMedicineChange = (id, value) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, name: value } : med
    ));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setAlternatives([]);

      // Filter out empty medicine names and create search data
      const validMedicines = medicines.filter(med => med.name.trim());
      if (validMedicines.length === 0) {
        setError('Please enter at least one medicine name');
        setLoading(false);
        return;
      }

      // Create search data in the format expected by the API
      const searchData = validMedicines.map(med => ({
        brand_name: med.name.trim(),
        dosage: '',
        frequency: '',
        duration: ''
      }));

      // Get alternatives from the production API
      const response = await axios.post(
        'https://medgenix-production.up.railway.app/api/generic-alternatives/',
        searchData
      );
      setAlternatives(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching alternatives:', err);
      setError('Failed to fetch generic alternatives. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
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
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchContainer>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.dark',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2rem' }
              }}
            >
              Enter Your Medication
            </Typography>

            {medicines.map((medicine) => (
              <Box key={medicine.id} sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter medication name..."
                  value={medicine.name}
                  onChange={(e) => handleMedicineChange(medicine.id, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                {medicines.length > 1 && (
                  <IconButton 
                    size="small"
                    onClick={() => handleRemoveMedicine(medicine.id)}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        color: 'text.primary',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddMedicine}
                sx={{ borderRadius: '50px' }}
              >
                Add Another Medicine
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} color="inherit" />}
                sx={{ 
                  borderRadius: '50px',
                  background: 'linear-gradient(to bottom, #67c27c, #008080)',
                  '&:hover': {
                    background: 'linear-gradient(to bottom, #5bb36f, #006666)',
                  }
                }}
              >
                {loading ? 'Searching...' : 'Search Alternatives'}
              </Button>
            </Box>

            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </SearchContainer>

          {alternatives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {alternatives.map((medicine, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{ 
                    overflow: 'hidden',
                    maxWidth: '800px',
                    margin: '0 auto',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {medicine.brand_details.brand_name}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Generic Alternative
                    </Typography>
                    <Grid container spacing={2}>
                      {medicine.generic_alternatives.slice(0, 1).map((alternative, altIndex) => (
                        <Grid item xs={12} key={altIndex}>
                          <StyledCard>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                                {alternative.generic_name}
                              </Typography>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {alternative.differences}
                              </Typography>
                            </CardContent>
                          </StyledCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
      <Box sx={{ position: 'relative', zIndex: 1, backgroundColor: 'white' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default GenericAlternativesPage; 