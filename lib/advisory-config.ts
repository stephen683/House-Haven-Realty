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

// Slot-window rules and timezone for the paid Decision Brief flow.
export const ADVISORY_TIMEZONE = 'America/Chicago' as const
export const ADVISORY_SLOT_WINDOWS = [
  { dayOfWeek: 2, times: ['09:00', '10:30'] }, // Tuesday
  { dayOfWeek: 4, times: ['13:00', '14:30'] }, // Thursday
] as const
export const ADVISORY_BOOKING_LEAD_HOURS = 48
export const ADVISORY_MAX_SLOTS_PER_WEEK = 4
export const ADVISORY_MAX_SLOTS_PER_MONTH = 8
