const verifyEmailTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f0faff; color: #333;">
      <h2 style="color: #0077b6;">Hi ${name},</h2>
      <p style="font-size: 16px;">
        Thank you for registering with <strong>Anbu Natural</strong>!
      </p>
      <p style="font-size: 16px;">
        To complete your registration, please verify your email using the following OTP (One-Time Password):
      </p>
      <div style="font-size: 28px; font-weight: bold; background: #d0efff; color: #000; padding: 12px 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 14px;">
        This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.
      </p>
      <p style="font-size: 14px;">
        If you didn’t initiate this request, you can safely ignore this email.
      </p>
      <br />
      <p style="font-size: 16px;">Cheers,</p>
      <p style="font-size: 16px; font-weight: bold; color: #0077b6;">The Anbu Natural Team</p>
    </div>
  `;
};

export default verifyEmailTemplate;