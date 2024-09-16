import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function Component() {
  return (
    <div className="font-sans max-w-2xl mx-auto p-6 bg-white">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">3D PrintMaster</h1>
        <p className="text-gray-600">Your 3D Printing Solution</p>
      </header>
      
      <main>
        <h2 className="text-2xl font-semibold mb-4">How Did We Do?</h2>
        <p className="mb-4">Dear [Customer Name],</p>
        <p className="mb-4">We hope you're enjoying your recent 3D printed item from 3D PrintMaster. Your feedback is incredibly valuable to us and helps us improve our services.</p>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p><strong>Order Number:</strong> [Order Number]</p>
          <p><strong>Item:</strong> [Item Name]</p>
          <p><strong>Order Date:</strong> [Order Date]</p>
        </div>
        
        <p className="mb-4">Would you mind taking a moment to rate your experience?</p>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button key={rating} variant="outline" className="p-2">
              <Star className={rating <= 3 ? "w-6 h-6" : "w-6 h-6 fill-yellow-400"} />
            </Button>
          ))}
        </div>
        
        <Button className="w-full mb-6">
          Write a Review
        </Button>
        
        <p className="mb-4">Your honest feedback helps us continually improve and serve you better. If you experienced any issues with your order, please let us know, and we'll do our best to make it right.</p>
        
        <p className="mb-4">Thank you for choosing 3D PrintMaster. We look forward to serving you again in the future!</p>
      </main>
      
      <footer className="mt-8 text-center text-sm text-gray-600">
        <p>© 2023 3D PrintMaster. All rights reserved.</p>
        <p>123 Printer Lane, Tech City, TC 12345</p>
      </footer>
    </div>
  )
}