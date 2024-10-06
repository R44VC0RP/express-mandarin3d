import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';
import order_recieved from '../email_templates/order_templates.js';
import order_shipped from '../email_templates/order_templates.js';
import path from 'path';

dotenv.config({ path: '../.env.local' });

console.log(process.env.aws_access_key_id);
console.log(process.env.aws_secret_access_key);

const sesClient = new SESClient({
  region: "us-east-2", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});

const sendOrderReceivedEmail = async (orderObject) => {
  const trackingUrl = `${process.env.FRONTEND_URL}/confirmation/${orderObject.order_id}`;
  const params = {
    Source: 'Mandarin 3D Prints <order@mandarin3d.com>',
    Destination: {
      ToAddresses: [orderObject.customer_details.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: order_recieved(orderObject, trackingUrl),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Order Received for Order #${orderObject.order_number}`,
      },
    },
  };

  try {
    
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error.message);
    if (error.$metadata) {
      console.error("Error metadata:", error.$metadata);
    }
    throw error;
  }
};


const sendOrderShippedEmail = async (orderObject) => {
  const params = {
    Source: 'Mandarin 3D Prints <order@mandarin3d.com>',
    Destination: {
      ToAddresses: [orderObject.customer_details.email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: order_shipped(orderObject),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Your Order #${orderObject.order_number} Has Been Shipped`,
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Order shipped email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending order shipped email:", error.message);
    if (error.$metadata) {
      console.error("Error metadata:", error.$metadata);
    }
    throw error;
  }
};

export { sendOrderReceivedEmail, sendOrderShippedEmail };


