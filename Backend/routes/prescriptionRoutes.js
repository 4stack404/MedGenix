import express from 'express';
import { uploadPrescription, getUserPrescriptions, getPrescription } from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authMiddleware);

// Upload prescription
router.post('/upload', upload.single('prescription'), uploadPrescription);

// Get user's prescriptions
router.get('/user', getUserPrescriptions);

// Get single prescription
router.get('/:id', getPrescription);

export default router; 