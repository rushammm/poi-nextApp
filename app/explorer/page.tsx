'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BusinessLocationOptimizerComponent } from '@/components/business-location-optimizer'

export default function ExplorerPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10">
          {/* Back Button */}
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Location Explorer</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use our interactive tools to analyze potential business locations and make data-driven decisions
            </p>
          </div>
        </div>
        
        <BusinessLocationOptimizerComponent />
      </div>
    </div>
  )
}
