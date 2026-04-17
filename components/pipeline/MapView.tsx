'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export interface PermitFeatureProperties {
  id: string
  address: string
  city: string
  zip: string
  type: string
  subtype: string
  description: string
  constructionCost: number | null
  contractor: string
  status: string
  dateIssued: string | null
  daysAgo: number
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  propertyType: string
  parcel: string
  subdivision: string
}

interface MapViewProps {
  onPermitSelect: (properties: PermitFeatureProperties, lngLat: [number, number]) => void
  filterExpression: maplibregl.FilterSpecification | null
}

const NASHVILLE: [number, number] = [-86.7816, 36.1627]

// Recency color stops
const RECENCY_COLORS: [number, string][] = [
  [0, '#10B981'],   // green — last 7 days
  [7, '#10B981'],
  [8, '#3B82F6'],   // blue — 8-30 days
  [30, '#3B82F6'],
  [31, '#1a1a2e'],  // navy — 31-90 days
  [90, '#1a1a2e'],
  [91, '#9CA3AF'],  // gray — older
]

export default function MapView({ onPermitSelect, filterExpression }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)

  const handleClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      const map = mapRef.current
      if (!map) return

      const features = map.queryRenderedFeatures(e.point, {
        layers: ['permits-circle'],
      })
      if (!features.length) return

      const f = features[0]
      const props = f.properties as Record<string, unknown>
      const geom = f.geometry as GeoJSON.Point

      onPermitSelect(
        {
          id: String(props.id || ''),
          address: String(props.address || ''),
          city: String(props.city || 'Nashville'),
          zip: String(props.zip || ''),
          type: String(props.type || ''),
          description: String(props.description || ''),
          constructionCost: props.constructionCost ? Number(props.constructionCost) : null,
          contractor: String(props.contractor || ''),
          status: String(props.status || ''),
          dateIssued: props.dateIssued ? String(props.dateIssued) : null,
          daysAgo: Number(props.daysAgo || 999),
          sqft: props.sqft ? Number(props.sqft) : null,
          bedrooms: props.bedrooms ? Number(props.bedrooms) : null,
          bathrooms: props.bathrooms ? Number(props.bathrooms) : null,
          propertyType: String(props.propertyType || 'unknown'),
          parcel: String(props.parcel || ''),
          subdivision: String(props.subdivision || ''),
          subtype: String(props.subtype || ''),
        },
        geom.coordinates as [number, number],
      )
    },
    [onPermitSelect],
  )

  // Initialize map
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
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [
          {
            id: 'carto-light-layer',
            type: 'raster',
            source: 'carto-light',
            paint: {
              'raster-saturation': -0.3,
              'raster-brightness-min': 0.08,
            },
          },
        ],
      },
      center: NASHVILLE,
      zoom: 10.5,
      maxZoom: 18,
      minZoom: 9,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      // Add GeoJSON source — MapLibre fetches the URL directly
      map.addSource('permits', {
        type: 'geojson',
        data: '/api/permits/geojson?days=180&limit=500',
      })

      // Main circle layer — colored by recency
      map.addLayer({
        id: 'permits-circle',
        type: 'circle',
        source: 'permits',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 2.5,
            12, 5,
            15, 9,
            17, 14,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'daysAgo'],
            ...RECENCY_COLORS.flat(),
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 0.5,
            14, 1.5,
          ],
          'circle-opacity': 0.85,
        },
      })

      // Highlight layer — shows on hover
      map.addLayer({
        id: 'permits-highlight',
        type: 'circle',
        source: 'permits',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 6,
            12, 10,
            15, 16,
            17, 22,
          ],
          'circle-color': 'transparent',
          'circle-stroke-color': '#F59E0B',
          'circle-stroke-width': 2.5,
        },
      })

      // Cursor + hover
      map.on('mouseenter', 'permits-circle', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'permits-circle', () => {
        map.getCanvas().style.cursor = ''
        map.setFilter('permits-highlight', ['==', ['get', 'id'], ''])
      })
      map.on('mousemove', 'permits-circle', (e) => {
        if (e.features?.length) {
          const id = e.features[0].properties?.id
          if (id) {
            map.setFilter('permits-highlight', ['==', ['get', 'id'], id])
          }
        }
      })

      setLoaded(true)
    })

    map.on('click', 'permits-circle', handleClick)

    mapRef.current = map

    // Listen for flyTo events from address search
    function handleFlyTo(e: Event) {
      const detail = (e as CustomEvent).detail as {
        lng: number
        lat: number
        zoom?: number
      }
      map.flyTo({
        center: [detail.lng, detail.lat],
        zoom: detail.zoom || 14,
        duration: 1200,
      })
    }
    window.addEventListener('map-fly-to', handleFlyTo)

    return () => {
      window.removeEventListener('map-fly-to', handleFlyTo)
      map.remove()
      mapRef.current = null
    }
    // handleClick is stable via useCallback but we only want to init once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update click handler when callback changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    map.off('click', 'permits-circle', handleClick)
    map.on('click', 'permits-circle', handleClick)
  }, [handleClick, loaded])

  // Apply filter expression
  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return

    if (filterExpression) {
      map.setFilter('permits-circle', filterExpression)
    } else {
      map.setFilter('permits-circle', null)
    }
  }, [filterExpression, loaded])

  return (
    <div ref={containerRef} className="w-full h-full" />
  )
}

/** Imperatively fly the map to a coordinate */
export function flyTo(map: maplibregl.Map | null, lngLat: [number, number], zoom = 14) {
  if (!map) return
  map.flyTo({ center: lngLat, zoom, duration: 1200 })
}
