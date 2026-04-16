import type { Metadata } from 'next'
import { fetchRecentPermits } from '@/lib/permits'
import NewConstructionMap from './NewConstructionMap'

export const metadata: Metadata = {
  title: 'New Construction Homes in Nashville — Live Permit Map',
  description:
    "See every active residential building permit across the Nashville metro. House Haven Realty's exclusive new construction map pulls live data from Metro Nashville's open data portal.",
}

export const revalidate = 21600 // 6 hours

export default async function NewConstructionPage() {
  const permits = await fetchRecentPermits({ days: 180, limit: 500 })

  // Pre-compute stats for the header
  const totalCost = permits.reduce(
    (sum, p) => sum + (p.constructionCost || 0),
    0,
  )
  const avgCost = permits.length ? totalCost / permits.length : 0

  const zipCounts = permits.reduce<Record<string, number>>((acc, p) => {
    if (!p.zip) return acc
    acc[p.zip] = (acc[p.zip] || 0) + 1
    return acc
  }, {})
  const topZips = Object.entries(zipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  const availableZips = Object.keys(zipCounts).sort()

  return (
    <NewConstructionMap
      permitCount={permits.length}
      avgCost={avgCost}
      topZips={topZips}
      availableZips={availableZips}
    />
  )
}
