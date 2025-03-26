import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Grid,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Badge,
  useTheme,
  SvgIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import {
  CalendarMonth,
  Medication,
  Visibility,
  MedicalServices,
  Edit,
  Add,
  InfoOutlined,
  ContentPaste,
  Person,
  DocumentScanner,
  LocalPharmacy,
  PictureAsPdf,
  Share,
  KeyboardArrowRight,
  Search,
  FileCopy,
  Money,
  TrendingUp,
  Notifications,
  Storage,
  NotificationsActive,
  MoreVert,
  Close,
  ArrowForward,
  Apartment,
  TimerOutlined,
  ChangeCircle,
  SavingsOutlined,
  Receipt
} from '@mui/icons-material';
import axios from 'axios';
import { formatDate } from '../utils/dateUtils';

// Additional styles for medicine card flip effect
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .medicine-flip-card {
    height: 250px;
    perspective: 1000px;
    transform-style: preserve-3d;
    margin-bottom: 48px;
  }
  
  .cardFront {
    z-index: 2;
    background-color: white;
  }
  
  .cardBack {
    z-index: 1;
    background-color: rgba(0, 128, 128, 0.03);
  }
`;

// Styled components
const StyledPaper = styled(Paper)(() => ({
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  '@media (min-width: 960px)': {
    padding: '32px',
  },
}));

const StyledStatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: 80,
  height: 80,
  marginRight: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  border: '2px solid #008080',
}));

const StyledIconAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: 'rgba(103, 194, 124, 0.15)',
  color: '#008080',
  width: 50,
  height: 50,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
}));

const VisibilityIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(103, 194, 124, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.2)',
  },
}));

const MedicineCard = styled(Paper)(({ theme }) => ({
  padding: 0,
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  position: 'relative',
  height: '250px',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  '&:hover': {
    transform: 'rotateY(180deg)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  }
}));

const MedicineCardSide = styled(Box)(({ theme, isBack }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  '-webkit-backface-visibility': 'hidden',
}));

const ActionButton = styled(Button)(() => ({
  marginTop: '16px',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 128, 128, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 128, 128, 0.3)',
  },
}));

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Add missing state variables
  const [totalSavings, setTotalSavings] = useState(1250);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [savingsData, setSavingsData] = useState([
    { month: 'Jan', savings: 200 },
    { month: 'Feb', savings: 300 },
    { month: 'Mar', savings: 250 },
    { month: 'Apr', savings: 380 },
    { month: 'May', savings: 400 },
    { month: 'Jun', savings: 500 },
    { month: 'Jul', savings: 450 },
    { month: 'Aug', savings: 480 },
    { month: 'Sep', savings: 600 },
    { month: 'Oct', savings: 750 },
    { month: 'Nov', savings: 800 },
    { month: 'Dec', savings: 1250 }
  ]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/prescriptions/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrescriptions(response.data);
        setTotalPrescriptions(response.data.length);
        
        // Calculate total medicines from prescriptions
        let medicineCount = 0;
        response.data.forEach(prescription => {
          medicineCount += prescription.medicines?.length || 0;
        });
        setTotalMedicines(medicineCount);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleScanPrescription = () => {
    navigate('/upload-prescription');
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      }}
    >
      <GlobalStyle />
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1664476984010-46bb839845f3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1lZGljYWwlMjBlcXVpcG1lbnR8ZW58MHx8MHx8fDA%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Welcome Section - Personalized Greeting & Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={7}>
                {/* Animated Welcome Text */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      color: '#008080',
                      display: 'inline-block',
                    }}
                    component={motion.h1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Welcome, {user?.name?.split(' ')[0] || 'User'}!
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="#333333"
                    component={motion.p}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    sx={{ 
                      fontSize: '1.1rem',
                      maxWidth: '90%',
                      lineHeight: 1.5,
                      mb: 2,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -10,
                        left: 0,
                        width: '40px',
                        height: '3px',
                        backgroundColor: '#67c27c',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    Welcome to your MedGenix dashboard. Track your prescriptions, savings, and manage your healthcare needs all in one place.
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mt: { xs: 2, md: 'auto' },
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <ActionButton
                      variant="contained"
                      color="primary"
                      onClick={handleScanPrescription}
                      sx={{ 
                        mr: 2,
                        px: 3,
                        py: 1.2,
                        backgroundColor: '#008080',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                        '&:hover': {
                          backgroundColor: '#67c27c',
                          boxShadow: '0 6px 16px rgba(103, 194, 124, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Scan New Prescription
                    </ActionButton>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                {/* Profile Card */}
                <StyledPaper 
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle animated background */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      opacity: 0.05,
                      background: 'radial-gradient(circle at 30% 30%, rgba(103, 194, 124, 0.4) 0%, rgba(0, 128, 128, 0) 70%)',
                      zIndex: 0,
                    }}
                    component={motion.div}
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      opacity: [0.03, 0.06, 0.03],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                    <StyledAvatar src={user?.profilePhoto} alt={user?.name}>
                      {user?.name?.charAt(0)}
                    </StyledAvatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user?.name?.split(' ')[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                      <Chip 
                        size="small" 
                        label="Premium Member" 
                        sx={{ 
                          mt: 0.5, 
                          bgcolor: 'rgba(0, 128, 128, 0.1)', 
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }} 
                      />
                    </Box>
                    <IconButton 
                      sx={{ ml: 'auto' }}
                      aria-label="Edit profile"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box 
                    sx={{ 
                      mt: 'auto', 
                      display: 'flex',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<Edit />}
                      sx={{ 
                        mt: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0, 128, 128, 0.08)'
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* Overview Section - Key Stats & Savings Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center', 
              }}
            >
              Overview
              <Tooltip title="View detailed statistics for the last 6 months">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Total Savings Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar
                        sx={{ 
                          bgcolor: 'rgba(0, 128, 128, 0.1)',
                          color: 'primary.main'
                        }}
                      >
                        <SavingsOutlined />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Savings
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          ₹{totalSavings}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowForward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          15.3%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        from last month
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Total Prescriptions Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar>
                        <Receipt />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Prescriptions
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          {totalPrescriptions}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowForward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          3 New
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        in last 30 days
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Total Medicines Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar>
                        <Medication />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Medicines Extracted
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          {totalMedicines}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowForward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          6 New
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        in last 30 days
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Savings Chart Card */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <StyledPaper 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      minHeight: '320px',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="h3" fontWeight={600}>
                        Monthly Savings
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          This Year
                        </Typography>
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Height set to ensure proper rendering */}
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={savingsData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#67c27c" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#008080" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <RechartsTooltip 
                            formatter={(value) => [`₹${value}`, 'Savings']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              borderRadius: '8px',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                              border: 'none',
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="savings" 
                            stroke="#008080" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorSavings)" 
                            activeDot={{ r: 6, stroke: '#008080', strokeWidth: 2, fill: 'white' }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* Prescription History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mt: 5,
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center', 
              }}
            >
              Prescription History
              <Tooltip title="View all your previously scanned prescriptions">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <StyledPaper>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : prescriptions.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No prescriptions uploaded yet. Start by scanning a prescription!
                </Typography>
              ) : (
                <TableContainer sx={{ overflow: 'auto', maxHeight: 440 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="prescription history table">
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 600, color: '#008080' } }}>
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Medicines</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptions.map((prescription) => (
                        <TableRow
                          key={prescription._id}
                          hover
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 128, 128, 0.05)',
                            },
                          }}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                        >
                          <TableCell 
                            component="th" 
                            scope="row"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: 'primary.light', 
                                color: 'white',
                                width: 36,
                                height: 36,
                                mr: 2,
                              }}
                            >
                              <CalendarMonth fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {formatDate(prescription.createdAt)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Chip 
                                icon={<Medication fontSize="small" />}
                                label={`${prescription.medicines?.length || 0} Medicines`}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  borderColor: 'primary.light',
                                  color: 'primary.dark',
                                  '& .MuiChip-icon': { color: 'primary.main' },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Prescription">
                              <IconButton
                                onClick={() => handleViewPrescription(prescription)}
                                size="small"
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </StyledPaper>
          </motion.div>
          
          {/* Your Extracted Medicines Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mt: 5,
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center', 
              }}
            >
              Your Extracted Medicines
              <Tooltip title="All medicines extracted from your prescriptions">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <StyledPaper sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <MedicalServices sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                No Medicines Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload a prescription to extract medicine information.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Add />}
              >
                Scan New Prescription
              </Button>
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Footer />

      {/* Prescription Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <img
                src={selectedPrescription.imageUrl}
                alt="Prescription"
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  marginBottom: '16px'
                }}
              />
              <Typography variant="body1" gutterBottom>
                Uploaded on: {formatDate(selectedPrescription.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage; 