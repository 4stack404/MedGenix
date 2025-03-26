import { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDHrONTX_PmQf0lT1_6rIZvnJ2zrpbQU40';

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
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const apiLoadedRef = useRef(false);
  
  // Load Google Maps API once
  useEffect(() => {
    // Skip if already loaded
    if (window.google && window.google.maps && window.google.maps.Map) {
      console.log('Google Maps already loaded');
      apiLoadedRef.current = true;
      setMapLoaded(true);
      return;
    }
    
    // If we're already loading, don't load again
    if (window.isLoadingGoogleMaps) {
      console.log('Google Maps loading in progress');
      return;
    }
    
    window.isLoadingGoogleMaps = true;
    console.log('Loading Google Maps API...');
    
    // Callback for when Maps API finishes loading
    window.initGoogleMaps = () => {
      console.log('Google Maps API loaded successfully');
      apiLoadedRef.current = true;
      window.isLoadingGoogleMaps = false;
      setMapLoaded(true);
    };
    
    // Create script element with callback pattern
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Error handler
    script.onerror = (error) => {
      console.error('Failed to load Google Maps API:', error);
      setMapError('Failed to load Google Maps. Please refresh the page.');
      window.isLoadingGoogleMaps = false;
    };
    
    // Add the script to the document
    document.head.appendChild(script);
    
    return () => {
      // Cleanup our markers 
      if (markersRef.current && markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
      
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);
  
  // Initialize map when API is loaded and we have user location
  useEffect(() => {
    if (!mapLoaded || !apiLoadedRef.current || !userLocation || !mapContainerRef.current) {
      return;
    }
    
    // Additional safety check
    if (!window.google || !window.google.maps || !window.google.maps.Map) {
      console.error('Google Maps API not fully loaded');
      setMapError('Google Maps failed to initialize properly. Please refresh the page.');
      return;
    }
    
    try {
      // Clean up any existing map instance
      if (mapInstanceRef.current) {
        // Clear markers
        if (markersRef.current.length > 0) {
          markersRef.current.forEach(marker => {
            if (marker) marker.setMap(null);
          });
          markersRef.current = [];
        }
      } else {
        // Create map
        console.log('Initializing new map with center:', userLocation);
        const mapOptions = {
          center: userLocation,
          zoom: 14,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
        };
        
        // Create new map instance
        const map = new window.google.maps.Map(
          mapContainerRef.current,
          mapOptions
        );
        mapInstanceRef.current = map;
        
        // Create a single info window to reuse
        infoWindowRef.current = new window.google.maps.InfoWindow();
      }
      
      // Add user marker
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        zIndex: 1000, // Ensure user marker is on top
      });
      markersRef.current.push(userMarker);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please try again.');
    }
  }, [mapLoaded, userLocation]);
  
  // Update markers when pharmacies change or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !apiLoadedRef.current || !window.google || !window.google.maps) return;
    
    try {
      // Clear existing pharmacy markers (keep user marker)
      if (markersRef.current && markersRef.current.length > 0) {
        markersRef.current.slice(1).forEach(marker => {
          if (marker) marker.setMap(null);
        });
        // Keep only user marker if it exists
        markersRef.current = markersRef.current.length > 0 ? [markersRef.current[0]] : [];
      }
      
      // Filter pharmacies based on showGenericOnly
      const filteredPharmacies = showGenericOnly 
        ? pharmacies.filter(pharmacy => pharmacy.isGeneric)
        : pharmacies;
      
      console.log(`Adding ${filteredPharmacies.length} pharmacy markers to map`);
      
      // Add pharmacy markers
      filteredPharmacies.forEach(pharmacy => {
        // Skip pharmacies without position data
        if (!pharmacy.position || !pharmacy.position.lat || !pharmacy.position.lng) {
          console.warn('Pharmacy missing position data:', pharmacy);
          return;
        }
        
        // Create marker
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
        
        // Add click listener
        marker.addListener('click', () => {
          // Close any open info window
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          // Update selected pharmacy
          setSelectedPharmacy(pharmacy);
          
          // Create info window content
          const content = `
            <div style="padding: 10px; max-width: 300px;">
              <h3 style="margin-top: 0; color: ${pharmacy.isGeneric ? '#2e7d32' : '#d32f2f'};">
                ${pharmacy.name} ${pharmacy.isGeneric ? '(Generic)' : ''}
              </h3>
              <p style="margin: 5px 0;">${pharmacy.vicinity || ''}</p>
              ${pharmacy.rating ? `<p style="margin: 5px 0;">Rating: ${pharmacy.rating} ⭐</p>` : ''}
              <p style="margin: 5px 0; font-size: 0.9em; color: #666;">Click for more details</p>
            </div>
          `;
          
          // Set info window content and open
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
          
          // Animate marker
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            setTimeout(() => {
              marker.setAnimation(null);
            }, 1500);
          }
        });
        
        markersRef.current.push(marker);
      });
      
      // If selectedPharmacy is set, make sure its info window is open
      if (selectedPharmacy && markersRef.current.length > 1) {
        const marker = markersRef.current.find(m => 
          m.getTitle() === selectedPharmacy.name && 
          m.getPosition().lat() === selectedPharmacy.position.lat &&
          m.getPosition().lng() === selectedPharmacy.position.lng
        );
        
        if (marker && infoWindowRef.current) {
          const content = `
            <div style="padding: 10px; max-width: 300px;">
              <h3 style="margin-top: 0; color: ${selectedPharmacy.isGeneric ? '#2e7d32' : '#d32f2f'};">
                ${selectedPharmacy.name} ${selectedPharmacy.isGeneric ? '(Generic)' : ''}
              </h3>
              <p style="margin: 5px 0;">${selectedPharmacy.vicinity || ''}</p>
              ${selectedPharmacy.rating ? `<p style="margin: 5px 0;">Rating: ${selectedPharmacy.rating} ⭐</p>` : ''}
              <p style="margin: 5px 0; font-size: 0.9em; color: #666;">Click for more details</p>
            </div>
          `;
          
          // Set info window content and open
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      }
    } catch (error) {
      console.error('Error updating map markers:', error);
      setMapError('Failed to update pharmacy markers.');
    }
  }, [pharmacies, showGenericOnly, selectedPharmacy]);
  
  return (
    <Box
      sx={{
        height: height,
        width: width,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3
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
  );
};

export default PharmacyMap; 