import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChemistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [trendingMedicines, setTrendingMedicines] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendsLoading, setTrendsLoading] = useState(true);
  
  // Get first name from user object
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Fetch trending medicines
  useEffect(() => {
    const fetchTrendingMedicines = async () => {
      try {
        setTrendingLoading(true);
        const response = await fetch('http://localhost:8000/api/medicines/trending', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trending medicines');
        }

        const data = await response.json();
        if (data.success && data.medicines.length > 0) {
          setTrendingMedicines(data.medicines);
          setSelectedMedicine(data.medicines[0].genericName);
        }
      } catch (error) {
        console.error('Error fetching trending medicines:', error);
        setError('Failed to fetch trending medicines');
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingMedicines();
  }, []);

  // Fetch monthly trends when selected medicine changes
  useEffect(() => {
    const fetchMonthlyTrends = async () => {
      if (!selectedMedicine) return;

      try {
        setTrendsLoading(true);
        const response = await fetch(`http://localhost:8000/api/medicines/trends/${encodeURIComponent(selectedMedicine)}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch medicine trends');
        }

        const data = await response.json();
        if (data.success) {
          setMonthlyTrends(data.trends.map(trend => ({
            month: new Date(trend.year, trend.month - 1).toLocaleString('default', { month: 'short' }),
            count: trend.count
          })));
        }
      } catch (error) {
        console.error('Error fetching medicine trends:', error);
        setError('Failed to fetch medicine trends');
      } finally {
        setTrendsLoading(false);
      }
    };

    fetchMonthlyTrends();
  }, [selectedMedicine]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/prescriptions', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch prescriptions');
        }

        const data = await response.json();
        console.log('Fetched prescriptions:', data);

        // Transform the data to match the required structure
        const transformedPrescriptions = data.prescriptions.map(prescription => ({
          _id: prescription._id,
          imageUrl: prescription.imageUrl,
          createdAt: prescription.createdAt,
          result: {
            medicines: prescription.medicines || [],
            doctor_name: prescription.doctor_name,
            hospital_name: prescription.hospital_name,
            date: prescription.date,
            patient_details: prescription.patient_details
          }
        }));

        setPrescriptions(transformedPrescriptions);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleViewPrescription = async (prescription) => {
    try {
      // Store the complete prescription data in sessionStorage
      sessionStorage.setItem(`prescription_${prescription._id}`, JSON.stringify({
        _id: prescription._id,
        imageUrl: prescription.imageUrl,
        createdAt: prescription.createdAt,
        result: {
          medicines: prescription.result.medicines || [],
          doctor_name: prescription.result.doctor_name,
          hospital_name: prescription.result.hospital_name,
          date: prescription.result.date,
          patient_details: prescription.result.patient_details
        }
      }));
      
      // Navigate to the prescription detail page
      navigate(`/prescription/${prescription._id}`);
    } catch (error) {
      console.error('Error handling prescription view:', error);
    }
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.result.medicines.some(med => 
      med.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || 
    (prescription.result.patient_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (prescription.result.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Calculate statistics
  const totalPrescriptions = prescriptions.length;
  const totalMedicines = prescriptions.reduce((total, prescription) => 
    total + (prescription.result?.medicines?.length || 0), 0
  );

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Welcome and Search Section */}
        <Box sx={{ px: 15, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  width: 48, 
                  height: 48,
                  bgcolor: '#008080',
                  mr: 2
                }}>
                  <LocalPharmacyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600, 
                    color: '#008080',
                    fontSize: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    Welcome, Dr. {firstName}! <span style={{ fontSize: '1.5rem' }}>👋</span>
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Your Pharmacy Dashboard
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <TextField
                  size="small"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    width: 300,
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ px: 15, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Statistics Section */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ 
                    height: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: '#e8f5e9',
                          color: '#008080',
                          mr: 2
                        }}>
                          <LocalPharmacyIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#008080' }}>
                            {totalPrescriptions}
                          </Typography>
                          <Typography color="text.secondary">
                            Total Prescriptions
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ 
                    height: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          bgcolor: '#e8f5e9',
                          color: '#008080',
                          mr: 2
                        }}>
                          <MedicationIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 600, color: '#008080' }}>
                            {totalMedicines}
                          </Typography>
                          <Typography color="text.secondary">
                            Total Medicines
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        {/* Trending Medicines and Graph Section */}
        <Box sx={{ px: 15, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Trending Medicines List */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                height: '400px',
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ fontSize: 32, mr: 2, color: '#008080' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#008080' }}>
                    Top 10 Trending Medicines
                  </Typography>
                </Box>
                {trendingLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 60px)' }}>
                    <CircularProgress />
                  </Box>
                ) : trendingMedicines.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 60px)' }}>
                    <Typography color="text.secondary">No trending medicines data available</Typography>
                  </Box>
                ) : (
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
                    {trendingMedicines.map((medicine, index) => (
                      <React.Fragment key={medicine.genericName}>
                        <ListItem 
                          button
                          onClick={() => setSelectedMedicine(medicine.genericName)}
                          sx={{
                            bgcolor: selectedMedicine === medicine.genericName ? '#f5fbf6' : 'transparent',
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
                                color: selectedMedicine === medicine.genericName ? '#008080' : 'text.primary'
                              }}>
                                {medicine.genericName}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                Total Searches: {medicine.searchCount}
                              </Typography>
                            }
                          />
                          <Typography variant="h6" sx={{ 
                            color: index < 3 ? '#67c27c' : '#008080',
                            fontWeight: 600
                          }}>
                            {medicine.searchCount}
                          </Typography>
                        </ListItem>
                        {index < trendingMedicines.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>

            {/* Monthly Trends Graph */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                height: '400px',
                borderRadius: 2,
                bgcolor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BarChartIcon sx={{ fontSize: 32, mr: 2, color: '#008080' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#008080' }}>
                    Monthly Trends - {selectedMedicine || 'Select a Medicine'}
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 60px)' }}>
                  {trendsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress />
                    </Box>
                  ) : monthlyTrends.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography color="text.secondary">No trend data available</Typography>
                    </Box>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrends}>
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
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Recent Prescriptions */}
        <Box sx={{ px: 15, mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Prescription History
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Typography>

          <Paper
            elevation={2}
            sx={{
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {/* Column Headers */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '250px 1fr 100px',
                gap: 2,
                p: 2,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                bgcolor: 'rgba(0, 0, 0, 0.02)'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Date
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
                Medicines
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Actions
              </Typography>
            </Box>

            {/* Scrollable List */}
            <List
              sx={{
                height: 'calc(100% - 48px)',
                overflow: 'auto',
                '& .MuiListItem-root': {
                  height: '68px',
                },
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  },
                },
              }}
            >
              {filteredPrescriptions.map((prescription, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '250px 1fr 100px',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ fontSize: 20, mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1">
                      {new Date(prescription.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <Chip
                      size="medium"
                      label={`${prescription.result.medicines.length} Medicines`}
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.875rem',
                        height: '32px',
                        minWidth: '120px'
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewPrescription(prescription)}
                      sx={{ color: 'primary.main' }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
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
                {selectedPrescription.result.patient_details?.name || 'Unknown Patient'}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {formatDate(selectedPrescription.createdAt)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Medicines:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedPrescription.result.medicines.map((medicine, index) => (
                    <Chip
                      key={index}
                      label={medicine.brand_name}
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