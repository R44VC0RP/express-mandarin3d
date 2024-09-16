import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="font-sans max-w-2xl mx-auto p-6 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">3D PrintMaster</h1>
        <p className="text-gray-600">Your 3D Printing Solution</p>
      </header>
      
      <main>
        <h2 className="text-2xl font-semibold mb-4">Your Order Has Shipped!</h2>
        <p className="mb-4">Dear [Customer Name],</p>
        <p className="mb-4">Great news! Your 3D printed item has been completed and shipped. Here are the details:</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p><strong>Order Number:</strong> [Order Number]</p>
          <p><strong>Item:</strong> [Item Name]</p>
          <p><strong>Tracking Number:</strong> [Tracking Number]</p>
          <p><strong>Estimated Delivery Date:</strong> [Estimated Delivery Date]</p>
        </div>
        
        <Button className="w-full mb-6">
          Track Your Package
        </Button>
        
        <p className="mb-4">We hope you'll be thrilled with your 3D printed creation. If you have any questions about your order or the shipping process, please don't hesitate to reach out to us at support@3dprintmaster.com.</p>
        
        <p className="mb-4">Thank you for choosing 3D PrintMaster. We appreciate your business!</p>
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>© 2023 3D PrintMaster. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
      </footer>
    </div>
  )
}