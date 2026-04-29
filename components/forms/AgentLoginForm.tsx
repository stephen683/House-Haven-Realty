'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/agents/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('Incorrect password.')
        setSubmitting(false)
        return
      }
      router.push('/agents/contract')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="agent-password" className="block text-sm font-medium text-househaven-text mb-1">
          Password
        </label>
        <input
          id="agent-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-househaven-navy"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !password}
        className="w-full inline-flex items-center justify-center px-7 py-4 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition disabled:opacity-60"
      >
        {submitting ? 'Checking…' : 'Continue'}
      </button>
    </form>
  )
}
