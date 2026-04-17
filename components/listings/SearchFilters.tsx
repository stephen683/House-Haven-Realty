'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const PROPERTY_TYPES = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family']

export default function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const next = new URLSearchParams()
    fd.forEach((v, k) => {
      const value = v.toString().trim()
      if (value) next.set(k, value)
    })
    router.push(`/homes-for-sale${next.toString() ? `?${next.toString()}` : ''}`)
    setTimeout(() => setSubmitting(false), 400)
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 p-6 rounded-xl border border-black/5 bg-white shadow-sm">
      <div className="md:col-span-2">
        <label htmlFor="filter-city" className="block text-xs font-medium text-househaven-text-muted mb-1">
          City
        </label>
        <input
          id="filter-city"
          name="city"
          type="text"
          defaultValue={params.get('city') ?? ''}
          placeholder="Nashville, Franklin, Brentwood…"
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>
      <div>
        <label htmlFor="filter-zip" className="block text-xs font-medium text-househaven-text-muted mb-1">
          ZIP
        </label>
        <input
          id="filter-zip"
          name="zip"
          type="text"
          inputMode="numeric"
          maxLength={5}
          defaultValue={params.get('zip') ?? ''}
          placeholder="37209"
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>
      <div>
        <label htmlFor="filter-min" className="block text-xs font-medium text-househaven-text-muted mb-1">
          Min price
        </label>
        <input
          id="filter-min"
          name="minPrice"
          type="number"
          inputMode="numeric"
          defaultValue={params.get('minPrice') ?? ''}
          placeholder="$"
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>
      <div>
        <label htmlFor="filter-max" className="block text-xs font-medium text-househaven-text-muted mb-1">
          Max price
        </label>
        <input
          id="filter-max"
          name="maxPrice"
          type="number"
          inputMode="numeric"
          defaultValue={params.get('maxPrice') ?? ''}
          placeholder="$"
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        />
      </div>
      <div>
        <label htmlFor="filter-beds" className="block text-xs font-medium text-househaven-text-muted mb-1">
          Beds
        </label>
        <select
          id="filter-beds"
          name="beds"
          defaultValue={params.get('beds') ?? ''}
          className="w-full rounded-lg border border-black/10 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      <div>
        <label htmlFor="filter-type" className="block text-xs font-medium text-househaven-text-muted mb-1">
          Property type
        </label>
        <select
          id="filter-type"
          name="propertyType"
          defaultValue={params.get('propertyType') ?? ''}
          className="w-full rounded-lg border border-black/10 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-househaven-navy/30"
        >
          <option value="">Any</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-5 flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
        >
          {submitting ? 'Searching…' : 'Search homes'}
        </button>
        {params.toString() && (
          <button
            type="button"
            onClick={() => router.push('/homes-for-sale')}
            className="text-sm font-medium text-househaven-text-muted hover:text-househaven-navy"
          >
            Clear filters
          </button>
        )}
      </div>
    </form>
  )
}
