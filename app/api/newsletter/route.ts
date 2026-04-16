import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  let body: { email?: string; tcpaConsent?: boolean; source?: string; targetZip?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toString().trim()
  const tcpaConsent = body.tcpaConsent === true
  const source = body.source?.toString().trim() || 'website'
  const targetZip = body.targetZip?.toString().trim() || null

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }

  try {
    const supabase = await createServerClient()

    // Check for existing newsletter signup to avoid duplicates
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .eq('form_type', 'newsletter')
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already subscribed' }, { status: 200 })
    }

    const { error } = await supabase.from('leads').insert({
      first_name: '',
      last_name: '',
      email,
      form_type: source === 'nashbuilds_alert' ? 'nashbuilds_alert' : 'newsletter',
      source,
      interest: source === 'nashbuilds_alert' ? 'new_construction' : 'newsletter',
      tcpa_consent: tcpaConsent,
      tcpa_consent_at: tcpaConsent ? new Date().toISOString() : null,
      page_url: request.headers.get('referer') || null,
      form_data: targetZip ? { target_zip: targetZip } : {},
    })

    if (error) {
      console.error('[newsletter] supabase insert failed', error.message)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }
  } catch (err) {
    console.error('[newsletter] supabase client failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
