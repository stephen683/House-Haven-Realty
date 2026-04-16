'use client'

import { useState } from 'react'

const categories = [
  {
    title: '8 weeks before moving',
    items: [
      'Set a budget for the move — DIY, movers, or hybrid',
      'Research and get quotes from at least 3 moving companies',
      'Start decluttering room by room — donate, sell, or toss',
      'Notify your landlord if renting (check lease for required notice)',
      'Begin collecting packing supplies — boxes, tape, markers',
      'Create a folder for all moving-related documents and receipts',
    ],
  },
  {
    title: '4 weeks before moving',
    items: [
      'Forward mail with USPS (schedule start date)',
      'Notify employer, schools, and medical providers of address change',
      'Transfer or set up utilities at new home (electric, gas, water, internet)',
      'Schedule homeowner\'s insurance to start on closing day',
      'Start packing non-essential rooms (guest room, storage, seasonal)',
      'Confirm moving company reservation or truck rental',
    ],
  },
  {
    title: '2 weeks before moving',
    items: [
      'Update address with banks, credit cards, subscriptions',
      'Update driver\'s license and vehicle registration (TN requires 30 days)',
      'Register to vote at new address',
      'Pack most rooms, label every box with room and contents',
      'Arrange pet/child care for moving day',
      'Confirm final walkthrough date with your House Haven agent',
    ],
  },
  {
    title: 'Moving week',
    items: [
      'Final walkthrough of new home with your agent',
      'Confirm closing time, location, and what to bring (ID, cashier\'s check)',
      'Pack a "first night" box — toiletries, sheets, chargers, snacks, coffee',
      'Defrost and clean refrigerator',
      'Take photos of empty old home for security deposit (if renting)',
      'Charge all devices and download offline maps to new area',
    ],
  },
  {
    title: 'After you move in',
    items: [
      'Change locks or rekey all exterior doors',
      'Test smoke detectors and carbon monoxide alarms',
      'Locate water shut-off valve, breaker panel, and gas shut-off',
      'Introduce yourself to neighbors',
      'Register for trash/recycling pickup in your municipality',
      'Schedule a "house warming" walkthrough with your agent for any warranty items',
    ],
  },
]

export default function MovingChecklist() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Free resource
          </p>
          <h2 className="font-serif text-3xl text-househaven-navy mt-1">
            Nashville moving checklist
          </h2>
        </div>
      </div>
      {categories.map((cat, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={cat.title}
            className="rounded-2xl border border-black/5 bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-househaven-surface/50 transition"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg text-househaven-navy">
                {cat.title}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-househaven-text-muted transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="px-5 pb-5">
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-househaven-text">
                      <span className="shrink-0 mt-0.5 h-5 w-5 rounded border border-black/10 flex items-center justify-center text-househaven-text-muted text-xs">
                        &#x2610;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
