import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import type { POI } from '@/types/poi'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data, error } = await supabase
      .from('banks')
      .select(`
        id,
        title,
        "categoryName",
        price,
        address,
        street,
        rank,
        "location/lat",
        "location/lng"
      `)

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