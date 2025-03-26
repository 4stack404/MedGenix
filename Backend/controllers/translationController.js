import { translateText, batchTranslateTexts, SUPPORTED_LANGUAGES } from '../services/translationService.js';

/**
 * Get all supported languages
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const getSupportedLanguages = async (req, res) => {
  try {
    res.status(200).json({
      success: true, 
      data: SUPPORTED_LANGUAGES
    });
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get supported languages'
    });
  }
};

/**
 * Translate a single text
 * @param {object} req - Express request object with { text, targetLanguage, sourceLanguage }
 * @param {object} res - Express response object
 */
export const translate = async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Text and target language are required'
      });
    }
    
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);
    
    res.status(200).json({
      success: true,
      data: {
        originalText: text,
        translatedText,
        language: targetLanguage
      }
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Translation failed'
    });
  }
};

/**
 * Batch translate multiple texts
 * @param {object} req - Express request object with { texts, targetLanguage, sourceLanguage }
 * @param {object} res - Express response object
 */
export const batchTranslate = async (req, res) => {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;
    
    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return res.status(400).json({
        success: false,
        error: 'Texts array and target language are required'
      });
    }
    
    const translatedTexts = await batchTranslateTexts(texts, targetLanguage, sourceLanguage);
    
    res.status(200).json({
      success: true,
      data: {
        originalTexts: texts,
        translatedTexts,
        language: targetLanguage
      }
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch translation failed'
    });
  }
};

export default {
  getSupportedLanguages,
  translate,
  batchTranslate
}; 