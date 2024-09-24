export default (orderObject, trackingUrl) => {
  const {
    customer_details,
    order_number,
    cart,
    total_details,
    shipping_details,
  } = orderObject;

  const lineItems = cart.files.map(file => ({
    name: file.filename,
    quantity: file.quantity,
    price: file.file_sale_cost.toFixed(2)
  }));

  // Add cart addons to line items
  cart.cart_addons.forEach(addon => {
    lineItems.push({
      name: addon.addon_name,
      quantity: 1,
      price: addon.addon_price.toFixed(2)
    });
  });

  const totalAmount = (total_details.amount_total / 100).toFixed(2);
  const estimatedDate = new Date(orderObject.dateCreated);
  estimatedDate.setDate(estimatedDate.getDate() + 7); // Add 7 days for estimated completion

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Received - Mandarin 3D Prints</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0D939B;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            color: #6A6A6A;
            margin-top: 0;
        }
        .main h2 {
            color: #2A2A2A;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .order-summary {
            background-color: #f1f1f1;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .receipt {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .receipt th, .receipt td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .receipt th {
            font-weight: bold;
            color: #2A2A2A;
        }
        .receipt .total {
            font-weight: bold;
            border-top: 2px solid #2A2A2A;
        }
        .button {
            display: inline-block;
            background-color: #0D939B;
            color: #FFFFFF;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 25px;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #8A8A8A;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://utfs.io/f/RSbfEU0J8DcdCynKZQgLjXek3YwT4EJOIxFb6PluomdA7UCi" alt="Mandarin 3D Prints Logo" style="width: 100px; height: auto; border-radius: 50%;" />
        <h1>Mandarin 3D Prints</h1>
        
    </div>
    
    <div class="main">
        <h2>Order Received</h2>
        <p>Dear ${customer_details.name},</p>
        <p>Thank you for your order! We're excited to bring your 3D designs to life. Here's a summary of your order:</p>
        
        <div class="order-summary">
            <p><strong>Order Number:</strong> ${order_number}</p>
            <table class="receipt">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                            <td>$${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total">
                        <td colspan="3">Total</td>
                        <td>$${totalAmount}</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Estimated Completion Date:</strong> ${estimatedDate.toDateString()}</p>
        </div>
        
        <p>We'll start working on your order right away and keep you updated on its progress.</p>
        
        <a href="${trackingUrl}" class="button">Track Your Order</a>
        
        <p>If you have any questions or need to make changes to your order, please don't hesitate to contact us at support@mandarin3d.com.</p>
        
        <p>Thank you for choosing Mandarin 3D Prints!</p>
    </div>
    
    <div class="footer">
        <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
    </div>
</body>
</html>`;
};

export const order_shipped = (orderObject, trackingUrl) => {
  const { customer_details, order_number, lineItems, totalAmount, estimatedDate, shippingInfo } = orderObject;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped - Mandarin 3D Prints</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #0D939B;
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            color: #6A6A6A;
            margin-top: 0;
        }
        .main h2 {
            color: #2A2A2A;
            font-size: 20px;
            margin-bottom: 15px;
        }
        .order-summary {
            background-color: #f1f1f1;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .receipt {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .receipt th, .receipt td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .receipt th {
            font-weight: bold;
            color: #2A2A2A;
        }
        .receipt .total {
            font-weight: bold;
            border-top: 2px solid #2A2A2A;
        }
        .button {
            display: inline-block;
            background-color: #0D939B;
            color: #FFFFFF;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 25px;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #8A8A8A;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="https://utfs.io/f/RSbfEU0J8DcdCynKZQgLjXek3YwT4EJOIxFb6PluomdA7UCi" alt="Mandarin 3D Prints Logo" style="width: 100px; height: auto; border-radius: 50%;" />
        <h1>Mandarin 3D Prints</h1>
    </div>
    
    <div class="main">
        <h2>Order Shipped</h2>
        <p>Dear ${customer_details.name},</p>
        <p>Great news! Your order has been shipped and is on its way to you. Here's a summary of your order:</p>
        
        <div class="order-summary">
            <p><strong>Order Number:</strong> ${order_number}</p>
            <p><strong>Shipping Method:</strong> ${shippingInfo.method}</p>
            <p><strong>Tracking Number:</strong> ${shippingInfo.trackingNumber}</p>
            <table class="receipt">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                            <td>$${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total">
                        <td colspan="3">Total</td>
                        <td>$${totalAmount}</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Estimated Delivery Date:</strong> ${estimatedDate.toDateString()}</p>
        </div>
        
        <p>You can track your package using the tracking number provided above or by clicking the button below:</p>
        
        <a href="${trackingUrl}" class="button">Track Your Package</a>
        
        <p>If you have any questions about your shipment, please don't hesitate to contact us at support@mandarin3d.com.</p>
        
        <p>Thank you for choosing Mandarin 3D Prints!</p>
    </div>
    
    <div class="footer">
        <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
    </div>
</body>
</html>`;
};
