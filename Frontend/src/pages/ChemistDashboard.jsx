import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Avatar,
  CardHeader,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BarChartIcon from '@mui/icons-material/BarChart';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for prescriptions with image URLs
const dummyPrescriptions = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2024-03-27",
    medicines: ["Amoxicillin 500mg", "Paracetamol 650mg"],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2024-03-26",
    medicines: ["Metformin 1000mg", "Aspirin 75mg"],
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    patientName: "Mike Wilson",
    date: "2024-03-25",
    medicines: ["Lisinopril 10mg", "Amlodipine 5mg"],
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    patientName: "Sarah Davis",
    date: "2024-03-24",
    medicines: ["Omeprazole 20mg", "Sertraline 50mg"],
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    patientName: "Tom Harris",
    date: "2024-03-23",
    medicines: ["Gabapentin 300mg", "Metoprolol 25mg"],
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    patientName: "Emily White",
    date: "2024-03-22",
    medicines: ["Atorvastatin 40mg", "Losartan 50mg"],
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&h=300&fit=crop"
  }
];

// Dummy data for trending medicines
const dummyTrendingMedicines = [
  { name: "Paracetamol", count: 150 },
  { name: "Amoxicillin", count: 120 },
  { name: "Metformin", count: 100 },
  { name: "Aspirin", count: 90 },
  { name: "Omeprazole", count: 85 },
  { name: "Lisinopril", count: 80 },
  { name: "Amlodipine", count: 75 },
  { name: "Metoprolol", count: 70 },
  { name: "Gabapentin", count: 65 },
  { name: "Sertraline", count: 60 }
];

// Dummy data for monthly trends
const monthlyTrends = {
  Paracetamol: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 130 },
    { month: 'Mar', count: 150 },
    { month: 'Apr', count: 140 },
    { month: 'May', count: 160 },
    { month: 'Jun', count: 145 }
  ],
  Amoxicillin: [
    { month: 'Jan', count: 90 },
    { month: 'Feb', count: 95 },
    { month: 'Mar', count: 120 },
    { month: 'Apr', count: 110 },
    { month: 'May', count: 125 },
    { month: 'Jun', count: 115 }
  ],
  Metformin: [
    { month: 'Jan', count: 80 },
    { month: 'Feb', count: 85 },
    { month: 'Mar', count: 100 },
    { month: 'Apr', count: 95 },
    { month: 'May', count: 105 },
    { month: 'Jun', count: 90 }
  ]
};

const ChemistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState('Paracetamol');
  const chemistName = "Dr. Sarah Johnson";

  const filteredPrescriptions = dummyPrescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medicines.some(med => med.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8fafb'
    }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Welcome and Search Section */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                width: 56, 
                height: 56,
                background: 'linear-gradient(135deg, #67c27c 0%, #008080 100%)'
              }}>
                <LocalPharmacyIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#008080' }}>
                  Welcome, {chemistName}! 👋
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Your Pharmacy Dashboard
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 300,
                ml: { md: 'auto' },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#67c27c',
                    }
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Trending Medicines and Graph Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Trending Medicines List */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              height: '400px',
              borderRadius: 2,
              bgcolor: 'white',
              overflow: 'hidden'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 32, mr: 2, color: '#008080' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#008080' }}>
                  Top 10 Trending Medicines
                </Typography>
              </Box>
              <List sx={{ 
                height: 'calc(100% - 60px)', 
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#67c27c',
                  borderRadius: '4px',
                },
              }}>
                {dummyTrendingMedicines.map((medicine, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button
                      onClick={() => setSelectedMedicine(medicine.name)}
                      sx={{
                        bgcolor: selectedMedicine === medicine.name ? '#f5fbf6' : 'transparent',
                        '&:hover': {
                          bgcolor: '#f5fbf6'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: index < 3 ? '#67c27c' : '#e8f5e9',
                          color: index < 3 ? 'white' : '#008080'
                        }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 600,
                            color: selectedMedicine === medicine.name ? '#008080' : 'text.primary'
                          }}>
                            {medicine.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            Total Prescriptions: {medicine.count}
                          </Typography>
                        }
                      />
                      <Typography variant="h6" sx={{ 
                        color: index < 3 ? '#67c27c' : '#008080',
                        fontWeight: 600
                      }}>
                        {medicine.count}
                      </Typography>
                    </ListItem>
                    {index < dummyTrendingMedicines.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Monthly Trends Graph */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3, 
              height: '400px',
              borderRadius: 2,
              bgcolor: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BarChartIcon sx={{ fontSize: 32, mr: 2, color: '#008080' }} />
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#008080' }}>
                  Monthly Trends - {selectedMedicine}
                </Typography>
              </Box>
              <Box sx={{ height: 'calc(100% - 60px)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends[selectedMedicine] || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#008080"
                      tick={{ fill: '#008080' }}
                    />
                    <YAxis 
                      stroke="#008080"
                      tick={{ fill: '#008080' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px'
                      }}
                      labelStyle={{ color: '#008080' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#67c27c"
                      strokeWidth={2}
                      dot={{ fill: '#008080', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Prescriptions Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          bgcolor: 'white',
          height: '400px',
          overflow: 'hidden'
        }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#008080' }}>
            Recent Prescriptions
          </Typography>
          <List sx={{ 
            height: 'calc(100% - 60px)', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#67c27c',
              borderRadius: '4px',
            },
          }}>
            {filteredPrescriptions.map((prescription) => (
              <React.Fragment key={prescription.id}>
                <ListItem 
                  button 
                  onClick={() => setSelectedPrescription(prescription)}
                  sx={{
                    '&:hover': {
                      bgcolor: '#f5fbf6'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={prescription.imageUrl}
                      sx={{ 
                        width: 60, 
                        height: 60,
                        cursor: 'pointer'
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {prescription.patientName}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.date}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {prescription.medicines.map((medicine, index) => (
                            <Chip
                              key={index}
                              label={medicine}
                              size="small"
                              sx={{
                                bgcolor: '#e8f5e9',
                                color: '#008080',
                                border: '1px solid',
                                borderColor: '#c8e6c9'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>

      {/* Image Preview Dialog */}
      <Dialog 
        open={!!selectedPrescription} 
        onClose={() => setSelectedPrescription(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prescription Details
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <img 
                  src={selectedPrescription.imageUrl} 
                  alt="Prescription"
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                {selectedPrescription.patientName}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {selectedPrescription.date}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Medicines:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedPrescription.medicines.map((medicine, index) => (
                    <Chip
                      key={index}
                      label={medicine}
                      sx={{
                        bgcolor: '#e8f5e9',
                        color: '#008080',
                        border: '1px solid',
                        borderColor: '#c8e6c9'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default ChemistDashboard;