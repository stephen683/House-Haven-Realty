'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IntakeForm, { type DiscoveryIntakeData } from './IntakeForm'
import SlotPicker, { type Slot } from '../booking/SlotPicker'

type Step = 'intake' | 'slot'

interface SubmitResponse {
  ok?: boolean
  bookingId?: string
  redirectTo?: string
  error?: string
}

export default function DiscoveryBookingClient() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intake')
  const [intake, setIntake] = useState<DiscoveryIntakeData | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(slot: Slot) {
    if (!intake) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/advisory/discovery-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake, slotUtcIso: slot.utc }),
      })
      const data = (await res.json()) as SubmitResponse
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Could not book the call. Try again.')
        return
      }
      if (data.redirectTo) router.push(data.redirectTo)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Stepper currentStep={step} />

      {step === 'intake' && (
        <IntakeForm
          onSubmit={(data) => {
            setIntake(data)
            setStep('slot')
          }}
        />
      )}

      {step === 'slot' && intake && (
        <SlotPicker
          slotType="discovery_call"
          info="Discovery calls run Monday, Wednesday, and Friday from 9–11 AM Central in 15-minute slots. Pick whatever works."
          ctaLabel="Confirm discovery call →"
          ctaSubmittingLabel="Booking…"
          onBack={() => setStep('intake')}
          onSelect={(s) => submit(s)}
          submitting={submitting}
        />
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}

function Stepper({ currentStep }: { currentStep: Step }) {
  const steps: Array<{ key: Step; label: string }> = [
    { key: 'intake', label: 'About you' },
    { key: 'slot', label: 'Pick a slot' },
  ]
  const idx = steps.findIndex((s) => s.key === currentStep)
  return (
    <ol className="flex gap-2 text-xs">
      {steps.map((s, i) => (
        <li
          key={s.key}
          className={`flex-1 px-3 py-2 rounded text-center ${
            i < idx
              ? 'bg-black text-white'
              : i === idx
              ? 'bg-househaven-navy text-white'
              : 'bg-househaven-surface text-househaven-text-muted'
          }`}
        >
          {i + 1}. {s.label}
        </li>
      ))}
    </ol>
  )
}
