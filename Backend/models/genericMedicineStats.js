import mongoose from 'mongoose';

const genericMedicineStatsSchema = new mongoose.Schema({
  genericName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const GenericMedicineStats = mongoose.model('GenericMedicineStats', genericMedicineStatsSchema);

export default GenericMedicineStats; 