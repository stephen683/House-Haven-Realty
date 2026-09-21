import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { screenSubmission } from '@/lib/spam-guard'

export const runtime = 'nodejs'

interface ValuationPayload {
  /** Honeypot: hidden in the form, so any value means a machine filled it. */
  company_website?: string
  /** Epoch ms the form rendered, used to reject inhuman fill times. */
  formLoadedAt?: number
  address?: string
  city?: string
  zip?: string
  name?: string
  email?: string
  phone?: string
  timeline?: string
  tcpaConsent?: boolean
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { first: parts[0], last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, LIMITS.valuation)
  if (!limited.allowed) return tooManyRequests(LIMITS.valuation)

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

  const screen = screenSubmission({
    name, email: body.email?.toString().trim(),
    honeypot: body.company_website,
    formLoadedAt: body.formLoadedAt,
  })
  if (screen.spam) {
    console.info('[valuation] rejected:', screen.rule, '·', screen.detail)
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const email = body.email?.toString().trim()
  const phone = body.phone?.toString().trim() || null
  const timeline = body.timeline?.toString().trim() || null
  const tcpaConsent = body.tcpaConsent === true

  if (!address || !zip || !name || !email) {
    return NextResponse.json(
      { error: 'Address, ZIP, name, and email are required.' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const { first, last } = splitName(name)
  const fullAddress = `${address}, ${city}, TN ${zip}`

  // Write to unified leads table
  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('leads').insert({
      first_name: first,
      last_name: last,
      email,
      phone,
      form_type: 'valuation',
      source: 'website',
      interest: 'selling',
      timeline,
      property_address: fullAddress,
      tcpa_consent: tcpaConsent,
      tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
      page_url: request.headers.get('referer') || null,
      form_data: { address, city, state: 'TN', zip },
    })
    if (error) console.error('[valuation] supabase insert failed', error.message)
  } catch (err) {
    console.error('[valuation] supabase client failed', err)
  }

  // Notify Stephen via Resend if configured
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
            `Address: ${fullAddress}`,
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
