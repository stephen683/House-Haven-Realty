'use client'

import { useRef, useEffect } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface ZipMapEmbedProps {
  zip: string
  lat: number
  lng: number
}

export default function ZipMapEmbed({ zip, lat, lng }: ZipMapEmbedProps) {
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
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap &copy; CARTO',
          },
        },
        layers: [{
          id: 'carto-light-layer',
          type: 'raster',
          source: 'carto-light',
          paint: { 'raster-saturation': -0.3, 'raster-brightness-min': 0.08 },
        }],
      },
      center: [lng, lat],
      zoom: 12.5,
      maxZoom: 17,
      minZoom: 10,
      interactive: true,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      map.addSource('permits', {
        type: 'geojson',
        data: `/api/permits/geojson?days=365&limit=500`,
      })

      map.addLayer({
        id: 'permits-circle',
        type: 'circle',
        source: 'permits',
        filter: ['==', ['get', 'zip'], zip],
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 4, 13, 7, 15, 11],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'daysAgo'],
            0, '#10B981', 7, '#10B981',
            8, '#3B82F6', 30, '#3B82F6',
            31, '#000000', 90, '#000000',
            91, '#9CA3AF',
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
          'circle-opacity': 0.85,
        },
      })

      // Popup on click
      map.on('click', 'permits-circle', (e) => {
        if (!e.features?.length) return
        const props = e.features[0].properties as Record<string, string>
        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number]

        const beds = props.bedrooms ? `${props.bedrooms} bed` : ''
        const baths = props.bathrooms ? `${props.bathrooms} bath` : ''
        const sqft = props.sqft ? `${Number(props.sqft).toLocaleString()} sqft` : ''
        const specs = [beds, baths, sqft].filter(Boolean).join(' · ')

        new maplibregl.Popup({ maxWidth: '280px' })
          .setLngLat(coords)
          .setHTML(`
            <div style="font-family:system-ui;font-size:13px">
              <strong>${props.address || 'Address withheld'}</strong><br/>
              <span style="color:#666;font-size:11px">${specs}</span><br/>
              ${props.constructionCost ? `<span style="font-weight:600">$${Number(props.constructionCost).toLocaleString()}</span><br/>` : ''}
              <span style="color:#888;font-size:10px">${props.contractor || ''}</span>
            </div>
          `)
          .addTo(map)
      })

      map.on('mouseenter', 'permits-circle', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'permits-circle', () => {
        map.getCanvas().style.cursor = ''
      })
    })

    return () => map.remove()
  }, [zip, lat, lng])

  return <div ref={containerRef} className="w-full h-full" />
}
