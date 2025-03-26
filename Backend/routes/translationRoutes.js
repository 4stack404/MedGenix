import express from 'express';
import { getSupportedLanguages, translate, batchTranslate } from '../controllers/translationController.js';

const router = express.Router();

// Get all supported languages
router.get('/languages', getSupportedLanguages);

// Translate a single text
router.post('/translate', translate);

// Batch translate multiple texts
router.post('/batch-translate', batchTranslate);

export default router; 