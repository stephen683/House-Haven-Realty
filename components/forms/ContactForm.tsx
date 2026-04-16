'use client'

import { useState } from 'react'
import TCPAConsent from './TCPAConsent'

const interests = [
  'Buying a home',
  'Selling a home',
  'Investing',
  'Property management',
  'Something else',
]

export default function ContactForm({ source = 'contact' }: { source?: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      interest: data.get('interest'),
      message: data.get('message'),
      source,
      tcpaConsent: data.get('tcpa_consent') === 'on',
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('ok')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-househaven-text mb-1">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-househaven-text mb-1">
            Email
          </label>
          <input
            id="contact-email"
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
          <label htmlFor="contact-phone" className="block text-sm font-medium text-househaven-text mb-1">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          />
        </div>
        <div>
          <label htmlFor="contact-interest" className="block text-sm font-medium text-househaven-text mb-1">
            I&rsquo;m interested in
          </label>
          <select
            id="contact-interest"
            name="interest"
            defaultValue=""
            className="w-full rounded-lg border border-black/10 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy"
          >
            <option value="" disabled>
              Select one…
            </option>
            {interests.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-househaven-text mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
        />
      </div>
      <TCPAConsent />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'ok' && (
        <p className="text-sm text-househaven-success">
          Thank you — we&rsquo;ll be in touch within one business day.
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
