import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NormalizedPermit } from '@/lib/permits'

// Regression cover for the three silent-failure paths that let
// building_permits sit at 0 rows while the cron returned 200:
//   1. an empty ArcGIS fetch reported as { ok: true, synced: 0 }
//   2. a chunk upsert error swallowed into console.error
//   3. either of the above still returning a 2xx

const fetchRecentPermits = vi.fn()
const upsert = vi.fn()

vi.mock('@/lib/permits', () => ({
  fetchRecentPermits: (...args: unknown[]) => fetchRecentPermits(...args),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => ({ upsert: (...a: unknown[]) => upsert(...a) }) }),
}))

const SECRET = 'test-cron-secret'

function permit(n: number): NormalizedPermit {
  return {
    permitNumber: `P${n}`,
    type: 'Building Residential - New',
    subtype: 'Single Family Residence',
    dateIssued: '2026-09-01T05:00:00.000Z',
    dateEntered: '2026-06-01T05:00:00.000Z',
    address: `${n} TEST ST`,
    city: 'NASHVILLE',
    zip: '37209',
    description: 'test',
    constructionCost: 100_000,
    contractor: 'Test Builder',
    status: 'issued',
    parcel: 'P',
    subdivision: 'S',
    lat: 36.1,
    lng: -86.8,
    councilDistrict: 1,
    censusTract: 1,
    sqft: 1000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'single_family',
    daysAgo: 1,
    unitCount: 1,
  }
}

async function callRoute() {
  const { GET } = await import('@/app/api/cron/sync-permits/route')
  return GET(
    new Request('https://example.com/api/cron/sync-permits', {
      headers: { authorization: `Bearer ${SECRET}` },
    }),
  )
}

describe('GET /api/cron/sync-permits', () => {
  beforeEach(() => {
    vi.resetModules()
    fetchRecentPermits.mockReset()
    upsert.mockReset()
    process.env.CRON_SECRET = SECRET
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  })

  it('rejects a request without the cron secret', async () => {
    const { GET } = await import('@/app/api/cron/sync-permits/route')
    const res = await GET(new Request('https://example.com/api/cron/sync-permits'))
    expect(res.status).toBe(401)
  })

  it('returns non-2xx when ArcGIS returns nothing', async () => {
    fetchRecentPermits.mockResolvedValue([])
    const res = await callRoute()
    const body = await res.json()

    expect(res.ok).toBe(false)
    expect(res.status).toBe(502)
    expect(body.ok).toBe(false)
    expect(body.upserted).toBe(0)
    expect(upsert).not.toHaveBeenCalled()
  })

  it('aborts the run and surfaces the reason when a chunk upsert fails', async () => {
    fetchRecentPermits.mockResolvedValue(
      Array.from({ length: 250 }, (_, i) => permit(i)),
    )
    upsert
      .mockResolvedValueOnce({ error: null })
      .mockResolvedValueOnce({ error: { message: 'duplicate key value violates unique constraint' } })
      .mockResolvedValue({ error: null })

    const res = await callRoute()
    const body = await res.json()

    expect(res.ok).toBe(false)
    expect(res.status).toBe(500)
    expect(body.error).toBe('Upsert failed')
    expect(body.details).toContain('duplicate key')
    expect(body.chunkStart).toBe(100)
    // aborted: the third chunk must never be attempted
    expect(upsert).toHaveBeenCalledTimes(2)
    // partial progress is reported, not counted as success
    expect(body.upserted).toBe(100)
    expect(body.fetched).toBe(250)
  })

  it('returns 200 with a real count only when every chunk lands', async () => {
    fetchRecentPermits.mockResolvedValue(
      Array.from({ length: 250 }, (_, i) => permit(i)),
    )
    upsert.mockResolvedValue({ error: null })

    const res = await callRoute()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.fetched).toBe(250)
    expect(body.upserted).toBe(250)
    expect(upsert).toHaveBeenCalledTimes(3)
  })
})
