import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAgentAuthed } from '@/lib/agent-auth'
import { createClient } from '@/lib/supabase/server'
import AgentNav from '@/components/agents/AgentNav'
import type { AdvisoryBookingRow } from '@/lib/advisory-bookings'

export const metadata: Metadata = {
  title: 'Advisory bookings — House Haven Realty',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function fmtCentral(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function fmtMoney(cents: number | null | undefined): string {
  if (!cents) return '—'
  return `$${(cents / 100).toFixed(0)}`
}

function statusBadge(status: string, intent: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral') {
  const colors: Record<typeof intent, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${colors[intent]}`}>
      {status}
    </span>
  )
}

function paymentIntent(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'succeeded') return 'success'
  if (s === 'pending') return 'warning'
  if (s === 'failed' || s === 'refunded') return 'danger'
  return 'neutral'
}

function briefIntent(s: string): 'success' | 'warning' | 'neutral' {
  if (s === 'delivered') return 'success'
  if (s === 'drafted') return 'warning'
  return 'neutral'
}

export default async function AdvisoryAdminIndex() {
  if (!(await isAgentAuthed())) redirect('/agents')

  const supabase = await createClient()
  const now = new Date().toISOString()
  const thirtyDaysAhead = new Date(Date.now() + 30 * 86_400_000).toISOString()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString()

  const [{ data: upcoming }, { data: recent }] = await Promise.all([
    supabase
      .from('advisory_bookings')
      .select('*')
      .gte('slot_utc', now)
      .lte('slot_utc', thirtyDaysAhead)
      .is('canceled_at', null)
      .order('slot_utc', { ascending: true }),
    supabase
      .from('advisory_bookings')
      .select('*')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const upcomingBookings = (upcoming ?? []) as AdvisoryBookingRow[]
  const recentBookings = (recent ?? []) as AdvisoryBookingRow[]

  // Stats
  const month = recentBookings.filter(
    (b) => b.payment_status === 'succeeded' && !b.canceled_at,
  )
  const totalRevenue = month.reduce((s, b) => s + (b.amount_cents ?? 0), 0)
  const paidBriefs = month.filter((b) => b.booking_type === 'paid_brief').length
  const discoveryCalls = month.filter((b) => b.booking_type === 'discovery_call').length

  return (
    <main className="min-h-screen bg-househaven-surface">
      <AgentNav active="advisory" />

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
        <header className="mb-8">
          <h1 className="font-serif text-3xl text-househaven-navy">Advisory bookings</h1>
          <p className="mt-2 text-sm text-househaven-text-muted">
            Past 30 days plus the upcoming 30. Click a booking to manage it.
          </p>
        </header>

        {/* Stats */}
        <section className="grid sm:grid-cols-4 gap-4 mb-10">
          <Stat value={String(month.length)} label="Booked (30d)" />
          <Stat value={fmtMoney(totalRevenue)} label="Revenue (30d)" />
          <Stat value={String(paidBriefs)} label="Paid Briefs (30d)" />
          <Stat value={String(discoveryCalls)} label="Discovery calls (30d)" />
        </section>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="font-serif text-xl text-househaven-navy mb-4">
            Upcoming consults ({upcomingBookings.length})
          </h2>
          {upcomingBookings.length === 0 ? (
            <p className="text-sm text-househaven-text-muted py-6 text-center bg-white rounded border border-black/10">
              No bookings in the next 30 days.
            </p>
          ) : (
            <BookingsTable bookings={upcomingBookings} />
          )}
        </section>

        {/* Recent */}
        <section>
          <h2 className="font-serif text-xl text-househaven-navy mb-4">
            Recent bookings (last 30 days)
          </h2>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-househaven-text-muted py-6 text-center bg-white rounded border border-black/10">
              No bookings yet.
            </p>
          ) : (
            <BookingsTable bookings={recentBookings} showCanceled />
          )}
        </section>
      </div>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-white border border-black/10 p-4">
      <p className="font-serif text-2xl text-househaven-navy">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-househaven-text-muted mt-1">
        {label}
      </p>
    </div>
  )
}

function BookingsTable({
  bookings,
  showCanceled = false,
}: {
  bookings: AdvisoryBookingRow[]
  showCanceled?: boolean
}) {
  return (
    <div className="rounded-lg border border-black/10 bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-househaven-surface border-b border-black/10">
          <tr className="text-left text-xs uppercase tracking-wider text-househaven-text-muted">
            <th className="px-4 py-3">Slot (Central)</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Brief</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const typeLabel = b.booking_type === 'discovery_call' ? 'Discovery' : 'Paid Brief'
            const isCanceled = !!b.canceled_at
            return (
              <tr
                key={b.id}
                className={`border-b border-black/5 last:border-0 hover:bg-househaven-surface/50 transition ${
                  isCanceled && !showCanceled ? 'hidden' : ''
                } ${isCanceled ? 'opacity-50' : ''}`}
              >
                <td className="px-4 py-3 align-top">
                  <Link
                    href={`/agents/advisory/${b.id}`}
                    className="font-medium text-househaven-navy hover:underline"
                  >
                    {fmtCentral(b.slot_central ?? b.slot_utc)}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-househaven-navy truncate max-w-[180px]">
                    {b.client_name}
                  </p>
                  <p className="text-xs text-househaven-text-muted truncate max-w-[180px]">
                    {b.client_email}
                  </p>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="text-xs">{typeLabel}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  {statusBadge(b.payment_status, paymentIntent(b.payment_status))}
                  <span className="ml-2 text-xs text-househaven-text-muted">
                    {fmtMoney(b.amount_cents)}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  {isCanceled
                    ? statusBadge('canceled', 'danger')
                    : statusBadge(b.brief_status.replace('_', ' '), briefIntent(b.brief_status))}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
