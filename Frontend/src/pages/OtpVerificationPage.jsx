import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardBackspace, LockReset } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Header from '../components/layout/Header';

// Styled components
const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px',
  margin: 'auto',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const OtpVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  const handleBack = () => {
    navigate('/forgot-password');
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    if (otp.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      // Store OTP in session storage for the reset password page
      sessionStorage.setItem('resetOtp', otp);
      enqueueSnackbar('Verification code confirmed!', { variant: 'success' });
      navigate('/reset-password');
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Failed to verify code');
      enqueueSnackbar(error.message || 'Failed to verify code', { variant: 'error' });
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
        background: 'linear-gradient(135deg, #006666 0%, #008080 50%, #00a0a0 100%)',
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
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.5s, transform 0.5s',
            }}
          >
            <StyledPaper component="form" onSubmit={handleVerifyOtp}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                  startIcon={<KeyboardBackspace />}
                  onClick={handleBack}
                  sx={{ mr: 2 }}
                >
                  Back
                </Button>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600, color: 'primary.dark' }}
                >
                  Verify Code
                </Typography>
              </Box>

              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Step 2 of 3: Enter Verification Code
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
                    width: '66%', 
                    backgroundColor: 'primary.main',
                    borderRadius: '2px'
                  }} />
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 3 }}>
                Please enter the 6-digit verification code sent to {email}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Verification Code"
                value={otp}
                onChange={handleOtpChange}
                margin="normal"
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockReset color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <ActionButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading || otp.length !== 6}
                sx={{ mt: 3 }}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </ActionButton>
            </StyledPaper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default OtpVerificationPage; 