'use client'

import { useRef, useState } from 'react'

interface NotifySignupProps {
  permitNumber: string
  address: string
  zip: string
}

export default function NotifySignup({ permitNumber, address, zip }: NotifySignupProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/pipeline/notify-property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: fd.get('email'),
        tcpaConsent: fd.get('notify_tcpa') === 'on',
        permitNumber,
        address,
        zip,
      }),
    })
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) formRef.current?.reset()
  }

  if (status === 'ok') {
    return (
      <div className="rounded-lg bg-black text-white p-4 text-center">
        <p className="font-serif text-lg">You&rsquo;re on the list.</p>
        <p className="mt-1 text-xs text-white/70">
          When this home lists, you&rsquo;ll hear from Stephen directly.
        </p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-lg bg-black text-white p-4 space-y-3"
    >
      <div>
        <p className="font-serif text-base">Get notified when this lists</p>
        <p className="mt-1 text-[11px] text-white/60">
          One email when this home hits the MLS. Nothing else.
        </p>
      </div>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full px-3 py-2 rounded-lg bg-white text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/40"
      />
      <label className="flex gap-2 items-start text-[10px] text-white/70 leading-relaxed">
        <input
          type="checkbox"
          name="notify_tcpa"
          required
          className="mt-0.5 h-3.5 w-3.5 rounded border-white/30"
        />
        <span>
          I agree to receive one-time email notification from House Haven Realty when this
          property is listed. Consent not required for purchase. Unsubscribe anytime.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition disabled:opacity-60"
      >
        {status === 'submitting' ? 'Adding you\u2026' : 'Notify me when this lists'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-300">Something went wrong. Try again or call (615) 624-4766.</p>
      )}
    </form>
  )
}
