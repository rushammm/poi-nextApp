import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Changed from blue gradient to black gradient */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            We would love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-5">
              {/* Contact Info - Changed background from gray-900 to black */}
              <div className="md:col-span-2 bg-black text-white p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="mb-8 text-gray-300">
                  Have questions about our services? Ready to get started with LocatePro? 
                  Our team is here to help you find the perfect business location.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    {/* Changed icon color from blue-400 to gray-400 for all icons */}
                    <Mail className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-300">info@locatepro.example</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-300">+92 123-4090567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-300">
                        Beaconhouse National University<br />
                        Raiwind Road<br />
                        Lahore, Pakistan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-300">
                        Monday - Friday: 9am - 5pm<br />
                        Saturday: 10am - 2pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-3 p-8 md:p-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Send Us a Message</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6} 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide as much detail as possible..."
                    ></textarea>
                  </div>

                  {/* Changed button color from blue to black */}
                  <Button 
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-md"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Our Location</h2>
          <div className="max-w-6xl mx-auto h-96 bg-gray-200 rounded-xl overflow-hidden shadow-md">
            {/* You could embed a Google Map here */}
            <div className="w-full h-full bg-gray-300 relative flex items-center justify-center">
              <p className="text-gray-600 text-lg">Map will be displayed here</p>
              {/* 
              To add a real map, you could use:
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!..." 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allowFullScreen 
              ></iframe>
              */}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
