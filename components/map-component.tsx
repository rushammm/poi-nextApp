'use client'

import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { Loader2 } from 'lucide-react'
import { fixLeafletIcon } from './leaflet-setup'
import { BusinessLocation, BUSINESS_COLORS, LAHORE_CENTER, LAHORE_BOUNDS} from '@/utils/businessData'
import { loadBusinessData } from '@/utils/businessData'
import L from 'leaflet'
import 'leaflet.heat'
import { useMap } from 'react-leaflet'

declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: { [key: number]: string };
    }
  ): L.Layer;
}

// Dynamic imports for Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

const Rectangle = dynamic(
  () => import('react-leaflet').then(mod => mod.Rectangle),
  { ssr: false }
)

// HeatmapLayer component that uses useMap hook
function HeatmapLayer({ points }: { points: Array<[number, number, number]> }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.4: 'blue',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    }).addTo(map);

    return () => {
      if (map && heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points]);

  return null;
}

// Main map component
function MapContent() {
  const [locations, setLocations] = useState<BusinessLocation[]>([])
  const [heatmapPoints, setHeatmapPoints] = useState<Array<[number, number, number]>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fixLeafletIcon();
    
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await loadBusinessData() // load business data
        setLocations(data)
        
        // Create heatmap points
        const densityMap = new Map<string, number>()
        data.forEach(loc => {
          const key = `${loc.latitude},${loc.longitude}`
          densityMap.set(key, (densityMap.get(key) || 0) + 1)
        })
        
        const points = Array.from(densityMap.entries()).map(([key, count]) => {
          const [lat, lng] = key.split(',').map(Number)
          return [lat, lng, Math.min(count / 10, 1)] as [number, number, number]
        })
        
        setHeatmapPoints(points)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Memoize the icon creation function
  const createCustomIcon = useMemo(() => (type: string, rating?: number) => {
    const color = BUSINESS_COLORS[type] || BUSINESS_COLORS.default;
    const size = rating ? Math.max(8, Math.min(rating * 2.5, 20)) : 10;
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          opacity: ${rating ? 0.7 + (rating / 50) : 0.7};
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -(size/2)]
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[LAHORE_CENTER.lat, LAHORE_CENTER.lng]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Rectangle 
          bounds={[
            [LAHORE_BOUNDS.south, LAHORE_BOUNDS.west],
            [LAHORE_BOUNDS.north, LAHORE_BOUNDS.east]
          ]}
          pathOptions={{ color: 'black', weight: 1, fillOpacity: 0 }}
        />

        {locations.length > 0 && <HeatmapLayer points={heatmapPoints} />}

        {locations.map((location, index) => (
          <Marker
            key={`${location.type}-${index}-${location.latitude}-${location.longitude}`}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon(location.type, location.rating)}
          >
            <Popup>
              <div className="p-2">
                <p className="font-medium">{location.title}</p>
                <p className="text-sm text-gray-600">{location.type}</p>
                {location.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-yellow-600 font-medium">
                      {location.rating.toFixed(1)}
                    </span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Updated Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <div className="text-sm font-medium mb-3">Business Types</div>
        {Object.entries(BUSINESS_COLORS).map(([type, color]) => {
          if (type === 'default') return null;
          const count = locations.filter(l => l.type === type).length;
          
          return (
            <div key={type} className="flex items-center gap-2 text-sm mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span>{type}</span>
              <span className="text-gray-500 text-xs">
                ({count})
              </span>
            </div>
          );
        })}
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
          Marker size indicates rating
        </div>
      </div>
    </div>
  )
}

// Wrap the component with dynamic import
const MapWithNoSSR = dynamic(() => Promise.resolve(MapContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  ),
})

// Export the wrapped component
export default function MapComponent() {
  return <MapWithNoSSR />
}
