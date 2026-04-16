import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://househavenrealty.com${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`text-xs text-househaven-text-muted ${className}`}
      >
        <ol className="flex flex-wrap gap-1.5 items-center">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="h-3 w-3 text-househaven-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-househaven-navy transition"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-househaven-navy font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
