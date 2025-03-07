"use client";

import Link from 'next/link'
//import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone, ArrowRight, Facebook, Twitter, Linkedin, Github } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to subscribe the user
    if (email) {
      // Simulate successful subscription
      setTimeout(() => {
        setSubscribed(true)
        setEmail('')
      }, 500)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-md mr-2">
                <MapPin className="h-5 w-5 text-black" />
              </div>
              <span className="text-white text-2xl font-bold">LocatePro</span>
            </div>
            <p className="text-gray-400 mb-6">
              Data-driven location intelligence platform helping businesses make smarter location decisions using advanced geospatial analytics.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'Location Analysis', href: '/services/analysis' },
                { label: 'Competitor Mapping', href: '/services/competitor-mapping' },
                { label: 'Demographic Insights', href: '/services/demographics' },
                { label: 'Growth Forecasting', href: '/services/forecasting' },
                { label: 'Custom Solutions', href: '/services/custom' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link 
                    href={link.href} 
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <ArrowRight className="h-3 w-3 mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 flex-shrink-0 mt-1" />
                <span>Beaconhouse National University<br />Lahore, Pakistan</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>info@locatepro.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get the latest updates</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white rounded-r-none focus-visible:ring-gray-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-white hover:bg-gray-200 text-black rounded-l-none"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {subscribed && (
                <p className="text-green-500 text-sm">Thanks for subscribing!</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} LocatePro. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
