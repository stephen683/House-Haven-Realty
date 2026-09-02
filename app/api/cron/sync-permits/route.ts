import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchRecentPermits } from '@/lib/permits'

export const runtime = 'nodejs'

/** A build runs 6-12 months, so a year is the useful corpus for search. */
const SYNC_WINDOW_DAYS = 365
const SYNC_MAX_RECORDS = 6000
const UPSERT_CHUNK = 500
export const maxDuration = 300 // 4 ArcGIS pages + ~4k upserts

/**
 * Vercel Cron job — runs daily to sync Nashville building permits
 * into Supabase, decoupling the permit map from live API availability.
 *
 * Configured in vercel.json: "crons": [{ "path": "/api/cron/sync-permits", "schedule": "0 6 * * *" }]
 *
 * Every failure path returns a non-2xx with the reason in the body. This route
 * previously reported `{ ok: true, synced: 0 }` on an empty fetch and swallowed
 * per-chunk upsert errors into console.error, which is how building_permits
 * stayed empty for months without any signal.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase credentials' },
      { status: 500 },
    )
  }

  // Use service role client for writes
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // A full year of Davidson County new construction. fetchRecentPermits
    // pages the ArcGIS 1000-row cap, so this is the real count, not the first
    // page of it.
    const permits = await fetchRecentPermits({ days: SYNC_WINDOW_DAYS, limit: SYNC_MAX_RECORDS })

    if (permits.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'ArcGIS returned no permits — nothing to sync',
          fetched: 0,
          upserted: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 502 },
      )
    }

    // Upsert into building_permits table
    const rows = permits.map((p) => ({
      permit_number: p.permitNumber,
      permit_type: p.type,
      subtype: p.subtype,
      date_issued: p.dateIssued,
      address: p.address,
      city: p.city || 'Nashville',
      zip: p.zip,
      description: p.description,
      construction_cost: p.constructionCost,
      contractor: p.contractor,
      status: p.status,
      lat: p.lat,
      lng: p.lng,
      sqft: p.sqft,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      property_type: p.propertyType,
      parcel: p.parcel,
      subdivision: p.subdivision,
      updated_at: new Date().toISOString(),
    }))

    // Batch upsert in chunks. A chunk error aborts the run — a partial
    // sync reported as success is indistinguishable from a working one.
    let upserted = 0
    for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
      const chunk = rows.slice(i, i + UPSERT_CHUNK)
      const { error } = await supabase
        .from('building_permits')
        .upsert(chunk, { onConflict: 'permit_number' })

      if (error) {
        console.error(`[cron/sync-permits] chunk ${i} failed:`, error.message)
        return NextResponse.json(
          {
            ok: false,
            error: 'Upsert failed',
            details: error.message,
            chunkStart: i,
            fetched: permits.length,
            upserted,
            timestamp: new Date().toISOString(),
          },
          { status: 500 },
        )
      }
      upserted += chunk.length
    }

    if (upserted === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'No rows upserted',
          fetched: permits.length,
          upserted: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      fetched: permits.length,
      upserted,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[cron/sync-permits] failed:', err)
    return NextResponse.json(
      { error: 'Sync failed', details: String(err) },
      { status: 500 },
    )
  }
}
