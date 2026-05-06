import { NextRequest, NextResponse } from 'next/server'
import { isAgentAuthed } from '@/lib/agent-auth'
import { getBookingById, updateBooking } from '@/lib/advisory-bookings'
import { sendBriefDelivery } from '@/lib/advisory-emails'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAgentAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { briefPdfUrl?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const briefPdfUrl = body.briefPdfUrl?.trim()
  if (!briefPdfUrl) {
    return NextResponse.json({ error: 'briefPdfUrl is required' }, { status: 400 })
  }

  const booking = await getBookingById(params.id)
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.brief_status === 'delivered') {
    return NextResponse.json({ ok: true, alreadyDelivered: true })
  }

  const sendResult = await sendBriefDelivery(booking, briefPdfUrl)
  if (!sendResult.ok) {
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
  }

  await updateBooking(params.id, {
    briefStatus: 'delivered',
    briefDeliveredAt: new Date(),
  })
  return NextResponse.json({ ok: true })
}
