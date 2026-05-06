'use client'

import { useState } from 'react'
import TCPAConsent from './TCPAConsent'

const timelines = [
  { value: 'ASAP', label: 'ASAP — listing now' },
  { value: '1-3m', label: '1–3 months' },
  { value: '3-6m', label: '3–6 months' },
  { value: '6-12m', label: '6–12 months' },
  { value: 'curious', label: 'Just curious' },
]

export default function ValuationForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      address: fd.get('address'),
      city: fd.get('city'),
      zip: fd.get('zip'),
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      timeline: fd.get('timeline'),
      tcpaConsent: fd.get('tcpa_consent') === 'on',
    }
    try {
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('ok')
      ;(e.target as HTMLFormElement).reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="val-address" className="block text-sm font-medium text-househaven-text mb-1">
          Property address
        </label>
        <input
          id="val-address"
          name="address"
          required
          placeholder="123 Main St"
          autoComplete="street-address"
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="val-city" className="block text-sm font-medium text-househaven-text mb-1">
            City
          </label>
          <input
            id="val-city"
            name="city"
            required
            defaultValue="Nashville"
            autoComplete="address-level2"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
        <div>
          <label htmlFor="val-zip" className="block text-sm font-medium text-househaven-text mb-1">
            ZIP code
          </label>
          <input
            id="val-zip"
            name="zip"
            required
            inputMode="numeric"
            pattern="[0-9]{5}"
            autoComplete="postal-code"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="val-name" className="block text-sm font-medium text-househaven-text mb-1">
            Your name
          </label>
          <input
            id="val-name"
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
        <div>
          <label htmlFor="val-email" className="block text-sm font-medium text-househaven-text mb-1">
            Email
          </label>
          <input
            id="val-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="val-phone" className="block text-sm font-medium text-househaven-text mb-1">
            Phone
          </label>
          <input
            id="val-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
        <div>
          <label htmlFor="val-timeline" className="block text-sm font-medium text-househaven-text mb-1">
            When are you thinking of selling?
          </label>
          <select
            id="val-timeline"
            name="timeline"
            defaultValue=""
            className="w-full rounded-lg border border-black/10 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          >
            <option value="" disabled>
              Select…
            </option>
            {timelines.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TCPAConsent />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
      >
        {status === 'submitting' ? 'Requesting…' : 'Get my free CMA'}
      </button>
      {status === 'ok' && (
        <p className="text-sm text-househaven-success">
          Thank you — we&rsquo;ll get back to you within one business day with your full
          Comparative Market Analysis.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">
          {error ?? 'Something went wrong. Please try again.'}
        </p>
      )}
    </form>
  )
}
