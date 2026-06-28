/**
 * OwnerDashboard — v1 owner portal (presentation only).
 * Static UI structure prepared for future wiring. No backend, no gates.
 */

import SubmitNewPropertyForm from './SubmitNewPropertyForm'

export default function OwnerDashboard() {
  function BlockShell({ eyebrow, title, description, children }) {
    return (
      <div
        style={{
          padding: '22px',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              marginBottom: '10px',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#dbeafe',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            {eyebrow}
          </div>
          <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.35rem' }}>{title}</h3>
          {description ? (
            <p
              style={{
                margin: '10px 0 0',
                color: '#94a3b8',
                lineHeight: 1.55,
                maxWidth: '820px',
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    )
  }

  function StatusPill({ label, value, hint = null }) {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(148, 163, 184, 0.35)',
          background: 'rgba(148, 163, 184, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minHeight: '72px',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.04em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '0.98rem',
            fontWeight: 800,
            color: '#94a3b8',
            lineHeight: 1.4,
            minWidth: 0,
          }}
        >
          {value}
        </span>
        {hint ? (
          <span style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.4 }}>{hint}</span>
        ) : null}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <BlockShell
        eyebrow="Preview"
        title="Owner Portal Preview"
        description="The property review and submission workflow is being finalized. Your owner account is active, but property submission and authorization tools are not available yet."
      />

      <div
        style={{
          display: 'grid',
          gap: '18px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <BlockShell
          eyebrow="Invited owner"
          title="Review Detected Property"
          description="For owners contacted by RealEstateSniper about a property already detected by our research process."
        >
          <StatusPill label="Status" value="Coming soon" />
          <button
            type="button"
            disabled
            style={{
              alignSelf: 'flex-start',
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(148, 163, 184, 0.28)',
              background: 'rgba(148, 163, 184, 0.10)',
              color: '#94a3b8',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'not-allowed',
              opacity: 0.85,
            }}
          >
            Review detected property
          </button>
        </BlockShell>
      </div>

      <BlockShell
        eyebrow="Organic owner"
        title="Submit New Property"
        description="For owners who want to submit a property for private review."
      >
        <SubmitNewPropertyForm />
      </BlockShell>
    </div>
  )
}
