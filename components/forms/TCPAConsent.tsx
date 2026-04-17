import Link from 'next/link'

interface TCPAConsentProps {
  name?: string
  required?: boolean
  defaultChecked?: boolean
}

export default function TCPAConsent({
  name = 'tcpa_consent',
  required = true,
  defaultChecked = false,
}: TCPAConsentProps) {
  return (
    <label className="flex gap-3 items-start text-xs text-househaven-text-muted leading-relaxed">
      <input
        type="checkbox"
        name={name}
        required={required}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-househaven-navy focus:ring-househaven-navy"
      />
      <span>
        I agree to be contacted by House Haven Realty via call, email, and text. To opt
        out, reply STOP at any time or click the unsubscribe link in any email. Message
        frequency may vary. Message and data rates may apply.{' '}
        <Link href="/privacy" className="underline hover:text-househaven-navy">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  )
}
