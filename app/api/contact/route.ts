import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, message } = await request.json()

    // Validate required fields
    if (!fullName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Extract first and last name from full name
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Check if lead already exists in leads table
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single()

    // If lead doesn't exist, create it
    if (!existingLead) {
      const { error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            created_at: new Date().toISOString()
          }
        ])

      if (leadError) {
        console.error('Error inserting lead:', leadError)
        return NextResponse.json(
          { error: 'Failed to save lead information' },
          { status: 500 }
        )
      }
    }

    // Insert contact form submission
    const { error: formError } = await supabase
      .from('contact_forms')
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          message: message,
          status: 'pending',
          created_at: new Date().toISOString(),
          completed_at: null
        }
      ])

    if (formError) {
      console.error('Error inserting contact form:', formError)
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Contact form submitted successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}