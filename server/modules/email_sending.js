import { render } from '@react-email/render';
import nodemailer from 'nodemailer';


const email_html = `
<div className="font-sans max-w-2xl mx-auto p-6 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0D939B]">3D PrintMaster</h1>
        <p className="text-[#6A6A6A]">Your 3D Printing Solution</p>
      </header>
      
      <main>
        <h2 className="text-2xl font-semibold mb-4 text-[#2A2A2A]">Order Received</h2>
        <p className="mb-4">Dear {customerName},</p>
        <p className="mb-4">Thank you for your order! We're excited to bring your 3D design to life. Here's a summary of your order:</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p><strong>Order Number:</strong> {orderNumber}</p>
          <p><strong>Item:</strong> {itemName}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Total:</strong> asd</p>
          <p><strong>Estimated Completion Date:</strong> {estimatedDate}</p>
        </div>
        
        <p className="mb-4">We'll start working on your order right away and keep you updated on its progress.</p>
        
        <a href={trackingUrl} className="inline-block w-full mb-6">
          <buttom className="w-full primary-button">
            Track Your Order
          </button>
        </a>
        
        <p className="mb-4">If you have any questions or need to make changes to your order, please don't hesitate to contact us at support@3dprintmaster.com.</p>
        
        <p>Thank you for choosing 3D PrintMaster!</p>
      </main>
      
      <footer className="mt-8 text-center text-sm text-[#8A8A8A]">
        <p>© {new Date().getFullYear()} 3D PrintMaster. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
      </footer>
    </div>
`;

const transporter = nodemailer.createTransport({
  host: process.env.SES_ENDPOINT,
  port: process.env.SES_PORT,
  secure: false,
  auth: {
    user: process.env.SES_USER,
    pass: process.env.SES_PASS,
  },
});

async function sendOrderReceivedEmail(orderDetails) {
  const emailHtml = email_html;

  const options = {
    from: 'notifications@mandarin3d.com',
    to: orderDetails.customerEmail,
    subject: 'Order Received - 3D PrintMaster',
    html: emailHtml,
  };

  await transporter.sendMail(options);
}

sendOrderReceivedEmail({
  customerName: 'John Doe',
  customerEmail: 'raavtube@icloud.com',
  orderNumber: '123456',
  itemName: '3D Printed Part',
  quantity: 1,
  totalAmount: 100,
  estimatedDate: '2024-01-01',
  trackingUrl: 'https://www.3dprintmaster.com/track-order/123456',
});

export { sendOrderReceivedEmail };
