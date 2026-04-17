'use client'

import { useState, useEffect } from 'react'
import type { FilterSpecification } from 'maplibre-gl'

export interface FilterState {
  dateRange: 'all' | '7' | '30' | '90'
  costMin: string
  costMax: string
  zip: string
  beds: string
  propertyType: string
}

const DATE_OPTIONS = [
  { value: 'all', label: 'All dates' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
] as const

interface MapFiltersProps {
  onChange: (filter: FilterSpecification | null) => void
  availableZips: string[]
}

export default function MapFilters({ onChange, availableZips }: MapFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    costMin: '',
    costMax: '',
    zip: '',
    beds: '',
    propertyType: '',
  })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const conditions: FilterSpecification[] = []

    // Date range
    if (filters.dateRange !== 'all') {
      conditions.push(['<=', ['get', 'daysAgo'], Number(filters.dateRange)])
    }

    // Cost range
    if (filters.costMin) {
      conditions.push(['>=', ['get', 'constructionCost'], Number(filters.costMin)])
    }
    if (filters.costMax) {
      conditions.push(['<=', ['get', 'constructionCost'], Number(filters.costMax)])
    }

    // ZIP
    if (filters.zip) {
      conditions.push(['==', ['get', 'zip'], filters.zip])
    }

    // Bedrooms
    if (filters.beds) {
      conditions.push(['>=', ['get', 'bedrooms'], Number(filters.beds)])
    }

    // Property type
    if (filters.propertyType) {
      conditions.push(['==', ['get', 'propertyType'], filters.propertyType])
    }

    if (conditions.length === 0) {
      onChange(null)
    } else {
      onChange(['all', ...conditions] as FilterSpecification)
    }
  }, [filters, onChange])

  const activeCount = [
    filters.dateRange !== 'all',
    filters.costMin !== '',
    filters.costMax !== '',
    filters.zip !== '',
    filters.beds !== '',
    filters.propertyType !== '',
  ].filter(Boolean).length

  const clearAll = () => {
    setFilters({ dateRange: 'all', costMin: '', costMax: '', zip: '', beds: '', propertyType: '' })
  }

  return (
    <div className="relative">
      {/* Toggle button — always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm text-househaven-text hover:border-househaven-navy/30 transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-lg bg-househaven-navy text-white text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {/* Filter panel */}
      {expanded && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-black/10 rounded-lg shadow-xl p-4 space-y-4 z-50">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-househaven-navy">
              Filter permits
            </p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-househaven-accent hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Date range */}
          <div>
            <label className="block text-xs text-househaven-text-muted mb-1.5">
              Date issued
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setFilters((f) => ({ ...f, dateRange: opt.value }))
                  }
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    filters.dateRange === opt.value
                      ? 'bg-househaven-navy text-white'
                      : 'bg-househaven-surface text-househaven-text hover:bg-black/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost range */}
          <div>
            <label className="block text-xs text-househaven-text-muted mb-1.5">
              Construction cost
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={filters.costMin}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, costMin: e.target.value }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
              />
              <input
                type="number"
                placeholder="Max $"
                value={filters.costMax}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, costMax: e.target.value }))
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
              />
            </div>
          </div>

          {/* ZIP filter */}
          <div>
            <label className="block text-xs text-househaven-text-muted mb-1.5">
              ZIP code
            </label>
            <select
              value={filters.zip}
              onChange={(e) =>
                setFilters((f) => ({ ...f, zip: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
            >
              <option value="">All ZIPs</option>
              {availableZips.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs text-househaven-text-muted mb-1.5">
              Bedrooms
            </label>
            <select
              value={filters.beds}
              onChange={(e) =>
                setFilters((f) => ({ ...f, beds: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
            >
              <option value="">Any</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Property type */}
          <div>
            <label className="block text-xs text-househaven-text-muted mb-1.5">
              Property type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, propertyType: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
            >
              <option value="">All types</option>
              <option value="single_family">Single Family</option>
              <option value="townhome">Townhome</option>
              <option value="condo">Condo</option>
              <option value="duplex">Duplex</option>
              <option value="multi_family">Multi-Family</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
