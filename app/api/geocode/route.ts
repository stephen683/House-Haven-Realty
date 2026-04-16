import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ARCGIS_GEOCODE =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'

// Nashville metro bounding box
const NASHVILLE_BBOX = '-87.05,35.96,-86.51,36.40'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { address, magicKey } = body as {
    address?: string
    magicKey?: string
  }

  if (!address) {
    return NextResponse.json(
      { error: 'address is required' },
      { status: 400 },
    )
  }

  try {
    const params = new URLSearchParams({
      SingleLine: address,
      f: 'json',
      maxLocations: '1',
      searchExtent: NASHVILLE_BBOX,
      outFields: 'Addr_type,StAddr,City,RegionAbbr,Postal',
    })
    if (magicKey) params.set('magicKey', magicKey)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${ARCGIS_GEOCODE}?${params}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Geocoding failed' },
        { status: 502 },
      )
    }

    const data = await res.json()
    const candidate = data.candidates?.[0]

    if (!candidate) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      latitude: candidate.location.y,
      longitude: candidate.location.x,
      formatted_address:
        candidate.attributes?.StAddr && candidate.attributes?.City
          ? `${candidate.attributes.StAddr}, ${candidate.attributes.City}, ${candidate.attributes.RegionAbbr || 'TN'} ${candidate.attributes.Postal || ''}`
          : candidate.address,
    })
  } catch {
    return NextResponse.json(
      { error: 'Geocoding timeout' },
      { status: 504 },
    )
  }
}
