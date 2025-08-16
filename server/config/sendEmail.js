import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log("❌ Please provide EMAIL_USER and EMAIL_PASS in your .env file");
}

const transporter = nodemailer.createTransport({
  secure: true,
  service: 'gmail', // Or another email service like 'hotmail', 'yahoo', or custom SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email failed to send:", error.message);
  }
};

export default sendEmail;
