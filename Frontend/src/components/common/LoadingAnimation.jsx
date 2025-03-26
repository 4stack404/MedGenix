import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading animation component displayed during page loading
 * In a production app, this could use Lottie animations
 */
const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <CircularProgress size={60} sx={{ mb: 2, color: 'primary.main' }} />
      <Typography variant="h6" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingAnimation;
