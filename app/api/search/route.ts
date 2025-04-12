import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
      return NextResponse.json([])
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const [salons, hospitals, banks] = await Promise.all([
      supabase
        .from('salons')
        .select('*')
        .ilike('title', `%${query}%`),
      supabase
        .from('hospitals')
        .select('*')
        .ilike('title', `%${query}%`),
      supabase
        .from('banks')
        .select('*')
        .ilike('title', `%${query}%`)
    ])

    const results = [
      ...(salons.data || []).map(item => ({ ...item, type: 'salon' })),
      ...(hospitals.data || []).map(item => ({ ...item, type: 'hospital' })),
      ...(banks.data || []).map(item => ({ ...item, type: 'bank' }))
    ]

    return NextResponse.json({
      results,
      total: results.length
    })
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
