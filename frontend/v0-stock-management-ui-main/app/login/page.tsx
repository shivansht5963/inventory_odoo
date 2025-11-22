"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/app/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(120, 53, 15, 0.02) 2px,
            rgba(120, 53, 15, 0.02) 4px
          )`,
        }}
      >
        <Card className="sketchy-border hand-drawn-shadow border-4 border-purple-600 bg-white p-8">
          <div className="text-center mb-8">
            <h1 className="font-sans text-4xl font-bold text-purple-700 sketchy-underline mb-2">StockMaster</h1>
            <p className="text-amber-900 text-sm font-medium">Vendor Login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-sans text-lg font-bold text-gray-800">Email</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sketchy-border border-2 border-purple-600 rounded-lg font-sans text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-sans text-lg font-bold text-gray-800">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sketchy-border border-2 border-purple-600 rounded-lg font-sans text-base"
              />
            </div>

            {error && (
              <div className="sketchy-border border-2 border-red-500 bg-red-50 p-3 rounded-lg">
                <p className="font-sans text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full hand-drawn-shadow sketchy-border border-2 border-purple-600 bg-purple-600 text-white hover:bg-purple-700 font-sans text-lg font-bold py-6 rounded-lg"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="font-sans text-gray-700">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-600 font-bold underline hover:text-purple-700">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
