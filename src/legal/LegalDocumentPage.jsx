import LegalDocumentLayout from './LegalDocumentLayout'

function LegalDocumentPage({ page }) {
  if (!page) return null

  return (
    <LegalDocumentLayout title={page.title} subtitle={page.subtitle}>
      <div
        style={{
          padding: '28px 24px',
          borderRadius: '16px',
          border: '1px dashed rgba(148, 163, 184, 0.35)',
          background: 'rgba(148, 163, 184, 0.06)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: '#e2e8f0',
            fontWeight: 800,
            fontSize: '1.05rem',
            marginBottom: '8px',
          }}
        >
          Under development
        </div>
        <p
          style={{
            margin: 0,
            color: '#94a3b8',
            lineHeight: 1.6,
            fontSize: '0.95rem',
            maxWidth: '520px',
            marginInline: 'auto',
          }}
        >
          The full text for this document will be published here. This page is
          reserved for the upcoming legal content.
        </p>
      </div>
    </LegalDocumentLayout>
  )
}

export default LegalDocumentPage
