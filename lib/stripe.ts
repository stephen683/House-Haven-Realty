// Stripe wrapper. Server-side only — never import from a Client Component.
// Fetch-based (matches lib/rentcast.ts, lib/hubspot.ts, lib/resend.ts pattern).
// When STRIPE_SECRET_KEY is unset, returns deterministic mock data so the
// booking flow ships before vendor credentials land.

import crypto from 'node:crypto'

const STRIPE_API_BASE = 'https://api.stripe.com/v1'

export interface CreatePaymentIntentInput {
  amountCents: number
  bookingId: string
  email: string
  description?: string
  metadata?: Record<string, string>
}

export interface PaymentIntentResult {
  paymentIntentId: string
  clientSecret: string
  source: 'stripe' | 'mock'
}

function authHeaders(key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
}

function toForm(obj: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    params.append(k, String(v))
  }
  return params.toString()
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<PaymentIntentResult> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    // Deterministic mock — same booking ID returns same intent ID, useful for
    // webhook simulation in dev.
    return {
      paymentIntentId: `pi_mock_${input.bookingId}`,
      clientSecret: `pi_mock_${input.bookingId}_secret_mock`,
      source: 'mock',
    }
  }

  // Stripe expects metadata as `metadata[key]=value` form fields.
  const form: Record<string, string | number | boolean | undefined> = {
    amount: input.amountCents,
    currency: 'usd',
    receipt_email: input.email,
    description: input.description,
    'automatic_payment_methods[enabled]': true,
    'metadata[booking_id]': input.bookingId,
  }
  if (input.metadata) {
    for (const [k, v] of Object.entries(input.metadata)) {
      form[`metadata[${k}]`] = v
    }
  }

  try {
    const res = await fetch(`${STRIPE_API_BASE}/payment_intents`, {
      method: 'POST',
      headers: authHeaders(key),
      body: toForm(form),
    })
    if (!res.ok) {
      const errBody = await res.text().catch(() => '')
      console.error('[stripe] create intent failed', res.status, errBody)
      throw new Error('stripe_create_intent_failed')
    }
    const data = (await res.json()) as { id: string; client_secret: string }
    return {
      paymentIntentId: data.id,
      clientSecret: data.client_secret,
      source: 'stripe',
    }
  } catch (err) {
    console.error('[stripe] create intent threw', err)
    throw err
  }
}

export async function retrievePaymentIntent(intentId: string): Promise<{
  status: string
  charges: Array<{ id: string }>
  source: 'stripe' | 'mock'
} | null> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return {
      status: 'succeeded',
      charges: [{ id: `ch_mock_${intentId}` }],
      source: 'mock',
    }
  }
  try {
    const res = await fetch(
      `${STRIPE_API_BASE}/payment_intents/${encodeURIComponent(intentId)}?expand[]=latest_charge`,
      { headers: { Authorization: `Bearer ${key}` } },
    )
    if (!res.ok) {
      console.error('[stripe] retrieve intent failed', res.status)
      return null
    }
    const data = (await res.json()) as {
      status: string
      latest_charge?: { id: string } | string | null
    }
    const chargeId =
      typeof data.latest_charge === 'string'
        ? data.latest_charge
        : data.latest_charge?.id ?? null
    return {
      status: data.status,
      charges: chargeId ? [{ id: chargeId }] : [],
      source: 'stripe',
    }
  } catch (err) {
    console.error('[stripe] retrieve intent threw', err)
    return null
  }
}

// Stripe webhook signature verification. Implements v1 scheme from
// https://stripe.com/docs/webhooks/signatures with timestamp tolerance.
const WEBHOOK_TOLERANCE_SECONDS = 300

export interface WebhookVerifyResult {
  valid: boolean
  reason?: string
}

export function verifyWebhookSignature(
  payload: string,
  header: string | null,
  secret: string | undefined,
  now: number = Math.floor(Date.now() / 1000),
): WebhookVerifyResult {
  if (!secret) return { valid: false, reason: 'no_secret' }
  if (!header) return { valid: false, reason: 'no_signature_header' }

  const elements = header.split(',').reduce<Record<string, string>>((acc, el) => {
    const [k, v] = el.split('=')
    if (k && v) {
      if (k === 'v1') {
        acc.v1 = (acc.v1 ? `${acc.v1},` : '') + v
      } else {
        acc[k] = v
      }
    }
    return acc
  }, {})

  const timestamp = elements.t
  const signatures = elements.v1?.split(',') ?? []
  if (!timestamp || signatures.length === 0) {
    return { valid: false, reason: 'malformed_signature_header' }
  }
  const ts = Number.parseInt(timestamp, 10)
  if (!Number.isFinite(ts)) return { valid: false, reason: 'bad_timestamp' }
  if (Math.abs(now - ts) > WEBHOOK_TOLERANCE_SECONDS) {
    return { valid: false, reason: 'timestamp_outside_tolerance' }
  }

  const signedPayload = `${timestamp}.${payload}`
  const expected = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
  const expectedBuf = Buffer.from(expected, 'utf8')

  for (const sig of signatures) {
    const sigBuf = Buffer.from(sig, 'utf8')
    if (sigBuf.length !== expectedBuf.length) continue
    if (crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: true }
    }
  }
  return { valid: false, reason: 'signature_mismatch' }
}

export function getPublishableKey(): string | null {
  return process.env.STRIPE_PUBLISHABLE_KEY ?? null
}

export function isStripeLive(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
