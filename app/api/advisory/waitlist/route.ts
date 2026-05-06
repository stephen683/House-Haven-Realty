import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { ADVISORY_TRACKS } from '@/lib/advisory-config'

export const runtime = 'nodejs'

const VALID_TRACKS = new Set(ADVISORY_TRACKS.map((t) => t.slug as string))

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: {
    email?: string
    track?: string | null
    source?: string
    tcpaConsent?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toString().trim().toLowerCase()
  const track = body.track && VALID_TRACKS.has(body.track) ? body.track : null
  const source = body.source?.toString().trim() || 'advisory_book_placeholder'
  const tcpaConsent = body.tcpaConsent === true

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }

  try {
    const supabase = await createServerClient()

    const { data: existing } = await supabase
      .from('advisory_book_waitlist')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already on the list' }, { status: 200 })
    }

    const { error } = await supabase.from('advisory_book_waitlist').insert({
      email,
      track,
      source,
      tcpa_consent: tcpaConsent,
      tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
      page_url: request.headers.get('referer') || null,
    })

    if (error) {
      console.error('[advisory/waitlist] supabase insert failed', error.message)
      return NextResponse.json({ error: 'Failed to add you to the list.' }, { status: 500 })
    }
  } catch (err) {
    console.error('[advisory/waitlist] supabase client failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
