import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clientIp, LIMITS, tooManyRequests } from '@/lib/rate-limit'

const rpc = vi.fn()
vi.mock('@/lib/supabase/service', () => ({ createServiceClient: () => ({ rpc }) }))

const req = (headers: Record<string, string> = {}) =>
  new Request('https://www.househavenrealty.com/api/contact', { method: 'POST', headers })

describe('rate limiter', () => {
  beforeEach(() => { rpc.mockReset(); vi.resetModules() })

  it('takes the left-most forwarded address as the client', () => {
    expect(clientIp(req({ 'x-forwarded-for': '203.0.113.9, 70.41.3.18, 150.172.238.178' }))).toBe('203.0.113.9')
    expect(clientIp(req({ 'x-real-ip': '198.51.100.4' }))).toBe('198.51.100.4')
    expect(clientIp(req())).toBe('unknown')
  })

  it('allows when the bucket has room', async () => {
    rpc.mockResolvedValue({ data: true, error: null })
    const { checkRateLimit } = await import('@/lib/rate-limit')
    expect(await checkRateLimit(req(), LIMITS.contact)).toEqual({ allowed: true, degraded: false })
  })

  it('denies once the window is exhausted', async () => {
    rpc.mockResolvedValue({ data: false, error: null })
    const { checkRateLimit } = await import('@/lib/rate-limit')
    expect(await checkRateLimit(req(), LIMITS.contact)).toEqual({ allowed: false, degraded: false })
  })

  it('fails OPEN when the limiter itself is broken — never drop a real lead', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'connection refused' } })
    const { checkRateLimit } = await import('@/lib/rate-limit')
    expect(await checkRateLimit(req(), LIMITS.contact)).toEqual({ allowed: true, degraded: true })
  })

  it('fails OPEN when the client throws', async () => {
    rpc.mockRejectedValue(new Error('boom'))
    const { checkRateLimit } = await import('@/lib/rate-limit')
    expect(await checkRateLimit(req(), LIMITS.contact)).toEqual({ allowed: true, degraded: true })
  })

  it('scopes buckets per endpoint and per IP, so forms cannot exhaust each other', async () => {
    rpc.mockResolvedValue({ data: true, error: null })
    const { checkRateLimit } = await import('@/lib/rate-limit')
    await checkRateLimit(req({ 'x-forwarded-for': '1.1.1.1' }), LIMITS.contact)
    await checkRateLimit(req({ 'x-forwarded-for': '1.1.1.1' }), LIMITS.newsletter)
    await checkRateLimit(req({ 'x-forwarded-for': '2.2.2.2' }), LIMITS.contact)
    const buckets = rpc.mock.calls.map((c) => (c[1] as { p_bucket: string }).p_bucket)
    expect(new Set(buckets)).toEqual(new Set(['contact:1.1.1.1', 'newsletter:1.1.1.1', 'contact:2.2.2.2']))
  })

  it('answers 429 with Retry-After and a human route to reach the brokerage', async () => {
    const res = tooManyRequests(LIMITS.contact)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe(String(LIMITS.contact.windowSeconds))
    expect(await res.json()).toMatchObject({ error: expect.stringContaining('615') })
  })

  it('throttles the billed valuation endpoint and the agent password harder than nothing', () => {
    expect(LIMITS.valueLookup.max).toBeLessThanOrEqual(12)   // RentCast bills per call
    expect(LIMITS.agentAuth.max).toBeLessThanOrEqual(8)      // shared-password brute force
    expect(LIMITS.agentAuth.windowSeconds).toBeLessThanOrEqual(900)
  })
})
