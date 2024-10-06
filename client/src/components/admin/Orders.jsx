import { useState, useEffect } from "react"
import OrderFocused from "./Order-Focused"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import axios from "axios"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [statusCounts, setStatusCounts] = useState({})
  const [currentStatus, setCurrentStatus] = useState("all")
  const [showDelivered, setShowDelivered] = useState(false)
  const ordersPerPage = 20
  const [selectedOrder, setSelectedOrder] = useState(null)

  const fetchOrders = async (page, status = "all") => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/getall`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      params: { page, status, limit: ordersPerPage }
    })
    setOrders(response.data.orders)
    setTotalOrders(response.data.totalOrders)
    setStatusCounts(response.data.statusCounts)
  }

  useEffect(() => {
    fetchOrders(currentPage, currentStatus)
  }, [currentPage, currentStatus])

  const handleStatusChange = (status) => {
    setCurrentStatus(status)
    setCurrentPage(1)
    setShowDelivered(false)
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
  }

  const toggleShowDelivered = () => {
    setShowDelivered(!showDelivered)
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.order_status === "Delivered" && b.order_status !== "Delivered") return 1;
    if (a.order_status !== "Delivered" && b.order_status === "Delivered") return -1;
    
    const aHasPriority = a.cart.cart_addons.some(addon => addon.addon_name.includes('Queue Priority'));
    const bHasPriority = b.cart.cart_addons.some(addon => addon.addon_name.includes('Queue Priority'));
    
    if (aHasPriority && !bHasPriority) return -1;
    if (!aHasPriority && bHasPriority) return 1;
    
    return new Date(b.dateCreated) - new Date(a.dateCreated);
  });

  const displayedOrders = showDelivered ? sortedOrders : sortedOrders.filter(order => order.order_status !== "Delivered");

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-white">
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="border-b border-[#2A2A2A] px-4 py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Transactions</h1>
          </div>
        </header>

        <div className="p-4">
          <Tabs value={currentStatus} onValueChange={handleStatusChange} className="mb-3">
            <TabsList className="bg-[#2A2A2A] p-1 rounded-md">
              <TabsTrigger value="all" className="relative text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                All
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#0D939B] text-white">{totalOrders}</Badge>
              </TabsTrigger>
              {Object.entries(statusCounts).map(([status, count]) => (
                <TabsTrigger key={status} value={status} className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                  {status}
                  <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">{count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button onClick={toggleShowDelivered} className="mb-3 bg-[#0D939B] text-white hover:bg-[#11B3BD]">
            {showDelivered ? "Hide Delivered Orders" : "Show Delivered Orders"}
          </Button>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#2A2A2A] border-b border-[#4A4A4A]">
                    <TableHead className="w-[30px]"></TableHead> 
                    <TableHead className="py-2 text-[#8A8A8A]">Order Number</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Customer</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Amount</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Date</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Status</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Addons</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Files</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedOrders.map((order, index) => (
                    <TableRow 
                      key={index} 
                      className={`${index % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#222222]'} cursor-pointer hover:bg-[#2A2A2A]`}
                      onClick={() => handleOrderClick(order)}
                    >
                      <TableCell className="py-1">
                        <Checkbox className="border-[#4A4A4A]" />
                      </TableCell>
                      <TableCell>
                        {order.test_mode === "true" ? (
                          <Badge variant="secondary" className="bg-orange-500 text-white rounded-sm px-1 py-0.5 text-xs font-normal">
                            {order.order_number}
                          </Badge>
                        ) : (
                          <span className="text-sm">{order.order_number}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.customer_details.name}</span>
                      </TableCell>
                      <TableCell className="py-1 font-medium">
                        <div className="flex items-center space-x-1">
                          <span>${order.total_details.amount_total / 100}</span>
                          <Badge variant="secondary" className="bg-primary text-primary-foreground rounded-sm px-1 py-0.5 text-xs font-normal">
                            {order.status} ✓
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-muted-foreground text-sm">{new Date(order.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell className="py-1">
                        <span className="text-sm">{order.order_status}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <Badge variant="secondary" className="bg-primary text-primary-foreground rounded-sm px-1 py-0.5 text-xs font-normal mr-1 mb-1">
                          {order.cart.cart_addons.length} addons
                        </Badge>
                        {order.cart.cart_addons.map((addon, index) => (
                          addon.addon_name.includes('Queue Priority') ? (
                            <Badge key={index} variant="outline" className="text-xs font-normal mr-1 mb-1">
                              {addon.addon_name.replace('?', '')}
                            </Badge>
                          ) : null
                        ))}
                      </TableCell>
                      <TableCell className="py-1">
                        <span className="text-sm">{order.cart.files.length}</span>
                      </TableCell>
                      <TableCell className="py-1">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Viewing {(currentPage - 1) * ordersPerPage + 1}-{Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} results
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs bg-[#2A2A2A] text-white hover:bg-[#4A4A4A]"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalOrders / ordersPerPage)))}
                disabled={currentPage === Math.ceil(totalOrders / ordersPerPage)}
                className="px-2 py-1 text-xs bg-[#2A2A2A] text-white hover:bg-[#4A4A4A]"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <div 
            className="bg-[#1A1A1A] w-[95vw] h-[90vh] rounded-xl shadow-lg overflow-hidden relative border border-[#4A4A4A] animate-fade-in-scale"
            style={{ animationDuration: '0.2s', animationTimingFunction: 'ease-in' }}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 flex items-center text-sm mr-8 bg-[#2A2A2A] border border-[#4A4A4A] rounded-md p-1 px-2"
              onClick={() => setSelectedOrder(null)}
            >
              <span className="mr-2">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-6 h-full overflow-hidden">
              <div className="h-full overflow-auto scrollbar-hide">
                <OrderFocused orderId={selectedOrder.order_id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}