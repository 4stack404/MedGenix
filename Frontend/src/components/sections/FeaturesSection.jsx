import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  useMediaQuery,
  Divider,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Import feature icons
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

// Feature section background
const featureBackgroundImg = 'https://www.medicaldevice-network.com/wp-content/uploads/sites/23/2021/02/shutterstock_544348294-1.jpg';

const features = [
  {
    title: 'Read Your Prescription',
    description: 'Smart OCR technology reads and processes your prescription accurately',
    icon: <DocumentScannerIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Chat Bot',
    description: 'AI medical assistant answers all your medication-related questions',
    icon: <ChatOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Nearby Generic Pharmacies',
    description: 'Find local pharmacies with your medications in stock',
    icon: <LocationOnOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Price Comparison',
    description: 'Real-time price comparisons between medicines at different pharmacies',
    icon: <CompareArrowsOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Medicine Details',
    description: 'Comprehensive information on content, alternatives, brands, and prices',
    icon: <MedicationOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Language Support',
    description: 'Multi-language accessibility for diverse user needs',
    icon: <TranslateOutlinedIcon fontSize="large" color="primary" />,
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 0, md: 0 },
        pt: { xs: 0, md: 0 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
        marginTop: '1px',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '0',
          background: 'transparent',
          zIndex: 0,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${featureBackgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: -1,
        }
      }}
    >
      <Container sx={{ pt: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            mb: 8, 
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 128, 128, 0.1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              component="p"
              color="text.primary"
              sx={{ fontWeight: 600, mb: 1, color: '#333333' }}
            >
              POWERFUL FEATURES
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                color: theme.palette.primary.dark,
              }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                mb: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              MedGenix provides a comprehensive set of tools to help you save on prescriptions and find affordable medication alternatives.
            </Typography>
            <Divider sx={{ width: '60px', mx: 'auto', borderColor: 'primary.main', borderWidth: 2, my: 3 }} />
          </motion.div>
        </Paper>

        <Grid 
          container 
          spacing={isMobile ? 2 : 3}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'stretch',
            width: '100%',
            minHeight: '200px',
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index} 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                minHeight: '200px',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ width: '100%', minHeight: '200px' }}
              >
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.4s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.97)',
                    backdropFilter: 'blur(10px)',
                    minHeight: '200px',
                    '&:hover': {
                      boxShadow: '0 12px 28px rgba(0, 128, 128, 0.2)',
                      transform: 'translateY(-15px)',
                      borderColor: 'rgba(0, 128, 128, 0.3)',
                    },
                  }}
                >
                  <CardContent 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      flexGrow: 1,
                      minHeight: '200px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 128, 128, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.primary.dark,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
