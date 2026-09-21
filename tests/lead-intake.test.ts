import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// The failure this path exists to prevent: a lead is saved, every log stays
// clean, a 201 goes back to the browser, and no human ever learns about it.
// 156 leads reached production that way.
//
// Email is the only delivery mechanism — House Haven runs leads through Meet
// Corinne, not a CRM this site writes to — so "notified" is the whole contract.

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

const resend = { configured: true, ok: true, calls: [] as Record<string, unknown>[] }

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
  alertSubject: 'New lead', alertBody: 'body',
}

async function run(overrides: Record<string, unknown> = {}) {
  const { recordLead } = await import('@/lib/lead-intake')
  return recordLead({ ...base, ...overrides } as never)
}

beforeEach(() => {
  vi.resetModules()
  inserted.length = 0; updates.length = 0; insertFails = false
  resend.configured = true; resend.ok = true; resend.calls.length = 0
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'k'
})

describe('recordLead', () => {
  it('saves the lead and notifies a human', async () => {
    const r = await run()
    expect(r.saved).toBe(true)
    expect(r.leadId).toBe('lead-1')
    expect(r.notified).toBe(true)
    expect(r.warnings).toEqual([])
    expect(inserted[0].email).toBe('lauren@example.com')
    expect(resend.calls).toHaveLength(1)
  })

  it('stamps notified_at on success', async () => {
    await run()
    const notified = updates.find((u) => 'notified_at' in u)
    expect(typeof notified?.notified_at).toBe('string')
    expect(notified?.notify_error).toBeNull()
  })

  it('replies to the lead, so Stephen can answer from his inbox', async () => {
    await run()
    expect(resend.calls[0].replyTo).toBe('lauren@example.com')
    expect(resend.calls[0].to).toBe('stephen@househavenrealty.com')
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



  it('fails the request only when the lead itself could not be saved', async () => {
    insertFails = true
    const r = await run()
    expect(r.saved).toBe(false)
    expect(r.leadId).toBeNull()
    // Nothing downstream should run on a lead that does not exist.
    expect(resend.calls).toHaveLength(0)
  })

  it('stores the timeline on the lead so selling leads are triageable', async () => {
    await run({ timeline: '6-12 months', formType: 'valuation' })
    expect(inserted[0].timeline).toBe('6-12 months')
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
      expect(src).not.toContain('hubspot')
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
