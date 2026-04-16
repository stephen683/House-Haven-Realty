import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentPermits } from '@/lib/permits'
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
          description: p.description,
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
        },
      })),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') || '180')
  const limit = Number(searchParams.get('limit') || '500')

  const permits = await fetchRecentPermits({ days, limit })
  const geojson = toGeoJSON(permits)

  return NextResponse.json(geojson, {
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
    },
  })
}
