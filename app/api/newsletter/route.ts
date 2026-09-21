import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { recordLead } from '@/lib/lead-intake'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { screenSubmission } from '@/lib/spam-guard'

export const runtime = 'nodejs'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, LIMITS.newsletter)
  if (!limited.allowed) return tooManyRequests(LIMITS.newsletter)

  let body: { company_website?: string; formLoadedAt?: number; email?: string; tcpaConsent?: boolean; source?: string; targetZip?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toString().trim()
  const tcpaConsent = body.tcpaConsent === true
  const source = body.source?.toString().trim() || 'website'
  const targetZip = body.targetZip?.toString().trim() || null

  const screen = screenSubmission({
    email,
    honeypot: body.company_website,
    formLoadedAt: body.formLoadedAt,
  })
  if (screen.spam) {
    console.info('[newsletter] rejected:', screen.rule, '·', screen.detail)
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }

  const isPipelineAlert = source === 'pipeline_alert' || source === 'nashbuilds_alert'
  const formType = isPipelineAlert ? 'pipeline_alert' : 'newsletter'

  try {
    const supabase = createServiceClient()
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .eq('form_type', formType)
      .limit(1)
    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: true, message: 'Already subscribed' }, { status: 200 })
    }
  } catch (err) {
    // A failed duplicate check is not a reason to refuse a subscriber; the
    // worst case is a second row, which is cheaper than a lost signup.
    console.error('[newsletter] duplicate check failed', err)
  }

  const label = isPipelineAlert ? 'Nashville Pipeline alert' : 'Newsletter'
  const result = await recordLead({
    formType,
    source,
    email,
    interest: isPipelineAlert ? 'new_construction' : 'newsletter',
    tcpaConsent,
    pageUrl: request.headers.get('referer'),
    formData: targetZip ? { target_zip: targetZip } : {},
    hubspotSource: isPipelineAlert ? 'pipeline_alert' : 'newsletter',
    noteHtml: `<p><strong>${label} signup</strong></p>${
      targetZip ? `<p>Watching ZIP: ${targetZip}</p>` : ''
    }`,
    // This route notified nobody for five months. A brokerage that gets a
    // handful of real signups a month wants to see every one of them.
    alertSubject: `${label} signup — ${email}`,
    alertBody: [
      `New ${label.toLowerCase()} signup.`,
      '',
      `Email: ${email}`,
      targetZip ? `Watching ZIP: ${targetZip}` : null,
      `Source: ${source}`,
    ].filter(Boolean).join('\n'),
  })

  if (!result.saved) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
  return NextResponse.json({ ok: true }, { status: 201 })
}
