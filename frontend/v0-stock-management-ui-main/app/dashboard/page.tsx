"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Package, TrendingUp, Plus, Filter, Download, LogOut, FileText, Truck } from "lucide-react"
import SettingsPage from "@/components/settings-page" // Import SettingsPage component

interface StockItem {
  id: string
  productName: string
  sku: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  lastUpdated: string
  status: "optimal" | "low" | "critical"
}

interface Transaction {
  id: string
  type: "in" | "out"
  product: string
  quantity: number
  date: string
  reference: string
}

interface ChartData {
  date: string
  stock: number
}

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Simulate dynamic data fetching
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const stockData: StockItem[] = [
        {
          id: "1",
          productName: "Wireless Headphones",
          sku: "WH-001",
          currentStock: 45,
          minStock: 20,
          maxStock: 100,
          unit: "pcs",
          lastUpdated: new Date().toISOString(),
          status: "optimal",
        },
        {
          id: "2",
          productName: "USB-C Cables",
          sku: "UC-002",
          currentStock: 12,
          minStock: 30,
          maxStock: 150,
          unit: "pcs",
          lastUpdated: new Date().toISOString(),
          status: "low",
        },
        {
          id: "3",
          productName: "Phone Cases",
          sku: "PC-003",
          currentStock: 2,
          minStock: 25,
          maxStock: 200,
          unit: "pcs",
          lastUpdated: new Date().toISOString(),
          status: "critical",
        },
        {
          id: "4",
          productName: "Screen Protectors",
          sku: "SP-004",
          currentStock: 78,
          minStock: 40,
          maxStock: 120,
          unit: "pcs",
          lastUpdated: new Date().toISOString(),
          status: "optimal",
        },
        {
          id: "5",
          productName: "Power Banks",
          sku: "PB-005",
          currentStock: 23,
          minStock: 15,
          maxStock: 80,
          unit: "pcs",
          lastUpdated: new Date().toISOString(),
          status: "optimal",
        },
      ]

      const transactionData: Transaction[] = [
        {
          id: "1",
          type: "in",
          product: "Wireless Headphones",
          quantity: 25,
          date: "2025-11-20",
          reference: "PO-2025-001",
        },
        { id: "2", type: "out", product: "USB-C Cables", quantity: 18, date: "2025-11-19", reference: "SO-2025-045" },
        { id: "3", type: "in", product: "Phone Cases", quantity: 50, date: "2025-11-19", reference: "PO-2025-002" },
        {
          id: "4",
          type: "out",
          product: "Screen Protectors",
          quantity: 12,
          date: "2025-11-18",
          reference: "SO-2025-044",
        },
        { id: "5", type: "in", product: "Power Banks", quantity: 30, date: "2025-11-18", reference: "PO-2025-003" },
        {
          id: "6",
          type: "out",
          product: "Wireless Headphones",
          quantity: 8,
          date: "2025-11-17",
          reference: "SO-2025-043",
        },
      ]

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const chartDataGenerated = days.map((day, idx) => ({
        date: day,
        stock: Math.floor(Math.random() * 200) + 100,
      }))

      setStocks(stockData)
      setTransactions(transactionData)
      setChartData(chartDataGenerated)
      setLoading(false)
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  const stats = {
    totalProducts: stocks.length,
    lowStockItems: stocks.filter((s) => s.status === "low" || s.status === "critical").length,
    totalValue: stocks.reduce((acc, item) => acc + item.currentStock, 0),
    avgStockLevel: Math.round(stocks.reduce((acc, item) => acc + item.currentStock, 0) / stocks.length) || 0,
  }

  const statusDistribution = [
    { name: "Optimal", value: stocks.filter((s) => s.status === "optimal").length, fill: "#10b981" },
    { name: "Low", value: stocks.filter((s) => s.status === "low").length, fill: "#f59e0b" },
    { name: "Critical", value: stocks.filter((s) => s.status === "critical").length, fill: "#ef4444" },
  ]

  return (
    <div
      className="min-h-screen bg-amber-50 p-4 md:p-8"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.02) 2px, rgba(120, 53, 15, 0.02) 4px)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="p-2 bg-purple-600 rounded-lg sketchy-border hand-drawn-shadow"
                style={{ borderRadius: "6px" }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 sketchy-underline">StockMaster</h1>
                <p className="text-sm text-slate-600 font-semibold">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-amber-100 border-2 border-purple-600 text-purple-700 hover:bg-amber-200 font-bold"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-amber-100 border-2 border-purple-600 text-purple-700 hover:bg-amber-200 font-bold"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 font-bold hand-drawn-shadow"
              >
                <Plus className="w-4 h-4" />
                Add Stock
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                className="gap-2 bg-red-600 hover:bg-red-700 border-2 border-red-800 text-white font-bold hand-drawn-shadow"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-slate-700 font-semibold text-lg">Manage your inventory efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-700">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalProducts}</div>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Active items</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-700">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.lowStockItems}</div>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Need attention</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-700">Total Stock Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalValue}</div>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Units in inventory</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-700">Avg Stock Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.avgStockLevel}</div>
              <p className="text-xs text-slate-600 mt-2 font-semibold">Per product</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-amber-100 border-b-4 border-purple-600 p-0 h-auto rounded-t-lg">
            <TabsTrigger
              value="dashboard"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Transaction History
            </TabsTrigger>
            <TabsTrigger
              value="operations"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Operations
            </TabsTrigger>
            <TabsTrigger
              value="receipts"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Receipts
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Delivery
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-4 border-transparent px-4 py-3 font-bold text-slate-700 data-[state=active]:border-purple-600 data-[state=active]:bg-amber-50"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stock Trend Chart */}
              <Card className="lg:col-span-2 border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Stock Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d4af37" strokeWidth={2} />
                      <XAxis dataKey="date" stroke="#7c3aed" strokeWidth={2} />
                      <YAxis stroke="#7c3aed" strokeWidth={2} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fef3c7",
                          border: "2px solid #7c3aed",
                          borderRadius: "4px",
                          color: "#1e293b",
                          fontWeight: "bold",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="stock"
                        stroke="#7c3aed"
                        strokeWidth={3}
                        dot={{ fill: "#7c3aed", r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
                <CardHeader>
                  <CardTitle className="font-bold text-slate-800">Stock Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="#7c3aed"
                        strokeWidth={2}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {statusDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-purple-600"
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span className="text-slate-700">{item.name}</span>
                        </div>
                        <span className="text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Current Inventory</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  All products and their stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-purple-600 bg-purple-100">
                        <th className="text-left py-3 px-4 font-bold text-slate-800">Product Name</th>
                        <th className="text-left py-3 px-4 font-bold text-slate-800">SKU</th>
                        <th className="text-center py-3 px-4 font-bold text-slate-800">Current Stock</th>
                        <th className="text-center py-3 px-4 font-bold text-slate-800">Min/Max</th>
                        <th className="text-center py-3 px-4 font-bold text-slate-800">Status</th>
                        <th className="text-right py-3 px-4 font-bold text-slate-800">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock) => (
                        <tr key={stock.id} className="border-b-2 border-purple-300 hover:bg-purple-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-bold">{stock.productName}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{stock.sku}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-bold text-slate-900">{stock.currentStock}</span>
                            <span className="text-slate-600 ml-1 font-semibold">{stock.unit}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-slate-700 font-semibold">
                            {stock.minStock}/{stock.maxStock}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${
                                stock.status === "optimal"
                                  ? "bg-green-100 text-green-800 border-green-600"
                                  : stock.status === "low"
                                    ? "bg-amber-100 text-amber-800 border-amber-600"
                                    : "bg-red-100 text-red-800 border-red-600"
                              }`}
                            >
                              {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-700 hover:text-purple-900 font-bold border border-purple-600 hover:bg-purple-100"
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Transaction History</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  Recent stock movements and adjustments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-white border-2 border-purple-400 rounded-lg hand-drawn-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg border-2 ${transaction.type === "in" ? "bg-green-100 border-green-600" : "bg-red-100 border-red-600"}`}
                        >
                          <TrendingUp
                            className={`w-5 h-5 font-bold ${transaction.type === "in" ? "text-green-600 rotate-180" : "text-red-600"}`}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{transaction.product}</p>
                          <p className="text-sm text-slate-600 font-semibold">{transaction.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${transaction.type === "in" ? "text-green-600" : "text-red-600"}`}
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

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Operations Center</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  Unified view of all operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/operations")}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
                >
                  Go to Operations
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipts Tab */}
          <TabsContent value="receipts" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Receipts Management</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  View and manage all incoming stock receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/receipts")}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
                >
                  <FileText className="w-4 h-4" />
                  Go to Receipts
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
              <CardHeader>
                <CardTitle className="font-bold text-slate-800">Delivery Management</CardTitle>
                <CardDescription className="font-semibold text-slate-600">
                  View and manage all outgoing stock deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push("/delivery")}
                  className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 font-bold hand-drawn-shadow text-white"
                >
                  <Truck className="w-4 h-4" />
                  Go to Delivery
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
