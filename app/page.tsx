"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Star, Minus, Plus, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"

const dosages = ["250mg", "500mg", "1000mg"]
const forms = [
  { name: "Tablets", value: "tablets" },
  { name: "Capsules", value: "capsules" },
  { name: "Liquid", value: "liquid" },
  { name: "Powder", value: "powder" },
]

const productVariants = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  form: forms[i % forms.length].name,
  image: `/placeholder.svg?height=600&width=600&text=Vitamin+C${i + 1}`,
}))

const relatedProducts = [
  { id: 1, name: "Vitamin D3", price: 19.99, image: "/placeholder.svg?height=300&width=300&text=Vitamin+D3" },
  { id: 2, name: "Zinc Supplement", price: 14.99, image: "/placeholder.svg?height=300&width=300&text=Zinc" },
  {
    id: 3,
    name: "Multivitamin Complex",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300&text=Multivitamin",
  },
  { id: 4, name: "Magnesium Citrate", price: 17.99, image: "/placeholder.svg?height=300&width=300&text=Magnesium" },
]

export default function ProductPage() {
  const [selectedDosage, setSelectedDosage] = useState("500mg")
  const [selectedForm, setSelectedForm] = useState(forms[0].value)
  const [selectedVariant, setSelectedVariant] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % productVariants.length)
  }

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + productVariants.length) % productVariants.length)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col justify-between py-12">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
            {/* Product Image */}
            <div className="lg:w-1/2 order-1 lg:order-1 sticky top-24">
              <div className="relative aspect-square">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={previousImage}
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>

                <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                  <Image
                    src={productVariants[currentIndex].image || "/placeholder.svg"}
                    alt="Premium Drink Bottle"
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-110"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </Button>
              </div>

              <div className="flex justify-center gap-3 sm:gap-4 mt-6">
                {productVariants.slice(0, 5).map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setCurrentIndex(productVariants.findIndex((v) => v.id === variant.id))}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all
                      ${currentIndex === productVariants.findIndex((v) => v.id === variant.id) ? "ring-2 ring-black" : "hover:ring-1 hover:ring-gray-200"}
                    `}
                  >
                    <Image
                      src={variant.image || "/placeholder.svg"}
                      alt={`Premium Drink Bottle ${variant.form}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-2">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Vitamin C Supplement</h1>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.5 / 120 reviews)</span>
                </div>
              </div>

              <p className="text-2xl font-semibold">$ 49.99</p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Support your immune system with our high-quality Vitamin C supplement. Formulated with pure ascorbic
                acid and natural citrus bioflavonoids for enhanced absorption. This essential nutrient helps maintain
                healthy skin, bones, and cartilage while providing antioxidant protection against free radicals.
              </p>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dosage</h2>
                <div className="flex flex-wrap gap-3">
                  {dosages.map((dosage) => (
                    <button
                      key={dosage}
                      onClick={() => setSelectedDosage(dosage)}
                      className={`px-4 py-2 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-all
          ${
            selectedDosage === dosage
              ? "border-teal-600 bg-teal-600 text-white"
              : "border-gray-200 hover:border-gray-300"
          }`}
                    >
                      {dosage}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Form</h2>
                <div className="flex flex-wrap gap-3">
                  {forms.map((form) => (
                    <button
                      key={form.value}
                      onClick={() => setSelectedForm(form.value)}
                      className={`px-4 py-2 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-all
          ${
            selectedForm === form.value
              ? "border-teal-600 bg-teal-600 text-white"
              : "border-gray-200 hover:border-gray-300"
          }`}
                    >
                      {form.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full">
                  <Button variant="ghost" size="icon" onClick={decrementQuantity} className="rounded-l-full">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={incrementQuantity} className="rounded-r-full">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="flex-grow bg-teal-600 text-white hover:bg-teal-700 py-6 text-lg font-medium">
                  Add to Cart
                </Button>
                <Button variant="outline" className="p-3" onClick={toggleFavorite}>
                  <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  <span className="sr-only">Add to Favorites</span>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Share:</span>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Share on Facebook</span>
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Share on Twitter</span>
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Share on Instagram</span>
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="details" className="text-lg">
                  Product Details
                </TabsTrigger>
                <TabsTrigger value="ingredients" className="text-lg">
                  Ingredients
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-lg">
                  Usage & Warnings
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-lg">
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <p className="text-gray-700">
                  Our Vitamin C supplement is formulated to provide optimal immune support and antioxidant protection.
                  Each serving delivers a potent dose of vitamin C, essential for collagen production, iron absorption,
                  and overall wellness.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                  <li>Supports immune system function</li>
                  <li>Promotes collagen production for healthy skin</li>
                  <li>Enhances iron absorption</li>
                  <li>Provides antioxidant protection</li>
                  <li>Manufactured in FDA-registered facility</li>
                  <li>Third-party tested for purity and potency</li>
                </ul>
              </TabsContent>
              <TabsContent value="ingredients" className="mt-4">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Active Ingredient</th>
                      <td className="py-2">Ascorbic Acid (Vitamin C)</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Amount Per Serving</th>
                      <td className="py-2">250mg, 500mg, or 1000mg (depending on selected dosage)</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Other Ingredients</th>
                      <td className="py-2">
                        Citrus Bioflavonoids, Rose Hips, Microcrystalline Cellulose, Vegetable Stearate
                      </td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Allergen Information</th>
                      <td className="py-2">Free from: Gluten, Dairy, Soy, Nuts, Shellfish</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-2 pr-4 font-semibold">Suitable For</th>
                      <td className="py-2">Vegetarians and Vegans</td>
                    </tr>
                    <tr>
                      <th className="py-2 pr-4 font-semibold">Fillers</th>
                      <td className="py-2">No artificial colors, flavors, or preservatives</td>
                    </tr>
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="usage" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended Usage</h3>
                    <p className="text-gray-700">
                      Adults: Take 1 tablet/capsule daily with food, or as directed by your healthcare professional.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Storage</h3>
                    <p className="text-gray-700">
                      Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-600">Warnings</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Do not exceed recommended dose</li>
                      <li>
                        Pregnant or nursing mothers, children under 18, and individuals with known medical conditions
                        should consult a physician before using
                      </li>
                      <li>Discontinue use and consult your doctor if any adverse reactions occur</li>
                      <li>Not intended to diagnose, treat, cure, or prevent any disease</li>
                      <li>High doses of Vitamin C may cause digestive discomfort in some individuals</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">JD</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">John Doe</h3>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">Great bottle! Keeps my drinks cold all day.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">JS</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">Jane Smith</h3>
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400" />
                        ))}
                        {[5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">Stylish design, but a bit heavy when full.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-teal-700">Related Health Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

