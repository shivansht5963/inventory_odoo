"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, Search, Grid3x3, List, LogOut, ArrowLeft } from "lucide-react"
import NewReceiptForm from "@/components/new-receipt-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Receipt {
  id: string
  reference: string
  from: string
  to: string
  contact: string
  scheduleDate: string
  status: "Ready" | "Pending" | "Delivered"
  createdAt: string
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isNewReceiptOpen, setIsNewReceiptOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Simulate dynamic data fetching
  useEffect(() => {
    const fetchReceipts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const receiptsData: Receipt[] = [
        {
          id: "1",
          reference: "WH/IN/0001",
          from: "vendor",
          to: "WH/Stock1",
          contact: "Azure Interior",
          scheduleDate: "2025-11-25",
          status: "Ready",
          createdAt: "2025-11-20",
        },
        {
          id: "2",
          reference: "WH/IN/0002",
          from: "vendor",
          to: "WH/Stock1",
          contact: "Majestic Otter",
          scheduleDate: "2025-11-26",
          status: "Ready",
          createdAt: "2025-11-20",
        },
        {
          id: "3",
          reference: "WH/IN/0003",
          from: "vendor",
          to: "WH/Stock2",
          contact: "Swift Whale",
          scheduleDate: "2025-11-27",
          status: "Pending",
          createdAt: "2025-11-19",
        },
        {
          id: "4",
          reference: "WH/IN/0004",
          from: "supplier",
          to: "WH/Stock1",
          contact: "Pleased Pigeon",
          scheduleDate: "2025-11-28",
          status: "Pending",
          createdAt: "2025-11-19",
        },
        {
          id: "5",
          reference: "WH/IN/0005",
          from: "vendor",
          to: "WH/Stock3",
          contact: "Happy Hippo",
          scheduleDate: "2025-11-29",
          status: "Delivered",
          createdAt: "2025-11-18",
        },
        {
          id: "6",
          reference: "WH/IN/0006",
          from: "partner",
          to: "WH/Stock2",
          contact: "Lucky Lion",
          scheduleDate: "2025-11-30",
          status: "Ready",
          createdAt: "2025-11-18",
        },
      ]

      setReceipts(receiptsData)
      setLoading(false)
    }

    if (user) {
      fetchReceipts()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  // Filter receipts based on search query
  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group receipts by status for kanban view
  const groupedByStatus = {
    Ready: filteredReceipts.filter((r) => r.status === "Ready"),
    Pending: filteredReceipts.filter((r) => r.status === "Pending"),
    Delivered: filteredReceipts.filter((r) => r.status === "Delivered"),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-600"
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-600"
      case "Delivered":
        return "bg-blue-100 text-blue-800 border-blue-600"
      default:
        return "bg-gray-100 text-gray-800 border-gray-600"
    }
  }

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                size="sm"
                className="gap-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-100 font-bold hand-drawn-shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div
                className="p-2 bg-purple-600 rounded-lg sketchy-border hand-drawn-shadow"
                style={{ borderRadius: "6px" }}
              >
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 sketchy-underline">Receipts</h1>
                <p className="text-sm text-slate-600 font-semibold">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isNewReceiptOpen} onOpenChange={setIsNewReceiptOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 font-bold hand-drawn-shadow text-white">
                    <Plus className="w-4 h-4" />
                    NEW
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-amber-50 border-2 border-purple-600">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">Create New Receipt</DialogTitle>
                    <DialogDescription className="text-slate-600 font-semibold">
                      Fill in the details below to create a new receipt
                    </DialogDescription>
                  </DialogHeader>
                  <NewReceiptForm onClose={() => setIsNewReceiptOpen(false)} />
                </DialogContent>
              </Dialog>
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

          {/* Search and View Toggle */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-600" />
              <input
                type="text"
                placeholder="Search by reference or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-purple-600 rounded-lg bg-white text-slate-900 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2 border-2 border-purple-600 rounded-lg bg-amber-100 p-1">
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className={`${viewMode === "list" ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-amber-200"} border border-purple-600 font-bold`}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "kanban" ? "default" : "ghost"}
                onClick={() => setViewMode("kanban")}
                className={`${viewMode === "kanban" ? "bg-purple-600 text-white" : "text-purple-600 hover:bg-amber-200"} border border-purple-600 font-bold`}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
            <CardHeader>
              <CardTitle className="font-bold text-slate-800">Receipt List</CardTitle>
              <CardDescription className="font-semibold text-slate-600">
                {filteredReceipts.length} receipt{filteredReceipts.length !== 1 ? "s" : ""} found
              </CardDescription>
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
                      <th className="text-right py-3 px-4 font-bold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.length > 0 ? (
                      filteredReceipts.map((receipt) => (
                        <tr key={receipt.id} className="border-b-2 border-purple-300 hover:bg-purple-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-bold">{receipt.reference}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold capitalize">{receipt.from}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.to}</td>
                          <td className="py-3 px-4 text-slate-900 font-bold">{receipt.contact}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{receipt.scheduleDate}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(receipt.status)}`}
                            >
                              {receipt.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-purple-700 hover:text-purple-900 font-bold border border-purple-600 hover:bg-purple-100"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-600 font-semibold">
                          No receipts found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(groupedByStatus).map(([status, receiptsList]) => (
              <Card key={status} className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-800">
                    {status}
                    <span className="ml-2 text-sm font-semibold text-purple-600">({receiptsList.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {receiptsList.length > 0 ? (
                      receiptsList.map((receipt) => (
                        <div
                          key={receipt.id}
                          className="p-3 bg-white border-2 border-purple-400 rounded-lg hand-drawn-shadow cursor-pointer hover:shadow-lg transition"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-sm">{receipt.reference}</p>
                              <p className="text-xs text-slate-600 font-semibold mt-1">{receipt.contact}</p>
                            </div>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getStatusColor(status)}`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-purple-200 space-y-1">
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">From:</span> {receipt.from}
                            </p>
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">To:</span> {receipt.to}
                            </p>
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">Date:</span> {receipt.scheduleDate}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-500 font-semibold text-sm">No receipts</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
