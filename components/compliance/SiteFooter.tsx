// LEGALLY REQUIRED — TREC Rule 1260-02-.12
// House Haven Realty firm name and phone must appear on every page
// This component is rendered server-side in the root layout — do not remove

import Link from 'next/link'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-househaven-navy text-white" role="contentinfo">
      {/* Compliance Bar — TREC 1260-02-.12(5)(a) */}
      <div className="border-t border-white/10 bg-househaven-navy-light">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
            <div className="flex items-center gap-4">
              {/* Equal Housing Opportunity — Fair Housing Act */}
              <span className="text-xs font-bold border border-white/40 px-2 py-1 rounded">
                EQUAL HOUSING<br />OPPORTUNITY
              </span>
              <div>
                <p className="font-semibold text-white">House Haven Realty</p>
                <p>(615) 624-4766 | Stephen@househavenrealty.com</p>
                <p>5016 Centennial Blvd Suite 200, Nashville, TN 37209</p>
              </div>
            </div>
            <div className="text-center md:text-right text-xs text-white/50">
              <p>© {currentYear} House Haven Realty. All rights reserved.</p>
              <p className="mt-1">
                Tennessee Real Estate Firm — Licensed &amp; Regulated by TREC
              </p>
              <div className="flex gap-3 mt-2 justify-center md:justify-end">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="/contact" className="hover:text-white transition">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
