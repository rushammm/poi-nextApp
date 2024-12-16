import type { POI } from '@/types/poi'

export async function fetchPOIs(category?: string): Promise<POI[]> {
  const url = new URL('/api/locations', window.location.origin)
  if (category) {
    url.searchParams.append('category', category)
  }
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch POIs')
  }
  
  return response.json()
}