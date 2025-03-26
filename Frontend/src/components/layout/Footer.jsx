import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider, 
  IconButton, 
  useMediaQuery,
  Button,
  TextField,
  Paper,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from 'framer-motion';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const footerLinks = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', url: '/' },
        { name: 'How It Works', url: '/how-it-works' },
        { name: 'About Us', url: '#' },
        { name: 'Blog', url: '#' },
        { name: 'FAQ', url: '/faq' },
        { name: 'Contact Us', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Pharmacy Locator', url: '#' },
        { name: 'Partnership Opportunities', url: '#' },
        { name: 'Search Medications', url: '#' },
        { name: 'Dashboard', url: '#' },
        { name: 'Medication Database', url: '#' },
        { name: 'Health Resources', url: '#' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { name: 'hello@medgenix.com', url: 'mailto:hello@medgenix.com' },
        { name: '+1 (555) 123-4567', url: 'tel:+15551234567' },
        { name: '123 Healthcare Ave, Suite 101', url: '#' },
        { name: 'Medical City, MC 12345', url: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, url: '#', label: 'Twitter' },
    { icon: <LinkedInIcon />, url: '#', label: 'LinkedIn' },
    { icon: <InstagramIcon />, url: '#', label: 'Instagram' },
  ];

  const footerWavePattern = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2YxZjFmMSI+PHBhdGggZD0iTTEyODAgMy40QzEwNTAuNTkgMTggMTAxOS40IDg0Ljg5IDczNC40MiA4NC44OWMtMzIwIDAtMzIwLTg0LjMtNjQwLTg0LjNDNTkuNC41OSAyOC4yIDEuNiAwIDMuNFYxNDBoMTI4MHoiIGZpbGwtb3BhY2l0eT0iLjMiLz48cGF0aCBkPSJNMCAyNC4zMWM0My40Ni01LjY5IDk0LjU2LTkuMjUgMTU4LjQyLTkuMjUgMzIwIDAgMzIwIDg5LjI0IDY0MCA4OS4yNCAyNTYuMTMgMCAzMDcuMjgtNTcuMTYgNDgxLjU4LTgwVjE0MEgweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0xMjgwIDUxLjc2Yy0yMDEgMTIuNDktMjQyLjQzIDUzLjQtNTEzLjU4IDUzLjQtMzIwIDAtMzIwLTU3LTY0MC01Ny00OC44NS4wMS05MC4yMSAxLjM1LTEyNi40MiAzLjZWMTQwaDEyODB6Ii8+PC9nPjwvc3ZnPg==';

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'rgba(0, 128, 128, 0.2)',
        mt: 0,
        pt: { xs: 10, md: 15 },
        pb: { xs: 6, md: 8 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '70px',
          backgroundImage: `url(${footerWavePattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          transform: 'translateY(-98%)',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand & Description */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src="/images/MedGenix Logo.png"
                  alt="MedGenix Logo"
                  sx={{ 
                    height: 40,
                    mr: 1.5,
                    objectFit: 'contain'
                  }}
                />
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.6rem',
                    backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  MedGenix
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 3, maxWidth: '90%' }}
              >
                Where Health Meets Affordability. MedGenix helps you find cost-effective alternatives to brand-name medications without compromising on quality or efficacy.
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                {socialLinks.map((social, index) => (
                  <IconButton 
                    key={index} 
                    component={motion.a}
                    whileHover={{ y: -4, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    href={social.url}
                    target="_blank"
                    aria-label={social.label}
                    color="primary"
                    sx={{ 
                      bgcolor: 'rgba(103, 194, 124, 0.08)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'linear-gradient(to bottom, #67c27c, #008080)',
                        color: 'white',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Links */}
          {footerLinks.map((column, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: 'primary.main',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '40px',
                    height: '2px',
                    backgroundColor: 'primary.main',
                  }
                }}
              >
                {column.title}
              </Typography>
              <Box component="ul" sx={{ padding: 0, listStyle: 'none', m: 0, mt: 3 }}>
                {column.links.map((link, linkIndex) => (
                  <Box 
                    component={motion.li} 
                    whileHover={{ x: 5 }}
                    key={linkIndex} 
                    sx={{ mb: 1.5 }}
                  >
                    <Link 
                      href={link.url} 
                      underline="none"
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.9rem',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        '&:hover': {
                          color: '#67c27c',
                        },
                        '&:before': {
                          content: '"•"',
                          display: 'inline-block',
                          marginRight: '8px',
                          background: 'linear-gradient(to bottom, #67c27c, #008080)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          fontSize: '1.2rem',
                          opacity: 0.8
                        }
                      }}
                    >
                      <Typography component="span">
                        {link.name}
                      </Typography>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, opacity: 0.6 }} />

        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'center' : 'flex-start' 
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: isMobile ? 2 : 0, textAlign: isMobile ? 'center' : 'left' }}
          >
            {new Date().getFullYear()} MedGenix. All rights reserved.
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }} 
            alignItems="center"
          >
            <Link 
              href="#" 
              underline="hover"
              color="text.secondary"
              sx={{ 
                fontSize: '0.8rem',
                '&:hover': { 
                  background: 'linear-gradient(to right, #67c27c, #008080)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Sitemap
              </Typography>
            </Link>
            <Link 
              href="#" 
              underline="hover"
              color="text.secondary"
              sx={{ 
                fontSize: '0.8rem',
                '&:hover': { 
                  background: 'linear-gradient(to right, #67c27c, #008080)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Accessibility
              </Typography>
            </Link>
            <Link 
              href="#" 
              underline="hover"
              color="text.secondary"
              sx={{ 
                fontSize: '0.8rem',
                '&:hover': { 
                  background: 'linear-gradient(to right, #67c27c, #008080)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Cookie Settings
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
