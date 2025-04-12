'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import type { POI } from '@/types/poi'
import { MapModal } from '@/components/map-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const POI_TYPES = [
  { value: "poi", label: "Restaurants" },
  { value: "banks", label: "Banks" },
  { value: "hospitals", label: "Hospitals" },
  { value: "bakeries", label: "Bakeries" },
  { value: "farmhouses", label: "Farmhouses" },
  { value: "malls", label: "Malls" },
  { value: "schools", label: "Schools" },
  { value: "salons", label: "Salons" },
  { value: "supermarkets", label: "Supermarkets" },
  { value: "eventComplexes", label: "EventComplexes" },
  { value: "icecreamShops", label: "Icecream Shops" },
  { value: "pizzaShops", label: "Pizza Shops" }
]

export function BusinessLocationOptimizerComponent() {
  // const [formData, setFormData] = useState({
  //   businessName: '',
  //   businessType: '',
  //   currentLocation: '',
  //   targetCity: '',
  //   budget: '',
  // })
 // const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pois, setPois] = useState<POI[]>([])
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);
  const [selectedPoiType, setSelectedPoiType] = useState("banks")
  const [visibleDropdownResults, setVisibleDropdownResults] = useState(10)
  
  const handleShowMoreDropdown = () => {
    setVisibleDropdownResults(prev => prev + 10)
  }

  const handleShowLessDropdown = () => {
    setVisibleDropdownResults(10)
  }

  useEffect(() => {
    const fetchPOIs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/${selectedPoiType}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPois(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load POIs')
        setPois([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPOIs()
  }, [selectedPoiType])



  

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">POI Explorer</h1>
          <p className="text-gray-600">Explore Points of Interest</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Select value={selectedPoiType} onValueChange={setSelectedPoiType}>
              <SelectTrigger>
                <SelectValue placeholder="Select POI type" />
              </SelectTrigger>
              <SelectContent>
                {POI_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <p>Loading POIs...</p>
            </CardContent>
          </Card>
        ) : pois.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p>No POIs found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pois.slice(0, visibleDropdownResults).map((poi) => (
              <Card key={poi.id}>
                <CardHeader>
                  <CardTitle>{poi.title}</CardTitle>
                  <CardDescription>{poi['categories/0']}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Rating</Label>
                      <p>{poi.hotelStars || '-'}</p>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <p>
                        {poi['location/lat'] && poi['location/lng'] ? (
                          <button
                            onClick={() => setSelectedLocation({
                              lat: poi['location/lat']!,
                              lng: poi['location/lng']!,
                              title: poi.title
                            })}
                            className="text-blue-500 hover:underline"
                          >
                            View on map
                          </button>
                        ) : (
                          'Location not available'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {pois.length > 10 && (
              <div className="flex justify-center gap-4 mt-8">
                {pois.length > visibleDropdownResults && (
                  <Button
                    onClick={handleShowMoreDropdown}
                    className="bg-black hover:bg-gray-800 text-white px-8"
                  >
                    Show More Results
                  </Button>
                )}
                {visibleDropdownResults > 10 && (
                  <Button
                    onClick={handleShowLessDropdown}
                    className="bg-gray-200 hover:bg-gray-300 text-black px-8"
                  >
                    Show Less
                  </Button>
                )}
              </div>
            )}
            
            {selectedLocation && (
              <MapModal
                isOpen={!!selectedLocation}
                onClose={() => setSelectedLocation(null)}
                lat={selectedLocation.lat}
                lng={selectedLocation.lng}
                title={selectedLocation.title}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
