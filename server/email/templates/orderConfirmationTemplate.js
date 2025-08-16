// Anbu Natural-site/server/email/templates/orderConfirmationTemplate.js
const orderConfirmationTemplate = ({
  fullName, // User's name (from UserModel)
  orderId,
  orderDate,
  totalAmount,
  items, // Array of { name, quantity, price, attributes } -- 'attributes' is the new addition
  deliveryAddress, // Object with address details (now includes fullName & mobile)
  customImageUrl, // URL of the uploaded custom image
}) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #28a745;">
        <h2 style="color: #007bff;">🎉 Your Order Has Been Placed!</h2>
      </div>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Thank you for your order! We're excited to confirm that your order <strong>#${orderId}</strong> placed on <strong>${orderDate}</strong> has been successfully received.</p>

      <h3 style="color: #333;">Order Summary:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">
                ${item.name}
                ${item.attributes ? `<br><small style="color: #666;">(${item.attributes})</small>` : ''} </td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                item.quantity
              }</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(
                2
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₹${totalAmount.toFixed(
              2
            )}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="color: #333;">Delivery Address:</h3>
      <p style="margin: 0;"><strong>Recipient:</strong> ${deliveryAddress.fullName}</p>
      <p style="margin: 0;"><strong>Mobile:</strong> ${deliveryAddress.mobile}</p>
      <p style="margin: 0;">${deliveryAddress.address_line}</p>
      <p style="margin: 0;">${deliveryAddress.city}, ${
        deliveryAddress.state
      } - ${deliveryAddress.pincode}</p>
      <p style="margin: 0;">${deliveryAddress.country}</p>

      ${
        customImageUrl
          ? `
      <h3 style="color: #333; margin-top: 20px;">Your Custom Image:</h3>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${customImageUrl}" alt="Custom Order Image" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">
          (This image was uploaded with your custom order)
          <br />
          <a href="${customImageUrl}" target="_blank" style="color: #007bff;">View Image in Browser</a>
        </p>
      </div>
      `
          : ""
      }


      <p>You will receive another email notification when your order is shipped.</p>
      <p>If you have any questions, please reply to this email or contact us at <a href="mailto:support@yourapp.com" style="color: #007bff;">support@yourapp.com</a>.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="text-align: center; font-size: 14px; color: #777;">Thank you for shopping with us!</p>
    </div>
  </div>
`;

export default orderConfirmationTemplate;