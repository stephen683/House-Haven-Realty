'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toggleInList, type FilterState } from '@/lib/pipeline-filters'

interface SuggestBuilder { label: string; count: number; slug: string }
interface SuggestZip { label: string; count: number; name: string | null }
interface SuggestStreet { label: string; count: number }
interface AddressSuggestion { text: string; magicKey: string }

type Row =
  | { kind: 'builder'; label: string; meta: string }
  | { kind: 'zip'; label: string; meta: string }
  | { kind: 'street'; label: string; meta: string }
  | { kind: 'address'; label: string; meta: string; magicKey: string }
  | { kind: 'freetext'; label: string; meta: string }

interface PipelineSearchBarProps {
  filters: FilterState
  onChange: (next: FilterState) => void
  onFlyTo: (address: string, coords: { lng: number; lat: number }) => void
  coverageLabel?: string | null
}

const GROUP_LABEL: Record<Row['kind'], string> = {
  freetext: 'Search',
  builder: 'Builders',
  zip: 'Neighborhoods',
  street: 'Streets',
  address: 'Addresses',
}

const MIN_QUERY = 2

export default function PipelineSearchBar({
  filters,
  onChange,
  onFlyTo,
  coverageLabel,
}: PipelineSearchBarProps) {
  const [text, setText] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = 'pipeline-search-listbox'

  // Suggestions come from two sources: our permit corpus (builders, ZIPs,
  // streets) and the ArcGIS geocoder (any Davidson County address). Neither
  // blocks the other.
  useEffect(() => {
    const q = text.trim()
    if (q.length < MIN_QUERY) {
      setRows([])
      setOpen(false)
      setLoading(false)
      return
    }

    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      const [corpus, addresses] = await Promise.allSettled([
        fetch(`/api/pipeline/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
          .then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/suggest?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
          .then((r) => (r.ok ? r.json() : null)),
      ])

      if (ctrl.signal.aborted) return

      const next: Row[] = [
        { kind: 'freetext', label: q, meta: 'address or builder text' },
      ]

      if (corpus.status === 'fulfilled' && corpus.value) {
        const c = corpus.value as {
          builders: SuggestBuilder[]
          zips: SuggestZip[]
          streets: SuggestStreet[]
        }
        for (const b of c.builders ?? []) {
          next.push({
            kind: 'builder',
            label: b.label,
            meta: `${b.count} permit${b.count === 1 ? '' : 's'}`,
          })
        }
        for (const z of c.zips ?? []) {
          next.push({
            kind: 'zip',
            label: z.label,
            meta: z.name ? `${z.name} · ${z.count}` : `${z.count} permits`,
          })
        }
        for (const s of c.streets ?? []) {
          next.push({
            kind: 'street',
            label: s.label,
            meta: `${s.count} permit${s.count === 1 ? '' : 's'}`,
          })
        }
      }

      if (addresses.status === 'fulfilled' && addresses.value) {
        const a = addresses.value as { suggestions?: AddressSuggestion[] }
        for (const s of (a.suggestions ?? []).slice(0, 4)) {
          next.push({
            kind: 'address',
            label: s.text,
            meta: 'zoom map',
            magicKey: s.magicKey,
          })
        }
      }

      setRows(next)
      setActive(0)
      setOpen(true)
      setLoading(false)
    }, 200)

    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [text])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const applyRow = useCallback(
    async (row: Row) => {
      setOpen(false)
      switch (row.kind) {
        case 'builder':
          onChange({ ...filters, contractorKey: row.label, q: '' })
          setText('')
          break
        case 'zip':
          onChange({
            ...filters,
            zips: filters.zips.includes(row.label) ? filters.zips : [...filters.zips, row.label],
            q: '',
          })
          setText('')
          break
        case 'street':
        case 'freetext':
          onChange({ ...filters, q: row.label })
          break
        case 'address': {
          onChange({ ...filters, q: '' })
          try {
            const res = await fetch('/api/geocode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: row.label, magicKey: row.magicKey }),
            })
            const data = await res.json()
            if (data.latitude && data.longitude) {
              onFlyTo(row.label, { lng: data.longitude, lat: data.latitude })
            }
          } catch {
            // Geocode is best-effort; the text search still applies.
          }
          setText(row.label)
          break
        }
      }
    },
    [filters, onChange, onFlyTo],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (!open || rows.length === 0) {
        if (e.key === 'Enter' && text.trim()) {
          e.preventDefault()
          onChange({ ...filters, q: text.trim() })
        }
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => (i + 1) % rows.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => (i - 1 + rows.length) % rows.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        void applyRow(rows[active])
      }
    },
    [open, rows, active, applyRow, text, filters, onChange],
  )

  // Group rows for rendering while keeping one flat index for keyboard nav.
  const groups = useMemo(() => {
    const out: { kind: Row['kind']; items: { row: Row; index: number }[] }[] = []
    rows.forEach((row, index) => {
      const last = out[out.length - 1]
      if (last && last.kind === row.kind) last.items.push({ row, index })
      else out.push({ kind: row.kind, items: [{ row, index }] })
    })
    return out
  }, [rows])

  const chips = [
    filters.contractorKey && {
      label: filters.contractorKey,
      prefix: 'Builder',
      clear: () => onChange({ ...filters, contractorKey: '' }),
    },
    ...filters.zips.map((z) => ({
      label: z,
      prefix: 'ZIP',
      clear: () => onChange({ ...filters, zips: toggleInList(filters.zips, z) }),
    })),
    ...filters.propertyTypes.map((t) => ({
      label: t.replace('_', ' '),
      prefix: 'Type',
      clear: () => onChange({ ...filters, propertyTypes: toggleInList(filters.propertyTypes, t) }),
    })),
    filters.beds && {
      label: `${filters.beds}+ beds`,
      prefix: 'Beds',
      clear: () => onChange({ ...filters, beds: '' }),
    },
    filters.baths && {
      label: `${filters.baths}+ baths`,
      prefix: 'Baths',
      clear: () => onChange({ ...filters, baths: '' }),
    },
    filters.q && {
      label: filters.q,
      prefix: 'Text',
      clear: () => {
        onChange({ ...filters, q: '' })
        setText('')
      },
    },
  ].filter(Boolean) as { label: string; prefix: string; clear: () => void }[]

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-househaven-text-muted pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => rows.length > 0 && setOpen(true)}
          placeholder="Search Davidson County — builder, street, ZIP, or address"
          className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-black/10 bg-white text-sm font-medium text-househaven-text placeholder:font-normal placeholder:text-househaven-text-muted focus:outline-none focus:border-black transition"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && rows[active] ? `pipeline-opt-${active}` : undefined}
          aria-label="Search Davidson County new construction"
          data-testid="search-input"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" aria-hidden="true" />
        )}
        {!loading && text && (
          <button
            type="button"
            onClick={() => { setText(''); setOpen(false); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-househaven-text-muted hover:text-black"
            aria-label="Clear search text"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2" data-testid="active-chips">
          {chips.map((c) => (
            <button
              key={`${c.prefix}-${c.label}`}
              type="button"
              onClick={c.clear}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-lg bg-black text-white text-[11px] font-medium hover:bg-househaven-navy-light transition"
            >
              <span className="text-white/50 uppercase tracking-wider text-[9px]">{c.prefix}</span>
              <span className="max-w-[180px] truncate">{c.label}</span>
              <span aria-hidden="true" className="text-white/60">&times;</span>
              <span className="sr-only">Remove {c.prefix} filter</span>
            </button>
          ))}
        </div>
      )}

      {open && rows.length > 0 && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          data-testid="search-listbox"
          className="absolute z-[60] mt-2 w-full bg-white border-2 border-black/10 rounded-xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto"
        >
          {groups.map((group) => (
            <div key={`${group.kind}-${group.items[0].index}`} className="border-b border-black/5 last:border-b-0">
              <p className="px-3.5 pt-2.5 pb-1 text-[9px] font-bold uppercase tracking-widest text-househaven-text-muted">
                {GROUP_LABEL[group.kind]}
              </p>
              {group.items.map(({ row, index }) => (
                <button
                  key={`${row.kind}-${row.label}-${index}`}
                  id={`pipeline-opt-${index}`}
                  type="button"
                  role="option"
                  aria-selected={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => void applyRow(row)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left transition ${
                    index === active ? 'bg-black text-white' : 'hover:bg-househaven-surface'
                  }`}
                >
                  <span className="text-sm font-medium truncate">{row.label}</span>
                  <span className={`text-[10px] shrink-0 ${index === active ? 'text-white/60' : 'text-househaven-text-muted'}`}>
                    {row.meta}
                  </span>
                </button>
              ))}
            </div>
          ))}
          <div className="px-3.5 py-2 bg-househaven-surface flex items-center justify-between">
            <p className="text-[9px] text-househaven-text-muted">
              <kbd className="font-sans">&uarr;&darr;</kbd> navigate &middot; <kbd className="font-sans">&crarr;</kbd> select &middot; <kbd className="font-sans">esc</kbd> close
            </p>
            {coverageLabel && (
              <p className="text-[9px] text-househaven-text-muted truncate max-w-[55%]">{coverageLabel}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
