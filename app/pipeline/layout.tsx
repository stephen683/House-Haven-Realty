// Standalone full-viewport map experience — hide site Header/Footer.

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header.sticky { display: none !important; }
        footer[role="contentinfo"] { display: none !important; }
        #main-content { padding: 0; }
      `}} />
      {children}
    </>
  )
}
