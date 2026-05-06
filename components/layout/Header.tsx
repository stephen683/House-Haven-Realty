'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Phase 3 — five top-level peers. No dropdowns. About / Blog / Contact live in
// the secondary bar on the right (and footer); Buyers / Sellers / Mortgage
// Calculator / Property Management / Market Reports demoted to footer.
const primaryNav = [
  { label: 'Find Homes', href: '/homes-for-sale' },
  { label: 'Communities', href: '/communities' },
  { label: 'Pipeline', href: '/pipeline' },
  { label: 'Advisory', href: '/advisory' },
  { label: 'Home Value', href: '/value' },
]

const secondaryNav = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center"
            aria-label="House Haven Realty home"
          >
            <Image
              src="/images/logo/logo-dark.png"
              alt="House Haven Realty"
              width={200}
              height={56}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-househaven-text hover:text-househaven-navy transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <nav className="hidden lg:flex items-center gap-4 text-xs text-househaven-text-muted" aria-label="Secondary">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-househaven-navy transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a
              data-event="phone_click"
              href="tel:+16156244766"
              className="text-sm font-medium text-househaven-navy hover:text-househaven-accent transition"
            >
              (615) 624-4766
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden p-2 text-househaven-navy"
            onClick={() => setOpen(!open)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/5 bg-white" id="mobile-menu">
          <nav className="px-4 py-4 space-y-1" aria-label="Mobile primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-househaven-text hover:bg-househaven-surface"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-black/5 space-y-1">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-househaven-text-muted hover:bg-househaven-surface"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 mt-3 border-t border-black/5">
              <a
                data-event="phone_click"
                href="tel:+16156244766"
                className="block px-3 py-2 text-sm font-semibold text-househaven-navy"
              >
                (615) 624-4766
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
