'use client'

import { useState, useEffect } from 'react'
import { Building2, Target, AlertCircle } from 'lucide-react'
import type { POI } from '@/types/poi'
import { MapModal } from '@/components/map-modal'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'

// Sample data - In a real app, this would come from your ML model/backend
const sampleScores = {
  "Location A": {
    income: 0.85,
    infrastructure: 0.75,
    population: 0.90,
    competition: 0.60,
    overall: 0.78
  },
  "Location B": {
    income: 0.70,
    infrastructure: 0.85,
    population: 0.65,
    competition: 0.80,
    overall: 0.75
  }
}

const businessTypes = [
  "Restaurant",
  "Retail",
  "Office",
  "Manufacturing",
  "Service",
  "Other"
]

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
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    currentLocation: '',
    targetCity: '',
    budget: '',
  })
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [error, setError] = useState('')
  const [pois, setPois] = useState<POI[]>([]) // Initialize as empty array
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    title: string;
  } | null>(null);
  const [selectedPoiType, setSelectedPoiType] = useState("banks")
  

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
        setPois([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchPOIs()
  }, [selectedPoiType])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      businessType: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowResults(true)
    } catch (err) {
      setError('An error occurred while analyzing locations. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
            {pois.map((poi) => (
              <Card key={poi.id}>
                <CardHeader>
                  <CardTitle>{poi.title}</CardTitle>
                  <CardDescription>{poi['categories/0'] || 'No category'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Hotel Stars</Label>
                      <p>{poi.hotelStars || 'N/A'}</p>
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
