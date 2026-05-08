'use client'

import { useState } from 'react'

export interface DiscoveryIntakeData {
  name: string
  email: string
  phone: string
  situation: string
  buyingOrSelling: 'buying' | 'selling' | 'both' | 'other' | ''
  howHeard: string
}

interface DiscoveryIntakeFormProps {
  onSubmit: (data: DiscoveryIntakeData) => void
}

export default function DiscoveryIntakeForm({ onSubmit }: DiscoveryIntakeFormProps) {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? '').trim()
    const bs = get('buyingOrSelling')
    onSubmit({
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      situation: get('situation'),
      buyingOrSelling: (['buying', 'selling', 'both', 'other'].includes(bs)
        ? bs
        : '') as DiscoveryIntakeData['buyingOrSelling'],
      howHeard: get('howHeard'),
    })
    setSubmitting(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-black/10 bg-white p-6 lg:p-8"
    >
      <div>
        <h2 className="font-serif text-2xl text-househaven-navy">
          Tell us a little about your situation.
        </h2>
        <p className="mt-2 text-sm text-househaven-text-muted">
          Two minutes. We use this to come prepared so the fifteen we have together is useful.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="d-name" name="name" label="Full name" required autoComplete="name" />
        <Field
          id="d-email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          id="d-phone"
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
        />
        <Field
          id="d-howHeard"
          name="howHeard"
          label="How did you hear about us?"
          placeholder="TikTok, friend, search, etc."
        />
      </div>

      <Radio
        name="buyingOrSelling"
        label="Are you buying, selling, or both?"
        options={[
          { value: 'buying', label: 'Buying' },
          { value: 'selling', label: 'Selling' },
          { value: 'both', label: 'Both' },
          { value: 'other', label: 'Something else' },
        ]}
        required
      />

      <Textarea
        id="d-situation"
        name="situation"
        label="What is the decision you are trying to make? (A few sentences in your own words.)"
        maxLength={1000}
        rows={4}
        required
      />

      <p className="text-xs text-househaven-text-muted leading-relaxed pt-2 border-t border-black/5">
        No payment, no email funnel. By submitting, you agree we can email and text you about
        the call you just booked. We will not contact you for anything else.
      </p>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light disabled:opacity-60"
        >
          Continue to slot selection →
        </button>
      </div>
    </form>
  )
}

function Field({
  id,
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
  placeholder,
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-househaven-navy mb-1.5">
        {label}
        {required && <span className="text-househaven-text-muted"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
      />
    </div>
  )
}

function Textarea({
  id,
  name,
  label,
  maxLength,
  rows = 3,
  required = false,
}: {
  id: string
  name: string
  label: string
  maxLength?: number
  rows?: number
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-househaven-navy mb-1.5">
        {label}
        {required && <span className="text-househaven-text-muted"> *</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        maxLength={maxLength}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
      />
      {maxLength && (
        <p className="text-[10px] text-househaven-text-muted mt-1">Max {maxLength} characters.</p>
      )}
    </div>
  )
}

function Radio({
  name,
  label,
  options,
  required = false,
}: {
  name: string
  label: string
  options: { value: string; label: string }[]
  required?: boolean
}) {
  return (
    <div>
      <p className="block text-xs font-semibold text-househaven-navy mb-1.5">
        {label}
        {required && <span className="text-househaven-text-muted"> *</span>}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/10 text-sm cursor-pointer hover:border-black/30 has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              className="sr-only"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
