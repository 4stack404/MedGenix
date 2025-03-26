import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import Footer from './components/layout/Footer';
import SplineBackground from './components/ui/SplineBackground';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import EmailVerifyPage from './pages/EmailVerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import GenericMedicineDetailPage from './pages/GenericMedicineDetailPage';
import PharmacyLocatePage from './pages/PharmacyLocatePage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import PrescriptionPage from './pages/PrescriptionPage';
import PrescriptionScannerPage from './pages/PrescriptionScannerPage';

// Create a theme with teal as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Teal color
      light: '#67c27c', // Light green from the gradient
      dark: '#006666', // Darker teal
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#67c27c', // Light green from the gradient
      light: '#8bd99e',
      dark: '#4a9d5d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    success: {
      main: '#67c27c', // Light green for success states
      light: '#8bd99e',
      dark: '#4a9d5d',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
       
        outlinedPrimary: {
          borderColor: '#008080',
          color: '#008080',
          '&:hover': {
            borderColor: '#67c27c',
            backgroundColor: 'rgba(103, 194, 124, 0.08)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
        maxWidthLg: {
          '@media (min-width: 1200px)': {
            maxWidth: '1200px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Home Page Component
const HomePage = () => {
  return (
    <>
      {/* 3D Spline background limited to hero section height */}
      <SplineBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Content after hero section */}
        <Box sx={{ 
          position: 'relative',
          backgroundColor: 'transparent',
          zIndex: 2,
          mt: 0, // Reset margin to 0 since we're controlling spacing in the Features component
          pt: 0,
          borderTop: 'none',
          overflow: 'visible',
        }}>
          {/* Features Section */}
          <FeaturesSection />
        </Box>
      </Box>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh', 
              position: 'relative',
              overflowX: 'hidden',
            }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email" element={<EmailVerifyPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/otp-verification" element={<OtpVerificationPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/upload-prescription" element={<PrescriptionScannerPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/prescriptions" element={<PrescriptionPage />} />
                  <Route path="/medicine/:id" element={<MedicineDetailPage />} />
                  <Route path="/generic/medicine/:id" element={<GenericMedicineDetailPage />} />
                  <Route path="/pharmacy-locate" element={<PharmacyLocatePage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                </Routes>
            </Box>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;