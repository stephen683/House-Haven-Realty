import { describe, it, expect } from 'vitest'
import { PLACE_SUGGESTIONS } from '@/lib/place-suggestions'
import { findPlaces, scoreLead } from '@/lib/lead-score'

// The suggestions shown in a form and the vocabulary the scorer recognises are
// two lists that must not drift. Offering a place the scorer does not know
// would penalise exactly the people who took the hint.

describe('form suggestions and scorer vocabulary agree', () => {
  for (const place of PLACE_SUGGESTIONS) {
    it(`"${place}" is recognised by the scorer`, () => {
      const found = findPlaces(place)
      expect(found.strong.length + found.ambiguous.length).toBeGreaterThan(0)
    })
  }

  it('a buyer who picks a suggestion reaches the inbox', () => {
    for (const place of PLACE_SUGGESTIONS) {
      const r = scoreLead({
        message: `Areas: ${place}\nBudget: $600k\nBeds: 3+`,
        source: 'home_search',
        budget: '$600k',
      })
      expect(r.band, `${place} → ${r.band}`).toBe('inbox')
    }
  })

  it('is sorted and free of duplicates', () => {
    expect(PLACE_SUGGESTIONS).toEqual(Array.from(new Set(PLACE_SUGGESTIONS)))
    expect(PLACE_SUGGESTIONS).toEqual([...PLACE_SUGGESTIONS].sort((a, b) => a.localeCompare(b)))
  })
})
