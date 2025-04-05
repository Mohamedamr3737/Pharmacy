"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type Product = {
  id: number
  name: string
  slug: string
  price: number
  image_url: string
  stock: number
  is_prescription: boolean
  form: string | null
  dosage: string | null
  brand: string | null
  status: string
  categories: {
    name: string
    slug: string
  } | null
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([])

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name, slug").order("name")

      if (!error && data) {
        setCategories(data)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      let query = supabase
        .from("products")
        .select(`
          *,
          categories(name, slug)
        `)
        .ilike("name", `%${searchQuery}%`)

      if (selectedCategory !== "all") {
        query = query.eq("categories.slug", selectedCategory)
      }

      if (sortBy === "price-asc") {
        query = query.order("price", { ascending: true })
      } else if (sortBy === "price-desc") {
        query = query.order("price", { ascending: false })
      } else if (sortBy === "name") {
        query = query.order("name", { ascending: true })
      } else {
        // Default sort by relevance (we'll just use id for now)
        query = query.order("id", { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
      } else {
        setProducts(data || [])
      }

      setIsLoading(false)
    }

    if (searchQuery) {
      fetchProducts()
    } else {
      setProducts([])
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Search Products"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isLoading
                ? "Searching..."
                : searchQuery
                  ? `Found ${products.length} results`
                  : "Enter a search term to find products"}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-teal-600 hover:bg-teal-700 text-white h-8 px-3"
                >
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <SearchIcon className="mx-auto h-16 w-16 text-gray-400" />
              {searchQuery ? (
                <>
                  <h2 className="mt-4 text-xl font-medium text-gray-900">No results found</h2>
                  <p className="mt-2 text-gray-500">We couldn't find any products matching "{searchQuery}".</p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-xl font-medium text-gray-900">Search for products</h2>
                  <p className="mt-2 text-gray-500">Enter a search term to find products.</p>
                </>
              )}
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">Browse All Products</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        className="p-4"
                      />
                      {product.is_prescription && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Prescription
                          </span>
                        </div>
                      )}
                      {product.stock <= 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {product.brand && <span>{product.brand}</span>}
                          {product.categories && (
                            <span className="ml-1 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                              {product.categories.name}
                            </span>
                          )}
                        </p>
                        {(product.form || product.dosage) && (
                          <p className="text-sm text-gray-500 mb-2">
                            {product.form && <span>{product.form}</span>}
                            {product.form && product.dosage && <span> • </span>}
                            {product.dosage && <span>{product.dosage}</span>}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        <Button className="bg-teal-600 hover:bg-teal-700 text-white">View</Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

