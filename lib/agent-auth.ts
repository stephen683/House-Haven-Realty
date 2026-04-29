import crypto from 'node:crypto'
import { cookies } from 'next/headers'

export const AGENT_COOKIE_NAME = 'hh_agent_session'
export const AGENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function getAgentPassword() {
  return process.env.AGENT_PORTAL_PASSWORD || ''
}

export function makeSessionToken(password: string) {
  return crypto.createHmac('sha256', password).update('agent-portal-v1').digest('hex')
}

export async function isAgentAuthed(): Promise<boolean> {
  const password = getAgentPassword()
  if (!password) return false
  const store = await cookies()
  const cookie = store.get(AGENT_COOKIE_NAME)?.value
  if (!cookie) return false
  const expected = makeSessionToken(password)
  if (cookie.length !== expected.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(expected))
  } catch {
    return false
  }
}
