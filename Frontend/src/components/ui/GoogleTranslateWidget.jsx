import { useEffect, useRef } from 'react';

/**
 * Custom Google Translate widget component that integrates with the navbar
 * @param {Object} props
 * @param {string} props.selectedLanguage - Currently selected language code
 */
const GoogleTranslateWidget = ({ selectedLanguage }) => {
  const prevLanguage = useRef(selectedLanguage);
  const initialized = useRef(false);
  
  // Effect to listen for Google Translate initialization
  useEffect(() => {
    const handleTranslateInitialized = () => {
      console.log('Google Translate has been initialized');
      initialized.current = true;
      
      // If we have a non-English language selected, apply it
      if (selectedLanguage && selectedLanguage !== 'en' && 
          selectedLanguage !== prevLanguage.current) {
        setTimeout(() => {
          if (window.changeGoogleTranslateLanguage) {
            window.changeGoogleTranslateLanguage(selectedLanguage);
          }
        }, 500);
      }
    };
    
    // Listen for the custom event from our HTML script
    window.addEventListener('google-translate-initialized', handleTranslateInitialized);
    
    // Check if already initialized (might have happened before component mounted)
    if (window.googleTranslateInitialized) {
      initialized.current = true;
    }
    
    // Add notranslate class to logo elements
    const addNotTranslateClass = () => {
      const logoElements = document.querySelectorAll('.logo, .brand, .letter');
      logoElements.forEach(el => {
        if (!el.classList.contains('notranslate')) {
          el.classList.add('notranslate');
        }
      });
    };
    
    // Call immediately and set up a timer to ensure it catches all elements
    addNotTranslateClass();
    const interval = setInterval(addNotTranslateClass, 2000);
    
    // Set up a MutationObserver to ensure body doesn't have top style
    const observer = new MutationObserver(() => {
      // Fix body style
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.top = '0px';
      }
      
      // Hide any Google translate bars that might appear
      const googleBar = document.querySelector('.goog-te-banner-frame');
      if (googleBar) {
        googleBar.style.display = 'none';
      }
      
      // Add notranslate class to logo elements
      addNotTranslateClass();
    });
    
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });
    
    // Cleanup function
    return () => {
      window.removeEventListener('google-translate-initialized', handleTranslateInitialized);
      clearInterval(interval);
      observer.disconnect();
    };
  }, [selectedLanguage]);
  
  // Effect to change language when selectedLanguage changes
  useEffect(() => {
    // Skip if it's the initial render or same language
    if (!selectedLanguage || selectedLanguage === prevLanguage.current) {
      return;
    }
    
    console.log('Language changed from', prevLanguage.current, 'to', selectedLanguage);
    
    // Update previous language
    prevLanguage.current = selectedLanguage;
    
    // Try to change language with retries
    let retryCount = 0;
    const maxRetries = 20;
    
    const attemptChangeLanguage = () => {
      if (window.changeGoogleTranslateLanguage) {
        // Use the global function we added to the HTML
        window.changeGoogleTranslateLanguage(selectedLanguage);
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(attemptChangeLanguage, 500);
      } else {
        console.error('Google Translate function not available after maximum retries');
      }
    };
    
    // Start with a small delay to ensure everything is loaded
    setTimeout(attemptChangeLanguage, 300);
  }, [selectedLanguage]);
  
  return null; // No visible UI
};

export default GoogleTranslateWidget;