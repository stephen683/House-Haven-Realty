'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import IntakeForm, { type IntakeData } from './IntakeForm'
import SlotPicker, { type Slot } from './SlotPicker'

// Lazy-mount StripeCheckout: this code-splits @stripe/react-stripe-js +
// @stripe/stripe-js into a separate chunk that only loads when the user
// reaches the payment step. ssr:false because Stripe Elements is client-only.
const StripeCheckout = dynamic(() => import('./StripeCheckout'), {
  ssr: false,
  loading: () => (
    <p className="text-sm text-househaven-text-muted">Loading payment form…</p>
  ),
})

type Step = 'intake' | 'slot' | 'payment'

interface CreateIntentLiveResponse {
  mode: 'live'
  bookingId: string
  clientSecret: string
  publishableKey: string | null
}
interface CreateIntentMockResponse {
  mode: 'mock'
  bookingId: string
  redirectTo: string
}
type CreateIntentResponse =
  | CreateIntentLiveResponse
  | CreateIntentMockResponse
  | { error: string }

export default function BookingClient() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intake')
  const [intake, setIntake] = useState<IntakeData | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [intentResult, setIntentResult] = useState<CreateIntentLiveResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function startCheckout(finalSlot: Slot) {
    if (!intake) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/advisory/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake, slotUtcIso: finalSlot.utc }),
      })
      const data = (await res.json()) as CreateIntentResponse
      if (!res.ok) {
        setError('error' in data ? data.error : 'Could not start checkout. Try again.')
        return
      }
      if ('mode' in data && data.mode === 'mock') {
        router.push(data.redirectTo)
        return
      }
      if ('mode' in data && data.mode === 'live') {
        setIntentResult(data)
        setStep('payment')
        return
      }
      setError('Unexpected response from server.')
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
          onBack={() => setStep('intake')}
          onSelect={(s) => {
            setSlot(s)
            startCheckout(s)
          }}
          submitting={submitting}
        />
      )}

      {step === 'payment' && intentResult && slot && (
        <StripeCheckout
          clientSecret={intentResult.clientSecret}
          publishableKey={intentResult.publishableKey}
          bookingId={intentResult.bookingId}
          trackName="Decision Brief"
          slot={slot}
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
    { key: 'intake', label: 'Intake' },
    { key: 'slot', label: 'Slot' },
    { key: 'payment', label: 'Payment' },
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
