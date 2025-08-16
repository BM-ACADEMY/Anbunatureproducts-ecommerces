const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #fff8f0; color: #333;">
            <h2 style="color: #d2691e;">Hi ${name},</h2>
            <p style="font-size: 16px;">
                We received a request to reset the password for your <strong>Anbu Natural_site</strong> account.
            </p>
            <p style="font-size: 16px;">
                Use the following OTP (One-Time Password) to reset your password:
            </p>
            <div style="font-size: 28px; font-weight: bold; background:rgb(231, 211, 190); color: #000; padding: 12px 20px; border-radius: 6px; text-align: center; margin: 20px 0;">
                ${otp}
            </div>
            <p style="font-size: 14px;">
                This OTP is valid for <strong>5 Min</strong>. Please do not share this code with anyone for your account’s safety.
            </p>
            <p style="font-size: 14px;">
                Didn’t request a password reset? You can safely ignore this email or contact our support team.
            </p>
            <br />
            <p style="font-size: 16px;">Warm regards,</p>
            <p style="font-size: 16px; font-weight: bold; color: #d2691e;">The Anbu Natural_site Team</p>
        </div>
    `;
  };
  
  export default forgotPasswordTemplate;