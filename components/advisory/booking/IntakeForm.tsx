'use client'

import { useState } from 'react'
import type { AdvisoryTrackSlug } from '@/lib/advisory-config'

export interface IntakeData {
  name: string
  email: string
  phone: string
  walkawayGoal: string
  questions: string
  referral: string
  acknowledgment: boolean
  // FSBO + Sell-or-Rent share propertyAddress
  propertyAddress?: string
  // FSBO
  fsboListingStatus?: 'listed' | 'preparing' | 'decided_not'
  fsboAskingPrice?: string
  fsboCompNote?: string
  // Buyer Roadmap
  buyerTimeframe?: '6m' | '6-12m' | '12-18m' | '18m+'
  preApprovalStatus?: 'not_started' | 'in_process' | 'approved'
  targetNeighborhoods?: string
  targetPriceRange?: string
  buyerComplexity?: string
  // Sell-or-Rent
  sorMortgage?: string
  sorReason?: 'job' | 'upgrade' | 'family' | 'other'
  sorTimeframe?: string
}

interface IntakeFormProps {
  track: AdvisoryTrackSlug
  onSubmit: (data: IntakeData) => void
  onBack?: () => void
}

export default function IntakeForm({ track, onSubmit, onBack }: IntakeFormProps) {
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => String(fd.get(k) ?? '').trim()
    const data: IntakeData = {
      name: get('name'),
      email: get('email'),
      phone: get('phone'),
      walkawayGoal: get('walkawayGoal'),
      questions: get('questions'),
      referral: get('referral'),
      acknowledgment: fd.get('acknowledgment') === 'on',
    }
    if (track === 'fsbo') {
      data.propertyAddress = get('propertyAddress')
      const status = get('fsboListingStatus')
      data.fsboListingStatus =
        (['listed', 'preparing', 'decided_not'].includes(status)
          ? status
          : undefined) as IntakeData['fsboListingStatus']
      data.fsboAskingPrice = get('fsboAskingPrice') || undefined
      data.fsboCompNote = get('fsboCompNote') || undefined
    } else if (track === 'buyer-roadmap') {
      const tf = get('buyerTimeframe')
      data.buyerTimeframe = (['6m', '6-12m', '12-18m', '18m+'].includes(tf)
        ? tf
        : undefined) as IntakeData['buyerTimeframe']
      const pa = get('preApprovalStatus')
      data.preApprovalStatus = (['not_started', 'in_process', 'approved'].includes(pa)
        ? pa
        : undefined) as IntakeData['preApprovalStatus']
      data.targetNeighborhoods = get('targetNeighborhoods') || undefined
      data.targetPriceRange = get('targetPriceRange') || undefined
      data.buyerComplexity = get('buyerComplexity') || undefined
    } else if (track === 'sell-or-rent') {
      data.propertyAddress = get('propertyAddress')
      data.sorMortgage = get('sorMortgage') || undefined
      const reason = get('sorReason')
      data.sorReason = (['job', 'upgrade', 'family', 'other'].includes(reason)
        ? reason
        : undefined) as IntakeData['sorReason']
      data.sorTimeframe = get('sorTimeframe') || undefined
    }
    onSubmit(data)
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

      {track === 'fsbo' && (
        <div className="space-y-4 pt-2 border-t border-black/5">
          <Field
            id="fsbo-address"
            name="propertyAddress"
            label="Property address"
            required
            autoComplete="street-address"
          />
          <Radio
            name="fsboListingStatus"
            label="Listing status"
            options={[
              { value: 'listed', label: 'Already listed FSBO' },
              { value: 'preparing', label: 'Preparing to list' },
              { value: 'decided_not', label: 'Decided not to list' },
            ]}
            required
          />
          <Field id="fsbo-asking" name="fsboAskingPrice" label="Asking price (if listed)" />
          <Textarea
            id="fsbo-comp"
            name="fsboCompNote"
            label="Anything specific about the property the comps wouldn't show?"
            maxLength={1000}
            rows={3}
          />
        </div>
      )}

      {track === 'buyer-roadmap' && (
        <div className="space-y-4 pt-2 border-t border-black/5">
          <Radio
            name="buyerTimeframe"
            label="Target purchase timeframe"
            options={[
              { value: '6m', label: '6 months' },
              { value: '6-12m', label: '6–12 months' },
              { value: '12-18m', label: '12–18 months' },
              { value: '18m+', label: '18+ months' },
            ]}
            required
          />
          <Radio
            name="preApprovalStatus"
            label="Pre-approval status"
            options={[
              { value: 'not_started', label: 'Not started' },
              { value: 'in_process', label: 'In process' },
              { value: 'approved', label: 'Approved' },
            ]}
            required
          />
          <Field
            id="buyer-neighborhoods"
            name="targetNeighborhoods"
            label="Target neighborhoods (comma-separated, or leave blank for 'open to suggestions')"
          />
          <Field
            id="buyer-price"
            name="targetPriceRange"
            label="Target price range"
            required
          />
          <Textarea
            id="buyer-complexity"
            name="buyerComplexity"
            label="Anything making this purchase complex?"
            maxLength={1000}
            rows={3}
          />
        </div>
      )}

      {track === 'sell-or-rent' && (
        <div className="space-y-4 pt-2 border-t border-black/5">
          <Field
            id="sor-address"
            name="propertyAddress"
            label="Property address"
            required
            autoComplete="street-address"
          />
          <Field
            id="sor-mortgage"
            name="sorMortgage"
            label="Approximate mortgage rate and balance ('around 5.5%' is fine)"
          />
          <Radio
            name="sorReason"
            label="Why considering rental conversion"
            options={[
              { value: 'job', label: 'Job change' },
              { value: 'upgrade', label: 'Upgrading' },
              { value: 'family', label: 'Family change' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />
          <Field
            id="sor-timeframe"
            name="sorTimeframe"
            label="Timeframe for the move"
            required
          />
        </div>
      )}

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

      <div className="flex gap-3 pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-househaven-navy hover:bg-househaven-surface"
          >
            ← Back
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light disabled:opacity-60"
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
      <div className="space-y-1.5">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={o.value}
              required={required}
              className="h-4 w-4 text-househaven-navy focus:ring-househaven-navy"
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
