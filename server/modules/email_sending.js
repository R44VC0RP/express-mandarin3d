import { render } from '@react-email/components';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import dotenv from 'dotenv';

dotenv.config( { path: '../.env.local' } );

console.log(process.env.aws_access_key_id);
console.log(process.env.aws_secret_access_key);

const email_html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root{--background:0 0% 100%;--foreground:240 10% 3.9%;--card:0 0% 100%;--card-foreground:240 10% 3.9%;--popover:0 0% 100%;--popover-foreground:240 10% 3.9%;--primary:240 5.9% 10%;--primary-foreground:0 0% 98%;--secondary:240 4.8% 95.9%;--secondary-foreground:240 5.9% 10%;--muted:240 4.8% 95.9%;--muted-foreground:240 3.8% 45%;--accent:240 4.8% 95.9%;--accent-foreground:240 5.9% 10%;--destructive:0 72% 51%;--destructive-foreground:0 0% 98%;--border:240 5.9% 90%;--input:240 5.9% 90%;--ring:240 5.9% 10%;--chart-1:173 58% 39%;--chart-2:12 76% 61%;--chart-3:197 37% 24%;--chart-4:43 74% 66%;--chart-5:27 87% 67%;--radius:0.5rem;}
    img[src="/placeholder.svg"],img[src="/placeholder-user.jpg"]{filter:sepia(.3) hue-rotate(-60deg) saturate(.5) opacity(0.8) }
    h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; --font-sans-serif: 'Inter'; }
    body { font-family: 'Inter', sans-serif; --font-sans-serif: 'Inter'; }
  </style>
</head>
<body>
<div class="bg-background text-card-foreground">
  <header class="bg-primary px-6 py-4">
    <div class="container mx-auto flex items-center justify-between">
      <a href="#">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-8 w-auto text-primary-foreground"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" x2="3" y1="12" y2="12"></line>
        </svg>
      </a>
      <nav>
        <ul class="flex items-center space-x-4">
          <li>
            <a href="#" class="text-sm font-medium text-primary-foreground hover:underline">
              Home
            </a>
          </li>
          <li>
            <a class="text-sm font-medium text-primary-foreground hover:underline" href="#">
              Products
            </a>
          </li>
          <li>
            <a href="#" class="text-sm font-medium text-primary-foreground hover:underline">
              About
            </a>
          </li>
          <li>
            <a class="text-sm font-medium text-primary-foreground hover:underline" href="#">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
  <main class="py-12">
    <div class="container mx-auto space-y-8">
      <div class="rounded-lg border border-input bg-card p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Order Update</h2>
            <p class="text-muted-foreground">Your order #12345 has been shipped.</p>
          </div>
          <div class="flex items-center space-x-2">
            <div
              class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-600 text-green-50"
              data-v0-t="badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 text-green-50"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              Shipped
            </div>
            <div
              class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-yellow-600 text-yellow-50"
              data-v0-t="badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 text-yellow-50"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Estimated Delivery: Sep 25
            </div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-medium">Order Details</h3>
            <div class="space-y-2 text-muted-foreground">
              <p>
                <span class="font-medium">Item:</span> 3D Printer
              </p>
              <p>
                <span class="font-medium">Quantity:</span> 1
              </p>
              <p>
                <span class="font-medium">Total:</span> $499.99
              </p>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium">Shipping Details</h3>
            <div class="space-y-2 text-muted-foreground">
              <p>
                <span class="font-medium">Address:</span> 123 Main St, Anytown USA
              </p>
              <p>
                <span class="font-medium">Carrier:</span> USPS
              </p>
              <p>
                <span class="font-medium">Tracking:</span>{" "}
                <a class="font-medium text-primary hover:underline" href="#">
                  1Z999AA1234567890
                </a>
              </p>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-muted text-muted-foreground hover:bg-muted/90">
            View Order
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </main>
  <footer class="bg-muted px-6 py-8 text-muted-foreground">
    <div class="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
      <div class="flex items-center space-x-4">
        <a href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-auto text-muted-foreground"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" x2="3" y1="12" y2="12"></line>
          </svg>
        </a>
        <p class="text-sm">© 2023 3D Printing Co. All rights reserved.</p>
      </div>
      <div class="flex items-center space-x-4">
        <a class="text-sm font-medium hover:underline" href="#">
          Privacy Policy
        </a>
        <a href="#"></a>
      </div>
    </div>
  </footer>
</div>
</body>
</html>
`;

const sesClient = new SESClient({
  region: "us-east-2", // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  },
});

const params = {
  Source: 'orderupdate@mandarin3d.com', // Simplify this
  Destination: {
    ToAddresses: ['raavtube@icloud.com'],
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        Data: email_html,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Order Received for Order #123456',
    },
  },
};

try {
  const command = new SendEmailCommand(params);
  const response = await sesClient.send(command);
  console.log("Email sent successfully:", response);
} catch (error) {
  console.error("Error sending email:", error.message);
  if (error.$metadata) {
    console.error("Error metadata:", error.$metadata);
  }
}
