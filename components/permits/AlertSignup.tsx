'use client'

import { useState, useRef } from 'react'

interface AlertSignupProps {
  availableZips: string[]
}

export default function AlertSignup({ availableZips }: AlertSignupProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fd.get('email'),
        tcpaConsent: fd.get('alert_tcpa') === 'on',
        source: 'nashbuilds_alert',
        targetZip: fd.get('target_zip'),
      }),
    })
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) formRef.current?.reset()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-black/10 text-xs font-medium text-househaven-navy hover:border-black/20 transition"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        Get alerts
      </button>
    )
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-black/10 rounded-lg shadow-xl p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-househaven-navy">
          New build alerts
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-househaven-text-muted hover:text-househaven-navy"
          aria-label="Close alert signup"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {status === 'ok' ? (
        <div className="text-center py-4">
          <p className="font-serif text-lg text-househaven-navy">You&rsquo;re subscribed</p>
          <p className="text-xs text-househaven-text-muted mt-1">
            We&rsquo;ll email you when new permits hit your target ZIP.
          </p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="alert-email" className="block text-xs text-househaven-text-muted mb-1">
              Email
            </label>
            <input
              id="alert-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/20"
            />
          </div>
          <div>
            <label htmlFor="alert-zip" className="block text-xs text-househaven-text-muted mb-1">
              Target ZIP code
            </label>
            <select
              id="alert-zip"
              name="target_zip"
              required
              className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/20"
            >
              <option value="">Select a ZIP</option>
              {availableZips.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
          <label className="flex gap-2 items-start text-[10px] text-househaven-text-muted leading-relaxed">
            <input
              type="checkbox"
              name="alert_tcpa"
              required
              className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300"
            />
            <span>
              I agree to receive new construction alerts from House Haven Realty via email.
              Consent not required for purchase. Unsubscribe anytime.
            </span>
          </label>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full px-4 py-2.5 rounded-lg bg-househaven-navy text-white text-sm font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe to alerts'}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-600">Something went wrong. Try again.</p>
          )}
        </form>
      )}
    </div>
  )
}
