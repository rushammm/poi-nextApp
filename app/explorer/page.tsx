'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BusinessLocationOptimizerComponent } from '@/components/business-location-optimizer'
import { useDebounce } from '@/hooks/use-debounce'
//import { Card } from '@/components/ui/card'
import { POI } from '@/types/poi'
import { motion } from 'framer-motion'

export default function ExplorerPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<POI[]>([])
  const [displayedResults, setDisplayedResults] = useState<POI[]>([])
  const [resultsPerPage] = useState(6)
const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const searchBusinesses = async () => {
      if (!debouncedSearch) {
        setSearchResults([])
        setDisplayedResults([])
        return
      }

      setIsSearching(true)
      try {
        const params = new URLSearchParams()
        params.append('query', debouncedSearch)
        
        const response = await fetch(`/api/search?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Search failed')
        }

        const data = await response.json()
        if (data && data.results) {
          setSearchResults(data.results)
          setDisplayedResults(data.results.slice(0, resultsPerPage))
        }
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
        setDisplayedResults([])
      } finally {
        setIsSearching(false)
      }
    }

    searchBusinesses()
  }, [debouncedSearch, resultsPerPage])

  const handleSeeMore = () => {
    const currentLength = displayedResults.length
    const nextResults = searchResults.slice(0, currentLength + resultsPerPage)
    setDisplayedResults(nextResults)
  }

  const handleShowLess = () => {
    setDisplayedResults(searchResults.slice(0, resultsPerPage))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-black hover:bg-white/50 backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Title Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-black mb-4">
            Location Explorer
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Use our interactive tools to analyze potential business locations
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1 group">
              <Input
                type="text"
                placeholder="Search for business branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 h-14 bg-white shadow-lg rounded-xl border-gray-200 transition-all duration-300 focus:shadow-gray-200 focus:border-black"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
            </div>
            {isSearching && (
              <Loader2 className="absolute right-20 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-black" />
            )}
            <Button 
              onClick={() => setSearchQuery('')}
              variant="outline"
              className="h-14 px-6 hover:bg-black hover:text-white transition-all duration-300 rounded-xl border-gray-200 hover:border-black"
            >
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Search Results Section */}
        {displayedResults.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-black">Found Locations</h2>
              <p className="text-sm bg-gray-100 px-4 py-2 rounded-full text-gray-600">
                Showing {displayedResults.length} of {searchResults.length} results
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResults.map((result) => (
                <motion.div 
                  key={result.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold truncate mb-1 text-black">
                          {result.title}
                        </h3>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize inline-block">
                          {result.type || result.categoryName || 'Business'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-grow bg-gradient-to-b from-transparent to-gray-50 rounded-b-xl">
                    <p className="text-sm text-gray-600 break-words leading-relaxed">
                      {result.address}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination buttons */}
            <div className="flex justify-center mt-8 gap-4">
              {displayedResults.length > resultsPerPage && (
                <Button
                  onClick={handleShowLess}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-all duration-300 border border-gray-200"
                >
                  Show Less
                </Button>
              )}
              {searchResults.length > displayedResults.length && (
                <Button
                  onClick={handleSeeMore}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Show More Results
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* <AnimatePresence>
          <div className="flex justify-center gap-4 mt-8">
            {hasMore && (
              <Button
                onClick={handleShowMore}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                Show More
              </Button>
            )}
            {visibleResults > 10 && (
              <Button
                onClick={handleShowLessPagination}
                className="bg-gray-200 hover:bg-gray-300 text-black px-8"
              >
                Show Less
              </Button>
            )}
          </div>
        </AnimatePresence> */}

        {/* Existing BusinessLocationOptimizer Component */}
        <BusinessLocationOptimizerComponent />
      </div>
    </div>
  )
}


