"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, User, CreditCard, LogOut, ShoppingBag, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/auth-context"

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState({
    firstName: user?.profile?.first_name || "",
    lastName: user?.profile?.last_name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [isUpdating, setIsUpdating] = useState(false)

  // Mock orders data
  const orders = [
    { id: "ORD-7352", date: "May 15, 2023", status: "Delivered", total: 79.99 },
    { id: "ORD-6891", date: "April 2, 2023", status: "Delivered", total: 124.95 },
    { id: "ORD-5723", date: "March 18, 2023", status: "Delivered", total: 54.5 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // In a real app, you would update the user profile in the database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
          <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
              <p className="text-gray-600 mb-6">Please sign in or create an account to view this page.</p>
              <div className="flex flex-col space-y-3">
                <Link href="/login">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Welcome back, {user.profile?.first_name || user.email?.split("@")[0]}</p>
            </div>
            <Button
              variant="outline"
              className="mt-4 md:mt-0 text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="orders">
            <TabsList className="mb-8">
              <TabsTrigger value="orders" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
                      <div className="mt-6">
                        <Link href="/">
                          <Button className="bg-teal-600 hover:bg-teal-700 text-white">Start Shopping</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {orders.map((order) => (
                            <tr key={order.id} className="text-sm text-gray-900">
                              <td className="px-4 py-4 font-medium">{order.id}</td>
                              <td className="px-4 py-4">{order.date}</td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 font-medium">${order.total.toFixed(2)}</td>
                              <td className="px-4 py-4">
                                <Link href={`/orders/${order.id}`}>
                                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" value={profile.firstName} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Email cannot be changed. Contact support for assistance.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input id="address" name="address" value={profile.address} onChange={handleChange} />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" value={profile.city} onChange={handleChange} />
                        </div>
                        <div>
                          <Label htmlFor="state">State / Province</Label>
                          <Input id="state" name="state" value={profile.state} onChange={handleChange} />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                          <Input id="zipCode" name="zipCode" value={profile.zipCode} onChange={handleChange} />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" name="country" value={profile.country} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Update Profile"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No payment methods</h3>
                    <p className="mt-1 text-gray-500">You haven't added any payment methods yet.</p>
                    <div className="mt-6">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white">Add Payment Method</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Coming Soon</h3>
                    <p className="mt-1 text-gray-500">Notification preferences will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

