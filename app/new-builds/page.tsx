import type { Metadata } from 'next'
import { fetchRecentPermits, fetchAllPermits } from '@/lib/permits'
import { computeSaturationScores } from '@/lib/saturation-score'
import NashBuildsApp from './NashBuildsApp'

export const metadata: Metadata = {
  title: 'NashBuilds — Nashville New Construction Map',
  description:
    'Every new residential building permit in Nashville, mapped in real time. Filter by beds, baths, sqft, builder, and ZIP. See what\'s being built before it hits the MLS. By House Haven Realty.',
  alternates: { canonical: '/new-builds' },
}

export const revalidate = 21600 // 6 hours

export default async function NashBuildsPage() {
  const [permits, allPermits] = await Promise.all([
    fetchRecentPermits({ days: 180, limit: 500 }),
    fetchAllPermits({ days: 365, limit: 2000 }),
  ])

  const scores = computeSaturationScores(allPermits)

  // Pre-compute stats
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

  // Top builders
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
    <NashBuildsApp
      permitCount={permits.length}
      avgCost={avgCost}
      avgSqft={avgSqft}
      availableZips={availableZips}
      topBuilders={topBuilders}
      topScores={scores.slice(0, 5)}
    />
  )
}
