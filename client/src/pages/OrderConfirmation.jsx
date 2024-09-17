import React, { useState } from 'react';
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Package, Printer, Truck, Box, CheckCircle, Clock, Calendar, DollarSign, FileText, MessageSquare, Phone, Printer as PrinterIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'

function DeliveryStatus({ status, statusOrder = ["Designing", "In Queue", "Printing", "Quality Check", "Shipped", "Delivered"] }) {
  const currentStepIndex = statusOrder.indexOf(status)
  const statusIcons = [Printer, Clock, Printer, CheckCircle, Truck, Box]
  
  return (
    <Card className="w-full bg-[#1A1A1A] border-[#3A3A3A] border-2 rounded-[15px] overflow-hidden p-4 md:p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Order Status</h3>
      <div className="relative">
        <div className="flex items-center justify-between">
          {statusOrder.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center",
                  index <= currentStepIndex ? "bg-green-500" : "bg-gray-600"
                )}
              >
                {React.createElement(statusIcons[index], { size: 16, className: "text-white" })}
              </motion.div>
              <span className="mt-2 text-xs text-white text-center hidden md:block">{step}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-4 md:top-5 left-0 right-0 h-0.5 bg-gray-600">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStepIndex / (statusOrder.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-green-500"
          />
        </div>
      </div>
    </Card>
  )
}

function InfoCard({ icon, title, content }) {
  return (
    <Card className="bg-[#2A2A2A] border-[#3A3A3A] border-2 rounded-[15px] overflow-hidden p-4">
      <div className="flex items-center space-x-3">
        {React.createElement(icon, { size: 24, className: "text-green-500" })}
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className="text-white">{content}</p>
        </div>
      </div>
    </Card>
  )
}

function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-white">How can I track my order?</AccordionTrigger>
        <AccordionContent className="text-gray-300">
          You can track your order by logging into your account and visiting the "My Orders" section. There, you'll find real-time updates on your order status.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-white">What if I need to make changes to my order?</AccordionTrigger>
        <AccordionContent className="text-gray-300">
          If you need to make changes to your order, please contact our customer support team as soon as possible. We'll do our best to accommodate your request if the order hasn't entered the production phase.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-white">What's your return policy?</AccordionTrigger>
        <AccordionContent className="text-gray-300">
          We offer a 30-day return policy for standard items. Custom 3D printed items are non-returnable unless there's a defect in the printing process. Please refer to our full return policy for more details.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default function OrderConfirmation({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your 3D Printing Order</h1>
          <p className="text-lg md:text-xl text-green-500">
            Order Number: {order.orderId}
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#2A2A2A] border-[#3A3A3A] border-2 rounded-[15px] overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:space-x-6">
              <div className="bg-green-500 rounded-full p-4 mb-4 md:mb-0">
                <Package size={48} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">You're all set!</h2>
                <p className="text-white text-base md:text-lg">Your 3D printing order has been confirmed and is being processed.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard icon={Calendar} title="Order Date" content={order.orderDate} />
          <InfoCard icon={Truck} title="Estimated Delivery" content={order.estimatedDelivery} />
          <InfoCard icon={DollarSign} title="Total Cost" content={`$${order.totalCost.toFixed(2)}`} />
        </div>

        <DeliveryStatus status={order.status} />

        <Card className="bg-[#2A2A2A] border-[#3A3A3A] border-2 rounded-[15px] overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <FileText className="mr-2 text-green-500" /> Customer Information
              </h3>
              <p className="text-white"><strong>Name:</strong> {order.customer.name}</p>
              <p className="text-white"><strong>Email:</strong> {order.customer.email}</p>
              <p className="text-white"><strong>Address:</strong> {order.customer.address}</p>
            </motion.div>
            <Separator className="bg-[#3A3A3A]" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <Printer className="mr-2 text-green-500" /> Order Details
              </h3>
              {order.files.map((file, index) => (
                <Card key={index} className="bg-[#1A1A1A] border-[#3A3A3A] border rounded-lg p-4 mb-4">
                  <p className="text-white font-semibold">{file.filename}</p>
                  <p className="text-white">Quantity: {file.quantity} | Quality: {file.quality}</p>
                  <p className="text-white">Color: {file.color} | Dimensions: {file.dimensions}</p>
                </Card>
              ))}
            </motion.div>
            <Separator className="bg-[#3A3A3A]" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <Package className="mr-2 text-green-500" /> Add-ons
              </h3>
              <p className="text-white"><strong>Queue Priority:</strong> {order.addons.queuePriority}</p>
              <p className="text-white"><strong>Multicolor Printing:</strong> {order.addons.multicolorPrinting ? 'Yes' : 'No'}</p>
            </motion.div>
            {order.comments && (
              <>
                <Separator className="bg-[#3A3A3A]" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <MessageSquare className="mr-2 text-green-500" /> Comments
                  </h3>
                  <p className="text-white">{order.comments}</p>
                </motion.div>
              </>
            )}
          </div>
        </Card>

        <Card className="bg-[#2A2A2A] border-[#3A3A3A] border-2 rounded-[15px] overflow-hidden">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Frequently Asked Questions</h3>
            <FAQ />
          </div>
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white" onClick={() => window.print()}>
            <PrinterIcon size={20} />
            <span>Print Order Details</span>
          </Button>
          <Button className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white">
            <Phone size={20} />
            <span>Contact Support</span>
          </Button>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>Need help? Contact us at support@3dprintingservice.com or call 1-800-3D-PRINT</p>
        </div>
      </div>
    </div>
  )
}