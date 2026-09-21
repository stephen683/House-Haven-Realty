import { NextRequest, NextResponse } from 'next/server'
import { recordLead } from '@/lib/lead-intake'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { screenSubmission } from '@/lib/spam-guard'

export const runtime = 'nodejs'

interface ContactPayload {
  /** Honeypot: hidden in the form, so any value means a machine filled it. */
  company_website?: string
  /** Epoch ms the form rendered, used to reject inhuman fill times. */
  formLoadedAt?: number
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
  const limited = await checkRateLimit(request, LIMITS.contact)
  if (!limited.allowed) return tooManyRequests(LIMITS.contact)

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

  // Spam screening. The site ran unguarded from April to September; of the 156
  // submissions that reached this table, three were real clients.
  const screen = screenSubmission({
    name, email, message,
    honeypot: body.company_website,
    formLoadedAt: body.formLoadedAt,
  })
  if (screen.spam) {
    console.info('[contact] rejected:', screen.rule, '·', screen.detail)
    // 201 on purpose: a bot that learns which rule caught it adapts.
    return NextResponse.json({ ok: true }, { status: 201 })
  }

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

  const result = await recordLead({
    formType: 'contact',
    source,
    email,
    firstName: first,
    lastName: last,
    phone,
    interest,
    message,
    tcpaConsent,
    pageUrl: request.headers.get('referer'),
    alertSubject: `New website lead — ${source}`,
    alertBody: [
      'New lead from the House Haven Realty website.',
      '',
      `Source: ${source}`,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      interest ? `Interested in: ${interest}` : null,
      '',
      'Message:',
      message,
    ].filter(Boolean).join('\n'),
  })

  if (!result.saved) {
    return NextResponse.json(
      { error: 'Could not save your message. Please call (615) 624-4766.' },
      { status: 500 },
    )
  }
  return NextResponse.json({ ok: true }, { status: 201 })
}
