import express from "express";
import {
  register,
  login,
  logout,
  sendLoginOTP,
  verifyLoginOTP,
  sendPasswordResetOTP,
  resetPassword,
  isAuthenticated,
  sendVerificationEmail,
  verifyEmail
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// OTP Login routes
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);

// Email verification routes
router.post("/send-verification-email", authMiddleware, sendVerificationEmail);
router.post("/verify-email", authMiddleware, verifyEmail);

// Password reset routes
router.post("/send-reset-otp", sendPasswordResetOTP);
router.post("/reset-password", resetPassword);

// Check authentication status
router.get("/is-authenticated", authMiddleware, isAuthenticated);

export default router;
