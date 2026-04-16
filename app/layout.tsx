import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import SiteFooter from '@/components/compliance/SiteFooter'
import Header from '@/components/layout/Header'
import OrganizationJsonLd from '@/components/seo/OrganizationJsonLd'

const modulusBold = localFont({
  src: '../public/fonts/Modulus-Bold.otf',
  variable: '--font-modulus-bold',
  weight: '700',
  display: 'swap',
})

const modulusRegular = localFont({
  src: '../public/fonts/Modulus_Medium.ttf',
  variable: '--font-modulus',
  weight: '500',
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
    <html lang="en" className={`${modulusRegular.variable} ${modulusBold.variable}`}>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
