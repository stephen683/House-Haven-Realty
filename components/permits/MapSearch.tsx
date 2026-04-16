'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Suggestion {
  text: string
  magicKey: string
}

interface MapSearchProps {
  onSelect: (address: string, coords: { lng: number; lat: number }) => void
}

export default function MapSearch({ onSelect }: MapSearchProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Debounced fetch suggestions
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSuggestions(data.suggestions || [])
        setOpen((data.suggestions || []).length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  // Geocode selected suggestion
  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setQuery(suggestion.text)
      setOpen(false)
      setSuggestions([])

      try {
        const res = await fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: suggestion.text,
            magicKey: suggestion.magicKey,
          }),
        })
        const data = await res.json()
        if (data.latitude && data.longitude) {
          onSelect(suggestion.text, {
            lng: data.longitude,
            lat: data.latitude,
          })
        }
      } catch {
        // Geocode failed silently
      }
    },
    [onSelect],
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-househaven-text-muted pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            fetchSuggestions(e.target.value)
          }}
          placeholder="Search an address..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-black/10 bg-white text-sm text-househaven-text placeholder:text-househaven-text-muted focus:outline-none focus:ring-2 focus:ring-househaven-navy/20 focus:border-househaven-navy/40"
          aria-label="Search Nashville addresses"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-househaven-navy/30 border-t-househaven-navy rounded-lg animate-spin" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden"
          role="listbox"
        >
          {suggestions.map((s) => (
            <li key={s.magicKey}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-househaven-text hover:bg-househaven-surface transition-colors"
                role="option"
                aria-selected={false}
              >
                {s.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
