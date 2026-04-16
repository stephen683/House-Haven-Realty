'use client'

import Link from 'next/link'
import type { PermitFeatureProperties } from './MapView'

interface PermitDetailPanelProps {
  permit: PermitFeatureProperties
  onClose: () => void
}

function formatCost(cost: number | null) {
  if (!cost) return null
  return `$${Math.round(cost).toLocaleString()}`
}

function formatDate(iso: string | null) {
  if (!iso) return 'Date unknown'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function recencyLabel(days: number) {
  if (days <= 7) return 'This week'
  if (days <= 30) return 'This month'
  if (days <= 90) return 'Last 90 days'
  return 'Older'
}

function recencyColor(days: number) {
  if (days <= 7) return 'bg-emerald-500'
  if (days <= 30) return 'bg-blue-500'
  if (days <= 90) return 'bg-househaven-navy'
  return 'bg-gray-400'
}

export default function PermitDetailPanel({ permit, onClose }: PermitDetailPanelProps) {
  return (
    <div className="bg-white border-l border-black/5 w-full h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-black/5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${recencyColor(permit.daysAgo)}`}
          />
          <span className="text-[11px] text-househaven-text-muted">
            {recencyLabel(permit.daysAgo)}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-househaven-surface transition"
          aria-label="Close detail panel"
        >
          <svg className="h-5 w-5 text-househaven-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-serif text-xl text-househaven-navy leading-tight">
            {permit.address || 'Address withheld'}
          </h3>
          <p className="text-xs text-househaven-text-muted mt-0.5">
            {permit.city} &middot; {permit.zip}
          </p>
        </div>

        {/* Key details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-househaven-surface p-3">
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
              Issued
            </p>
            <p className="text-sm font-semibold text-househaven-navy mt-0.5">
              {formatDate(permit.dateIssued)}
            </p>
          </div>
          <div className="rounded-xl bg-househaven-surface p-3">
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
              Est. cost
            </p>
            <p className="text-sm font-semibold text-househaven-navy mt-0.5">
              {formatCost(permit.constructionCost) || '—'}
            </p>
          </div>
        </div>

        {/* Permit info */}
        <div className="space-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
              Permit type
            </p>
            <p className="text-sm text-househaven-text mt-0.5">{permit.type}</p>
          </div>
          {permit.description && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                Description
              </p>
              <p className="text-sm text-househaven-text mt-0.5">
                {permit.description}
              </p>
            </div>
          )}
          {permit.contractor && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                Contractor
              </p>
              <p className="text-sm text-househaven-text mt-0.5">
                {permit.contractor}
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
              Permit #
            </p>
            <p className="text-sm text-househaven-text mt-0.5 font-mono">
              {permit.id}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 border-t border-black/5 space-y-2">
          <Link
            href={`/contact?subject=New+Construction+at+${encodeURIComponent(permit.address)}`}
            className="block w-full text-center px-4 py-2.5 rounded-xl bg-househaven-navy text-white text-sm font-semibold hover:bg-househaven-navy-light transition"
          >
            Ask about this property
          </Link>
          <p className="text-[10px] text-center text-househaven-text-muted">
            We&rsquo;ll connect you with the builder or schedule a drive-by tour.
          </p>
        </div>
      </div>
    </div>
  )
}
