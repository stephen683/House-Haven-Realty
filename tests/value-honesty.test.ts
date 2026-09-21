import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'

const KEY = 'RENTCAST_API_KEY'

describe('House Haven Value never invents a number', () => {
  const original = process.env[KEY]
  beforeEach(() => { vi.resetModules(); vi.unstubAllGlobals() })
  afterEach(() => {
    if (original === undefined) delete process.env[KEY]
    else process.env[KEY] = original
    vi.unstubAllGlobals()
  })

  it('reports unavailable rather than an estimate when there is no API key', async () => {
    delete process.env[KEY]
    const { getValuation, isValuationConfigured } = await import('@/lib/rentcast')
    expect(isValuationConfigured()).toBe(false)
    const v = await getValuation('4400 Elkins Ave, Nashville, TN 37209')
    expect(v.source).toBe('unavailable')
    expect(v.mid).toBeNull()
    expect(v.low).toBeNull()
    expect(v.high).toBeNull()
    expect(v.comps).toEqual([])
  })

  it('returns no number for two different addresses — the old bug made both look real', async () => {
    delete process.env[KEY]
    const { getValuation } = await import('@/lib/rentcast')
    const a = await getValuation('123 Main St, Nashville, TN 37209')
    const b = await getValuation('999 Woodland St, Nashville, TN 37206')
    // The hash-of-the-address generator produced two different, plausible,
    // entirely fictional valuations here.
    expect(a.mid).toBeNull()
    expect(b.mid).toBeNull()
  })

  it('reports unavailable when RentCast errors, instead of falling back to a guess', async () => {
    process.env[KEY] = 'test-key'
    vi.stubGlobal('fetch', vi.fn(async () => new Response('upstream down', { status: 502 })))
    const { getValuation } = await import('@/lib/rentcast')
    const v = await getValuation('4400 Elkins Ave, Nashville, TN 37209')
    expect(v.source).toBe('unavailable')
    expect(v.mid).toBeNull()
  })

  it('reports unavailable when the request throws', async () => {
    process.env[KEY] = 'test-key'
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNRESET') }))
    const { getValuation } = await import('@/lib/rentcast')
    expect((await getValuation('4400 Elkins Ave')).source).toBe('unavailable')
  })

  it('passes a real RentCast response straight through', async () => {
    process.env[KEY] = 'test-key'
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({
      price: 712000, priceRangeLow: 680000, priceRangeHigh: 745000,
      comparables: [{ formattedAddress: '4412 Elkins Ave, Nashville, TN', price: 699000 }],
    })))
    const { getValuation } = await import('@/lib/rentcast')
    const v = await getValuation('4400 Elkins Ave, Nashville, TN 37209')
    expect(v.source).toBe('rentcast')
    expect(v.mid).toBe(712000)
    // Comps stay address-masked to the block.
    expect(v.comps[0].address).toContain('block of')
    expect(v.comps[0].address).not.toContain('4412 ')
  })

  it('has no fabricated-valuation code path left anywhere', () => {
    const src = readFileSync('lib/rentcast.ts', 'utf8')
    expect(src).not.toContain('mockValuation')
    expect(src).not.toContain('Sample St')
    // The header comment documents the old formula on purpose, so assert
    // against code with comments stripped rather than the raw file.
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).not.toMatch(/425000|350000/)   // the old seeded range
    const client = readFileSync('app/value/ValueClient.tsx', 'utf8')
    expect(client).not.toContain("'mock'")
    expect(client).not.toContain('Showing sample data')
    // The amber badge was the only non-brand colour on the site.
    expect(client).not.toMatch(/amber-\d{3}/)
  })

  it('does not claim the address is unstored, since the API caches it', () => {
    const client = readFileSync('app/value/ValueClient.tsx', 'utf8')
    expect(client).not.toContain('We do not store your address')
    const route = readFileSync('app/api/value/route.ts', 'utf8')
    expect(route).toContain('valuation_cache')
  })
})
