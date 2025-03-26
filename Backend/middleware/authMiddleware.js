import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required. Please login." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token. Please login again." 
    });
  }
}; 