import { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, Rating, Button, Divider } from '@mui/material';
import { LocationOn, Phone, Language, AccessTime } from '@mui/icons-material';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * A reusable Pharmacy Map component for displaying pharmacy locations
 */
const PharmacyMap = ({ 
  userLocation,
  pharmacies = [],
  selectedPharmacy,
  setSelectedPharmacy,
  showGenericOnly = false,
  height = 500,
  width = '100%'
}) => {
  const [mapError, setMapError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredPharmacy, setHoveredPharmacy] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const apiLoadedRef = useRef(false);
  
  // Load Google Maps API once
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
    // Skip if already loaded
        if (window.google?.maps) {
      console.log('Google Maps already loaded');
      apiLoadedRef.current = true;
      setMapLoaded(true);
      return;
    }
    
        // If we're already loading, wait for it
    if (window.isLoadingGoogleMaps) {
      console.log('Google Maps loading in progress');
          const checkLoaded = setInterval(() => {
            if (window.google?.maps) {
              clearInterval(checkLoaded);
              apiLoadedRef.current = true;
              setMapLoaded(true);
            }
          }, 100);
      return;
    }
    
    window.isLoadingGoogleMaps = true;
    console.log('Loading Google Maps API...');
    
        await new Promise((resolve, reject) => {
    const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
          script.onload = () => {
            console.log('Google Maps API loaded successfully');
            window.isLoadingGoogleMaps = false;
            apiLoadedRef.current = true;
            setMapLoaded(true);
            resolve();
          };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
            window.isLoadingGoogleMaps = false;
            setMapError('Failed to load Google Maps. Please refresh the page.');
            reject(error);
          };

          document.head.appendChild(script);
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      setMapError('Failed to load Google Maps. Please refresh the page.');
      }
    };
    
    loadGoogleMaps();
    
    return () => {
      // Cleanup markers on unmount
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
    };
  }, []);
  
  // Initialize map when API is loaded and we have user location
  useEffect(() => {
    if (!mapLoaded || !userLocation || !mapContainerRef.current) {
      return;
    }
    
    try {
      if (!mapInstanceRef.current) {
        console.log('Initializing new map with center:', userLocation);
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: userLocation,
          zoom: 14,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
        });
        mapInstanceRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
      
        // Add user location marker
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
          map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
          zIndex: 1000
      });
        markersRef.current = [userMarker];
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please try again.');
    }
  }, [mapLoaded, userLocation]);
  
  // Update markers when pharmacies change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !pharmacies.length) return;
    
    try {
      // Clear existing pharmacy markers (keep user marker)
        markersRef.current.slice(1).forEach(marker => {
          if (marker) marker.setMap(null);
        });
      markersRef.current = markersRef.current.slice(0, 1);
      
      // Add pharmacy markers
      pharmacies.forEach(pharmacy => {
        if (!pharmacy.position) return;

        const marker = new window.google.maps.Marker({
          position: pharmacy.position,
          map: mapInstanceRef.current,
          title: pharmacy.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: pharmacy.isGeneric 
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' 
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });
        
        // Add hover listeners
        marker.addListener('mouseover', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          const photoUrl = pharmacy.photos?.[0]?.photo_reference 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${pharmacy.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
            : null;
          
          const content = `
            <div style="padding: 16px; max-width: 300px; font-family: Arial, sans-serif;">
              ${photoUrl ? `
                <div style="width: 100%; height: 150px; margin-bottom: 12px; overflow: hidden; border-radius: 8px;">
                  <img src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${pharmacy.name}"/>
                </div>
              ` : ''}
              <h3 style="margin: 0 0 8px; color: ${pharmacy.isGeneric ? '#2e7d32' : '#d32f2f'}; font-size: 18px;">
                ${pharmacy.name}
                ${pharmacy.isGeneric ? '<span style="background: #e8f5e9; color: #2e7d32; font-size: 12px; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Generic</span>' : ''}
              </h3>
              <p style="margin: 8px 0; color: #666; font-size: 14px;">
                <span style="color: #333;">${pharmacy.vicinity || 'Address not available'}</span>
              </p>
              ${pharmacy.rating ? `
                <div style="display: flex; align-items: center; margin: 8px 0; font-size: 14px;">
                  <span style="color: #ffc107; margin-right: 4px;">★</span>
                  <strong style="margin-right: 4px;">${pharmacy.rating}</strong>
                  <span style="color: #666;">(${pharmacy.user_ratings_total} reviews)</span>
                </div>
              ` : ''}
              ${pharmacy.opening_hours ? `
                <p style="margin: 8px 0; font-size: 14px; display: flex; align-items: center;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: ${pharmacy.opening_hours.open_now ? '#4caf50' : '#f44336'}; display: inline-block; margin-right: 6px;"></span>
                  <span style="color: ${pharmacy.opening_hours.open_now ? '#4caf50' : '#f44336'};">
                    ${pharmacy.opening_hours.open_now ? 'Open now' : 'Closed'}
                  </span>
                </p>
              ` : ''}
              <a href="https://www.google.com/maps/dir/?api=1&destination=${pharmacy.position.lat},${pharmacy.position.lng}" 
                 target="_blank" 
                 style="display: inline-block; margin-top: 8px; padding: 8px 16px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">
                Get Directions
              </a>
            </div>
          `;
          
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        });

        marker.addListener('mouseout', () => {
          if (infoWindowRef.current && !selectedPharmacy) {
            infoWindowRef.current.close();
          }
        });

        marker.addListener('click', () => {
          setSelectedPharmacy(pharmacy);
        });
        
        markersRef.current.push(marker);
      });
      
      // Fit bounds to include all markers
      if (markersRef.current.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        markersRef.current.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        mapInstanceRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error updating markers:', error);
      setMapError('Failed to update pharmacy markers.');
    }
  }, [mapLoaded, pharmacies, selectedPharmacy, setSelectedPharmacy]);

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(pharmacy.position);
      mapInstanceRef.current.setZoom(16);
    }
  };
  
  return (
    <Box
      sx={{
        height: height,
        width: '80%',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: 2,
        p: 2,
        mx: 'auto',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Left panel for pharmacy list */}
      <Box
        sx={{
          width: '35%',
          height: '100%',
          backgroundColor: 'white',
          overflowY: 'auto',
          borderRadius: 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <List sx={{ p: 0 }}>
          {pharmacies.map((pharmacy, index) => (
            <ListItem
              key={pharmacy.place_id || index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: selectedPharmacy?.place_id === pharmacy.place_id ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
              onClick={() => handlePharmacyClick(pharmacy)}
            >
              <Box sx={{ width: '100%', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  color={pharmacy.isGeneric ? 'success.main' : 'primary.main'}
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {pharmacy.name}
                  {pharmacy.isGeneric && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        px: 1,
                        py: 0.5,
                        bgcolor: 'success.light',
                        color: 'success.contrastText',
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                      }}
                    >
                      Generic
                    </Box>
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 18, mt: 0.3 }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                  }}
                >
                  {pharmacy.vicinity || pharmacy.formatted_address}
                </Typography>
              </Box>

              {pharmacy.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={pharmacy.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.8rem' }}>
                    ({pharmacy.user_ratings_total} reviews)
                  </Typography>
                </Box>
              )}

              {pharmacy.opening_hours && (
                <Typography
                  variant="body2"
                  sx={{
                    color: pharmacy.opening_hours.open_now ? 'success.main' : 'error.main',
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  <AccessTime sx={{ mr: 1, fontSize: 18 }} />
                  {pharmacy.opening_hours.open_now ? 'Open now' : 'Closed'}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LocationOn />}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.position.lat},${pharmacy.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    borderColor: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                    },
                  }}
                >
                  Directions
                </Button>
                {pharmacy.formatted_phone_number && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Phone />}
                    href={`tel:${pharmacy.formatted_phone_number}`}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                    }}
                  >
                    Call
                  </Button>
                )}
                {pharmacy.website && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Language />}
                    href={pharmacy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.8rem',
                    }}
                  >
                    Website
                  </Button>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Map container */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        {mapError && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10,
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography color="error" variant="h6">
              {mapError}
            </Typography>
          </Box>
        )}
        
        {!mapLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <Box
          ref={mapContainerRef}
          sx={{
            height: '100%',
            width: '100%',
            backgroundColor: '#f5f5f5'
          }}
        />
      </Box>
    </Box>
  );
};

export default PharmacyMap; 