import { NextResponse } from 'next/server'
import { getBookingById } from '@/lib/advisory-bookings'
import { getTrack } from '@/lib/advisory-config'

export const runtime = 'nodejs'

function fmtIcs(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const booking = await getBookingById(params.id)
  if (!booking || !booking.slot_utc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const start = new Date(booking.slot_utc)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const trackName = getTrack(booking.track)?.name ?? 'Decision Brief'
  const summary = `HHR Advisory — ${trackName}`
  const description = `Decision Brief consult on Google Meet${
    booking.meet_link ? ': ' + booking.meet_link : '.'
  }\n\nBooking ID: ${booking.id}`

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//House Haven Realty//HHR Advisory//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@househavenrealty.com`,
    `DTSTAMP:${fmtIcs(new Date())}`,
    `DTSTART:${fmtIcs(start)}`,
    `DTEND:${fmtIcs(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
  ]
  if (booking.meet_link) lines.push(`URL:${booking.meet_link}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="hhr-advisory-${booking.id.slice(0, 8)}.ics"`,
    },
  })
}
