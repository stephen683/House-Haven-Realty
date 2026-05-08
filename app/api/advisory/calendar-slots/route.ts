import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots, getSlotConfig, type BookingTypeForSlots } from '@/lib/advisory-slots'

export const runtime = 'nodejs'

function parseType(s: string | null): BookingTypeForSlots {
  return s === 'discovery_call' ? 'discovery_call' : 'paid_brief'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')
  const type = parseType(searchParams.get('type'))

  const start = fromParam ? new Date(fromParam) : new Date()
  const end = toParam ? new Date(toParam) : new Date(Date.now() + 30 * 86_400_000)

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  // Cap range to 60 days to avoid expensive scans
  const maxEnd = new Date(start.getTime() + 60 * 86_400_000)
  const safeEnd = end > maxEnd ? maxEnd : end

  const result = await getAvailableSlots(start, safeEnd, getSlotConfig(type))
  return NextResponse.json(result)
}
