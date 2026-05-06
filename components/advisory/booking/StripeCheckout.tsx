'use client'

import { useEffect, useState } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import type { Slot } from './SlotPicker'

interface StripeCheckoutProps {
  clientSecret: string
  publishableKey: string | null
  bookingId: string
  trackName: string
  slot: Slot
}

export default function StripeCheckout({
  clientSecret,
  publishableKey,
  bookingId,
  trackName,
  slot,
}: StripeCheckoutProps) {
  // Lazy-mount: only call loadStripe when this step actually renders.
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)

  useEffect(() => {
    if (!publishableKey) return
    setStripePromise(loadStripe(publishableKey))
  }, [publishableKey])

  if (!publishableKey) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-semibold text-amber-900">Stripe not configured.</p>
        <p className="mt-2 text-sm text-amber-800">
          Live booking requires Stripe credentials. The booking record was created (id{' '}
          <code>{bookingId}</code>) and will be marked succeeded by the webhook once keys land.
        </p>
      </div>
    )
  }

  if (!stripePromise) {
    return <p className="text-sm text-househaven-text-muted">Loading payment form…</p>
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 lg:p-8">
      <h2 className="font-serif text-2xl text-househaven-navy">Pay $200 to confirm.</h2>
      <p className="mt-2 text-sm text-househaven-text-muted">
        {trackName} consult on {slot.centralLabel}. Pre-paid, flat. Brief delivered within 48
        hours of the consult.
      </p>

      <div className="mt-6">
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: 'stripe' } }}
        >
          <CheckoutForm bookingId={bookingId} />
        </Elements>
      </div>
    </div>
  )
}

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/advisory/book/confirmation?id=${bookingId}`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setSubmitting(false)
    }
    // On success, Stripe redirects to return_url; nothing else here.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="w-full px-5 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light disabled:opacity-60"
      >
        {submitting ? 'Processing…' : 'Pay $200'}
      </button>
      <p className="text-xs text-househaven-text-muted">
        Secured by Stripe. Card details never touch our servers.
      </p>
    </form>
  )
}
