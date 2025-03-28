import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  InputAdornment, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Email, 
  MedicalServices
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { sendPasswordResetOTP } from '../services/authService';
import { useSnackbar } from 'notistack';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(3),
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

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    borderColor: 'rgba(0, 128, 128, 0.2)',
  },
}));

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Handle cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (emailError) setEmailError('');
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await sendPasswordResetOTP(email);
      
      if (response.success) {
        // Store email in sessionStorage
        sessionStorage.setItem('resetEmail', email);
        enqueueSnackbar('Reset code sent successfully!', { variant: 'success' });
        
        // Set cooldown
        setCooldown(120); // 2 minutes cooldown
        
        // Navigate to OTP verification page
        navigate('/otp-verification');
      } else {
        enqueueSnackbar(response.message || 'Failed to send reset code', { variant: 'error' });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      enqueueSnackbar(error.message || 'Failed to send reset code', { variant: 'error' });
      setEmailError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#f7fdfd',
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/images/pharmacist.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.5s, transform 0.5s',
            }}
          >
            <StyledPaper component="form" onSubmit={handleSendOTP}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.dark',
                  mb: 3
                }}
              >
                Forgot Password
              </Typography>

              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Step 1 of 3: Enter Your Email
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  position: 'relative',
                  height: '4px',
                  backgroundColor: 'rgba(0, 128, 128, 0.1)',
                  borderRadius: '2px',
                  mb: 3
                }}>
                  <Box sx={{ 
                    width: '33%', 
                    backgroundColor: 'primary.main',
                    borderRadius: '2px'
                  }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Enter your email address and we'll send you a verification code to reset your password.
                  </Typography>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {cooldown > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  You can request another code in {cooldown} seconds
                </Alert>
              )}

              <ActionButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading || cooldown > 0}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Sending Reset Code...' : 
                 cooldown > 0 ? `Wait ${cooldown}s to resend` : 
                 'Send Reset Code'}
              </ActionButton>

              <StyledDivider>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </StyledDivider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link 
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </StyledPaper>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ForgotPasswordPage; 