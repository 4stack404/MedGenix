import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If the number doesn't start with country code, add it
    if (!cleaned.startsWith('91')) {
        return `+91${cleaned}`;
    }
    
    // If it already has country code, just add the plus sign
    return `+${cleaned}`;
};

export const sendVerificationCode = async (phoneNumber) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const verification = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedNumber,
        channel: 'sms'
      });
    
    return {
      success: true,
      status: verification.status
    };
  } catch (error) {
    console.error('Twilio verification error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyCode = async (phoneNumber, code) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    const verificationCheck = await twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedNumber,
        code: code
      });
    
    return {
      success: true,
      status: verificationCheck.status
    };
  } catch (error) {
    console.error('Twilio verification check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 