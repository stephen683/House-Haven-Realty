// Learn library taxonomy.
//
// Two orthogonal axes per article: WHAT (category) × WHEN (stage). Together
// they classify each piece by reader job-to-be-done. Stored separately from
// the article body so the 1800-line content file does not need wholesale
// editing when the taxonomy evolves; pages combine them at render time.
//
// FSBO category currently has zero articles by design — Stephen will write
// the FSBO topic list. Until then the category-filter UI shows an empty
// state ("No FSBO articles yet — first one coming soon").

import type { AdvisoryTrackSlug } from '@/lib/advisory-config'

export type LearnCategory = 'fsbo' | 'buying' | 'sell-or-rent' | 'nashville-market'

export type LearnStage = 'research' | 'decision' | 'action'

export const LEARN_CATEGORIES: { slug: LearnCategory; label: string; description: string }[] = [
  {
    slug: 'fsbo',
    label: 'FSBO',
    description: 'Selling your home yourself — pricing, paperwork, marketing reality.',
  },
  {
    slug: 'buying',
    label: 'Buying',
    description: 'Pre-approval, neighborhoods, contracts, closing — what to ask and when.',
  },
  {
    slug: 'sell-or-rent',
    label: 'Sell or Rent',
    description: 'Cash-flow math, tax framing, conversion playbooks for primary residences.',
  },
  {
    slug: 'nashville-market',
    label: 'Nashville Market',
    description: 'Market reports, neighborhood guides, taxes, relocation context.',
  },
]

export const LEARN_STAGES: { slug: LearnStage; label: string; description: string }[] = [
  {
    slug: 'research',
    label: 'Research',
    description: 'Building the picture — facts and frameworks before any decision is on the table.',
  },
  {
    slug: 'decision',
    label: 'Decision',
    description: 'A specific call you are about to make, with the trade-offs named.',
  },
  {
    slug: 'action',
    label: 'Action',
    description: 'Step-by-step guidance for something you are doing now.',
  },
]

interface TaxonomyEntry {
  category: LearnCategory
  stage: LearnStage
  // Optional: which Advisory track the article cross-promotes
  advisoryTrack?: AdvisoryTrackSlug
}

// Slug → (category, stage, optional advisoryTrack). Articles not in the map
// fall through to the default ('nashville-market' / 'research').
export const LEARN_TAXONOMY: Record<string, TaxonomyEntry> = {
  // Buying — research / decision
  'first-time-buyer-programs-tn': {
    category: 'buying',
    stage: 'decision',
    advisoryTrack: 'buyer-roadmap',
  },
  'rent-vs-buy-nashville-2026': {
    category: 'buying',
    stage: 'decision',
    advisoryTrack: 'buyer-roadmap',
  },
  'new-construction-contracts-nashville': {
    category: 'buying',
    stage: 'action',
    advisoryTrack: 'buyer-roadmap',
  },
  'best-neighborhoods-nashville-families-2026': {
    category: 'buying',
    stage: 'research',
    advisoryTrack: 'buyer-roadmap',
  },
  'nashville-home-inspection-guide': {
    category: 'buying',
    stage: 'action',
    advisoryTrack: 'buyer-roadmap',
  },
  'nashville-new-construction-what-to-know': {
    category: 'buying',
    stage: 'research',
    advisoryTrack: 'buyer-roadmap',
  },
  'nashville-closing-costs-explained': {
    category: 'buying',
    stage: 'decision',
    advisoryTrack: 'buyer-roadmap',
  },
  'how-to-choose-nashville-real-estate-agent': {
    category: 'buying',
    stage: 'decision',
  },
  'nashville-hoa-guide': {
    category: 'buying',
    stage: 'research',
  },
  'nashville-va-loan-guide': {
    category: 'buying',
    stage: 'decision',
    advisoryTrack: 'buyer-roadmap',
  },
  'understanding-nashville-flood-zones': {
    category: 'buying',
    stage: 'research',
  },

  // Sell-or-Rent
  'selling-your-nashville-home-spring-2026': {
    category: 'sell-or-rent',
    stage: 'decision',
    advisoryTrack: 'sell-or-rent',
  },
  'nashville-investment-property-guide-2026': {
    category: 'sell-or-rent',
    stage: 'research',
    advisoryTrack: 'sell-or-rent',
  },
  'downsizing-in-nashville': {
    category: 'sell-or-rent',
    stage: 'decision',
    advisoryTrack: 'sell-or-rent',
  },

  // Nashville market — research and reports
  'moving-to-nashville-2026': {
    category: 'nashville-market',
    stage: 'research',
  },
  'nashville-market-report-april-2026': {
    category: 'nashville-market',
    stage: 'research',
  },
  'nashville-property-tax-guide-2026': {
    category: 'nashville-market',
    stage: 'research',
  },
  'best-nashville-suburbs-commuters': {
    category: 'nashville-market',
    stage: 'research',
  },
  'nashville-relocation-guide-remote-workers': {
    category: 'nashville-market',
    stage: 'research',
  },
  'nashville-real-estate-market-forecast-2026': {
    category: 'nashville-market',
    stage: 'research',
  },
  'living-in-franklin-tn-2026': {
    category: 'nashville-market',
    stage: 'research',
  },
  'living-in-brentwood-tn': {
    category: 'nashville-market',
    stage: 'research',
  },
  'mt-juliet-tn-guide': {
    category: 'nashville-market',
    stage: 'research',
  },
  'hendersonville-tn-guide': {
    category: 'nashville-market',
    stage: 'research',
  },
  'spring-hill-tn-guide': {
    category: 'nashville-market',
    stage: 'research',
  },
}

export function getLearnTaxonomy(slug: string): TaxonomyEntry {
  return LEARN_TAXONOMY[slug] ?? { category: 'nashville-market', stage: 'research' }
}

export function isValidCategory(s: string | null | undefined): s is LearnCategory {
  return (
    s === 'fsbo' ||
    s === 'buying' ||
    s === 'sell-or-rent' ||
    s === 'nashville-market'
  )
}

export function isValidStage(s: string | null | undefined): s is LearnStage {
  return s === 'research' || s === 'decision' || s === 'action'
}

// Greatest Hits curation list. Phase 4 ships this empty.
// Stephen delivers an 8–12 piece list with reader-job-to-be-done framing
// per /reports/2026-05-06-greatest-hits-curation-ask.md. Each entry is a
// post slug paired with the job-to-be-done that piece serves.
export interface GreatestHitsEntry {
  slug: string
  jobToBeDone: string
}

export const GREATEST_HITS: GreatestHitsEntry[] = [
  // Stephen: paste your 8–12 picks here.
]
