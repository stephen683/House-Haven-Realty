'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PermitFeatureProperties } from './MapView'
import type { StageKey, StageView } from '@/lib/permit-stages'
import { STAGE_LADDER, expectedListingWindow } from '@/lib/permit-stages'
import StageTimeline from './StageTimeline'
import PropertyHeroMap from './PropertyHeroMap'
import BuilderCard from './BuilderCard'
import NotifySignup from './NotifySignup'
import CommissionDisclosure from '@/components/compliance/CommissionDisclosure'

interface PermitDetailPanelProps {
  permit: PermitFeatureProperties
  lngLat: [number, number]
  onClose: () => void
}

interface ParcelInfoView {
  apn: string
  acres: number | null
  zoning: string | null
  landUse: string | null
  address: string | null
}

interface StageApiResponse {
  permitNumber: string
  caseId: number | null
  currentStage: StageKey
  effectiveStage: StageKey
  stages: StageView[]
  override: {
    stage: StageKey
    note: string
    confidence: string | null
    at: string
    expiresAt: string | null
  } | null
  parcel: ParcelInfoView | null
  fetchedAt: string
  cacheAge: 'fresh' | 'stale_ok' | 'stale' | 'miss'
  degraded: boolean
}

const PLACEHOLDER_STAGES: StageView[] = STAGE_LADDER.map((def) => ({
  key: def.key,
  label: def.label,
  order: def.order,
  description: def.description,
  status: 'pending',
  completedAt: null,
  scheduledAt: null,
  tasks: [],
}))

// Neighborhood labels for the common Nashville ZIPs we cover. Used instead of
// bare numbers so the hero reads like a Compass listing, not a municipal record.
const ZIP_TO_NEIGHBORHOOD: Record<string, string> = {
  '37203': 'Midtown',
  '37204': '12 South · Melrose',
  '37205': 'Belle Meade · West Nashville',
  '37206': 'East Nashville',
  '37207': 'North Nashville',
  '37208': 'Germantown · North Nashville',
  '37209': 'The Nations · Sylvan Park',
  '37210': 'Nashville South',
  '37211': 'South Nashville',
  '37212': 'Hillsboro Village',
  '37215': 'Green Hills',
  '37216': 'Inglewood',
  '37218': 'Bordeaux',
  '37219': 'Downtown',
  '37220': 'Oak Hill',
  '37221': 'Bellevue',
  '37027': 'Brentwood',
  '37064': 'Franklin',
  '37067': 'Cool Springs',
  '37069': 'Franklin',
  '37122': 'Mt. Juliet',
  '37135': 'Nolensville',
  '37174': 'Spring Hill',
  '37076': 'Hermitage',
  '37086': 'La Vergne',
  '37087': 'Lebanon',
}

function streetBlock(address: string): string {
  const parts = address.trim().split(/\s+/)
  if (parts.length === 0) return 'Address withheld'
  const rest = parts.slice(1).join(' ')
  return rest || address
}

function neighborhoodLabel(zip: string): string {
  return ZIP_TO_NEIGHBORHOOD[zip] ?? `Nashville ${zip}`
}

function stageLabelShort(key: StageKey) {
  return STAGE_LADDER.find((s) => s.key === key)?.label ?? key
}

