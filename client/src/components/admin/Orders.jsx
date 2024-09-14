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

export default function Orders() {
  const [isTestMode, setIsTestMode] = useState(false)

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
          <Tabs defaultValue="all" className="mb-3">
            <TabsList className="bg-[#2A2A2A] p-1 rounded-md">
              <TabsTrigger value="all" className="relative text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                All
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#0D939B] text-white">164</Badge>
              </TabsTrigger>
              <TabsTrigger value="succeeded" className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                Succeeded
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">151</Badge>
              </TabsTrigger>
              <TabsTrigger value="refunded" className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                Refunded
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">0</Badge>
              </TabsTrigger>
              <TabsTrigger value="disputed" className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                Disputed
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">0</Badge>
              </TabsTrigger>
              <TabsTrigger value="failed" className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                Failed
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">2</Badge>
              </TabsTrigger>
              <TabsTrigger value="uncaptured" className="text-xs py-1 px-2 data-[state=active]:bg-[#0D939B] data-[state=active]:text-white">
                Uncaptured
                <Badge variant="secondary" className="ml-1 text-xs py-0 px-1 bg-[#4A4A4A] text-[#8A8A8A]">0</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-3 flex justify-between items-center">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Date and time</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Amount</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Currency</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Status</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Payment method</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">More filters</Button>
            </div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Export</Button>
              <Button variant="outline" size="sm" className="text-xs py-1 px-2 border-[#4A4A4A] text-[#8A8A8A] hover:bg-[#2A2A2A]">Edit columns</Button>
            </div>
          </div>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A] rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#2A2A2A] border-b border-[#4A4A4A]">
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Amount</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Customer</TableHead>
                    <TableHead className="py-2 text-[#8A8A8A]">Date</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#222222]'}>
                      <TableCell className="py-1">
                        <Checkbox className="border-[#4A4A4A]" />
                      </TableCell>
                      <TableCell className="py-1 font-medium">
                        <div className="flex items-center space-x-1">
                          <span>${transaction.amount.toFixed(2)}</span>
                          <span className="text-muted-foreground text-xs">{transaction.currency}</span>
                          <Badge variant="secondary" className="bg-primary text-primary-foreground rounded-sm px-1 py-0.5 text-xs font-normal">
                            {transaction.status} ✓
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-muted-foreground text-sm">{transaction.customer}</TableCell>
                      <TableCell className="py-1 text-muted-foreground text-sm">{transaction.date}</TableCell>
                      <TableCell className="py-1">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-2 text-xs text-muted-foreground">
            Viewing 1-20 of 164 results
          </div>
        </div>
      </main>
    </div>
  )
}