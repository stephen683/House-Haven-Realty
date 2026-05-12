// Homepage copy. Candidate C selected 2026-05-12 per
// /reports/2026-05-08-homepage-hero-candidates.md. Alternates A and B stay
// in that report. Primary CTA = "Talk to Stephen"; secondary points to
// /homes-for-sale.

export const HOMEPAGE_HEADLINE = 'Buy. Sell. Advise. Hold.'

export const HOMEPAGE_SUBHEAD =
  'A Nashville brokerage that handles the four real-estate decisions you actually have. Buyer representation. Seller representation. Hire-by-the-hour Advisory. Property management through our sister company Door Collectors.'

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
