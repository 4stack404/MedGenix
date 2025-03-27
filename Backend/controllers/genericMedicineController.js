import GenericMedicineStats from '../models/genericMedicineStats.js';

// Update or create generic medicine stats
export const updateGenericMedicineStats = async (req, res) => {
  try {
    const { genericNames } = req.body;

    if (!Array.isArray(genericNames)) {
      return res.status(400).json({
        success: false,
        message: 'genericNames must be an array'
      });
    }

    const updatePromises = genericNames.map(async (genericName) => {
      // Try to find and update, if not exists create new
      const result = await GenericMedicineStats.findOneAndUpdate(
        { genericName },
        { 
          $inc: { searchCount: 1 },
          lastSearched: new Date()
        },
        { 
          new: true,
          upsert: true
        }
      );
      return result;
    });

    const results = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Generic medicine stats updated successfully',
      data: results
    });

  } catch (error) {
    console.error('Error updating generic medicine stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating generic medicine stats',
      error: error.message
    });
  }
};

// Get all generic medicine stats
export const getGenericMedicineStats = async (req, res) => {
  try {
    const stats = await GenericMedicineStats.find()
      .sort({ searchCount: -1 });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching generic medicine stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching generic medicine stats',
      error: error.message
    });
  }
}; 