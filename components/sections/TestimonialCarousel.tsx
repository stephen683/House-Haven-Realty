'use client'

import { useEffect, useState } from 'react'
import { testimonials } from '@/data/testimonials'

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  const t = testimonials[index]

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div
        key={index}
        className="min-h-[200px] transition-opacity duration-500"
      >
        <svg
          aria-hidden
          className="mx-auto h-8 w-8 text-househaven-accent mb-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M9.17 5A5.17 5.17 0 004 10.17V19h7v-8H6.83A2.33 2.33 0 019.17 7.67V5zm10 0a5.17 5.17 0 00-5.17 5.17V19h7v-8h-4.17A2.33 2.33 0 0119.17 7.67V5z" />
        </svg>
        <blockquote className="font-serif text-xl lg:text-2xl text-househaven-text leading-relaxed italic">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <p className="mt-6 text-sm uppercase tracking-[0.18em] text-househaven-text-muted">
          — {t.author}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-lg transition-all ${
              i === index ? 'w-8 bg-househaven-navy' : 'w-2 bg-househaven-text-muted/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
