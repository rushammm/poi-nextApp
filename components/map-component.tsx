'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Loader2 } from 'lucide-react'
import type { LatLngExpression } from 'leaflet'
import { fixLeafletIcon, setupLeafletMap } from './leaflet-setup'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
)

// Type for map props
interface MapComponentProps {
  year: string
}

// Create a dynamic HeatmapLayer component
const HeatmapLayer = dynamic(() => import('./heatmap-layer'), { ssr: false })

export default function MapComponent({ year }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Update center coordinates to Lahore, Pakistan
  const [center] = useState<LatLngExpression>([31.5204, 74.3587])
  const [zoom] = useState(11) // Slightly adjust zoom level for Lahore
  const [isLoading, setIsLoading] = useState(true)
  const [heatmapData, setHeatmapData] = useState<Array<[number, number, number]>>([])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    mapRef.current = setupLeafletMap(mapContainerRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    // Fix Leaflet icon issue
    fixLeafletIcon();
    
    // Simulate loading different heatmap data based on selected year
    const fetchHeatmapData = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate different heatmap data based on year for Lahore, Pakistan
      // Format: [lat, lng, intensity]
      if (year === '2020') {
        setHeatmapData([
          // Central Lahore
          [31.5204, 74.3587, 0.9], // City center - highest intensity
          [31.5304, 74.3487, 0.8], // North of center
          [31.5104, 74.3687, 0.7], // East of center
          
          // Main Commercial Areas
          [31.5160, 74.3290, 0.85], // Mall Road area
          [31.5710, 74.3415, 0.6],  // Gulberg
          [31.4700, 74.2650, 0.55], // Defence Housing Authority
          
          // Old City areas
          [31.5830, 74.3142, 0.75], // Walled City / Androon Shehr
          [31.5847, 74.3098, 0.7],  // Badshahi Mosque area
          
          // Additional areas
          [31.4705, 74.4100, 0.5],  // Cantt area
          [31.5290, 74.3420, 0.65], // Anarkali
          [31.5480, 74.3380, 0.6],  // Railway Station area
          [31.5320, 74.3510, 0.7],  // Mall of Lahore area
        ])
      } else {
        // 2024 data - different distribution showing development changes
        setHeatmapData([
          // Central Lahore - slightly reduced
          [31.5204, 74.3587, 0.75], // City center - reduced from 2020
          [31.5304, 74.3487, 0.7],  // North of center
          
          // Growing areas - increased intensity
          [31.4700, 74.2650, 0.9],  // Defence Housing Authority - now higher
          [31.4720, 74.2750, 0.85], // Defence Phase V
          [31.5070, 74.2680, 0.8],  // Bahria Town
          [31.4460, 74.2841, 0.85], // DHA Phase 6
          
          // IT Corridor - new development
          [31.4705, 74.4210, 0.7],  // New IT Park area
          [31.4750, 74.4300, 0.75], // Tech Zone
          
          // Traditional areas - slightly reduced
          [31.5830, 74.3142, 0.6],  // Walled City / Androon Shehr - reduced
          [31.5847, 74.3098, 0.55], // Badshahi Mosque area - reduced
          
          // New commercial developments
          [31.5710, 74.3715, 0.9],  // Gulberg III - increased 
          [31.5630, 74.3660, 0.8],  // MM Alam Road
          [31.5180, 74.3510, 0.7],  // Mall Road - maintained
          
          // Additional modern areas
          [31.4180, 74.2570, 0.85], // Bahria Orchard
          [31.3990, 74.2340, 0.7],  // LDA City
        ])
      }
      
      setIsLoading(false)
    }

    fetchHeatmapData()
  }, [year])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div ref={mapContainerRef} className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {/* Render heatmap layer */}
        <HeatmapLayer 
          points={heatmapData}
          longitudeExtractor={m => m[1]}
          latitudeExtractor={m => m[0]}
          intensityExtractor={m => m[2]} 
          radius={20}
          blur={15}
          maxZoom={18}
        />
      </MapContainer>
    </div>
  )
}
