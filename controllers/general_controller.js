'use server'

export const generateOTP = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};