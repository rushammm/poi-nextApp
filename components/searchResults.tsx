import { Card, CardContent } from '@/components/ui/card'

type POI = {
  id: number
  created_at: string
  title: string
  'categoryName': string
  hotelStars: number
  'location/lat': number
  'location/lng': number
  address: string
}

interface SearchResultsProps {
  results: POI[]
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-black">Search Results</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((location) => (
          <Card 
            key={location.id} 
            className="bg-white hover:bg-gray-100 transition-colors duration-300 border border-gray-300"
          >
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-black mb-2">
                {location.title}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Category:</span> {location['categoryName']}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-semibold">Address:</span> {location.address}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Created:</span> {new Date(location.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

