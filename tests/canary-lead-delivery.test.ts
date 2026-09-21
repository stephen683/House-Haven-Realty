import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

// The 156-lead failure was invisible to every existing check: inserts
// succeeded, routes returned 201, the site stayed up. Only the state of the
// delivery columns reveals it, which is what this check reads.
//
// Email is the only delivery mechanism, so notification is the whole invariant.

type Row = {
  id: string
  notified_at: string | null
  notify_error: string | null
}

function stub(rows: Row[], error?: string): SupabaseClient {
  const q = {
    select: () => q,
    gte: () => q,
    neq: () => q,
    order: () => q,
    limit: () => Promise.resolve(error ? { data: null, error: { message: error } } : { data: rows, error: null }),
  }
  return { from: () => q } as unknown as SupabaseClient
}

const delivered = (id: string): Row => ({
  id, notified_at: '2026-09-21T00:00:01Z', notify_error: null,
})

beforeEach(() => { vi.resetModules() })

describe('runLeadDeliveryCheck', () => {
  it('passes when every recent lead reached a human', async () => {
    const { runLeadDeliveryCheck } = await import('@/lib/canary')
    const r = await runLeadDeliveryCheck(stub([delivered('a'), delivered('b')]))
    expect(r.ok).toBe(true)
    expect(r.errorExcerpt).toBeNull()
  })

  it('passes when there are no recent leads — quiet is not a failure', async () => {
    const { runLeadDeliveryCheck } = await import('@/lib/canary')
    const r = await runLeadDeliveryCheck(stub([]))
    expect(r.ok).toBe(true)
  })


  it('fails when a lead was saved but nobody was notified, and quotes the reason', async () => {
    const { runLeadDeliveryCheck } = await import('@/lib/canary')
    const r = await runLeadDeliveryCheck(stub([
      { id: 'a', notified_at: null, notify_error: 'RESEND_API_KEY unset' },
    ]))
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/never produced a confirmed notification/)
    expect(r.errorExcerpt).toMatch(/RESEND_API_KEY unset/)
  })


  it('reports a read failure rather than passing silently', async () => {
    const { runLeadDeliveryCheck } = await import('@/lib/canary')
    const r = await runLeadDeliveryCheck(stub([], 'permission denied'))
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/permission denied/)
  })

  it('is included in the full check run', async () => {
    const { LEAD_DELIVERY_ENDPOINT } = await import('@/lib/canary')
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../lib/canary.ts', import.meta.url), 'utf8'))
    expect(src).toMatch(/runLeadDeliveryCheck\(supabase\)/)
    expect(src).toMatch(/leadDelivery,/)
    expect(LEAD_DELIVERY_ENDPOINT).toBe('Lead delivery (notify)')
  })
})
