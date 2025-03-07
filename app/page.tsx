'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Plus as PlusIcon, Minus as MinusIcon, Search, Map, BarChart3, Layers, ArrowRight, X } from 'lucide-react'
import Image from 'next/image'
import { SearchResults } from '@/components/searchResults'
//import { BusinessLocationOptimizerComponent } from '@/components/business-location-optimizer'
import { MapWrapper } from '@/components/map-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { POI } from '@/types/poi'

// Define a type for the search results
// type POI = {
//   id: number
//   created_at: string
//   title: string
//   'categories/0': string
//   hotelStars: number
//   'location/lat': number
//   'location/lng': number
//   categoryName: string
//   address: string
// }

export default function Home() {
  const router = useRouter()
  const [showFormDialog, setShowFormDialog] = useState(false)
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
  const [selectedMapYear, setSelectedMapYear] = useState('2020')
  const [selectedBuildupYear, setSelectedBuildupYear] = useState('2020')
  const [mapZoom, setMapZoom] = useState(10)
  
  // Function to handle opening the explorer
  const navigateToExplorer = () => {
    router.push('/explorer')
  };
  
  const handleZoom = (direction: string) => {
    // ...existing code...
    if (direction === '+1' && mapZoom < 20) {
      setMapZoom(prev => prev + 1)
    } else if (direction === '-1' && mapZoom > 1) {
      setMapZoom(prev => prev - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // ...existing code...
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      if (formData.businessCategory) {
        params.append('category', formData.businessCategory)
      }
      if (formData.targetCity) {
        params.append('city', formData.targetCity)
      }
      if (formData.budget) {
        params.append('maxBudget', formData.budget)
      }

      const response = await fetch(`/api/locations?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data)
      setShowFormDialog(false)
    } catch (err) {
      setError('Failed to fetch locations. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const BusinessLocationForm = () => (
    <Card className="border-0 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gray-50 rounded-t-xl border-b border-gray-100 py-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 rounded-lg">
              <Search className="w-5 h-5" />
            </div>
            <CardTitle className="text-2xl font-bold">Find Your Ideal Business Location</CardTitle>
          </div>
          {showFormDialog && (
            <button 
              onClick={() => setShowFormDialog(false)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <CardDescription className="text-gray-600 text-base mt-2">
          Enter your business details to get optimized location recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <form 
          onSubmit={handleSubmit} 
          className="space-y-8 bg-white p-8 rounded-b-xl"
        >
          {/* ...existing code... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="font-medium text-gray-700 text-base">Business Category</Label>
              <Select 
                onValueChange={(value) => setFormData({...formData, businessCategory: value})}
              >
                <SelectTrigger className="w-full bg-white shadow-sm border-gray-200 h-12 rounded-lg focus:ring-offset-black">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-gray-700 text-base">Business Name</Label>
              <Input 
                type="text" 
                placeholder="Enter Business Name"
                className="bg-white shadow-sm border-gray-200 h-12 rounded-lg focus:ring-black"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-gray-700 text-base">Target City</Label>
              <Input 
                type="text" 
                placeholder="Desired City"
                className="bg-white shadow-sm border-gray-200 h-12 rounded-lg focus:ring-black"
                value={formData.targetCity}
                onChange={(e) => setFormData({...formData, targetCity: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <Label className="font-medium text-gray-700 text-base">Budget</Label>
              <Input 
                type="number" 
                placeholder="Maximum Budget"
                className="bg-white shadow-sm border-gray-200 h-12 rounded-lg focus:ring-black"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-black hover:bg-gray-800 text-white px-10 py-6 rounded-lg flex items-center text-lg font-medium transition-all duration-300 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Find Optimal Locations
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Enhanced Hero Section with gradient overlay and pattern */}
      <section className="relative py-24 overflow-hidden bg-black">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full bg-[url('/grid-pattern.svg')] bg-center"></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-90"></div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Locate<span className="text-gray-100">Pro</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300 leading-relaxed">
              Find the optimal business location with data-driven insights and advanced geospatial analytics
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={navigateToExplorer}
                className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-6 rounded-lg text-lg font-medium transition-all shadow-xl hover:shadow-2xl"
              >
                <Search className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                onClick={() => setShowFormDialog(true)} // Changed to open form dialog
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white px-8 py-6 rounded-lg text-lg font-medium transition-all"
              >
                <Map className="mr-2 h-5 w-5" />
                Search Locations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with improved spacing and visual hierarchy */}
      <div className="container mx-auto px-6 py-12 mb-16 max-w-7xl">
        {/* Standard content - without tabs */}
        <div className="space-y-16 animate-in fade-in-50 duration-500">
          {(searchResults.length > 0 || error) && (
            <div className="animate-in fade-in-50 duration-500">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold">Search Results</h3>
                <p className="text-gray-600 mb-6">
                  {searchResults.length 
                    ? `We found ${searchResults.length} potential locations for your business`
                    : 'Your search did not return any results. Please try different criteria.'}
                </p>
                <Button onClick={() => setShowFormDialog(true)} className="bg-black hover:bg-gray-800 text-white">
                  Refine Search
                </Button>
              </div>
              {searchResults.length > 0 && <SearchResults results={searchResults} />}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg my-8 shadow-sm animate-in slide-in-from-top duration-300">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{error}</p>
                      <p className="text-xs mt-1">Please adjust your search criteria and try again.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Location Intelligence Dashboard</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore our comprehensive data visualization tools to make informed business location decisions.
              </p>
              
              {!searchResults.length && !error && (
                <Button 
                  onClick={navigateToExplorer}
                  className="mt-6 bg-black hover:bg-gray-800 text-white px-8 py-3"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Start Location Search
                </Button>
              )}
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* ...existing code... */}
              {[
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "Market Analysis",
                  description: "Gain insights on market saturation, customer demographics, and competitive landscape."
                },
                {
                  icon: <Map className="w-6 h-6" />,
                  title: "Geographic Insights",
                  description: "Visualize spatial data patterns to identify prime locations for your business."
                },
                {
                  icon: <Layers className="w-6 h-6" />,
                  title: "Comparative Analysis",
                  description: "Compare multiple locations side by side to make data-driven decisions."
                }
              ].map((item, idx) => (
                <Card 
                  key={idx} 
                  className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-4 bg-gray-100 p-3 rounded-full inline-flex">
                      <div className="text-black">
                        {item.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Heatmaps Section */}
            <Card className="border-0 shadow-xl mb-16 overflow-hidden">
              {/* ...existing code... */}
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b border-gray-100 py-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Location Analysis Heatmaps</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Visualize critical data patterns to identify high-potential business areas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
                      <div className="relative">
                        <Image
                          src="/nextAPPHeatmaps/ntl.png"
                          alt="Nighttime Light Intensity Heatmap"
                          width={600}
                          height={350}
                          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="inline-block bg-amber-500 text-black px-2 py-0.5 rounded text-sm font-medium mb-1">Advanced Feature</span>
                          <h4 className="font-bold text-lg">Night-Time Light Analysis</h4>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-5 font-semibold text-center text-lg">Night-Time Light Analysis</h3>
                    <p className="text-gray-600 text-center mt-2 max-w-md mx-auto">
                      Identifies areas with high economic activity based on nighttime illumination
                    </p>
                  </div>
                  
                  <div className="group">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl">
                      <div className="relative">
                        <Image
                          src="/nextAPPHeatmaps/ntl.png"
                          alt="Business Concentration Heatmap"
                          width={600}
                          height={350}
                          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="inline-block bg-blue-500 text-black px-2 py-0.5 rounded text-sm font-medium mb-1">Key Insight</span>
                          <h4 className="font-bold text-lg">Business Concentration Analysis</h4>
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-5 font-semibold text-center text-lg">Business Concentration Analysis</h3>
                    <p className="text-gray-600 text-center mt-2 max-w-md mx-auto">
                      Shows existing business density to identify gaps and opportunities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buildup Index Section */}
            <Card className="border-0 shadow-xl mb-16 overflow-hidden">
              {/* ...existing code... */}
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b border-gray-100 py-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Buildup Index Analysis</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Track urban development patterns over time to identify growth areas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="mb-8">
                  <div className="flex justify-center p-1.5 bg-gray-100 rounded-lg">
                    <Button 
                      onClick={() => setSelectedBuildupYear('2020')}
                      variant="ghost"
                      className={cn(
                        "px-8 py-3 rounded-md transition-all",
                        selectedBuildupYear === '2020' ? "bg-black text-white shadow-md" : "text-gray-700"
                      )}
                    >
                      2020 Data
                    </Button>
                    <Button 
                      onClick={() => setSelectedBuildupYear('2024')}
                      variant="ghost"
                      className={cn(
                        "px-8 py-3 rounded-md transition-all",
                        selectedBuildupYear === '2024' ? "bg-black text-white shadow-md" : "text-gray-700"
                      )}
                    >
                      2024 Data
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-lg">
                    <div className="relative h-[500px] transition-all duration-500">
                      <Image
                        src={selectedBuildupYear === '2020' ? 
                          "/nextAPPHeatmaps/ndvi-2020.bmp" : 
                          "/nextAPPHeatmaps/ndvi-2024.bmp"
                        }
                        alt={`Buildup Index ${selectedBuildupYear}`}
                        fill
                        sizes="(max-width: 768px) 90vw, 1000px"
                        priority
                        style={{ 
                          objectFit: "cover",
                          objectPosition: "center",
                          transition: "opacity 0.5s ease-in-out"
                        }}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="font-medium text-lg">
                    {selectedBuildupYear === '2020' 
                      ? 'Urban development patterns in 2020' 
                      : 'Current urban development patterns (2024)'}
                  </p>
                  <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                    This analysis highlights areas experiencing rapid development and infrastructure growth,
                    helping you identify emerging business opportunities.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-8 py-4">
                <p className="text-sm text-gray-500 w-full text-center">
                  Data sourced from satellite imagery and updated quarterly
                </p>
              </CardFooter>
            </Card>

            {/* Dynamic Map Section */}
            <Card className="border-0 shadow-xl mb-16 overflow-hidden">
              {/* ...existing code... */}
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b border-gray-100 py-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <Map className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Interactive Business Opportunity Heatmap</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  Explore potential locations with our interactive heatmap visualization.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white">
                <div className="mb-8">
                  <div className="flex justify-center p-1.5 bg-gray-100 rounded-lg">
                    <Button 
                      onClick={() => setSelectedMapYear('2020')}
                      variant="ghost"
                      className={cn(
                        "px-8 py-3 rounded-md transition-all",
                        selectedMapYear === '2020' ? "bg-black text-white shadow-md" : "text-gray-700"
                      )}
                    >
                      2020 Data
                    </Button>
                    <Button 
                      onClick={() => setSelectedMapYear('2024')}
                      variant="ghost"
                      className={cn(
                        "px-8 py-3 rounded-md transition-all",
                        selectedMapYear === '2024' ? "bg-black text-white shadow-md" : "text-gray-700"
                      )}
                    >
                      2024 Data
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <div className="relative h-[550px] rounded-xl border border-gray-100">
                    <MapWrapper year={selectedMapYear} />
                    
                    <div className="absolute bottom-6 right-6 bg-white rounded-md shadow-lg p-2 z-10 border border-gray-100">
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleZoom('+1')}
                          className="bg-gray-100 hover:bg-gray-200 text-black h-10 w-10 p-0 rounded-md"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleZoom('-1')}
                          className="bg-gray-100 hover:bg-gray-200 text-black h-10 w-10 p-0 rounded-md"
                        >
                          <MinusIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <p className="font-medium text-lg">
                    {selectedMapYear === '2020' 
                      ? 'Business density data from 2020' 
                      : 'Current business density data (2024)'}
                  </p>
                  <div className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-32 h-5 bg-gradient-to-r from-green-300 via-yellow-300 to-red-500 rounded-sm mr-3"></div>
                    <span className="text-sm font-medium">Low to high density</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-8 py-4 flex justify-center">
                <Button 
                  onClick={navigateToExplorer}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Open Full Map Explorer
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Business Location Form Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="max-w-4xl p-0 rounded-xl overflow-hidden">
          <BusinessLocationForm />
        </DialogContent>
      </Dialog>
      
      {/* Quick Action Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <div 
          onClick={() => setShowFormDialog(true)}
          className="bg-black text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
        >
          <Search className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

