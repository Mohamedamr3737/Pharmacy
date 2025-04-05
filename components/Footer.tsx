import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-8 border-t">
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-teal-700">HealthPlus Pharmacy</h3>
            <p className="text-gray-600">Your trusted partner for all your health and wellness needs.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-teal-600">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-600">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-teal-600">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-teal-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/medications" className="text-gray-600 hover:text-teal-600">
                  Medications
                </Link>
              </li>
              <li>
                <Link href="/supplements" className="text-gray-600 hover:text-teal-600">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/health-devices" className="text-gray-600 hover:text-teal-600">
                  Health Devices
                </Link>
              </li>
              <li>
                <Link href="/prescriptions" className="text-gray-600 hover:text-teal-600">
                  Prescriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-teal-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-teal-600">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-teal-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-teal-600">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-teal-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-teal-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600">123 Health Street, Medical District, City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-teal-600" />
                <span className="text-gray-600">1-800-HEALTH-PLUS</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-teal-600" />
                <span className="text-gray-600">info@healthpluspharmacy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Health Disclaimer */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-sm text-gray-500 mb-4">
            <strong>Health Disclaimer:</strong> The information provided on this website is for informational purposes
            only and is not intended as a substitute for advice from your physician or other healthcare professional.
            You should not use the information on this website for diagnosis or treatment of any health problem.
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HealthPlus Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

