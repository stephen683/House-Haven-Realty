'use client'

import { useEffect, useRef, useState } from 'react'
import {
  EMPTY_FILTERS,
  PROPERTY_TYPE_OPTIONS,
  activeFilterCount,
  toggleInList,
  type FilterState,
} from '@/lib/pipeline-filters'
import { PIPELINE_ZIPS, ZIP_META_MAP } from '@/lib/pipeline-zips'
import type { RecordedRates } from '@/lib/permit-search'

export type { FilterState }

const DATE_OPTIONS = [
  { value: 'all', label: 'Any time' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
] as const

const BED_STEPS = ['', '1', '2', '3', '4', '5'] as const
const BATH_STEPS = ['', '1', '1.5', '2', '2.5', '3', '4'] as const

interface MapFiltersProps {
  /** Controlled by PipelineApp so the map and the results list share one state. */
  filters: FilterState
  onChange: (next: FilterState) => void
  availableZips: string[]
  /** How many permits actually carry beds/baths/sqft — shown next to those controls. */
  recorded?: RecordedRates | null
}

function pct(part: number, whole: number) {
  if (!whole) return null
  return Math.round((100 * part) / whole)
}

export default function MapFilters({ filters, onChange, availableZips, recorded }: MapFiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })
  const activeCount = activeFilterCount(filters)

  useEffect(() => {
    if (!expanded) return
    function onDocClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setExpanded(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [expanded])

  // Known neighborhoods plus whatever the data adds. Never a blank grid, even
  // before the first page load resolves.
  const zipList = Array.from(new Set([...PIPELINE_ZIPS.map((z) => z.zip), ...availableZips])).sort()

  const bedsPct = recorded ? pct(recorded.bedrooms, recorded.total) : null
  const bathsPct = recorded ? pct(recorded.bathrooms, recorded.total) : null
  const sqftPct = recorded ? pct(recorded.sqft, recorded.total) : null

  const chip = (active: boolean) =>
    `px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
      active
        ? 'bg-black text-white border-black'
        : 'bg-white text-househaven-text border-black/10 hover:border-black/40'
    }`

  const numberInput =
    'w-full px-2.5 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:border-black transition'

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="pipeline-filter-panel"
        data-testid="filters-toggle"
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-black/10 bg-white text-sm font-medium text-househaven-text hover:border-black transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-md bg-black text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {expanded && (
        <div
          id="pipeline-filter-panel"
          role="dialog"
          aria-label="Filter permits"
          data-testid="filters-panel"
          className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl border-t-2 border-black/10 p-4
                     lg:absolute lg:inset-x-auto lg:bottom-auto lg:top-full lg:left-0 lg:mt-2 lg:w-[640px] lg:max-h-[calc(100vh-240px)] lg:rounded-xl lg:border-2 lg:p-5"
        >
          <div className="sticky -top-4 lg:static -mx-4 lg:mx-0 px-4 lg:px-0 py-3 lg:py-0 bg-white border-b lg:border-b-0 border-black/5 flex items-center justify-between z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-househaven-navy">
              Filter permits
            </p>
            <div className="flex items-center gap-3">
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => onChange({ ...EMPTY_FILTERS })}
                  className="text-xs font-medium text-househaven-text-muted hover:text-black underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="lg:hidden text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white"
              >
                Done
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-5 lg:mt-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:space-y-0">
          <div className="space-y-5">
          {/* Property type */}
          <fieldset>
            <legend className="text-xs font-semibold text-househaven-text mb-2">Property type</legend>
            <div className="flex flex-wrap gap-1.5" data-testid="filter-property-types">
              {PROPERTY_TYPE_OPTIONS.map((opt) => {
                const on = filters.propertyTypes.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ propertyTypes: toggleInList(filters.propertyTypes, opt.value) })}
                    className={chip(on)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Beds / baths */}
          <div className="grid grid-cols-2 gap-4">
            <fieldset>
              <legend className="text-xs font-semibold text-househaven-text mb-2">Beds</legend>
              <div className="flex flex-wrap gap-1" data-testid="filter-beds">
                {BED_STEPS.map((v) => (
                  <button
                    key={v || 'any'}
                    type="button"
                    aria-pressed={filters.beds === v}
                    onClick={() => set({ beds: v })}
                    className={chip(filters.beds === v)}
                  >
                    {v ? `${v}+` : 'Any'}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-xs font-semibold text-househaven-text mb-2">Baths</legend>
              <div className="flex flex-wrap gap-1" data-testid="filter-baths">
                {BATH_STEPS.map((v) => (
                  <button
                    key={v || 'any'}
                    type="button"
                    aria-pressed={filters.baths === v}
                    onClick={() => set({ baths: v })}
                    className={chip(filters.baths === v)}
                  >
                    {v ? `${v}+` : 'Any'}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          {recorded && bedsPct !== null && (
            <p className="text-[11px] leading-snug text-househaven-text-muted -mt-2" data-testid="recorded-note">
              Metro records beds on {bedsPct}% and baths on {bathsPct}% of permits — mostly new single-family
              and townhomes. Condo and duplex permits almost never list them. A beds or baths filter only
              matches permits that do.
            </p>
          )}

          {/* Square feet */}
          <fieldset>
            <legend className="text-xs font-semibold text-househaven-text mb-2">
              Square feet
              {sqftPct !== null && (
                <span className="ml-1.5 font-normal text-househaven-text-muted">recorded on {sqftPct}%</span>
              )}
            </legend>
            <div className="flex gap-2">
              <input type="number" inputMode="numeric" placeholder="Min" aria-label="Minimum square feet"
                value={filters.sqftMin} onChange={(e) => set({ sqftMin: e.target.value })} className={numberInput} />
              <input type="number" inputMode="numeric" placeholder="Max" aria-label="Maximum square feet"
                value={filters.sqftMax} onChange={(e) => set({ sqftMax: e.target.value })} className={numberInput} />
            </div>
          </fieldset>

          {/* Construction cost */}
          <fieldset>
            <legend className="text-xs font-semibold text-househaven-text mb-2">Construction cost</legend>
            <div className="flex gap-2">
              <input type="number" inputMode="numeric" placeholder="Min $" aria-label="Minimum construction cost"
                value={filters.costMin} onChange={(e) => set({ costMin: e.target.value })} className={numberInput} />
              <input type="number" inputMode="numeric" placeholder="Max $" aria-label="Maximum construction cost"
                value={filters.costMax} onChange={(e) => set({ costMax: e.target.value })} className={numberInput} />
            </div>
          </fieldset>

          </div>
          <div className="space-y-5">
          {/* Date issued */}
          <fieldset>
            <legend className="text-xs font-semibold text-househaven-text mb-2">Permit issued within</legend>
            <div className="flex flex-wrap gap-1.5">
              {DATE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" aria-pressed={filters.dateRange === opt.value}
                  onClick={() => set({ dateRange: opt.value })} className={chip(filters.dateRange === opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          {/* ZIPs */}
          <fieldset>
            <legend className="text-xs font-semibold text-househaven-text mb-2">
              ZIP code
              {filters.zips.length > 0 && (
                <span className="ml-1.5 font-normal text-househaven-text-muted">{filters.zips.length} selected</span>
              )}
            </legend>
            <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1" data-testid="filter-zips">
              {zipList.map((z) => {
                const on = filters.zips.includes(z)
                const name = ZIP_META_MAP[z]?.name
                return (
                  <button key={z} type="button" aria-pressed={on}
                    onClick={() => set({ zips: toggleInList(filters.zips, z) })}
                    className={`${chip(on)} text-left leading-tight`}>
                    <span className="block">{z}</span>
                    {name && (
                      <span className={`block text-[9px] truncate ${on ? 'text-white/60' : 'text-househaven-text-muted'}`}>
                        {name}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </fieldset>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}
