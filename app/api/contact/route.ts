import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

interface ContactPayload {
  name?: string
  email?: string
  phone?: string
  message?: string
  interest?: string
  source?: string
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
  let body: ContactPayload
  try {
    body = (await request.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name?.toString().trim()
  const email = body.email?.toString().trim()
  const message = body.message?.toString().trim()
  const phone = body.phone?.toString().trim() || null
  const source = body.source?.toString().trim() || 'website'
  const interest = body.interest?.toString().trim() || null
  const tcpaConsent = body.tcpaConsent === true

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 },
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const { first, last } = splitName(name)

  // Write to unified leads table
  try {
    const supabase = await createServerClient()
    const { error } = await supabase.from('leads').insert({
      first_name: first,
      last_name: last,
      email,
      phone,
      form_type: 'contact',
      source,
      interest,
      message,
      tcpa_consent: tcpaConsent,
      tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
      page_url: request.headers.get('referer') || null,
    })
    if (error) {
      console.error('[contact] supabase insert failed', error.message)
    }
  } catch (err) {
    console.error('[contact] supabase client failed', err)
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
          subject: `New website lead — ${source}`,
          text: [
            `New lead from the House Haven Realty website.`,
            ``,
            `Source: ${source}`,
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            interest ? `Interested in: ${interest}` : null,
            ``,
            `Message:`,
            message,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })
    } catch (err) {
      console.error('[contact] resend notify failed', err)
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
