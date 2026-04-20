'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface PropertyHeroMapProps {
  lng: number
  lat: number
  stageLabel?: string | null
}

export default function PropertyHeroMap({ lng, lat, stageLabel }: PropertyHeroMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          'carto-light': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap © CARTO',
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
            paint: { 'raster-saturation': -0.3, 'raster-brightness-min': 0.08 },
          },
        ],
      },
      center: [lng, lat],
      zoom: 16,
      interactive: false,
      attributionControl: false,
    })

    map.on('load', () => {
      map.addSource('lot', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: {},
        },
      })
      map.addLayer({
        id: 'lot-ring',
        type: 'circle',
        source: 'lot',
        paint: {
          'circle-radius': 18,
          'circle-color': 'transparent',
          'circle-stroke-color': '#000000',
          'circle-stroke-width': 2,
        },
      })
      map.addLayer({
        id: 'lot-dot',
        type: 'circle',
        source: 'lot',
        paint: {
          'circle-radius': 6,
          'circle-color': '#000000',
        },
      })
    })

    return () => {
      map.remove()
    }
  }, [lng, lat])

  return (
    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-househaven-surface">
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/95 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-black">
          Tracked by House Haven &middot; Not on MLS
        </span>
      </div>
      {stageLabel && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black text-white text-[10px] uppercase tracking-wider font-semibold">
          {stageLabel}
        </div>
      )}
    </div>
  )
}
