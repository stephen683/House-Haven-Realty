'use client'

import { useMemo, useState } from 'react'

interface FieldProps {
  label: string
  suffix?: string
  prefix?: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}

function Field({
  label,
  suffix,
  prefix,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-[0.1em] text-househaven-text-muted mb-1">
        {label}
      </span>
      <div className="flex items-center rounded-lg border border-black/10 bg-white focus-within:ring-2 focus-within:ring-househaven-navy">
        {prefix && (
          <span className="pl-3 text-househaven-text-muted text-sm">{prefix}</span>
        )}
        <input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-3 bg-transparent focus:outline-none"
        />
        {suffix && (
          <span className="pr-3 text-househaven-text-muted text-sm">{suffix}</span>
        )}
      </div>
    </label>
  )
}

function formatCurrency(n: number) {
  if (!Number.isFinite(n) || n <= 0) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function MortgageCalculator() {
  const [price, setPrice] = useState(450000)
  const [downPct, setDownPct] = useState(10)
  const [rate, setRate] = useState(6.5)
  const [years, setYears] = useState(30)
  const [taxRate, setTaxRate] = useState(0.75)
  const [insuranceAnnual, setInsuranceAnnual] = useState(1800)

  const {
    loanAmount,
    monthlyPI,
    monthlyTax,
    monthlyIns,
    monthlyTotal,
  } = useMemo(() => {
    const down = (downPct / 100) * price
    const loan = Math.max(price - down, 0)
    const monthlyRate = rate / 100 / 12
    const n = years * 12
    const pi =
      monthlyRate === 0
        ? loan / n
        : (loan * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
          (Math.pow(1 + monthlyRate, n) - 1)
    const tax = (taxRate / 100) * price / 12
    const ins = insuranceAnnual / 12
    return {
      loanAmount: loan,
      monthlyPI: pi,
      monthlyTax: tax,
      monthlyIns: ins,
      monthlyTotal: pi + tax + ins,
    }
  }, [price, downPct, rate, years, taxRate, insuranceAnnual])

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 lg:p-10 shadow-sm">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Tool
          </p>
          <h2 className="font-serif text-3xl text-househaven-navy mt-1">
            Mortgage calculator
          </h2>
          <p className="text-sm text-househaven-text-muted mt-2 max-w-xl">
            Estimate your monthly principal, interest, taxes, and insurance. Defaults
            reflect current Middle Tennessee averages — edit any field to match your
            scenario.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <Field
            label="Home price"
            prefix="$"
            value={price}
            onChange={setPrice}
            step={1000}
            min={0}
          />
          <Field
            label="Down payment"
            suffix="%"
            value={downPct}
            onChange={setDownPct}
            min={0}
            max={100}
            step={0.5}
          />
          <Field
            label="Interest rate"
            suffix="%"
            value={rate}
            onChange={setRate}
            min={0}
            max={20}
            step={0.125}
          />
          <Field
            label="Term"
            suffix="years"
            value={years}
            onChange={setYears}
            min={5}
            max={40}
          />
          <Field
            label="Property tax"
            suffix="% / yr"
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={5}
            step={0.05}
          />
          <Field
            label="Insurance"
            prefix="$"
            suffix="/ yr"
            value={insuranceAnnual}
            onChange={setInsuranceAnnual}
            step={50}
            min={0}
          />
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-househaven-navy text-white p-6 lg:p-8 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Estimated monthly
          </p>
          <p className="font-serif text-5xl lg:text-6xl text-white mt-2">
            {formatCurrency(monthlyTotal)}
          </p>
          <dl className="mt-6 space-y-2 text-sm text-white/80">
            <div className="flex justify-between">
              <dt>Principal &amp; interest</dt>
              <dd>{formatCurrency(monthlyPI)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Property tax</dt>
              <dd>{formatCurrency(monthlyTax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Homeowners insurance</dt>
              <dd>{formatCurrency(monthlyIns)}</dd>
            </div>
          </dl>
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/60">
            <p>Loan amount: {formatCurrency(loanAmount)}</p>
            <p className="mt-1">
              Estimate only. Actual payment depends on lender fees, HOA, PMI, and
              property-specific insurance quotes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
