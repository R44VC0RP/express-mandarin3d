import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ShippingStatus = ({ orderStatus, shippingStatus }) => {
  const stages = ['Queue', 'Printing', 'Completed', 'Shipped', 'Out for Delivery', 'Delivered']
  const currentStageIndex = stages.indexOf(orderStatus === 'shipped' ? shippingStatus : orderStatus)

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center space-x-1 mb-2">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${index <= currentStageIndex ? 'bg-[#01ABB3] border-[#01ABB3]' : 'bg-[#E2E2E2] border-[#E2E2E2]'}
              ${index === currentStageIndex ? 'ring-2 ring-offset-2 ring-[#393E46]' : ''}
              transition-all duration-300 ease-in-out`}>
              {index <= currentStageIndex && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            {index < stages.length - 1 && (
              <div className={`w-4 h-0.5 rounded-full
                ${index < currentStageIndex ? 'bg-[#01ABB3]' : 'bg-[#E2E2E2]'}
                transition-all duration-300 ease-in-out`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-sm font-medium text-[#393E46]">
        {orderStatus === 'shipped' ? shippingStatus : orderStatus}
      </div>
    </div>
  )
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Component() {
  const orders = [
    {
      order_id: "123e4567-e89b-12d3-a456-426614174000",
      order_number: "2000-0001",
      product_line_items: [
        {
          filename: "starwars blaster.stl",
          sale_price: 4.30,
          file_print_color: "Red",
          file_print_quality: "0.12mm",
          file_print_quantity: 2
        },
        {
          filename: "luciebakes-frappbubbletea.stl",
          sale_price: 4.30,
          file_print_color: "Blue",
          file_print_quality: "0.16mm",
          file_print_quantity: 1
        }
      ],
      order_addons: [
        {
          addon_name: "Enable MultiColor Printing?",
          addon_price: 0,
          addon_response: "True"
        },
        {
          addon_name: "Queue Priority?",
          addon_price: 10.00,
          addon_response: "True"
        }
      ],
      sale_amount: 22.90,
      date_created: "2024-03-15T10:30:00Z",
      order_status: "shipped",
      shipping_status: "out for delivery"
    },
    {
      order_id: "223e4567-e89b-12d3-a456-426614174001",
      order_number: "2000-0002",
      product_line_items: [
        {
          filename: "miniature-dragon.stl",
          sale_price: 15.50,
          file_print_color: "Green",
          file_print_quality: "0.08mm",
          file_print_quantity: 1
        }
      ],
      order_addons: [
        {
          addon_name: "Add Support Structure?",
          addon_price: 2.00,
          addon_response: "True"
        }
      ],
      sale_amount: 17.50,
      date_created: "2024-03-16T14:45:00Z",
      order_status: "printing",
      shipping_status: null
    },
    {
      order_id: "323e4567-e89b-12d3-a456-426614174002",
      order_number: "2000-0003",
      product_line_items: [
        {
          filename: "custom-phone-case.stl",
          sale_price: 8.75,
          file_print_color: "Black",
          file_print_quality: "0.20mm",
          file_print_quantity: 3
        },
        {
          filename: "keychain-name-tag.stl",
          sale_price: 3.25,
          file_print_color: "White",
          file_print_quality: "0.16mm",
          file_print_quantity: 5
        }
      ],
      order_addons: [],
      sale_amount: 42.50,
      date_created: "2024-03-17T09:15:00Z",
      order_status: "queue",
      shipping_status: null
    },
    {
      order_id: "423e4567-e89b-12d3-a456-426614174003",
      order_number: "2000-0004",
      product_line_items: [
        {
          filename: "architectural-model.stl",
          sale_price: 75.00,
          file_print_color: "Gray",
          file_print_quality: "0.04mm",
          file_print_quantity: 1
        }
      ],
      order_addons: [
        {
          addon_name: "Rush Order?",
          addon_price: 25.00,
          addon_response: "True"
        }
      ],
      sale_amount: 100.00,
      date_created: "2024-03-18T11:30:00Z",
      order_status: "completed",
      shipping_status: null
    },
    {
      order_id: "523e4567-e89b-12d3-a456-426614174004",
      order_number: "2000-0005",
      product_line_items: [
        {
          filename: "cosplay-armor-piece.stl",
          sale_price: 45.00,
          file_print_color: "Silver",
          file_print_quality: "0.12mm",
          file_print_quantity: 1
        }
      ],
      order_addons: [
        {
          addon_name: "Smoothing Service?",
          addon_price: 15.00,
          addon_response: "True"
        }
      ],
      sale_amount: 60.00,
      date_created: "2024-03-19T16:20:00Z",
      order_status: "shipped",
      shipping_status: "shipped"
    }
  ]

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#393E46] text-white">
            <TableHead className="text-white">Order Number</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Items</TableHead>
            <TableHead className="text-white">Total</TableHead>
            <TableHead className="text-white">Addons</TableHead>
            <TableHead className="text-white w-1/4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id} className="border-b border-[#E2E2E2]">
              <TableCell className="font-medium text-[#393E46]">{order.order_number}</TableCell>
              <TableCell className="text-[#393E46]">{formatDate(order.date_created)}</TableCell>
              <TableCell className="text-[#393E46]">
                <TooltipProvider>
                  {order.product_line_items.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="mr-1 mb-1">
                          {item.filename.split('.')[0]}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Color: {item.file_print_color}</p>
                        <p>Quality: {item.file_print_quality}</p>
                        <p>Quantity: {item.file_print_quantity}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-[#393E46]">${order.sale_amount.toFixed(2)}</TableCell>
              <TableCell className="text-[#393E46]">
                {order.order_addons.map((addon, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">
                    {addon.addon_name.split('?')[0]}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <ShippingStatus orderStatus={order.order_status} shippingStatus={order.shipping_status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}