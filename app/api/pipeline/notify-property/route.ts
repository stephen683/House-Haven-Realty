import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { upsertContact } from '@/lib/hubspot'
import { sendEmail } from '@/lib/resend'

export const runtime = 'nodejs'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RequestBody {
  email?: string
  permitNumber?: string
  address?: string
  zip?: string
  tcpaConsent?: boolean
}

export async function POST(request: NextRequest) {
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
    const supabase = await createServerClient()
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

  const noteHtml = `
    <p><strong>Property notify-me signup</strong></p>
    <ul>
      <li>Permit: ${permitNumber}</li>
      <li>Address: ${address ?? 'withheld on page'}</li>
      <li>ZIP: ${zip ?? 'unknown'}</li>
    </ul>
  `.trim()

  const hubspotId = await upsertContact({
    email,
    source: 'pipeline_notify',
    noteHtml,
  })

  if (hubspotId) {
    try {
      const supabase = await createServerClient()
      await supabase
        .from('property_notify_requests')
        .update({ hubspot_contact_id: hubspotId, synced_to_crm_at: new Date().toISOString() })
        .eq('id', supabaseId)
    } catch (err) {
      console.error('[notify-property] hubspot id update failed', err)
    }
  }

  const stephenAlert = `New pipeline notify signup.

Email: ${email}
Permit: ${permitNumber}
Address: ${address ?? 'withheld on panel'}
ZIP: ${zip ?? 'unknown'}

When this home lists, the signup is already in HubSpot — send them the listing the day it goes live.`

  await sendEmail({
    from: 'House Haven Alerts <alerts@househavenrealty.com>',
    to: 'stephen@househavenrealty.com',
    replyTo: email,
    subject: `Pipeline notify — ${address ?? permitNumber}`,
    text: stephenAlert,
  })

  const leadConfirmation = `You're on the list.

When ${address ?? 'this home'} lists — and only when it lists — you'll get an email from me directly with the full MLS details, photos, and a tour link.

Nothing else. No marketing blast, no drip campaigns.

In the meantime, if you want to talk through what to look for in a new-construction Nashville home, call me at (615) 624-4766.

— Stephen
House Haven Realty

Broker commissions are not set by law and are fully negotiable.`

  await sendEmail({
    from: 'Stephen Delahoussaye <stephen@househavenrealty.com>',
    to: email,
    subject: 'We\u2019ll watch this one for you',
    text: leadConfirmation,
  })

  // notified_at stays null until the home actually lists on MLS — that's the
  // event this table is tracking, not the signup confirmation.

  return NextResponse.json({ ok: true }, { status: 201 })
}
