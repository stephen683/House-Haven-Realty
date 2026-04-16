// NashBuilds standalone product layout
// Hides the main site Header/Footer by rendering a full-viewport overlay

export default function NashBuildsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Hide parent Header and Footer for standalone product experience */}
      <style dangerouslySetInnerHTML={{ __html: `
        header.sticky { display: none !important; }
        footer[role="contentinfo"] { display: none !important; }
        #main-content { padding: 0; }
      `}} />
      {children}
    </>
  )
}
