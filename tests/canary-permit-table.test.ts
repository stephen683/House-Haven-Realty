import { describe, it, expect } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { runPermitTableCheck, PERMIT_FRESHNESS_DAYS } from '@/lib/canary'

// The HTTP canary checks pass off the live ArcGIS feed regardless of what is in
// building_permits, so an empty or stale table used to be invisible. HTTP 200
// is no longer sufficient — these assert the table itself.

function stubSupabase(opts: {
  count?: number | null
  countError?: string
  newest?: string | null
  freshError?: string
}): SupabaseClient {
  return {
    from: () => ({
      select: (_cols: string, options?: { head?: boolean }) => {
        if (options?.head) {
          return Promise.resolve({
            count: opts.count ?? null,
            error: opts.countError ? { message: opts.countError } : null,
          })
        }
        const chain = {
          not: () => chain,
          order: () => chain,
          limit: () =>
            Promise.resolve({
              data: opts.newest ? [{ date_issued: opts.newest }] : [],
              error: opts.freshError ? { message: opts.freshError } : null,
            }),
        }
        return chain
      },
    }),
  } as unknown as SupabaseClient
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

describe('canary building_permits check', () => {
  it('fails when the table is empty — the exact state that went unnoticed', async () => {
    const res = await runPermitTableCheck(stubSupabase({ count: 0 }))
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('0 rows')
  })

  it('fails when max(date_issued) is older than the freshness window', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ count: 900, newest: daysAgo(PERMIT_FRESHNESS_DAYS + 3) }),
    )
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('old')
  })

  it('passes when the table is populated and fresh', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ count: 900, newest: daysAgo(1) }),
    )
    expect(res.ok).toBe(true)
    expect(res.errorExcerpt).toBeNull()
  })

  it('fails loudly when the count query errors', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ countError: 'relation does not exist' }),
    )
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('relation does not exist')
  })

  it('fails when rows exist but every date_issued is null', async () => {
    const res = await runPermitTableCheck(stubSupabase({ count: 5, newest: null }))
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('no non-null date_issued')
  })
})
