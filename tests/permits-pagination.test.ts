import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ArcGIS caps every response at 1000 rows and answers newest-first, so a single
// request silently truncated: a 180-day window returned 996 of 1,990 real
// permits and the response gave no sign of it. These lock the paging in.

const PAGE_CAP = 1000

function attrs(i: number) {
  return {
    Permit__: `P${i}`,
    Permit_Type_Description: 'Building Residential - New',
    Permit_Subtype_Description: 'Single Family Residence',
    Parcel: `PARCEL${i}`,
    Date_Entered: 1_770_000_000_000,
    Date_Issued: 1_780_000_000_000 - i * 86_400_000,
    Const_Cost: 300_000,
    Address: `${100 + i} TEST ST`,
    City: 'NASHVILLE',
    State: 'TN',
    ZIP: '37209',
    Subdivision_Lot: `LOT ${i}`,
    Contact: `Builder ${i}`,
    Per_Ty: 'R',
    Per_SubTy: 'SFR',
    Purpose: 'To construct a 2000 sq.ft. single family residence',
    Council_Dist: 1,
    Census_Tract: 1,
    Lon: -86.8,
    Lat: 36.1,
    ObjectId: i,
  }
}

/** Fake service that honours resultOffset and caps pages at 1000. */
function fakeArcGIS(total: number) {
  const calls: { offset: number; count: number }[] = []
  const fetchMock = vi.fn(async (url: string) => {
    const u = new URL(url)
    const offset = Number(u.searchParams.get('resultOffset') ?? 0)
    const want = Math.min(Number(u.searchParams.get('resultRecordCount') ?? PAGE_CAP), PAGE_CAP)
    calls.push({ offset, count: want })
    const slice = Array.from(
      { length: Math.max(0, Math.min(want, total - offset)) },
      (_, k) => ({ attributes: attrs(offset + k) }),
    )
    return {
      ok: true,
      status: 200,
      json: async () => ({
        features: slice,
        exceededTransferLimit: offset + slice.length < total,
      }),
    } as unknown as Response
  })
  return { fetchMock, calls }
}

describe('fetchRecentPermits pagination', () => {
  beforeEach(() => vi.resetModules())
  afterEach(() => vi.unstubAllGlobals())

  it('pages past the 1000-row cap to return the full result set', async () => {
    const { fetchMock, calls } = fakeArcGIS(1990)
    vi.stubGlobal('fetch', fetchMock)

    const { fetchRecentPermits } = await import('@/lib/permits')
    const permits = await fetchRecentPermits({ days: 180, limit: 6000 })

    expect(permits).toHaveLength(1990)
    expect(calls.map((c) => c.offset)).toEqual([0, 1000])
    expect(new Set(permits.map((p) => p.permitNumber)).size).toBe(1990)
  })

  it('orders by a stable tiebreaker so pages cannot overlap or gap', async () => {
    const { fetchMock } = fakeArcGIS(1500)
    vi.stubGlobal('fetch', fetchMock)

    const { fetchRecentPermits } = await import('@/lib/permits')
    await fetchRecentPermits({ days: 180, limit: 6000 })

    const url = new URL(fetchMock.mock.calls[0][0] as string)
    const order = url.searchParams.get('orderByFields') ?? ''
    expect(order).toContain('Date_Issued DESC')
    expect(order).toContain('ObjectId')
  })

  it('stops on a short page instead of looping forever', async () => {
    const { fetchMock, calls } = fakeArcGIS(500)
    vi.stubGlobal('fetch', fetchMock)

    const { fetchRecentPermits } = await import('@/lib/permits')
    const permits = await fetchRecentPermits({ days: 180, limit: 6000 })

    expect(permits).toHaveLength(500)
    expect(calls).toHaveLength(1)
  })

  it('never requests more than the caller asked for', async () => {
    const { fetchMock, calls } = fakeArcGIS(5000)
    vi.stubGlobal('fetch', fetchMock)

    const { fetchRecentPermits } = await import('@/lib/permits')
    const permits = await fetchRecentPermits({ days: 180, limit: 1500 })

    expect(permits).toHaveLength(1500)
    expect(calls).toEqual([{ offset: 0, count: 1000 }, { offset: 1000, count: 500 }])
  })

  it('keeps the pages it already has when a later page fails', async () => {
    let n = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      const offset = Number(new URL(url).searchParams.get('resultOffset') ?? 0)
      n += 1
      if (n > 1) return { ok: false, status: 503 } as unknown as Response
      return {
        ok: true,
        status: 200,
        json: async () => ({
          features: Array.from({ length: 1000 }, (_, k) => ({ attributes: attrs(offset + k) })),
          exceededTransferLimit: true,
        }),
      } as unknown as Response
    }))

    const { fetchRecentPermits } = await import('@/lib/permits')
    const permits = await fetchRecentPermits({ days: 180, limit: 6000 })
    expect(permits).toHaveLength(1000)
  })
})
