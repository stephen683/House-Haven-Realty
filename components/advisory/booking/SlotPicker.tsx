'use client'

import { useEffect, useState } from 'react'

export interface Slot {
  utc: string
  centralLabel: string
}

type SlotType = 'paid_brief' | 'discovery_call'

interface SlotPickerProps {
  onSelect: (slot: Slot) => void
  onBack: () => void
  submitting: boolean
  slotType?: SlotType
  info?: string
  ctaLabel?: string
  ctaSubmittingLabel?: string
}

interface SlotsResponse {
  slots?: Slot[]
  source?: 'live' | 'mock'
  error?: string
}

const DEFAULT_INFO: Record<SlotType, string> = {
  paid_brief:
    'All times Central. Tuesday 9:00 / 10:30 AM and Thursday 1:00 / 2:30 PM are the regular consult windows.',
  discovery_call:
    'All times Central. 15-minute slots run Monday, Wednesday, and Friday from 9–11 AM.',
}

// "Tuesday, March 10, 9:00 AM CST" → "Tuesday, March 10" + "9:00 AM CST"
function splitLabel(label: string): { day: string; time: string } {
  const parts = label.split(',').map((p) => p.trim())
  if (parts.length >= 3) {
    return {
      day: `${parts[0]}, ${parts[1]}`,
      time: parts.slice(2).join(', '),
    }
  }
  return { day: label, time: '' }
}

export default function SlotPicker({
  onSelect,
  onBack,
  submitting,
  slotType = 'paid_brief',
  info,
  ctaLabel = 'Continue to payment →',
  ctaSubmittingLabel = 'Setting up checkout…',
}: SlotPickerProps) {
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [source, setSource] = useState<'live' | 'mock' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const from = new Date(Date.now() + 48 * 3600 * 1000).toISOString()
    const to = new Date(Date.now() + 30 * 86_400_000).toISOString()
    fetch(
      `/api/advisory/calendar-slots?type=${encodeURIComponent(slotType)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    )
      .then((r) => r.json())
      .then((data: SlotsResponse) => {
        if (data.error) setError(data.error)
        else {
          setSlots(data.slots ?? [])
          setSource(data.source ?? 'mock')
        }
      })
      .catch(() => setError('Could not load slots. Try again.'))
  }, [slotType])

  // Group slots by day
  const byDay = (slots ?? []).reduce<Record<string, Slot[]>>((acc, s) => {
    const { day } = splitLabel(s.centralLabel)
    acc[day] = acc[day] || []
    acc[day].push(s)
    return acc
  }, {})

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 lg:p-8">
      <h2 className="font-serif text-2xl text-househaven-navy">Pick your slot.</h2>
      <p className="mt-2 text-sm text-househaven-text-muted">
        {info ?? DEFAULT_INFO[slotType]}
      </p>
      {source === 'mock' && (
        <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded px-3 py-2 inline-block">
          Calendar in mock mode — slots shown reflect policy windows but Stephen&rsquo;s real
          calendar is not consulted yet. Live slots activate once Google OAuth env vars are set.
        </p>
      )}

      {!slots && !error && (
        <p className="mt-6 text-sm text-househaven-text-muted">Loading…</p>
      )}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {slots && slots.length === 0 && (
        <p className="mt-6 text-sm text-househaven-text-muted">
          No slots open in the next 30 days. Email{' '}
          <a className="underline" href="mailto:stephen@househavenrealty.com">
            stephen@househavenrealty.com
          </a>{' '}
          and we will find one.
        </p>
      )}

      {slots && slots.length > 0 && (
        <div className="mt-6 space-y-5 max-h-96 overflow-y-auto pr-2">
          {Object.entries(byDay).map(([day, daySlots]) => (
            <div key={day}>
              <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                {day}
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {daySlots.map((s) => {
                  const { time } = splitLabel(s.centralLabel)
                  return (
                    <button
                      key={s.utc}
                      type="button"
                      onClick={() => setSelected(s.utc)}
                      className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition ${
                        selected === s.utc
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-black/10 text-househaven-navy hover:border-black/30'
                      }`}
                    >
                      {time || s.centralLabel}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-3 pt-4 border-t border-black/5">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-househaven-navy hover:bg-househaven-surface"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!selected || submitting}
          onClick={() => {
            const slot = slots?.find((s) => s.utc === selected)
            if (slot) onSelect(slot)
          }}
          className="flex-1 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light disabled:opacity-60"
        >
          {submitting ? ctaSubmittingLabel : ctaLabel}
        </button>
      </div>
    </div>
  )
}
