// Server component: Pipeline data scoped to a community's ZIPs.
// Pulls active-permit count and 3 most recent permits from
// public.building_permits (synced daily by /api/cron/sync-permits).
// Empty state when none of the community's ZIPs have coverage in
// the curated PIPELINE_ZIPS list, or when the table has no rows
// for those ZIPs.

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PIPELINE_ZIPS } from '@/lib/pipeline-zips'

interface NeighborhoodPipelineProps {
  communityName: string
  zips: string[]
}

interface PermitRow {
  permit_number: string
  date_issued: string | null
  street_address: string | null
  zip: string | null
  contractor: string | null
}

export default async function NeighborhoodPipeline({
  communityName,
  zips,
}: NeighborhoodPipelineProps) {
  const coveredZips = zips.filter((z) =>
    PIPELINE_ZIPS.some((pz) => pz.zip === z),
  )

  if (coveredZips.length === 0) {
    return (
      <section className="bg-white py-12 lg:py-14 border-t border-black/5">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
            Nashville Pipeline
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2">
            Pipeline coverage for {communityName} is not yet live.
          </h2>
          <p className="mt-4 text-sm text-househaven-text-muted leading-relaxed max-w-2xl">
            We track new-construction permits county by county. {communityName}&rsquo;s ZIPs
            ({zips.join(', ')}) are not in our current Pipeline coverage; we are expanding to
            additional Middle Tennessee counties. The full coverage map is at{' '}
            <Link href="/pipeline" className="underline hover:text-househaven-navy">
              /pipeline
            </Link>
            .
          </p>
        </div>
      </section>
    )
  }

  const supabase = await createClient()
  const since = new Date(Date.now() - 180 * 86_400_000).toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('building_permits')
    .select('permit_number, date_issued, street_address, zip, contractor')
    .in('zip', coveredZips)
    .gte('date_issued', since)
    .order('date_issued', { ascending: false })
    .limit(50)

  const permits: PermitRow[] = error ? [] : (data ?? []) as PermitRow[]

  return (
    <section className="bg-white py-14 lg:py-16 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              Nashville Pipeline · {coveredZips.join(', ')}
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-2">
              {permits.length > 0
                ? `${permits.length} new-construction permits in the last 180 days.`
                : 'No new-construction permits in the last 180 days.'}
            </h2>
          </div>
          <Link
            href={`/pipeline/${coveredZips[0]}`}
            className="text-sm font-semibold text-househaven-navy hover:underline shrink-0"
          >
            See the {communityName} Pipeline view →
          </Link>
        </div>

        {permits.length > 0 && (
          <ul className="mt-8 grid md:grid-cols-3 gap-4">
            {permits.slice(0, 3).map((p) => (
              <li
                key={p.permit_number}
                className="rounded-lg border border-black/10 bg-white p-4 text-sm"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                  {p.date_issued
                    ? new Date(p.date_issued).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </p>
                <p className="font-medium text-househaven-navy mt-1 line-clamp-2">
                  {p.street_address || 'Address withheld'}
                </p>
                {p.contractor && (
                  <p className="text-xs text-househaven-text-muted mt-2 truncate">
                    Builder: {p.contractor}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
