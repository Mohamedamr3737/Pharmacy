"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Star, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"

type Product = {
  id: number
  name: string
  slug: string
  description: string
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

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [selectedDosage, setSelectedDosage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()
  
  const supabase = getSupabaseBrowserClient()
  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug)
        `)
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('Error fetching product:', error)
      } else if (data) {
        setProduct(data)
        setSelectedForm(data.form)
        setSelectedDosage(data.dosage)
        
        // Fetch related products
        if (data.categories) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select(`
              *,
              categories(name, slug)
            `)
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4)
          
          if (!relatedError && relatedData) {
            setRelatedProducts(relatedData)
          }
        }
      }
      
      setIsLoading(false)
    }
    
    if (slug) {
      fetchProduct()
    }
  }, [slug])
  
  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }
  
  const handleAddToCart = async () => {
    if (!product) return
    
    const result = await addToCart(product.id, quantity)
    
    if (result.success) {
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add to cart",
        variant: "destructive",
      })
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <div className="aspect-square bg-gray-200 rounded-xl"></div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <AlertTriangle className="mx-auto h-16 w-16 text-yellow-400" />
              <h2 className="mt-4 text-xl font-medium text-gray-900">Product Not Found</h2>
              <p className="mt-2 text-gray-500">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    Back to Home
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {[1, 2, 3, 4].map((i) => (
                    <CarouselItem key={i}>
                      <div className="aspect-square relative overflow-hidden rounded-xl bg-white">
                        <Image
                          src={product.image_url || `/placeholder.svg?height=800&width=800&text=${encodeURIComponent(product.name)}`}
                          alt={`${product.name} image ${i}`}
                          layout="fill"
                          objectFit="contain"
                          className="w-full h-full object-center object-cover p-8"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square relative overflow-hidden rounded-lg bg-white cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-teal-600"
                  >
                    <Image
                      src={product.image_url || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(product.name)}`}
                      alt={`Thumbnail ${i}`}
                      layout="fill"
                      objectFit="contain"
                      className="w-full h-full object-center object-cover p-4"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Link 
                    href={product.categories ? `/categories/${product.categories.slug}` : '/'}
                    className="text-sm font-medium text-teal-600 hover:text-teal-700"
                  >
                    {product.categories?.name || 'Products'}
                  </Link>
                  {product.is_prescription && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Prescription Required
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">{product.name}</h1>
                {product.brand && (
                  <p className="text-xl font-light text-gray-500">{product.brand}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-500">(24 reviews)</span>
              \

