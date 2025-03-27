import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { LocationOn, Refresh, LocalPharmacy, Check } from '@mui/icons-material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PharmacyMap from '../components/layout/PharmacyMap';
import usePageLoading from '../hooks/usePageLoading';
import { api } from '../services/authService';

// Constants
const GENERIC_KEYWORDS = [
  'generic', 'affordable', 'discount', 'low cost', 'budget',
  'cheap', 'inexpensive', 'economical', 'reasonable',
  'wholesale', 'bulk', 'public', 'government', 'subsidized',
  'davaindia', 'wellness forever', 'apollo', 'medplus',
  'generic pharmacy', 'jan aushadhi', 'pmbjp', 'pmjay'
];

const SEARCH_RADIUS = 5000; // 5km in meters

const PharmacyLocatePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapStatus, setMapStatus] = useState('loading');
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showGenericOnly, setShowGenericOnly] = useState(false);
  
  const apiLoadedRef = useRef(false);
  
  usePageLoading(loading, 'pharmacy-locate-page');
  
  // Check if a pharmacy is likely to be generic
  const isGenericPharmacy = useCallback((pharmacy) => {
    if (!pharmacy) return false;
    
    const nameAndVicinity = `${pharmacy.name} ${pharmacy.vicinity || ''} ${pharmacy.types?.join(' ') || ''}`.toLowerCase();
    
    return GENERIC_KEYWORDS.some(keyword => nameAndVicinity.includes(keyword.toLowerCase())) ||
           pharmacy.name.toLowerCase().includes('davaindia') ||
           pharmacy.name.toLowerCase().includes('jan aushadhi') ||
           pharmacy.name.toLowerCase().includes('generic') ||
           pharmacy.name.toLowerCase().includes('wellness forever');
  }, []);

  // Search for nearby pharmacies
  const searchNearbyPharmacies = useCallback(async (location) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/pharmacy/nearby', {
        params: {
          lat: location.lat,
          lng: location.lng,
          radius: SEARCH_RADIUS
        }
      });

      if (response.data.success && response.data.pharmacies) {
        const pharmaciesData = response.data.pharmacies.map(pharmacy => {
          const location = pharmacy.geometry?.location || pharmacy.location || {
            lat: parseFloat(pharmacy.lat),
            lng: parseFloat(pharmacy.lng)
          };

          return {
            ...pharmacy,
            isGeneric: isGenericPharmacy(pharmacy),
            geometry: {
              location: {
                lat: location.lat,
                lng: location.lng
              }
            }
          };
        });
        
        setPharmacies(pharmaciesData);
        setMapStatus('ready');
      } else {
        throw new Error('No pharmacy data found in the response');
      }
    } catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
      setError('Failed to find nearby pharmacies. Please try again.');
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }, [isGenericPharmacy]);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }
    
    const handleLocationError = (error) => {
      let errorMessage = 'Unable to access your location. ';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please enable location services in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable. Please try again.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Request timed out. Please check your connection and try again.';
          break;
        default:
          errorMessage += 'Please try again or enter your location manually.';
      }
      
      setError(errorMessage);
      setLoading(false);
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      handleLocationError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // Initialize Google Maps
  const initializeGoogleMaps = useCallback(async () => {
    try {
      apiLoadedRef.current = true;
      setMapStatus(prev => prev === 'loading' ? 'loading-complete' : prev);
    } catch (error) {
      console.error('Failed to load Google Maps API:', error);
      setError(error.message);
      setMapStatus('error');
      setLoading(false);
    }
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setMapStatus('loading');
    setPharmacies([]);
    setSelectedPharmacy(null);
    getUserLocation();
  }, [getUserLocation]);

  // Toggle generic filter
  const toggleGenericFilter = useCallback(() => {
    setShowGenericOnly(prev => !prev);
  }, []);

  // Effects
  useEffect(() => {
    initializeGoogleMaps();
  }, [initializeGoogleMaps]);

  useEffect(() => {
    if (!userLocation) getUserLocation();
  }, [userLocation, getUserLocation]);

  useEffect(() => {
    if (userLocation) searchNearbyPharmacies(userLocation);
  }, [userLocation, searchNearbyPharmacies]);

  // Filtered pharmacies based on generic filter
  const filteredPharmacies = showGenericOnly 
    ? pharmacies.filter(pharmacy => pharmacy.isGeneric)
    : pharmacies;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 4, bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ flex: 1 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Find Nearby Pharmacies
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
              Locate pharmacies near your current location to find medications quickly.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, mx: 'auto', maxWidth: 'md' }}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Try Again
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh Location
              </Button>
              
              <Button
                variant={showGenericOnly ? "contained" : "outlined"}
                color={showGenericOnly ? "success" : "primary"}
                startIcon={showGenericOnly ? <Check /> : <LocalPharmacy />}
                onClick={toggleGenericFilter}
                disabled={loading || pharmacies.length === 0}
              >
                {showGenericOnly ? "Showing Generic Only" : "Show Generic Pharmacies"}
              </Button>
            </Box>
            
            {pharmacies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Found {filteredPharmacies.length} {showGenericOnly ? 'generic' : ''} pharmacies nearby
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip 
                    icon={<LocalPharmacy />} 
                    label="All Pharmacies" 
                    color={!showGenericOnly ? "primary" : "default"}
                    onClick={() => setShowGenericOnly(false)}
                    sx={{ mb: 1 }}
                  />
                  <Chip 
                    icon={<LocalPharmacy />} 
                    label="Generic Pharmacies" 
                    color={showGenericOnly ? "success" : "default"}
                    onClick={() => setShowGenericOnly(true)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Box>
            )}
          </Box>
          
          <Box sx={{ height: 'calc(80vh - 100px)', display: 'flex', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <PharmacyMap
              userLocation={userLocation}
              pharmacies={filteredPharmacies.map(pharmacy => ({
                ...pharmacy,
                position: pharmacy.geometry.location,
                isGeneric: pharmacy.isGeneric
              }))}
              selectedPharmacy={selectedPharmacy}
              setSelectedPharmacy={setSelectedPharmacy}
              showGenericOnly={showGenericOnly}
              height="100%"
              width="100%"
            />
          </Box>
          
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This feature uses your device's location to find pharmacies within a 5km radius.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>Green markers</span> indicate pharmacies that may offer generic medicines.
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PharmacyLocatePage;