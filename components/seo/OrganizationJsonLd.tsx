// Renders Organization + LocalBusiness (RealEstateAgent) + WebSite structured data.
// Kept in a single component so the homepage renders all three at once.

const BASE_URL = 'https://househavenrealty.com'

export default function OrganizationJsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${BASE_URL}/#organization`,
    name: 'House Haven Realty',
    url: BASE_URL,
    telephone: '+1-615-624-4766',
    email: 'Stephen@househavenrealty.com',
    image: `${BASE_URL}/images/logo-dark.svg`,
    logo: `${BASE_URL}/images/logo-dark.svg`,
    areaServed: [
      { '@type': 'City', name: 'Nashville' },
      { '@type': 'AdministrativeArea', name: 'Middle Tennessee' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5016 Centennial Blvd Suite 200',
      addressLocality: 'Nashville',
      addressRegion: 'TN',
      postalCode: '37209',
      addressCountry: 'US',
    },
    founder: {
      '@type': 'Person',
      name: 'Stephen Delahoussaye',
      jobTitle: 'Broker | Owner',
    },
    sameAs: [
      'https://www.instagram.com/househavenrealty/',
      'https://www.facebook.com/stephen.delahoussaye',
      'https://www.linkedin.com/company/house-haven-realty-nashville',
    ],
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'House Haven Realty',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/homes-for-sale?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
