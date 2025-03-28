import express from 'express';
import userModel from '../models/userModels.js';

const router = express.Router();

// Get all prescriptions for the current user
router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        details: 'Please log in to view prescriptions'
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        details: 'User account no longer exists'
      });
    }

    // Return the prescriptions array from the user document
    res.json({ prescriptions: user.prescriptions || [] });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ 
      message: 'Error fetching prescriptions',
      error: error.message 
    });
  }
});

// Get a single prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.session.userId;
    const prescriptionId = req.params.id;

    if (!userId) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        details: 'Please log in to view prescriptions'
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        details: 'User account no longer exists'
      });
    }

    const prescription = user.prescriptions.find(p => p.prescriptionId === prescriptionId);
    if (!prescription) {
      return res.status(404).json({ 
        message: 'Prescription not found',
        details: 'The requested prescription does not exist or you do not have access to it'
      });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ 
      message: 'Error fetching prescription',
      error: error.message 
    });
  }
});

export default router; 