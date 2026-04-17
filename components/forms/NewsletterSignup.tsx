'use client'

import { useState, useRef } from 'react'
import TCPAConsent from './TCPAConsent'

interface NewsletterSignupProps {
  variant?: 'dark' | 'light'
  compact?: boolean
  label?: string
}

export default function NewsletterSignup({
  variant = 'dark',
  compact = false,
  label,
}: NewsletterSignupProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const formData = new FormData(e.currentTarget)
    const tcpaConsent = formData.get('newsletter_tcpa') === 'on'

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        tcpaConsent,
      }),
    })
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) formRef.current?.reset()
  }

  const isDark = variant === 'dark'
  const inputClass = isDark
    ? 'flex-1 px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-househaven-accent'
    : 'flex-1 px-4 py-3 rounded-lg border border-black/15 bg-white text-househaven-navy placeholder:text-househaven-text-muted focus:outline-none focus:ring-2 focus:ring-househaven-navy/30'
  const buttonClass = isDark
    ? 'px-6 py-3 rounded-lg bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition disabled:opacity-60'
    : 'px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60'
  const tcpaWrapperClass = isDark ? 'text-white/80' : ''
  const successClass = isDark ? 'text-househaven-accent' : 'text-emerald-700'
  const errorClass = isDark ? 'text-red-200' : 'text-red-600'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${compact ? 'max-w-sm' : 'max-w-lg mx-auto'} space-y-3`}
    >
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
          autoComplete="email"
          className={inputClass}
        />
        <button type="submit" disabled={status === 'submitting'} className={buttonClass}>
          {status === 'submitting' ? 'Signing up…' : (label || 'Subscribe')}
        </button>
      </div>
      {!compact && (
        <div className={tcpaWrapperClass}>
          <TCPAConsent name="newsletter_tcpa" />
        </div>
      )}
      {compact && (
        <p className={`text-[10px] ${isDark ? 'text-white/60' : 'text-househaven-text-muted'}`}>
          We&rsquo;ll email you when House Haven Journey is live. Easy to unsubscribe.
        </p>
      )}
      {status === 'ok' && (
        <p className={`text-sm ${successClass}`}>You&rsquo;re on the list. Watch your inbox.</p>
      )}
      {status === 'error' && (
        <p className={`text-sm ${errorClass}`}>Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
