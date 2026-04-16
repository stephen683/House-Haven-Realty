import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { blogPosts, blogPostBySlug } from '@/data/blog'
import { teamMembers } from '@/data/team'
import { communityBySlug } from '@/data/communities'

interface BlogPostPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = blogPostBySlug[params.slug]
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
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

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPostBySlug[params.slug]
  if (!post) notFound()

  const author = teamMembers.find((m) => m.slug === post.authorSlug)
  const relatedCommunities = (post.relatedCommunitySlugs || [])
    .map((slug) => communityBySlug[slug])
    .filter(Boolean)
  const relatedPosts = (post.relatedPostSlugs || [])
    .map((slug) => blogPostBySlug[slug])
    .filter(Boolean)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.heroImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          url: `https://househavenrealty.com/team/${author.slug}`,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'House Haven Realty',
      logo: {
        '@type': 'ImageObject',
        url: 'https://househavenrealty.com/images/logo-dark.svg',
      },
    },
    mainEntityOfPage: `https://househavenrealty.com/blog/${post.slug}`,
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-3xl mx-auto px-4 lg:px-6 pt-8 text-xs text-househaven-text-muted"
      >
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-househaven-navy">
              Home
            </Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/blog" className="hover:text-househaven-navy">
              Blog
            </Link>
          </li>
          <li>›</li>
          <li className="text-househaven-navy truncate max-w-xs">{post.category}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 lg:px-6 pt-8 pb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
          {post.category}
        </p>
        <h1 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-3 leading-[1.1]">
          {post.title}
        </h1>
        <p className="mt-6 text-lg text-househaven-text-muted">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-househaven-text-muted">
          {author && (
            <span>
              By{' '}
              <Link
                href={`/team/${author.slug}`}
                className="text-househaven-navy hover:text-househaven-accent"
              >
                {author.name}
              </Link>
            </span>
          )}
          <span>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>· {post.readTimeMinutes} min read</span>
        </div>
      </header>

      {/* Hero image */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <figure>
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-househaven-surface">
            <Image
              src={post.heroImage}
              alt={post.heroCaption}
              fill
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <figcaption className="text-xs text-househaven-text-muted mt-3 text-center">
            {post.heroCaption}
          </figcaption>
        </figure>
      </div>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-16 space-y-12">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="font-serif text-3xl text-househaven-navy mb-4">
                {section.heading}
              </h2>
            )}
            <div className="space-y-5 text-lg leading-relaxed text-househaven-text">
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {section.callout && (
              <aside className="mt-6 rounded-2xl border border-househaven-accent/30 bg-househaven-surface p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                  {section.callout.title}
                </p>
                <p className="text-househaven-text mt-2 leading-relaxed">
                  {section.callout.body}
                </p>
              </aside>
            )}
          </section>
        ))}
      </article>

      {/* Author card */}
      {author && (
        <section className="max-w-3xl mx-auto px-4 lg:px-6 pb-16">
          <div className="rounded-3xl border border-black/5 bg-househaven-surface p-6 lg:p-8 flex gap-6 items-start">
            <Link
              href={`/team/${author.slug}`}
              className="relative h-20 w-20 lg:h-24 lg:w-24 rounded-2xl overflow-hidden shrink-0 bg-white"
            >
              <Image
                src={author.headshotUrl}
                alt={`${author.name}, ${author.title} at House Haven Realty`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                Written by
              </p>
              <p className="font-serif text-2xl text-househaven-navy mt-1">
                {author.name}
              </p>
              <p className="text-xs text-househaven-text-muted">
                {author.title} · House Haven Realty
              </p>
              <p className="text-sm text-househaven-text mt-3">{author.bio}</p>
              <Link
                href={`/team/${author.slug}`}
                className="inline-flex items-center mt-4 text-sm font-semibold text-househaven-navy hover:text-househaven-accent"
              >
                View profile →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related communities */}
      {relatedCommunities.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 lg:px-6 pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent mb-4">
            Communities mentioned
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {relatedCommunities.map((c) => (
              <Link
                key={c.slug}
                href={`/communities/${c.slug}`}
                className="block rounded-xl border border-black/5 bg-white p-4 hover:bg-househaven-surface transition"
              >
                <p className="font-serif text-lg text-househaven-navy">{c.name}</p>
                <p className="text-xs text-househaven-text-muted mt-1">
                  {c.county} County
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-househaven-surface py-16">
          <div className="max-w-5xl mx-auto px-4 lg:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent mb-4">
              Keep reading
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-black/5 hover:shadow-xl transition"
                >
                  <div className="relative aspect-[16/9] bg-househaven-surface">
                    <Image
                      src={p.heroImage}
                      alt={p.heroCaption}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                      {p.category}
                    </p>
                    <p className="font-serif text-xl text-househaven-navy mt-2 leading-tight">
                      {p.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-househaven-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Let&rsquo;s talk
          </p>
          <h2 className="font-serif text-4xl text-white mt-2">
            Questions we didn&rsquo;t answer?
          </h2>
          <p className="text-white/70 mt-3">
            Reply to any of our posts or send us a note. Real humans read every message.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center mt-8 px-7 py-4 rounded-full bg-househaven-accent text-househaven-navy font-semibold hover:bg-white transition"
          >
            Contact the team
          </Link>
        </div>
      </section>
    </main>
  )
}
