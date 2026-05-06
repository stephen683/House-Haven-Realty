// Central configuration for the HHR Advisory product surface.
// Single source of truth for pricing, tracks, slot windows, and the disclosure
// paragraph. Phases 1–6 import from here so swapping price/copy/slot rules is
// a one-line change.

export const ADVISORY_PRICE_USD = 200
export const ADVISORY_DURATION_LABEL = 'one hour'
export const ADVISORY_BRIEF_TURNAROUND_LABEL = '48 hours'

export interface AdvisoryTrack {
  slug: 'fsbo' | 'buyer-roadmap' | 'sell-or-rent'
  name: string
  shortName: string
  audience: string
  promise: string
  isSellerFacing: boolean
}

export const ADVISORY_TRACKS: readonly AdvisoryTrack[] = [
  {
    slug: 'fsbo',
    name: 'FSBO Sanity-Check',
    shortName: 'FSBO',
    audience: 'Selling your home yourself in Nashville?',
    promise: "Get one honest hour with a broker who isn't trying to take your listing.",
    isSellerFacing: true,
  },
  {
    slug: 'buyer-roadmap',
    name: 'Buyer Roadmap',
    shortName: 'Buyer Roadmap',
    audience: 'Six to eighteen months out from buying in Nashville?',
    promise: 'Get a personalized timeline and the questions to ask now.',
    isSellerFacing: false,
  },
  {
    slug: 'sell-or-rent',
    name: 'Sell-or-Rent',
    shortName: 'Sell-or-Rent',
    audience: 'Considering keeping your Nashville home as a rental instead of selling it?',
    promise: 'Get the math, honestly.',
    isSellerFacing: true,
  },
]

export type AdvisoryTrackSlug = AdvisoryTrack['slug']

export function getTrack(slug: string): AdvisoryTrack | null {
  return ADVISORY_TRACKS.find((t) => t.slug === slug) ?? null
}

// Standard disclosure footer for every /advisory/* page. Editable via env so the
// attorney's final wording can swap in without code changes.
const DEFAULT_DISCLOSURE_TEXT =
  'Stephen Delahoussaye is a licensed real estate broker in Tennessee. HHR Advisory provides general real estate consulting and is not legal, financial, or tax advice. For specific legal, financial, or tax questions, consult a licensed professional in those fields.'

export function getAdvisoryDisclosure(): string {
  const env = process.env.ADVISORY_DISCLOSURE_TEXT?.trim()
  return env && env.length > 0 ? env : DEFAULT_DISCLOSURE_TEXT
}

// Phase 2 booking constants — defined here so the slot-window rules and timezone
// are auditable in one place. SlotPicker / Calendar API both read these.
export const ADVISORY_TIMEZONE = 'America/Chicago' as const
export const ADVISORY_SLOT_WINDOWS = [
  { dayOfWeek: 2, times: ['09:00', '10:30'] }, // Tuesday
  { dayOfWeek: 4, times: ['13:00', '14:30'] }, // Thursday
] as const
export const ADVISORY_BOOKING_LEAD_HOURS = 48
export const ADVISORY_MAX_SLOTS_PER_WEEK = 4
export const ADVISORY_MAX_SLOTS_PER_MONTH = 8

// Phase 2: Phase 1 placeholder /advisory/book page reads this to tell users when
// real booking opens. Update the date when Phase 2 ships.
export const ADVISORY_BOOKING_OPENS_LABEL = 'soon'
