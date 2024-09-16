import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="font-sans max-w-2xl mx-auto p-6 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">3D PrintMaster</h1>
        <p className="text-gray-600">Your 3D Printing Solution</p>
      </header>
      
      <main>
        <h2 className="text-2xl font-semibold mb-4">Order Received</h2>
        <p className="mb-4">Dear [Customer Name],</p>
        <p className="mb-4">Thank you for your order! We're excited to bring your 3D design to life. Here's a summary of your order:</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p><strong>Order Number:</strong> [Order Number]</p>
          <p><strong>Item:</strong> [Item Name]</p>
          <p><strong>Quantity:</strong> [Quantity]</p>
          <p><strong>Total:</strong> [Total Amount]</p>
          <p><strong>Estimated Completion Date:</strong> [Estimated Date]</p>
        </div>
        
        <p className="mb-4">We'll start working on your order right away and keep you updated on its progress.</p>
        
        <Button className="w-full mb-6">
          Track Your Order
        </Button>
        
        <p className="mb-4">If you have any questions or need to make changes to your order, please don't hesitate to contact us at support@3dprintmaster.com.</p>
        
        <p>Thank you for choosing 3D PrintMaster!</p>
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>© 2023 3D PrintMaster. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
      </footer>
    </div>
  )
}