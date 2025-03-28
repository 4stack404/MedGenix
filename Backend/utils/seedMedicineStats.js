import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GenericMedicineStats from '../models/genericMedicineStats.js';

dotenv.config();

const medicines = [
  'Paracetamol',
  'Ibuprofen',
  'Aspirin',
  'Cetirizine',
  'Amoxicillin',
  'Doxycycline'
];

// Function to generate random search counts
const generateRandomCount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate historical data for a medicine
const generateHistoricalData = (medicineName) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const monthlyStats = [];
  const yearlyStats = [];
  let totalSearchCount = 0;

  // Generate monthly stats for the past 12 months
  for (let i = 0; i < 12; i++) {
    let targetMonth = currentMonth - i;
    let targetYear = currentYear;
    
    if (targetMonth <= 0) {
      targetMonth += 12;
      targetYear -= 1;
    }

    const monthCount = generateRandomCount(50, 200);
    totalSearchCount += monthCount;

    monthlyStats.push({
      month: targetMonth,
      year: targetYear,
      searchCount: monthCount
    });
  }

  // Generate yearly stats for the past 3 years
  for (let i = 0; i < 3; i++) {
    const yearCount = generateRandomCount(800, 2000);
    yearlyStats.push({
      year: currentYear - i,
      searchCount: yearCount
    });
  }

  // Calculate a random date within the last month for lastSearched
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const randomDays = Math.floor(Math.random() * 30);
  lastMonth.setDate(lastMonth.getDate() + randomDays);

  return {
    genericName: medicineName,
    searchCount: totalSearchCount,
    monthlyStats,
    yearlyStats,
    lastSearched: lastMonth,
    createdAt: new Date(currentYear - 1, 0, 1), // Start from beginning of last year
    updatedAt: lastMonth
  };
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await GenericMedicineStats.deleteMany({});
    console.log('Cleared existing medicine stats');

    // Generate and insert data for each medicine
    const medicineData = medicines.map(generateHistoricalData);
    await GenericMedicineStats.insertMany(medicineData);

    console.log('Successfully seeded medicine statistics data');
    console.log(`Inserted ${medicines.length} medicines with historical data`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 