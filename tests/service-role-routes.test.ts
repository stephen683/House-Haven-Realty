import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// Every table is closed to the anon key. A route that reaches for the anon
// client would silently fail its insert (the routes log and continue), so a
// lead would vanish with a 201. These pin every server route to the service
// role, at the source level and at runtime.

const ROUTES = [
  'app/api/contact/route.ts',
  'app/api/newsletter/route.ts',
  'app/api/valuation/route.ts',
  'app/api/agents/contract/route.ts',
  'app/api/pipeline/notify-property/route.ts',
  'app/api/value/request-cma/route.ts',
  'app/api/value/route.ts',
  'app/api/pipeline/permit/[permitNumber]/stage/route.ts',
]

describe('no route uses the anon server client', () => {
  it('lib/supabase/server.ts no longer exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'lib/supabase/server.ts'))).toBe(false)
  })

  for (const r of ROUTES) {
    it(`${r} imports the service client only`, () => {
      const src = fs.readFileSync(path.join(process.cwd(), r), 'utf8')
      expect(src).not.toContain('@/lib/supabase/server')
      expect(src).toContain('@/lib/supabase/service')
    })
  }

  it('the browser client is never imported by a route', () => {
    for (const r of ROUTES) {
      const src = fs.readFileSync(path.join(process.cwd(), r), 'utf8')
      expect(src).not.toContain('@/lib/supabase/client')
    }
  })
})

// ─── runtime: each route hits Supabase with the service key ───────────────

const createClientSpy = vi.fn()

/** Chainable stand-in for the PostgREST builder; every terminal resolves ok. */
function chain(): unknown {
  const target = () => chain()
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === 'then') {
        return (resolve: (v: unknown) => void) =>
          resolve({ data: { id: 'row-1', fetched_at: new Date().toISOString(), current_stage: 'permit_issued', stages_json: [], case_id: 1, parcel: 'APN1' }, error: null, count: 0 })
      }
      return () => chain()
    },
  })
}

vi.mock('server-only', () => ({}))
vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => {
    createClientSpy(...args)
    return { from: () => chain(), rpc: () => chain() }
  },
}))
vi.mock('@/lib/hubspot', () => ({
  upsertContact: async () => 'hs-1',
  splitName: (n: string) => ({ firstName: n.split(' ')[0], lastName: n.split(' ').slice(1).join(' ') }),
}))
vi.mock('@/lib/resend', () => ({ sendEmail: async () => ({ ok: true, id: 'e-1' }) }))
vi.mock('@/lib/rentcast', () => ({
  getValuation: async () => ({ mid: 500000, low: 450000, high: 550000, comps: [], confidenceNote: '', source: 'rentcast' }),
  normalizeAddress: (a: string) => a.toLowerCase(),
}))
vi.mock('@/lib/agent-auth', () => ({ isAgentAuthed: async () => true }))
vi.mock('@/lib/permits', () => ({
  fetchCaseByPermitNumber: async () => ({ caseID: 1, statusCode: 'X' }),
  fetchCaseTasks: async () => [],
  fetchParcelByAPN: async () => ({ apn: 'APN1', acres: 0.2, zoning: 'RS20', landUse: null, address: null }),
  fetchPermitByNumber: async () => null,
}))
vi.mock('@/lib/permit-stages', () => ({
  computeStages: () => ({ currentStage: 'permit_issued', stages: [], unmapped: [] }),
}))

const SERVICE_KEY = 'service-role-key-under-test'
const post = (url: string, body: unknown) =>
  new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

describe('routes authenticate to Supabase with the service role', () => {
  beforeEach(() => {
    vi.resetModules()
    createClientSpy.mockReset()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY
    delete process.env.RESEND_API_KEY
  })

  const expectServiceKey = () => {
    expect(createClientSpy).toHaveBeenCalled()
    for (const call of createClientSpy.mock.calls) expect(call[1]).toBe(SERVICE_KEY)
  }

  it('contact', async () => {
    const { POST } = await import('@/app/api/contact/route')
    const res = await POST(post('https://x/api/contact', { name: 'A B', email: 'a@b.co', message: 'hi', tcpaConsent: true }) as never)
    expect(res.status).toBe(201); expectServiceKey()
  })

  it('newsletter', async () => {
    const { POST } = await import('@/app/api/newsletter/route')
    const res = await POST(post('https://x/api/newsletter', { email: 'a@b.co', tcpaConsent: true }) as never)
    expect([200, 201]).toContain(res.status); expectServiceKey()
  })

  it('valuation', async () => {
    const { POST } = await import('@/app/api/valuation/route')
    const res = await POST(post('https://x/api/valuation', { address: '1 Main St', zip: '37209', name: 'A B', email: 'a@b.co' }) as never)
    expect(res.status).toBe(201); expectServiceKey()
  })

  it('agents/contract', async () => {
    const { POST } = await import('@/app/api/agents/contract/route')
    const res = await POST(post('https://x/api/agents/contract', {
      agent_name: 'A', agent_email: 'a@b.co', side: 'buyer', property_address: '1 Main',
      contract_price: '500000', binding_date: '2026-09-01', close_date: '2026-10-01',
      commission_type: 'percent', commission_value: '3',
    }) as never)
    expect(res.status).toBe(201); expectServiceKey()
  })

  it('pipeline/notify-property', async () => {
    const { POST } = await import('@/app/api/pipeline/notify-property/route')
    const res = await POST(post('https://x/api/pipeline/notify-property', { email: 'a@b.co', permitNumber: 'P1', tcpaConsent: true }) as never)
    expect(res.status).toBe(201); expectServiceKey()
  })

  it('value/request-cma', async () => {
    const { POST } = await import('@/app/api/value/request-cma/route')
    const res = await POST(post('https://x/api/value/request-cma', { name: 'A B', email: 'a@b.co', tcpaConsent: true }) as never)
    expect(res.status).toBe(201); expectServiceKey()
  })

  it('value', async () => {
    const { POST } = await import('@/app/api/value/route')
    const res = await POST(post('https://x/api/value', { address: '123 Main Street' }) as never)
    expect(res.status).toBe(200); expectServiceKey()
  })

  it('pipeline/permit/[n]/stage', async () => {
    const { GET } = await import('@/app/api/pipeline/permit/[permitNumber]/stage/route')
    const res = await GET(new Request('https://x/api/pipeline/permit/P1/stage') as never, { params: Promise.resolve({ permitNumber: 'P1' }) })
    expect(res.status).toBe(200); expectServiceKey()
  })

  it('service client refuses to start without credentials', async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const { createServiceClient } = await import('@/lib/supabase/service')
    expect(() => createServiceClient()).toThrow(/not configured/)
  })
})
