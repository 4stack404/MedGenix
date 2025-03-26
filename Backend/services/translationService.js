// Translation service for MedGenix
// This is a mock implementation that doesn't require Google Cloud credentials

/**
 * Supported languages map with their codes
 * This will be used by the frontend to display languages in a dropdown
 */
export const SUPPORTED_LANGUAGES = {
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
};

/**
 * Mock translation service that returns translations for common phrases
 * This replaces the Google Cloud Translation API for development
 */
export const translateText = async (text, targetLanguage) => {
  try {
    console.log(`Mock translation request: "${text}" to ${targetLanguage}`);
    
    // Use predefined translations for common medical and pharmacy related phrases
    const translations = {
      en: {
        // English to Hindi
        hi: {
          "Pharmacy": "फार्मेसी",
          "Medicine": "दवा",
          "Generic": "जेनेरिक",
          "Prescription": "नुस्खा",
          "Tablets": "गोलियां",
          "Capsules": "कैप्सूल",
          "Syrup": "सिरप",
          "Injection": "इंजेक्शन",
          "Ointment": "मलहम",
          "Drops": "बूंदें",
          "Pain relief": "दर्द से राहत",
          "Fever": "बुखार",
          "Cold": "जुकाम",
          "Cough": "खांसी",
          "Allergy": "एलर्जी",
          "Diabetes": "मधुमेह",
          "Blood pressure": "रक्तचाप",
          "Heart": "हृदय",
          "Stomach": "पेट",
          "Headache": "सिरदर्द",
          "Nearby Pharmacies": "आस-पास की फार्मेसी",
          "Find Generic Medicines": "जेनेरिक दवाएं खोजें"
        },
        // English to Spanish
        es: {
          "Pharmacy": "Farmacia",
          "Medicine": "Medicina",
          "Generic": "Genérico",
          "Prescription": "Receta",
          "Tablets": "Tabletas",
          "Capsules": "Cápsulas",
          "Syrup": "Jarabe",
          "Injection": "Inyección",
          "Ointment": "Pomada",
          "Drops": "Gotas",
          "Pain relief": "Alivio del dolor",
          "Fever": "Fiebre",
          "Cold": "Resfriado",
          "Cough": "Tos",
          "Allergy": "Alergia",
          "Diabetes": "Diabetes",
          "Blood pressure": "Presión arterial",
          "Heart": "Corazón",
          "Stomach": "Estómago",
          "Headache": "Dolor de cabeza",
          "Nearby Pharmacies": "Farmacias cercanas",
          "Find Generic Medicines": "Buscar medicamentos genéricos"
        }
      }
    };
    
    // Extract source language (default to English)
    const sourceLanguage = 'en';
    
    // Check if we have translations for this language pair
    if (!translations[sourceLanguage] || !translations[sourceLanguage][targetLanguage]) {
      console.warn(`No mock translations available for ${sourceLanguage} to ${targetLanguage}`);
      return text; // Return original text as fallback
    }
    
    // Check if we have a direct translation for this text
    const dictionary = translations[sourceLanguage][targetLanguage];
    if (dictionary[text]) {
      return dictionary[text];
    }
    
    // If we don't have an exact match, look for partial matches
    // This is a simple implementation that just checks if any key in the dictionary
    // is contained within the text, and replaces that part with the translation
    let translatedText = text;
    for (const [key, value] of Object.entries(dictionary)) {
      // Only replace whole words (not parts of words)
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translatedText = translatedText.replace(regex, value);
    }
    
    // If no changes were made, return the original text
    if (translatedText === text) {
      console.log(`No translation found for "${text}", returning original`);
      return text;
    }
    
    console.log(`Mock translated "${text}" to "${translatedText}"`);
    return translatedText;
  } catch (error) {
    console.error('Error in mock translation service:', error);
    return text; // Return original text on error
  }
};

/**
 * Batch translate multiple texts to the target language (MOCK)
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLanguage - The language code to translate to
 * @param {string} sourceLanguage - Optional source language code (auto-detect if not provided)
 * @returns {Promise<Array<string>>} - Array of translated texts
 */
export const batchTranslateTexts = async (texts, targetLanguage, sourceLanguage = 'en') => {
  try {
    // Skip translation in mock mode, return original texts with language indicator
    console.log(`[MOCK] Would batch translate ${texts.length} texts from ${sourceLanguage} to ${targetLanguage}`);
    return texts.map(text => `${text} [${targetLanguage}]`);
  } catch (error) {
    console.error('Mock batch translation error:', error);
    // Return original texts if translation fails
    return texts;
  }
};

export default {
  translateText,
  batchTranslateTexts,
  SUPPORTED_LANGUAGES
}; 