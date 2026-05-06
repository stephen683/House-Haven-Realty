import { NextResponse } from 'next/server'
import {
  parseHelloSignEvent,
  parseDocuSignEvent,
  type ESignSignedEvent,
} from '@/lib/esign'
import { getBookingById, updateBooking } from '@/lib/advisory-bookings'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Handles signature-completed callbacks from both HelloSign and DocuSign.
// HelloSign POSTs JSON. DocuSign Connect can POST JSON or XML; we accept JSON
// payloads here and assume Connect is configured for JSON.
//
// Phase 6 ships this endpoint live but it does nothing until Stephen picks a
// vendor and configures the corresponding signing-side webhook URL in that
// vendor's dashboard pointed at this route.

async function findBookingByRequestId(requestId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('advisory_bookings')
    .select('id')
    .eq('esign_signature_request_id', requestId)
    .single()
  return data?.id as string | undefined
}

export async function POST(request: Request) {
  const payload = await request.text()
  let event: ESignSignedEvent | null = null

  // Try HelloSign first, then DocuSign — non-matching parses return null.
  event = parseHelloSignEvent(payload) ?? parseDocuSignEvent(payload)

  if (!event) {
    // Acknowledge so the vendor stops retrying. We log for diagnosis but
    // ignore unknown event types or non-completion events.
    return NextResponse.json({ ok: true, ignored: true })
  }

  // Resolve booking. The booking row already has esign_signature_request_id
  // set when the send succeeded; fall back to looking up by metadata bookingId.
  let bookingId = event.bookingId
  let booking = await getBookingById(bookingId)

  if (!booking && event.signatureRequestId) {
    const altId = await findBookingByRequestId(event.signatureRequestId)
    if (altId) {
      bookingId = altId
      booking = await getBookingById(altId)
    }
  }

  if (!booking) {
    console.warn('[esign-webhook] no booking for event', event)
    return NextResponse.json({ ok: true, skipped: 'no_booking' })
  }

  if (booking.engagement_letter_status === 'signed') {
    return NextResponse.json({ ok: true, alreadySigned: true })
  }

  await updateBooking(booking.id, {
    engagementLetterStatus: 'signed',
    engagementLetterSignedAt: new Date(),
  })

  return NextResponse.json({ ok: true })
}
