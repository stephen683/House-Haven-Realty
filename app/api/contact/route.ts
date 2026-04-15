import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Add validation and contact submission logic
    // - Validate required fields
    // - Store in Supabase
    // - Send email via Resend

    return NextResponse.json(
      { message: 'Contact submission received' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
