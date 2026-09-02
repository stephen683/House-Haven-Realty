'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AlertSignup from '@/components/pipeline/AlertSignup'
import NotifySignup from '@/components/pipeline/NotifySignup'
import {
  filterStateToSearchParams,
  type FilterState,
} from '@/lib/pipeline-filters'

interface SearchResult {
  permitNumber: string
  street: string
  zip: string | null
  propertyType: string | null
  constructionCost: number | null
  sqft: number | null
  bedrooms: number | null
  bathrooms: number | null
  dateIssued: string | null
  builder: string | null
  builderSlug: string | null
  status: string | null
  // agent surface only
  address?: string | null
  parcel?: string | null
}

interface SearchResponse {
  surface: 'public' | 'agent'
  results: SearchResult[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  coverage: { from: string | null; to: string | null; days: number | null; label: string }
}

type SortField = 'date_issued' | 'construction_cost'

interface PermitSearchPanelProps {
  filters: FilterState
  onChange: (next: FilterState) => void
  availableZips: string[]
  /** Lets the search bar show the same measured window in its footer. */
  onCoverage?: (label: string | null) => void
}

const TYPE_LABEL: Record<string, string> = {
  single_family: 'Single family',
  townhome: 'Townhome',
  condo: 'Condo',
  duplex: 'Duplex',
  multi_family: 'Multi-family',
  accessory: 'Accessory',
  commercial: 'Commercial',
  unknown: 'Unspecified',
}

function money(n: number | null) {
  return n === null ? '—' : `$${Math.round(n).toLocaleString()}`
}

function shortDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function PermitSearchPanel({
  filters,
  onChange,
  availableZips,
  onCoverage,
}: PermitSearchPanelProps) {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortField>('date_issued')
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc')
  const [notifyFor, setNotifyFor] = useState<string | null>(null)

  const queryString = useMemo(
    () => filterStateToSearchParams(filters, { page, sort, direction }).toString(),
    [filters, page, sort, direction],
  )

  // Any filter change returns to page 1 — page 4 of a different result set is
  // meaningless.
  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      setFailed(false)
      try {
        const res = await fetch(`/api/pipeline/search?${queryString}`, {
          signal: ctrl.signal,
        })
        if (!res.ok) throw new Error(String(res.status))
        setData((await res.json()) as SearchResponse)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setFailed(true)
          setData(null)
        }
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [queryString])

