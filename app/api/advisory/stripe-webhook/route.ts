import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import {
  getBookingByPaymentIntent,
  updateBooking,
} from '@/lib/advisory-bookings'
import { runPostPaymentSideEffects } from '@/lib/advisory-flow'

export const runtime = 'nodejs'
export const maxDuration = 60

interface StripePaymentIntent {
  id: string
  latest_charge?: string | { id: string } | null
}

interface StripeChargeRefund {
  id: string
  payment_intent?: string | null
}

interface StripeEvent {
  type: string
  data: {
    object: StripePaymentIntent | StripeChargeRefund | Record<string, unknown>
  }
}

function chargeIdOf(latest: StripePaymentIntent['latest_charge']): string | null {
  if (!latest) return null
  if (typeof latest === 'string') return latest
  return latest.id ?? null
}

export async function POST(request: Request) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature')
  const verify = verifyWebhookSignature(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET,
  )
  if (!verify.valid) {
    console.error('[stripe-webhook] verify failed:', verify.reason)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: StripeEvent
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as StripePaymentIntent
      const booking = await getBookingByPaymentIntent(intent.id)
      if (!booking) {
        // Might be a non-Advisory PaymentIntent on the same Stripe account.
        // Acknowledge to stop retries.
        return NextResponse.json({ ok: true, skipped: 'no_booking' })
      }
      const charge = chargeIdOf(intent.latest_charge)
      if (charge) {
        await updateBooking(booking.id, { stripeChargeId: charge })
      }
      const result = await runPostPaymentSideEffects(booking.id)
      return NextResponse.json({ ok: result.ok })
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as StripePaymentIntent
      const booking = await getBookingByPaymentIntent(intent.id)
      if (booking) {
        await updateBooking(booking.id, { paymentStatus: 'failed' })
      }
      return NextResponse.json({ ok: true })
    }
    case 'charge.refunded': {
      const refund = event.data.object as StripeChargeRefund
      const intentId =
        typeof refund.payment_intent === 'string' ? refund.payment_intent : null
      if (intentId) {
        const booking = await getBookingByPaymentIntent(intentId)
        if (booking) {
          await updateBooking(booking.id, { paymentStatus: 'refunded' })
        }
      }
      return NextResponse.json({ ok: true })
    }
    default:
      return NextResponse.json({ ok: true, ignored: event.type })
  }
}
