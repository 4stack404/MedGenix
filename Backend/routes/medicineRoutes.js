import express from 'express';
import GenericMedicineStats from '../models/genericMedicineStats.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get trending medicines
router.get('/trending', authMiddleware, async (req, res) => {
  try {
    const trendingMedicines = await GenericMedicineStats.find()
      .sort({ searchCount: -1 })
      .limit(10)
      .select('genericName searchCount lastSearched');

    res.json({
      success: true,
      medicines: trendingMedicines
    });
  } catch (error) {
    console.error('Error fetching trending medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending medicines'
    });
  }
});

// Get monthly trends for a specific medicine
router.get('/trends/:medicineName', authMiddleware, async (req, res) => {
  try {
    const { medicineName } = req.params;
    const medicine = await GenericMedicineStats.findOne({ genericName: medicineName });
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Get the last 6 months of trends
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let trends = [];
    for (let i = 0; i < 6; i++) {
      let targetMonth = currentMonth - i;
      let targetYear = currentYear;
      
      if (targetMonth <= 0) {
        targetMonth += 12;
        targetYear -= 1;
      }

      const monthStat = medicine.monthlyStats.find(
        stat => stat.month === targetMonth && stat.year === targetYear
      );

      trends.unshift({
        month: targetMonth,
        year: targetYear,
        count: monthStat ? monthStat.searchCount : 0
      });
    }

    res.json({
      success: true,
      trends: trends
    });
  } catch (error) {
    console.error('Error fetching medicine trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicine trends'
    });
  }
});

// Update medicine stats when searched
router.post('/update-stats', authMiddleware, async (req, res) => {
  try {
    const { genericNames } = req.body;

    if (!Array.isArray(genericNames) || genericNames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or empty genericNames array'
      });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const updatePromises = genericNames.map(async (genericName) => {
      // Find or create the medicine stats document
      let medicineStats = await GenericMedicineStats.findOne({ genericName });
      
      if (!medicineStats) {
        medicineStats = new GenericMedicineStats({
          genericName,
          searchCount: 0,
          monthlyStats: [],
          yearlyStats: []
        });
      }

      // Update using the updateSearchStats method
      await medicineStats.updateSearchStats();
    });

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Medicine statistics updated successfully'
    });
  } catch (error) {
    console.error('Error updating medicine stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medicine statistics'
    });
  }
});

export default router; 