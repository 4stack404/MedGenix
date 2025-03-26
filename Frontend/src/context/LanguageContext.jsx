import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Language Context
const LanguageContext = createContext();

// Define the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Hook to use the language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // State for selected language (default: English)
  const [language, setLanguage] = useState(() => {
    // Try to load language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || 'en'; // Default to English if not found
  });

  // State for language name (display name)
  const [languageName, setLanguageName] = useState('English');

  // State for available languages
  const [supportedLanguages, setSupportedLanguages] = useState({
    'English': 'en',
    'Hindi': 'hi',
    'Bengali': 'bn',
    'Marathi': 'mr',
    'Telugu': 'te',
    'Tamil': 'ta',
    'Gujarati': 'gu',
    'Kannada': 'kn',
    'Odia': 'or',
    'Malayalam': 'ml',
    'Punjabi': 'pa'
  });

  // Cache for translated texts to reduce API calls
  // Format: { [language_code]: { [original_text]: translated_text } }
  const [translationCache, setTranslationCache] = useState({});

  // Fetch supported languages from the API
  useEffect(() => {
    const fetchSupportedLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL}/translation/languages`);
        if (response.data.success) {
          setSupportedLanguages(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching supported languages:', error);
      }
    };

    fetchSupportedLanguages();
  }, []);

  // Update languageName when language changes
  useEffect(() => {
    // Find language name from code
    const findLanguageName = () => {
      for (const [name, code] of Object.entries(supportedLanguages)) {
        if (code === language) {
          return name;
        }
      }
      return 'English'; // Default fallback
    };

    const name = findLanguageName();
    setLanguageName(name);
    
    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', language);
  }, [language, supportedLanguages]);

  // Function to change the current language
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  // Function to translate a text
  const translateText = async (text, targetLang = language) => {
    // Skip translation if language is English or text is empty
    if (targetLang === 'en' || !text) {
      return text;
    }

    try {
      // Check if we already have this translation in cache
      if (translationCache[targetLang]?.[text]) {
        console.log('Using cached translation for:', text);
        return translationCache[targetLang][text];
      }

      console.log(`Translating text to ${targetLang}:`, text);
      
      // Call translation API
      const response = await axios.post(`${API_URL}/translation/translate`, {
        text,
        targetLanguage: targetLang,
        sourceLanguage: 'en' // Default source language is English
      });

      console.log('Translation API response:', response.data);

      if (response.data.success) {
        const translatedText = response.data.data.translatedText;
        
        // Update cache
        setTranslationCache(prev => ({
          ...prev,
          [targetLang]: {
            ...(prev[targetLang] || {}),
            [text]: translatedText
          }
        }));
        
        return translatedText;
      }
      
      return text; // Return original text if translation fails
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  };

  // Function to batch translate multiple texts
  const batchTranslateTexts = async (texts, targetLang = language) => {
    // Skip translation if language is English or texts array is empty
    if (targetLang === 'en' || !texts || texts.length === 0) {
      return texts;
    }

    // Filter out texts that are already in the cache
    const cachedTexts = {};
    const textsToTranslate = [];

    texts.forEach(text => {
      if (translationCache[targetLang]?.[text]) {
        cachedTexts[text] = translationCache[targetLang][text];
      } else {
        textsToTranslate.push(text);
      }
    });

    // If all texts are in cache, return them
    if (textsToTranslate.length === 0) {
      return texts.map(text => cachedTexts[text]);
    }

    try {
      // Call batch translation API
      const response = await axios.post(`${API_URL}/translation/batch-translate`, {
        texts: textsToTranslate,
        targetLanguage: targetLang,
        sourceLanguage: 'en' // Default source language is English
      });

      if (response.data.success) {
        const translatedTexts = response.data.data.translatedTexts;
        
        // Update cache with new translations
        const newCache = { ...translationCache };
        if (!newCache[targetLang]) {
          newCache[targetLang] = {};
        }
        
        textsToTranslate.forEach((text, index) => {
          newCache[targetLang][text] = translatedTexts[index];
        });
        
        setTranslationCache(newCache);
        
        // Return translations in the original order
        return texts.map(text => {
          if (cachedTexts[text]) {
            return cachedTexts[text];
          }
          const index = textsToTranslate.indexOf(text);
          return index !== -1 ? translatedTexts[index] : text;
        });
      }
      
      return texts; // Return original texts if translation fails
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts if translation fails
    }
  };

  // Context value
  const value = {
    language,
    languageName,
    supportedLanguages,
    changeLanguage,
    translateText,
    batchTranslateTexts
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 