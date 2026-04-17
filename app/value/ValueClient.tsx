'use client'

import { useState, useRef, useEffect } from 'react'
import type { RentCastComp } from '@/lib/rentcast'
import TCPAConsent from '@/components/forms/TCPAConsent'

interface EstimateResult {
  estimate: { low: number | null; mid: number | null; high: number | null }
  comps: RentCastComp[]
  confidenceNote: string
  source: 'rentcast' | 'mock'
  cached: boolean
}

const TIMELINE_OPTIONS = ['ASAP', '1-3 months', '3-6 months', '6-12 months', 'Just curious']

function fmt(n: number | null | undefined): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  return `$${Math.round(n).toLocaleString()}`
}

function fmtCompPrice(n: number | null): string {
  if (!n) return '—'
  return `$${Math.round(n).toLocaleString()}`
}

function fmtDate(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function ValueClient() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EstimateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!address.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim() }),
      })
      const data = await res.json() as EstimateResult & { error?: string }
      if (!res.ok) {
        setError(data.error || 'Could not get an estimate. Please try again.')
        return
      }
      setResult(data)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="value-address" className="block text-sm font-semibold text-househaven-navy">
          Your home address
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="value-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            autoComplete="street-address"
            placeholder="123 Main St, Nashville TN 37209"
            className="flex-1 px-4 py-3 rounded-lg border border-black/10 text-base focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
          <button
            type="submit"
            disabled={loading || !address.trim()}
            className="px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
          >
            {loading ? 'Pulling comps…' : 'Get my estimate'}
          </button>
        </div>
        <p className="text-xs text-househaven-text-muted">
          We do not store your address unless you ask for the full CMA below.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {loading && (
        <div className="mt-10 rounded-lg border border-black/5 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
          <p className="mt-3 text-sm text-househaven-text-muted">
            Pulling comps from recent sales near you…
          </p>
        </div>
      )}

      {result && (
        <div ref={resultRef} className="mt-10 space-y-8">
          <ResultCard result={result} />
          <CompsList comps={result.comps} />
          <CMARequestForm
            address={address.trim()}
            estimate={result.estimate}
          />
        </div>
      )}
    </div>
  )
}

function ResultCard({ result }: { result: EstimateResult }) {
  const { low, mid, high } = result.estimate
  return (
    <div className="rounded-xl bg-househaven-surface border border-black/5 p-6 lg:p-8">
      <p className="text-xs uppercase tracking-wider text-househaven-text-muted">
        Estimated value range
      </p>
      <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-serif text-5xl lg:text-6xl text-househaven-navy leading-none">
            {fmt(mid)}
          </p>
          <p className="text-sm text-househaven-text-muted mt-2">
            Low {fmt(low)} · High {fmt(high)}
          </p>
        </div>
      </div>

      {result.confidenceNote && (
        <p className="mt-4 text-sm text-househaven-text-muted">{result.confidenceNote}</p>
      )}

      <p className="mt-6 text-xs text-househaven-text-muted leading-relaxed border-t border-black/5 pt-4">
        This is an automated estimate based on public records and recent sales. It is not an
        appraisal. Every home is different — finishes, condition, and upgrades all affect the
        real number.
      </p>

      {result.source === 'mock' && (
        <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
          Showing sample data. Live valuations activate once the RentCast API key is added.
        </p>
      )}
    </div>
  )
}

function CompsList({ comps }: { comps: RentCastComp[] }) {
  if (!comps.length) return null
  return (
    <div>
      <h2 className="font-serif text-2xl text-househaven-navy">Recent sales nearby</h2>
      <div className="mt-4 space-y-2">
        {comps.map((c, i) => (
          <div key={i} className="rounded-lg border border-black/5 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-househaven-navy text-sm truncate">{c.address || 'Address withheld'}</p>
              <p className="text-xs text-househaven-text-muted mt-1">
                {c.bedrooms ? `${c.bedrooms} bed` : ''}
                {c.bathrooms ? ` · ${c.bathrooms} bath` : ''}
                {c.squareFootage ? ` · ${c.squareFootage.toLocaleString()} sqft` : ''}
                {c.yearBuilt ? ` · built ${c.yearBuilt}` : ''}
              </p>
              {c.soldDate && (
                <p className="text-[11px] text-househaven-text-muted mt-1">Sold {fmtDate(c.soldDate)}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-serif text-lg text-househaven-navy">{fmtCompPrice(c.price)}</p>
              {c.distance != null && (
                <p className="text-[11px] text-househaven-text-muted">{c.distance.toFixed(1)} mi away</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CMARequestFormProps {
  address: string
  estimate: { low: number | null; mid: number | null; high: number | null }
}

function CMARequestForm({ address, estimate }: CMARequestFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/value/request-cma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          address,
          timeline: fd.get('timeline'),
          estimate,
          tcpaConsent: fd.get('tcpa_consent') === 'on',
        }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit. Try again.')
        setStatus('error')
        return
      }
      setStatus('ok')
      formRef.current?.reset()
    } catch {
      setErrorMsg('Network error. Try again.')
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-xl bg-black text-white p-8 text-center">
        <p className="font-serif text-2xl">Got it.</p>
        <p className="mt-3 text-white/70">
          Stephen will personally prepare your CMA and send it within 24 hours.
          Want to talk now? Call (615) 624-4766.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-6 lg:p-8 shadow-sm">
      <h2 className="font-serif text-2xl text-househaven-navy">Want the real number?</h2>
      <p className="mt-3 text-sm text-househaven-text-muted leading-relaxed">
        Every home is different. An automated estimate cannot account for your finishes, your
        upgrades, the story of your home. Stephen will prepare a free Comparative Market
        Analysis — the same one we&rsquo;d prepare for a listing appointment — so you know
        exactly where you stand. No obligation. No pressure.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cma-name" className="block text-xs font-semibold text-househaven-navy mb-1">
              Name
            </label>
            <input
              id="cma-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
            />
          </div>
          <div>
            <label htmlFor="cma-email" className="block text-xs font-semibold text-househaven-navy mb-1">
              Email
            </label>
            <input
              id="cma-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
            />
          </div>
          <div>
            <label htmlFor="cma-phone" className="block text-xs font-semibold text-househaven-navy mb-1">
              Phone
            </label>
            <input
              id="cma-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
            />
          </div>
          <div>
            <label htmlFor="cma-timeline" className="block text-xs font-semibold text-househaven-navy mb-1">
              When are you thinking of selling?
            </label>
            <select
              id="cma-timeline"
              name="timeline"
              required
              defaultValue=""
              className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
            >
              <option value="" disabled>Select a timeline</option>
              {TIMELINE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <TCPAConsent />

        <p className="text-xs font-semibold text-househaven-navy bg-househaven-surface rounded-lg px-3 py-2">
          Broker commissions are not set by law and are fully negotiable.
        </p>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Get my full CMA from Stephen'}
        </button>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      </form>
    </div>
  )
}
