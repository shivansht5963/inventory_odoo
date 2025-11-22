"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit2, X } from "lucide-react"

interface Warehouse {
  id: string
  name: string
  shortCode: string
  address: string
}

export default function SettingsPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    { id: "1", name: "Main Warehouse", shortCode: "MW", address: "123 Industrial Ave, NY 10001" },
    { id: "2", name: "Secondary Storage", shortCode: "SS", address: "456 Commerce St, NJ 07001" },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    shortCode: "",
    address: "",
  })

  const handleAddWarehouse = () => {
    setFormData({ name: "", shortCode: "", address: "" })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setFormData({ name: warehouse.name, shortCode: warehouse.shortCode, address: warehouse.address })
    setEditingId(warehouse.id)
    setShowForm(true)
  }

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((w) => w.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.shortCode || !formData.address) return

    if (editingId) {
      setWarehouses(
        warehouses.map((w) =>
          w.id === editingId
            ? { ...w, name: formData.name, shortCode: formData.shortCode, address: formData.address }
            : w,
        ),
      )
    } else {
      setWarehouses([
        ...warehouses,
        { id: Date.now().toString(), name: formData.name, shortCode: formData.shortCode, address: formData.address },
      ])
    }

    setShowForm(false)
    setFormData({ name: "", shortCode: "", address: "" })
  }

  return (
    <div className="space-y-6">
      {/* Warehouse Section */}
      <Card className="border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-bold text-slate-800 text-xl">Warehouse</CardTitle>
            <CardDescription className="font-semibold text-slate-600">Manage warehouse locations</CardDescription>
          </div>
          <Button
            onClick={handleAddWarehouse}
            className="gap-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
          >
            <Plus className="w-4 h-4" />
            Add Warehouse
          </Button>
        </CardHeader>

        <CardContent>
          {/* Warehouse List */}
          <div className="space-y-3">
            {warehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                className="p-4 bg-white border-2 border-purple-400 rounded-lg hand-drawn-shadow flex items-start justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg sketchy-underline">{warehouse.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-slate-700">
                      <span className="text-purple-600 font-bold">Short Code:</span> {warehouse.shortCode}
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      <span className="text-purple-600 font-bold">Address:</span> {warehouse.address}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEditWarehouse(warehouse)}
                    size="sm"
                    className="gap-1 bg-blue-500 hover:bg-blue-600 border-2 border-blue-700 text-white font-bold hand-drawn-shadow"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteWarehouse(warehouse.id)}
                    size="sm"
                    className="gap-1 bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold hand-drawn-shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Warehouse Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md border-2 border-purple-600 bg-amber-50 hand-drawn-shadow rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-bold text-slate-800">
                    {editingId ? "Edit Warehouse" : "Add New Warehouse"}
                  </CardTitle>
                  <Button onClick={() => setShowForm(false)} variant="ghost" size="sm" className="p-0">
                    <X className="w-5 h-5 text-slate-600" />
                  </Button>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Name:</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Warehouse name"
                        className="w-full px-3 py-2 border-2 border-purple-600 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Short Code:</label>
                      <input
                        type="text"
                        value={formData.shortCode}
                        onChange={(e) => setFormData({ ...formData, shortCode: e.target.value.toUpperCase() })}
                        placeholder="e.g., MW"
                        maxLength={5}
                        className="w-full px-3 py-2 border-2 border-purple-600 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-2">Address:</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full warehouse address"
                        rows={3}
                        className="w-full px-3 py-2 border-2 border-purple-600 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 border-2 border-purple-800 text-white font-bold hand-drawn-shadow"
                      >
                        {editingId ? "Update" : "Add"} Warehouse
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 bg-slate-400 hover:bg-slate-500 border-2 border-slate-600 text-white font-bold hand-drawn-shadow"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
