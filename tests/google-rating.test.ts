import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  googleReviews,
  googleReviewsUrl,
  googleWriteReviewUrl,
  starFills,
} from '../data/reviews'

describe('google rating', () => {
  it('fills five solid stars at 5.0', () => {
    expect(starFills(5)).toEqual([1, 1, 1, 1, 1])
  })

  it('shows a partial star rather than rounding up', () => {
    // The failure that matters: a 4.5 rendered as five solid stars would
    // overstate the rating on a page about being honest with sellers.
    expect(starFills(4.5)).toEqual([1, 1, 1, 1, 0.5])
    expect(starFills(4.6)[4]).toBeCloseTo(0.6, 5)
    expect(starFills(3.2)).toEqual([1, 1, 1, 0.2, 0])
  })

  it('clamps out-of-range ratings instead of rendering broken geometry', () => {
    expect(starFills(0)).toEqual([0, 0, 0, 0, 0])
    expect(starFills(7)).toEqual([1, 1, 1, 1, 1])
    expect(starFills(-2)).toEqual([0, 0, 0, 0, 0])
  })

  it('always returns five values', () => {
    for (const r of [0, 1.1, 2.7, 4.999, 5]) expect(starFills(r)).toHaveLength(5)
  })

  it('carries the date the figures were verified', () => {
    expect(googleReviews.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isFinite(googleReviews.rating)).toBe(true)
    expect(googleReviews.rating).toBeGreaterThan(0)
    expect(googleReviews.rating).toBeLessThanOrEqual(5)
    expect(Number.isInteger(googleReviews.count)).toBe(true)
  })

  it('falls back to a resolvable link when no Place ID is set', () => {
    expect(googleReviewsUrl()).toMatch(/^https:\/\//)
    expect(googleWriteReviewUrl()).toMatch(/^https:\/\//)
  })

  it('uses exact profile deep links once a Place ID is set', () => {
    const withId = { ...googleReviews, placeId: 'ChIJtest123' }
    expect(googleReviewsUrl(withId)).toContain('placeid=ChIJtest123')
    expect(googleWriteReviewUrl(withId)).toContain('writereview?placeid=ChIJtest123')
  })

  it('stays inside the locked brand palette — no gold stars, no four-colour mark', () => {
    const src = readFileSync('components/sections/GoogleRating.tsx', 'utf8')
    // The header comment names the colours we are avoiding, so assert against
    // code with comments stripped rather than the raw file.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).not.toMatch(/amber|yellow|gold|fbbc0[45]|4285[Ff]4|34[Aa]853|[Ee][Aa]4335/i)
    expect(code).toContain('househaven-navy')
  })

  it('does not emit self-serving AggregateRating markup', () => {
    // Google does not support a business rating its own Organization or
    // LocalBusiness; marking it up risks the rich results the site already earns.
    for (const f of ['components/sections/GoogleRating.tsx', 'app/page.tsx', 'components/seo/OrganizationJsonLd.tsx']) {
      expect(readFileSync(f, 'utf8'), `${f} must not claim AggregateRating`)
        .not.toContain('AggregateRating')
    }
  })

  it('keeps the rating and the testimonials as separate claims', () => {
    // The seven testimonials predate the Business Profile and are not the 31
    // Google reviews; the page must not imply they are the same set.
    const page = readFileSync('app/page.tsx', 'utf8')
    expect(page).toContain('GoogleRating')
    expect(page).toContain('TestimonialCarousel')
    const badge = readFileSync('components/sections/GoogleRating.tsx', 'utf8')
    expect(badge).toContain('Google reviews')
  })
})
