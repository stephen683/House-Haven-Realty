import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchRecentPermits } from '@/lib/permits'

export const runtime = 'nodejs'
export const maxDuration = 60 // allow up to 60s for large fetches

/**
 * Vercel Cron job — runs daily to sync Nashville building permits
 * into Supabase, decoupling the permit map from live API availability.
 *
 * Configured in vercel.json: "crons": [{ "path": "/api/cron/sync-permits", "schedule": "0 6 * * *" }]
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
    // Fetch last 180 days of permits (large window for backfill)
    const permits = await fetchRecentPermits({ days: 180, limit: 1000 })

    if (permits.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No permits returned from Socrata API',
        synced: 0,
      })
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

    // Batch upsert in chunks of 100
    let upserted = 0
    for (let i = 0; i < rows.length; i += 100) {
      const chunk = rows.slice(i, i + 100)
      const { error } = await supabase
        .from('building_permits')
        .upsert(chunk, { onConflict: 'permit_number' })

      if (error) {
        console.error(`[cron/sync-permits] chunk ${i} failed:`, error.message)
      } else {
        upserted += chunk.length
      }
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
