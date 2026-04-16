// NashBuilds Saturation Score
// Measures new construction activity density per ZIP code.
// Higher score = more building activity = hotter construction market.
//
// Algorithm (modeled after PermitPilot's eligibility scoring):
// 1. Count permits per ZIP in trailing 12 months
// 2. Calculate total construction value per ZIP
// 3. Compute avg construction cost per permit
// 4. Weight by recency (recent permits score higher)
// 5. Normalize to 0-100 scale across all ZIPs

import type { NormalizedPermit } from './permits'

export interface ZipSaturationScore {
  zip: string
  score: number // 0-100
  label: 'Very Hot' | 'Hot' | 'Warm' | 'Moderate' | 'Cool'
  permitCount: number
  totalValue: number
  avgValue: number
  recentCount: number // last 30 days
  topBuilder: string | null
  topPropertyType: string | null
}

function recencyWeight(daysAgo: number): number {
  if (daysAgo <= 30) return 3.0
  if (daysAgo <= 90) return 2.0
  if (daysAgo <= 180) return 1.0
  return 0.5
}

function scoreLabel(score: number): ZipSaturationScore['label'] {
  if (score >= 80) return 'Very Hot'
  if (score >= 60) return 'Hot'
  if (score >= 40) return 'Warm'
  if (score >= 20) return 'Moderate'
  return 'Cool'
}

export function computeSaturationScores(
  permits: NormalizedPermit[],
): ZipSaturationScore[] {
  // Group by ZIP
  const byZip = new Map<string, NormalizedPermit[]>()
  for (const p of permits) {
    if (!p.zip) continue
    const list = byZip.get(p.zip) || []
    list.push(p)
    byZip.set(p.zip, list)
  }

  // Compute raw scores per ZIP
  const rawScores: {
    zip: string
    rawScore: number
    permitCount: number
    totalValue: number
    recentCount: number
    topBuilder: string | null
    topPropertyType: string | null
  }[] = []

  Array.from(byZip.entries()).forEach(([zip, zipPermits]) => {
    // Weighted permit count
    let weightedCount = 0
    let totalValue = 0
    let recentCount = 0
    const builderCounts = new Map<string, number>()
    const typeCounts = new Map<string, number>()

    for (const p of zipPermits) {
      weightedCount += recencyWeight(p.daysAgo)
      totalValue += p.constructionCost || 0
      if (p.daysAgo <= 30) recentCount++

      if (p.contractor) {
        const builder = p.contractor.toUpperCase().trim()
        builderCounts.set(builder, (builderCounts.get(builder) || 0) + 1)
      }
      if (p.propertyType !== 'unknown') {
        typeCounts.set(p.propertyType, (typeCounts.get(p.propertyType) || 0) + 1)
      }
    }

    // Top builder and property type
    const topBuilder = Array.from(builderCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null
    const topPropertyType = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || null

    // Raw score combines volume + value + recency
    const volumeScore = weightedCount
    const valueScore = totalValue / 1_000_000 // $1M = 1 point
    const rawScore = volumeScore * 0.6 + valueScore * 0.3 + recentCount * 0.1

    rawScores.push({
      zip,
      rawScore,
      permitCount: zipPermits.length,
      totalValue,
      recentCount,
      topBuilder,
      topPropertyType,
    })
  })

  // Normalize to 0-100
  const maxRaw = Math.max(...rawScores.map((s) => s.rawScore), 1)

  return rawScores
    .map((s) => {
      const score = Math.round((s.rawScore / maxRaw) * 100)
      return {
        zip: s.zip,
        score,
        label: scoreLabel(score),
        permitCount: s.permitCount,
        totalValue: s.totalValue,
        avgValue: s.permitCount > 0 ? Math.round(s.totalValue / s.permitCount) : 0,
        recentCount: s.recentCount,
        topBuilder: s.topBuilder,
        topPropertyType: s.topPropertyType,
      }
    })
    .sort((a, b) => b.score - a.score)
}
