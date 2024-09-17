import React from 'react';
import { Button } from "@/components/ui/button"
import { Html, Button } from "@react-email/components"

export default function OrderReceived({ orderNumber, itemName, quantity, totalAmount, estimatedDate, customerName, trackingUrl }) {
  return (
    <Html>
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
          <p><strong>Total:</strong> ${totalAmount}</p>
          <p><strong>Estimated Completion Date:</strong> {estimatedDate}</p>
        </div>
        
        <p className="mb-4">We'll start working on your order right away and keep you updated on its progress.</p>
        
        <a href={trackingUrl} className="inline-block w-full mb-6">
          <Button className="w-full primary-button">
            Track Your Order
          </Button>
        </a>
        
        <p className="mb-4">If you have any questions or need to make changes to your order, please don't hesitate to contact us at support@3dprintmaster.com.</p>
        
        <p>Thank you for choosing 3D PrintMaster!</p>
      </main>
      
      <footer className="mt-8 text-center text-sm text-[#8A8A8A]">
        <p>© {new Date().getFullYear()} 3D PrintMaster. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
      </footer>
    </div>
    </Html>
  )
}