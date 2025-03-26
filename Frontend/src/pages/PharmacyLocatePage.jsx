import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, Chip, Paper, Rating } from '@mui/material';
import { LocationOn, Refresh, LocalPharmacy, Check } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PharmacyMap from '../components/layout/PharmacyMap';
import usePageLoading from '../hooks/usePageLoading';
import { findNearbyPharmacies, identifyGenericPharmacy } from '../services/pharmacyService';
import { transformPharmacyData } from '../services/transformPharmacyData';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Keywords that might indicate a generic pharmacy
const GENERIC_KEYWORDS = [
  'generic', 'affordable', 'discount', 'low cost', 'budget', 
  'cheap', 'inexpensive', 'economical', 'reasonable',
  'wholesale', 'bulk', 'public', 'government', 'subsidized'
];

// Function to load Google Maps script
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // If Google Maps is already loaded, resolve immediately
    if (window.google?.maps) {
      console.log('Google Maps already loaded');
      resolve();
      return;
    }

    // If we're already loading, wait for the existing load
    if (window.isLoadingGoogleMaps) {
      console.log('Waiting for existing Google Maps load');
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    window.isLoadingGoogleMaps = true;
    console.log('Loading Google Maps with key:', GOOGLE_MAPS_API_KEY);

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;

    // Add error callback to window
    window.gm_authFailure = () => {
      console.error('Google Maps authentication failed');
      reject(new Error('Google Maps authentication failed - please check your API key configuration'));
    };

    // Set up event handlers
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      window.isLoadingGoogleMaps = false;
      resolve();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      window.isLoadingGoogleMaps = false;
      reject(new Error('Failed to load Google Maps API - check console for details'));
    };

    // Add the script to the document
    document.head.appendChild(script);
  });
};

const PharmacyLocatePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapStatus, setMapStatus] = useState('loading'); // 'loading', 'ready', 'error'
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showGenericOnly, setShowGenericOnly] = useState(false);
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [simulatedDataMessage, setSimulatedDataMessage] = useState('');
  const [noPharmaciesFound, setNoPharmaciesFound] = useState(false);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const apiLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  
  // Connect to the loading system
  usePageLoading(loading, 'pharmacy-locate-page');
  
  // Load Google Maps API
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();
      apiLoadedRef.current = true;
      setMapStatus(prev => prev === 'loading' ? 'loading-complete' : prev);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      setError('Failed to load Google Maps. Please refresh the page.');
      setMapStatus('error');
      setLoading(false);
      }
    };
    
    initializeGoogleMaps();
  }, []);
  
  // Get user location
  useEffect(() => {
    if (userLocation) return; // Already have location
    
    const getUserLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
        return;
      }
      
      const handleLocationError = (error) => {
          console.error('Error getting location:', error);
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
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        });
        
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        console.log('Got user location:', userPos);
        setUserLocation(userPos);
        
        // Fetch pharmacies once we have the location
        await fetchPharmacies(userPos);
      } catch (err) {
        console.error('Error getting location:', err);
        setError('Unable to access your location. Please enable location services and try again.');
        setLoading(false);
      }
    };
    
    getUserLocation();
  }, []);
  
  // Fetch pharmacies using user's current location
  const fetchPharmacies = async (userLoc) => {
    try {
      setIsLoadingPharmacies(true);
      setError(null);
      
      // Validate the user location
      if (!userLoc || !userLoc.lat || !userLoc.lng) {
        console.error('Invalid user location provided:', userLoc);
        setError('Could not determine your location. Please try again.');
        setIsLoadingPharmacies(false);
        return;
      }
      
      console.log('Fetching pharmacies for location:', userLoc);
      
      // Call the service to get pharmacies
      const response = await findNearbyPharmacies(userLoc.lat, userLoc.lng, 5000);
      
      if (!response) {
        throw new Error('No response from pharmacy service');
      }
      
      if (!response.pharmacies || !Array.isArray(response.pharmacies)) {
        throw new Error('Invalid response from pharmacy service');
      }
      
      // Check if we're using simulated data
      if (response.note && response.note.includes('simulated')) {
        console.warn('Using simulated data:', response.note);
        setIsSimulated(true);
        setSimulatedDataMessage(response.note);
      } else {
        setIsSimulated(false);
        setSimulatedDataMessage('');
      }
      
      // Transform pharmacy data for map display
      const transformedPharmacies = transformPharmacyData(response.pharmacies);
      console.log(`Transformed ${response.pharmacies.length} pharmacies to ${transformedPharmacies.length} map markers`, transformedPharmacies);
      
      // Check if we got any valid pharmacies after transformation
      if (transformedPharmacies.length === 0) {
        setNoPharmaciesFound(true);
        } else {
        setNoPharmaciesFound(false);
        setPharmacies(transformedPharmacies);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
      setError(`Error fetching pharmacy data: ${error.message}`);
      setPharmacies([]);
      setLoading(false);
    } finally {
      setIsLoadingPharmacies(false);
    }
  };
  
  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      if (!userLocation) {
        // If we don't have user location, try to get it first
        await getUserLocationPromise();
      } else {
        await fetchPharmacies(userLocation);
      }
    } catch (error) {
      console.error('Error refreshing pharmacy data:', error);
      setError(`Failed to fetch pharmacies: ${error.message}`);
    }
  };
  
  // Get user location as a promise
  const getUserLocationPromise = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          resolve(userPos);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(new Error('Unable to access your location. Please enable location services.'));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };
  
  // Toggle generic only filter
  const toggleGenericFilter = () => {
    setShowGenericOnly(!showGenericOnly);
  };
  
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            <LocalPharmacy sx={{ mr: 1, verticalAlign: 'middle' }} />
            Nearby Pharmacies
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Find pharmacies near you that offer generic medications at lower prices.
          </Typography>
        </Box>
        
        {/* Status and Controls */}
      <Box 
        sx={{ 
          display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            gap: 2
          }}
        >
          <Box>
            {userLocation && (
              <Typography variant="body2" color="text.secondary">
                <LocationOn fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Current location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </Typography>
            )}
            
            {isSimulated && (
              <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                {simulatedDataMessage || 'Using simulated pharmacy data.'}
              </Alert>
            )}
          </Box>
            
          <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
              variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={handleRefresh}
              disabled={isLoadingPharmacies}
              >
              Refresh
              </Button>
              
              <Button
                variant={showGenericOnly ? "contained" : "outlined"}
              color="success"
              startIcon={showGenericOnly ? <Check /> : null}
                onClick={toggleGenericFilter}
              >
              Generic Only
              </Button>
          </Box>
            </Box>
            
        {/* Loading and Error States */}
        {isLoadingPharmacies && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && !isSimulated && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {noPharmaciesFound && !isLoadingPharmacies && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            No pharmacies found in your area. Try increasing the search radius or checking a different location.
          </Alert>
        )}
        
        {/* Map */}
        {userLocation && (
          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              mb: 4 
            }}
          >
            <PharmacyMap 
              userLocation={userLocation}
              pharmacies={pharmacies}
              selectedPharmacy={selectedPharmacy}
              setSelectedPharmacy={setSelectedPharmacy}
              showGenericOnly={showGenericOnly}
              height={500}
            />
          </Paper>
        )}
        
        {/* Pharmacy List */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Pharmacy List ({showGenericOnly ? 'Generic Only' : 'All'})
          </Typography>
          
          {pharmacies.length === 0 && !isLoadingPharmacies ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No pharmacies to display. Try refreshing or changing your search criteria.
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
            <AnimatePresence>
                {(showGenericOnly 
                  ? pharmacies.filter(p => p.isGeneric) 
                  : pharmacies
                ).map((pharmacy, index) => (
                <motion.div
                    key={pharmacy.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Paper
                      elevation={selectedPharmacy?.id === pharmacy.id ? 4 : 1}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderLeft: pharmacy.isGeneric ? '4px solid #4caf50' : '4px solid #f44336',
                        ...(selectedPharmacy?.id === pharmacy.id ? {
                          backgroundColor: 'rgba(0, 0, 0, 0.02)'
                        } : {})
                      }}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                    >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                            {pharmacy.name}
                            {pharmacy.isGeneric && (
                          <Chip 
                            label="Generic" 
                            size="small" 
                            color="success" 
                                sx={{ ml: 1, height: 20 }}
                          />
                        )}
                      </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pharmacy.vicinity}
                          </Typography>
                          {pharmacy.rating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="body2" mr={1}>
                                Rating: {pharmacy.rating}
                              </Typography>
                              <Rating 
                                value={pharmacy.rating} 
                                precision={0.5} 
                        size="small" 
                                readOnly 
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({pharmacy.userRatingsTotal})
                              </Typography>
                            </Box>
                          )}
                    </Box>
                      </Box>
                  </Paper>
                </motion.div>
                ))}
            </AnimatePresence>
          </Box>
          )}
          </Box>
        </Container>
      <Footer />
    </>
  );
};

export default PharmacyLocatePage;
