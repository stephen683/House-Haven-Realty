import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import SiteFooter from '@/components/compliance/SiteFooter'

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
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
