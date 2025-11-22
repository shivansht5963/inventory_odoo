"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Plus, Search, Grid3x3, List, LogOut, ArrowLeft } from "lucide-react"
import NewDeliveryForm from "@/components/new-delivery-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Delivery {
  id: string
  reference: string
  from: string
  to: string
  contact: string
  scheduleDate: string
  status: "Ready" | "Pending" | "Delivered"
  createdAt: string
}

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Simulate dynamic data fetching
  useEffect(() => {
    const fetchDeliveries = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const deliveriesData: Delivery[] = [
        {
          id: "1",
          reference: "WH/OUT/0001",
          from: "WH/Stock1",
          to: "vendor",
          contact: "Azure Interior",
          scheduleDate: "2025-11-25",
          status: "Ready",
          createdAt: "2025-11-20",
        },
        {
          id: "2",
          reference: "WH/OUT/0002",
          from: "WH/Stock1",
          to: "vendor",
          contact: "Majestic Otter",
          scheduleDate: "2025-11-26",
          status: "Ready",
          createdAt: "2025-11-20",
        },
        {
          id: "3",
          reference: "WH/OUT/0003",
          from: "WH/Stock2",
          to: "customer",
          contact: "Swift Whale",
          scheduleDate: "2025-11-27",
          status: "Pending",
          createdAt: "2025-11-19",
        },
        {
          id: "4",
          reference: "WH/OUT/0004",
          from: "WH/Stock1",
          to: "retailer",
          contact: "Pleased Pigeon",
          scheduleDate: "2025-11-28",
          status: "Pending",
          createdAt: "2025-11-19",
        },
        {
          id: "5",
          reference: "WH/OUT/0005",
          from: "WH/Stock3",
          to: "vendor",
          contact: "Happy Hippo",
          scheduleDate: "2025-11-29",
          status: "Delivered",
          createdAt: "2025-11-18",
        },
        {
          id: "6",
          reference: "WH/OUT/0006",
          from: "WH/Stock2",
          to: "partner",
          contact: "Lucky Lion",
          scheduleDate: "2025-11-30",
          status: "Ready",
          createdAt: "2025-11-18",
        },
      ]

      setDeliveries(deliveriesData)
      setLoading(false)
    }

    if (user) {
      fetchDeliveries()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return null
  }

  // Filter deliveries based on search query
  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.contact.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group deliveries by status for kanban view
  const groupedByStatus = {
    Ready: filteredDeliveries.filter((d) => d.status === "Ready"),
    Pending: filteredDeliveries.filter((d) => d.status === "Pending"),
    Delivered: filteredDeliveries.filter((d) => d.status === "Delivered"),
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
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 sketchy-underline">Delivery</h1>
                <p className="text-sm text-slate-600 font-semibold">Welcome, {user.name}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isNewDeliveryOpen} onOpenChange={setIsNewDeliveryOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 font-bold hand-drawn-shadow text-white">
                    <Plus className="w-4 h-4" />
                    NEW
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-amber-50 border-2 border-purple-600">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">Create New Delivery</DialogTitle>
                    <DialogDescription className="text-slate-600 font-semibold">
                      Fill in the details below to create a new delivery order
                    </DialogDescription>
                  </DialogHeader>
                  <NewDeliveryForm onClose={() => setIsNewDeliveryOpen(false)} />
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
              <CardTitle className="font-bold text-slate-800">Delivery List</CardTitle>
              <CardDescription className="font-semibold text-slate-600">
                {filteredDeliveries.length} deliveries found
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
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery) => (
                        <tr key={delivery.id} className="border-b-2 border-purple-300 hover:bg-purple-50 transition">
                          <td className="py-3 px-4 text-slate-900 font-bold">{delivery.reference}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.from}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold capitalize">{delivery.to}</td>
                          <td className="py-3 px-4 text-slate-900 font-bold">{delivery.contact}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{delivery.scheduleDate}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(delivery.status)}`}
                            >
                              {delivery.status}
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
                          No deliveries found matching your search.
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
            {Object.entries(groupedByStatus).map(([status, deliveriesList]) => (
              <Card key={status} className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-slate-800">
                    {status}
                    <span className="ml-2 text-sm font-semibold text-purple-600">({deliveriesList.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deliveriesList.length > 0 ? (
                      deliveriesList.map((delivery) => (
                        <div
                          key={delivery.id}
                          className="p-3 bg-white border-2 border-purple-400 rounded-lg hand-drawn-shadow cursor-pointer hover:shadow-lg transition"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-sm">{delivery.reference}</p>
                              <p className="text-xs text-slate-600 font-semibold mt-1">{delivery.contact}</p>
                            </div>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-bold border ${getStatusColor(status)}`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t border-purple-200 space-y-1">
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">From:</span> {delivery.from}
                            </p>
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">To:</span> {delivery.to}
                            </p>
                            <p className="text-xs text-slate-600 font-semibold">
                              <span className="font-bold">Date:</span> {delivery.scheduleDate}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-500 font-semibold text-sm">No deliveries</div>
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
