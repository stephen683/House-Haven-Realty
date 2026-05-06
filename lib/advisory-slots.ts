// Server-side slot calculation.
// Handles America/Chicago wall-clock → UTC conversion correctly across DST,
// applies the slot-window policy, 48-hour booking lead, weekly + monthly
// caps, and Google Calendar busy-time conflicts. Used by the
// /api/advisory/calendar-slots route and by the create-intent route to
// guard against client-tampered slot values.

import {
  ADVISORY_SLOT_WINDOWS,
  ADVISORY_BOOKING_LEAD_HOURS,
  ADVISORY_MAX_SLOTS_PER_WEEK,
  ADVISORY_MAX_SLOTS_PER_MONTH,
} from '@/lib/advisory-config'
import { listBusy } from '@/lib/google-calendar'
import { createClient } from '@/lib/supabase/server'

export const SLOT_DURATION_MINUTES = 60

// Convert a wall-clock time in America/Chicago to a UTC Date instant.
// Iterative algorithm: handles DST transitions correctly by checking what
// Chicago time corresponds to a guess UTC instant and adjusting.
function centralToUtc(
  year: number,
  month1: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  let utcMs = Date.UTC(year, month1 - 1, day, hour, minute)
  for (let i = 0; i < 2; i++) {
    const guess = new Date(utcMs)
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(guess)
    const get = (type: string) =>
      parseInt(parts.find((p) => p.type === type)?.value || '0', 10)
    const cYear = get('year')
    const cMonth = get('month')
    const cDay = get('day')
    let cHour = get('hour')
    if (cHour === 24) cHour = 0
    const cMinute = get('minute')
    const desiredMs = Date.UTC(year, month1 - 1, day, hour, minute)
    const actualMs = Date.UTC(cYear, cMonth - 1, cDay, cHour, cMinute)
    const diff = desiredMs - actualMs
    if (diff === 0) return guess
    utcMs += diff
  }
  return new Date(utcMs)
}

function getChicagoDateParts(date: Date): {
  year: number
  month: number
  day: number
  dayOfWeek: number
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value || ''
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    dayOfWeek: dayMap[get('weekday')] ?? 0,
  }
}

export function getCandidateSlots(start: Date, end: Date): Date[] {
  const slots: Date[] = []
  const cursor = new Date(start)
  cursor.setUTCDate(cursor.getUTCDate() - 1)
  const stop = new Date(end)
  stop.setUTCDate(stop.getUTCDate() + 1)
  while (cursor <= stop) {
    const { year, month, day, dayOfWeek } = getChicagoDateParts(cursor)
    for (const window of ADVISORY_SLOT_WINDOWS) {
      if (window.dayOfWeek !== dayOfWeek) continue
      for (const time of window.times) {
        const [h, m] = time.split(':').map(Number)
        const slot = centralToUtc(year, month, day, h, m)
        if (slot >= start && slot <= end) slots.push(slot)
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  // Dedupe (boundary iteration can yield duplicates)
  const seen = new Set<number>()
  return slots
    .filter((s) => {
      const t = s.getTime()
      if (seen.has(t)) return false
      seen.add(t)
      return true
    })
    .sort((a, b) => a.getTime() - b.getTime())
}

// Sunday-anchored UTC week key (stable for cap counting)
function weekKey(date: Date): string {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - d.getUTCDay())
  return d.toISOString().slice(0, 10)
}

function monthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

export interface AvailableSlot {
  utc: string
  centralLabel: string
}

export interface AvailableSlotsResult {
  slots: AvailableSlot[]
  source: 'live' | 'mock'
}

export function formatCentralLabel(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export async function getAvailableSlots(
  start: Date,
  end: Date,
): Promise<AvailableSlotsResult> {
  const candidates = getCandidateSlots(start, end)
  const now = Date.now()
  const minMs = now + ADVISORY_BOOKING_LEAD_HOURS * 3600 * 1000

  // 48-hour booking lead
  let available = candidates.filter((s) => s.getTime() >= minMs)

  // Google Calendar busy
  const busyResult = await listBusy(start, end)
  available = available.filter((slot) => {
    const slotMs = slot.getTime()
    const slotEndMs = slotMs + SLOT_DURATION_MINUTES * 60_000
    return !busyResult.busyRanges.some((b) => {
      const bStart = new Date(b.start).getTime()
      const bEnd = new Date(b.end).getTime()
      return slotMs < bEnd && slotEndMs > bStart
    })
  })

  // Existing bookings — scan from start of the calendar month containing `start`
  // so weekly + monthly caps are accurate.
  const supabase = await createClient()
  const monthStart = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1),
  )
  const { data: bookings } = await supabase
    .from('advisory_bookings')
    .select('slot_utc')
    .gte('slot_utc', monthStart.toISOString())
    .in('payment_status', ['pending', 'succeeded'])
    .is('canceled_at', null)

  const bookedSet = new Set<number>()
  const monthCounts = new Map<string, number>()
  const weekCounts = new Map<string, number>()
  for (const b of bookings ?? []) {
    if (!b.slot_utc) continue
    const d = new Date(b.slot_utc as string)
    bookedSet.add(d.getTime())
    monthCounts.set(monthKey(d), (monthCounts.get(monthKey(d)) ?? 0) + 1)
    weekCounts.set(weekKey(d), (weekCounts.get(weekKey(d)) ?? 0) + 1)
  }

  // Filter already-booked slots
  available = available.filter((slot) => !bookedSet.has(slot.getTime()))

  // Apply weekly + monthly caps
  available = available.filter((slot) => {
    const wk = weekCounts.get(weekKey(slot)) ?? 0
    const mo = monthCounts.get(monthKey(slot)) ?? 0
    return wk < ADVISORY_MAX_SLOTS_PER_WEEK && mo < ADVISORY_MAX_SLOTS_PER_MONTH
  })

  return {
    slots: available.map((s) => ({
      utc: s.toISOString(),
      centralLabel: formatCentralLabel(s),
    })),
    source: busyResult.source === 'google' ? 'live' : 'mock',
  }
}

// Used by /api/advisory/create-intent to confirm the slot the client picked
// is still available (race-condition guard between slot-pick and submit).
export async function validateSlotIsAvailable(
  slotUtc: Date,
): Promise<{ ok: boolean; reason?: string }> {
  const start = new Date(slotUtc.getTime() - 86_400_000)
  const end = new Date(slotUtc.getTime() + 86_400_000)
  const result = await getAvailableSlots(start, end)
  const found = result.slots.find(
    (s) => new Date(s.utc).getTime() === slotUtc.getTime(),
  )
  if (!found) return { ok: false, reason: 'slot_not_available' }
  return { ok: true }
}
