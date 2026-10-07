import { describe, it, expect } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { runPermitTableCheck, PERMIT_FRESHNESS_DAYS, SYNC_STALE_HOURS } from '@/lib/canary'

// The HTTP canary checks pass off the live ArcGIS feed regardless of what is in
// building_permits, so an empty or stale table used to be invisible. HTTP 200
// is no longer sufficient — these assert the table itself.
//
// The check also has to separate two different failures. When the sync broke on
// 2026-10-02 it reported "newest date_issued is 8.4d old", which reads like
// Metro went quiet; in fact our cron had returned 500 every morning for six
// days. max(updated_at) is the signal we can act on.

function stubSupabase(opts: {
  count?: number | null
  countError?: string
  newest?: string | null
  freshError?: string
  /** max(updated_at); defaults to now, i.e. the sync just ran. */
  lastWrite?: string | null
}): SupabaseClient {
  return {
    from: () => ({
      select: (cols: string, options?: { head?: boolean }) => {
        if (options?.head) {
          return Promise.resolve({
            count: opts.count ?? null,
            error: opts.countError ? { message: opts.countError } : null,
          })
        }
        const wantsWrite = cols.includes('updated_at')
        const chain = {
          not: () => chain,
          order: () => chain,
          limit: () => {
            if (wantsWrite) {
              const v = opts.lastWrite === undefined ? new Date().toISOString() : opts.lastWrite
              return Promise.resolve({ data: v ? [{ updated_at: v }] : [], error: null })
            }
            return Promise.resolve({
              data: opts.newest ? [{ date_issued: opts.newest }] : [],
              error: opts.freshError ? { message: opts.freshError } : null,
            })
          },
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

  it('blames Metro, not us, when the sync is running but nothing new is published', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ count: 900, newest: daysAgo(PERMIT_FRESHNESS_DAYS + 3) }),
    )
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toMatch(/sync is running, but Metro has published nothing/)
  })

  it('names the broken cron when the sync has stopped writing', async () => {
    // The verbatim 2026-10-02 outage: data intact, cron 500ing for six days.
    const res = await runPermitTableCheck(
      stubSupabase({ count: 3883, newest: daysAgo(8.4), lastWrite: daysAgo(6) }),
    )
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toMatch(/daily sync has not written/)
    expect(res.errorExcerpt).toMatch(/sync-permits/)
    // It must not read as a data problem — that is what sent us the wrong way.
    expect(res.errorExcerpt).not.toMatch(/Metro has published nothing/)
  })

  it('prefers the sync failure over the data-age failure when both are true', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ count: 900, newest: daysAgo(30), lastWrite: daysAgo(5) }),
    )
    expect(res.errorExcerpt).toMatch(/daily sync has not written/)
  })

  it('tolerates a sync that ran within the window', async () => {
    const res = await runPermitTableCheck(
      stubSupabase({ count: 900, newest: daysAgo(1), lastWrite: new Date(Date.now() - (SYNC_STALE_HOURS - 2) * 3_600_000).toISOString() }),
    )
    expect(res.ok).toBe(true)
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
