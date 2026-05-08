import { NextRequest, NextResponse } from 'next/server'
import { isAgentAuthed } from '@/lib/agent-auth'
import {
  getBookingById,
  updateBooking,
} from '@/lib/advisory-bookings'
import { deleteEvent } from '@/lib/google-calendar'
import { sendEmail } from '@/lib/resend'

export const runtime = 'nodejs'

const FROM_ADVISORY = 'House Haven Advisory <advisory@househavenrealty.com>'
const PRODUCT_NAME = 'Decision Brief'

function fmtCentral(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAgentAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { reason?: string }
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  const reason = (body.reason ?? '').toString().trim() || 'Canceled by Stephen.'

  const booking = await getBookingById(params.id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.canceled_at) {
    return NextResponse.json({ ok: true, alreadyCanceled: true })
  }

  // Delete calendar event (best-effort)
  if (booking.google_calendar_event_id) {
    await deleteEvent(booking.google_calendar_event_id).catch(() => undefined)
  }

  await updateBooking(params.id, {
    canceledAt: new Date(),
    cancellationReason: reason,
  })

  // Notify the client
  await sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: `Canceled: your ${PRODUCT_NAME} consult`,
    text: `Hi ${booking.client_name.split(/\s+/)[0]},

Your ${PRODUCT_NAME} consult on ${fmtCentral(booking.slot_central ?? booking.slot_utc)} has been canceled.

Reason: ${reason}

If a refund is appropriate per the policy you agreed to (full refund 24+ hours before; none inside 24 hours), Stephen will issue it within a few business days. If you want to reschedule, reply to this email or call (615) 624-4766.

— Stephen
House Haven Realty`,
  })

  return NextResponse.json({ ok: true })
}
