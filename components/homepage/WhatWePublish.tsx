import Link from 'next/link'
import { blogPosts } from '@/data/blog'

// "Learn" preview on the homepage. Pulls 3 most recent published posts from
// data/blog.ts. Phase 4 will move this content under /learn with category
// taxonomy + the Greatest Hits curation page; Phase 3 ships against /blog
// to avoid breaking existing URLs before Phase 4 redirect lands.
//
// Frame is "what we publish" — never "blog" — per voice rules.

export default function WhatWePublish() {
  const recent = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)

  if (recent.length === 0) return null

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
              What we publish
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">
              Long-form, no listicles, no fluff.
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-househaven-navy hover:underline"
          >
            Browse the library →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recent.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-black/10 hover:border-black/30 hover:shadow-lg transition p-6"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                {post.category}
              </p>
              <p className="font-serif text-xl text-househaven-navy mt-2 leading-snug">
                {post.title}
              </p>
              <p className="mt-3 text-sm text-househaven-text-muted leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <span className="mt-auto pt-5 text-sm font-semibold text-househaven-navy group-hover:translate-x-1 transition">
                Read →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
