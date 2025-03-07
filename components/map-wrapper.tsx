'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const MapComponent = dynamic(
  () => import('./map-component'),
  { 
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    ),
    ssr: false
  }
)

interface MapWrapperProps {
  year: string;
}

export function MapWrapper({ year }: MapWrapperProps) {
  return <MapComponent year={year} />
}
