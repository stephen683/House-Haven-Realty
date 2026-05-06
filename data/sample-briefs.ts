// Placeholder pattern for the homepage "What you walk away with" section.
// Stephen swaps `status` → 'published' and provides `bottomLine` excerpt as
// each anonymized sample Decision Brief is written. No code changes required.
//
// Status timeline (Stephen's commitment):
//   - FSBO          — end of Phase 1
//   - Buyer Roadmap — end of Phase 2
//   - Sell-or-Rent  — end of Phase 3
//
// While `status === 'placeholder'`, the homepage component renders a
// "Sample Brief in production" banner instead of fabricated content.

import type { AdvisoryTrackSlug } from '@/lib/advisory-config'

export interface SampleBriefSnippet {
  trackSlug: AdvisoryTrackSlug
  trackName: string
  // The 1-2 sentence bottom-line excerpt that appears on the homepage card.
  // Set to null while status === 'placeholder'.
  bottomLine: string | null
  status: 'placeholder' | 'published'
}

export const SAMPLE_BRIEF_SNIPPETS: SampleBriefSnippet[] = [
  {
    trackSlug: 'fsbo',
    trackName: 'FSBO Sanity-Check',
    bottomLine: null,
    status: 'placeholder',
  },
  {
    trackSlug: 'buyer-roadmap',
    trackName: 'Buyer Roadmap',
    bottomLine: null,
    status: 'placeholder',
  },
  {
    trackSlug: 'sell-or-rent',
    trackName: 'Sell-or-Rent',
    bottomLine: null,
    status: 'placeholder',
  },
]
