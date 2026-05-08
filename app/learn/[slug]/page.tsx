import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { learnPosts, learnPostBySlug } from '@/data/learn'
import { teamMembers } from '@/data/team'
import { communityBySlug } from '@/data/communities'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AdvisoryCTA from '@/components/advisory/AdvisoryCTA'
import { getLearnTaxonomy, LEARN_CATEGORIES, LEARN_STAGES } from '@/lib/learn-taxonomy'

interface PostPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return learnPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = learnPostBySlug[params.slug]
  if (!post) return { title: 'Article not found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/learn/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.heroImage }],
    },
  }
}

export default function LearnPostPage({ params }: PostPageProps) {
  const post = learnPostBySlug[params.slug]
  if (!post) notFound()

  const tax = getLearnTaxonomy(post.slug)
  const categoryLabel =
    LEARN_CATEGORIES.find((c) => c.slug === tax.category)?.label ?? post.category
  const stageLabel = LEARN_STAGES.find((s) => s.slug === tax.stage)?.label ?? null
  const author = teamMembers.find((m) => m.slug === post.authorSlug)

  const relatedPosts = (post.relatedPostSlugs ?? [])
    .map((s) => learnPostBySlug[s])
    .filter(Boolean)
    .slice(0, 3)
  const relatedCommunities = (post.relatedCommunitySlugs ?? [])
    .map((s) => communityBySlug[s])
    .filter(Boolean)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: author
      ? { '@type': 'Person', name: author.name, jobTitle: author.title }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'House Haven Realty',
      url: 'https://househavenrealty.com',
    },
    mainEntityOfPage: `https://househavenrealty.com/learn/${post.slug}`,
    image: post.heroImage,
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-8">
        <Breadcrumbs
          items={[
            { label: 'Learn', href: '/learn' },
            { label: categoryLabel, href: `/learn?category=${tax.category}` },
            { label: post.title, href: `/learn/${post.slug}` },
          ]}
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-househaven-text-muted">
          <span>{categoryLabel}</span>
          {stageLabel && (
            <>
              <span>·</span>
              <span>{stageLabel}</span>
            </>
          )}
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-househaven-navy mt-3 leading-[1.05]">
          {post.title}
        </h1>

        <p className="mt-6 text-lg text-househaven-text leading-relaxed max-w-3xl">
          {post.excerpt}
        </p>

        {author && (
          <ByLine
            name={author.name}
            title={author.title}
            slug={author.slug}
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
            readTimeMinutes={post.readTimeMinutes}
          />
        )}

        <div className="relative aspect-[16/9] mt-10 rounded-xl overflow-hidden bg-househaven-surface">
          <Image
            src={post.heroImage}
            alt={post.heroCaption || ''}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
        </div>
        {post.heroCaption && (
          <p className="mt-3 text-xs text-househaven-text-muted italic">{post.heroCaption}</p>
        )}

        <div className="mt-12 space-y-8 max-w-3xl">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-serif text-2xl lg:text-3xl text-househaven-navy leading-snug">
                  {section.heading}
                </h2>
              )}
              <div className={`space-y-4 ${section.heading ? 'mt-4' : ''}`}>
                {section.paragraphs.map((p, pi) => (
                  <p key={pi} className="text-base text-househaven-text leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {section.callout && (
                <aside className="mt-6 rounded-lg border-l-4 border-househaven-navy bg-househaven-surface p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                    {section.callout.title}
                  </p>
                  <p className="mt-2 text-sm text-househaven-text leading-relaxed">
                    {section.callout.body}
                  </p>
                </aside>
              )}
            </section>
          ))}
        </div>

        {/* Contextual Advisory CTA — every learn article surfaces it */}
        <div className="mt-16 max-w-3xl">
          <AdvisoryCTA />
        </div>

        {/* Author bottom byline */}
        {author && (
          <div className="mt-16 max-w-3xl rounded-xl border border-black/10 bg-househaven-surface p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
              By the author
            </p>
            <p className="font-serif text-xl text-househaven-navy mt-2">{author.name}</p>
            <p className="text-sm text-househaven-text-muted">
              {author.title}, House Haven Realty
            </p>
            <p className="mt-3 text-sm text-househaven-text leading-relaxed">{author.bio}</p>
          </div>
        )}

        {/* Related */}
        {(relatedPosts.length > 0 || relatedCommunities.length > 0) && (
          <div className="mt-16 max-w-5xl">
            {relatedPosts.length > 0 && (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                  Keep reading
                </p>
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/learn/${rp.slug}`}
                      className="group rounded-xl border border-black/10 hover:border-black/30 hover:shadow-lg transition p-4"
                    >
                      <p className="font-serif text-base text-househaven-navy leading-snug">
                        {rp.title}
                      </p>
                      <span className="mt-3 inline-flex text-xs font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                        Read →
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {relatedCommunities.length > 0 && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
                  Related neighborhoods
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {relatedCommunities.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/communities/${c.slug}`}
                      className="px-4 py-2 rounded-lg border border-black/10 text-sm text-househaven-navy hover:bg-househaven-surface"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </main>
  )
}

function ByLine({
  name,
  title,
  slug,
  publishedAt,
  updatedAt,
  readTimeMinutes,
}: {
  name: string
  title: string
  slug: string
  publishedAt: string
  updatedAt: string
  readTimeMinutes: number
}) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-househaven-text-muted">
      <Link href={`/team/${slug}`} className="font-semibold text-househaven-navy hover:underline">
        By {name}
      </Link>
      <span className="text-househaven-text-muted">{title}, House Haven Realty</span>
      <span>·</span>
      <span>{readTimeMinutes} min read</span>
      <span>·</span>
      <span>
        Published {fmt(publishedAt)}
        {updatedAt && updatedAt !== publishedAt ? ` · Updated ${fmt(updatedAt)}` : ''}
      </span>
    </div>
  )
}
