'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface BuilderCardProps {
  contractor: string
  excludePermitNumber: string
}

interface PriorBuild {
  permit_number: string
  address: string
  zip: string
  date_issued: string | null
}

interface BuilderStats {
  priorBuilds: PriorBuild[]
  totalCount: number
  uniqueZips: number
  recentCount: number
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function BuilderCard({ contractor, excludePermitNumber }: BuilderCardProps) {
  const [stats, setStats] = useState<BuilderStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!contractor) {
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase
      .from('building_permits')
      .select('permit_number, address, zip, date_issued')
      .eq('contractor', contractor)
      .neq('permit_number', excludePermitNumber)
      .order('date_issued', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error || !data) {
          setStats(null)
          setLoading(false)
          return
        }
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        const recentCount = data.filter(
          (p) => p.date_issued && new Date(p.date_issued) >= ninetyDaysAgo,
        ).length
        const uniqueZips = new Set(data.map((p) => p.zip).filter(Boolean)).size
        setStats({
          priorBuilds: data.slice(0, 5),
          totalCount: data.length,
          uniqueZips,
          recentCount,
        })
        setLoading(false)
      })
  }, [contractor, excludePermitNumber])

  if (!contractor) return null

  return (
    <section className="rounded-lg border border-black/10 p-3">
      <p className="text-[10px] uppercase tracking-wider text-househaven-text-muted">
        Builder
      </p>
      <p className="mt-1 font-serif text-base text-househaven-navy leading-snug">
        {contractor}
      </p>
      {loading ? (
        <p className="mt-2 text-[11px] text-househaven-text-muted">Looking up prior builds&hellip;</p>
      ) : stats && stats.totalCount > 0 ? (
        <>
          <p className="mt-1 text-[11px] text-househaven-text-muted">
            Active in {stats.uniqueZips} Nashville ZIP{stats.uniqueZips === 1 ? '' : 's'}
            {' · '}
            {stats.totalCount} prior permit{stats.totalCount === 1 ? '' : 's'} tracked
            {stats.recentCount > 0 && ` · ${stats.recentCount} in the last 90 days`}
          </p>
          {stats.priorBuilds.length > 0 && (
            <ul className="mt-2 space-y-1">
              {stats.priorBuilds.map((b) => (
                <li key={b.permit_number} className="text-[11px] text-househaven-text">
                  <span className="text-househaven-text-muted">{b.zip || '—'}</span>
                  <span className="mx-1.5 text-househaven-text-muted">·</span>
                  <span>{b.address}</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/pipeline/builders/${slugify(contractor)}`}
            className="mt-2 inline-block text-[11px] font-semibold text-househaven-navy underline underline-offset-2 hover:no-underline"
          >
            View builder profile &rarr;
          </Link>
        </>
      ) : (
        <p className="mt-1 text-[11px] text-househaven-text-muted">
          No other permits tracked under this builder yet.
        </p>
      )}
    </section>
  )
}