export default function PermitDetailPanel({
  permit,
  lngLat,
  onClose,
}: PermitDetailPanelProps) {
  const [stageData, setStageData] = useState<StageApiResponse | null>(null)
  const [stageLoading, setStageLoading] = useState(true)
  const [stageError, setStageError] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)

  useEffect(() => {
    let cancelled = false
    setStageLoading(true)
    setStageError(false)
    setStageData(null)
    fetch(`/api/pipeline/permit/${encodeURIComponent(permit.id)}/stage`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: StageApiResponse) => {
        if (!cancelled) {
          setStageData(data)
          setStageLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStageError(true)
          setStageLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [permit.id])

  const effectiveStage = stageData?.effectiveStage ?? 'permitted'
  const heroStageLabel = stageData ? stageLabelShort(effectiveStage) : null

  return (
    <div className="bg-white w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
          House Haven Pipeline
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-househaven-surface transition"
          aria-label="Close detail panel"
        >
          <svg
            className="h-5 w-5 text-househaven-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-5">
        <PropertyHeroMap
          lng={lngLat[0]}
          lat={lngLat[1]}
          stageLabel={heroStageLabel}
        />

        <div>
          <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
            {neighborhoodLabel(permit.zip)} &middot; {permit.zip}
          </p>
          <h3 className="mt-1 font-serif text-xl text-househaven-navy leading-tight">
            {streetBlock(permit.address)}
          </h3>
          <p className="mt-0.5 text-[11px] text-househaven-text-muted">
            House number withheld until the home is publicly listed.
          </p>
        </div>

        {(permit.propertyType && permit.propertyType !== 'unknown') || permit.unitCount > 1 ? (
          <div className="flex flex-wrap items-center gap-2">
            {permit.propertyType && permit.propertyType !== 'unknown' && (
              <span className="inline-block px-3 py-1 rounded-lg bg-househaven-navy/10 text-xs font-medium text-househaven-navy capitalize">
                {permit.propertyType.replace(/_/g, ' ')}
              </span>
            )}
            {permit.unitCount > 1 && (
              <span className="inline-block px-3 py-1 rounded-lg bg-black text-white text-xs font-medium">
                {permit.unitCount} units
              </span>
            )}
          </div>
        ) : null}

        {(permit.bedrooms || permit.bathrooms || permit.sqft || stageData?.parcel?.acres) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {permit.bedrooms && (
              <div className="rounded-lg bg-househaven-surface p-3">
                <p className="font-serif text-xl text-househaven-navy">
                  {permit.bedrooms}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                  Beds
                </p>
              </div>
            )}
            {permit.bathrooms && (
              <div className="rounded-lg bg-househaven-surface p-3">
                <p className="font-serif text-xl text-househaven-navy">
                  {permit.bathrooms}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                  Baths
                </p>
              </div>
            )}
            {permit.sqft && (
              <div className="rounded-lg bg-househaven-surface p-3">
                <p className="font-serif text-xl text-househaven-navy">
                  {permit.sqft.toLocaleString()}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                  Sq Ft
                </p>
              </div>
            )}
            {stageData?.parcel?.acres && (
              <div className="rounded-lg bg-househaven-surface p-3">
                <p className="font-serif text-xl text-househaven-navy">
                  {stageData.parcel.acres.toFixed(2)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                  Acre{stageData.parcel.acres === 1 ? '' : 's'}
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[10px] text-househaven-text-muted">
          Specs from Metro Nashville permit.
          {stageData?.parcel?.zoning ? ` Zoning: ${stageData.parcel.zoning}.` : ''}
        </p>

        {stageLoading && (
          <div className="rounded-lg bg-househaven-surface p-4 text-center">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
            <p className="mt-2 text-[11px] text-househaven-text-muted">
              Checking construction progress&hellip;
            </p>
          </div>
        )}
        {stageError && (
          <div className="rounded-lg bg-househaven-surface p-4">
            <p className="text-xs text-househaven-text">
              Construction stage temporarily unavailable.
            </p>
            <p className="mt-1 text-[11px] text-househaven-text-muted">
              Metro Nashville&rsquo;s inspection feed is slow right now &mdash; try again in a
              minute.
            </p>
          </div>
        )}
        {stageData && (
          <>
            <StageTimeline
              stages={
                stageData.stages && stageData.stages.length > 0
                  ? stageData.stages
                  : PLACEHOLDER_STAGES
              }
              currentStage={stageData.currentStage}
              effectiveStage={stageData.effectiveStage}
              override={stageData.override}
            />
            <div className="rounded-lg bg-househaven-surface p-3">
              <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
                Expected listing
              </p>
              <p className="mt-1 text-sm font-semibold text-househaven-navy">
                {expectedListingWindow(effectiveStage)}
              </p>
              <p className="mt-1 text-[11px] text-househaven-text-muted">
                Heuristic based on current stage. Not a guarantee &mdash; builders&rsquo; schedules
                shift.
              </p>
            </div>
          </>
        )}

        {permit.contractor && (
          <BuilderCard
            contractor={permit.contractor}
            excludePermitNumber={permit.id}
          />
        )}

        <section className="space-y-3">
          <div className="rounded-lg bg-white border border-black/10 p-4">
            <p className="font-serif text-base text-househaven-navy leading-snug">
              The builder&rsquo;s sales rep works for the builder. House Haven works for you.
            </p>
            <p className="mt-2 text-[12px] text-househaven-text leading-relaxed">
              When you walk into a new-construction sales office, the person you meet has a
              fiduciary duty to the builder. We have that duty to you &mdash; reviewing the
              contract, the upgrades list, warranty terms, and inspection rights before you
              sign.
            </p>
          </div>
          <NotifySignup
            permitNumber={permit.id}
            address={permit.address}
            zip={permit.zip}
          />
          <Link
            href="tel:+16156244766"
            className="block w-full text-center px-4 py-2.5 rounded-lg border border-black/15 text-sm font-medium text-househaven-navy hover:border-black/30 transition"
          >
            Call Stephen directly &middot; (615) 624-4766
          </Link>
        </section>

        <section className="rounded-lg border border-black/10">
          <button
            type="button"
            onClick={() => setShowChecklist((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
            aria-expanded={showChecklist}
          >
            <span className="text-sm font-semibold text-househaven-navy">
              New-build first-timer&rsquo;s checklist
            </span>
            <svg
              className={`h-4 w-4 text-househaven-text-muted transition-transform ${showChecklist ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showChecklist && (
            <div className="px-4 pb-4 space-y-4 text-[12px] text-househaven-text leading-relaxed">
              <div>
                <p className="font-semibold text-househaven-navy mb-1">
                  Warranty: 1 / 2 / 10
                </p>
                <p>
                  Builders in Tennessee typically warrant workmanship for one year, mechanical
                  systems for two, and major structural components for ten. Get the specific
                  schedule in writing before you sign.
                </p>
              </div>
              <div>
                <p className="font-semibold text-househaven-navy mb-1">
                  Base price vs. walked model
                </p>
                <p>
                  The model home you toured is usually the loaded version. Ask the builder to
                  itemize what&rsquo;s base and what&rsquo;s upgrade &mdash; then budget 8&ndash;15%
                  of base for the finishes you actually want.
                </p>
              </div>
              <div>
                <p className="font-semibold text-househaven-navy mb-1">
                  Independent inspection
                </p>
                <p>
                  You have the right to bring your own inspector before closing, even on new
                  construction. Some builders push back; we hold the line.
                </p>
              </div>
              <div>
                <p className="font-semibold text-househaven-navy mb-1">
                  Rate-lock windows
                </p>
                <p>
                  Standard 30&ndash;60-day locks don&rsquo;t cover 4&ndash;6 month build
                  timelines. Ask your lender about an extended lock or a builder forward
                  commitment before you sign.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="space-y-2">
          <CommissionDisclosure variant="card" />
          <p className="text-[10px] text-househaven-text-muted leading-relaxed">
            Source: Metro Nashville Codes and ePermits &mdash; public records. This is not
            a listing and no list price is displayed. Construction stage reflects permit and
            inspection activity; it is not a promise of delivery. House Haven Realty
            represents buyers; we are not the listing agent for this property.
          </p>
        </div>
      </div>
    </div>
  )
}
