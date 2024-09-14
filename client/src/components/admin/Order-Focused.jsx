import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, CreditCard, Truck, Download, Printer, Plus } from "lucide-react"
import { ReactComponent as Printer3DIcon } from "@/assets/svgs/3dprinter.svg"
import DeliveryStatus from "./comp_LinearDeliveryStatus"

export default function PaymentTransaction() {
  // Deliveries status's can be: 
  const deliveries = [
    { status: "Printing", date: "13 Sep" },
  ] // this is just a placeholder for now

  const statusOrder = ["Designing", "In Queue", "Printing", "Shipped", "Delivered"]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">PAYMENT</h2>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">$29.84</span>
            <span className="text-xl text-gray-500">USD</span>
            <Badge variant="secondary" className="bg-green-100 text-green-600">
              Succeeded ✓
            </Badge>
          </div>
          <h4>FOR ORDER <pre  className="inline color-blue-600 bg-[#064346] p-1 rounded-md ">#0423-3403</pre></h4>
        </div>
        
        <div className="text-sm text-gray-500">
          pi_3PyMsBDBmtvCmuyX80TRX3vn
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Last update</div>
              <div>Sep 12, 7:56 PM</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Customer</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Ruslan Vasyukov</Badge> {/* TODO: Add link to customer object in the other table */}
                
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Payment method</div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>•••• 7854</span>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">Order Status</div>
              <div className="flex items-center space-x-2">
                <Printer className="h-4 w-4" />
                <span>Printing</span>
              </div>
              {/* <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                <span>Designing</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>Queue</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-purple-500" />
                <span>Printing</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
                <span>Shipped</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <span>Delivered</span>
              </div> */}
            </div>
            <div>
              <div className="font-semibold mb-1">Order Actions</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Create shipping label</span>
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Download Shipping Label</span>
                </Button>
                <Button size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Shipping Label
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Timeline</CardTitle>
          <div>
            <Button size="sm" className="bg-primary text-white">
              Progress order to {statusOrder[statusOrder.indexOf(deliveries[0].status) + 1]}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8">
            <DeliveryStatus deliveries={deliveries} statusOrder={statusOrder} />
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Printing started</p>
                <p className="text-sm text-gray-500">Sep 15, 2024, 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Order queued</p>
                <p className="text-sm text-gray-500">Sep 14, 2024, 2:15 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Design approved</p>
                <p className="text-sm text-gray-500">Sep 13, 2024, 11:45 AM</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Payment authorized</p>
                <p className="text-sm text-gray-500">Sep 12, 2024, 7:56 PM</p>
              </div>
            </div>
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
              <p>ruslanvasyukov@gmail.com</p>
              <p>Ruslan Vasyukov</p>
              <p>64 Ren Way</p>
              <p>Saint Johns, FL 32259 US</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Shipping details</h4>
              <p>Ruslan Vasyukov</p>
              <p>64 Ren Way</p>
              <p>Saint Johns, FL 32259 US</p>
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
              <TableRow>
                <TableCell className="font-medium">IK_MOCKUPstl</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-[#064346] text-white">Ocean Blue PLA</Badge>
                </TableCell>
                <TableCell className="text-right">0.16mm - Better</TableCell>
                <TableCell className="text-right">2x</TableCell>
                <TableCell className="text-right">$7.52</TableCell>
                <TableCell className="text-right">$15.04</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Queue Priority</TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right">1</TableCell>
                <TableCell className="text-right">$5.00</TableCell>
                <TableCell className="text-right">$5.00</TableCell>
              </TableRow>
              <TableRow>

                <TableCell colSpan={5} className="text-right font-medium">Subtotal</TableCell>
                <TableCell className="text-right font-medium">$20.04</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">Shipping (Printer Fees and Handling + Shipping)</TableCell>
                <TableCell className="text-right">$8.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right">Sales Tax - Florida (6.5%)</TableCell>
                <TableCell className="text-right">$1.30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">$29.84</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}