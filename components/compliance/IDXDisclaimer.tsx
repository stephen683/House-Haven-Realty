// NAR IDX Policy 7.58 — Required on every page displaying MLS listings
export default function IDXDisclaimer() {
  const currentYear = new Date().getFullYear()
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
      <p>
        Listings marked with the Realtracs logo are provided courtesy of the Realtracs MLS.
        Information is deemed reliable but not guaranteed.
        © {currentYear} Realtracs, Inc. All rights reserved.
        Some or all listings displayed may not belong to House Haven Realty.
        Data last updated: <span suppressHydrationWarning>{new Date().toLocaleDateString()}</span>
      </p>
    </div>
  )
}
