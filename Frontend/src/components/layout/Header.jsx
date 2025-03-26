import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  Container, 
  useMediaQuery, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Avatar,
  Tooltip,
  Badge,
  Paper
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Language as LanguageIcon, 
  Person as PersonIcon, 
  Home as HomeIcon, 
  Info as InfoIcon, 
  Dashboard as DashboardIcon,
  Help as HelpIcon,
  Widgets as FeaturesIcon,
  LightMode as LightModeIcon,
  ExitToApp,
  MarkEmailRead as VerifyEmailIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import LanguageSelector from '../ui/LanguageSelector';

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user, logout: logoutContext } = useAuth();
  
  // State for mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // State for header shadow (on scroll)
  const [scrolled, setScrolled] = useState(false);
  
  // State for user menu
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userAnchorEl);

  // Navigation items with icons
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contact', path: '/contact' }
  ];

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutContext();
      navigate('/');
      handleUserMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    handleUserMenuClose();
  };

  const handleVerifyEmail = () => {
    navigate('/verify-email');
    handleUserMenuClose();
  };

  // Add this function to get the avatar letter
  const getAvatarLetter = () => {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', height: '100%', bgcolor: '#f7fdfd' }}>
      <Box sx={{ 
        py: 3, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Box
          component="img"
          src="/images/MedGenix Logo.png"
          alt="MedGenix Logo"
          sx={{ 
            height: 50, 
            mb: 1,
            objectFit: 'contain',
            border: 'none'
          }}
        />
        <Typography variant="h6" sx={{ 
            fontWeight: 700,
            fontSize: '1.5rem',
            backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            position: 'relative',
            '&:hover .letter': {
              animation: 'letterHover 0.5s ease forwards',
            },
            '& .letter': {
              display: 'inline-block',
              transition: 'transform 0.3s ease',
              backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            },
          }}>
          <span className="letter" style={{ animationDelay: '0.05s' }}>M</span>
          <span className="letter" style={{ animationDelay: '0.1s' }}>e</span>
          <span className="letter" style={{ animationDelay: '0.15s' }}>d</span>
          <span className="letter" style={{ animationDelay: '0.2s' }}>G</span>
          <span className="letter" style={{ animationDelay: '0.25s' }}>e</span>
          <span className="letter" style={{ animationDelay: '0.3s' }}>n</span>
          <span className="letter" style={{ animationDelay: '0.35s' }}>i</span>
          <span className="letter" style={{ animationDelay: '0.4s' }}>x</span>
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Where Health Meets Affordability
        </Typography>
      </Box>
      <Divider />
      <List sx={{ py: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            button 
            component={RouterLink}
            to={item.path}
            sx={{ 
              py: 1.5,
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              bgcolor: location.pathname === item.path ? 'rgba(103, 194, 124, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(103, 194, 124, 0.08)',
              }
            }}
          >
            <ListItemText 
              primary={<Typography>{item.name}</Typography>} 
              sx={{ 
                textAlign: 'center',
                '& .MuiTypography-root': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'inherit'
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button 
          variant="contained"
          fullWidth
          component={RouterLink}
          to="/signup"
          className="signup-button"
          sx={{ 
            mb: 2,
            borderRadius: '8px',
            py: 1.2,
            backgroundColor: '#008080',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#006666',
              transform: 'translateY(-3px) scale(1.02)',
              boxShadow: '0 6px 15px rgba(0, 128, 128, 0.3)',
            }
          }}
        >
          Sign Up
        </Button>
        <Button 
          variant="outlined"
          fullWidth
          component={RouterLink}
          to="/login"
          sx={{ 
            borderRadius: '8px',
            py: 1.2
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      color="transparent" 
      elevation={scrolled ? 2 : 0} 
      sx={{ 
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease-in-out',
        borderBottom: scrolled ? '1px solid rgba(0, 128, 128, 0.1)' : 'none',
      }}
      className="header-animation"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
          {/* Left section with brand and tagline */}
          <Box 
            sx={{ 
            display: 'flex', 
              alignItems: 'center' 
            }}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="img"
              src="/images/MedGenix Logo.png"
              alt="MedGenix Logo"
              sx={{ 
                height: { xs: 36, md: 44 }, 
                mr: 1.5,
                objectFit: 'contain',
                border: 'none'
              }}
            />
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                mr: 1,
                display: 'flex',
                fontWeight: 700,
                backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textDecoration: 'none',
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                position: 'relative',
                '&:hover .letter': {
                  animation: 'letterHover 0.5s ease forwards',
                },
                '& .letter': {
                  display: 'inline-block',
                  transition: 'transform 0.3s ease',
                  backgroundImage: 'linear-gradient(to bottom, #67c27c, #008080)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                },
                '@keyframes letterHover': {
                  '0%': {
                    transform: 'translateY(0)',
                  },
                  '100%': {
                    transform: 'translateY(-3px)',
                  },
                },
              }}
            >
              <span className="letter" style={{ animationDelay: '0.05s' }}>M</span>
              <span className="letter" style={{ animationDelay: '0.1s' }}>e</span>
              <span className="letter" style={{ animationDelay: '0.15s' }}>d</span>
              <span className="letter" style={{ animationDelay: '0.2s' }}>G</span>
              <span className="letter" style={{ animationDelay: '0.25s' }}>e</span>
              <span className="letter" style={{ animationDelay: '0.3s' }}>n</span>
              <span className="letter" style={{ animationDelay: '0.35s' }}>i</span>
              <span className="letter" style={{ animationDelay: '0.4s' }}>x</span>
            </Typography>
            {!isSmall && (
              <>
            <Divider orientation="vertical" flexItem sx={{ 
                  mx: 1.5, 
                  height: '24px',
              alignSelf: 'center',
                  mt: 1,
            }} />
            <Typography
                  variant="subtitle2"
              sx={{
                    color: 'text.secondary',
                    fontWeight: 400,
                    alignSelf: 'center',
                    mt: 1,
              }}
            >
              Where Health Meets Affordability
            </Typography>
              </>
            )}
          </Box>

          {/* Center section with navigation */}
          <Box 
            sx={{
              display: { xs: 'none', md: 'flex' }, 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              maxWidth: '40%',
              justifyContent: 'center'
            }}
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {navItems.map((item, index) => (
              <Button
                key={item.name} 
                component={RouterLink}
                to={item.path}
                className={location.pathname === item.path ? 'nav-button active' : 'nav-button'}
                sx={{ 
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                  mx: 0.3,
                  px: 1,
                  py: 0.8,
                  borderRadius: '8px',
                  fontWeight: 500,
                  bgcolor: location.pathname === item.path ? 'rgba(103, 194, 124, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(103, 194, 124, 0.08)',
                    color: 'primary.main'
                  },
                  '&.active': {
                    background: 'rgba(103, 194, 124, 0.12)',
                    color: 'primary.main'
                  }
                }}
              >
                <Typography>{item.name}</Typography>
              </Button>
            ))}
          </Box>

          {/* Right section with actions and sign up button */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: 'auto'
            }}
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!isMobile && (
              <>
                <LanguageSelector />

                <Tooltip title="Toggle Theme">
                  <IconButton 
                    color="primary"
                    size="small"
                    sx={{ 
                      mr: 1,
                      p: 0.8,
                      borderRadius: '8px',
                      '&:hover': {
                        bgcolor: 'rgba(103, 194, 124, 0.08)'
                      }
                    }}
                  >
                    <LightModeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            
            {isMobile ? (
              <>
            <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/signup"
                  className="signup-button"
              sx={{
                    mr: 2,
                    borderRadius: '8px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    px: isSmall ? 2 : 3,
                    backgroundColor: '#008080',
                    color: 'white',
                    transition: 'all 0.3s ease',
                '&:hover': {
                      backgroundColor: '#006666',
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 6px 15px rgba(0, 128, 128, 0.3)'
                    }
                  }}
            >
              Sign Up
            </Button>
              <IconButton
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'rgba(103, 194, 124, 0.08)',
                    '&:hover': {
                      bgcolor: 'rgba(103, 194, 124, 0.15)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 128, 128, 0.15)'
                }}
              >
                {user ? (
                  <>
                    <IconButton onClick={handleUserMenuOpen}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          textTransform: 'uppercase',
                          width: 40,
                          height: 40,
                          fontSize: '1.2rem',
                          fontWeight: 500
                        }}
                      >
                        {getAvatarLetter()}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={userAnchorEl}
                      open={userMenuOpen}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          mt: 1.5,
                          overflow: 'visible',
                          borderRadius: '10px',
                          border: '1px solid rgba(0, 128, 128, 0.1)',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            borderTop: '1px solid rgba(0, 128, 128, 0.1)',
                            borderLeft: '1px solid rgba(0, 128, 128, 0.1)',
                          },
                        },
                      }}
                    >
                      <MenuItem onClick={handleDashboard}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Dashboard
                      </MenuItem>
                      {user && !user.isEmailVerified && (
                        <MenuItem onClick={handleVerifyEmail}>
                          <ListItemIcon>
                            <VerifyEmailIcon fontSize="small" color="warning" />
                          </ListItemIcon>
                          Verify Email
                        </MenuItem>
                      )}
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="text"
                      component={RouterLink}
                      to="/login"
                      sx={{
                        px: 2,
                        py: 1,
                        color: 'text.primary',
                        '&:hover': {
                          bgcolor: 'rgba(0, 128, 128, 0.08)'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={RouterLink}
                      to="/signup"
                      className="signup-button"
                      disableElevation
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 0,
                        fontWeight: 500,
                        '&:hover': {
                          boxShadow: 'none'
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Paper>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
            sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
