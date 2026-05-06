import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedLearnPosts, type LearnPost } from '@/data/learn'
import {
  LEARN_CATEGORIES,
  LEARN_STAGES,
  getLearnTaxonomy,
  isValidCategory,
  isValidStage,
  type LearnCategory,
  type LearnStage,
} from '@/lib/learn-taxonomy'

export const metadata: Metadata = {
  title: 'Learn — House Haven library',
  description:
    'What we publish: long-form, no listicles, no fluff. Filter by category and stage, or browse the Greatest Hits if you want the eight pieces we hand to inbound consults.',
  alternates: { canonical: '/learn' },
}

interface PageProps {
  searchParams: { category?: string; stage?: string }
}

export default function LearnIndexPage({ searchParams }: PageProps) {
  const categoryParam = isValidCategory(searchParams.category) ? searchParams.category : null
  const stageParam = isValidStage(searchParams.stage) ? searchParams.stage : null

  const allPosts = getSortedLearnPosts()
  const filtered = allPosts.filter((p) => {
    const tax = getLearnTaxonomy(p.slug)
    if (categoryParam && tax.category !== categoryParam) return false
    if (stageParam && tax.stage !== stageParam) return false
    return true
  })

  return (
    <main className="bg-white">
      <Hero filteredCount={filtered.length} totalCount={allPosts.length} />
      <Filters activeCategory={categoryParam} activeStage={stageParam} />
      {filtered.length === 0 ? (
        <EmptyState category={categoryParam} stage={stageParam} />
      ) : (
        <PostsGrid posts={filtered} />
      )}
    </main>
  )
}

function Hero({ filteredCount, totalCount }: { filteredCount: number; totalCount: number }) {
  return (
    <section className="bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          The House Haven library
        </p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
          What we publish.
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-3xl leading-relaxed">
          Long-form, no listicles, no fluff. Pieces are tagged by what they cover and where you
          are in your decision. Browse by category and stage below — or jump to the{' '}
          <Link href="/learn/greatest-hits" className="underline hover:text-white">
            Greatest Hits
          </Link>{' '}
          if you want the curated short list.
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.16em] text-white/50">
          {filteredCount} of {totalCount} articles shown
        </p>
      </div>
    </section>
  )
}

function Filters({
  activeCategory,
  activeStage,
}: {
  activeCategory: LearnCategory | null
  activeStage: LearnStage | null
}) {
  return (
    <section className="border-b border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-5">
        <FilterRow label="Category">
          <FilterPill href="/learn" active={!activeCategory}>
            All
          </FilterPill>
          {LEARN_CATEGORIES.map((c) => (
            <FilterPill
              key={c.slug}
              href={`/learn?category=${c.slug}${activeStage ? `&stage=${activeStage}` : ''}`}
              active={activeCategory === c.slug}
            >
              {c.label}
            </FilterPill>
          ))}
        </FilterRow>
        <FilterRow label="Stage">
          <FilterPill
            href={activeCategory ? `/learn?category=${activeCategory}` : '/learn'}
            active={!activeStage}
          >
            All
          </FilterPill>
          {LEARN_STAGES.map((s) => (
            <FilterPill
              key={s.slug}
              href={`/learn?stage=${s.slug}${activeCategory ? `&category=${activeCategory}` : ''}`}
              active={activeStage === s.slug}
            >
              {s.label}
            </FilterPill>
          ))}
        </FilterRow>
      </div>
    </section>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted shrink-0">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
        active
          ? 'bg-black text-white'
          : 'bg-househaven-surface text-househaven-text hover:bg-househaven-accent/30'
      }`}
    >
      {children}
    </Link>
  )
}

function EmptyState({
  category,
  stage,
}: {
  category: LearnCategory | null
  stage: LearnStage | null
}) {
  const isFsbo = category === 'fsbo'
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Nothing here yet
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-3">
          {isFsbo
            ? 'The FSBO library is in production — first piece coming soon.'
            : 'No articles match this filter yet.'}
        </h2>
        <p className="mt-6 text-base text-househaven-text leading-relaxed">
          {isFsbo
            ? 'In the meantime, the FSBO Sanity-Check Advisory track walks through the same material in one paid hour with a written Brief.'
            : 'Try a different category or stage — or browse all articles.'}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-househaven-navy hover:bg-househaven-surface"
          >
            Browse all articles
          </Link>
          {isFsbo && (
            <Link
              href="/advisory/fsbo"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light"
            >
              See the FSBO Advisory track →
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

function PostsGrid({ posts }: { posts: LearnPost[] }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => {
            const tax = getLearnTaxonomy(p.slug)
            const categoryLabel =
              LEARN_CATEGORIES.find((c) => c.slug === tax.category)?.label ?? p.category
            const stageLabel =
              LEARN_STAGES.find((s) => s.slug === tax.stage)?.label ?? null
            return (
              <Link
                key={p.slug}
                href={`/learn/${p.slug}`}
                className="group flex flex-col rounded-xl border border-black/10 hover:border-black/30 hover:shadow-lg transition overflow-hidden"
              >
                <div className="relative aspect-[16/9] bg-househaven-surface">
                  <Image
                    src={p.heroImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-househaven-text-muted">
                    <span>{categoryLabel}</span>
                    {stageLabel && (
                      <>
                        <span>·</span>
                        <span>{stageLabel}</span>
                      </>
                    )}
                  </div>
                  <p className="font-serif text-xl text-househaven-navy mt-2 leading-snug">
                    {p.title}
                  </p>
                  <p className="mt-3 text-sm text-househaven-text-muted leading-relaxed line-clamp-3">
                    {p.excerpt}
                  </p>
                  <p className="mt-auto pt-4 text-xs text-househaven-text-muted">
                    {p.readTimeMinutes} min read · By{' '}
                    {p.authorSlug
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
