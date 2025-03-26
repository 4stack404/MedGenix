/**
 * Generates a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

/**
 * Verifies if the provided OTP matches and is not expired
 * @param {string} storedOtp - The OTP stored in the database
 * @param {string} providedOtp - The OTP provided by the user
 * @param {Date} expiryTime - The expiry timestamp of the OTP
 * @returns {boolean} - Whether the OTP is valid and not expired
 */
export const verifyOTP = (storedOtp, providedOtp, expiryTime) => {
  if (!storedOtp || !providedOtp || !expiryTime) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > new Date(expiryTime)) {
    return false;
  }

  // Compare OTPs
  return storedOtp === providedOtp;
}; 