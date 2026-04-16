'use client'

import { useState } from 'react'
import TCPAConsent from './TCPAConsent'

export default function NewsletterSignup() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Newsletter subscriber',
        email: formData.get('email'),
        message: 'Newsletter signup',
        source: 'newsletter',
      }),
    })
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) (e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="flex-1 px-4 py-3 rounded-full border border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-househaven-accent"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="px-6 py-3 rounded-full bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition disabled:opacity-60"
        >
          {status === 'submitting' ? 'Signing up…' : 'Subscribe'}
        </button>
      </div>
      <div className="text-white/80">
        <TCPAConsent name="newsletter_tcpa" />
      </div>
      {status === 'ok' && (
        <p className="text-sm text-househaven-accent">You&rsquo;re on the list. Watch your inbox.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-200">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
