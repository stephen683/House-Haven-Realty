import { NextResponse } from 'next/server'
import {
  listBookingsForReminderWindow,
  updateBooking,
} from '@/lib/advisory-bookings'
import {
  sendReminder48h,
  sendReminder2h,
  sendDiscoveryReminder24h,
  sendDiscoveryReminder1h,
} from '@/lib/advisory-emails'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null
  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    paid_48h: 0,
    paid_2h: 0,
    discovery_24h: 0,
    discovery_1h: 0,
    errors: 0,
  }

  // Paid Brief — 48h reminder
  for (const b of await listBookingsForReminderWindow(48, 'paid_brief')) {
    const r = await sendReminder48h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder48hSentAt: new Date() })
      results.paid_48h++
    } else {
      results.errors++
    }
  }

  // Paid Brief — 2h reminder
  for (const b of await listBookingsForReminderWindow(2, 'paid_brief')) {
    const r = await sendReminder2h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder2hSentAt: new Date() })
      results.paid_2h++
    } else {
      results.errors++
    }
  }

  // Discovery call — 24h reminder
  for (const b of await listBookingsForReminderWindow(24, 'discovery_call')) {
    const r = await sendDiscoveryReminder24h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder24hSentAt: new Date() })
      results.discovery_24h++
    } else {
      results.errors++
    }
  }

  // Discovery call — 1h reminder
  for (const b of await listBookingsForReminderWindow(1, 'discovery_call')) {
    const r = await sendDiscoveryReminder1h(b)
    if (r.ok) {
      await updateBooking(b.id, { reminder1hSentAt: new Date() })
      results.discovery_1h++
    } else {
      results.errors++
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
