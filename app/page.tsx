'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { SearchResults } from '@/components/searchResults'
import { BusinessLocationOptimizerComponent } from '@/components/business-location-optimizer'

// Define a type for the search results
type POI = {
  id: number
  created_at: string
  title: string
  'categories/0': string
  hotelStars: number
  'location/lat': number
  'location/lng': number
  categoryName: string
  address: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('finder')
  const [formData, setFormData] = useState({
    businessCategory: '',
    businessName: '',
    currentLocation: '',
    targetCity: '',
    budget: '',
  })
  const [searchResults, setSearchResults] = useState<POI[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Construct query parameters
      const params = new URLSearchParams()
      
      // Add non-empty form fields to search params
      if (formData.businessCategory) {
        params.append('category', formData.businessCategory)
      }
      if (formData.targetCity) {
        params.append('city', formData.targetCity)
      }
      if (formData.budget) {
        // Assuming budget is a max budget, you might want to adjust this
        params.append('maxBudget', formData.budget)
      }

      // Make API call
      const response = await fetch(`/api/locations?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError('Failed to fetch locations. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">LocatePro</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 mb-6">
            <TabsTrigger 
              value="finder" 
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Location Finder
            </TabsTrigger>
            <TabsTrigger 
              value="explore" 
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Explore Locations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="finder">
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">Business Category</Label>
                  <Select 
                    onValueChange={(value) => setFormData({...formData, businessCategory: value})}
                  >
                    <SelectTrigger className="w-full bg-white text-black border-gray-300">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                      <SelectItem value="retail" className="hover:bg-gray-100">Retail</SelectItem>
                      <SelectItem value="restaurant" className="hover:bg-gray-100">Restaurant</SelectItem>
                      <SelectItem value="service" className="hover:bg-gray-100">Service</SelectItem>
                      <SelectItem value="technology" className="hover:bg-gray-100">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Business Name</Label>
                  <Input 
                    type="text" 
                    placeholder="Enter Business Name"
                    className="bg-white text-black border-gray-300"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label className="text-gray-700">Current Location</Label>
                  <Input 
                    type="text" 
                    placeholder="Current Business Location"
                    className="bg-white text-black border-gray-300"
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label className="text-gray-700">Target City</Label>
                  <Input 
                    type="text" 
                    placeholder="Desired City"
                    className="bg-white text-black border-gray-300"
                    value={formData.targetCity}
                    onChange={(e) => setFormData({...formData, targetCity: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Budget</Label>
                  <Input 
                    type="number" 
                    placeholder="Maximum Budget"
                    className="bg-white text-black border-gray-300"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Find Locations'
                  )}
                </Button>
              </div>

              {/* Search Results Section */}
              {error && (
                <div className="text-red-600 text-center mt-4">
                  {error}
                </div>
              )}

              {searchResults.length > 0 && <SearchResults results={searchResults} />}
            </form>
          </TabsContent>

          <TabsContent value="explore">
            <div className="bg-gray-100 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-black">Explore Locations</h2>
              <p className="text-gray-700 mb-6">
                Discover available business locations in various cities. Our comprehensive optimizer helps you find the perfect spot for your business.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-300">
              <BusinessLocationOptimizerComponent/> 
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

