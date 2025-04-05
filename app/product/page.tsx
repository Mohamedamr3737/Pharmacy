import Image from "next/image"
import { Star, Heart, ArrowRight, Truck, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3, 4].map((i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={`/placeholder.svg?height=800&width=800&text=Vitamin+C${i}`}
                        alt={`Product image ${i}`}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full object-center object-cover"
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
                  className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-teal-600"
                >
                  <Image
                    src={`/placeholder.svg?height=200&width=200&text=View${i}`}
                    alt={`Thumbnail ${i}`}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-center object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 tracking-tight text-teal-700">Advanced Vitamin C Complex</h1>
              <p className="text-2xl font-light text-gray-500">Immune Support & Antioxidant Protection</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-yellow-400 stroke-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-500">(125 reviews)</span>
            </div>

            <p className="text-4xl font-bold">$24.99</p>

            <p className="text-xl text-gray-600 leading-relaxed">
              Our Advanced Vitamin C Complex delivers potent immune support with a specialized blend of ascorbic acid
              and natural bioflavonoids for enhanced absorption. This pharmaceutical-grade supplement helps maintain
              healthy skin, supports collagen production, and provides powerful antioxidant protection.
            </p>

            {/* Form Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Form</h3>
              <RadioGroup defaultValue="tablets" className="flex gap-3">
                {[
                  { name: "Tablets", value: "tablets" },
                  { name: "Capsules", value: "capsules" },
                  { name: "Chewable", value: "chewable" },
                  { name: "Liquid", value: "liquid" },
                ].map((form) => (
                  <div key={form.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={form.value} id={`form-${form.value}`} />
                    <label
                      htmlFor={`form-${form.value}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {form.name}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Dosage Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dosage</h3>
              <Select>
                <SelectTrigger className="w-full text-lg">
                  <SelectValue placeholder="Select a dosage" />
                </SelectTrigger>
                <SelectContent>
                  {["250mg", "500mg", "1000mg"].map((dosage) => (
                    <SelectItem key={dosage} value={dosage.toLowerCase()}>
                      {dosage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold">1</span>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart and Wishlist */}
            <div className="flex space-x-4">
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-8 text-xl font-semibold">
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-gray-500 hover:text-teal-600 border-gray-200 w-16 h-16"
              >
                <Heart className="w-8 h-8" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>

            {/* Shipping and Pharmacist Support */}
            <div className="flex items-center space-x-8 text-lg font-medium">
              <div className="flex items-center">
                <Truck className="w-6 h-6 mr-2 text-teal-600" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mr-2 text-teal-600"
                >
                  <path d="M19.73 14.87a7.5 7.5 0 1 0-12.99-3.04"></path>
                  <path d="M20 11a8.1 8.1 0 0 0-3.94-6.84"></path>
                  <path d="M15 13h-5a1 1 0 0 0 0 2h5"></path>
                  <path d="M18 3V1"></path>
                  <path d="M12 3V1"></path>
                  <path d="M18 23v-2"></path>
                  <path d="M12 23v-2"></path>
                  <path d="M4.22 10.22l-1.42-1.42"></path>
                  <path d="M21.2 21.2l-1.42-1.42"></path>
                  <path d="M3.54 18.54l-1.42 1.42"></path>
                </svg>
                24/7 Pharmacist Support
              </div>
            </div>

            {/* Additional Information */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="text-xl font-semibold">Product Details</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                    <li>Pharmaceutical-grade Vitamin C (ascorbic acid)</li>
                    <li>Enhanced with bioflavonoids for better absorption</li>
                    <li>Time-released formula for sustained benefits</li>
                    <li>Non-GMO and gluten-free</li>
                    <li>Manufactured in FDA-registered facility</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger className="text-xl font-semibold">Nutritional Information</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                    <li>Serving Size: 1 tablet/capsule</li>
                    <li>Servings Per Container: 60/90/120</li>
                    <li>% Daily Value based on 2,000 calorie diet</li>
                    <li>Vitamin C: 250mg/500mg/1000mg (278%/556%/1111% DV)</li>
                    <li>Citrus Bioflavonoids: 25mg (No established DV)</li>
                    <li>Rose Hips: 10mg (No established DV)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-xl font-semibold">Warnings & Interactions</AccordionTrigger>
                <AccordionContent>
                  <p className="text-lg text-gray-600 mb-3">
                    Consult with a healthcare professional before use if you are:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                    <li>Pregnant or nursing</li>
                    <li>Taking prescription medications</li>
                    <li>Have a medical condition</li>
                    <li>Planning a medical procedure</li>
                  </ul>
                  <p className="text-lg text-gray-600 mt-3">
                    May interact with certain antibiotics, blood thinners, and chemotherapy drugs. High doses may cause
                    digestive discomfort in some individuals.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold mb-8 text-teal-700">Related Health Supplements</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {[
                {
                  id: 1,
                  name: "Vitamin D3",
                  price: 19.99,
                  image: "/placeholder.svg?height=400&width=400&text=Vitamin+D3",
                },
                {
                  id: 2,
                  name: "Zinc Supplement",
                  price: 14.99,
                  image: "/placeholder.svg?height=400&width=400&text=Zinc",
                },
                {
                  id: 3,
                  name: "Multivitamin Complex",
                  price: 24.99,
                  image: "/placeholder.svg?height=400&width=400&text=Multivitamin",
                },
                {
                  id: 4,
                  name: "Magnesium Citrate",
                  price: 17.99,
                  image: "/placeholder.svg?height=400&width=400&text=Magnesium",
                },
              ].map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="group cursor-pointer p-4">
                    <div className="aspect-square relative mb-4 bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={`Product ${product.name}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-xl">{product.name}</h3>
                    <p className="text-gray-600 mt-1 text-lg font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <h2 className="text-5xl font-bold mb-6 text-teal-700">Explore Our Health Products</h2>
          <Button
            variant="outline"
            size="lg"
            className="text-xl py-8 px-12 font-semibold border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            View All Supplements
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}

