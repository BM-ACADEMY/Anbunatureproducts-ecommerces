const userEmailTemplate = ({ fullName, message }) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
      
      <div style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f3f4f6;">
        <img src="https://anbunatural.com/assets/common/logo.png" alt="Anbu Natural" style="height: 50px; width: auto; margin-bottom: 10px;">
        <h2 style="color: #111827; margin: 0; font-size: 20px; font-weight: 800;">✨ Thank You for Contacting Us!</h2>
      </div>

      <div style="padding: 30px;">
        <p style="margin-top: 0;">Dear <strong>${fullName}</strong>,</p>
        <p style="color: #4b5563; line-height: 1.6;">Thank you for reaching out to Anbu Natural Products. We have received your inquiry and our team will get back to you as soon as possible.</p>
        
        <div style="margin: 25px 0; padding: 20px; background-color: #f9fafb; border-radius: 12px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Your Message:</p>
          <p style="margin: 0; color: #374151; font-style: italic;">"${message}"</p>
        </div>

        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">If you have any urgent queries, feel free to reply to this email.</p>
      </div>

      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} Anbu Natural Products. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export default userEmailTemplate;
