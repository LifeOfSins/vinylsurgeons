import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('API initialized with Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Using Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No (using anon key)')

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json()
    const { id } = await params

    console.log('PATCH request received:', { id, status })

    if (!status || !['pending', 'completed'].includes(status)) {
      console.log('Invalid status provided:', status)
      return NextResponse.json(
        { error: 'Invalid status. Must be "pending" or "completed"' },
        { status: 400 }
      )
    }

    // First, check if the record exists
    console.log('Checking if contact form exists with ID:', id)
    const { data: existingData, error: fetchError } = await supabase
      .from('contact_forms')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Existing record:', existingData)
    console.log('Fetch error:', fetchError)

    if (fetchError) {
      console.error('Error fetching existing record:', fetchError)
      return NextResponse.json(
        { error: 'Contact form not found', details: fetchError.message },
        { status: 404 }
      )
    }

    console.log('Attempting to update contact form with ID:', id)
    
    const { data, error } = await supabase
      .from('contact_forms')
      .update({ status })
      .eq('id', id)
      .select()

    console.log('Supabase update result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update contact form', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      console.log('No data returned from update - contact form not found')
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 }
      )
    }

    console.log('Status updated successfully:', data[0])
    return NextResponse.json({ 
      message: 'Status updated successfully', 
      data: data[0] 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('contact_forms')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete contact form' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Contact form deleted successfully' 
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}