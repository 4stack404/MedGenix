import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  brand_name: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    default: null
  },
  frequency: {
    type: String,
    default: null
  },
  duration: {
    type: String,
    default: null
  }
});

const prescriptionSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  medicines: [medicineSchema],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export { Prescription }; 