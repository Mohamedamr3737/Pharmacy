"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, ShieldCheck, Truck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.profile?.first_name || "",
    lastName: user?.profile?.last_name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    shippingMethod: "standard",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login or create an account to complete your order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    setIsProcessing(true)

    // In a real app, you would process the payment and create the order here
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart after successful order
      await clearCart()

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order has been placed.",
        variant: "default",
      })

      router.push("/order-confirmation")
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Calculate totals
  const subtotal = total
  const shipping = formData.shippingMethod === "express" ? 12.99 : formData.shippingMethod === "standard" ? 5.99 : 0
  const tax = subtotal * 0.07 // 7% tax
  const orderTotal = subtotal + shipping + tax

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/cart" className="flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State / Province</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                  <RadioGroup
                    value={formData.shippingMethod}
                    onValueChange={(value) => handleRadioChange("shippingMethod", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-medium">
                          Standard Shipping
                        </Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$5.99</p>
                        <p className="text-sm text-gray-500">3-5 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="font-medium">
                          Express Shipping
                        </Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$12.99</p>
                        <p className="text-sm text-gray-500">1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="font-medium">
                          Store Pickup
                        </Label>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Free</p>
                        <p className="text-sm text-gray-500">Available tomorrow</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                    className="space-y-3 mb-6"
                  >
                    <div className="flex items-center border rounded-lg p-4">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="font-medium ml-2">
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center border rounded-lg p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="font-medium ml-2">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiration Date (MM/YY)</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:hidden">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : `Complete Order • $${orderTotal.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                </div>

                <div className="px-6 py-4">
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="py-4 flex">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={item.products.image_url || "/placeholder.svg"}
                            alt={item.products.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.products.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.products.form && <span>{item.products.form}</span>}
                            {item.products.form && item.products.dosage && <span> • </span>}
                            {item.products.dosage && <span>{item.products.dosage}</span>}
                          </p>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-500">Qty {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-900">
                              ${(item.quantity * item.products.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="text-sm font-medium text-gray-900">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Tax (7%)</p>
                      <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <p className="text-base font-medium text-gray-900">Total</p>
                      <p className="text-base font-bold text-gray-900">${orderTotal.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ShieldCheck className="h-5 w-5 text-teal-600 mr-2" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-5 w-5 text-teal-600 mr-2" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CreditCard className="h-5 w-5 text-teal-600 mr-2" />
                      <span>We accept all major credit cards</span>
                    </div>
                  </div>

                  <div className="mt-6 hidden lg:block">
                    <Button
                      type="submit"
                      form="checkout-form"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6"
                      disabled={isProcessing}
                      onClick={handleSubmit}
                    >
                      {isProcessing ? "Processing..." : "Complete Order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

