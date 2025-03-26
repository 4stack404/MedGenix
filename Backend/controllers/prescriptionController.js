import { Prescription } from '../models/Prescription.js';

// Upload prescription
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create prescription record with Cloudinary URL
    const prescription = new Prescription({
      imageUrl: req.file.path, // Cloudinary URL is automatically set by multer-storage-cloudinary
      medicines: req.body.medicines ? JSON.parse(req.body.medicines) : [], // Parse JSON string if present
      uploadedBy: req.user._id
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription uploaded successfully',
      prescription
    });

  } catch (error) {
    console.error('Error uploading prescription:', error);
    res.status(500).json({ message: 'Error uploading prescription', error: error.message });
  }
};

// Get prescriptions for a user
export const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get single prescription
export const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if the prescription belongs to the requesting user
    if (prescription.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this prescription' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
}; 