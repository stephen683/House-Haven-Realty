import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isHubSpotConfigured, upsertContact, splitName } from '@/lib/hubspot'
import { isEmailConfigured, sendEmail } from '@/lib/resend'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { screenSubmission } from '@/lib/spam-guard'

export const runtime = 'nodejs'

const VALID_TIMELINES = ['ASAP', '1-3 months', '3-6 months', '6-12 months', 'Just curious']

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RequestBody {
  /** Honeypot: hidden in the form, so any value means a machine filled it. */
  company_website?: string
  /** Epoch ms the form rendered, used to reject inhuman fill times. */
  formLoadedAt?: number
  name?: string
  email?: string
  phone?: string
  address?: string
  timeline?: string
  estimate?: { low?: number | null; mid?: number | null; high?: number | null }
  tcpaConsent?: boolean
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, LIMITS.cmaRequest)
  if (!limited.allowed) return tooManyRequests(LIMITS.cmaRequest)

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name?.toString().trim()
  const email = body.email?.toString().trim()
  const phone = body.phone?.toString().trim() || null
  const address = body.address?.toString().trim() || null

  const screen = screenSubmission({
    name, email,
    honeypot: body.company_website,
    formLoadedAt: body.formLoadedAt,
  })
  if (screen.spam) {
    console.info('[request-cma] rejected:', screen.rule, '·', screen.detail)
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const timeline = VALID_TIMELINES.includes(body.timeline ?? '') ? body.timeline! : null
  const estimateLow = body.estimate?.low ?? null
  const estimateMid = body.estimate?.mid ?? null
  const estimateHigh = body.estimate?.high ?? null
  const tcpa = body.tcpaConsent === true

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }
  if (!tcpa) {
    return NextResponse.json({ error: 'Consent is required to be contacted.' }, { status: 400 })
  }

  let supabaseId: string | null = null
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('cma_requests')
      .insert({
        name,
        email,
        phone,
        address,
        estimated_value_low: estimateLow,
        estimated_value_mid: estimateMid,
        estimated_value_high: estimateHigh,
        timeline,
        tcpa_consent: tcpa,
        tcpa_consent_at: tcpa ? new Date().toISOString() : null,
        page_url: request.headers.get('referer') || null,
      })
      .select('id')
      .single()
    if (error) throw error
    supabaseId = data.id
  } catch (err) {
    console.error('[value/request-cma] supabase insert failed', err)
    return NextResponse.json({ error: 'Could not save your request. Please call (615) 624-4766.' }, { status: 500 })
  }

  const { firstName, lastName } = splitName(name)
  // A null estimate means the automated valuation could not run, not that the
  // home is worth nothing. Both emails have to read correctly in that case.
  const hasEstimate = estimateMid !== null
  const formattedMid = hasEstimate ? `$${Math.round(estimateMid!).toLocaleString()}` : 'none — automated valuation unavailable'
  const formattedRange = estimateLow && estimateHigh
    ? `$${Math.round(estimateLow).toLocaleString()} – $${Math.round(estimateHigh).toLocaleString()}`
    : 'n/a'
  const noteHtml = `
    <p><strong>House Haven Value request</strong></p>
    <ul>
      <li>Address: ${address ?? 'not provided'}</li>
      <li>Our estimate: ${formattedMid} (range: ${formattedRange})</li>
      <li>Timeline: ${timeline ?? 'not provided'}</li>
    </ul>
  `.trim()

  const hubspotId = await upsertContact({
    email,
    firstName,
    lastName,
    phone: phone || undefined,
    source: 'value_tool',
    timeline,
    noteHtml,
  })

  if (hubspotId) {
    try {
      const supabase = createServiceClient()
      await supabase
        .from('cma_requests')
        .update({ hubspot_contact_id: hubspotId, synced_to_crm_at: new Date().toISOString() })
        .eq('id', supabaseId)
    } catch (err) {
      console.error('[value/request-cma] hubspot id update failed', err)
    }
  } else if (!isHubSpotConfigured()) {
    console.error('[value/request-cma] HUBSPOT_PRIVATE_APP_TOKEN unset — CMA request saved but not in the CRM')
  }

  const stephenAlert = `${name} just requested a CMA.

Address: ${address ?? 'not provided'}
Our Value estimate: ${formattedMid} (range: ${formattedRange})
Timeline: ${timeline ?? 'not provided'}

Contact:
Email: ${email}
Phone: ${phone ?? 'not provided'}

→ Reply from the HubSpot record, or call directly. Fastest responder wins.`

  const alerted = await sendEmail({
    from: 'House Haven Alerts <alerts@househavenrealty.com>',
    to: 'stephen@househavenrealty.com',
    replyTo: email,
    subject: `New CMA request — ${name}`,
    text: stephenAlert,
  })

  const leadConfirmation = `Hi ${firstName || 'there'},

Got your request. I'll personally prepare a full Comparative Market Analysis for your home${address ? ` at ${address}` : ''} and send it over within 24 hours.

A CMA is the same analysis I'd prepare for a listing appointment. It looks at recent sales in your specific neighborhood, adjusts for your home's characteristics, and gives you a realistic sale-price range based on today's market.${hasEstimate ? ' The automated estimate you saw online is a starting point — this is the real number.' : ''}

No obligation, no pressure. I built this so you have good information whether or not you ever work with us.

If you'd rather talk through it than read a PDF, call me directly at (615) 624-4766.

— Stephen
House Haven Realty

Broker commissions are not set by law and are fully negotiable.`

  const confirmed = await sendEmail({
    from: 'Stephen Delahoussaye <stephen@househavenrealty.com>',
    to: email,
    subject: 'Your CMA from House Haven',
    text: leadConfirmation,
  })
  if (!confirmed.ok) {
    console.error(`[value/request-cma] confirmation to ${email} was not accepted by Resend`)
  }

  // notified_at means a human was actually told, so it is stamped from the
  // alert's result rather than from having reached this line. sendEmail returns
  // ok:true on a dry-run when no key is set, so this is also gated on the key.
  if (alerted.ok && isEmailConfigured()) {
    try {
      const supabase = createServiceClient()
      await supabase.from('cma_requests').update({ notified_at: new Date().toISOString() }).eq('id', supabaseId)
    } catch {
      // non-blocking
    }
  } else {
    console.error(`[value/request-cma] CMA ${supabaseId} saved but Stephen was not notified`)
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
