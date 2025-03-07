'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
// We need to import this after leaflet import
import 'leaflet.heat'

interface HeatmapLayerProps {
  points: Array<[number, number, number]>
  longitudeExtractor: (p: [number, number, number]) => number
  latitudeExtractor: (p: [number, number, number]) => number
  intensityExtractor: (p: [number, number, number]) => number
  radius?: number
  max?: number
  blur?: number
  maxZoom?: number
}

// Define a more specific type for the heat layer reference
type HeatLayer = L.Layer & { setLatLngs?: (points: [number, number, number][]) => void };

// The actual HeatmapLayer component
export default function HeatmapLayer({
  points,
  longitudeExtractor,
  latitudeExtractor,
  intensityExtractor,
  radius = 30,
  max = 1.0,
  blur = 15,
  maxZoom = 18
}: HeatmapLayerProps) {
  const map = useMap()
  // Now using a more specific type
  const heatLayerRef = useRef<HeatLayer | null>(null)

  useEffect(() => {
    // Convert points to the format expected by leaflet.heat
    // [lat, lng, intensity]
    const latLngPoints = points.map(p => [
      latitudeExtractor(p),
      longitudeExtractor(p),
      intensityExtractor(p)
    ])

    // If we already have a heatmap layer, remove it
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
    }

    // Use a type assertion to tell TypeScript what we're doing
    // @ts-expect-error - Leaflet heat plugin extends L but isn't typed
    const heatLayer = L.heatLayer(latLngPoints, {
      radius,
      blur,
      max,
      maxZoom
    })
    
    heatLayerRef.current = heatLayer.addTo(map)

    // Cleanup on unmount
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
      }
    }
  }, [points, map, longitudeExtractor, latitudeExtractor, intensityExtractor, radius, max, blur, maxZoom])

  // This component doesn't render anything directly
  return null
}