  useEffect(() => {
    onCoverage?.(data?.coverage.label ?? null)
  }, [data?.coverage.label, onCoverage])

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sort === field) {
        setDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
      } else {
        setSort(field)
        setDirection('desc')
      }
      setPage(1)
    },
    [sort],
  )

  const isAgent = data?.surface === 'agent'
  const results = data?.results ?? []

  return (
    <aside
      className="w-full lg:w-[420px] shrink-0 border-l border-black/5 bg-white flex flex-col min-h-0"
      aria-label="Permit search results"
    >
      {/* Search input */}
      <div className="px-4 py-3 border-b border-black/5 space-y-2.5 shrink-0">
        <label htmlFor="permit-search" className="sr-only">
          Search permits by street or builder
        </label>
        <input
          id="permit-search"
          type="search"
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
          placeholder="Search street or builder…"
          className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
        />

        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={filters.sqftMin}
            onChange={(e) => onChange({ ...filters, sqftMin: e.target.value })}
            placeholder="Min sqft"
            aria-label="Minimum square feet"
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
          />
          <input
            type="number"
            inputMode="numeric"
            value={filters.sqftMax}
            onChange={(e) => onChange({ ...filters, sqftMax: e.target.value })}
            placeholder="Max sqft"
            aria-label="Maximum square feet"
            className="w-full px-2.5 py-1.5 rounded-lg border border-black/10 text-xs focus:outline-none focus:ring-1 focus:ring-househaven-navy/30"
          />
        </div>

        {filters.contractorKey && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, contractorKey: '' })}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black text-white text-[11px]"
          >
            Builder: {filters.contractorKey}
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Clear builder filter</span>
          </button>
        )}

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-househaven-text-muted" aria-live="polite">
            {loading
              ? 'Searching…'
              : failed
                ? 'Search unavailable'
                : `${(data?.total ?? 0).toLocaleString()} permit${data?.total === 1 ? '' : 's'}`}
          </p>
          <div className="flex items-center gap-1">
            {(['date_issued', 'construction_cost'] as SortField[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleSort(f)}
                aria-pressed={sort === f}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                  sort === f
                    ? 'bg-househaven-navy text-white'
                    : 'bg-househaven-surface text-househaven-text hover:bg-black/5'
                }`}
              >
                {f === 'date_issued' ? 'Date' : 'Cost'}
                {sort === f && <span aria-hidden="true">{direction === 'desc' ? ' ↓' : ' ↑'}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!loading && results.length === 0 && (
          <div className="p-5 text-center space-y-4">
            <div>
              <p className="font-serif text-lg text-househaven-navy">
                {failed ? 'Search is unavailable' : 'No permits match.'}
              </p>
              <p className="text-xs text-househaven-text-muted mt-1.5">
                {failed
                  ? 'Try again in a moment, or call (615) 624-4766.'
                  : 'Widen the date range, clear a filter, or try a different street.'}
              </p>
            </div>
            {!failed && (
              <div className="pt-2 border-t border-black/5">
                <p className="text-xs text-househaven-text mb-2.5">
                  Want to know the moment something breaks ground here?
                </p>
                <div className="flex justify-center">
                  <AlertSignup availableZips={availableZips} />
                </div>
              </div>
            )}
          </div>
        )}

        <ul className="divide-y divide-black/5">
          {results.map((r) => (
            <li key={r.permitNumber} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-househaven-navy truncate">
                    {isAgent && r.address ? r.address : r.street || 'Address withheld'}
                  </p>
                  <p className="text-[11px] text-househaven-text-muted mt-0.5">
                    {r.zip ?? '—'} &middot; {TYPE_LABEL[r.propertyType ?? 'unknown'] ?? r.propertyType}
                    {r.sqft ? ` · ${r.sqft.toLocaleString()} sqft` : ''}
                    {r.bedrooms ? ` · ${r.bedrooms} bd` : ''}
                  </p>
                  {r.builder && (
                    <p className="text-[11px] mt-0.5 truncate">
                      {r.builderSlug ? (
                        <Link
                          href={`/pipeline/builders/${r.builderSlug}`}
                          className="text-househaven-navy hover:underline"
                        >
                          {r.builder}
                        </Link>
                      ) : (
                        <span className="text-househaven-text-muted">{r.builder}</span>
                      )}
                    </p>
                  )}
                  {isAgent && r.parcel && (
                    <p className="text-[10px] text-househaven-text-muted mt-0.5 font-mono">
                      APN {r.parcel}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-househaven-navy">
                    {money(r.constructionCost)}
                  </p>
                  <p className="text-[10px] text-househaven-text-muted mt-0.5">
                    {shortDate(r.dateIssued)}
                  </p>
                </div>
              </div>

              {notifyFor === r.permitNumber ? (
                <div className="mt-3">
                  <NotifySignup
                    permitNumber={r.permitNumber}
                    address={isAgent && r.address ? r.address : r.street}
                    zip={r.zip ?? ''}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNotifyFor(r.permitNumber)}
                  className="mt-2 text-[11px] font-medium text-househaven-navy hover:underline"
                >
                  Notify me when this lists
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-black/5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-househaven-surface text-xs font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-[11px] text-househaven-text-muted">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
              className="px-3 py-1.5 rounded-lg bg-househaven-surface text-xs font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Coverage — measured from the data, never hardcoded */}
      <div className="px-4 py-2.5 border-t border-black/5 bg-househaven-surface shrink-0 space-y-1.5">
        <p className="text-[10px] text-househaven-text-muted leading-relaxed">
          {data?.coverage.label ?? 'Loading coverage…'}
        </p>
        {isAgent && (
          <a
            href={`/api/pipeline/search?${filterStateToSearchParams(filters, { sort, direction, format: 'csv' }).toString()}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-househaven-navy hover:underline"
          >
            Export these results (CSV)
            <span className="text-[9px] uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded">
              Agent
            </span>
          </a>
        )}
      </div>
    </aside>
  )
}
