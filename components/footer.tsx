import Link from 'next/link'
import { Map, BarChart3, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">LocatePro</h3>
            <p className="text-gray-400 text-sm">
              Advanced location intelligence for smarter business decisions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/explorer" className="text-gray-400 hover:text-white flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  Location Explorer
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-400 hover:text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="text-gray-400">
              <a 
                href="mailto:contact@locatepro.com"
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                contact@locatepro.com
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LocatePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
