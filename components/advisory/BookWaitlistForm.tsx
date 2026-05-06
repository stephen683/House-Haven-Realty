'use client'

import { useState } from 'react'
import TCPAConsent from '@/components/forms/TCPAConsent'
import { ADVISORY_TRACKS, type AdvisoryTrackSlug } from '@/lib/advisory-config'

interface BookWaitlistFormProps {
  initialTrack?: AdvisoryTrackSlug
}

export default function BookWaitlistForm({ initialTrack }: BookWaitlistFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [track, setTrack] = useState<AdvisoryTrackSlug | ''>(initialTrack ?? '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/advisory/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fd.get('email'),
          track: fd.get('track') || null,
          source: 'advisory_book_placeholder',
          tcpaConsent: fd.get('tcpa_consent') === 'on',
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not add you to the list. Try again.')
        setStatus('error')
        return
      }
      setStatus('ok')
    } catch {
      setErrorMsg('Network error. Try again.')
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-xl bg-black text-white p-8">
        <p className="font-serif text-2xl">You are on the list.</p>
        <p className="mt-3 text-white/70">
          We will email you the day booking opens. Until then, the homepage and the track pages
          have everything we have published so far.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-black/10 bg-white p-6 lg:p-8 shadow-sm space-y-5"
    >
      <div>
        <label
          htmlFor="waitlist-email"
          className="block text-xs font-semibold text-househaven-navy mb-1.5"
        >
          Email
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>

      <div>
        <label
          htmlFor="waitlist-track"
          className="block text-xs font-semibold text-househaven-navy mb-1.5"
        >
          Which track interests you most? (optional)
        </label>
        <select
          id="waitlist-track"
          name="track"
          value={track}
          onChange={(e) => setTrack(e.target.value as AdvisoryTrackSlug | '')}
          className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        >
          <option value="">Not sure yet</option>
          {ADVISORY_TRACKS.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <TCPAConsent />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
      >
        {status === 'submitting' ? 'Adding you…' : 'Notify me when booking opens'}
      </button>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
    </form>
  )
}
