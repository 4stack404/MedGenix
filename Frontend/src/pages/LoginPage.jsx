import { useState } from 'react';
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
  IconButton, 
  Tabs,
  Tab,
  Divider,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Avatar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Phone, 
  Lock,
  MedicalServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { login, sendLoginOTP, verifyLoginOTP } from '../services/authService';
import { useAuth } from '../context/AuthContext';

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

const LoginButton = styled(Button)(({ theme }) => ({
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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactType, setContactType] = useState('email');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form values
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    contactInfo: '',
    otp: '',
    rememberMe: false
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    contactInfo: '',
    otp: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setOtpSent(false);
    setError('');
    setSuccess('');
    setFormErrors({});
  };

  const handleContactTypeChange = (event, newType) => {
    if (newType !== null) {
      setContactType(newType);
      setFormValues(prev => ({
        ...prev,
        contactInfo: ''
      }));
      setFormErrors({});
      setOtpSent(false);
      setError('');
    }
  };

  const handleFormChange = (event) => {
    const { name, value, checked } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value,
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validatePasswordLogin = () => {
    const errors = {};
    let isValid = true;

    if (!formValues.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formValues.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateOTPLogin = () => {
    const errors = {};
    let isValid = true;

    if (!formValues.contactInfo) {
      errors.contactInfo = `${contactType === 'email' ? 'Email' : 'Phone number'} is required`;
      isValid = false;
    } else if (contactType === 'email' && !/\S+@\S+\.\S+/.test(formValues.contactInfo)) {
      errors.contactInfo = 'Email is invalid';
      isValid = false;
    } else if (contactType === 'phone' && !/^\d{10}$/.test(formValues.contactInfo.replace(/\D/g, ''))) {
      errors.contactInfo = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (otpSent && !formValues.otp) {
      errors.otp = 'OTP is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!validateOTPLogin()) return;

    setLoading(true);
    setError('');
    
    try {
      // Send only the email for OTP login
      const response = await sendLoginOTP(formValues.contactInfo);
      setSuccess(response.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (tabValue === 0) {
      // Password login
      if (!validatePasswordLogin()) return;

      setLoading(true);
      try {
        const response = await login({
          email: formValues.email,
          password: formValues.password
        });
        setSuccess(response.message);
        // Update auth context with user data
        loginContext(response.user);
        // Redirect to dashboard page after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (err) {
        setError(err.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    } else {
      // OTP login
      if (!validateOTPLogin()) return;

      setLoading(true);
      try {
        const response = await verifyLoginOTP({
          email: formValues.contactInfo,
          otp: formValues.otp
        });
        setSuccess(response.message);
        // Update auth context with user data
        loginContext(response.user);
        // Redirect to dashboard page after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } catch (err) {
        setError(err.message || 'OTP verification failed');
      } finally {
        setLoading(false);
      }
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper component="form" onSubmit={handleSubmit}>
              <Typography
                variant="h5"
                component="h1"
                align="center"
                gutterBottom
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.dark',
                  mb: 3
                }}
              >
                Welcome Back to MedGenix
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="login method tabs"
                sx={{ 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                  }
                }}
              >
                <Tab 
                  label="Password Login" 
                  icon={<Lock />} 
                  iconPosition="start" 
                />
                <Tab 
                  label="OTP Login" 
                  icon={<Email />} 
                  iconPosition="start" 
                />
              </Tabs>

              <Grid container spacing={2}>
                {tabValue === 0 ? (
                  // Password Login Form
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formValues.email}
                        onChange={handleFormChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formValues.password}
                        onChange={handleFormChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  // OTP Login Form
                  <>
                    <Grid item xs={12}>
                      <Tabs
                        value={contactType}
                        onChange={handleContactTypeChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="primary"
                        aria-label="contact type tabs"
                        sx={{ mb: 2 }}
                      >
                        <Tab value="email" label="Email" icon={<Email />} />
                        <Tab value="phone" label="Phone" icon={<Phone />} />
                      </Tabs>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={otpSent ? 12 : 8}>
                          <TextField
                            fullWidth
                            name="contactInfo"
                            label={contactType === 'email' ? "Email Address" : "Phone Number"}
                            type={contactType === 'email' ? "email" : "tel"}
                            value={formValues.contactInfo}
                            onChange={handleFormChange}
                            error={!!formErrors.contactInfo}
                            helperText={formErrors.contactInfo}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {contactType === 'email' ? <Email color="primary" /> : <Phone color="primary" />}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {!otpSent && (
                          <Grid item xs={4}>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="primary"
                              onClick={handleSendOTP}
                              disabled={loading}
                              sx={{ height: '56px' }}
                            >
                              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {otpSent && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="otp"
                          label="Enter OTP"
                          value={formValues.otp}
                          onChange={handleFormChange}
                          error={!!formErrors.otp}
                          helperText={formErrors.otp}
                        />
                      </Grid>
                    )}
                  </>
                )}

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formValues.rememberMe}
                        onChange={handleFormChange}
                        name="rememberMe"
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  
                  <Link 
                    component={RouterLink}
                    to="/forgot-password"
                    underline="hover"
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>

              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </LoginButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink}
                    to="/signup"
                    underline="hover"
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage; 