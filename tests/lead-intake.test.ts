import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// The failure this path exists to prevent: a lead is saved, every log stays
// clean, a 201 goes back to the browser, and no human ever learns about it.
// 156 leads reached production that way. These assert the four steps happen in
// order and that each one records whether it worked.

const inserted: Record<string, unknown>[] = []
const updates: Record<string, unknown>[] = []
let insertFails = false

function builder(table: string): unknown {
  const state: Record<string, unknown> = {}
  const api: Record<string, unknown> = {
    insert(row: Record<string, unknown>) {
      if (insertFails) { state.error = { message: 'insert refused' } }
      else { inserted.push({ table, ...row }) }
      return api
    },
    update(patch: Record<string, unknown>) { updates.push({ table, ...patch }); return api },
    select() { return api },
    eq() { return api },
    limit() { return api },
    single() {
      return Promise.resolve(
        state.error ? { data: null, error: state.error } : { data: { id: 'lead-1' }, error: null },
      )
    },
    then(resolve: (v: unknown) => void) {
      return resolve(state.error ? { data: null, error: state.error } : { data: [], error: null })
    },
  }
  return api
}

vi.mock('server-only', () => ({}))
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: (t: string) => builder(t) }),
}))

const hubspot = { configured: true, returns: 'hs-1' as string | null, calls: [] as unknown[] }
const resend = { configured: true, ok: true, calls: [] as Record<string, unknown>[] }

vi.mock('@/lib/hubspot', () => ({
  isHubSpotConfigured: () => hubspot.configured,
  upsertContact: async (input: unknown) => { hubspot.calls.push(input); return hubspot.returns },
  splitName: (n: string) => ({ firstName: n.split(' ')[0], lastName: '' }),
}))
vi.mock('@/lib/resend', () => ({
  isEmailConfigured: () => resend.configured,
  sendEmail: async (input: Record<string, unknown>) => {
    resend.calls.push(input)
    return { ok: resend.ok, id: resend.ok ? 'e-1' : null }
  },
}))

const base = {
  formType: 'contact', source: 'website', email: 'lauren@example.com',
  firstName: 'Lauren', lastName: 'Kane', tcpaConsent: true,
  alertSubject: 'New lead', alertBody: 'body', hubspotSource: 'website_contact',
}

async function run(overrides: Record<string, unknown> = {}) {
  const { recordLead } = await import('@/lib/lead-intake')
  return recordLead({ ...base, ...overrides } as never)
}

beforeEach(() => {
  vi.resetModules()
  inserted.length = 0; updates.length = 0; insertFails = false
  hubspot.configured = true; hubspot.returns = 'hs-1'; hubspot.calls.length = 0
  resend.configured = true; resend.ok = true; resend.calls.length = 0
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'k'
})

describe('recordLead', () => {
  it('saves, syncs to the CRM and notifies a human', async () => {
    const r = await run()
    expect(r.saved).toBe(true)
    expect(r.leadId).toBe('lead-1')
    expect(r.hubspotId).toBe('hs-1')
    expect(r.notified).toBe(true)
    expect(r.warnings).toEqual([])
    expect(inserted[0].email).toBe('lauren@example.com')
    expect(resend.calls).toHaveLength(1)
  })

  it('stamps synced_to_crm_at and notified_at on success', async () => {
    await run()
    const synced = updates.find((u) => 'synced_to_crm_at' in u)
    const notified = updates.find((u) => 'notified_at' in u)
    expect(synced?.hubspot_contact_id).toBe('hs-1')
    expect(typeof synced?.synced_to_crm_at).toBe('string')
    expect(typeof notified?.notified_at).toBe('string')
    expect(notified?.notify_error).toBeNull()
  })

  it('records the reason when nobody could be notified', async () => {
    resend.ok = false
    const r = await run()
    expect(r.saved).toBe(true)
    expect(r.notified).toBe(false)
    expect(updates.some((u) => typeof u.notify_error === 'string')).toBe(true)
    expect(r.warnings.join(' ')).toMatch(/not accepted by Resend/)
  })

  it('records the reason when the mailer is not configured at all', async () => {
    resend.configured = false
    const r = await run()
    expect(r.notified).toBe(false)
    expect(resend.calls).toHaveLength(0)
    expect(updates.some((u) => u.notify_error === 'RESEND_API_KEY unset')).toBe(true)
    expect(r.warnings.join(' ')).toMatch(/nobody was notified/)
  })

  it('still saves and notifies when the CRM is unconfigured', async () => {
    hubspot.configured = false
    const r = await run()
    expect(r.saved).toBe(true)
    expect(r.notified).toBe(true)
    expect(r.hubspotId).toBeNull()
    expect(hubspot.calls).toHaveLength(0)
    expect(updates.some((u) => 'synced_to_crm_at' in u)).toBe(false)
    expect(r.warnings.join(' ')).toMatch(/HUBSPOT_PRIVATE_APP_TOKEN unset/)
  })

  it('warns but does not fail when the CRM returns no contact id', async () => {
    hubspot.returns = null
    const r = await run()
    expect(r.saved).toBe(true)
    expect(r.notified).toBe(true)
    expect(r.warnings.join(' ')).toMatch(/no contact id/)
  })

  it('fails the request only when the lead itself could not be saved', async () => {
    insertFails = true
    const r = await run()
    expect(r.saved).toBe(false)
    expect(r.leadId).toBeNull()
    // Nothing downstream should run on a lead that does not exist.
    expect(hubspot.calls).toHaveLength(0)
    expect(resend.calls).toHaveLength(0)
  })

  it('passes the timeline through to the CRM so selling leads are triageable', async () => {
    await run({ timeline: '6-12 months', formType: 'valuation' })
    expect((hubspot.calls[0] as Record<string, unknown>).timeline).toBe('6-12 months')
  })
})

describe('every public intake route goes through recordLead', () => {
  // Any route that writes to `leads` on its own re-opens the gap: the two
  // busiest ones posted to Resend with a raw fetch and never read the response.
  const ROUTES = [
    'app/api/contact/route.ts',
    'app/api/newsletter/route.ts',
    'app/api/valuation/route.ts',
  ]
  for (const r of ROUTES) {
    it(`${r} delegates to the shared path`, () => {
      const src = fs.readFileSync(path.join(process.cwd(), r), 'utf8')
      expect(src).toContain('@/lib/lead-intake')
      expect(src).not.toContain('api.resend.com')
      expect(src).not.toMatch(/from\('leads'\)\s*\.insert/)
    })
  }

  it('no route posts to the Resend API directly', () => {
    const dir = path.join(process.cwd(), 'app/api')
    const stack = [dir]
    const offenders: string[] = []
    while (stack.length) {
      const cur = stack.pop()!
      for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
        const full = path.join(cur, e.name)
        if (e.isDirectory()) stack.push(full)
        else if (e.name.endsWith('.ts') && fs.readFileSync(full, 'utf8').includes('api.resend.com')) {
          offenders.push(path.relative(process.cwd(), full))
        }
      }
    }
    expect(offenders).toEqual([])
  })
})
