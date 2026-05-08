'use client'

import { useState } from 'react'

export interface IntakeData {
  name: string
  email: string
  phone: string
  situation: string
  walkawayGoal: string
  questions: string
  referral: string
  acknowledgment: boolean
}

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? '').trim()
    onSubmit({
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      situation: get('situation'),
      walkawayGoal: get('walkawayGoal'),
      questions: get('questions'),
      referral: get('referral'),
      acknowledgment: fd.get('acknowledgment') === 'on',
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
          Tell us about your situation.
        </h2>
        <p className="mt-2 text-sm text-househaven-text-muted">
          The more specific you are, the better the prep — and the more useful the hour.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="intake-name" name="name" label="Full legal name" required autoComplete="name" />
        <Field
          id="intake-email"
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Field
          id="intake-phone"
          name="phone"
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
        />
        <Field
          id="intake-referral"
          name="referral"
          label="How did you hear about HHR Advisory?"
        />
      </div>

      <Textarea
        id="intake-situation"
        name="situation"
        label="What is the decision in front of you? (FSBO, buying, sell-or-rent, relocation, something else — describe in your own words.)"
        maxLength={1000}
        rows={3}
        required
      />
      <Textarea
        id="intake-walkaway"
        name="walkawayGoal"
        label="In one sentence, what specifically do you want to walk away from this consult with?"
        maxLength={500}
        rows={2}
        required
      />
      <Textarea
        id="intake-questions"
        name="questions"
        label="What are the 2–3 questions you most want me to answer?"
        maxLength={1000}
        rows={4}
        required
      />

      <label className="flex gap-3 items-start text-xs text-househaven-text-muted leading-relaxed pt-4 border-t border-black/5">
        <input
          type="checkbox"
          name="acknowledgment"
          required
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-househaven-navy focus:ring-househaven-navy"
        />
        <span>
          I understand this is a paid real estate consultation, not legal, financial, or tax
          advice. I will receive an engagement letter for review before our consult begins.
        </span>
      </label>

      <div className="pt-4">
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
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  autoComplete?: string
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
