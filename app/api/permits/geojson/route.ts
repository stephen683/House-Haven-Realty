import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentPermits } from '@/lib/permits'
import { loadCachedPermits, trimForMap } from '@/lib/permit-repo'
import type { NormalizedPermit } from '@/lib/permits'

export const runtime = 'nodejs'
export const revalidate = 21600 // 6 hours

function toGeoJSON(permits: NormalizedPermit[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: permits
      .filter((p) => p.lat !== null && p.lng !== null)
      .map((p) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.lng!, p.lat!],
        },
        properties: {
          id: p.permitNumber,
          address: p.address,
          city: p.city || 'Nashville',
          zip: p.zip,
          type: p.type,
          subtype: p.subtype,
          description: trimForMap(p.description),
          constructionCost: p.constructionCost,
          contractor: p.contractor,
          status: p.status,
          dateIssued: p.dateIssued,
          daysAgo: p.daysAgo,
          sqft: p.sqft,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          propertyType: p.propertyType,
          parcel: p.parcel,
          subdivision: p.subdivision,
          unitCount: p.unitCount,
        },
      })),
  }
}

/**
 * Map pins. Served from the building_permits cache so the map, the header
 * stats and the search list all show the same corpus. Falls back to the live
 * ArcGIS feed only if the cache is empty — the canary alarms on that state
 * separately, so the fallback is resilience, not a second source of truth.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') || '365')
  const limit = Number(searchParams.get('limit') || '10000')

  let permits = await loadCachedPermits({ limit })
  let source: 'cache' | 'live' = 'cache'

  if (days > 0 && days < 100_000) {
    permits = permits.filter((p) => p.daysAgo <= days)
  }

  if (permits.length === 0) {
    permits = await fetchRecentPermits({ days, limit: Math.min(limit, 6000) })
    source = 'live'
  }

  const geojson = toGeoJSON(permits)

  return NextResponse.json(geojson, {
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
      'X-Permits-Source': source,
    },
  })
}
