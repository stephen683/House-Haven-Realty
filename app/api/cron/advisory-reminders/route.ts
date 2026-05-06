import { NextResponse } from 'next/server'
import {
  listBookingsForReminderWindow,
  updateBooking,
} from '@/lib/advisory-bookings'
import { sendReminder48h, sendReminder2h } from '@/lib/advisory-emails'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null
  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { sent48h: 0, sent2h: 0, errors: 0 }

  // 48-hour window
  const bookings48 = await listBookingsForReminderWindow(48)
  for (const b of bookings48) {
    const r = await sendReminder48h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder48hSentAt: new Date() })
      results.sent48h++
    } else {
      results.errors++
    }
  }

  // 2-hour window
  const bookings2 = await listBookingsForReminderWindow(2)
  for (const b of bookings2) {
    const r = await sendReminder2h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder2hSentAt: new Date() })
      results.sent2h++
    } else {
      results.errors++
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
