import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/resend'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { screenSubmission } from '@/lib/spam-guard'

export const runtime = 'nodejs'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RequestBody {
  /** Honeypot: hidden in the form, so any value means a machine filled it. */
  company_website?: string
  /** Epoch ms the form rendered, used to reject inhuman fill times. */
  formLoadedAt?: number
  email?: string
  permitNumber?: string
  address?: string
  zip?: string
  tcpaConsent?: boolean
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, LIMITS.notifyProperty)
  if (!limited.allowed) return tooManyRequests(LIMITS.notifyProperty)

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.toString().trim()
  const permitNumber = body.permitNumber?.toString().trim()
  const address = body.address?.toString().trim() || null
  const zip = body.zip?.toString().trim() || null

  const screen = screenSubmission({
    email,
    honeypot: body.company_website,
    formLoadedAt: body.formLoadedAt,
  })
  if (screen.spam) {
    console.info('[notify-property] rejected:', screen.rule, '·', screen.detail)
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const tcpa = body.tcpaConsent === true

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }
  if (!permitNumber) {
    return NextResponse.json({ error: 'Permit reference missing.' }, { status: 400 })
  }
  if (!tcpa) {
    return NextResponse.json({ error: 'Consent is required to be contacted.' }, { status: 400 })
  }

  let supabaseId: string | null = null
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('property_notify_requests')
      .insert({
        email,
        permit_number: permitNumber,
        address,
        zip,
        tcpa_consent: tcpa,
        tcpa_consent_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    if (error) throw error
    supabaseId = data.id
  } catch (err) {
    console.error('[notify-property] supabase insert failed', err)
    return NextResponse.json(
      { error: 'Could not save your request. Please call (615) 624-4766.' },
      { status: 500 },
    )
  }

  const stephenAlert = `New pipeline notify signup.

Email: ${email}
Permit: ${permitNumber}
Address: ${address ?? 'withheld on panel'}
ZIP: ${zip ?? 'unknown'}

When this home lists, send them the listing the day it goes live. Reply to this email to reach them.`

  const alerted = await sendEmail({
    from: 'House Haven Alerts <alerts@househavenrealty.com>',
    to: 'stephen@househavenrealty.com',
    replyTo: email,
    subject: `Pipeline notify — ${address ?? permitNumber}`,
    text: stephenAlert,
  })
  if (!alerted.ok) {
    console.error(`[notify-property] signup ${supabaseId} saved but Stephen was not notified`)
  }

  const leadConfirmation = `You're on the list.

When ${address ?? 'this home'} lists — and only when it lists — you'll get an email from me directly with the full MLS details, photos, and a tour link.

Nothing else. No marketing blast, no drip campaigns.

In the meantime, if you want to talk through what to look for in a new-construction Nashville home, call me at (615) 624-4766.

— Stephen
House Haven Realty

Broker commissions are not set by law and are fully negotiable.`

  const confirmed = await sendEmail({
    from: 'Stephen Delahoussaye <stephen@househavenrealty.com>',
    to: email,
    subject: 'We\u2019ll watch this one for you',
    text: leadConfirmation,
  })
  if (!confirmed.ok) {
    console.error(`[notify-property] confirmation to ${email} was not accepted by Resend`)
  }

  // notified_at stays null until the home actually lists on MLS — that's the
  // event this table is tracking, not the signup confirmation.

  return NextResponse.json({ ok: true }, { status: 201 })
}
