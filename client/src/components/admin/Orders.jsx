import { useState, useEffect } from "react"
import OrderFocused from "./Order-Focused"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Package, Filter, ChevronLeft, ChevronRight, Search, Clock, DollarSign, Calendar } from "lucide-react"
import { FaBoxOpen, FaTruck, FaBoxes, FaShoppingCart, FaUserAlt, FaFilter } from "react-icons/fa"
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
  const [orderFocusChanged, setOrderFocusChanged] = useState(false)
  // Define a fixed order for status tabs
  const statusOrder = ["Reviewing", "In Queue", "Printing", "Completed", "Shipping", "Delivered"]
  // Add state for sort direction
  const [sortOldestFirst, setSortOldestFirst] = useState(true)

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
  }, [currentPage, currentStatus, orderFocusChanged])

  const handleStatusChange = (status) => {
    setCurrentStatus(status)
    setCurrentPage(1)
    setShowDelivered(false)
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
  }

  const handleOrderUnfocus = () => {
    setSelectedOrder(null)
    setOrderFocusChanged(prev => !prev) // Toggle this to trigger a refresh
  }

  const toggleShowDelivered = () => {
    setShowDelivered(!showDelivered)
  }

  const toggleSortDirection = () => {
    setSortOldestFirst(prev => !prev)
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.order_status === "Delivered" && b.order_status !== "Delivered") return 1;
    if (a.order_status !== "Delivered" && b.order_status === "Delivered") return -1;
    
    const aHasPriority = a.cart.cart_addons.some(addon => addon.addon_name.includes('Queue Priority'));
    const bHasPriority = b.cart.cart_addons.some(addon => addon.addon_name.includes('Queue Priority'));
    
    if (aHasPriority && !bHasPriority) return -1;
    if (!aHasPriority && bHasPriority) return 1;
    
    // Change the sort direction based on sortOldestFirst state
    return sortOldestFirst 
      ? new Date(a.dateCreated) - new Date(b.dateCreated)  // Oldest first
      : new Date(b.dateCreated) - new Date(a.dateCreated); // Newest first
  });

  const displayedOrders = showDelivered ? sortedOrders : sortedOrders.filter(order => order.order_status !== "Delivered");
  
  // Function to get badge color based on order status
  const getStatusColor = (status) => {
    const statusColors = {
      "Reviewing": "bg-amber-500/20 text-amber-300 border-amber-500/30",
      "In Queue": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Printing": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Completed": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      "Shipping": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Delivered": "bg-gray-500/20 text-gray-300 border-gray-500/30"
    };
    
    return statusColors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "Reviewing": return <Clock className="w-3 h-3 mr-1" />;
      case "In Queue": return <FaBoxes className="w-3 h-3 mr-1" />;
      case "Printing": return <FaBoxOpen className="w-3 h-3 mr-1" />;
      case "Completed": return <Package className="w-3 h-3 mr-1" />;
      case "Shipping": return <FaTruck className="w-3 h-3 mr-1" />;
      case "Delivered": return <FaShoppingCart className="w-3 h-3 mr-1" />;
      default: return <Package className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="w-full">
      {/* Main content */}
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white/90">Orders & Transactions</h1>
          <p className="text-gray-400 mt-1">Manage customer orders and process transactions</p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full mt-2"></div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <Tabs value={currentStatus} onValueChange={handleStatusChange} className="w-full md:w-auto overflow-x-auto">
              <TabsList className="h-auto p-1 bg-[#1a1b1e]/80 border border-neutral-800/70 rounded-lg w-full md:w-auto">
                <TabsTrigger 
                  value="all" 
                  className="py-2 px-4 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-900/70 data-[state=active]:to-cyan-800/30 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  <Package className="w-4 h-4 mr-1.5" />
                  All Orders
                  <Badge variant="secondary" className="ml-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">{totalOrders}</Badge>
                </TabsTrigger>
                {/* Render tabs in a fixed order */}
                {statusOrder.map(status => (
                  statusCounts[status] !== undefined && (
                    <TabsTrigger 
                      key={status} 
                      value={status} 
                      className="py-2 px-4 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-900/70 data-[state=active]:to-cyan-800/30 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      {getStatusIcon(status)}
                      {status}
                      <Badge variant="secondary" className="ml-1.5 bg-[#2A2A2A] text-gray-300 border border-neutral-700">{statusCounts[status] || 0}</Badge>
                    </TabsTrigger>
                  )
                ))}
                {/* Handle any status that might not be in our predefined order */}
                {Object.entries(statusCounts)
                  .filter(([status]) => !statusOrder.includes(status))
                  .map(([status, count]) => (
                    <TabsTrigger 
                      key={status} 
                      value={status} 
                      className="py-2 px-4 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-900/70 data-[state=active]:to-cyan-800/30 data-[state=active]:text-white data-[state=active]:shadow-md"
                    >
                      {getStatusIcon(status)}
                      {status}
                      <Badge variant="secondary" className="ml-1.5 bg-[#2A2A2A] text-gray-300 border border-neutral-700">{count}</Badge>
                    </TabsTrigger>
                  ))
                }
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                onClick={toggleShowDelivered} 
                className="rounded-full px-4 py-1.5 flex items-center bg-cyan-600/90 hover:bg-cyan-700/90 text-white text-xs font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {showDelivered ? "Hide Delivered " : "Show Delivered "}
              </Button>
              
              <Button 
                onClick={toggleSortDirection} 
                className="rounded-full px-4 py-1.5 flex items-center bg-indigo-600/90 hover:bg-indigo-700/90 text-white text-xs font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                {sortOldestFirst ? "Oldest First" : "Newest First"}
              </Button>
            </div>
          </div>

          <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#1e2229] border-b border-neutral-800">
                    <TableHead className="w-[30px] text-white font-medium"></TableHead> 
                    <TableHead className="py-3 text-white font-medium">Order #</TableHead>
                    <TableHead className="py-3 text-white font-medium">
                      <div className="flex items-center">
                        <FaUserAlt className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                        Customer
                      </div>
                    </TableHead>
                    <TableHead className="py-3 text-white font-medium">
                      <div className="flex items-center">
                        <DollarSign className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                        Amount
                      </div>
                    </TableHead>
                    <TableHead className="py-3 text-white font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-cyan-400/70" />
                        Date
                      </div>
                    </TableHead>
                    <TableHead className="py-3 text-white font-medium">Status</TableHead>
                    <TableHead className="py-3 text-white font-medium">Addons</TableHead>
                    <TableHead className="py-3 text-white font-medium">Files</TableHead>
                    <TableHead className="w-[30px] text-white font-medium"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <FaBoxes className="h-10 w-10 mb-2 text-gray-500/50" />
                          <p className="text-lg font-medium mb-1">No orders found</p>
                          <p className="text-sm text-gray-500">Try changing your filter options</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedOrders.map((order, index) => (
                      <TableRow 
                        key={index} 
                        className={`hover:bg-[#2A2A2A]/30 border-b border-neutral-800/50 cursor-pointer transition-colors duration-150`}
                        onClick={() => handleOrderClick(order)}
                      >
                        <TableCell className="py-2.5">
                          <Checkbox className="border-neutral-700 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600" />
                        </TableCell>
                        <TableCell>
                          {order.test_mode === "true" ? (
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 rounded-md px-2 py-0.5 text-xs font-normal">
                              {order.order_number}
                            </Badge>
                          ) : (
                            <span className="text-sm font-medium text-white">{order.order_number}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-cyan-800/30 flex items-center justify-center border border-cyan-700/20">
                              <FaUserAlt className="text-cyan-500/70 text-xs" />
                            </div>
                            <span className="text-sm text-gray-200">{order.customer_details.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 font-medium">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">${order.total_details.amount_total / 100}</span>
                            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md px-2 py-0.5 text-xs font-normal">
                              {order.status} ✓
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-sm text-gray-400">
                          {new Date(order.dateCreated).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge className={`border ${getStatusColor(order.order_status)} inline-flex items-center rounded-md px-2 py-1 text-xs`}>
                            {getStatusIcon(order.order_status)}
                            {order.order_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {order.cart.cart_addons.length > 0 && (
                              <Badge variant="secondary" className="bg-[#2A2A2A] text-gray-300 border border-neutral-700 rounded-md px-2 py-0.5 text-xs font-normal">
                                {order.cart.cart_addons.length} addons
                              </Badge>
                            )}
                            {order.cart.cart_addons.map((addon, index) => (
                              addon.addon_name.includes('Queue Priority') ? (
                                <Badge key={index} variant="outline" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-normal">
                                  Priority
                                </Badge>
                              ) : null
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <Badge variant="secondary" className="bg-[#2A2A2A] text-gray-300 border border-neutral-700 rounded-md px-2 py-0.5 text-xs font-normal">
                            {order.cart.files.length} files
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-gray-400 bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg px-4 py-2">
              Viewing {(currentPage - 1) * ordersPerPage + 1}-{Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-[#1a1b1e] border border-neutral-800 text-white hover:bg-[#2A2A2A] px-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalOrders / ordersPerPage)))}
                disabled={currentPage === Math.ceil(totalOrders / ordersPerPage)}
                className="bg-[#1a1b1e] border border-neutral-800 text-white hover:bg-[#2A2A2A] px-3"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleOrderUnfocus();
            }
          }}
        >
          <div 
            className="bg-gradient-to-b from-[#1a1b1e] to-[#141518] w-[95vw] h-[90vh] rounded-xl shadow-xl overflow-hidden relative border border-neutral-800 animate-in fade-in-0 zoom-in-95 duration-300"
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 flex items-center text-sm mr-8 bg-[#2A2A2A]/80 backdrop-blur-sm border border-neutral-700 rounded-md p-1.5 px-3 hover:bg-[#363636]"
              onClick={handleOrderUnfocus}
            >
              <span className="mr-2">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-4 h-full overflow-hidden">
              <div className="h-full overflow-auto custom-scrollbar">
                <OrderFocused orderId={selectedOrder.order_id} onClose={handleOrderUnfocus} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}