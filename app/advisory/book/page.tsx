import type { Metadata } from 'next'
import AdvisoryHero from '@/components/advisory/Hero'
import BookingClient from '@/components/advisory/booking/BookingClient'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'

export const metadata: Metadata = {
  title: 'Book a Decision Brief — HHR Advisory',
  description:
    'Complete the intake and book your one-hour HHR Advisory consult. $200 flat, pre-paid. Written Decision Brief delivered within 48 hours.',
  alternates: { canonical: '/advisory/book' },
  robots: { index: true, follow: true },
}

export default function AdvisoryBookPage() {
  return (
    <main>
      <AdvisoryHero
        eyebrow="Book a Decision Brief"
        headline="Book a Decision Brief."
        lede="One hour on Google Meet, $200 flat, pre-paid. Written Decision Brief delivered within 48 hours of the consult. Tuesday and Thursday slots in Central Time."
      />

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <BookingClient />

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
