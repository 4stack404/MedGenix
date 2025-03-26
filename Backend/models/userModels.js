import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: { type: String },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Date,
      default: null,
    },
    authMethod: {
        type: String, 
        enum: ['local', 'google'],
        default: 'local'
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    loginOtp: {
      type: String,
      default: "",
    },
    loginOtpExpireAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
