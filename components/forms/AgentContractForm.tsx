'use client'

import { useState } from 'react'

const sides = [
  { value: 'listing', label: 'Listing side' },
  { value: 'buyer', label: 'Buyer side' },
  { value: 'dual', label: 'Dual agency' },
]

const commissionTypes = [
  { value: 'percent', label: '% of price' },
  { value: 'flat', label: 'Flat $' },
]

const inputClass =
  'w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy'
const labelClass = 'block text-sm font-medium text-househaven-text mb-1'

export default function AgentContractForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const payload = Object.fromEntries(data.entries())
    try {
      const res = await fetch('/api/agents/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || 'Submission failed.')
        setStatus('error')
        return
      }
      setStatus('ok')
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Submitting agent</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="agent_name" className={labelClass}>Your name</label>
            <input id="agent_name" name="agent_name" required autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label htmlFor="agent_email" className={labelClass}>Your email</label>
            <input id="agent_email" name="agent_email" type="email" required autoComplete="email" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Property &amp; parties</h2>
        <div>
          <label htmlFor="property_address" className={labelClass}>Property address</label>
          <input id="property_address" name="property_address" required className={inputClass} />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="mls_id" className={labelClass}>MLS # (optional)</label>
            <input id="mls_id" name="mls_id" className={inputClass} />
          </div>
          <div>
            <label htmlFor="side" className={labelClass}>Representing</label>
            <select id="side" name="side" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select side…</option>
              {sides.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="buyer_names" className={labelClass}>Buyer name(s)</label>
            <input id="buyer_names" name="buyer_names" className={inputClass} />
          </div>
          <div>
            <label htmlFor="seller_names" className={labelClass}>Seller name(s)</label>
            <input id="seller_names" name="seller_names" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Financials</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contract_price" className={labelClass}>Contract price ($)</label>
            <input id="contract_price" name="contract_price" type="number" min="0" step="1" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="earnest_money" className={labelClass}>Earnest money ($)</label>
            <input id="earnest_money" name="earnest_money" type="number" min="0" step="1" className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="commission_type" className={labelClass}>Commission type</label>
            <select id="commission_type" name="commission_type" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select…</option>
              {commissionTypes.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="commission_value" className={labelClass}>Commission value</label>
            <input id="commission_value" name="commission_value" type="number" min="0" step="0.01" required className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="our_split" className={labelClass}>Brokerage split / agent split (free-form)</label>
          <input id="our_split" name="our_split" placeholder="e.g. 80/20 or $X to House Haven" className={inputClass} />
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Dates &amp; deadlines</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="binding_date" className={labelClass}>Binding agreement date</label>
            <input id="binding_date" name="binding_date" type="date" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="close_date" className={labelClass}>Close date</label>
            <input id="close_date" name="close_date" type="date" required className={inputClass} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="inspection_deadline" className={labelClass}>Inspection deadline</label>
            <input id="inspection_deadline" name="inspection_deadline" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="financing_deadline" className={labelClass}>Financing deadline</label>
            <input id="financing_deadline" name="financing_deadline" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="appraisal_deadline" className={labelClass}>Appraisal deadline</label>
            <input id="appraisal_deadline" name="appraisal_deadline" type="date" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Vendors</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="title_company" className={labelClass}>Title company</label>
            <input id="title_company" name="title_company" className={inputClass} />
          </div>
          <div>
            <label htmlFor="lender" className={labelClass}>Lender</label>
            <input id="lender" name="lender" className={inputClass} />
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-househaven-text">Notes</h2>
        <div>
          <label htmlFor="notes" className={labelClass}>Special terms, contingencies, anything else</label>
          <textarea id="notes" name="notes" rows={5} className={inputClass} />
        </div>
      </section>

      <div className="pt-4 border-t border-black/10">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit contract'}
        </button>
        {status === 'ok' && (
          <p className="mt-4 text-sm text-househaven-success">
            Submitted. Stephen and Maria have been notified.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-sm text-red-600">{error ?? 'Submission failed.'}</p>
        )}
      </div>
    </form>
  )
}
