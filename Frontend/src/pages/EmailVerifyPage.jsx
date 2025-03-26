import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MarkEmailRead } from '@mui/icons-material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { verifyEmail, sendVerificationEmail } from '../services/authService';
import { useAuth } from '../context/AuthContext';

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

const VerifyButton = styled(Button)(({ theme }) => ({
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

const EmailVerifyPage = () => {
  const navigate = useNavigate();
  const { user, login: loginContext } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isEmailVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    setResendDisabled(true);
    setCountdown(30); // 30 seconds cooldown

    try {
      const response = await sendVerificationEmail();
      setSuccess(response.message || 'Verification code sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
      setResendDisabled(false);
      setCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await verifyEmail({ otp });
      setSuccess(response.message || 'Email verified successfully!');
      
      // Update user context with verified status and new token
      if (response.user && response.token) {
        localStorage.setItem('token', response.token);
        loginContext(response.user);
      }
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Verification failed');
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper component="form" onSubmit={handleSubmit}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <MarkEmailRead
                  color="primary"
                  sx={{ fontSize: 48, mb: 2 }}
                />
                <Typography
                  variant="h5"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'primary.dark',
                  }}
                >
                  Verify Your Email
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Please enter the verification code sent to your email address
                </Typography>
              </Box>

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

              <TextField
                fullWidth
                label="Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                variant="outlined"
                placeholder="Enter 6-digit code"
                sx={{ mb: 2 }}
              />

              <VerifyButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </VerifyButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  onClick={handleResendOTP}
                  disabled={resendDisabled || loading}
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : "Didn't receive the code? Resend"}
                </Button>
              </Box>
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Box sx={{ background: 'rgba(255, 255, 255, 0.9)' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default EmailVerifyPage;