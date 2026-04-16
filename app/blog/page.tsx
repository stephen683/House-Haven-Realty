import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPosts } from '@/data/blog'

export const metadata: Metadata = {
  title: 'Nashville Real Estate Insights — The House Haven Blog',
  description:
    'Market updates, buyer and seller guides, new construction insights, and Middle Tennessee neighborhood deep dives from the House Haven Realty team.',
}

export default function BlogIndexPage() {
  const posts = getSortedPosts()
  const [featured, ...rest] = posts

  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Blog &middot; {posts.length} articles
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            Insights from the field.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            Real estate writing that actually helps. No AI sludge, no filler — just
            honest takes from a team that does this every day.
          </p>
        </div>
      </section>

      {featured && (
        <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-20">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid lg:grid-cols-2 gap-10 items-center"
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-househaven-surface">
              <Image
                src={featured.heroImage}
                alt={featured.heroCaption}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover group-hover:scale-[1.02] transition duration-500"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                Featured · {featured.category}
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-3 leading-tight group-hover:text-househaven-accent-dark transition">
                {featured.title}
              </h2>
              <p className="mt-4 text-househaven-text-muted text-lg">
                {featured.excerpt}
              </p>
              <p className="mt-6 text-xs text-househaven-text-muted">
                {new Date(featured.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                · {featured.readTimeMinutes} min read
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="bg-househaven-surface py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-lg overflow-hidden bg-white border border-black/5 hover:shadow-xl transition"
              >
                <div className="relative aspect-[16/9] bg-househaven-surface">
                  <Image
                    src={p.heroImage}
                    alt={p.heroCaption}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
                    {p.category}
                  </p>
                  <p className="font-serif text-2xl text-househaven-navy mt-2 leading-tight">
                    {p.title}
                  </p>
                  <p className="text-sm text-househaven-text-muted mt-3">{p.excerpt}</p>
                  <p className="mt-5 text-xs text-househaven-text-muted">
                    {new Date(p.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    · {p.readTimeMinutes} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
