"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"

interface Product {
  id: string
  code: string
  name: string
  quantity: number
}

interface NewDeliveryFormProps {
  onClose?: () => void
}

export default function NewDeliveryForm({ onClose }: NewDeliveryFormProps) {
  const [reference, setReference] = useState("WH/OUT/0001")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [responsible, setResponsible] = useState("")
  const [operationType, setOperationType] = useState("Delivery")
  const [products, setProducts] = useState<Product[]>([])
  const [newProductCode, setNewProductCode] = useState("")
  const [newProductName, setNewProductName] = useState("")
  const [newProductQuantity, setNewProductQuantity] = useState("")
  const [status, setStatus] = useState("Draft")

  const addProduct = () => {
    if (newProductCode && newProductName && newProductQuantity) {
      const newProduct: Product = {
        id: Math.random().toString(),
        code: newProductCode,
        name: newProductName,
        quantity: Number.parseInt(newProductQuantity),
      }
      setProducts([...products, newProduct])
      setNewProductCode("")
      setNewProductName("")
      setNewProductQuantity("")
    }
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleSubmit = () => {
    const deliveryData = {
      reference,
      deliveryAddress,
      scheduleDate,
      responsible,
      operationType,
      products,
      status,
      createdAt: new Date().toISOString(),
    }
    console.log("[v0] New delivery created:", deliveryData)
    // Here you would typically send this to your backend API
    onClose?.()
  }

  return (
    <div
      className="w-full bg-amber-50 p-4 md:p-6 border-2 border-purple-600 rounded-lg hand-drawn-shadow"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(120, 53, 15, 0.02) 2px, rgba(120, 53, 15, 0.02) 4px)",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b-2 border-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 sketchy-underline">{operationType}</h2>
            <div className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded border border-purple-600">
              {status}
            </div>
          </div>
          <p className="text-sm font-bold text-slate-700">{reference}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button className="gap-2 border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-100 font-bold hand-drawn-shadow">
            Validate
          </Button>
          <Button className="gap-2 border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-100 font-bold hand-drawn-shadow">
            Print
          </Button>
          <Button className="gap-2 border-2 border-purple-600 text-purple-600 bg-white hover:bg-purple-100 font-bold hand-drawn-shadow">
            Cancel
          </Button>
          <div className="ml-auto">
            <div className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded border border-purple-600">
              Draft &gt; Waiting &gt; Ready &gt; Done
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-2">Delivery Address</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full px-3 py-2 border-b-2 border-purple-600 bg-transparent text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-2">Schedule Date</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-purple-600 bg-transparent text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-2">Responsible</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                placeholder="Enter responsible person"
                className="w-full px-3 py-2 border-b-2 border-purple-600 bg-transparent text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-600 mb-2">Operation Type</label>
              <select
                value={operationType}
                onChange={(e) => setOperationType(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-purple-600 bg-transparent text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Delivery">Delivery</option>
                <option value="Return">Return</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-3 border-t-2 border-purple-600 pt-4">
          <h3 className="text-lg font-bold text-purple-600 sketchy-underline">Products</h3>

          {/* Products Table */}
          {products.length > 0 && (
            <div className="overflow-x-auto border-2 border-purple-600 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-600 bg-purple-100">
                    <th className="text-left py-2 px-3 font-bold text-slate-800">Product</th>
                    <th className="text-center py-2 px-3 font-bold text-slate-800">Quantity</th>
                    <th className="text-center py-2 px-3 font-bold text-slate-800">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-purple-300 hover:bg-purple-50">
                      <td className="py-2 px-3 text-slate-900 font-semibold">
                        [{product.code}] {product.name}
                      </td>
                      <td className="py-2 px-3 text-center text-slate-900 font-bold">{product.quantity}</td>
                      <td className="py-2 px-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 font-bold"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* New Product Input */}
          <div className="border-2 border-dashed border-purple-400 rounded-lg p-4 bg-white">
            <p className="text-xs font-bold text-slate-500 mb-3">New Product</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              <input
                type="text"
                value={newProductCode}
                onChange={(e) => setNewProductCode(e.target.value)}
                placeholder="Product Code"
                className="px-2 py-2 border border-purple-400 rounded text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Product Name"
                className="px-2 py-2 border border-purple-400 rounded text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                value={newProductQuantity}
                onChange={(e) => setNewProductQuantity(e.target.value)}
                placeholder="Quantity"
                className="px-2 py-2 border border-purple-400 rounded text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button
                onClick={addProduct}
                className="gap-1 bg-purple-600 hover:bg-purple-700 text-white border border-purple-800 font-bold text-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <button onClick={addProduct} className="text-xs font-bold text-purple-600 hover:text-purple-800 underline">
              Add New product
            </button>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t-2 border-purple-600">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-800 font-bold hand-drawn-shadow"
          >
            Save Delivery
          </Button>
          <Button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-800 font-bold hand-drawn-shadow"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
