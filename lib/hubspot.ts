// HubSpot Private App API client. Server-side only.
// When HUBSPOT_PRIVATE_APP_TOKEN is unset, returns null silently — Supabase remains
// the source of truth for every lead, so a HubSpot outage never drops a lead.

const HUBSPOT_BASE = 'https://api.hubapi.com'

export interface HubSpotContactInput {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  source: string
  timeline?: string | null
  noteHtml?: string
}

interface HubSpotContactResponse {
  id: string
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function searchContactByEmail(token: string, email: string): Promise<string | null> {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/search`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      filterGroups: [{
        filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
      }],
      properties: ['email'],
      limit: 1,
    }),
  })
  if (!res.ok) return null
  const data = await res.json() as { results?: Array<{ id: string }> }
  return data.results?.[0]?.id ?? null
}

async function attachNote(token: string, contactId: string, html: string): Promise<void> {
  const noteRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      properties: {
        hs_note_body: html,
        hs_timestamp: new Date().toISOString(),
      },
    }),
  })
  if (!noteRes.ok) return
  const note = await noteRes.json() as { id: string }
  await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/notes/${note.id}/associations/contacts/${contactId}/note_to_contact`,
    { method: 'PUT', headers: authHeaders(token) },
  ).catch(() => undefined)
}

export async function upsertContact(input: HubSpotContactInput): Promise<string | null> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN
  if (!token) return null

  const properties: Record<string, string> = {
    email: input.email,
    hs_lead_status: 'NEW',
    lifecyclestage: 'lead',
    house_haven_source: input.source,
  }
  if (input.firstName) properties.firstname = input.firstName
  if (input.lastName) properties.lastname = input.lastName
  if (input.phone) properties.phone = input.phone
  if (input.timeline) properties.selling_timeline = input.timeline

  try {
    const existingId = await searchContactByEmail(token, input.email)

    let contactId: string | null = null
    if (existingId) {
      const updateRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ properties }),
      })
      if (updateRes.ok) {
        const data = await updateRes.json() as HubSpotContactResponse
        contactId = data.id
      }
    } else {
      const createRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ properties }),
      })
      if (createRes.ok) {
        const data = await createRes.json() as HubSpotContactResponse
        contactId = data.id
      }
    }

    if (contactId && input.noteHtml) {
      await attachNote(token, contactId, input.noteHtml)
    }
    return contactId
  } catch (err) {
    console.error('[hubspot] upsert failed', err)
    return null
  }
}

export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0] ?? '', lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}
