import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'node:crypto'
import {
  AGENT_COOKIE_MAX_AGE,
  AGENT_COOKIE_NAME,
  getAgentPassword,
  makeSessionToken,
} from '@/lib/agent-auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  let body: { password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const expected = getAgentPassword()
  const submitted = typeof body.password === 'string' ? body.password : ''

  if (!expected) {
    return NextResponse.json({ error: 'Portal not configured' }, { status: 503 })
  }

  let ok = false
  try {
    ok =
      submitted.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(submitted), Buffer.from(expected))
  } catch {
    ok = false
  }

  if (!ok) {
    await new Promise((r) => setTimeout(r, 300))
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const store = await cookies()
  store.set(AGENT_COOKIE_NAME, makeSessionToken(expected), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: AGENT_COOKIE_MAX_AGE,
  })
  return NextResponse.json({ ok: true })
}
