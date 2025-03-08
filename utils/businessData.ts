export interface BusinessLocation {
  latitude: number;
  longitude: number;
  type: string;
  title: string;
  rating?: number | undefined;
}

export const BUSINESS_TYPES: { [key: string]: string } = {
  'bakeries': 'Bakery',
  'coffeeshops': 'Cafe',
  'hospitals': 'Healthcare',
  'malls': 'Shopping Mall',
  'pizzashops': 'Restaurant',
  'realestate': 'Real Estate',
  'salons': 'Beauty Salon',
  'schools': 'Education',
  'supermarkets': 'Retail'
};

export const BUSINESS_COLORS: { [key: string]: string } = {
  'Bakery': '#FF6B6B',
  'Cafe': '#C3A6A0',
  'Healthcare': '#45B7D1',
  'Shopping Mall': '#4ECDC4',
  'Restaurant': '#FF8C42',
  'Real Estate': '#95A5A6',
  'Beauty Salon': '#FFE66D',
  'Education': '#96CEB4',
  'Retail': '#2ECC71',
  'default': '#666666'
};

export const LAHORE_CENTER = { lat: 31.5204, lng: 74.3587 };

export const LAHORE_BOUNDS = {
  north: 31.6354,
  south: 31.4018,
  east: 74.5019,
  west: 74.2284,
};

export async function loadBusinessData(): Promise<BusinessLocation[]> {
  const fileNames = [
    'bakeries-ratings.csv',
    'coffeeshops-ratings.csv',
    'hospitals-ratings.csv',
    'malls-ratings.csv',
    'pizzashops-ratings.csv',
    'realestate-ratings.csv',
    'salons-ratings.csv',
    'schools-ratings.csv',
    'supermarkets-ratings.csv'
  ];

  try {
    const allLocations: BusinessLocation[] = [];

    for (const fileName of fileNames) {
      try {
        // Load CSV file from the public/csv directory
        const response = await fetch(`/csv/${fileName}`);
        if (!response.ok) {
          console.warn(`Failed to load ${fileName}: ${response.statusText}`);
          continue;
        }

        const text = await response.text();
        
        // Split into lines and remove empty ones
        const lines = text.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Skip empty files
        if (lines.length <= 1) {
          console.warn(`Empty or invalid file: ${fileName}`);
          continue;
        }

        // Parse CSV with proper quote handling
        const rows = lines.map(line => {
          const values = [];
          let inQuote = false;
          let currentValue = '';
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim());
          return values;
        });

        // Get headers and validate required columns exist
        const headers = rows[0].map(h => h.replace(/^"|"$/g, ''));
        const latIndex = headers.findIndex(h => h.includes('location/lat'));
        const lngIndex = headers.findIndex(h => h.includes('location/lng'));
        const titleIndex = headers.findIndex(h => h === 'title');
        const ratingIndex = headers.findIndex(h => h === 'totalScore');

        if (latIndex === -1 || lngIndex === -1 || titleIndex === -1) {
          console.error(`Missing required columns in ${fileName}`);
          continue;
        }

        // Get business type from filename
        const businessType = fileName.split('-')[0];
        const mappedType = BUSINESS_TYPES[businessType as keyof typeof BUSINESS_TYPES];

        console.log(`Processing ${fileName} as type ${mappedType}`);

        // Process data rows
        const locations = rows.slice(1)
          .map(row => {
            try {
              const lat = parseFloat(row[latIndex]);
              const lng = parseFloat(row[lngIndex]);
              const title = row[titleIndex];
              const rating = ratingIndex >= 0 ? parseFloat(row[ratingIndex]) : undefined;

              if (isNaN(lat) || isNaN(lng)) {
                return null;
              }

              return {
                latitude: lat,
                longitude: lng,
                type: mappedType,
                title: title || mappedType,
                rating: rating !== undefined && !isNaN(rating) ? rating : undefined
              };
            } catch (e) {
              console.warn(`Error processing row in ${fileName}:`, e);
              return null;
            }
          })
          .filter((loc): loc is NonNullable<typeof loc> => 
            loc !== null &&
            typeof loc === 'object' &&
            'latitude' in loc &&
            'longitude' in loc &&
            loc.latitude >= LAHORE_BOUNDS.south &&
            loc.latitude <= LAHORE_BOUNDS.north &&
            loc.longitude >= LAHORE_BOUNDS.west &&
            loc.longitude <= LAHORE_BOUNDS.east
          );

        console.log(`Loaded ${locations.length} locations from ${fileName}`);
        allLocations.push(...locations);

      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
      }
    }

    console.log('Total locations loaded:', allLocations.length);
    console.log('Locations by type:', 
      Object.fromEntries(
        Object.values(BUSINESS_TYPES).map(type => 
          [type, allLocations.filter(l => l.type === type).length]
        )
      )
    );

    return allLocations;

  } catch (error) {
    console.error('Error loading business data:', error);
    return [];
  }
}
