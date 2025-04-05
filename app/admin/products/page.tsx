"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Layers,
  Search,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Bell,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Logo from "@/components/Logo"

export default function ProductsPage() {
  // State to hold products loaded from the API
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // State for the Add Product dialog/form
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  })

  // State for the Edit Product dialog/form
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Fetch products from the API endpoint
  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Build query parameters from state
      const categoryQuery =
        selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : ""
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}${categoryQuery}`)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh products when search or category filter changes
  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory])

  // Handle adding a new product via API
  const handleAddProduct = async () => {
    const formData = new FormData()
    formData.append("name", newProduct.name)
    formData.append("category", newProduct.category)
    formData.append("price", newProduct.price)
    formData.append("stock", newProduct.stock)
    formData.append("description", newProduct.description)

    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (data.success) {
      fetchProducts() // refresh the list
      setIsAddProductOpen(false)
      setNewProduct({ name: "", category: "", price: "", stock: "", description: "" })
    } else {
      console.error("Add product error:", data.error)
    }
  }

  // Open the edit modal and prefill form with product details
  const openEditModal = (product) => {
    setEditingProduct(product)
    setIsEditProductOpen(true)
  }

  // Handle editing an existing product via API
  const handleEditProduct = async () => {
    const formData = new FormData()
    formData.append("id", editingProduct.id)
    formData.append("name", editingProduct.name)
    formData.append("category", editingProduct.category)
    formData.append("price", editingProduct.price)
    formData.append("stock", editingProduct.stock)
    formData.append("description", editingProduct.description)

    const res = await fetch("/api/products", {
      method: "PUT",
      body: formData,
    })
    const data = await res.json()
    if (data.success) {
      fetchProducts() // refresh list after update
      setIsEditProductOpen(false)
      setEditingProduct(null)
    } else {
      console.error("Edit product error:", data.error)
    }
  }

  // Handle deletion of a product via API
  const handleDeleteProduct = async (id) => {
    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    })
    const data = await res.json()
    if (data.success) {
      fetchProducts()
    } else {
      console.error("Delete product error:", data.error)
    }
  }

  // Filter products on the client for search text (if desired, you could also do this server-side)
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

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
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 rounded-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500">Manage your product inventory</p>
            </div>

            {/* Add Product Dialog */}
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supplements">Supplements</SelectItem>
                        <SelectItem value="Medications">Medications</SelectItem>
                        <SelectItem value="Health Devices">Health Devices</SelectItem>
                        <SelectItem value="Personal Care">Personal Care</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, description: e.target.value })
                      }
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleAddProduct}>
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            {editingProduct && (
              <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                <DialogTrigger asChild>
                  {/* Invisible trigger – the modal opens when openEditModal is called */}
                  <div />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Update the details of your product.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-category" className="text-right">
                        Category
                      </Label>
                      <Select
                        value={editingProduct.category}
                        onValueChange={(value) =>
                          setEditingProduct({ ...editingProduct, category: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Supplements">Supplements</SelectItem>
                          <SelectItem value="Medications">Medications</SelectItem>
                          <SelectItem value="Health Devices">Health Devices</SelectItem>
                          <SelectItem value="Personal Care">Personal Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-price" className="text-right">
                        Price ($)
                      </Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, price: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-stock" className="text-right">
                        Stock
                      </Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, stock: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={handleEditProduct}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="category-filter" className="whitespace-nowrap">
                Filter by:
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter" className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Supplements">Supplements</SelectItem>
                  <SelectItem value="Medications">Medications</SelectItem>
                  <SelectItem value="Health Devices">Health Devices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="p-4"
                    />
                    <div className="absolute top-2 right-2">
                      <ProductStatusBadge status={product.status} />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Category</span>
                        <span className="text-sm font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Price</span>
                        <span className="text-sm font-medium">${Number(product.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Stock</span>
                        <span className="text-sm font-medium">{product.stock}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-teal-600 border-teal-600 hover:bg-teal-50"
                          onClick={() => openEditModal(product)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Sidebar items rendering remains the same
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
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-teal-600 transition-colors ${
        item.label === "Products" ? "bg-teal-600" : ""
      }`}
    >
      {item.icon}
      <span className="ml-3">{item.label}</span>
    </Link>
  ))
}

// Badge component to display product status
function ProductStatusBadge({ status }) {
  const statusStyles = {
    Active: "bg-green-100 text-green-800 border-green-200",
    "Low Stock": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Out of Stock": "bg-red-100 text-red-800 border-red-200",
  }

  const style = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"
  return <Badge className={style}>{status}</Badge>
}
