import { NextRequest, NextResponse } from 'next/server'
import { DISCOVERY_CALL_SLOT_CONFIG } from '@/lib/advisory-config'
import { validateSlotIsAvailable } from '@/lib/advisory-slots'
import { createBooking } from '@/lib/advisory-bookings'
import { runPostDiscoveryBookingSideEffects } from '@/lib/advisory-flow'

export const runtime = 'nodejs'
export const maxDuration = 60

interface DiscoveryBody {
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
  let body: DiscoveryBody
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
  if (!phone) return NextResponse.json({ error: 'Phone is required' }, { status: 400 })

  const slotUtc = body.slotUtcIso ? new Date(body.slotUtcIso) : null
  if (!slotUtc || !Number.isFinite(slotUtc.getTime())) {
    return NextResponse.json({ error: 'Invalid slot' }, { status: 400 })
  }

  // Server-enforce slot availability + slot-window rules
  const slotCheck = await validateSlotIsAvailable(slotUtc, DISCOVERY_CALL_SLOT_CONFIG)
  if (!slotCheck.ok) {
    return NextResponse.json(
      { error: 'Slot is no longer available. Please pick another.' },
      { status: 409 },
    )
  }

  const booking = await createBooking({
    bookingType: 'discovery_call',
    clientName: name,
    clientEmail: email,
    clientPhone: phone,
    intakeResponses: intake,
    rentcastPrepull: null,
    slotUtc,
    slotCentral: slotUtc,
    amountCents: 0,
  })
  if (!booking) {
    return NextResponse.json({ error: 'Could not create booking' }, { status: 500 })
  }

  // Run side effects inline (no payment to wait on)
  await runPostDiscoveryBookingSideEffects(booking.id)

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    redirectTo: `/advisory/discovery-call/confirmation?id=${booking.id}`,
  })
}
