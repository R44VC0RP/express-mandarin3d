import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, CreditCard, Truck, Download, Printer, Plus, Mail, Package, FileText, User, Calendar, Clock, DollarSign, Edit, ExternalLink, X } from "lucide-react"
import { ReactComponent as Printer3DIcon } from "@/assets/svgs/3dprinter.svg"
import DeliveryStatus from "./comp_LinearDeliveryStatus"
import { useState, useEffect } from "react"
import { FaFileDownload, FaTag, FaPrint, FaEnvelope, FaBoxOpen, FaShippingFast, FaEdit, FaSave, FaUserAlt } from "react-icons/fa"
import axios from "axios"
import { toast } from 'sonner';
import { Input } from "@/components/ui/input" // Add this import

export default function OrderFocused({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingShipping, setEditingShipping] = useState({});
  const [modifiedShipping, setModifiedShipping] = useState({});
  const [hasShippingChanges, setHasShippingChanges] = useState(false);

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setOrder(response.data.order)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch order details")
      setLoading(false)
    }
  }

  const downloadAllFiles = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/downloadAllFiles`, 
        { orderId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob' // Important to handle binary data
        }
      )
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/zip' });
      
      // Create an anchor element and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `order_${orderId}_files.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      // Clean up the object URL
      setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 100);
      
      toast.success("Files downloaded successfully");
    } catch (err) {
      console.error('Error downloading files:', err);
      toast.error("Failed to download files");
    }
  };

  const handleOrderAction = async (action, newStatus) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/actions`, {
        orderId,
        action,
        newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        fetchOrderDetails();
        toast.success(`Order ${action} successful`);
      } else {
        toast.error(response.data.message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    handleOrderAction('updateStatus', newStatus);
  };

  const createShippingLabel = async () => {
    handleOrderAction('createShippingLabel');
  };

  const sendReceipt = async () => {
    handleOrderAction('sendReceipt');
  };

  const printReceipt = async () => {
    handleOrderAction('printReceipt');
  };

  const downloadShippingLabel = async () => {
    if (order && order.shipping_label_url) {
      downloadFile(order.shipping_label_url);
    } else {
      toast.error('Shipping label not found. Please create a shipping label first.');
    }
  };

  const downloadFile = (url) => {
    window.open(url, '_blank');
  };

  const printShippingLabel = async () => {
    handleOrderAction('printShippingLabel');
  };

  const handleShippingEdit = (field) => {
    // Initialize the modified value with the current value
    if (!modifiedShipping[field]) {
      setModifiedShipping(prev => ({
        ...prev,
        [field]: order.shipping_details.address[field] || ''
      }));
    }
    
    // Set editing state for this field
    setEditingShipping(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleShippingChange = (field, value) => {
    setModifiedShipping(prev => ({
      ...prev,
      [field]: value
    }));
    
    setHasShippingChanges(true);
  };

  const saveShippingChanges = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/actions`,
        {
          orderId,
          action: 'updateOrder',
          dateUpdated: new Date().toISOString(),
          shipping_details: {
            address: {
              ...order.shipping_details.address,
              ...modifiedShipping
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 'success') {
        setEditingShipping({});
        setHasShippingChanges(false);
        fetchOrderDetails();
        toast.success('Shipping details updated successfully');
      }
    } catch (error) {
      console.error('Error updating shipping details:', error);
      toast.error('Failed to update shipping details');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-10 w-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white border border-neutral-700 shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-full relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-10 w-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white border border-neutral-700 shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="text-center p-6 bg-red-500/20 border border-red-500/30 rounded-lg">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
        <p className="text-red-300 text-lg font-medium">{error}</p>
        <Button variant="secondary" className="mt-4 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white" onClick={fetchOrderDetails}>
          Try Again
        </Button>
      </div>
    </div>
  );
  
  if (!order) return (
    <div className="flex items-center justify-center h-full relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-10 w-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white border border-neutral-700 shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="text-center p-6 bg-amber-500/20 border border-amber-500/30 rounded-lg">
        <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-4" />
        <p className="text-amber-300 text-lg font-medium">No order found</p>
      </div>
    </div>
  );

  const statusOrder = order.order_status_options || ["Reviewing", "In Queue", "Printing", "Completed", "Shipping", "Delivered"]
  const deliveries = [{ status: order.order_status, date: new Date(order.dateUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }]

  // Calculate totals correctly
  const subtotal = order.cart.files.reduce((acc, file) => acc + (file.file_sale_cost || 0) * file.quantity, 0);
  const addonsTotal = order.cart.cart_addons.reduce((acc, addon) => acc + addon.addon_price / 100, 0);
  const items_total = subtotal + addonsTotal;
  const shipping = order.total_details.amount_shipping / 100;
  const tax = order.total_details.amount_tax / 100;
  const total = items_total + shipping + tax;

  const shippingFieldsLabels = {
    line1: 'Line 1',
    line2: 'Line 2',
    city: 'City',
    state: 'State',
    postal_code: 'Postal Code',
    country: 'Country'
  };

  return (
    <div className="space-y-6 pb-6 relative">
      {/* Close button at the top right */}
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-10 w-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white border border-neutral-700 shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-medium text-gray-400">Order</h2>
            <div className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-300 font-mono">
              {order.order_number}
            </div>
            {order.test_mode === "true" && (
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30">Test Order</Badge>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">${total.toFixed(2)}</h3>
            <span className="text-xl text-gray-500">USD</span>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-2">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {order.payment_status}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500 mb-1">Order ID</span>
          <code className="text-xs bg-[#1e2229] px-2 py-1 rounded border border-neutral-800 text-gray-400 font-mono">
            {order.order_id}
          </code>
        </div>
      </div>

      <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400 text-xs">Last update</div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="h-4 w-4 text-cyan-400/70" />
                <span className="font-medium">{new Date(order.dateUpdated).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-gray-400 text-xs">Customer</div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 rounded-full bg-cyan-800/30 flex items-center justify-center border border-cyan-700/20">
                  <User className="h-3 w-3 text-cyan-400/70" />
                </div>
                <span className="font-medium">{order.customer_details.name}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-gray-400 text-xs">Payment method</div>
              <div className="flex items-center gap-2 text-white">
                <CreditCard className="h-4 w-4 text-cyan-400/70" />
                <span className="font-medium">Stripe</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-gray-400 text-xs">Order Status</div>
              <div className="flex items-center gap-2">
                <Badge className={`bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5`}>
                  <Package className="h-3 w-3" />
                  {order.order_status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-md">
        <CardHeader className="px-6 py-4 border-b border-neutral-800/70">
          <CardTitle className="text-lg font-medium text-white">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DeliveryStatus currentStatus={order.order_status} deliveries={deliveries} statusOrder={statusOrder} />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Update Order Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOrder.map((status) => (
                  <Button
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={status === order.order_status}
                    variant="outline"
                    className={`text-xs py-1 h-auto ${
                      status === order.order_status 
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                        : 'bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300'
                    }`}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={createShippingLabel}
                  className="text-xs h-auto py-1.5 flex items-center justify-center bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300"
                >
                  <FaTag className="mr-1.5 h-3 w-3" />
                  Create Shipping Label
                </Button>
                <Button 
                  variant="outline" 
                  onClick={printShippingLabel}
                  className="text-xs h-auto py-1.5 flex items-center justify-center bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300"
                >
                  <FaPrint className="mr-1.5 h-3 w-3" />
                  Print Shipping Label
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadShippingLabel}
                  className="text-xs h-auto py-1.5 flex items-center justify-center bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300"
                >
                  <FaFileDownload className="mr-1.5 h-3 w-3" />
                  Download Shipping Label
                </Button>
                <Button 
                  variant="outline" 
                  onClick={sendReceipt}
                  className="text-xs h-auto py-1.5 flex items-center justify-center bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300"
                >
                  <FaEnvelope className="mr-1.5 h-3 w-3" />
                  Send Receipt
                </Button>
                <Button 
                  variant="outline" 
                  onClick={printReceipt}
                  className="text-xs h-auto py-1.5 flex items-center justify-center bg-[#2A2A2A]/50 border-neutral-700 hover:bg-[#2A2A2A] text-gray-300"
                >
                  <FaPrint className="mr-1.5 h-3 w-3" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-md h-full">
          <CardHeader className="px-6 py-4 border-b border-neutral-800/70">
            <CardTitle className="text-lg font-medium text-white">
              <div className="flex items-center gap-2">
                <FaShippingFast className="text-cyan-400/70" />
                Shipping Information
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {['line1', 'line2', 'city', 'state', 'postal_code', 'country'].map((field) => (
                <div key={field} className="flex items-start gap-2">
                  <div className="min-w-24 text-xs text-gray-400 pt-1">
                    {shippingFieldsLabels[field]}:
                  </div>
                  {editingShipping[field] ? (
                    <div className="flex-1">
                      <Input
                        autoFocus
                        value={modifiedShipping[field] || ''}
                        onChange={(e) => handleShippingChange(field, e.target.value)}
                        onBlur={() => setEditingShipping(prev => ({ ...prev, [field]: false }))}
                        className="w-full bg-[#2A2A2A] border-neutral-700 text-white focus:border-cyan-500"
                      />
                    </div>
                  ) : (
                    <div 
                      className="flex-1 flex items-center text-white group cursor-pointer"
                      onClick={() => handleShippingEdit(field)}
                    >
                      <div className="bg-[#2A2A2A]/50 border border-neutral-700/50 py-1 px-2 rounded w-full flex items-center justify-between">
                        <span className="text-gray-200">
                          {modifiedShipping[field] || order.shipping_details.address[field] || 
                            <span className="text-gray-500 italic">Not provided</span>
                          }
                        </span>
                        <FaEdit className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {hasShippingChanges && (
                <Button
                  onClick={saveShippingChanges}
                  className="mt-4 bg-gradient-to-r from-cyan-600/90 to-cyan-700/80 hover:from-cyan-700 hover:to-cyan-800 text-white"
                >
                  <FaSave className="mr-2 h-4 w-4" />
                  Save Shipping Changes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-md h-full">
          <CardHeader className="px-6 py-4 border-b border-neutral-800/70">
            <CardTitle className="text-lg font-medium text-white">
              <div className="flex items-center gap-2">
                <FaFileDownload className="text-cyan-400/70" />
                Files
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                {order.cart.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#2A2A2A]/50 border border-neutral-700/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400/70" />
                      <span className="text-gray-200 text-sm truncate max-w-52">{file.filename}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30"
                      onClick={() => downloadFile(file.utfile_url)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={downloadAllFiles}
                className="w-full bg-gradient-to-r from-cyan-600/90 to-cyan-700/80 hover:from-cyan-700 hover:to-cyan-800 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download All Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a1b1e]/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden shadow-md">
        <CardHeader className="px-6 py-4 border-b border-neutral-800/70">
          <CardTitle className="text-lg font-medium text-white">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#1e2229] border-b border-neutral-800">
                <TableHead className="text-white font-medium py-3">Item</TableHead>
                <TableHead className="text-white font-medium py-3 text-right">Color</TableHead>
                <TableHead className="text-white font-medium py-3 text-right">Layer Height</TableHead>
                <TableHead className="text-white font-medium py-3 text-right">Quantity</TableHead>
                <TableHead className="text-white font-medium py-3 text-right">Unit Price</TableHead>
                <TableHead className="text-white font-medium py-3 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.cart.files.map((item, index) => (
                <TableRow key={index} className="border-b border-neutral-800/50 hover:bg-[#2A2A2A]/30">
                  <TableCell className="py-3 font-medium">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-cyan-400 hover:text-cyan-300 hover:underline"
                      onClick={() => downloadFile(item.utfile_url)}
                    >
                      <FileText className="w-3.5 h-3.5 mr-2 inline" />
                      {item.filename}
                    </Button>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">{item.filament_color}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right text-gray-300">{item.quality}</TableCell>
                  <TableCell className="py-3 text-right font-medium text-white">{item.quantity}x</TableCell>
                  <TableCell className="py-3 text-right text-gray-300">${item.file_sale_cost.toFixed(2)}</TableCell>
                  <TableCell className="py-3 text-right font-medium text-white">${(item.file_sale_cost * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              
              {order.cart.cart_addons.map((addon, index) => (
                <TableRow key={`addon-${index}`} className="border-b border-neutral-800/50 hover:bg-[#2A2A2A]/30">
                  <TableCell className="py-3 font-medium">
                    <div className="flex items-center">
                      <Plus className="w-3.5 h-3.5 mr-2 text-amber-400/80" />
                      <span className="text-amber-300">{addon.addon_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right"></TableCell>
                  <TableCell className="py-3 text-right"></TableCell>
                  <TableCell className="py-3 text-right font-medium text-white">1</TableCell>
                  <TableCell className="py-3 text-right text-gray-300">${(addon.addon_price / 100).toFixed(2)}</TableCell>
                  <TableCell className="py-3 text-right font-medium text-white">${(addon.addon_price / 100).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              
              <TableRow className="border-t border-neutral-700 bg-[#1a1b1e]/60">
                <TableCell colSpan={5} className="py-3 text-right font-medium text-gray-400">Subtotal</TableCell>
                <TableCell className="py-3 text-right font-medium text-white">
                  ${items_total.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableCell colSpan={5} className="py-3 text-right text-gray-400">Shipping</TableCell>
                <TableCell className="py-3 text-right text-white">${shipping.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableCell colSpan={5} className="py-3 text-right text-gray-400">Tax</TableCell>
                <TableCell className="py-3 text-right text-white">${tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow className="border-t border-neutral-700 font-bold bg-[#1e2229]">
                <TableCell colSpan={5} className="py-4 text-right text-lg font-semibold text-white">Total</TableCell>
                <TableCell className="py-4 text-right text-lg font-semibold text-white">${total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
