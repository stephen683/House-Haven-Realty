// Central configuration for the HHR Advisory product surface.
// Single source of truth for pricing, slot windows, and the disclosure paragraph.

export const ADVISORY_PRICE_USD = 200
export const ADVISORY_DURATION_LABEL = 'one hour'
export const ADVISORY_BRIEF_TURNAROUND_LABEL = '48 hours'

// Standard disclosure footer for every /advisory/* page. Editable via env so the
// attorney's final wording can swap in without code changes.
const DEFAULT_DISCLOSURE_TEXT =
  'Stephen Delahoussaye is a licensed real estate broker in Tennessee. HHR Advisory provides general real estate consulting and is not legal, financial, or tax advice. For specific legal, financial, or tax questions, consult a licensed professional in those fields.'

export function getAdvisoryDisclosure(): string {
  const env = process.env.ADVISORY_DISCLOSURE_TEXT?.trim()
  return env && env.length > 0 ? env : DEFAULT_DISCLOSURE_TEXT
}

export const ADVISORY_TIMEZONE = 'America/Chicago' as const

// Slot configs are parameterized so the same advisory-slots.ts machinery
// serves both flows. Conflicts (calendar busy + existing bookings of the
// other type) are computed cross-type so a paid 60-min consult blocks
// any overlapping 15-min discovery call and vice versa.

export interface SlotConfig {
  bookingType: 'paid_brief' | 'discovery_call'
  windows: ReadonlyArray<{ dayOfWeek: number; times: ReadonlyArray<string> }>
  durationMinutes: number
  leadHours: number
  maxPerWeek: number
  maxPerMonth: number
}

// Paid Decision Brief — Tuesday + Thursday, 60-minute consults.
export const PAID_BRIEF_SLOT_CONFIG: SlotConfig = {
  bookingType: 'paid_brief',
  windows: [
    { dayOfWeek: 2, times: ['09:00', '10:30'] }, // Tuesday
    { dayOfWeek: 4, times: ['13:00', '14:30'] }, // Thursday
  ],
  durationMinutes: 60,
  leadHours: 48,
  maxPerWeek: 4,
  maxPerMonth: 8,
}

// Free 15-min discovery call — Mon/Wed/Fri 9-11 AM CT in 15-min increments.
// Cap is 6/week so Stephen can run the funnel without it dominating his week.
export const DISCOVERY_CALL_SLOT_CONFIG: SlotConfig = {
  bookingType: 'discovery_call',
  windows: [
    { dayOfWeek: 1, times: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'] }, // Monday
    { dayOfWeek: 3, times: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'] }, // Wednesday
    { dayOfWeek: 5, times: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45'] }, // Friday
  ],
  durationMinutes: 15,
  leadHours: 48,
  maxPerWeek: 6,
  maxPerMonth: 24,
}

// Back-compat exports — kept temporarily so call sites that haven't moved to
// SlotConfig still resolve. New code should import the SlotConfig objects.
export const ADVISORY_SLOT_WINDOWS = PAID_BRIEF_SLOT_CONFIG.windows
export const ADVISORY_BOOKING_LEAD_HOURS = PAID_BRIEF_SLOT_CONFIG.leadHours
export const ADVISORY_MAX_SLOTS_PER_WEEK = PAID_BRIEF_SLOT_CONFIG.maxPerWeek
export const ADVISORY_MAX_SLOTS_PER_MONTH = PAID_BRIEF_SLOT_CONFIG.maxPerMonth
