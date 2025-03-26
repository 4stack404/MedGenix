import express from 'express';
import * as pharmacyController from '../controllers/pharmacyController.js';

const router = express.Router();

// Route to get nearby pharmacies
router.get('/nearby', pharmacyController.getNearbyPharmacies);

// Route to get details about a specific pharmacy
router.get('/details', pharmacyController.getPharmacyDetails);

export default router; 