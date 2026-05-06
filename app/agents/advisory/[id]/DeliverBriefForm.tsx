'use client'

import { useState } from 'react'

interface DeliverBriefFormProps {
  bookingId: string
  alreadyDelivered: boolean
}

export default function DeliverBriefForm({
  bookingId,
  alreadyDelivered,
}: DeliverBriefFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch(`/api/advisory/deliver-brief/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefPdfUrl: fd.get('briefPdfUrl') }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Delivery failed.')
        setStatus('error')
      } else {
        setStatus('ok')
      }
    } catch {
      setError('Network error.')
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded bg-green-50 border border-green-200 p-3 text-sm text-green-800">
        Brief delivery email sent. Reload the page to see updated status.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-househaven-text-muted">
        Paste the URL of the Brief PDF (e.g. a Google Drive or Dropbox public link). The
        client gets an email with the link; this booking flips to{' '}
        <code className="font-mono text-[10px]">brief_status = delivered</code>.
      </p>
      <input
        name="briefPdfUrl"
        type="url"
        required
        placeholder="https://..."
        className="w-full px-3 py-2 rounded border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light disabled:opacity-60"
      >
        {alreadyDelivered
          ? submitting
            ? 'Re-sending…'
            : 'Re-send Brief email'
          : submitting
          ? 'Sending…'
          : 'Deliver Brief'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
