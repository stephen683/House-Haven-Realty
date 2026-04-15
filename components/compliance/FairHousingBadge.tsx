// Fair Housing Act — Equal Housing Opportunity logo requirement
export default function FairHousingBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`} aria-label="Equal Housing Opportunity">
      <div className="border-2 border-current p-1 text-center leading-tight font-bold text-[8px]">
        EQUAL<br/>HOUSING<br/>OPPORTUNITY
      </div>
      <span>We are pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation.</span>
    </div>
  )
}
