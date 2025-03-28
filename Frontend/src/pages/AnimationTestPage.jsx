import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingAnimation from '../components/common/LoadingAnimation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  marginBottom: theme.spacing(4)
}));

const AnimationTestPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [animationDuration, setAnimationDuration] = useState(5000);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const handleToggleLoading = () => {
    setIsLoading(!isLoading);
  };
  
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, animationDuration);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // If in full screen mode, show only the animation with the specified background
  if (isFullScreen) {
    return (
      <Box sx={{ 
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef8f8',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <IconButton 
          onClick={toggleFullScreen}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16,
            color: '#008080'
          }}
        >
          <CloseIcon />
        </IconButton>
        {isLoading ? (
          <LoadingAnimation text={loadingText} />
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Loading animation is hidden. Return to controls to show it again.
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
    }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600, 
            color: '#008080',
            mb: 4,
            textAlign: 'center'
          }}
        >
          MedGenix Loading Animation Test
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Controls
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={isLoading}
                        onChange={handleToggleLoading}
                        color="primary"
                      />
                    }
                    label="Show Loading Animation"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loading Text"
                    value={loadingText}
                    onChange={(e) => setLoadingText(e.target.value)}
                    variant="outlined"
                    disabled={!isLoading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="duration-select-label">Animation Duration</InputLabel>
                    <Select
                      labelId="duration-select-label"
                      value={animationDuration}
                      label="Animation Duration"
                      onChange={(e) => setAnimationDuration(e.target.value)}
                    >
                      <MenuItem value={2000}>2 seconds</MenuItem>
                      <MenuItem value={5000}>5 seconds</MenuItem>
                      <MenuItem value={10000}>10 seconds</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={simulateLoading}
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      backgroundColor: '#008080',
                      '&:hover': {
                        backgroundColor: '#67c27c',
                      },
                    }}
                  >
                    Simulate Loading Process
                  </Button>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              position: 'relative'
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                position: 'absolute',
                top: 24,
                left: 24,
                paddingRight: '48px'
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Preview
                </Typography>
                <IconButton 
                  onClick={toggleFullScreen}
                  sx={{ color: '#008080' }}
                  title="Full Screen Preview"
                >
                  <FullscreenIcon />
                </IconButton>
              </Box>
              <Divider sx={{ width: '100%', position: 'absolute', top: 60, left: 0 }} />
              
              <Box sx={{ 
                flex: 1, 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                pt: 4
              }}>
                {isLoading ? (
                  <LoadingAnimation text={loadingText} />
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Loading animation is hidden. Toggle the switch to show it again.
                  </Typography>
                )}
              </Box>
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Common Usage Scenarios
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '230px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 128, 128, 0.05)',
                    border: '1px dashed rgba(0, 128, 128, 0.2)',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#008080' }}>
                      Page Loading
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <LoadingAnimation text="Loading page..." />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '230px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 128, 128, 0.05)',
                    border: '1px dashed rgba(0, 128, 128, 0.2)',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#008080' }}>
                      API Request
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <LoadingAnimation text="Fetching data..." />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '230px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 128, 128, 0.05)',
                    border: '1px dashed rgba(0, 128, 128, 0.2)',
                    borderRadius: '12px'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: '#008080' }}>
                      Prescription Scanning
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <LoadingAnimation text="Analyzing prescription..." />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default AnimationTestPage;