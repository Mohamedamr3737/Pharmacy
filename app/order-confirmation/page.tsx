"use client"

import Link from "next/link"
import { CheckCircle, Package, Truck, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function OrderConfirmationPage() {
  // In a real app, you would fetch the order details from the server
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-teal-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
                <p className="text-lg text-gray-600 mt-2">Thank you for your purchase. Your order has been received.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Number</p>
                    <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">{orderDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                    <p className="text-lg font-semibold text-gray-900">{estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-900">Order Placed</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-500">Processing</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-500">Shipped</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-500">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-medium">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Order Confirmation Email</p>
                      <p className="text-sm text-gray-500">
                        You will receive an email confirmation with your order details shortly.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-medium">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Order Processing</p>
                      <p className="text-sm text-gray-500">
                        We'll prepare your order and notify you when it's ready for shipping.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-medium">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Shipping Confirmation</p>
                      <p className="text-sm text-gray-500">
                        Once your order ships, we'll send you a shipping confirmation with tracking information.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Separator className="my-8" />

              <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                <p className="text-gray-600 mb-4 sm:mb-0">
                  Have questions about your order?{" "}
                  <Link href="/contact" className="text-teal-600 hover:text-teal-500">
                    Contact our support team
                  </Link>
                </p>
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

