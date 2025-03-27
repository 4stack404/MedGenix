import express from 'express';
import { updateGenericMedicineStats, getGenericMedicineStats } from '../controllers/genericMedicineController.js';

const router = express.Router();

// Route to update generic medicine stats
router.post('/update-stats', updateGenericMedicineStats);

// Route to get all generic medicine stats
router.get('/stats', getGenericMedicineStats);

export default router; 