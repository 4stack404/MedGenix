import { useState, useEffect } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemText, 
  ListItemIcon, 
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { 
  Language as LanguageIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useLanguage } from '../../context/LanguageContext';
import GoogleTranslateWidget from './GoogleTranslateWidget';

/**
 * Language selector dropdown for the header
 * 
 * @returns {JSX.Element}
 */
const LanguageSelector = () => {
  const { language, languageName, supportedLanguages, changeLanguage } = useLanguage();
  
  // State for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle language change
  const handleLanguageChange = (langCode) => {
    // Update context
    changeLanguage(langCode);
    
    // Close menu
    handleMenuClose();
  };
  
  // Get language flag emoji
  const getLanguageFlag = (langName) => {
    const flags = {
      'English': '🇬🇧',
      'Hindi': '🇮🇳',
      'Bengali': '🇧🇩',
      'Marathi': '🇮🇳',
      'Telugu': '🇮🇳',
      'Tamil': '🇮🇳',
      'Gujarati': '🇮🇳',
      'Kannada': '🇮🇳',
      'Odia': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Punjabi': '🇮🇳'
    };
    
    return flags[langName] || '🌐';
  };
  
  // Get native name for language
  const getNativeName = (langName) => {
    const nativeNames = {
      'English': 'English',
      'Hindi': 'हिन्दी',
      'Bengali': 'বাংলা',
      'Marathi': 'मराठी',
      'Telugu': 'తెలుగు',
      'Tamil': 'தமிழ்',
      'Gujarati': 'ગુજરાતી',
      'Kannada': 'ಕನ್ನಡ',
      'Odia': 'ଓଡ଼ିଆ',
      'Malayalam': 'മലയാളം',
      'Punjabi': 'ਪੰਜਾਬੀ'
    };
    
    return nativeNames[langName] || langName;
  };
  
  return (
    <>
      {/* Include Google Translate Widget */}
      <GoogleTranslateWidget selectedLanguage={language} />
      
      <Tooltip title="Change Language">
        <Button
          color="inherit"
          onClick={handleMenuOpen}
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ 
            minWidth: 0, 
            p: 1, 
            mr: 1,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'rgba(103, 194, 124, 0.08)'
            }
          }}
        >
          <LanguageIcon fontSize="small" />
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 0.5, 
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {languageName ? `${getLanguageFlag(languageName)} ${languageName}` : 'English'}
          </Typography>
        </Button>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 2,
          sx: {
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
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
            },
          },
        }}
      >
        {Object.entries(supportedLanguages || {}).map(([langName, langCode]) => (
          <MenuItem 
            key={langCode}
            selected={langCode === language}
            onClick={() => handleLanguageChange(langCode)}
            sx={{ 
              px: 2, 
              py: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(103, 194, 124, 0.08)',
              },
              '&.Mui-selected:hover': {
                bgcolor: 'rgba(103, 194, 124, 0.12)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {getLanguageFlag(langName)}
            </ListItemIcon>
            <ListItemText>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">{langName}</Typography>
                <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                  {getNativeName(langName)}
                </Typography>
              </Box>
            </ListItemText>
            {langCode === language && (
              <CheckIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;