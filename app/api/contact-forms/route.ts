import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching contact forms...')
    
    // First, try to check if the table exists and get a count
    const { count, error: countError } = await supabase
      .from('contact_forms')
      .select('*', { count: 'exact', head: true })
    
    console.log('Table count:', count)
    console.log('Count error:', countError)
    
    const { data, error } = await supabase
      .from('contact_forms')
      .select('id, full_name, email, phone, status, message, created_at')
      .order('created_at', { ascending: false })

    console.log('Contact forms data:', data)
    console.log('Contact forms error:', error)

    if (error) {
      console.error('Error fetching contact forms:', error)
      return NextResponse.json(
        { 
          error: 'Failed to fetch contact forms', 
          details: error.message,
          code: error.code,
          hint: error.hint 
        },
        { status: 500 }
      )
    }

    // Return empty array if no data
    const result = data || []
    console.log('Returning data:', result)
    return NextResponse.json(result, { status: 200 })

  } catch (error) {
    console.error('Contact forms fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
