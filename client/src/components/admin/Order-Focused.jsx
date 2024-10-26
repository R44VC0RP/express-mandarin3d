import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, CreditCard, Truck, Download, Printer, Plus, Mail } from "lucide-react"
import { ReactComponent as Printer3DIcon } from "@/assets/svgs/3dprinter.svg"
import DeliveryStatus from "./comp_LinearDeliveryStatus"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from 'sonner';
import { Input } from "@/components/ui/input" // Add this import

export default function OrderFocused({ orderId }) {
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
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${orderId}_files.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("All files downloaded successfully")
      }
    } catch (error) {
      console.error("Error downloading all files:", error)
      toast.error("Failed to download all files")
    }
  }

  const handleOrderAction = async (action, newStatus) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/actions`, 
        { orderId, action, newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      if (response.data.status === 'success') {
        fetchOrderDetails()
        console.log("Action completed successfully: ", response.data)
        toast.success(`Action ${action} completed successfully`)
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error)
      toast.error(`Failed to perform action ${action}`)
    }
  }

  const updateOrderStatus = async (newStatus) => {
    await handleOrderAction('updateStatus', newStatus)
  }

  const createShippingLabel = async () => {
    await handleOrderAction('createShippingLabel', null)
  }

  const sendReceipt = async () => {
    await handleOrderAction('sendReceipt', null)
  }

  const printReceipt = async () => {
    await handleOrderAction('printReceipt', null)
  }

  const downloadShippingLabel = async () => {
    downloadFile(order.shipping_label_url)
  }

  const downloadFile = (url) => {
    window.open(url, '_blank')
  }

  const printShippingLabel = async () => {
    await handleOrderAction('printShippingLabel')
  }

  // Add this function to handle shipping field edits
  const handleShippingEdit = (field) => {
    setEditingShipping(prev => ({
      ...prev,
      [field]: true
    }));
    setModifiedShipping(prev => ({
      ...prev,
      [field]: order.shipping_details.address[field]
    }));
  };

  // Add this function to handle shipping field changes
  const handleShippingChange = (field, value) => {
    setModifiedShipping(prev => ({
      ...prev,
      [field]: value
    }));
    setHasShippingChanges(true);
  };

  // Add this function to save shipping changes
  const saveShippingChanges = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/actions`,
        {
          orderId,
          action: 'updateOrder',
          shipping_details: {
            ...order.shipping_details,
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!order) return <div>No order found</div>

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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">PAYMENT</h2>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">${total.toFixed(2)}</span>
            <span className="text-xl text-gray-500">USD</span>
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              {order.payment_status} ✓
            </Badge>
          </div>
          <h4>FOR ORDER <pre className="inline color-blue-600 bg-[#064346] p-1 rounded-md">{order.order_number}</pre></h4>
        </div>
        
        <div className="text-sm text-gray-500">
          {order.order_id}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Last update</div>
              <div>{new Date(order.dateUpdated).toLocaleString()}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Customer</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{order.customer_details.name}</Badge>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Payment method</div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Stripe</span>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Order Status</div>
              <div className="flex items-center space-x-2">
                <Printer className="h-4 w-4" />
                <span>{order.order_status}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Timeline</CardTitle>
          <div>
            {statusOrder.indexOf(order.order_status) < statusOrder.length - 1 && (
              <Button 
                variant="outline"
                size="sm" 
                className="bg-primary text-white"
                onClick={() => updateOrderStatus(statusOrder[statusOrder.indexOf(order.order_status) + 1])}
              >
                Progress order to {statusOrder[statusOrder.indexOf(order.order_status) + 1]}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8">
            <DeliveryStatus deliveries={deliveries} statusOrder={statusOrder} />
          </div>
          <div className="space-y-4">
            {statusOrder.map((status, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle2 className={`h-5 w-5 ${index <= statusOrder.indexOf(order.order_status) ? 'text-green-500' : 'text-gray-300'} mt-0.5`} />
                <div>
                  <p className="font-medium">{status}</p>
                  <p className="text-sm text-gray-500">{index === statusOrder.indexOf(order.order_status) ? new Date(order.dateUpdated).toLocaleString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Shipping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={sendReceipt}
            >
              <Mail className="h-4 w-4 mr-2" />
              <span>Send receipt</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={printReceipt}
            >
              <Printer className="h-4 w-4 mr-2" />
              <span>Print receipt</span>
            </Button>
            {!order.shipping_label_url ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={createShippingLabel}
              >
                <Truck className="h-4 w-4 mr-2" />
                <span>Create shipping label</span>
              </Button>
            ) : (
              <>
                <Button 
                  size="sm"
                  onClick={downloadShippingLabel}
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download Shipping Label</span>
                </Button>
                <Button 
                  size="sm"
                  onClick={printShippingLabel}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Shipping Label
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Checkout summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold mb-2">Customer</h4>
              <p>{order.customer_details.email}</p>
              <p>{order.customer_details.name}</p>
              <p>{order.customer_details.address.line1}</p>
              <p>{order.customer_details.address.line2}</p>
              <p>{order.customer_details.address.city}, {order.customer_details.address.state} {order.customer_details.address.postal_code} {order.customer_details.address.country}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Shipping details</h4>
              {['line1', 'line2', 'city', 'state', 'postal_code', 'country'].map((field) => (
                <div key={field} className="mb-2">
                  {editingShipping[field] ? (
                    <Input
                      autoFocus
                      value={modifiedShipping[field] || ''}
                      onChange={(e) => handleShippingChange(field, e.target.value)}
                      onBlur={() => setEditingShipping(prev => ({ ...prev, [field]: false }))}
                      className="w-full"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge className="font-semibold">{shippingFieldsLabels[field]}:</Badge> 
                      <p
                      className="cursor-pointer p-1 rounded hover:bg-gray-600"
                      onClick={() => handleShippingEdit(field)}
                    >
                      {modifiedShipping[field] || order.shipping_details.address[field] || <code className="text-gray-400 border border-gray-400 p-1 rounded-md">No Value</code>}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {hasShippingChanges && (
                <Button
                  size="sm"
                  onClick={saveShippingChanges}
                  className="mt-2 github-primary"
                >
                  Save Shipping Changes
                </Button>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Download all files as a zip</h4>
              <Button
                size="sm"
                onClick={() => downloadAllFiles(orderId)}
                className="github-secondary"
              >
                <Download className="h-4 w-4 mr-2 inline" />
                <span>Download All</span>
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">ITEMS</TableHead>
                <TableHead className="text-right">COLOR</TableHead>
                <TableHead className="text-right">LAYER HEIGHT</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
                <TableHead className="text-right">UNIT PRICE</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.cart.files.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <span 
                      className="cursor-pointer hover:underline" 
                      onClick={() => downloadFile(item.utfile_url)}
                    >
                      {item.filename}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-[#064346] text-white">{item.filament_color}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.quality}</TableCell>
                  <TableCell className="text-right">{item.quantity}x</TableCell>
                  <TableCell className="text-right">${item.file_sale_cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.file_sale_cost * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {order.cart.cart_addons.map((addon, index) => (
                <TableRow key={`addon-${index}`}>
                  <TableCell className="font-medium">{addon.addon_name}</TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell className="text-right"></TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="text-right">${(addon.addon_price).toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(addon.addon_price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">Subtotal</TableCell>
                <TableCell className="text-right font-medium">
                  ${items_total.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">Shipping</TableCell>
                <TableCell className="text-right">${shipping.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">Tax</TableCell>
                <TableCell className="text-right">${tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">${total.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
