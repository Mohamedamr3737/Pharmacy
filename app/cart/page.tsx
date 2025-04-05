"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function CartPage() {
  const { items, total, isLoading, updateQuantity, removeItem, clearCart } = useCart()
  const { user } = useAuth()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { toast } = useToast()

  const applyPromoCode = () => {
    if (promoCode.trim() === "WELCOME10") {
      setPromoApplied(true)
      toast({
        title: "Promo code applied",
        description: "10% discount has been applied to your order.",
        variant: "default",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      })
    }
  }

  const discount = promoApplied ? total * 0.1 : 0
  const shipping = total > 50 ? 0 : 5.99
  const finalTotal = total - discount + shipping

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const result = await updateQuantity(itemId, newQuantity)

    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to update quantity",
        variant: "destructive",
      })
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    const result = await removeItem(itemId)

    if (result.success) {
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleClearCart = async () => {
    const result = await clearCart()

    if (result.success) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login or create an account to checkout.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    // Simulate checkout process
    setTimeout(() => {
      setIsCheckingOut(false)
      // In a real app, you would redirect to checkout page or process payment
      window.location.href = "/checkout"
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
              <p className="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Shopping Cart ({items.length} items)</h2>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                              src={item.products.image_url || "/placeholder.svg"}
                              alt={item.products.name}
                              width={100}
                              height={100}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  <Link href={`/product/${item.product_id}`} className="hover:text-teal-600">
                                    {item.products.name}
                                  </Link>
                                </h3>
                                {(item.products.form || item.products.dosage) && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.products.form && <span>{item.products.form}</span>}
                                    {item.products.form && item.products.dosage && <span> • </span>}
                                    {item.products.dosage && <span>{item.products.dosage}</span>}
                                  </p>
                                )}
                              </div>
                              <p className="text-base font-medium text-gray-900">${item.products.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 text-gray-600 hover:text-teal-600"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 text-gray-600 hover:text-teal-600"
                                  disabled={item.quantity >= item.products.stock}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-gray-500 hover:text-red-500 flex items-center"
                              >
                                <Trash2 className="h-5 w-5 mr-1" />
                                <span className="text-sm">Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="px-6 py-4 bg-gray-50 flex justify-between">
                    <Link href="/">
                      <Button variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button onClick={handleClearCart} variant="outline" className="text-gray-600 hover:text-red-600">
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    <div className="flex justify-between">
                      <p className="text-base text-gray-500">Subtotal</p>
                      <p className="text-base font-medium text-gray-900">${total.toFixed(2)}</p>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <p className="text-base">Discount (10%)</p>
                        <p className="text-base font-medium">-${discount.toFixed(2)}</p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <p className="text-base text-gray-500">Shipping</p>
                      <p className="text-base font-medium text-gray-900">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-gray-900">Total</p>
                      <p className="text-lg font-bold text-gray-900">${finalTotal.toFixed(2)}</p>
                    </div>

                    <div className="pt-4">
                      <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                        Promo Code
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          id="promo-code"
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1"
                          disabled={promoApplied}
                        />
                        <Button
                          onClick={applyPromoCode}
                          variant="outline"
                          className="border-teal-600 text-teal-600 hover:bg-teal-50"
                          disabled={promoApplied || !promoCode.trim()}
                        >
                          Apply
                        </Button>
                      </div>
                      {promoApplied && <p className="mt-1 text-sm text-green-600">Promo code applied successfully!</p>}
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 mt-6"
                      disabled={isCheckingOut || items.length === 0}
                    >
                      {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-xs text-gray-500">
                      By proceeding to checkout, you agree to our{" "}
                      <Link href="/terms" className="text-teal-600 hover:text-teal-500">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-teal-600 hover:text-teal-500">
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

