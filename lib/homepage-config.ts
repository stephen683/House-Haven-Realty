// Homepage copy that Stephen swaps without code changes. Headline default is
// Candidate A from /reports/2026-05-08-homepage-hero-candidates.md. Switching
// to Candidate B or C is a string edit here. Primary CTA defaults to
// "Talk to Stephen"; secondary points to /homes-for-sale.

export const HOMEPAGE_HEADLINE =
  'A small Nashville brokerage. Five hundred clients in. Still picky about the next one.'

export const HOMEPAGE_SUBHEAD =
  "We've closed 500+ homes and $250M in volume since 2016. We work as full-representation buyer's and seller's agents, hire-by-the-hour Advisory, and (with our sister company Door Collectors) property management. Nashville-based, Stephen-owned."

export const HOMEPAGE_EYEBROW =
  'House Haven Realty · Nashville, Tennessee'

export const HOMEPAGE_TRUST_LINE =
  'Licensed Tennessee brokerage · 500+ homes closed · $250M+ sold · Nashville-based since 2016'

export interface HomepageCTA {
  label: string
  href: string
}

export const HOMEPAGE_PRIMARY_CTA: HomepageCTA = {
  label: 'Talk to Stephen',
  href: 'tel:+16156244766',
}

export const HOMEPAGE_SECONDARY_CTA: HomepageCTA = {
  label: 'See homes for sale in Nashville',
  href: '/homes-for-sale',
}
