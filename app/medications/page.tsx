import Link from "next/link"
import Image from "next/image"
import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Mock data for medications
const medications = [
  {
    id: 1,
    name: "Acetaminophen",
    brand: "Tylenol",
    category: "Pain Relief",
    price: 9.99,
    image: "/placeholder.svg?height=300&width=300&text=Acetaminophen",
    prescription: false,
  },
  {
    id: 2,
    name: "Ibuprofen",
    brand: "Advil",
    category: "Pain Relief",
    price: 8.49,
    image: "/placeholder.svg?height=300&width=300&text=Ibuprofen",
    prescription: false,
  },
  {
    id: 3,
    name: "Loratadine",
    brand: "Claritin",
    category: "Allergy",
    price: 12.99,
    image: "/placeholder.svg?height=300&width=300&text=Loratadine",
    prescription: false,
  },
  {
    id: 4,
    name: "Cetirizine",
    brand: "Zyrtec",
    category: "Allergy",
    price: 14.99,
    image: "/placeholder.svg?height=300&width=300&text=Cetirizine",
    prescription: false,
  },
  {
    id: 5,
    name: "Omeprazole",
    brand: "Prilosec",
    category: "Digestive Health",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300&text=Omeprazole",
    prescription: false,
  },
  {
    id: 6,
    name: "Amoxicillin",
    brand: "Generic",
    category: "Antibiotics",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300&text=Amoxicillin",
    prescription: true,
  },
  {
    id: 7,
    name: "Lisinopril",
    brand: "Generic",
    category: "Blood Pressure",
    price: 15.99,
    image: "/placeholder.svg?height=300&width=300&text=Lisinopril",
    prescription: true,
  },
  {
    id: 8,
    name: "Atorvastatin",
    brand: "Lipitor",
    category: "Cholesterol",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300&text=Atorvastatin",
    prescription: true,
  },
]

// Group medications by category
const categories = Array.from(new Set(medications.map((med) => med.category)))
const medicationsByCategory = categories.reduce(
  (acc, category) => {
    acc[category] = medications.filter((med) => med.category === category)
    return acc
  },
  {} as Record<string, typeof medications>,
)

export default function MedicationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
              <p className="mt-1 text-lg text-gray-500">Browse our wide range of medications</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center">
                Sort by: <span className="font-medium ml-1">Popularity</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Medications</TabsTrigger>
              <TabsTrigger value="otc">Over-the-Counter</TabsTrigger>
              <TabsTrigger value="prescription">Prescription</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-12">
                {categories.map((category) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {medicationsByCategory[category].map((medication) => (
                        <MedicationCard key={medication.id} medication={medication} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="otc">
              <div className="space-y-12">
                {categories.map((category) => {
                  const otcMeds = medicationsByCategory[category].filter((med) => !med.prescription)
                  if (otcMeds.length === 0) return null

                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {otcMeds.map((medication) => (
                          <MedicationCard key={medication.id} medication={medication} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="prescription">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prescription Medications</h2>
                <p className="text-gray-600 mb-4">To order prescription medications, you'll need to:</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 mb-6">
                  <li>Create an account or log in</li>
                  <li>Upload your prescription</li>
                  <li>Our pharmacist will verify your prescription</li>
                  <li>Once approved, we'll process and ship your order</li>
                </ol>
                <div className="flex space-x-4">
                  <Link href="/login">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white">Login to Upload Prescription</Button>
                  </Link>
                  <Link href="/prescriptions">
                    <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-12">
                {categories.map((category) => {
                  const prescriptionMeds = medicationsByCategory[category].filter((med) => med.prescription)
                  if (prescriptionMeds.length === 0) return null

                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {prescriptionMeds.map((medication) => (
                          <MedicationCard key={medication.id} medication={medication} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-16">
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm">
              <AccordionItem value="faq-1">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium">
                  How do I order prescription medications?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  To order prescription medications, you need to create an account, upload your prescription, and wait
                  for our pharmacist to verify it. Once approved, we'll process and ship your order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  We accept all major credit cards, PayPal, and health savings account (HSA) cards for eligible items.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium">
                  How long does shipping take?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Standard shipping typically takes 3-5 business days. We also offer expedited shipping options at
                  checkout for an additional fee.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium">
                  Can I return medications if I don't need them?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  For safety and quality reasons, we cannot accept returns on medications once they have been shipped.
                  Please contact our customer service if you have any issues with your order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium">
                  Do you offer automatic refills?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, we offer an automatic refill program for maintenance medications. You can set up this service in
                  your account settings or contact our pharmacy team for assistance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function MedicationCard({ medication }: { medication: (typeof medications)[0] }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={medication.image || "/placeholder.svg"}
          alt={medication.name}
          layout="fill"
          objectFit="contain"
          className="p-4"
        />
        {medication.prescription && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Prescription</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg text-gray-900 mb-1">{medication.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{medication.brand}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">${medication.price.toFixed(2)}</span>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  )
}

