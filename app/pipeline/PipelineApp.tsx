'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import type { FilterSpecification } from 'maplibre-gl'
import MapSearch from '@/components/pipeline/MapSearch'
import MapFilters from '@/components/pipeline/MapFilters'
import AlertSignup from '@/components/pipeline/AlertSignup'
import PermitDetailPanel from '@/components/pipeline/PermitDetailPanel'
import type { PermitFeatureProperties } from '@/components/pipeline/MapView'
import type { ZipSaturationScore } from '@/lib/saturation-score'

const MapView = dynamic(
  () => import('@/components/pipeline/MapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-househaven-surface flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
          <p className="mt-3 text-xs text-househaven-text-muted">Loading Pipeline map&hellip;</p>
        </div>
      </div>
    ),
  },
)

interface PipelineAppProps {
  permitCount: number
  avgCost: number
  avgSqft: number
  availableZips: string[]
  topBuilders: [string, number][]
  topScores: ZipSaturationScore[]
  allScores: ZipSaturationScore[]
}

function scoreColor(score: number) {
  if (score >= 80) return 'bg-red-500'
  if (score >= 60) return 'bg-orange-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-blue-400'
  return 'bg-gray-400'
}

function scoreHex(score: number): string {
  if (score >= 80) return '#EF4444' // red-500
  if (score >= 60) return '#F97316' // orange-500
  if (score >= 40) return '#EAB308' // yellow-500
  if (score >= 20) return '#60A5FA' // blue-400
  return '#9CA3AF' // gray-400
}

