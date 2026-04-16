'use client'

import { useMemo, useState } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { NormalizedPermit } from '@/lib/permits'

interface PermitMapProps {
  permits: NormalizedPermit[]
}

// MapLibre demo tiles — a free, keyless raster basemap suitable for a first pass.
// Swap to a paid Mapbox/MapTiler style when we want branded cartography.
const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'

const NASHVILLE = { longitude: -86.7816, latitude: 36.1627, zoom: 9.5 }

function daysAgo(iso: string | null) {
  if (!iso) return Infinity
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
}

function markerColor(dateIssued: string | null) {
  const d = daysAgo(dateIssued)
  if (d <= 30) return '#2E7D32' // green — recent
  if (d <= 90) return '#1a1a2e' // navy — 30-90 days
  return '#9ca3af' // gray — older
}

export default function PermitMap({ permits }: PermitMapProps) {
  const [active, setActive] = useState<NormalizedPermit | null>(null)

  const mapped = useMemo(
    () => permits.filter((p) => p.lat !== null && p.lng !== null),
    [permits],
  )

  return (
    <div className="relative w-full h-[560px] rounded-xl overflow-hidden border border-black/10">
      <Map
        initialViewState={NASHVILLE}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={true}
      >
        <NavigationControl position="top-right" />

        {mapped.map((p) => (
          <Marker
            key={p.permitNumber}
            longitude={p.lng!}
            latitude={p.lat!}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setActive(p)
            }}
          >
            <button
              type="button"
              aria-label={`Permit at ${p.address || 'unknown address'}`}
              className="block h-4 w-4 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: markerColor(p.dateIssued) }}
            />
          </Marker>
        ))}

        {active && active.lat !== null && active.lng !== null && (
          <Popup
            longitude={active.lng}
            latitude={active.lat}
            anchor="top"
            closeOnClick={false}
            onClose={() => setActive(null)}
            maxWidth="280px"
          >
            <div className="text-sm text-househaven-text">
              <p className="font-serif text-base text-househaven-navy leading-tight">
                {active.address || 'Address withheld'}
              </p>
              <p className="text-xs text-househaven-text-muted mt-0.5">
                {active.city || 'Nashville'} · {active.zip}
              </p>
              <p className="text-xs mt-2">{active.type}</p>
              {active.constructionCost ? (
                <p className="text-xs font-semibold text-househaven-navy mt-1">
                  ${Math.round(active.constructionCost).toLocaleString()}
                </p>
              ) : null}
              {active.contractor ? (
                <p className="text-[11px] text-househaven-text-muted mt-1">
                  {active.contractor}
                </p>
              ) : null}
              <p className="text-[11px] text-househaven-text-muted mt-1">
                {active.dateIssued
                  ? new Date(active.dateIssued).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </p>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend overlay */}
      <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow text-xs text-househaven-text space-y-1 pointer-events-none">
        <p className="font-semibold text-househaven-navy mb-1">Permits plotted</p>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#2E7D32] border-2 border-white" />
          Last 30 days
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#1a1a2e] border-2 border-white" />
          30–90 days
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#9ca3af] border-2 border-white" />
          Older
        </div>
      </div>
    </div>
  )
}
