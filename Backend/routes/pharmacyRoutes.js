import express from 'express';
import { 
  getNearbyPharmacies, 
  getPharmacyDetails, 
  searchNearbyPharmacies 
} from '../controllers/pharmacyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get nearby pharmacies
router.get('/nearby', authMiddleware, getNearbyPharmacies);

// Route to get details about a specific pharmacy
router.get('/details', authMiddleware, getPharmacyDetails);

// Route to search nearby pharmacies
router.post('/search', authMiddleware, searchNearbyPharmacies);

export default router; 