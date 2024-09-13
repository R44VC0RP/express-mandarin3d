import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart2, Search, Settings, Plus, MoreHorizontal, Home, CreditCard, Users, Package, FileText, Receipt, PieChart, Clock, Database, BarChart } from "lucide-react"

const transactions = [
  { amount: 29.84, currency: "USD", status: "Succeeded", customer: "ruslanvasyukov@gmail.com", date: "Sep 12, 7:56 PM" },
  { amount: 50.00, currency: "USD", status: "Succeeded", customer: "iuliakoroleva6@gmail.com", date: "Sep 12, 2:01 PM" },
  { amount: 38.49, currency: "USD", status: "Succeeded", customer: "contact@vhsislife.com", date: "Sep 12, 10:48 AM" },
  { amount: 29.80, currency: "USD", status: "Succeeded", customer: "mrobin206@msn.com", date: "Sep 10, 2:41 PM" },
  { amount: 34.49, currency: "USD", status: "Succeeded", customer: "Omarburkholder10@gmail.com", date: "Sep 9, 9:44 PM" },
  { amount: 22.98, currency: "USD", status: "Succeeded", customer: "gelgallab@gmail.com", date: "Sep 9, 9:18 PM" },
  { amount: 661.77, currency: "USD", status: "Succeeded", customer: "contact@vhsislife.com", date: "Sep 9, 7:17 PM" },
  { amount: 50.00, currency: "USD", status: "Succeeded", customer: "Omarburkholder10@gmail.com", date: "Sep 9, 3:27 PM" },
  { amount: 670.15, currency: "USD", status: "Succeeded", customer: "contact@vhsislife.com", date: "Sep 6, 11:11 AM" },
]

export default function TransactionsPage() {
  const [isTestMode, setIsTestMode] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200">
        <div className="flex items-center space-x-2 px-3 py-2 border-b border-gray-200">
          <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
          <span className="font-semibold text-sm">Mandarin 3D Prints</span>
        </div>
        <nav className="px-2 py-2">
          <Button variant="ghost" className="w-full justify-start text-sm py-1 px-2 mb-0.5">
            <Home className="mr-2 h-3 w-3" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm py-1 px-2 mb-0.5">
            <CreditCard className="mr-2 h-3 w-3" />
            Balances
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm py-1 px-2 mb-0.5 bg-purple-50 text-purple-600">
            <Receipt className="mr-2 h-3 w-3" />
            Transactions
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm py-1 px-2 mb-0.5">
            <Users className="mr-2 h-3 w-3" />
            Customers
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm py-1 px-2 mb-0.5">
            <Package className="mr-2 h-3 w-3" />
            Product catalog
          </Button>
        </nav>
        <div className="px-2 py-2 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 mb-1">Shortcuts</h3>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <BarChart className="mr-2 h-3 w-3" />
            Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <FileText className="mr-2 h-3 w-3" />
            Tax
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <FileText className="mr-2 h-3 w-3" />
            Invoices
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <Clock className="mr-2 h-3 w-3" />
            Payment Links
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <Database className="mr-2 h-3 w-3" />
            Data management
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2 mb-0.5">
            <PieChart className="mr-2 h-3 w-3" />
            Reporting overview
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Transactions</h1>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">
                Developers
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Test mode</span>
                <Button
                  variant="outline"
                  size="sm"
                  className={`relative text-xs py-1 px-2 ${isTestMode ? 'bg-purple-100 text-purple-600' : ''}`}
                  onClick={() => setIsTestMode(!isTestMode)}
                >
                  {isTestMode ? 'On' : 'Off'}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4">
          <Tabs defaultValue="all" className="mb-3">
            <TabsList>
              <TabsTrigger value="all" className="relative text-xs py-1 px-2">
                All
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-purple-100 text-purple-600">164</Badge>
              </TabsTrigger>
              <TabsTrigger value="succeeded" className="text-xs py-1 px-2">
                Succeeded
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1">151</Badge>
              </TabsTrigger>
              <TabsTrigger value="refunded" className="text-xs py-1 px-2">
                Refunded
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1">0</Badge>
              </TabsTrigger>
              <TabsTrigger value="disputed" className="text-xs py-1 px-2">
                Disputed
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1">0</Badge>
              </TabsTrigger>
              <TabsTrigger value="failed" className="text-xs py-1 px-2">
                Failed
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="uncaptured" className="text-xs py-1 px-2">
                Uncaptured
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1">0</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-3 flex justify-between items-center">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Date and time</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Amount</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Currency</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Status</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Payment method</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">More filters</Button>
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Export</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2">Edit columns</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead className="py-2">Amount</TableHead>
                    <TableHead className="py-2">Customer</TableHead>
                    <TableHead className="py-2">Date</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <TableCell className="py-1">
                        <Checkbox />
                      </TableCell>
                      <TableCell className="py-1 font-medium">
                        <div className="flex items-center space-x-1">
                          <span>${transaction.amount.toFixed(2)}</span>
                          <span className="text-gray-500 text-xs">{transaction.currency}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-600 rounded-sm px-1 py-0.5 text-xs font-normal">
                            {transaction.status} ✓
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-gray-600 text-sm">{transaction.customer}</TableCell>
                      <TableCell className="py-1 text-gray-600 text-sm">{transaction.date}</TableCell>
                      <TableCell className="py-1">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-2 text-xs text-gray-500">
            Viewing 1-20 of 164 results
          </div>
        </div>
      </main>
    </div>
  )
}