export interface POI {
  id: number;
  created_at: string;
  title: string;
  'categories/0': string;
  hotelStars?: number;
  'location/lat': number;
  'location/lng': number;
  categoryName?: string;
  address: string;
  rating?: number;
  description?: string;
  businessType?: string;
  distance?: number;
  type?: 'salon' | 'hospital' | 'bank';  // Add this line
}