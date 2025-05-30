/**
 * Email Service Utility for Apex E-commerce
 * Handles sending OTP emails for account verification
 */
const nodemailer = require('nodemailer');

/**
 * Configure nodemailer transporter with credentials from environment variables
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends an OTP verification email to the user
 * @param {string} toEmail - Recipient's email address
 * @param {string} otp - The OTP to be sent
 * @returns {Promise} - Resolves with info on success, rejects with error on failure
 */
const sendOtpEmail = async (toEmail, otp) => {
  try {
    // Email options
    const mailOptions = {
      from: `"Apex Headphones" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Apex Headphones - Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2c3e50;">Apex Headphones</h1>
            <p style="font-size: 18px;">Verify Your Account</p>
          </div>
          <div style="margin-bottom: 20px;">
            <p>Thank you for registering with Apex Headphones. To complete your registration, please use the verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">${otp}</div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this verification, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #777;">
            <p>&copy; ${new Date().getFullYear()} Apex Headphones. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${toEmail}: ${error.message}`);
    throw error;
  }
};

/**
 * Sends a password reset email to the user
 * @param {string} toEmail - Recipient's email address
 * @param {string} resetToken - The password reset token
 * @param {string} resetUrl - The full URL to reset the password
 * @returns {Promise} - Resolves with info on success, rejects with error on failure
 */
const sendPasswordResetEmail = async (toEmail, resetToken, resetUrl) => {
  try {
    // Email options
    const mailOptions = {
      from: `"Apex Headphones" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Apex Headphones - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2c3e50;">Apex Headphones</h1>
            <p style="font-size: 18px;">Password Reset Request</p>
          </div>
          <div style="margin-bottom: 20px;">
            <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
            <p>Please click the button below to reset your password. This link will expire in 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2c3e50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>For security reasons, this link will expire in 1 hour.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #777;">
            <p>&copy; ${new Date().getFullYear()} Apex Headphones. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error sending password reset email to ${toEmail}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail
};
