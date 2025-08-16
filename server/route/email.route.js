import express from 'express';
import sendEmail from '../config/sendEmail.js';
import ownerEmailTemplate from '../email/templates/ownerEmail.js';
import userEmailTemplate from '../email/templates/userEmail.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { fullName, email, contactNumber, companyName, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'Full name, email, and message are required' });
    }

    // Send email to owner
    await sendEmail({
      sendTo: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      html: ownerEmailTemplate({ fullName, email, contactNumber, companyName, message }),
    });

    // Send confirmation email to user
    await sendEmail({
      sendTo: email,
      subject: 'Thank You for Contacting Us',
      html: userEmailTemplate({ fullName, message }),
    });

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send emails', error: error.message });
  }
});

export default router;