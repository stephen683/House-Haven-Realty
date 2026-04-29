import { NextRequest, NextResponse } from 'next/server'
import { isAgentAuthed } from '@/lib/agent-auth'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const SIDES = ['listing', 'buyer', 'dual'] as const
const COMMISSION_TYPES = ['percent', 'flat'] as const

interface Payload {
  agent_name?: string
  agent_email?: string
  side?: string
  property_address?: string
  mls_id?: string
  buyer_names?: string
  seller_names?: string
  contract_price?: string
  earnest_money?: string
  binding_date?: string
  close_date?: string
  commission_type?: string
  commission_value?: string
  our_split?: string
  title_company?: string
  lender?: string
  inspection_deadline?: string
  financing_deadline?: string
  appraisal_deadline?: string
  notes?: string
}

function s(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length ? t : null
}

function n(v: unknown): number | null {
  const t = typeof v === 'string' ? v.trim() : ''
  if (!t) return null
  const num = Number(t)
  return Number.isFinite(num) ? num : null
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fmtMoney(value: number | null) {
  if (value == null) return '—'
  return `$${value.toLocaleString('en-US')}`
}

function fmtCommission(type: string | null, value: number | null) {
  if (value == null || !type) return '—'
  if (type === 'percent') return `${value}%`
  return fmtMoney(value)
}

export async function POST(req: NextRequest) {
  if (!(await isAgentAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Payload
  try {
    body = (await req.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const agent_name = s(body.agent_name)
  const agent_email = s(body.agent_email)
  const side = s(body.side)
  const property_address = s(body.property_address)
  const contract_price = n(body.contract_price)
  const binding_date = s(body.binding_date)
  const close_date = s(body.close_date)
  const commission_type = s(body.commission_type)
  const commission_value = n(body.commission_value)

  const missing: string[] = []
  if (!agent_name) missing.push('agent name')
  if (!agent_email) missing.push('agent email')
  if (!side || !SIDES.includes(side as (typeof SIDES)[number])) missing.push('side')
  if (!property_address) missing.push('property address')
  if (contract_price == null) missing.push('contract price')
  if (!binding_date) missing.push('binding date')
  if (!close_date) missing.push('close date')
  if (
    !commission_type ||
    !COMMISSION_TYPES.includes(commission_type as (typeof COMMISSION_TYPES)[number])
  ) {
    missing.push('commission type')
  }
  if (commission_value == null) missing.push('commission value')

  if (missing.length) {
    return NextResponse.json({ error: `Missing: ${missing.join(', ')}` }, { status: 400 })
  }
  if (!isValidEmail(agent_email!)) {
    return NextResponse.json({ error: 'Invalid agent email' }, { status: 400 })
  }

  const row = {
    agent_name,
    agent_email,
    side,
    property_address,
    mls_id: s(body.mls_id),
    buyer_names: s(body.buyer_names),
    seller_names: s(body.seller_names),
    contract_price,
    earnest_money: n(body.earnest_money),
    binding_date,
    close_date,
    commission_type,
    commission_value,
    our_split: s(body.our_split),
    title_company: s(body.title_company),
    lender: s(body.lender),
    inspection_deadline: s(body.inspection_deadline),
    financing_deadline: s(body.financing_deadline),
    appraisal_deadline: s(body.appraisal_deadline),
    notes: s(body.notes),
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('contract_submissions').insert(row)
    if (error) console.error('[agents/contract] supabase insert failed', error.message)
  } catch (err) {
    console.error('[agents/contract] supabase client failed', err)
  }

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const lines = [
      `Submitted by: ${row.agent_name} <${row.agent_email}>`,
      ``,
      `Property: ${row.property_address}`,
      row.mls_id ? `MLS #: ${row.mls_id}` : null,
      `Side: ${row.side}`,
      row.buyer_names ? `Buyer(s): ${row.buyer_names}` : null,
      row.seller_names ? `Seller(s): ${row.seller_names}` : null,
      ``,
      `Contract price: ${fmtMoney(row.contract_price)}`,
      `Earnest money: ${fmtMoney(row.earnest_money)}`,
      `Commission: ${fmtCommission(row.commission_type, row.commission_value)}`,
      row.our_split ? `Split: ${row.our_split}` : null,
      ``,
      `Binding date: ${row.binding_date}`,
      `Close date: ${row.close_date}`,
      row.inspection_deadline ? `Inspection deadline: ${row.inspection_deadline}` : null,
      row.financing_deadline ? `Financing deadline: ${row.financing_deadline}` : null,
      row.appraisal_deadline ? `Appraisal deadline: ${row.appraisal_deadline}` : null,
      ``,
      row.title_company ? `Title: ${row.title_company}` : null,
      row.lender ? `Lender: ${row.lender}` : null,
      row.notes ? `\nNotes:\n${row.notes}` : null,
      ``,
      `Documents: agent uploads to Dolly separately.`,
    ]
      .filter((l) => l !== null)
      .join('\n')

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'House Haven Web <notifications@househavenrealty.com>',
          to: ['stephen@househavenrealty.com', 'maria@househavenrealty.com'],
          cc: [row.agent_email],
          reply_to: row.agent_email,
          subject: `New contract — ${row.property_address} — ${fmtMoney(row.contract_price)}`,
          text: lines,
        }),
      })
    } catch (err) {
      console.error('[agents/contract] resend notify failed', err)
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
