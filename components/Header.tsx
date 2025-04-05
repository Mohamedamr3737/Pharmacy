"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingBag, Menu, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "./Logo"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user, signOut } = useAuth()
  const isAdmin = user?.email?.endsWith("@meditrack.com")
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="py-4 px-0 border-b sticky top-0 bg-white z-50">
      <div className="w-[90%] lg:w-[80%] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex relative max-w-md w-full mx-4">
          <Input
            type="text"
            placeholder="Search medications, supplements..."
            className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </form>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-base font-medium text-black hover:text-teal-600 transition-colors">
            Home
          </Link>
          <Link
            href="/medications"
            className="text-base font-medium text-gray-500 hover:text-teal-600 transition-colors"
          >
            Medications
          </Link>

          {isAdmin && (
              <Link
                href="/admin"
                className="text-base font-medium text-gray-500 hover:text-teal-600 transition-colors"
                >
                Dashboard
              </Link>
            )}


        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Account */}
          {user ? (
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="w-6 h-6" />
              </Button>
            </Link>
          ) : (
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="w-6 h-6" />
              </Button>
            </Link>
          )}

          {/* Login/Register - Desktop */}
          <div className="hidden md:block">
            {user ? (
              <Button
                onClick={() => signOut()}
                className="bg-teal-600 text-white hover:bg-teal-700 rounded text-sm px-4 py-2"
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button className="bg-teal-600 text-white hover:bg-teal-700 rounded text-sm px-4 py-2">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="py-6 space-y-6">
                <Logo size="small" />

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-lg font-medium text-black hover:text-teal-600 transition-colors">
                    Home
                  </Link>
                  <Link
                    href="/medications"
                    className="text-lg font-medium text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Medications
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-lg font-medium text-teal-700 hover:text-teal-800 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <Link
                    href="/account"
                    className="text-lg font-medium text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/cart"
                    className="text-lg font-medium text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    Cart ({itemCount})
                  </Link>
                </nav>

                {/* Mobile Login/Register */}
                <div className="flex flex-col space-y-3">
                  {user ? (
                    <Button onClick={() => signOut()} className="w-full bg-teal-600 text-white hover:bg-teal-700">
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button className="w-full bg-teal-600 text-white hover:bg-teal-700">Login</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

