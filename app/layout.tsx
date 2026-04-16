import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteFooter from '@/components/compliance/SiteFooter'
import Header from '@/components/layout/Header'
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'House Haven Realty | Nashville TN Real Estate',
    template: '%s | House Haven Realty',
  },
  description:
    'House Haven Realty — Nashville\'s boutique real estate brokerage. Find homes for sale across Middle Tennessee. Call (615) 624-4766.',
  metadataBase: new URL('https://househavenrealty.com'),
  openGraph: {
    siteName: 'House Haven Realty',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans bg-white text-househaven-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-househaven-navy focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <OrganizationJsonLd />
      </body>
    </html>
  )
}
