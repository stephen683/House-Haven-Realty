'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The two client-side halves of the spam guard, as one component so no form
 * can accidentally ship with only one of them.
 *
 * - A honeypot input that is invisible and unreachable to people but present
 *   in the DOM, so automated fillers populate it.
 * - The time the form rendered, which the server compares against submission
 *   time; nothing human completes a form in under a couple of seconds.
 *
 * The field is named `company_website` because a blank-looking "website" field
 * is exactly what a form-filling bot wants to complete. Hidden with
 * position/opacity rather than `type="hidden"` — bots skip hidden inputs, and
 * `display:none` is a well-known tell.
 */
export function useFormLoadedAt() {
  const ref = useRef<number>(Date.now())
  return ref.current
}

export default function SpamGuardFields() {
  const [loadedAt, setLoadedAt] = useState<number | null>(null)
  useEffect(() => setLoadedAt(Date.now()), [])

  return (
    <>
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website (leave blank)</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="formLoadedAt" value={loadedAt ?? ''} readOnly />
    </>
  )
}
