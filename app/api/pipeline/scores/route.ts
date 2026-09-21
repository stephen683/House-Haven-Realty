import { NextResponse } from 'next/server'
import { loadPermitCorpus } from '@/lib/permit-repo'
import { computeSaturationScores } from '@/lib/saturation-score'

export const runtime = 'nodejs'
export const revalidate = 21600 // 6 hours

export async function GET() {
  const permits = await loadPermitCorpus({ days: 365 })
  const scores = computeSaturationScores(permits)

  return NextResponse.json({
    scores,
    meta: {
      totalPermits: permits.length,
      zipsScored: scores.length,
      updatedAt: new Date().toISOString(),
    },
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
    },
  })
}
