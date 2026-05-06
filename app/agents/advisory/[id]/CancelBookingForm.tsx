'use client'

import { useState } from 'react'

interface CancelBookingFormProps {
  bookingId: string
}

export default function CancelBookingForm({ bookingId }: CancelBookingFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!confirming) {
      setConfirming(true)
      return
    }
    setSubmitting(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch(`/api/agents/advisory/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: fd.get('reason') || 'Canceled by Stephen.',
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Cancel failed.')
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
      <div className="rounded bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        Booking canceled. Calendar event removed; client emailed. Refund handled separately
        in the Stripe Dashboard.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-househaven-text-muted">
        Sets the booking to canceled, deletes the Google Calendar event (with an attendee
        update), and emails the client. <strong>Stripe refund is not automated</strong> —
        process it in the Stripe Dashboard if applicable.
      </p>
      <input
        name="reason"
        type="text"
        placeholder="Cancellation reason (optional, included in client email)"
        className="w-full px-3 py-2 rounded border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
      />
      <button
        type="submit"
        disabled={submitting}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 ${
          confirming
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'border border-red-300 text-red-700 hover:bg-red-50'
        }`}
      >
        {submitting
          ? 'Canceling…'
          : confirming
          ? 'Confirm cancel — this is final'
          : 'Cancel booking'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
