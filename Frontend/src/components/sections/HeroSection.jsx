import { 
  Box, 
  Container, 
  Typography, 
  Button,
} from '@mui/material';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    navigate('/file-upload');
  };

  const handleHowItWorksClick = () => {
    navigate('/how-it-works');
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        height: '90vh',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, md: 0 },
        pb: { xs: 0, md: 0 },
        position: 'relative',
        overflow: 'visible',
        backgroundColor: 'transparent',
        width: '100%',
        maxWidth: '100%',
        marginBottom: 0,
        boxSizing: 'border-box',
      }}
    >
      <Container 
        maxWidth={false} 
        sx={{ 
          width: '100%', 
          maxWidth: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          pl: { xs: 4, md: 10 },
          pr: { xs: 4, md: 0 },
        }}
      >
        <Box
          sx={{ 
            textAlign: { xs: 'center', md: 'left' },
            width: { xs: '100%', md: '60%' },
            mt: { xs: -10, md: 0 },
          }}
        >
          <Box
            sx={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.6s, transform 0.6s',
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                mb: 3,
                color: 'white',
                lineHeight: 1.1,
                textShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
                maxWidth: { md: '90%' },
                letterSpacing: '-0.5px',
              }}
            >
              Scan your prescription and save up to{' '}
              <Box component="span" sx={{ 
                color: 'white',
                position: 'relative',
              }}>
                70%
              </Box>{' '}
              on your medicines.
            </Typography>

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: { md: '80%' },
                color: '#333333',
              }}
            >
              MedGenix helps you find trusted generic alternatives to your prescribed medications at a fraction of the cost.
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mt: 5,
            }}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<DocumentScannerIcon sx={{ fontSize: '1.8rem' }} />}
                onClick={handleScanClick}
                sx={{ 
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  borderRadius: '8px',
                  backgroundColor: '#008080',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(0, 128, 128, 0.3)',
                  '&:hover': {
                    backgroundColor: '#006666',
                    boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                    transform: 'translateY(-8px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Scan Prescription
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<InfoOutlinedIcon sx={{ fontSize: '1.8rem' }} />}
                onClick={handleHowItWorksClick}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  borderRadius: '8px',
                  borderWidth: '2px',
                  color: 'white',
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#e6e6e6',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                How it Works
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
