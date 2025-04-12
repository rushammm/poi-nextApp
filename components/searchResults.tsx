import { POI } from '@/types/poi';
import { MapPin, Loader2, Star } from 'lucide-react';

interface SearchResultsProps {
  results: POI[];
  isLoading?: boolean;
  error?: string | null;
}

export function SearchResults({ results, isLoading, error }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No locations found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((poi) => (
        <div 
          key={poi.id} 
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200"
        >
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold truncate text-gray-900">
                  {poi.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {poi.categoryName || 'Business'}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {poi.hotelStars && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{poi.hotelStars}</span>
                  </div>
                )}
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="mt-1">{poi.address || 'Location not specified'}</p>
              </div>

              {(poi['location/lat'] && poi['location/lng']) && (
                <p className="text-xs text-gray-400 pt-2 border-t">
                  📍 {Number(poi['location/lat']).toFixed(4)}, {Number(poi['location/lng']).toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}