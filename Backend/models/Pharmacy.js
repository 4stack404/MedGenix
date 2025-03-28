const pharmacySchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  // ... other fields
});

// Create a 2dsphere index on the location field
pharmacySchema.index({ location: '2dsphere' }); 