export default function PipelineApp({
  permitCount,
  avgCost,
  avgSqft,
  availableZips,
  topBuilders: _topBuilders,
  topScores,
  allScores,
}: PipelineAppProps) {
  const [selectedPermit, setSelectedPermit] = useState<{
    properties: PermitFeatureProperties
    lngLat: [number, number]
  } | null>(null)
  const [filterExpression, setFilterExpression] =
    useState<FilterSpecification | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showHotZips, setShowHotZips] = useState(false)

  const zipColorMap = useMemo(() => {
    const m: Record<string, string> = {}
    for (const s of allScores) m[s.zip] = scoreHex(s.score)
    return m
  }, [allScores])

  const handlePermitSelect = useCallback(
    (properties: PermitFeatureProperties, lngLat: [number, number]) => {
      setSelectedPermit({ properties, lngLat })
    },
    [],
  )

  const handleFilterChange = useCallback(
    (filter: FilterSpecification | null) => {
      setFilterExpression(filter)
    },
    [],
  )

  const handleSearchSelect = useCallback(
    (_address: string, _coords: { lng: number; lat: number }) => {
      window.dispatchEvent(
        new CustomEvent('map-fly-to', {
          detail: { lng: _coords.lng, lat: _coords.lat, zoom: 14 },
        }),
      )
    },
    [],
  )

  return (
    <div className="flex flex-col h-[100dvh]">
      <header className="bg-black text-white shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center gap-4">
          <Link href="/" className="shrink-0" aria-label="House Haven Realty home">
            <Image
              src="/images/logo/logo-light.png"
              alt="House Haven Realty"
              width={120}
              height={34}
              className="h-6 w-auto opacity-70 hover:opacity-100 transition"
            />
          </Link>
          <div className="h-5 w-px bg-white/20" />
          <Link href="/pipeline" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight">
              Nashville Pipeline
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-white/50 mt-0.5">
              See what is being built before it is built
            </span>
          </Link>
          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="px-3 py-1 rounded-lg bg-white/10">
              <span className="text-white/50">Permits:</span>{' '}
              <span className="font-bold">{permitCount.toLocaleString()}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-white/10">
              <span className="text-white/50">Avg cost:</span>{' '}
              <span className="font-bold">${Math.round(avgCost).toLocaleString()}</span>
            </div>
            {avgSqft > 0 && (
              <div className="px-3 py-1 rounded-lg bg-white/10">
                <span className="text-white/50">Avg sqft:</span>{' '}
                <span className="font-bold">{avgSqft.toLocaleString()}</span>
              </div>
            )}
          </div>

          <Link
            href="/pipeline/builders"
            className="hidden lg:inline-flex text-xs text-white/70 hover:text-white transition"
          >
            Builders
          </Link>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="text-xs text-white/70 hover:text-white transition"
            aria-label="How to use this map"
          >
            How to use
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-black/5 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5 flex items-center gap-3">
          <MapSearch onSelect={handleSearchSelect} />
          <MapFilters
            onChange={handleFilterChange}
            availableZips={availableZips}
          />

          <div className="hidden lg:flex items-center gap-2 ml-4">
            <span className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
              Hot ZIPs:
            </span>
            {topScores.slice(0, 3).map((s) => (
              <span
                key={s.zip}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-househaven-surface text-xs"
              >
                <span className={`h-2 w-2 rounded-sm ${scoreColor(s.score)}`} />
                <span className="font-medium text-househaven-navy">{s.zip}</span>
                <span className="text-househaven-text-muted">{s.score}</span>
              </span>
            ))}
          </div>

          <div className="flex-1" />
          <div className="relative">
            <AlertSignup availableZips={availableZips} />
          </div>
          <p className="text-[10px] text-househaven-text-muted hidden lg:block">
            Live data &middot; Metro Nashville Codes
          </p>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 relative">
        <div className="flex-1 min-w-0 relative">
          <MapView
            onPermitSelect={handlePermitSelect}
            filterExpression={filterExpression}
            zipColorMap={zipColorMap}
          />

          {permitCount === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg px-6 py-5 max-w-sm text-center pointer-events-auto">
                <p className="font-serif text-lg text-househaven-navy">
                  No permits match those filters.
                </p>
                <p className="text-xs text-househaven-text-muted mt-2">
                  Try widening the date range or clearing a filter.
                </p>
                <button
                  type="button"
                  onClick={() => setFilterExpression(null)}
                  className="mt-4 inline-flex px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-househaven-navy-light transition"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4 pointer-events-auto flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => setShowHotZips((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 backdrop-blur shadow text-xs font-semibold text-househaven-navy hover:bg-white transition"
              aria-expanded={showHotZips}
              aria-controls="hot-zips-panel"
            >
              <span className="inline-flex gap-1" aria-hidden="true">
                <span className="h-2 w-2 rounded-sm bg-red-500" />
                <span className="h-2 w-2 rounded-sm bg-orange-500" />
                <span className="h-2 w-2 rounded-sm bg-yellow-500" />
                <span className="h-2 w-2 rounded-sm bg-blue-400" />
                <span className="h-2 w-2 rounded-sm bg-gray-400" />
              </span>
              {showHotZips ? 'Hide' : 'Show'} Hot ZIPs
              {filterExpression && (
                <span className="ml-1 inline-flex h-4 px-1.5 rounded bg-black text-white text-[9px] items-center">
                  filtered
                </span>
              )}
            </button>

            {showHotZips && (
              <div
                id="hot-zips-panel"
                className="bg-white/95 backdrop-blur rounded-lg shadow w-64"
              >
                <div className="px-3 py-2 border-b border-black/5 flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-househaven-navy">
                    Build Saturation Score
                  </p>
                  <p className="text-[9px] text-househaven-text-muted">
                    {allScores.length} ZIPs
                  </p>
                </div>
                <div className="px-3 py-2 space-y-1 max-h-72 overflow-y-auto">
                  {topScores.map((s) => (
                    <button
                      key={s.zip}
                      type="button"
                      onClick={() => {
                        setFilterExpression(['==', ['get', 'zip'], s.zip] as FilterSpecification)
                      }}
                      className="w-full flex items-center justify-between text-xs px-1.5 py-1 rounded hover:bg-househaven-surface transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-sm ${scoreColor(s.score)}`} />
                        <span className="font-medium">{s.zip}</span>
                        <span className="text-[10px] text-househaven-text-muted">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-househaven-text-muted">{s.permitCount}</span>
                        <span className="font-bold text-househaven-navy w-7 text-right">{s.score}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 border-t border-black/5 flex items-center justify-between">
                  <p className="text-[9px] text-househaven-text-muted">
                    Pin color = ZIP score
                  </p>
                  {filterExpression && (
                    <button
                      type="button"
                      onClick={() => setFilterExpression(null)}
                      className="text-[9px] font-medium text-househaven-navy hover:underline"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedPermit && (
          <>
            <div className="hidden md:block w-[380px] lg:w-[420px] shrink-0 border-l border-black/5 bg-white overflow-hidden">
              <PermitDetailPanel
                permit={selectedPermit.properties}
                lngLat={selectedPermit.lngLat}
                onClose={() => setSelectedPermit(null)}
              />
            </div>

            <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
              <button
                type="button"
                className="fixed inset-0 bg-black/30"
                onClick={() => setSelectedPermit(null)}
                aria-label="Close detail panel"
              />
              <div className="relative bg-white rounded-t-xl shadow-2xl max-h-[70vh] overflow-y-auto animate-slide-up">
                <div className="sticky top-0 bg-white px-4 pt-3 pb-2 border-b border-black/5 flex items-center justify-between">
                  <div className="w-10 h-1 rounded-full bg-black/10 mx-auto" />
                </div>
                <PermitDetailPanel
                  permit={selectedPermit.properties}
                  lngLat={selectedPermit.lngLat}
                  onClose={() => setSelectedPermit(null)}
                />
              </div>
            </div>
          </>
        )}

        {showHelp && (
          <div
            className="fixed inset-0 z-[60] bg-black/40 flex items-end md:items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h2 id="help-title" className="font-serif text-2xl text-househaven-navy">
                  How to use Nashville Pipeline
                </h2>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="text-househaven-text-muted hover:text-househaven-navy"
                  aria-label="Close help"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-househaven-text leading-relaxed">
                Every dot is a residential building permit issued by Metro Nashville Codes — a real
                home being built right now. Color shows how recently the permit was issued. Click
                any dot for the address, builder, construction cost, beds, baths, and square
                footage.
              </p>
              <p className="text-sm text-househaven-text leading-relaxed">
                Filter by date, cost, ZIP, beds, or property type. Click a ZIP in the Saturation
                panel to focus the map. Set up email alerts for any ZIP and we will send you new
                permits the day they are issued.
              </p>
              <div className="pt-2 border-t border-black/5">
                <p className="text-xs text-househaven-text-muted">
                  Data refreshes every 6 hours. Source: Metro Nashville Open Data. Maintained by
                  House Haven Realty.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-black text-white shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 text-[10px]">
          <div className="flex items-center gap-4">
            <span className="text-white/50">
              House Haven Realty &middot; (615) 624-4766
            </span>
            <span className="text-white/30">
              Data: Metro Nashville Codes &middot; Updated every 6h
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pipeline/builders" className="text-white/50 hover:text-white transition">
              Builders
            </Link>
            <Link href="/contact" className="px-3 py-1 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition">
              Get alerts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
