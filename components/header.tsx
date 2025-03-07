'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-black">
            LocatePro
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-black">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-black">
              Contact
            </Link>
            <Button variant="outline" className="ml-2">
              Login
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-2">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/about"
                className="text-gray-600 hover:text-black py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact"
                className="text-gray-600 hover:text-black py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button variant="outline" className="w-full justify-center mt-2">
                Login
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
