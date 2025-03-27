import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import pharmacyRouter from './routes/pharmacyRoutes.js';
import genericMedicineRouter from './routes/genericMedicineRoutes.js';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import ocrRouter from './routes/ocrRoutes.js';

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
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

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

// Configure multer for file uploads for OCR
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

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

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('Upload endpoint hit at:', new Date().toISOString());
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message 
    });
  }
});

// OCR Processing endpoint
app.post('/api/process-ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Create form data for the OCR API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    console.log('Sending request to OCR API:', OCR_API_URL);

    // Send request to OCR API with proper headers
    const response = await axios.post(OCR_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000, // 30 second timeout
      maxRedirects: 0, // Don't follow redirects automatically
      validateStatus: status => status < 500 // Consider all non-5xx responses as success
    });

    console.log('OCR API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });

    // If we get a redirect, follow it manually with a POST request
    if (response.status === 307 || response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.location;
      console.log('Following redirect to:', redirectUrl);
      
      // Create new form data for the redirect
      const redirectFormData = new FormData();
      redirectFormData.append('file', fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      
      // Make the second request to the redirect location
      const redirectResponse = await axios.post(redirectUrl, redirectFormData, {
        headers: {
          ...redirectFormData.getHeaders(),
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 30000
      });
      
      console.log('Redirect response:', {
        status: redirectResponse.status,
        statusText: redirectResponse.statusText,
        data: redirectResponse.data
      });
      
      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);
      
      return res.json(redirectResponse.data);
    }

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json(response.data);
  } catch (error) {
    console.error('OCR Processing Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    // Clean up the uploaded file in case of error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    // Send more detailed error information
    res.status(500).json({ 
      message: 'Error processing OCR',
      error: error.message,
      details: error.response?.data || 'No additional details available',
      status: error.response?.status,
      endpoint: OCR_API_URL
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

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/pharmacy', pharmacyRouter);
app.use('/api/generic-medicines', genericMedicineRouter);

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