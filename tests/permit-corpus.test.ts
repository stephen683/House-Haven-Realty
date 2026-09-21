import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'

const ranges: Array<[number, number]> = []
let gteCalls: Array<[string, string]> = []
let rows: unknown[] = []

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => {
      const q = {
        select: () => q,
        order: () => q,
        gte: (col: string, val: string) => {
          gteCalls.push([col, val])
          return q
        },
        range: (from: number, to: number) => {
          ranges.push([from, to])
          return Promise.resolve({ data: rows, error: null })
        },
      }
      return q
    },
  }),
}))

const liveFallback = vi.fn(async () => [])
vi.mock('@/lib/permits', () => ({ fetchRecentPermits: liveFallback }))
vi.mock('../lib/permits', () => ({ fetchRecentPermits: liveFallback }))

describe('pipeline permit corpus', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role'
    ranges.length = 0
    gteCalls = []
    rows = []
    liveFallback.mockClear()
  })
  afterEach(() => vi.resetModules())

  it('windows the cache server-side rather than reading everything', async () => {
    const { loadCachedPermits } = await import('@/lib/permit-repo')
    rows = []
    await loadCachedPermits({ days: 365 })
    expect(gteCalls).toHaveLength(1)
    expect(gteCalls[0][0]).toBe('date_issued')
    const cutoff = new Date(gteCalls[0][1]).getTime()
    const expected = Date.now() - 365 * 86_400_000
    expect(Math.abs(cutoff - expected)).toBeLessThan(60_000)
  })

  it('applies no window when days is omitted', async () => {
    const { loadCachedPermits } = await import('@/lib/permit-repo')
    await loadCachedPermits({})
    expect(gteCalls).toHaveLength(0)
  })

  it('falls back to the live feed only when the cache is empty', async () => {
    const { loadPermitCorpus } = await import('@/lib/permit-repo')
    rows = []
    await loadPermitCorpus()
    expect(liveFallback).toHaveBeenCalledTimes(1)
  })

  it('every Pipeline surface reads the shared corpus, not a raw ArcGIS pull', () => {
    // Scores, builder counts and ZIP stats must agree with the map. They drifted
    // because six files each called fetchAllPermits({ days: 365, limit: 2000 }):
    // unfiltered, undeduped and truncated, while the map drew the cache.
    const surfaces = [
      'app/pipeline/page.tsx',
      'app/pipeline/[zip]/page.tsx',
      'app/pipeline/builders/page.tsx',
      'app/pipeline/builders/[slug]/page.tsx',
      'app/market-reports/[zip]/page.tsx',
      'app/api/pipeline/scores/route.ts',
    ]
    for (const f of surfaces) {
      const src = readFileSync(f, 'utf8')
      expect(src, `${f} should read the shared corpus`).toContain('loadPermitCorpus')
      expect(src, `${f} must not pull ArcGIS directly`).not.toContain('fetchAllPermits')
    }
  })

  it('fetchAllPermits is gone — it was the source of the drift', () => {
    expect(readFileSync('lib/permits.ts', 'utf8')).not.toContain('export async function fetchAllPermits')
  })
})
