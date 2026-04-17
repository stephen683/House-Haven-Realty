import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getValuation, normalizeAddress, type RentCastValuation } from '@/lib/rentcast'

export const runtime = 'nodejs'

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  let body: { address?: string; lat?: number; lng?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const address = body.address?.trim()
  if (!address || address.length < 6) {
    return NextResponse.json({ error: 'Address required.' }, { status: 400 })
  }

  const normalized = normalizeAddress(address)

  let valuation: RentCastValuation | null = null
  let cacheHit = false

  try {
    const supabase = await createServerClient()
    const { data: cached } = await supabase
      .from('valuation_cache')
      .select('estimate_low, estimate_mid, estimate_high, comps, confidence_note, fetched_at')
      .eq('address_normalized', normalized)
      .limit(1)
      .maybeSingle()

    if (cached && Date.now() - new Date(cached.fetched_at).getTime() < CACHE_TTL_MS) {
      valuation = {
        mid: cached.estimate_mid,
        low: cached.estimate_low,
        high: cached.estimate_high,
        comps: cached.comps ?? [],
        confidenceNote: cached.confidence_note ?? '',
        source: 'rentcast',
      }
      cacheHit = true
    }
  } catch (err) {
    console.error('[value] cache read failed', err)
  }

  if (!valuation) {
    valuation = await getValuation(address)
  }

  if (!cacheHit && valuation.source === 'rentcast') {
    try {
      const supabase = await createServerClient()
      await supabase
        .from('valuation_cache')
        .upsert({
          address_normalized: normalized,
          latitude: body.lat ?? null,
          longitude: body.lng ?? null,
          estimate_low: valuation.low,
          estimate_mid: valuation.mid,
          estimate_high: valuation.high,
          comps: valuation.comps,
          confidence_note: valuation.confidenceNote,
          fetched_at: new Date().toISOString(),
        }, { onConflict: 'address_normalized' })
    } catch (err) {
      console.error('[value] cache write failed', err)
    }
  }

  return NextResponse.json({
    ok: true,
    cached: cacheHit,
    estimate: {
      low: valuation.low,
      mid: valuation.mid,
      high: valuation.high,
    },
    comps: valuation.comps,
    confidenceNote: valuation.confidenceNote,
    source: valuation.source,
  })
}
