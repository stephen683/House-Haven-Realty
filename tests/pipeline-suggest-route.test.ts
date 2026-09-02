import { describe, it, expect, vi, beforeEach } from 'vitest'

// The typeahead is public. It must never emit a house number, and street
// labels must go through the same redaction the results list uses.

const rpc = vi.fn()
const ilike = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    rpc: (...a: unknown[]) => rpc(...a),
    from: () => ({
      select: () => ({
        ilike: (...a: unknown[]) => {
          ilike(...a)
          return { limit: () => Promise.resolve({ data: addressRows, error: null }) }
        },
      }),
    }),
  }),
}))

let addressRows: { address: string | null }[]

async function call(q: string) {
  const { GET } = await import('@/app/api/pipeline/suggest/route')
  return GET(new Request(`https://example.com/api/pipeline/suggest?q=${encodeURIComponent(q)}`))
}

describe('GET /api/pipeline/suggest', () => {
  beforeEach(() => {
    vi.resetModules()
    rpc.mockReset()
    ilike.mockReset()
    addressRows = []
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
    rpc.mockResolvedValue({ data: { builders: [], zips: [] }, error: null })
  })

  it('returns nothing for a query shorter than two characters', async () => {
    const body = await (await call('a')).json()
    expect(body).toEqual({ builders: [], zips: [], streets: [] })
    expect(rpc).not.toHaveBeenCalled()
  })

  it('street suggestions never contain a house number', async () => {
    addressRows = [
      { address: '3600 WOODMONT BLVD' },
      { address: '3612 WOODMONT BLVD' },
      { address: '565 A VERITAS ST' },
    ]
    const body = await (await call('woodmont')).json()

    expect(body.streets[0]).toEqual({ label: 'WOODMONT BLVD', count: 2 })
    const raw = JSON.stringify(body)
    expect(raw).not.toContain('3600')
    expect(raw).not.toContain('3612')
    expect(raw).not.toContain('565')
  })

  it('attaches a builder slug that matches /pipeline/builders', async () => {
    rpc.mockResolvedValue({
      data: { builders: [{ label: 'NVR, INC. T/A RYAN HOMES', count: 40 }], zips: [] },
      error: null,
    })
    const body = await (await call('ryan')).json()
    expect(body.builders[0].slug).toBe('nvr-inc-ta-ryan-homes')
    expect(body.builders[0].count).toBe(40)
  })

  it('names the neighborhood for a known ZIP', async () => {
    rpc.mockResolvedValue({
      data: { builders: [], zips: [{ label: '37216', count: 36 }] },
      error: null,
    })
    const body = await (await call('372')).json()
    expect(body.zips[0].name).toBe('Inglewood')
  })

  it('sanitizes input before it reaches the query', async () => {
    await call('foo,bar(baz)%')
    expect(rpc).toHaveBeenCalledWith('pipeline_search_suggest', {
      q: 'foo bar baz',
      max_each: expect.any(Number),
    })
    expect(ilike.mock.calls[0][1]).not.toContain(',')
    expect(ilike.mock.calls[0][1]).not.toContain('(')
  })

  it('still returns streets when the grouped rpc fails', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'boom' } })
    addressRows = [{ address: '100 MAIN ST' }]
    const body = await (await call('main')).json()
    expect(body.builders).toEqual([])
    expect(body.streets[0].label).toBe('MAIN ST')
  })
})
