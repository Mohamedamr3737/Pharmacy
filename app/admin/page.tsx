"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Layers,
  Search,
  ChevronDown,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Logo from "@/components/Logo"

// Mock data
const recentOrders = [
  { id: "ORD-7352", customer: "John Smith", date: "2023-05-15", status: "Completed", total: 79.99 },
  { id: "ORD-7351", customer: "Sarah Johnson", date: "2023-05-14", status: "Processing", total: 124.95 },
  { id: "ORD-7350", customer: "Michael Brown", date: "2023-05-14", status: "Shipped", total: 54.5 },
  { id: "ORD-7349", customer: "Emily Davis", date: "2023-05-13", status: "Completed", total: 210.75 },
  { id: "ORD-7348", customer: "David Wilson", date: "2023-05-12", status: "Cancelled", total: 45.0 },
]

const lowStockProducts = [
  { id: 1, name: "Vitamin C Complex", stock: 5, reorderLevel: 10 },
  { id: 2, name: "Zinc Supplement", stock: 3, reorderLevel: 8 },
  { id: 3, name: "Magnesium Citrate", stock: 7, reorderLevel: 15 },
  { id: 4, name: "Digital Thermometer", stock: 2, reorderLevel: 5 },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-teal-700 text-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-teal-600">
            <div className="flex items-center">
              <Logo size="small" />
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">{renderSidebarItems()}</div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-teal-700 text-white">
        <div className="flex items-center h-16 px-4 border-b border-teal-600">
          <Logo size="small" />
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">{renderSidebarItems()}</div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button className="lg:hidden text-gray-500 focus:outline-none" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 flex justify-end items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 rounded-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <button className="text-gray-500 hover:text-gray-700">
                <Bell className="h-6 w-6" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center text-sm focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=A" alt="Admin" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-gray-700 font-medium hidden sm:block">Admin User</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin User</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Sales"
              value="$12,426.75"
              description="+12.5% from last month"
              icon={<DollarSign className="h-8 w-8 text-teal-600" />}
            />
            <StatCard
              title="Orders"
              value="142"
              description="+8.2% from last month"
              icon={<ShoppingCart className="h-8 w-8 text-teal-600" />}
            />
            <StatCard
              title="Products"
              value="512"
              description="48 added this month"
              icon={<Package className="h-8 w-8 text-teal-600" />}
            />
            <StatCard
              title="Customers"
              value="2,845"
              description="+18.7% from last month"
              icon={<Users className="h-8 w-8 text-teal-600" />}
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="outline" size="sm" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  <CardDescription>Showing the 5 most recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Order ID</th>
                          <th className="px-4 py-3">Customer</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Total</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="text-sm text-gray-900">
                            <td className="px-4 py-4 font-medium">{order.id}</td>
                            <td className="px-4 py-4">{order.customer}</td>
                            <td className="px-4 py-4">{order.date}</td>
                            <td className="px-4 py-4">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-4 font-medium">${order.total.toFixed(2)}</td>
                            <td className="px-4 py-4">
                              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                      View All Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Products that need to be restocked soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Product Name</th>
                          <th className="px-4 py-3">Current Stock</th>
                          <th className="px-4 py-3">Reorder Level</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {lowStockProducts.map((product) => (
                          <tr key={product.id} className="text-sm text-gray-900">
                            <td className="px-4 py-4 font-medium">{product.name}</td>
                            <td className="px-4 py-4">{product.stock}</td>
                            <td className="px-4 py-4">{product.reorderLevel}</td>
                            <td className="px-4 py-4">
                              <Badge className="bg-red-100 text-red-800 border-red-200">Low Stock</Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                                Reorder
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                      View All Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function renderSidebarItems() {
  const items = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/admin" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Orders", href: "/admin/orders" },
    { icon: <Package className="h-5 w-5" />, label: "Products", href: "/admin/products" },
    { icon: <Layers className="h-5 w-5" />, label: "Categories", href: "/admin/categories" },
    { icon: <Users className="h-5 w-5" />, label: "Customers", href: "/admin/customers" },
    { icon: <TrendingUp className="h-5 w-5" />, label: "Reports", href: "/admin/reports" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/admin/settings" },
  ]

  return items.map((item) => (
    <Link
      key={item.label}
      href={item.href}
      className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-teal-600 transition-colors"
    >
      {item.icon}
      <span className="ml-3">{item.label}</span>
    </Link>
  ))
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-green-600 mt-1">{description}</p>
          </div>
          <div className="bg-teal-50 p-3 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800 border-green-200",
    Processing: "bg-blue-100 text-blue-800 border-blue-200",
    Shipped: "bg-purple-100 text-purple-800 border-purple-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const style = statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800 border-gray-200"

  return <Badge className={style}>{status}</Badge>
}

