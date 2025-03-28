import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Phone, 
  Lock, 
  Person
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { register } from '../services/authService';
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

const SignupButton = styled(Button)(({ theme }) => ({
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

const SignupPage = () => {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: 'user'
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Mobile number validation
    if (!formData.mobileNumber) {
      errors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData);
      setSuccess(response.message);
      // Update auth context with new user data
      loginContext(response.user);
      // Redirect to home page after successful registration
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
                Create Your MedGenix Account
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

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="mobileNumber"
                    label="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    error={!!formErrors.mobileNumber}
                    helperText={formErrors.mobileNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="primary" />
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
                    value={formData.password}
                    onChange={handleChange}
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

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="subtitle1" gutterBottom>
                      Are you a chemist?
                    </Typography>
                    <RadioGroup
                      row
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      sx={{ gap: 2 }}
                    >
                      <FormControlLabel 
                        value="user" 
                        control={<Radio color="primary" />} 
                        label="No," 
                      />
                      <FormControlLabel 
                        value="chemist" 
                        control={<Radio color="primary" />} 
                        label="Yes, I'm a chemist" 
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <SignupButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </SignupButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
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
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default SignupPage; 