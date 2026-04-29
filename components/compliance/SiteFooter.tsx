// LEGALLY REQUIRED — TREC Rule 1260-02-.12
// House Haven Realty firm name and phone must appear on every page.
// Fair Housing Act — Equal Housing Opportunity logo/statement required.
// This component is rendered server-side in the root layout — do not remove.

import Image from 'next/image'
import Link from 'next/link'

const footerNav = {
  Explore: [
    { label: 'Homes for Sale', href: '/homes-for-sale' },
    { label: 'Nashville Pipeline — New Construction', href: '/pipeline' },
    { label: 'Communities', href: '/communities' },
    { label: 'Market Reports', href: '/market-reports' },
    { label: 'Blog', href: '/blog' },
  ],
  Services: [
    { label: 'Buyers', href: '/buyers' },
    { label: 'Sellers', href: '/sellers' },
    { label: "What's My Home Worth?", href: '/home-valuation' },
    { label: 'Property Management', href: '/property-management' },
    { label: 'Mortgage Calculator', href: '/buyers#mortgage-calculator' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Meet the Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
}

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="bg-househaven-navy text-white/90"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            {/* Firm name — TREC 1260-02-.12(5)(a) — must be conspicuous on every page */}
            <Image
              src="/images/logo/logo-light.png"
              alt="House Haven Realty"
              width={200}
              height={56}
              className="h-10 w-auto mb-3"
            />
            <p className="text-sm text-white/85 leading-relaxed mb-4 max-w-xs">
              A small boutique local Nashville real estate brokerage. Our clients are our
              neighbors.
            </p>
            <address className="not-italic text-sm text-white/80 space-y-1">
              <p>5016 Centennial Blvd Suite 200</p>
              <p>Nashville, TN 37209</p>
              <p>
                <a data-event="phone_click" href="tel:+16156244766" className="hover:text-white underline-offset-2 hover:underline">
                  (615) 624-4766
                </a>
              </p>
              <p>
                <a
                  href="mailto:Stephen@househavenrealty.com"
                  className="hover:text-white underline-offset-2 hover:underline"
                >
                  Stephen@househavenrealty.com
                </a>
              </p>
            </address>
            <div className="flex gap-4 mt-5 text-sm">
              <a
                href="https://www.instagram.com/househavenrealty/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/stephen.delahoussaye"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 hover:text-white"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/house-haven-realty-nashville"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {Object.entries(footerNav).map(([section, links]) => (
            <div key={section}>
              <p className="text-sm font-semibold text-white tracking-wide uppercase mb-3">
                {section}
              </p>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/85 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance bar — must show firm name + phone + EHO + TREC disclosure */}
      <div className="border-t border-white/10 bg-househaven-navy-light">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-white/85">
            <div className="flex items-center gap-4">
              <span
                aria-label="Equal Housing Opportunity"
                className="shrink-0 font-bold border border-white/50 px-2 py-1 rounded text-[9px] leading-tight text-center text-white/80"
              >
                EQUAL HOUSING
                <br />
                OPPORTUNITY
              </span>
              <p className="leading-relaxed">
                <span className="font-semibold text-white">House Haven Realty</span> ·{' '}
                <a data-event="phone_click" href="tel:+16156244766" className="hover:text-white">
                  (615) 624-4766
                </a>{' '}
                · 5016 Centennial Blvd Suite 200, Nashville, TN 37209 · Licensed &amp;
                regulated by the Tennessee Real Estate Commission.
              </p>
            </div>
            <p className="lg:text-right text-white/80">
              &copy; {currentYear} House Haven Realty. All rights reserved. ·{' '}
              <Link href="/agents" className="text-white/60 hover:text-white">
                Agent login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
