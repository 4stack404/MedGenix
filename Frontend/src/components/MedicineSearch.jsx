import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { Search as SearchIcon, MedicalServices, Science } from '@mui/icons-material';
import { getMedicineInfo } from '../services/medicineService';

function MedicineSearch() {
  const [medicineName, setMedicineName] = useState('');
  const [medicineData, setMedicineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!medicineName.trim()) return;
    
    setLoading(true);
    setError(null);
    setMedicineData(null);
    
    try {
      // Use the API service to get medicine info
      const response = await getMedicineInfo(medicineName);
      console.log('Medicine info API response:', response);
      
      setMedicineData(response);
    } catch (err) {
      console.error('Error during medicine search:', err);
      setError(err.response?.data?.detail || 'Failed to fetch medicine information');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (medicineData) {
      navigate(`/generic/medicine/${medicineName}`);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Medicine Information
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="Enter medicine name"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mr: 1 }}
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          sx={{ 
            minWidth: '120px',
            fontWeight: 600
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {medicineData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {medicineData.medicine_name || medicineName}
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          {medicineData.uses && medicineData.uses.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Uses:</Typography>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                {medicineData.uses.map((use, index) => (
                  <li key={index}>{use}</li>
                ))}
              </ul>
            </Box>
          )}
          
          {medicineData.how_it_works && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>How it Works:</Typography>
              <Typography variant="body2">{medicineData.how_it_works}</Typography>
            </Box>
          )}
          
          {medicineData.common_side_effects && medicineData.common_side_effects.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Common Side Effects:</Typography>
              <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                {medicineData.common_side_effects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </Box>
          )}
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleViewDetails}
            fullWidth
            sx={{ mt: 2 }}
          >
            View Full Details
          </Button>
        </Box>
      )}
      
      {!medicineData && !loading && !error && medicineName.trim() !== '' && (
        <Typography color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          Enter a medicine name and click Search to find information
        </Typography>
      )}
    </Paper>
  );
}

export default MedicineSearch; 