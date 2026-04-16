import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface ValuationPayload {
  address?: string
  city?: string
  zip?: string
  name?: string
  email?: string
  phone?: string
  timeline?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: ValuationPayload
  try {
    body = (await request.json()) as ValuationPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const address = body.address?.toString().trim()
  const city = body.city?.toString().trim() || 'Nashville'
  const zip = body.zip?.toString().trim()
  const name = body.name?.toString().trim()
  const email = body.email?.toString().trim()
  const phone = body.phone?.toString().trim() || null
  const timeline = body.timeline?.toString().trim() || null

  if (!address || !zip || !name || !email) {
    return NextResponse.json(
      { error: 'Address, ZIP, name, and email are required.' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from('valuation_requests').insert({
      address,
      city,
      state: 'TN',
      zip,
      name,
      email,
      phone,
      timeline,
      source: 'website',
    })
    if (error) console.error('[valuation] supabase insert failed', error.message)
  } catch (err) {
    console.error('[valuation] supabase client failed', err)
  }

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'House Haven Web <notifications@househavenrealty.com>',
          to: ['Stephen@househavenrealty.com'],
          reply_to: email,
          subject: `Home valuation request — ${address}`,
          text: [
            `New CMA request from the House Haven Realty website.`,
            ``,
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            `Address: ${address}, ${city}, TN ${zip}`,
            timeline ? `Timeline: ${timeline}` : null,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })
    } catch (err) {
      console.error('[valuation] resend notify failed', err)
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
