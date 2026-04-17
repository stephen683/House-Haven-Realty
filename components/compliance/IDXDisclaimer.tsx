// NAR IDX policy + 2026 settlement compliance.
export default function IDXDisclaimer() {
  const currentYear = new Date().getFullYear()
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600 space-y-2">
      <p>
        Listings displayed are provided courtesy of the Realtracs MLS. Information is
        deemed reliable but not guaranteed. © {currentYear} Realtracs, Inc. All rights
        reserved. Some or all listings displayed may not belong to House Haven Realty.
        Data last updated: <span suppressHydrationWarning>{new Date().toLocaleDateString()}</span>.
      </p>
      <p className="font-semibold text-gray-800">
        Broker commissions are not set by law and are fully negotiable.
      </p>
    </div>
  )
}
