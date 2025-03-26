import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #006666 0%, #008080 50%, #00a0a0 100%)',
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: '#fff',
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          fontWeight: 500,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen; 