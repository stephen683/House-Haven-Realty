import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// 156 leads sat at status 'new' for five months: nothing wrote the column and
// nobody read it, so a buy-and-sell client went eight weeks without a reply
// while sitting in plain sight. These pin the queue that replaces that.

vi.mock('server-only', () => ({}))

const captured: { table: string; ops: string[]; args: unknown[][] } = { table: '', ops: [], args: [] }

function builder(table: string): unknown {
  captured.table = table
  const api: Record<string, unknown> = {}
  for (const op of ['select', 'neq', 'eq', 'or', 'in', 'order', 'limit', 'update']) {
    api[op] = (...args: unknown[]) => {
      captured.ops.push(op)
      captured.args.push(args)
      return op === 'limit' ? Promise.resolve({ data: [], error: null }) : api
    }
  }
  return api
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: (t: string) => builder(t) }),
}))

beforeEach(() => {
  vi.resetModules()
  captured.ops = []
  captured.args = []
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'k'
})

describe('queue ordering and filters', () => {
  it('the default view is unworked, and hides what triage filed', async () => {
    const { loadQueue } = await import('@/lib/leads-queue')
    await loadQueue('unworked')
    const eq = captured.args[captured.ops.indexOf('eq')]
    expect(eq).toEqual(['status', 'new'])
    expect(captured.ops).toContain('or')
    // Leads from before triage existed have a null band and must still show.
    expect(captured.args.flat()).toContain('triage_band.is.null,triage_band.neq.file')
  })

  it('orders by score first, newest second, so the best lead is on top', async () => {
    const { loadQueue } = await import('@/lib/leads-queue')
    await loadQueue('all')
    const orders = captured.args.filter((_, i) => captured.ops[i] === 'order')
    expect(orders[0][0]).toBe('lead_score')
    expect(orders[0][1]).toMatchObject({ ascending: false, nullsFirst: false })
    expect(orders[1][0]).toBe('created_at')
  })

  it('never shows canary sentinel rows to an agent', async () => {
    const { loadQueue } = await import('@/lib/leads-queue')
    await loadQueue('all')
    expect(captured.args[captured.ops.indexOf('neq')]).toEqual(['form_type', 'canary'])
  })

  it('raises rather than silently showing an empty queue on a read failure', async () => {
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: () => ({
        from: () => {
          const api: Record<string, unknown> = {}
          for (const op of ['select', 'neq', 'eq', 'or', 'in', 'order']) api[op] = () => api
          api.limit = () => Promise.resolve({ data: null, error: { message: 'permission denied' } })
          return api
        },
      }),
    }))
    const { loadQueue } = await import('@/lib/leads-queue')
    await expect(loadQueue('all')).rejects.toThrow(/permission denied/)
  })
})

describe('status vocabulary', () => {
  it('accepts only the four states the queue understands', async () => {
    const { isLeadStatus } = await import('@/lib/leads-queue')
    for (const s of ['new', 'working', 'contacted', 'closed']) expect(isLeadStatus(s)).toBe(true)
    for (const s of ['New', 'deleted', '', null, 7]) expect(isLeadStatus(s)).toBe(false)
  })
})

describe('the status route is not a public endpoint', () => {
  const src = fs.readFileSync(path.join(process.cwd(), 'app/api/agents/leads/route.ts'), 'utf8')

  it('checks the agent session before touching anything', () => {
    expect(src).toContain('isAgentAuthed()')
    expect(src.indexOf('isAgentAuthed()')).toBeLessThan(src.indexOf("from('leads')"))
  })

  it('is rate limited', () => {
    expect(src).toContain('checkRateLimit')
  })

  it('pins the claiming agent to the roster instead of trusting free text', () => {
    // The portal password is shared, so the name is the only attribution there
    // is; a free-text field would make it worthless.
    expect(src).toContain('AGENT_NAMES.has(agent)')
    expect(src).toContain("from '@/data/team'")
  })

  it('refuses a claim with no name', () => {
    expect(src).toMatch(/status === 'working' && !agent/)
  })

  it('validates the status instead of writing whatever it is sent', () => {
    expect(src).toContain('isLeadStatus(status)')
  })
})

describe('the queue page is private', () => {
  it('redirects an unauthenticated visitor to the login', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app/agents/leads/page.tsx'), 'utf8')
    expect(src).toMatch(/if \(!\(await isAgentAuthed\(\)\)\) redirect\('\/agents'\)/)
    expect(src).toContain("export const dynamic = 'force-dynamic'")
  })

  it('sits under the agents layout, which is noindex', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app/agents/layout.tsx'), 'utf8')
    expect(src).toMatch(/robots:\s*\{\s*index:\s*false/)
  })
})
