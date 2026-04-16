import { NextRequest, NextResponse } from 'next/server'
import { fetchRecentPermits } from '@/lib/permits'

export const runtime = 'nodejs'
export const revalidate = 21600 // 6 hours

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = Number(searchParams.get('days') || '90')
  const limit = Number(searchParams.get('limit') || '200')

  const permits = await fetchRecentPermits({ days, limit })
  return NextResponse.json({
    count: permits.length,
    permits,
    updatedAt: new Date().toISOString(),
  })
}
