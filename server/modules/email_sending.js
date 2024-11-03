import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';
import { order_received, order_shipped, business_order_received, contact_email, file_issue_email } from '../email_templates/order_templates.js';
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

const sendContactEmailToAdmin = async (name, email, message) => {
  const params = {
    Source: 'Mandarin 3D Prints <order@mandarin3d.com>',
    Destination: {
      ToAddresses: ['ryan@mandarin3d.com'],
    },
    ReplyToAddresses: [email],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: contact_email(name, email, message),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New Contact Form Submission from ${name}`,
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Contact email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending contact email:", error.message);
  }
};

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
          Data: order_received(orderObject, trackingUrl),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Order Received for Order ${orderObject.order_number}`,
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
        Data: `Your Order ${orderObject.order_number} Has Been Shipped`,
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

const businessOrderReceived = async (orderObject) => {
  const params = {
    Source: 'Mandarin 3D Prints <order@mandarin3d.com>',
    Destination: {
      ToAddresses: ['ryan@mandarin3d.com'],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: business_order_received(orderObject),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New Order Received - Order ${orderObject.order_number}`,
      },
    },
  };
  
  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Business order received email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending business order received email:", error.message);
    if (error.$metadata) {
      console.error("Error metadata:", error.$metadata);
    }
    throw error;
  }
};
  
const sendFileIssueEmail = async (fileid, email, fileurl) => {
  const params = {
    Source: 'Mandarin 3D Prints <order@mandarin3d.com>',
    Destination: {
      ToAddresses: ['ryan@mandarin3d.com'],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: file_issue_email(fileid, email, fileurl),
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New File Issue Submission - File ${fileid}`,
      },
    },
  };
  
  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("File issue email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending file issue email:", error.message);
    if (error.$metadata) {
      console.error("Error metadata:", error.$metadata);
    }
    throw error;
  }
};


export { sendOrderReceivedEmail, sendOrderShippedEmail, businessOrderReceived, sendContactEmailToAdmin, sendFileIssueEmail };


