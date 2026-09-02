import { describe, it, expect, vi, beforeEach } from 'vitest'

// PostgREST caps every request at 1,000 rows regardless of `.limit()`. The
// first deploy of the cache-backed GeoJSON served exactly 1,000 of 3,513
// permits with no error anywhere — this pins the paging in.

const ranges: [number, number][] = []
let total = 0

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        order: () => ({
          order: () => ({
            range: (from: number, to: number) => {
              ranges.push([from, to])
              const n = Math.max(0, Math.min(to, total - 1) - from + 1)
              const data = Array.from({ length: n }, (_, i) => ({
                permit_number: `P${from + i}`, permit_type: 'Building Residential - New',
                subtype: '', date_issued: '2026-09-01T05:00:00+00:00', address: `${from + i} X ST`,
                city: 'NASHVILLE', zip: '37209', description: '', construction_cost: 1,
                contractor: 'A', status: 'issued', parcel: '', subdivision: '', lat: 36, lng: -86,
                council_district: null, census_tract: null, sqft: null, bedrooms: null,
                bathrooms: null, property_type: 'single_family', unit_count: 1,
              }))
              return Promise.resolve({ data, error: null })
            },
          }),
        }),
      }),
    }),
  }),
}))

describe('loadCachedPermits paging', () => {
  beforeEach(() => {
    vi.resetModules()
    ranges.length = 0
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'k'
  })

  it('pages past the 1000-row cap and returns the whole table', async () => {
    total = 3513
    const { loadCachedPermits } = await import('@/lib/permit-repo')
    const permits = await loadCachedPermits()
    expect(permits).toHaveLength(3513)
    expect(ranges).toEqual([[0, 999], [1000, 1999], [2000, 2999], [3000, 3999]])
    expect(new Set(permits.map((p) => p.permitNumber)).size).toBe(3513)
  })

  it('stops on a short page', async () => {
    total = 400
    const { loadCachedPermits } = await import('@/lib/permit-repo')
    expect(await loadCachedPermits()).toHaveLength(400)
    expect(ranges).toHaveLength(1)
  })

  it('never reads past the caller limit', async () => {
    total = 5000
    const { loadCachedPermits } = await import('@/lib/permit-repo')
    expect(await loadCachedPermits({ limit: 1500 })).toHaveLength(1500)
    expect(ranges).toEqual([[0, 999], [1000, 1499]])
  })
})
