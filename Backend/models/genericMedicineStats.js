import mongoose from 'mongoose';

const monthlyStatSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  searchCount: { type: Number, default: 0 }
});

const yearlyStatSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  searchCount: { type: Number, default: 0 }
});

const genericMedicineStatsSchema = new mongoose.Schema({
  genericName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  searchCount: {
    type: Number,
    default: 0
  },
  lastSearched: {
    type: Date,
    default: Date.now
  },
  monthlyStats: [monthlyStatSchema],
  yearlyStats: [yearlyStatSchema]
}, {
  timestamps: true
});

// Index for efficient queries
genericMedicineStatsSchema.index({ 'monthlyStats.month': 1, 'monthlyStats.year': 1 });
genericMedicineStatsSchema.index({ 'yearlyStats.year': 1 });
genericMedicineStatsSchema.index({ searchCount: -1 }); // For sorting by popularity

// Method to update all search statistics
genericMedicineStatsSchema.methods.updateSearchStats = async function() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Update total search count
  this.searchCount += 1;
  this.lastSearched = now;

  // Update or create monthly stat
  let monthlyStat = this.monthlyStats.find(
    stat => stat.month === currentMonth && stat.year === currentYear
  );

  if (monthlyStat) {
    monthlyStat.searchCount += 1;
  } else {
    this.monthlyStats.push({
      month: currentMonth,
      year: currentYear,
      searchCount: 1
    });
  }

  // Update or create yearly stat
  let yearlyStat = this.yearlyStats.find(
    stat => stat.year === currentYear
  );

  if (yearlyStat) {
    yearlyStat.searchCount += 1;
  } else {
    this.yearlyStats.push({
      year: currentYear,
      searchCount: 1
    });
  }

  // Keep only last 24 months of monthly stats
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  this.monthlyStats = this.monthlyStats.filter(stat => {
    const statDate = new Date(stat.year, stat.month - 1);
    return statDate >= twoYearsAgo;
  });

  // Keep only last 5 years of yearly stats
  const fiveYearsAgo = currentYear - 5;
  this.yearlyStats = this.yearlyStats.filter(stat => stat.year > fiveYearsAgo);

  // Save the updated document
  await this.save();
};

// Static method to get trending medicines
genericMedicineStatsSchema.statics.getTrendingMedicines = async function(limit = 10) {
  return this.find()
    .sort({ searchCount: -1 })
    .limit(limit)
    .select('genericName searchCount lastSearched');
};

// Static method to get monthly trends for a medicine
genericMedicineStatsSchema.statics.getMonthlyTrends = async function(genericName, months = 6) {
  const medicine = await this.findOne({ genericName });
  if (!medicine) return null;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let trends = [];
  for (let i = 0; i < months; i++) {
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

  return trends;
};

const GenericMedicineStats = mongoose.model('GenericMedicineStats', genericMedicineStatsSchema);

export default GenericMedicineStats; 