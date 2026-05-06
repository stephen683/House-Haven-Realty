import type { Metadata } from 'next'
import Link from 'next/link'
import { learnPostBySlug } from '@/data/learn'
import { GREATEST_HITS, getLearnTaxonomy, LEARN_CATEGORIES } from '@/lib/learn-taxonomy'

export const metadata: Metadata = {
  title: 'Greatest Hits — House Haven library',
  description:
    'The eight to twelve pieces we hand to inbound consults. Curated by reader job-to-be-done — find what you need without scrolling the full library.',
  alternates: { canonical: '/learn/greatest-hits' },
}

export default function GreatestHitsPage() {
  const entries = GREATEST_HITS.map((entry) => ({
    entry,
    post: learnPostBySlug[entry.slug] ?? null,
  })).filter((e) => e.post !== null) as Array<{
    entry: { slug: string; jobToBeDone: string }
    post: NonNullable<ReturnType<typeof getPost>>
  }>

  return (
    <main className="bg-white">
      <section className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Curated</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
            Greatest Hits
          </h1>
          <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-3xl leading-relaxed">
            The eight to twelve pieces Stephen hands to inbound Advisory leads. Curated by
            reader job-to-be-done — find the one that matches where you are.
          </p>
        </div>
      </section>

      {entries.length === 0 ? (
        <section className="py-24 lg:py-32">
          <div className="max-w-2xl mx-auto px-4 lg:px-6 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              In curation
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-3">
              The Greatest Hits list is being curated.
            </h2>
            <p className="mt-6 text-base text-househaven-text leading-relaxed">
              Stephen is picking the eight to twelve pieces and writing one sentence for each
              about who that piece is for. Until then, the full library is browsable by
              category and stage.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center mt-8 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light"
            >
              Browse the library →
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <ol className="space-y-6">
              {entries.map(({ entry, post }, i) => {
                const tax = getLearnTaxonomy(post.slug)
                const categoryLabel =
                  LEARN_CATEGORIES.find((c) => c.slug === tax.category)?.label ?? post.category
                return (
                  <li
                    key={entry.slug}
                    className="rounded-xl border border-black/10 hover:border-black/30 hover:shadow-lg transition p-6 lg:p-7"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-3xl text-househaven-text-muted shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                          {categoryLabel} · For: {entry.jobToBeDone}
                        </p>
                        <Link
                          href={`/learn/${post.slug}`}
                          className="block font-serif text-xl lg:text-2xl text-househaven-navy mt-2 hover:underline leading-snug"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-3 text-sm text-househaven-text-muted leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      )}
    </main>
  )
}

function getPost(slug: string) {
  return learnPostBySlug[slug]
}
