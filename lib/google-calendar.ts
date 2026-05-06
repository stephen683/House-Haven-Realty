// Google Calendar wrapper. Server-side only — never import from a Client
// Component. Uses Stephen-OS OAuth refresh token to mint short-lived access
// tokens, then hits Calendar API v3 directly via fetch (matches existing
// fetch-based wrappers). When the OAuth env vars are unset, returns
// deterministic mock data so the booking flow ships before Stephen-OS
// OAuth is verified.
//
// Setup: Stephen-OS Cloud Console OAuth client (status must be Published, or
// stephen@househavenrealty.com pinned as permanent Test user — flagged in
// Phase 0). HHR Advisory uses a dedicated calendar inside
// stephen@househavenrealty.com identified by HHR_ADVISORY_CALENDAR_ID.

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3'

interface OAuthTokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) return null

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[google-calendar] token exchange failed', res.status, body)
      return null
    }
    const data = (await res.json()) as OAuthTokenResponse
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
    return data.access_token
  } catch (err) {
    console.error('[google-calendar] token fetch threw', err)
    return null
  }
}

function getCalendarId(): string | null {
  return process.env.HHR_ADVISORY_CALENDAR_ID ?? null
}

export interface FreeBusyRange {
  start: string // ISO
  end: string // ISO
}

export interface FreeBusyResult {
  busyRanges: FreeBusyRange[]
  source: 'google' | 'mock'
}

export async function listBusy(start: Date, end: Date): Promise<FreeBusyResult> {
  const token = await getAccessToken()
  const calendarId = getCalendarId()
  if (!token || !calendarId) {
    // Mock: empty busy = all slots in range are free. The slot-windows
    // policy in lib/advisory-config.ts narrows this.
    return { busyRanges: [], source: 'mock' }
  }
  try {
    const res = await fetch(`${CALENDAR_API_BASE}/freeBusy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: calendarId }],
      }),
    })
    if (!res.ok) {
      console.error('[google-calendar] freeBusy failed', res.status)
      return { busyRanges: [], source: 'mock' }
    }
    const data = (await res.json()) as {
      calendars?: Record<string, { busy?: FreeBusyRange[] }>
    }
    const busy = data.calendars?.[calendarId]?.busy ?? []
    return { busyRanges: busy, source: 'google' }
  } catch (err) {
    console.error('[google-calendar] freeBusy threw', err)
    return { busyRanges: [], source: 'mock' }
  }
}

export interface CreateEventInput {
  startUtc: Date
  endUtc: Date
  summary: string
  description: string
  attendeeEmails: string[]
  // Stable per-booking ID so conferenceData.createRequest is idempotent
  conferenceRequestId: string
}

export interface CreateEventResult {
  eventId: string
  meetLink: string | null
  htmlLink: string | null
  source: 'google' | 'mock'
}

export async function createEvent(input: CreateEventInput): Promise<CreateEventResult> {
  const token = await getAccessToken()
  const calendarId = getCalendarId()
  if (!token || !calendarId) {
    return {
      eventId: `evt_mock_${input.conferenceRequestId}`,
      meetLink: 'https://meet.google.com/mock-mock-mock',
      htmlLink: null,
      source: 'mock',
    }
  }
  try {
    const url = new URL(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events`,
    )
    url.searchParams.set('conferenceDataVersion', '1')
    url.searchParams.set('sendUpdates', 'all')
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.startUtc.toISOString(), timeZone: 'UTC' },
        end: { dateTime: input.endUtc.toISOString(), timeZone: 'UTC' },
        attendees: input.attendeeEmails.map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: input.conferenceRequestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[google-calendar] createEvent failed', res.status, body)
      return {
        eventId: `evt_mock_${input.conferenceRequestId}`,
        meetLink: 'https://meet.google.com/mock-mock-mock',
        htmlLink: null,
        source: 'mock',
      }
    }
    const data = (await res.json()) as {
      id: string
      hangoutLink?: string
      htmlLink?: string
      conferenceData?: {
        entryPoints?: Array<{ uri: string; entryPointType: string }>
      }
    }
    const meetEntry = data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === 'video',
    )
    return {
      eventId: data.id,
      meetLink: data.hangoutLink ?? meetEntry?.uri ?? null,
      htmlLink: data.htmlLink ?? null,
      source: 'google',
    }
  } catch (err) {
    console.error('[google-calendar] createEvent threw', err)
    return {
      eventId: `evt_mock_${input.conferenceRequestId}`,
      meetLink: 'https://meet.google.com/mock-mock-mock',
      htmlLink: null,
      source: 'mock',
    }
  }
}

export async function deleteEvent(eventId: string): Promise<{ ok: boolean }> {
  const token = await getAccessToken()
  const calendarId = getCalendarId()
  if (!token || !calendarId) {
    console.info('[google-calendar] deleteEvent dry-run', eventId)
    return { ok: true }
  }
  try {
    const res = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
    )
    return { ok: res.ok || res.status === 410 } // 410 = already gone
  } catch (err) {
    console.error('[google-calendar] deleteEvent threw', err)
    return { ok: false }
  }
}

export function isCalendarLive(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN &&
      process.env.HHR_ADVISORY_CALENDAR_ID,
  )
}
