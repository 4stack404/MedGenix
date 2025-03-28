import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import pharmacyRouter from './routes/pharmacyRoutes.js';
import genericMedicineRouter from './routes/genericMedicineRoutes.js';
import prescriptionRouter from './routes/prescriptionRoutes.js';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import ocrRouter from './routes/ocrRoutes.js';
import { v2 as cloudinary } from 'cloudinary';
import userModel from './models/userModels.js';
import { Readable } from 'stream';
import medicineRoutes from './routes/medicineRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
connectDB();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    },
    name: 'medgenix.sid', // Custom session name
    rolling: true, // Refresh session on every request
    unset: 'destroy' // Remove session when browser closes
  })
);

// Add session debugging middleware
app.use((req, res, next) => {
  console.log('Session Debug:', {
    sessionID: req.sessionID,
    hasSession: !!req.session,
    userId: req.session?.userId,
    cookie: req.session?.cookie
  });
  next();
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Explicitly handle OPTIONS requests for preflight
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Log incoming requests to OCR endpoints
app.use('/api', (req, res, next) => {
  console.log(`${new Date().toISOString()} - OCR API request: ${req.method} ${req.originalUrl}`);
  next();
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// OCR API Configuration
const OCR_API_URL = process.env.OCR_API_URL || 'https://medgenix-production.up.railway.app/process-prescription/';

// OCR routes directly in server.js instead of using router
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit at:', new Date().toISOString());
  res.json({ message: 'Backend is working!' });
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'prescriptions',
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

// OCR Processing endpoint
app.post('/api/process-ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get user ID from session
    const userId = req.session.userId;
    console.log('Session data:', req.session);

    if (!userId) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        details: 'Please log in to upload prescriptions'
      });
    }

    // Verify user exists in database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        details: 'User account no longer exists'
      });
    }

    // Upload to Cloudinary directly from buffer
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    // Create form data for OCR API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Send request to OCR API
    const response = await axios.post(OCR_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000
    });

    const ocrData = response.data;

    // Extract medicines from OCR data
    const medicines = (ocrData.medicines || []).map(medicine => ({
      brand_name: medicine.brand_name || '',
      dosage: medicine.dosage || '',
      frequency: medicine.frequency || '',
      duration: medicine.duration || ''
    }));

    // Generate a unique prescription ID
    const prescriptionId = `PRES${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Update user's prescriptions in database
    await userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          prescriptions: {
            prescriptionId: prescriptionId,
            imageUrl: cloudinaryResult.secure_url,
            medicines: medicines.map(med => ({
              brand_name: med.brand_name,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration
            })),
            createdAt: new Date()
          }
        }
      }
    );

    res.json({
      ...ocrData,
      medicines: medicines,
      cloudinaryUrl: cloudinaryResult.secure_url,
      prescriptionId: prescriptionId
    });

  } catch (error) {
    console.error('OCR Processing Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    res.status(500).json({ 
      message: 'Error processing OCR',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Create a simple OCR simulation endpoint for testing
app.post('/api/simulate-ocr', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Simulate OCR processing
    const simulatedResult = {
      success: true,
      medications: [
        {
          name: "Simulated Medication 1",
          dosage: "10mg",
          frequency: "Daily"
        },
        {
          name: "Simulated Medication 2", 
          dosage: "500mg",
          frequency: "Twice daily"
        }
      ],
      patient: {
        name: "Test Patient",
        id: "P12345"
      },
      processed_at: new Date().toISOString()
    };
    
    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(simulatedResult);
  } catch (error) {
    console.error('Simulation Error:', error);
    
    // Clean up the uploaded file in case of error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      message: 'Error simulating OCR',
      error: error.message
    });
  }
});

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/pharmacies', pharmacyRouter);
app.use('/api/generic-medicines', genericMedicineRouter);
app.use('/api/prescriptions', prescriptionRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/medicines', medicineRoutes);

// Add endpoint to update prescription medicines
app.put('/api/prescriptions/:prescriptionId', async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const { medicines } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
        details: 'Please log in to update prescriptions'
      });
    }

    // Update the prescription in the user's document
    const result = await userModel.findOneAndUpdate(
      { 
        'prescriptions.prescriptionId': prescriptionId,
        _id: userId 
      },
      {
        $set: {
          'prescriptions.$.medicines': medicines.map(med => ({
            brand_name: med.brand_name || '',
            dosage: med.dosage || '',
            frequency: med.frequency || '',
            duration: med.duration || ''
          }))
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        message: 'Prescription not found',
        details: 'Could not find prescription with the given ID'
      });
    }

    res.json({
      message: 'Prescription updated successfully',
      prescription: result.prescriptions.find(p => p.prescriptionId === prescriptionId)
    });

  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({
      message: 'Error updating prescription',
      error: error.message
    });
  }
});

// Add this logging middleware to debug OCR routes
app.use('/api/ocr', (req, res, next) => {
  console.log(`OCR router request: ${req.method} ${req.path}`);
  next();
});

// Register OCR router with a more specific path
app.use('/api/ocr', ocrRouter);

// Keep the direct routes for compatibility
app.get('/api/test', (req, res) => {
  console.log('Direct test endpoint hit at:', new Date().toISOString());
  res.json({ message: 'Backend direct route is working!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error('Error on route:', req.method, req.originalUrl);
  res.status(500).json({ success: false, message: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;