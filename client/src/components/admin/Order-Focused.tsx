import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, CreditCard } from "lucide-react"

export default function PaymentTransaction() {
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
                <span className="text-blue-600">Ruslan Vasyukov</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Guest
                </Badge>
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
              <div className="font-semibold mb-1">Risk evaluation</div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Normal</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Timeline</CardTitle>
          <Button variant="outline" size="sm">
            Add note
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">
                  This payment is <span className="text-blue-600">not protected</span> from being disputed for fraud
                </p>
                <p className="text-sm text-gray-500">Sep 12, 2024, 7:56 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Payment authorized</p>
                <p className="text-sm text-gray-500">Sep 12, 2024, 7:56 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Payment started</p>
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
                <TableHead className="text-right">QTY</TableHead>
                <TableHead className="text-right">UNIT PRICE</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">IK_MOCKUPstl</TableCell>
                <TableCell className="text-right">2</TableCell>
                <TableCell className="text-right">$7.52</TableCell>
                <TableCell className="text-right">$15.04</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Queue Priority</TableCell>
                <TableCell className="text-right">1</TableCell>
                <TableCell className="text-right">$5.00</TableCell>
                <TableCell className="text-right">$5.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                <TableCell className="text-right font-medium">$20.04</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right">Shipping (Printer Fees and Handling + Shipping)</TableCell>
                <TableCell className="text-right">$8.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right">Sales Tax - Florida (6.5%)</TableCell>
                <TableCell className="text-right">$1.30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">$29.84</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}