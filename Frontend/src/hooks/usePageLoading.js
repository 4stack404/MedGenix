import { useEffect } from 'react';

/**
 * Hook to integrate a component with the application-wide loading system.
 * When isLoading is true, the loading animation will be shown.
 * 
 * @param {boolean} isLoading - Whether the component is currently loading
 * @param {string} pageId - Unique identifier for the page
 */
const usePageLoading = (isLoading, pageId) => {
  useEffect(() => {
    // Register this page as a loading source when mounting
    if (window.loadingSources) {
      window.loadingSources[pageId] = isLoading;
    } else {
      window.loadingSources = { [pageId]: isLoading };
    }

    // Update loading state when isLoading changes
    if (window.updateLoadingState) {
      window.updateLoadingState();
    }

    // Cleanup when unmounting
    return () => {
      if (window.loadingSources && window.loadingSources[pageId] !== undefined) {
        delete window.loadingSources[pageId];
      }
      
      if (window.updateLoadingState) {
        window.updateLoadingState();
      }
    };
  }, [isLoading, pageId]);
};

export default usePageLoading;
