import type { Metadata } from 'next'
import { fetchRecentPermits, fetchAllPermits } from '@/lib/permits'
import { computeSaturationScores } from '@/lib/saturation-score'
import PipelineApp from './PipelineApp'

export const metadata: Metadata = {
  title: 'Nashville Pipeline — Every Home Being Built in Nashville',
  description:
    'See what is being built before it is built. Live building permits across Nashville, mapped daily. Filter by beds, baths, sqft, builder, and ZIP. The House Haven Realty map of Nashville new construction.',
  alternates: { canonical: '/pipeline' },
  openGraph: {
    title: 'Nashville Pipeline — by House Haven Realty',
    description: 'The map of every new home being built in Nashville. Updated daily.',
    url: 'https://househavenrealty.com/pipeline',
    type: 'website',
  },
}

export const revalidate = 21600

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Nashville Pipeline — Nashville Residential Construction Permits',
  description:
    'Live map of every residential building permit issued across Nashville (Davidson County). Updated daily from Metro Nashville Codes Department open data. Maintained by House Haven Realty.',
  url: 'https://househavenrealty.com/pipeline',
  keywords: [
    'Nashville new construction',
    'new homes Nashville',
    'Nashville building permits',
    'Davidson County construction',
  ],
  creator: {
    '@type': 'Organization',
    name: 'House Haven Realty',
    url: 'https://househavenrealty.com',
  },
  license: 'https://creativecommons.org/publicdomain/zero/1.0/',
  isAccessibleForFree: true,
  temporalCoverage: '2020-01-01/..',
  spatialCoverage: {
    '@type': 'Place',
    name: 'Nashville, Davidson County, Tennessee',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.1627,
      longitude: -86.7816,
    },
  },
}

export default async function PipelinePage() {
  const [permits, allPermits] = await Promise.all([
    fetchRecentPermits({ days: 180, limit: 500 }),
    fetchAllPermits({ days: 365, limit: 2000 }),
  ])

  const scores = computeSaturationScores(allPermits)

  const totalCost = permits.reduce((s, p) => s + (p.constructionCost || 0), 0)
  const avgCost = permits.length ? totalCost / permits.length : 0
  const withSpecs = permits.filter((p) => p.bedrooms || p.sqft)
  const avgSqft = withSpecs.length
    ? Math.round(withSpecs.reduce((s, p) => s + (p.sqft || 0), 0) / withSpecs.filter((p) => p.sqft).length)
    : 0

  const zipCounts = permits.reduce<Record<string, number>>((acc, p) => {
    if (!p.zip) return acc
    acc[p.zip] = (acc[p.zip] || 0) + 1
    return acc
  }, {})
  const availableZips = Object.keys(zipCounts).sort()

  const builderCounts = permits.reduce<Record<string, number>>((acc, p) => {
    if (!p.contractor) return acc
    const name = p.contractor.toUpperCase().trim()
    if (name.length < 3) return acc
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})
  const topBuilders = Object.entries(builderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <PipelineApp
        permitCount={permits.length}
        avgCost={avgCost}
        avgSqft={avgSqft}
        availableZips={availableZips}
        topBuilders={topBuilders}
        topScores={scores.slice(0, 5)}
      />
    </>
  )
}
