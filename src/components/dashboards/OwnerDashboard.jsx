/**
 * OwnerDashboard — v1 owner portal (presentation only).
 * Static UI structure prepared for future wiring. No backend, no gates.
 */

import ReviewDetectedPropertyPanel from './ReviewDetectedPropertyPanel'
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <BlockShell
        eyebrow="Invited owner"
        title="Review Detected Property"
        description="For owners contacted by RealEstateSniper about a property already detected by our research process."
      >
        <ReviewDetectedPropertyPanel />
      </BlockShell>

      <BlockShell
        eyebrow="Organic owner"
        title="Submit New Property"
        description="For owners who want to submit a property for private review. All submitted properties are reviewed manually before any information is shared with investors."
      >
        <SubmitNewPropertyForm />
      </BlockShell>
    </div>
  )
}
