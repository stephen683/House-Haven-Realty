'use client'

import { useState, useRef } from 'react'
import TCPAConsent from './TCPAConsent'

const TIMELINE_OPTIONS = [
  'I want to start now',
  'Next 1–3 months',
  '3–6 months',
  '6–12 months',
  'Just learning the market',
]

export default function HomeSearchForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.toString() ?? ''
    const email = fd.get('email')?.toString() ?? ''
    const phone = fd.get('phone')?.toString() ?? ''
    const priceRange = fd.get('price_range')?.toString() ?? ''
    const beds = fd.get('beds')?.toString() ?? ''
    const areas = fd.get('areas')?.toString() ?? ''
    const timeline = fd.get('timeline')?.toString() ?? ''
    const notes = fd.get('notes')?.toString() ?? ''

    const message = [
      areas && `Areas: ${areas}`,
      priceRange && `Budget: ${priceRange}`,
      beds && `Beds: ${beds}+`,
      timeline && `Timeline: ${timeline}`,
      notes && `\nNotes:\n${notes}`,
    ].filter(Boolean).join('\n')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          source: 'home_search',
          interest: 'buyer',
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
          One of our agents will pull active matches and send them over today.
          Need to talk now? Call (615) 624-4766.
        </p>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hs-name" className="block text-xs font-semibold text-househaven-navy mb-1">
            Name
          </label>
          <input
            id="hs-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
        </div>
        <div>
          <label htmlFor="hs-email" className="block text-xs font-semibold text-househaven-navy mb-1">
            Email
          </label>
          <input
            id="hs-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
        </div>
        <div>
          <label htmlFor="hs-phone" className="block text-xs font-semibold text-househaven-navy mb-1">
            Phone
          </label>
          <input
            id="hs-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
        </div>
        <div>
          <label htmlFor="hs-timeline" className="block text-xs font-semibold text-househaven-navy mb-1">
            When are you looking to buy?
          </label>
          <select
            id="hs-timeline"
            name="timeline"
            defaultValue=""
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          >
            <option value="" disabled>Select a timeline</option>
            {TIMELINE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="hs-areas" className="block text-xs font-semibold text-househaven-navy mb-1">
            Areas / neighborhoods
          </label>
          <input
            id="hs-areas"
            name="areas"
            type="text"
            placeholder="East Nashville, Franklin, anywhere in Williamson…"
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
        </div>
        <div>
          <label htmlFor="hs-price" className="block text-xs font-semibold text-househaven-navy mb-1">
            Price range
          </label>
          <input
            id="hs-price"
            name="price_range"
            type="text"
            placeholder="$500K–$750K"
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          />
        </div>
        <div>
          <label htmlFor="hs-beds" className="block text-xs font-semibold text-househaven-navy mb-1">
            Minimum beds
          </label>
          <select
            id="hs-beds"
            name="beds"
            defaultValue=""
            className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
          >
            <option value="">No preference</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="hs-notes" className="block text-xs font-semibold text-househaven-navy mb-1">
          Anything else we should know?
        </label>
        <textarea
          id="hs-notes"
          name="notes"
          rows={3}
          placeholder="New construction only · walkable to a coffee shop · pre-approved with Pinnacle…"
          className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>

      <TCPAConsent />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send to the House Haven team'}
      </button>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
    </form>
  )
}
