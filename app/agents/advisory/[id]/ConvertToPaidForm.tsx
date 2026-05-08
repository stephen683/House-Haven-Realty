'use client'

import { useState } from 'react'

interface ConvertToPaidFormProps {
  bookingId: string
}

export default function ConvertToPaidForm({ bookingId }: ConvertToPaidFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch(`/api/agents/advisory/${bookingId}/convert-to-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: fd.get('note') || '' }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Conversion failed.')
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
      <div className="rounded bg-green-50 border border-green-200 p-3 text-sm text-green-900">
        Conversion stamped. Client received the link to /advisory/book; they complete payment
        there. Look for a new paid_brief booking row when they finish.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-househaven-text-muted">
        Stamps an admin note on this discovery booking and emails the prospect a one-click link
        to /advisory/book. They complete the paid intake + Stripe payment there as a separate
        booking row.
      </p>
      <input
        name="note"
        type="text"
        placeholder="Optional note for the audit trail (e.g. 'wants Buyer Roadmap')"
        className="w-full px-3 py-2 rounded border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-black text-white hover:bg-househaven-navy-light disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Convert to paid Brief →'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
