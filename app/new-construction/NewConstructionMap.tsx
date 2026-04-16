'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import type { FilterSpecification } from 'maplibre-gl'
import MapSearch from '@/components/permits/MapSearch'
import MapFilters from '@/components/permits/MapFilters'
import PermitDetailPanel from '@/components/permits/PermitDetailPanel'
import type { PermitFeatureProperties } from '@/components/permits/MapView'

// Dynamic import — MapLibre requires browser (WebGL)
const MapView = dynamic(
  () => import('@/components/permits/MapView'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-househaven-surface animate-pulse flex items-center justify-center">
        <p className="text-sm text-househaven-text-muted">Loading map&hellip;</p>
      </div>
    ),
  },
)

interface NewConstructionMapProps {
  permitCount: number
  avgCost: number
  topZips: [string, number][]
  availableZips: string[]
}

export default function NewConstructionMap({
  permitCount,
  avgCost,
  topZips,
  availableZips,
}: NewConstructionMapProps) {
  const [selectedPermit, setSelectedPermit] = useState<{
    properties: PermitFeatureProperties
    lngLat: [number, number]
  } | null>(null)
  const [filterExpression, setFilterExpression] =
    useState<FilterSpecification | null>(null)

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
      // MapView handles flyTo internally via the search, but we need to
      // trigger a flyTo on the map. For now we'll use a custom event approach.
      // The map will pick up the search via a dispatched event.
      window.dispatchEvent(
        new CustomEvent('map-fly-to', {
          detail: { lng: _coords.lng, lat: _coords.lat, zoom: 14 },
        }),
      )
    },
    [],
  )

  return (
    <main className="flex flex-col h-[100dvh]">
      {/* Compact header */}
      <header className="bg-househaven-navy text-white shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
          <Link href="/" className="shrink-0 hidden lg:block">
            <Image
              src="/images/logo/logo-light.png"
              alt="House Haven Realty"
              width={160}
              height={44}
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl lg:text-3xl text-white leading-tight">
              New Construction &middot; Nashville Metro
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Live residential building permits from Metro Nashville Open Data
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-full bg-white/10">
              <span className="text-white/60">Permits:</span>{' '}
              <span className="font-semibold">{permitCount.toLocaleString()}</span>
            </div>
            {avgCost > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-white/10">
                <span className="text-white/60">Avg cost:</span>{' '}
                <span className="font-semibold">
                  ${Math.round(avgCost).toLocaleString()}
                </span>
              </div>
            )}
            {topZips.slice(0, 3).map(([zip, count]) => (
              <div
                key={zip}
                className="px-3 py-1.5 rounded-full bg-white/10 hidden md:block"
              >
                <span className="text-white/60">{zip}:</span>{' '}
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Toolbar — search + filters */}
      <div className="bg-white border-b border-black/5 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center gap-3">
          <MapSearch onSelect={handleSearchSelect} />
          <MapFilters
            onChange={handleFilterChange}
            availableZips={availableZips}
          />
          <div className="flex-1" />
          <p className="text-[10px] text-househaven-text-muted hidden lg:block">
            Updated every 6 hours &middot; Source: data.nashville.gov
          </p>
        </div>
      </div>

      {/* Map + detail panel */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Map canvas */}
        <div
          className={`flex-1 min-w-0 relative ${
            selectedPermit ? 'hidden md:block' : ''
          }`}
        >
          <MapView
            onPermitSelect={handlePermitSelect}
            filterExpression={filterExpression}
          />

          {/* Legend overlay */}
          <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow text-xs text-househaven-text space-y-1.5 pointer-events-none">
            <p className="font-semibold text-househaven-navy mb-1">Permit age</p>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              Last 7 days
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              8–30 days
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-househaven-navy" />
              31–90 days
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-400" />
              Older
            </div>
          </div>
        </div>

        {/* Detail panel — slides in from right on desktop, replaces map on mobile */}
        {selectedPermit && (
          <div className="w-full md:w-[360px] lg:w-[400px] shrink-0 border-l border-black/5 bg-white overflow-hidden">
            <PermitDetailPanel
              permit={selectedPermit.properties}
              onClose={() => setSelectedPermit(null)}
            />
          </div>
        )}
      </div>

      {/* Compliance footer bar */}
      <div className="bg-househaven-surface border-t border-black/5 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4 text-[10px] text-househaven-text-muted">
          <p>
            House Haven Realty &middot; (615) 624-4766 &middot; Data deemed reliable
            but not guaranteed.
          </p>
          <Link
            href="/contact"
            className="shrink-0 px-3 py-1.5 rounded-full bg-househaven-navy text-white text-[10px] font-semibold hover:bg-househaven-navy-light transition"
          >
            Set up permit alerts
          </Link>
        </div>
      </div>
    </main>
  )
}
