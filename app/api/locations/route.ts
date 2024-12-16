import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// import type { POI } from '@/types/poi'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const category = searchParams.get('category')

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Start building the query
    let query = supabase
      .from('poi')
      .select(`
        id,
        created_at,
        title,
        categories,
        hotelStars,
        location
      `)

    // Apply category filter if provided
    if (category) {
      // Use containment operator to check if categories array contains the category
      query = query.containedBy('categories', [category])
    }

    // Execute the query
    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}