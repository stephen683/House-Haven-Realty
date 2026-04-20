'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { StageKey, StageStatus, StageView } from '@/lib/permit-stages'
import { STAGE_IMAGE } from '@/lib/stage-images'

interface StageTimelineProps {
  stages: StageView[]
  currentStage: StageKey
  effectiveStage: StageKey
  override: {
    stage: StageKey
    note: string
    confidence: string | null
    at: string
  } | null
}

function statusClasses(status: StageStatus, isCurrent: boolean) {
  if (status === 'completed') return 'bg-black text-white border-black'
  if (status === 'blocked') return 'bg-white text-red-700 border-red-600'
  if (status === 'in_progress' || isCurrent)
    return 'bg-white text-black border-black ring-2 ring-black/10'
  return 'bg-white text-househaven-text-muted border-black/15'
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function friendlyConfidence(c: string | null): string {
  switch (c) {
    case 'drove_by':
      return 'Drove by'
    case 'photo':
      return 'Photographed'
    case 'builder_confirmed':
      return 'Confirmed with builder'
    default:
      return 'Verified'
  }
}

export default function StageTimeline({
  stages,
  currentStage,
  effectiveStage,
  override,
}: StageTimelineProps) {
  const [expanded, setExpanded] = useState<StageKey | null>(null)

  return (
    <section>
      {override && (
        <div className="mb-3 rounded-lg border border-black/10 bg-househaven-surface p-3">
          <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
            House Haven verified
          </p>
          <p className="mt-1 font-serif text-sm text-househaven-navy">
            {override.note || 'Verified by House Haven'}
          </p>
          <p className="mt-0.5 text-[11px] text-househaven-text-muted">
            {friendlyConfidence(override.confidence)} &middot; {formatDate(override.at)}
          </p>
        </div>
      )}

      <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
        Construction progress
      </p>

      <ol className="mt-2 space-y-1">
        {stages.map((s) => {
          const isCurrent = s.key === effectiveStage || s.key === currentStage
          const classes = statusClasses(s.status, isCurrent)
          const isOpen = expanded === s.key
          const dateLine =
            s.status === 'completed' && s.completedAt
              ? `Completed ${formatDate(s.completedAt)}`
              : s.status === 'in_progress' && s.scheduledAt
                ? `Next inspection ${formatDate(s.scheduledAt)}`
                : s.status === 'blocked'
                  ? `Needs attention`
                  : null

          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : s.key)}
                className="w-full text-left flex items-center gap-3 py-1.5"
                aria-expanded={isOpen}
              >
                <span
                  className={`shrink-0 h-6 w-6 rounded-lg border flex items-center justify-center text-[11px] font-semibold ${classes}`}
                  aria-hidden="true"
                >
                  {s.order}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-househaven-navy">
                    {s.label}
                  </span>
                  {dateLine && (
                    <span className="block text-[11px] text-househaven-text-muted">
                      {dateLine}
                    </span>
                  )}
                </span>
                <svg
                  className={`h-4 w-4 text-househaven-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="ml-9 mb-2 rounded-lg bg-househaven-surface overflow-hidden">
                  <div className="relative w-full aspect-[2/1] bg-white border-b border-black/5">
                    <Image
                      src={STAGE_IMAGE[s.key]}
                      alt={`${s.label} illustration`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3 space-y-1.5">
                  <p className="text-[11px] text-househaven-text-muted leading-relaxed">
                    {s.description}
                  </p>
                  {s.tasks.length === 0 ? (
                    <p className="text-[11px] text-househaven-text-muted italic">
                      No inspections logged for this stage yet.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      {s.tasks.map((t, i) => (
                        <li key={`${t.code}-${i}`} className="text-[11px] text-househaven-text">
                          <span className="font-medium">{t.description}</span>
                          {t.result && (
                            <span className="ml-1 text-househaven-text-muted">
                              &middot; {t.result}
                            </span>
                          )}
                          {t.scheduledDate && (
                            <span className="ml-1 text-househaven-text-muted">
                              &middot; {formatDate(t.scheduledDate)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
