export const order_received = (orderObject, trackingUrl) => {
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
            color: #466F80;
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
            background-color: #466F80;
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
        
    </div>
</body>
</html>`;
};

export const business_order_received = (orderObject) => {
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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Received - Mandarin 3D Prints</title>
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
            color: #466F80;
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
            background-color: #466F80;
            color: white;
        }
        .receipt .total {
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #466F80;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6A6A6A;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mandarin 3D Prints</h1>
        <p>Custom 3D Printing Solutions</p>
    </div>
    
    <div class="main">
        <h2>New Order Received</h2>
        <p>A new order has been placed. Here are the details:</p>
        
        <div class="order-summary">
            <p><strong>Order Number:</strong> ${order_number}</p>
            <p><strong>Customer Name:</strong> ${customer_details.name}</p>
            <p><strong>Customer Email:</strong> ${customer_details.email}</p>
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
        </div>
        
        <h3>Shipping Information:</h3>
        <p>
            ${shipping_details.address.line1}<br>
            ${shipping_details.address.line2 ? shipping_details.address.line2 + '<br>' : ''}
            ${shipping_details.address.city}, ${shipping_details.address.state} ${shipping_details.address.postal_code}<br>
            ${shipping_details.address.country}
        </p>
        
        <p>Please process this order as soon as possible.</p>
    </div>
    
    <div class="footer">
        <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        
    </div>
</body>
</html>`;
};


export const order_shipped = (orderObject) => {
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
            color: #466F80;
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
            background-color: #466F80;
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
            <p><strong>Shipping Method:</strong> USPS Priority Mail</p>
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
        </div>
        
        <p>You can track your package using the tracking number provided above or by clicking the button below (this probably won't work yet if you just got this email):</p>
        
        <a href="${shipping_details.tracking_url}" class="button">Track Your Package</a>
        
        <p>If you have any questions about your shipment, please don't hesitate to contact us at support@mandarin3d.com.</p>
        
        <p>Thank you for choosing Mandarin 3D Prints!</p>
    </div>
    
    <div class="footer">
        <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        
    </div>
</body>
</html>`;
};

export const contact_email = (name, email, message) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission from ${name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #2A2A2A;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            background: #466F80;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .message-box {
            background: #f5f5f5;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6A6A6A;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>
        
        <div class="content">
            <h2>Contact Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            
            <h2>Message</h2>
            <div class="message-box">
                <p>${message}</p>
            </div>
            
            <p>This message was sent from the contact form on Mandarin 3D Prints website.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

export const file_issue_email = (fileid, email, fileurl) => {
  return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #466F80;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
        }
        .message-box {
            background: #f5f5f5;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: #466F80;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6A6A6A;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>File Issue Report</h1>
        </div>
        
        <div class="content">
            <h2>Issue Details</h2>
            <p><strong>File ID:</strong> ${fileid}</p>
            <p><strong>Reported By:</strong> ${email}</p>
            
            <div class="message-box">
                <p>A user has reported an issue with their file. Please review the file and contact the user.</p>
                <a href="${fileurl}" class="button">Download File</a>
            </div>
            
            <p>This issue was reported through the Mandarin 3D Prints website.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Mandarin 3D Prints. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};