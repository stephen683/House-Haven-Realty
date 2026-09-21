import {
  googleReviews,
  googleReviewsUrl,
  googleWriteReviewUrl,
  starFills,
} from '@/data/reviews'

// Server component — the rating is static data, so it renders in the HTML with
// no client JS and no third-party widget. ROADMAP §13 rules out embedded review
// widgets; this also keeps the brand palette intact, which a Google-hosted
// widget (gold stars, four-colour mark) would not.

function Star({ fill, id }: { fill: number; id: string }) {
  const d =
    'M12 2.6l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.9 6.2 20.4l1.6-6.6L2.6 9.4l6.8-.5L12 2.6z'
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 lg:h-7 lg:w-7 shrink-0" aria-hidden="true">
      {fill > 0 && fill < 1 && (
        <defs>
          <linearGradient id={id}>
            <stop offset={`${fill * 100}%`} stopColor="currentColor" />
            <stop offset={`${fill * 100}%`} stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d={d}
        fill={fill >= 1 ? 'currentColor' : fill <= 0 ? 'none' : `url(#${id})`}
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function GoogleRating() {
  const { rating, count, verifiedOn } = googleReviews
  const fills = starFills(rating)
  const displayRating = Number.isInteger(rating) ? rating.toFixed(1) : String(rating)
  const verified = new Date(`${verifiedOn}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="border border-black/10 bg-white p-8 lg:p-10">
      <p className="text-[10px] uppercase tracking-[0.2em] text-househaven-text-muted">
        Rated on Google
      </p>

      <div
        className="mt-4 flex items-baseline gap-3"
        role="img"
        aria-label={`Rated ${displayRating} out of 5 from ${count} Google reviews`}
      >
        <span className="font-serif text-6xl lg:text-7xl leading-none text-househaven-navy">
          {displayRating}
        </span>
        <span className="text-sm text-househaven-text-muted">out of 5</span>
      </div>

      <div className="mt-4 flex gap-1 text-househaven-navy" aria-hidden="true">
        {fills.map((f, i) => (
          <Star key={i} fill={f} id={`hh-star-${i}`} />
        ))}
      </div>

      <p className="mt-5 text-sm text-househaven-text-muted leading-relaxed">
        <span className="font-semibold text-househaven-navy">{count} Google reviews</span> from
        Nashville buyers and sellers. Verified {verified}.
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <a
          href={googleReviewsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light transition"
        >
          Read the reviews on Google →
        </a>
        <a
          href={googleWriteReviewUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-3 border border-black/15 text-househaven-navy text-sm font-semibold hover:bg-househaven-surface transition"
        >
          Leave a review
        </a>
      </div>
    </div>
  )
}
