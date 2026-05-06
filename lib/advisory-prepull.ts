// RentCast pre-pull for FSBO + Sell-or-Rent intake.
// Stored in advisory_bookings.rentcast_prepull so Stephen has prep data ready
// before the consult begins.

import { getValuation } from '@/lib/rentcast'

export interface PrepullData {
  address: string
  mid: number | null
  low: number | null
  high: number | null
  comps: unknown[]
  confidenceNote: string
  source: 'rentcast' | 'mock'
  pulledAt: string
}

export async function prepullRentCast(
  address: string | null | undefined,
): Promise<PrepullData | null> {
  if (!address || !address.trim()) return null
  try {
    const valuation = await getValuation(address)
    return {
      address: address.trim(),
      mid: valuation.mid,
      low: valuation.low,
      high: valuation.high,
      comps: valuation.comps.slice(0, 5),
      confidenceNote: valuation.confidenceNote,
      source: valuation.source,
      pulledAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[advisory-prepull] rentcast failed', err)
    return null
  }
}
