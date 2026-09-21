import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

// The 156-lead failure was invisible to every existing check: inserts
// succeeded, routes returned 201, the site stayed up. Only the state of the
// delivery columns reveals it, which is what this check reads.

const hubspot = { configured: true }
vi.mock('@/lib/hubspot', () => ({ isHubSpotConfigured: () => hubspot.configured }))

type Row = {
  id: string
  synced_to_crm_at: string | null
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
  id, synced_to_crm_at: '2026-09-21T00:00:00Z', notified_at: '2026-09-21T00:00:01Z', notify_error: null,
})

beforeEach(() => { vi.resetModules(); hubspot.configured = true })

describe('runCrmSyncCheck', () => {
  it('passes when every recent lead reached the CRM and a human', async () => {
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const r = await runCrmSyncCheck(stub([delivered('a'), delivered('b')]))
    expect(r.ok).toBe(true)
    expect(r.errorExcerpt).toBeNull()
  })

  it('passes when there are no recent leads — quiet is not a failure', async () => {
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const r = await runCrmSyncCheck(stub([]))
    expect(r.ok).toBe(true)
  })

  it('fails when a lead never reached HubSpot', async () => {
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const r = await runCrmSyncCheck(stub([
      delivered('a'),
      { id: 'b', synced_to_crm_at: null, notified_at: '2026-09-21T00:00:01Z', notify_error: null },
    ]))
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/1 never reached HubSpot/)
  })

  it('fails when a lead was saved but nobody was notified, and quotes the reason', async () => {
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const r = await runCrmSyncCheck(stub([
      { id: 'a', synced_to_crm_at: '2026-09-21T00:00:00Z', notified_at: null, notify_error: 'RESEND_API_KEY unset' },
    ]))
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/never produced a confirmed notification/)
    expect(r.errorExcerpt).toMatch(/RESEND_API_KEY unset/)
  })

  it('fails immediately when the CRM token is unset, without reading the table', async () => {
    hubspot.configured = false
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const reader = vi.fn()
    const r = await runCrmSyncCheck({ from: reader } as unknown as SupabaseClient)
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/HUBSPOT_PRIVATE_APP_TOKEN is unset/)
    expect(reader).not.toHaveBeenCalled()
  })

  it('reports a read failure rather than passing silently', async () => {
    const { runCrmSyncCheck } = await import('@/lib/canary')
    const r = await runCrmSyncCheck(stub([], 'permission denied'))
    expect(r.ok).toBe(false)
    expect(r.errorExcerpt).toMatch(/permission denied/)
  })

  it('is included in the full check run', async () => {
    const { CRM_SYNC_ENDPOINT } = await import('@/lib/canary')
    const src = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../lib/canary.ts', import.meta.url), 'utf8'))
    expect(src).toMatch(/runCrmSyncCheck\(supabase\)/)
    expect(src).toMatch(/crmSync,/)
    expect(CRM_SYNC_ENDPOINT).toBe('Lead delivery (CRM + notify)')
  })
})
