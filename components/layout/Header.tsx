'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const primaryNav = [
  {
    label: 'Find Homes',
    href: '/homes-for-sale',
    children: [
      { label: 'Property Search', href: '/homes-for-sale' },
      { label: 'New Construction Map', href: '/new-construction' },
      { label: 'Market Reports', href: '/market-reports' },
    ],
  },
  { label: 'Communities', href: '/communities' },
  {
    label: 'Buyers',
    href: '/buyers',
    children: [
      { label: 'The Buying Process', href: '/buyers' },
      { label: 'Mortgage Calculator', href: '/buyers#mortgage-calculator' },
    ],
  },
  {
    label: 'Sellers',
    href: '/sellers',
    children: [
      { label: 'Selling Your Home', href: '/sellers' },
      { label: "What's My Home Worth?", href: '/home-valuation' },
      { label: 'Property Management', href: '/property-management' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about' },
      { label: 'Meet the Team', href: '/team' },
    ],
  },
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
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="text-sm font-medium text-househaven-text hover:text-househaven-navy transition"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="absolute left-0 top-full pt-3 hidden group-hover:block group-focus-within:block">
                    <div className="bg-white rounded-lg shadow-xl border border-black/5 min-w-[220px] py-2" role="menu">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          role="menuitem"
                          className="block px-4 py-2 text-sm text-househaven-text hover:bg-househaven-surface hover:text-househaven-navy"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              data-event="phone_click" href="tel:+16156244766"
              className="text-sm font-medium text-househaven-navy hover:text-househaven-accent transition"
            >
              (615) 624-4766
            </a>
            <Link
              href="/home-valuation"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-househaven-navy text-white text-sm font-medium hover:bg-househaven-navy-light transition"
            >
              Home Value
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className="lg:hidden p-2 text-househaven-navy"
            onClick={() => setOpen(!open)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
          <nav className="px-4 py-4 space-y-1" aria-label="Mobile">
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
            <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between">
              <a
                data-event="phone_click" href="tel:+16156244766"
                className="text-sm font-semibold text-househaven-navy"
              >
                (615) 624-4766
              </a>
              <Link
                href="/home-valuation"
                onClick={() => setOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-househaven-navy text-white text-sm font-medium"
              >
                Home Value
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
