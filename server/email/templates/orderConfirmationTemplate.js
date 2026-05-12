// Anbu Natural-site/server/email/templates/orderConfirmationTemplate.js
const orderConfirmationTemplate = ({
  fullName, // User's name (from UserModel)
  orderId,
  orderDate,
  totalAmount,
  items, // Array of { name, quantity, price, attributes } -- 'attributes' is the new addition
  deliveryAddress, // Object with address details (now includes fullName & mobile)
  customImageUrl, // URL of the uploaded custom image
  donationAmount,
}) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #1f2937;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
      
      <!-- Header with Logo -->
      <div style="background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 1px solid #f3f4f6;">
        <img src="https://anbunatural.com/assets/common/logo.png" alt="Anbu Natural" style="height: 60px; width: auto; margin-bottom: 15px;">
        <h2 style="color: #111827; margin: 0; font-size: 24px; font-weight: 500; letter-spacing: -0.025em;">Your Order Has Been Placed!</h2>
      </div>

      <div style="padding: 30px;">
        <p style="margin-top: 0;">Dear <strong>${fullName}</strong>,</p>
        <p style="color: #4b5563; line-height: 1.6;">Thank you for your order! We're excited to confirm that your order <strong style="color: #111827;">#${orderId}</strong> placed on <strong>${orderDate}</strong> has been successfully received.</p>

        <h3 style="color: #111827; font-size: 16px; margin: 30px 0 15px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</h3>
        <table style="width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px 15px; text-align: left; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Product</th>
              <th style="padding: 12px 15px; text-align: center; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Qty</th>
              <th style="padding: 12px 15px; text-align: right; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item, index) => `
              <tr>
                <td style="padding: 15px; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6;">
                  <div style="font-weight: 600;">${item.name}</div>
                  ${item.attributes ? `<div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${item.attributes}</div>` : ""}
                </td>
                <td style="padding: 15px; text-align: center; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right; font-size: 14px; font-weight: 600; color: #111827; border-bottom: 1px solid #f3f4f6;">₹${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            ${donationAmount > 0 ? `
            <tr>
              <td colspan="2" style="padding: 10px 15px; text-align: right; font-size: 14px; color: #4b5563;">Donation to Foundation</td>
              <td style="padding: 10px 15px; text-align: right; font-size: 14px; font-weight: 600; color: #111827;">₹${donationAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
            ` : ""}
            <tr style="background-color: #f9fafb;">
              <td colspan="2" style="padding: 15px; text-align: right; font-size: 14px; font-weight: 700; color: #374151;">Total Amount</td>
              <td style="padding: 15px; text-align: right; font-size: 18px; font-weight: 700; color: #238d0e;">₹${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 30px;">
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; border: 1px solid #f3f4f6;">
            <h4 style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Delivery Address</h4>
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${deliveryAddress.fullName}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #4b5563;">${deliveryAddress.mobile}</p>
            <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
              ${deliveryAddress.address_line}<br>
              ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}<br>
              ${deliveryAddress.country}
            </p>
          </div>
        </div>

        ${
          customImageUrl
            ? `
        <div style="margin-top: 30px; padding: 20px; border: 2px dashed #e5e7eb; border-radius: 16px; text-align: center;">
          <h4 style="margin: 0 0 15px; font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase;">Your Custom Design</h4>
          <img src="${customImageUrl}" alt="Custom Design" style="max-width: 200px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
          <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">(Uploaded with your custom order)</p>
          <a href="${customImageUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background-color: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: 600;">View Full Size</a>
        </div>
        `
            : ""
        }

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
          <p style="font-size: 13px; color: #9ca3af; margin-top: 10px;">Questions? Contact us at <a href="mailto:anbunaturalproducts@gmail.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">anbunaturalproducts@gmail.com</a></p>
        </div>
      </div>

      <div style="background-color: #f9fafb; padding: 30px; text-align: center;">
        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #374151;">Thank you for shopping with us!</p>
        <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">&copy; ${new Date().getFullYear()} Anbu Natural Products. All rights reserved.</p>
      </div>
    </div>
  </div>
`;

export default orderConfirmationTemplate;
