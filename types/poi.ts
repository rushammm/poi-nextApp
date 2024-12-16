export interface POI {
  id: number
  created_at: string
  title: string
  'categories/0': string | null
  hotelStars: string | null
  'location/lat': number | null
  'location/lng': number | null
}