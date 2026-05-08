import { NextRequest, NextResponse } from 'next/server'
import { isAgentAuthed } from '@/lib/agent-auth'
import { getBookingById, updateBooking } from '@/lib/advisory-bookings'
import { sendEmail } from '@/lib/resend'

export const runtime = 'nodejs'

const FROM_ADVISORY = 'House Haven Advisory <advisory@househavenrealty.com>'

// Stephen-only: after a discovery call, if the prospect wants the full
// Decision Brief, this stamps the discovery booking with a conversion note
// and emails the prospect a one-click link to /advisory/book. The paid
// booking is created when they complete the form there — same flow as a
// cold prospect, just pre-warmed.

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAgentAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { note?: string }
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  const note = (body.note ?? '').toString().trim()

  const booking = await getBookingById(params.id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.booking_type !== 'discovery_call') {
    return NextResponse.json(
      { error: 'Only discovery-call bookings can be converted.' },
      { status: 400 },
    )
  }

  const stamp = new Date().toISOString().slice(0, 10)
  const adminNotesNext = [
    booking.admin_notes,
    `[${stamp}] Converted to paid Decision Brief by Stephen.${note ? ' ' + note : ''}`,
  ]
    .filter(Boolean)
    .join('\n')

  await updateBooking(params.id, { adminNotes: adminNotesNext })

  await sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: 'Next step — book your Decision Brief',
    text: `Hi ${booking.client_name.split(/\s+/)[0]},

Good talking. Here is the link to book your Decision Brief consult:

https://househavenrealty.com/advisory/book

It is $200 flat, pre-paid, with the written Brief delivered within 48 hours of the consult. Same email and phone you used for the discovery call will work.

If anything changes, reply to this email or call (615) 624-4766.

— Stephen
House Haven Realty`,
  })

  return NextResponse.json({ ok: true })
}
