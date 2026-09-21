// Google Business Profile rating, shown on the homepage proof section.
//
// Held as data rather than fetched: there is no GOOGLE_PLACES_API_KEY on the
// project, and a hardcoded number that drifts is its own kind of lie. So the
// figures carry the date they were verified, the UI states that date, and
// updating means editing this one file. Wire lib/places.ts to the Places API
// later and these become the fallback, not the source.
//
// Deliberately NOT emitted as schema.org AggregateRating. Google does not
// support self-serving review markup — a business rating its own Organization
// or LocalBusiness — and marking it up risks suppressing the rich results the
// site already earns from its other schema. The rating is shown to people, not
// claimed to crawlers.

export interface GoogleReviewSummary {
  /** Mean rating out of 5, as shown on the Business Profile. */
  rating: number
  /** Total review count on the Business Profile. */
  count: number
  /** ISO date the figures above were last read off the profile. */
  verifiedOn: string
  /**
   * Google Place ID. When set, the read and write links below become exact
   * deep links into the profile's reviews. Until then they fall back to a
   * Maps search for the business, which resolves but is less direct.
   */
  placeId: string
}

export const googleReviews: GoogleReviewSummary = {
  rating: 5.0,
  count: 31,
  verifiedOn: '2026-09-21',
  placeId: '',
}

const MAPS_SEARCH =
  'https://www.google.com/maps/search/?api=1&query=House+Haven+Realty+5016+Centennial+Blvd+Nashville+TN'

/** Where "read the reviews" points. */
export function googleReviewsUrl(r: GoogleReviewSummary = googleReviews): string {
  return r.placeId
    ? `https://search.google.com/local/reviews?placeid=${r.placeId}`
    : MAPS_SEARCH
}

/** Where "leave a review" points. */
export function googleWriteReviewUrl(r: GoogleReviewSummary = googleReviews): string {
  return r.placeId
    ? `https://search.google.com/local/writereview?placeid=${r.placeId}`
    : MAPS_SEARCH
}

/**
 * How full each of five stars should render, 0–1, left to right.
 * A 4.6 gives [1, 1, 1, 1, 0.6] — so the display stays truthful if the rating
 * ever moves off 5.0, rather than rounding a 4.5 up to five solid stars.
 */
export function starFills(rating: number): number[] {
  const clamped = Math.max(0, Math.min(5, rating))
  return Array.from({ length: 5 }, (_, i) => {
    const fill = Math.max(0, Math.min(1, clamped - i))
    // Subtracting floats leaves 0.20000000000000018, which would reach the
    // gradient stop as "20.000000000000018%".
    return Math.round(fill * 1000) / 1000
  })
}
