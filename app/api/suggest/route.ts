import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Nashville metro bounding box
const NASHVILLE_BBOX = '-87.05,35.96,-86.51,36.40'
const ARCGIS_SUGGEST =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const params = new URLSearchParams({
      text: q,
      f: 'json',
      maxSuggestions: '6',
      searchExtent: NASHVILLE_BBOX,
      countryCode: 'USA',
      category: 'Address,Postal',
    })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(`${ARCGIS_SUGGEST}?${params}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] })
    }

    const data = await res.json()
    const suggestions: { text: string; magicKey: string }[] = (
      data.suggestions || []
    ).map((s: { text: string; magicKey: string }) => ({
      text: s.text,
      magicKey: s.magicKey,
    }))

    // Deduplicate unit variations (e.g. "123 Main St Apt 1" → "123 Main St")
    const seen = new Set<string>()
    const deduped = suggestions.filter((s) => {
      const base = s.text.replace(/\s*(apt|unit|ste|suite|#)\s*\S+/i, '').trim()
      if (seen.has(base)) return false
      seen.add(base)
      return true
    })

    return NextResponse.json({ suggestions: deduped })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
