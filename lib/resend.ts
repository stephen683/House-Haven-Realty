// Resend email helper. Server-side only.
// When RESEND_API_KEY is unset, logs to console and returns ok — never blocks the
// response path. Real sends kick in the moment the key is configured.

const RESEND_BASE = 'https://api.resend.com/emails'

export interface SendEmailInput {
  from: string
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id: string | null }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.info('[resend] dry-run (no RESEND_API_KEY) →', input.to, '·', input.subject)
    return { ok: true, id: null }
  }
  try {
    const res = await fetch(RESEND_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: input.from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo,
      }),
    })
    if (!res.ok) {
      console.error('[resend] non-OK', res.status, await res.text().catch(() => ''))
      return { ok: false, id: null }
    }
    const data = await res.json() as { id: string }
    return { ok: true, id: data.id }
  } catch (err) {
    console.error('[resend] send failed', err)
    return { ok: false, id: null }
  }
}
