import { describe, it, expect, vi, beforeEach } from 'vitest'

// The agent surface (full address, parcel, coordinates, CSV) must be
// unreachable without the server-side cookie check. These tests assert the gate
// holds and that the wider column set is never even requested for the public.

const isAgentAuthed = vi.fn()
vi.mock('@/lib/agent-auth', () => ({
  isAgentAuthed: () => isAgentAuthed(),
}))

interface Recorded {
  select: string | null
  filters: [string, unknown, unknown?][]
  range: [number, number] | null
  orders: [string, boolean][]
}

let recorded: Recorded
let rows: Record<string, unknown>[]

function chain(): Record<string, unknown> {
  const self: Record<string, unknown> = {}
  const rec = (name: string) => (col: string, val?: unknown) => {
    recorded.filters.push([name, col, val])
    return self
  }
  Object.assign(self, {
    select: (cols: string) => {
      if (recorded.select === null) recorded.select = cols
      return self
    },
    or: (f: string) => {
      recorded.filters.push(['or', f])
      return self
    },
    in: rec('in'),
    gte: rec('gte'),
    lte: rec('lte'),
    eq: rec('eq'),
    not: () => self,
    limit: () => self,
    maybeSingle: () => Promise.resolve({ data: { date_issued: '2026-09-01T05:00:00.000Z' } }),
    order: (col: string, o: { ascending: boolean }) => {
      recorded.orders.push([col, o.ascending])
      return self
    },
    range: (a: number, b: number) => {
      recorded.range = [a, b]
      return Promise.resolve({ data: rows, error: null, count: rows.length })
    },
  })
  return self
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => chain() }),
}))

const ROW = {
  permit_number: '2026046406',
  address: '565 A VERITAS ST',
  zip: '37211',
  property_type: 'townhome',
  construction_cost: 329322,
  sqft: 1939,
  bedrooms: 3,
  bathrooms: 2.5,
  date_issued: '2026-09-01T05:00:00.000Z',
  contractor: 'CDM Construction',
  contractor_key: 'CDM CONSTRUCTION',
  status: 'issued',
  parcel: '133050L00100CO',
  subdivision: 'UNIT 1',
  lat: 36.09818455,
  lng: -86.74704602,
}

async function call(query = '') {
  const { GET } = await import('@/app/api/pipeline/search/route')
  return GET(new Request(`https://example.com/api/pipeline/search${query}`))
}

describe('GET /api/pipeline/search', () => {
  beforeEach(() => {
    vi.resetModules()
    isAgentAuthed.mockReset()
    recorded = { select: null, filters: [], range: null, orders: [] }
    rows = [{ ...ROW }]
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  })

  it('public caller gets no house number, parcel, or coordinates', async () => {
    isAgentAuthed.mockResolvedValue(false)
    const res = await call()
    const body = await res.json()
    const raw = JSON.stringify(body)

    expect(res.status).toBe(200)
    expect(body.surface).toBe('public')
    expect(body.results[0].street).toBe('VERITAS ST')
    expect(raw).not.toContain('565 A VERITAS')
    expect(raw).not.toContain('133050L00100CO')
    expect(raw).not.toContain('36.098')
  })

  it('public caller never even selects the parcel/coordinate columns', async () => {
    isAgentAuthed.mockResolvedValue(false)
    await call()
    expect(recorded.select).not.toContain('parcel')
    expect(recorded.select).not.toContain('lat')
    expect(recorded.select).not.toContain('lng')
  })

  it('agent caller gets the full address, parcel, and coordinates', async () => {
    isAgentAuthed.mockResolvedValue(true)
    const res = await call()
    const body = await res.json()

    expect(body.surface).toBe('agent')
    expect(body.results[0].address).toBe('565 A VERITAS ST')
    expect(body.results[0].parcel).toBe('133050L00100CO')
    expect(recorded.select).toContain('parcel')
  })

  it('refuses CSV export to an unauthenticated caller', async () => {
    isAgentAuthed.mockResolvedValue(false)
    const res = await call('?format=csv')
    expect(res.status).toBe(403)
    expect(await res.text()).not.toContain('133050L00100CO')
  })

  it('checks the cookie before running any query', async () => {
    isAgentAuthed.mockResolvedValue(false)
    await call('?format=csv')
    // 403 returned before a select was ever built
    expect(recorded.select).toBeNull()
  })

  it('serves CSV to an agent', async () => {
    isAgentAuthed.mockResolvedValue(true)
    const res = await call('?format=csv')
    const text = await res.text()

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/csv')
    expect(res.headers.get('content-disposition')).toContain('attachment')
    expect(text).toContain('565 A VERITAS ST')
  })

  it('translates criteria into the expected filters', async () => {
    isAgentAuthed.mockResolvedValue(false)
    await call('?q=veritas&zip=37211,37216&propertyType=townhome,condo&costMin=100000&sqftMax=3000&bedroomsMin=3&bathroomsMin=2.5&contractor=cdm%20construction')

    const kinds = recorded.filters.map((f) => `${f[0]}:${f[1]}`)
    expect(kinds).toContain('in:zip')
    expect(kinds).toContain('in:property_type')
    expect(kinds).toContain('gte:construction_cost')
    expect(kinds).toContain('lte:sqft')
    expect(kinds).toContain('gte:bedrooms')
    expect(kinds).toContain('gte:bathrooms')
    expect(recorded.filters.find((f) => f[1] === 'property_type')?.[2]).toEqual(['townhome', 'condo'])
    expect(kinds).toContain('eq:contractor_key')
    const orClause = recorded.filters.find((f) => f[0] === 'or')?.[1] as string
    expect(orClause).toContain('address.ilike.%veritas%')
    expect(orClause).toContain('zip.ilike.%veritas%')
    // grouping key, not raw casing
    expect(recorded.filters.find((f) => f[1] === 'contractor_key')?.[2]).toBe('CDM CONSTRUCTION')
  })

  it('paginates and sorts within the allowlist', async () => {
    isAgentAuthed.mockResolvedValue(false)
    await call('?page=3&pageSize=10&sort=construction_cost&direction=asc')
    expect(recorded.range).toEqual([20, 29])
    expect(recorded.orders[0]).toEqual(['construction_cost', true])
  })

  it('falls back to date_issued for an unknown sort field', async () => {
    isAgentAuthed.mockResolvedValue(false)
    await call('?sort=contractor')
    expect(recorded.orders[0][0]).toBe('date_issued')
  })

  it('reports measured coverage, not the requested window', async () => {
    isAgentAuthed.mockResolvedValue(false)
    const body = await (await call()).json()
    expect(body.coverage.label).toMatch(/\d+ days/)
    expect(body.coverage.label).not.toContain('180 days')
  })
})
