import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from '@sendgrid/mail';
import { sendVerificationCode, verifyCode } from '../utils/twilioUtils.js';
import userModel from '../models/userModels.js';
import { generateOTP, verifyOTP } from '../utils/otpUtils.js';
import { sendEmail } from '../utils/emailUtils.js';
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  EMAIL_OTP_VERIFY_TEMPLATE
} from "../config/emailTemplates.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const register = async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;

  if (!name || !email || !password || !mobileNumber) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { mobileNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.email === email ? "Email already registered" : "Mobile number already registered" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      mobileNumber
    });

    // Send welcome email
    const welcomeMsg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to MedGenix',
      html: WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{email}}', email)
        .replace('{{password}}', password)
    };
    await sgMail.send(welcomeMsg);
    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: "Registration successful! Please login to continue.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Send OTP for login (supports both email and phone)
export const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOTP();
    user.loginOtp = otp;
    user.loginOtpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    // Send login OTP email using the new template
    await sendEmail({
      to: user.email,
      subject: 'Login Verification - MedGenix',
      html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
    });

    res.json({ success: true, message: 'Login verification code sent successfully' });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send login verification code' });
  }
};

// Verify OTP and login (supports both email and phone)
export const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and OTP are required" 
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify email OTP
    if (user.loginOtp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid OTP" 
      });
    }

    if (user.loginOtpExpireAt < Date.now()) {
      return res.status(400).json({ 
        success: false, 
        message: "OTP has expired" 
      });
    }

    // Clear OTP after successful verification
    user.loginOtp = undefined;
    user.loginOtpExpireAt = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data and token
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      token // Include token in response for header auth
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// send verification OTP to the user's email address
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await userModel.findById(userID);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Verify Your MedGenix Account",
      html: EMAIL_OTP_VERIFY_TEMPLATE
        .replace("{{otp}}", otp)
        .replace("{{email}}", user.email)
    };
    
    await sgMail.send(mailOption);
    return res.json({
      success: true,
      message: "Verification OTP sent to your email",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send verification email
export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send verification email using SendGrid
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Verify Your Email - MedGenix',
      html: EMAIL_VERIFY_TEMPLATE
        .replace(/\{\{email\}\}/g, user.email)
        .replace(/\{\{otp\}\}/g, otp)
    };
    
    console.log('Sending verification email to:', user.email);
    await sgMail.send(msg);
    console.log('Verification email sent successfully');

    res.json({ 
      success: true, 
      message: 'Verification code sent successfully',
      email: user.email // Return email for confirmation
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send verification email',
      error: error.response ? error.response.body : error.message
    });
  }
};

// Verify email with OTP
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    if (!user.verifyOtp || !user.verifyOtpExpireAt) {
      return res.status(400).json({ success: false, message: 'Please request a new verification code' });
    }

    if (new Date(user.verifyOtpExpireAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired' });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;
    await user.save();

    // Generate a new token with updated user data
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with new token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success with updated user data and token
    res.json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: true
      },
      token
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify email' });
  }
};

// check if the user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// send  password reset OTP
export const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Password Reset - MedGenix',
      html: PASSWORD_RESET_TEMPLATE
        .replace(/\{\{email\}\}/g, email)
        .replace(/\{\{otp\}\}/g, otp)
    };

    console.log('Sending password reset email to:', email);
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');

    res.status(200).json({ 
      success: true, 
      message: "Password reset code sent to your email",
      email: email // Return email for confirmation
    });
  } catch (error) {
    console.error('Send password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send password reset email",
      error: error.response ? error.response.body : error.message
    });
  }
};

// reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: "Email, OTP, and new password are required" 
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid reset code" 
      });
    }

    if (!user.resetOtpExpireAt || new Date(user.resetOtpExpireAt) < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: "Reset code has expired" 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();

    // Send password change confirmation email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Password Changed Successfully - MedGenix',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Changed Successfully</h2>
          <p>Your password has been successfully changed. If you did not make this change, please contact support immediately.</p>
          <p>Best regards,<br>MedGenix Team</p>
        </div>
      `
    };
    await sgMail.send(msg);

    return res.json({ 
      success: true, 
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to reset password",
      error: error.response ? error.response.body : error.message
    });
  }
};

export const verifyMobileOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Mobile number and OTP are required" 
    });
  }

  try {
    const user = await userModel.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify the code using Twilio Verify
    const verificationResult = await verifyCode(mobileNumber, otp);
    
    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: "Verification failed",
        error: verificationResult.error 
      });
    }

    if (verificationResult.status === 'approved') {
      user.isAccountVerified = true;
      await user.save();
      return res.status(200).json({ 
        success: true, 
        message: "Mobile number verified successfully" 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid verification code" 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
      token // Include token in response for header auth
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};
