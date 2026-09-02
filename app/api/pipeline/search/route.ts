import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAgentAuthed } from '@/lib/agent-auth'
import { slugifyBuilder, isRealBuilder } from '@/lib/builder-slug'
import {
  parseSearchCriteria,
  computeCoverage,
  toPublicResult,
  toAgentResult,
  toCsv,
  PUBLIC_SELECT,
  AGENT_SELECT,
  MAX_PAGE_SIZE,
  type PermitRow,
  type PermitSearchCriteria,
  type AgentPermitResult,
} from '@/lib/permit-search'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Permit search over the cached building_permits table.
 *
 * Two surfaces, one query path:
 *   public  — street name only, no house number, no parcel, no coordinates
 *   agent   — full address, parcel, coordinates, CSV export
 *
 * The agent surface is gated on the server before the query runs and the wider
 * column set is never selected for an unauthenticated caller. This route uses
 * the service role key deliberately: the browser Supabase client can read
 * building_permits under the "Public read access" RLS policy, so redaction
 * cannot live in the database without breaking BuilderCard. It lives here, and
 * the agent payload is only ever assembled after isAgentAuthed() returns true.
 */

/**
 * Structural view of the PostgREST builder. The generated types can't follow a
 * `select()` whose column list is chosen at runtime, and CLAUDE.md forbids
 * `any` — this keeps the chain checked without fighting the parser.
 */
interface PermitQuery {
  or(filter: string): PermitQuery
  in(column: string, values: readonly unknown[]): PermitQuery
  gte(column: string, value: unknown): PermitQuery
  lte(column: string, value: unknown): PermitQuery
  eq(column: string, value: unknown): PermitQuery
  order(column: string, opts: { ascending: boolean; nullsFirst?: boolean }): PermitQuery
  range(
    from: number,
    to: number,
  ): PromiseLike<{
    data: unknown[] | null
    error: { message: string } | null
    count: number | null
  }>
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase service credentials')
  return createClient(url, key, { auth: { persistSession: false } })
}

function applyCriteria(query: PermitQuery, c: PermitSearchCriteria): PermitQuery {
  let q = query

  if (c.q) q = q.or(`address.ilike.%${c.q}%,contractor.ilike.%${c.q}%`)
  if (c.zips.length) q = q.in('zip', c.zips)
  if (c.propertyTypes.length) q = q.in('property_type', c.propertyTypes)
  if (c.costMin !== null) q = q.gte('construction_cost', c.costMin)
  if (c.costMax !== null) q = q.lte('construction_cost', c.costMax)
  if (c.sqftMin !== null) q = q.gte('sqft', c.sqftMin)
  if (c.sqftMax !== null) q = q.lte('sqft', c.sqftMax)
  if (c.bedroomsMin !== null) q = q.gte('bedrooms', c.bedroomsMin)
  if (c.bathroomsMin !== null) q = q.gte('bathrooms', c.bathroomsMin)
  if (c.dateFrom) q = q.gte('date_issued', `${c.dateFrom}T00:00:00Z`)
  if (c.dateTo) q = q.lte('date_issued', `${c.dateTo}T23:59:59.999Z`)
  if (c.contractorKey) q = q.eq('contractor_key', c.contractorKey)

  return q
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const criteria = parseSearchCriteria(url.searchParams)
  const wantsCsv = url.searchParams.get('format') === 'csv'

  // Gate resolved BEFORE any query is built, so the agent column set is never
  // selected for a caller who has not passed the cookie check.
  const isAgent = await isAgentAuthed()

  if (wantsCsv && !isAgent) {
    return NextResponse.json(
      { error: 'CSV export is available to House Haven agents only.' },
      { status: 403 },
    )
  }

  let supabase: ReturnType<typeof serviceClient>
  try {
    supabase = serviceClient()
  } catch {
    return NextResponse.json({ error: 'Search is unavailable' }, { status: 500 })
  }

  const select = isAgent ? AGENT_SELECT : PUBLIC_SELECT

  // CSV exports the whole matched set, capped, rather than one page.
  const pageSize = wantsCsv ? 1000 : criteria.pageSize
  const from = wantsCsv ? 0 : (criteria.page - 1) * criteria.pageSize
  const to = from + pageSize - 1

  const base = supabase
    .from('building_permits')
    .select(select, { count: 'exact' }) as unknown as PermitQuery
  const filtered = applyCriteria(base, criteria)

  const { data, error, count } = await filtered
    .order(criteria.sort, { ascending: criteria.direction === 'asc', nullsFirst: false })
    .order('permit_number', { ascending: true })
    .range(from, to)

  if (error) {
    console.error('[pipeline/search] query failed:', error.message)
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 },
    )
  }

  const rows = (data ?? []) as unknown as PermitRow[]

  if (wantsCsv) {
    const results = rows.map((r) => toAgentResult(r, slugifyBuilder, isRealBuilder))
    return new NextResponse(toCsv(results as AgentPermitResult[]), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="nashville-pipeline-permits-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  // Coverage is measured, never asserted — see computeCoverage.
  const headCount = (col: string | null) => {
    let q = supabase.from('building_permits').select('permit_number', { count: 'exact', head: true })
    if (col) q = q.not(col, 'is', null)
    return q
  }
  const [{ data: minRow }, { data: maxRow }, allN, bedsN, bathsN, sqftN] = await Promise.all([
    supabase
      .from('building_permits')
      .select('date_issued')
      .not('date_issued', 'is', null)
      .order('date_issued', { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('building_permits')
      .select('date_issued')
      .not('date_issued', 'is', null)
      .order('date_issued', { ascending: false })
      .limit(1)
      .maybeSingle(),
    headCount(null),
    headCount('bedrooms'),
    headCount('bathrooms'),
    headCount('sqft'),
  ])

  const recorded = {
    total: allN.count ?? 0,
    bedrooms: bedsN.count ?? 0,
    bathrooms: bathsN.count ?? 0,
    sqft: sqftN.count ?? 0,
  }

  const total = count ?? 0
  const results = isAgent
    ? rows.map((r) => toAgentResult(r, slugifyBuilder, isRealBuilder))
    : rows.map((r) => toPublicResult(r, slugifyBuilder, isRealBuilder))

  return NextResponse.json(
    {
      surface: isAgent ? 'agent' : 'public',
      results,
      page: criteria.page,
      pageSize: criteria.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / criteria.pageSize)),
      sort: criteria.sort,
      direction: criteria.direction,
      maxPageSize: MAX_PAGE_SIZE,
      coverage: computeCoverage(
        (minRow as { date_issued: string } | null)?.date_issued ?? null,
        (maxRow as { date_issued: string } | null)?.date_issued ?? null,
        recorded,
      ),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
