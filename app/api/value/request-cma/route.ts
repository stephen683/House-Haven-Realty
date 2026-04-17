import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { upsertContact, splitName } from '@/lib/hubspot'
import { sendEmail } from '@/lib/resend'

export const runtime = 'nodejs'

const VALID_TIMELINES = ['ASAP', '1-3 months', '3-6 months', '6-12 months', 'Just curious']

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RequestBody {
  name?: string
  email?: string
  phone?: string
  address?: string
  timeline?: string
  estimate?: { low?: number | null; mid?: number | null; high?: number | null }
  tcpaConsent?: boolean
}

export async function POST(request: NextRequest) {
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
    const supabase = await createServerClient()
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
  const formattedMid = estimateMid ? `$${Math.round(estimateMid).toLocaleString()}` : 'unknown'
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
      const supabase = await createServerClient()
      await supabase.from('cma_requests').update({ hubspot_contact_id: hubspotId }).eq('id', supabaseId)
    } catch (err) {
      console.error('[value/request-cma] hubspot id update failed', err)
    }
  }

  const stephenAlert = `${name} just requested a CMA.

Address: ${address ?? 'not provided'}
Our Value estimate: ${formattedMid} (range: ${formattedRange})
Timeline: ${timeline ?? 'not provided'}

Contact:
Email: ${email}
Phone: ${phone ?? 'not provided'}

→ Reply from the HubSpot record, or call directly. Fastest responder wins.`

  await sendEmail({
    from: 'House Haven Alerts <alerts@househavenrealty.com>',
    to: 'stephen@househavenrealty.com',
    replyTo: email,
    subject: `New CMA request — ${name}`,
    text: stephenAlert,
  })

  const leadConfirmation = `Hi ${firstName || 'there'},

Got your request. I'll personally prepare a full Comparative Market Analysis for your home${address ? ` at ${address}` : ''} and send it over within 24 hours.

A CMA is the same analysis I'd prepare for a listing appointment. It looks at recent sales in your specific neighborhood, adjusts for your home's characteristics, and gives you a realistic sale-price range based on today's market. The automated estimate you saw online is a starting point — this is the real number.

No obligation, no pressure. I built this so you have good information whether or not you ever work with us.

If you'd rather talk through it than read a PDF, call me directly at (615) 624-4766.

— Stephen
House Haven Realty

Broker commissions are not set by law and are fully negotiable.`

  await sendEmail({
    from: 'Stephen Delahoussaye <stephen@househavenrealty.com>',
    to: email,
    subject: 'Your CMA from House Haven',
    text: leadConfirmation,
  })

  try {
    const supabase = await createServerClient()
    await supabase.from('cma_requests').update({ notified_at: new Date().toISOString() }).eq('id', supabaseId)
  } catch {
    // non-blocking
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
