import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { slugifyBuilder } from '@/lib/builder-slug'
import { streetOnly, sanitizeFreeText } from '@/lib/permit-search'
import { ZIP_META_MAP } from '@/lib/pipeline-zips'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_EACH = 6
const MIN_QUERY = 2

/**
 * Grouped typeahead over the permit corpus: builders, ZIPs, streets.
 *
 * Public by design — every field returned here is already public on the map
 * (builder name, ZIP, street name). House numbers never appear: street labels
 * go through the same streetOnly() redaction the search results use.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('q') ?? ''
  const q = sanitizeFreeText(raw)

  if (q.length < MIN_QUERY) {
    return NextResponse.json({ builders: [], zips: [], streets: [] })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ builders: [], zips: [], streets: [] }, { status: 500 })
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const [grouped, addressRows] = await Promise.all([
    supabase.rpc('pipeline_search_suggest', { q, max_each: MAX_EACH }),
    // Streets are derived in TS so the house-number redaction has exactly one
    // implementation. Cap the scan — this is a typeahead, not a report.
    supabase
      .from('building_permits')
      .select('address')
      .ilike('address', `%${q}%`)
      .limit(400),
  ])

  if (grouped.error) {
    console.error('[pipeline/suggest] rpc failed:', grouped.error.message)
  }

  const g = (grouped.data ?? {}) as {
    builders?: { label: string; count: number }[]
    zips?: { label: string; count: number }[]
  }

  const streetCounts = new Map<string, number>()
  for (const row of (addressRows.data ?? []) as { address: string | null }[]) {
    const street = streetOnly(row.address)
    if (!street) continue
    streetCounts.set(street, (streetCounts.get(street) ?? 0) + 1)
  }

  const streets = Array.from(streetCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_EACH)
    .map(([label, count]) => ({ label, count }))

  return NextResponse.json(
    {
      builders: (g.builders ?? []).map((b) => ({
        label: b.label,
        count: b.count,
        slug: slugifyBuilder(b.label),
      })),
      zips: (g.zips ?? []).map((z) => ({
        label: z.label,
        count: z.count,
        name: ZIP_META_MAP[z.label]?.name ?? null,
      })),
      streets,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
