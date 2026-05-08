import { NextRequest, NextResponse } from 'next/server'
import { ADVISORY_PRICE_USD, PAID_BRIEF_SLOT_CONFIG } from '@/lib/advisory-config'
import { validateSlotIsAvailable } from '@/lib/advisory-slots'
import { prepullRentCast, type PrepullData } from '@/lib/advisory-prepull'
import {
  createBooking,
  updateBooking,
} from '@/lib/advisory-bookings'
import {
  createPaymentIntent,
  getPublishableKey,
} from '@/lib/stripe'
import { runPostPaymentSideEffects } from '@/lib/advisory-flow'

export const runtime = 'nodejs'
export const maxDuration = 60

interface IntakeBody {
  intake?: Record<string, unknown>
  slotUtcIso?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function s(v: unknown): string {
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(request: NextRequest) {
  let body: IntakeBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const intake = (body.intake ?? {}) as Record<string, unknown>
  const name = s(intake.name)
  const email = s(intake.email).toLowerCase()
  const phone = s(intake.phone)

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (intake.acknowledgment !== true) {
    return NextResponse.json(
      { error: 'You must acknowledge the engagement letter terms.' },
      { status: 400 },
    )
  }

  const slotUtc = body.slotUtcIso ? new Date(body.slotUtcIso) : null
  if (!slotUtc || !Number.isFinite(slotUtc.getTime())) {
    return NextResponse.json({ error: 'Invalid slot' }, { status: 400 })
  }

  // Server-enforce slot availability + slot-window rules
  const slotCheck = await validateSlotIsAvailable(slotUtc, PAID_BRIEF_SLOT_CONFIG)
  if (!slotCheck.ok) {
    return NextResponse.json(
      { error: 'Slot is no longer available. Please pick another.' },
      { status: 409 },
    )
  }

  // RentCast pre-pull when intake mentions a property address
  let rentcastPrepull: PrepullData | null = null
  const addr = s(intake.propertyAddress)
  if (addr) {
    rentcastPrepull = await prepullRentCast(addr)
  }

  // Create booking row (status: pending)
  const booking = await createBooking({
    bookingType: 'paid_brief',
    clientName: name,
    clientEmail: email,
    clientPhone: phone || undefined,
    intakeResponses: intake,
    rentcastPrepull: (rentcastPrepull as unknown) as Record<string, unknown> | null,
    slotUtc,
    slotCentral: slotUtc,
    amountCents: ADVISORY_PRICE_USD * 100,
  })
  if (!booking) {
    return NextResponse.json({ error: 'Could not create booking' }, { status: 500 })
  }

  // Create Stripe PaymentIntent (or mock)
  let intent
  try {
    intent = await createPaymentIntent({
      amountCents: booking.amount_cents,
      bookingId: booking.id,
      email,
      description: 'HHR Advisory — Decision Brief',
      metadata: { slot_utc: slotUtc.toISOString() },
    })
  } catch (err) {
    console.error('[create-intent] stripe failed', err)
    await updateBooking(booking.id, { paymentStatus: 'failed' })
    return NextResponse.json({ error: 'Payment setup failed. Try again.' }, { status: 500 })
  }

  await updateBooking(booking.id, {
    stripePaymentIntentId: intent.paymentIntentId,
  })

  // Mock mode: simulate post-payment flow inline (no webhook, no Stripe Elements)
  if (intent.source === 'mock') {
    await runPostPaymentSideEffects(booking.id)
    return NextResponse.json({
      mode: 'mock',
      bookingId: booking.id,
      redirectTo: `/advisory/book/confirmation?id=${booking.id}`,
    })
  }

  // Live mode: client mounts Stripe Elements; webhook runs side effects
  return NextResponse.json({
    mode: 'live',
    bookingId: booking.id,
    clientSecret: intent.clientSecret,
    publishableKey: getPublishableKey(),
  })
}
