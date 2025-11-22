"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, FileText, Truck, ArrowLeft } from "lucide-react"

export default function OperationsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  // Sample transaction history data
  const transactionHistory = [
    { id: 1, product: "Office Chair", type: "in", quantity: 50, reference: "REC-001", date: "2024-11-20" },
    { id: 2, product: "Desk Lamp", type: "out", quantity: 30, reference: "DEL-001", date: "2024-11-19" },
    { id: 3, product: "Monitor Stand", type: "in", quantity: 25, reference: "REC-002", date: "2024-11-18" },
    { id: 4, product: "Keyboard", type: "out", quantity: 15, reference: "DEL-002", date: "2024-11-17" },
    { id: 5, product: "Mouse Pad", type: "in", quantity: 100, reference: "REC-003", date: "2024-11-16" },
  ]

  // Sample receipts data
  const receipts = [
    {
      id: 1,
      reference: "WH/IN/0001",
      from: "Vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "2024-11-20",
      status: "Ready",
    },
    {
      id: 2,
      reference: "WH/IN/0002",
      from: "Vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "2024-11-19",
      status: "Ready",
    },
    {
      id: 3,
      reference: "WH/IN/0003",
      from: "Supplier",
      to: "WH/Stock2",
      contact: "Tech Solutions",
      scheduleDate: "2024-11-21",
      status: "Pending",
    },
  ]

  // Sample deliveries data
  const deliveries = [
    {
      id: 1,
      reference: "WH/OUT/0001",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-11-20",
      status: "Ready",
    },
    {
      id: 2,
      reference: "WH/OUT/0002",
      from: "WH/Stock1",
      to: "vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-11-19",
      status: "Ready",
    },
    {
      id: 3,
      reference: "WH/OUT/0003",
      from: "WH/Stock2",
      to: "vendor",
      contact: "Global Traders",
      scheduleDate: "2024-11-22",
      status: "Pending",
    },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen p-6 bg-amber-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 p-4 bg-amber-50 border-4 border-purple-600 rounded-lg hand-drawn-shadow">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition font-bold text-purple-600 hand-drawn-shadow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-4xl font-black text-purple-600 font-caveat">Operations Management</h1>
            <div className="w-16"></div>
          </div>
          <p className="text-slate-700 font-bold">Welcome back, {user?.name || "Vendor"}</p>
        </div>

        {/* Operations Tabs */}
        <Tabs defaultValue="receipts" className="space-y-4">
          <TabsList className="bg-amber-100 border-b-4 border-purple-600 p-0 h-auto rounded-t-lg">
            <TabsTrigger
              value="receipts"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Receipts
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              <Truck className="w-4 h-4 mr-2" />
              Delivery
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Transaction History
            </TabsTrigger>
          </TabsList>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold text-slate-800">Incoming Receipts</CardTitle>
                    <CardDescription className="font-semibold text-slate-600">
                      All stock receipts from vendors
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => router.push("/receipts")}
                    className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
                  >
                    View All Receipts
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-purple-600 bg-purple-100">
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Reference</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">From</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">To</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Contact</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Schedule Date</th>
                        <th className="text-center py-3 px-4 font-bold text-slate-800">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((receipt) => (
                        <tr key={receipt.id} className="border-b-2 border-purple-300 hover:bg-purple-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-bold">{receipt.reference}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.from}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.to}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.contact}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.scheduleDate}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border-2 bg-green-100 text-green-800 border-green-600">
                              {receipt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-bold text-slate-800">Outgoing Deliveries</CardTitle>
                    <CardDescription className="font-semibold text-slate-600">
                      All stock deliveries to customers
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => router.push("/delivery")}
                    className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
                  >
                    View All Deliveries
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-purple-600 bg-purple-100">
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Reference</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">From</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">To</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Contact</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Schedule Date</th>
                        <th className="text-center py-3 px-4 font-bold text-slate-800">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((delivery) => (
                        <tr key={delivery.id} className="border-b-2 border-purple-300 hover:bg-purple-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-bold">{delivery.reference}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.from}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.to}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.contact}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.scheduleDate}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border-2 bg-green-100 text-green-800 border-green-600">
                              {delivery.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Transaction History</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  All stock movements and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactionHistory.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-white border-2 border-purple-400 rounded-lg hand-drawn-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg border-2 ${
                            transaction.type === "in" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"
                          }`}
                        >
                          <TrendingUp
                            className={`w-5 h-5 font-bold ${
                              transaction.type === "in" ? "text-green-600 rotate-180" : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{transaction.product}</p>
                          <p className="text-sm text-slate-600 font-semibold">{transaction.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${
                            transaction.type === "in" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "in" ? "+" : "-"}
                          {transaction.quantity} {transaction.type === "in" ? "In" : "Out"}
                        </p>
                        <p className="text-sm text-slate-600 font-semibold">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
