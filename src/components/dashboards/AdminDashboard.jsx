/**
 * AdminDashboard — Admin 2.0 operations preview.
 * Presentation-only console. No backend wiring, no live actions.
 */

import {
  PlatformSnapshot,
  BusinessOverview,
  CriticalAlerts,
  UserDirectory,
  MarketplaceOperations,
  OwnerReviewQueue,
  AuditSecurityBlackBox,
} from '../admin'

export default function AdminDashboard({
  platformSnapshot = null,
  businessOverview = null,
  criticalAlerts = null,
  userDirectory = null,
  marketplaceOperations = null,
  ownerReviewQueue = null,
  auditSecurity = null,
}) {
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

  function PreviewBadge({ label = 'Preview' }) {
    return (
      <span
        style={{
          flexShrink: 0,
          padding: '6px 10px',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          border: '1px solid rgba(148, 163, 184, 0.30)',
          background: 'rgba(148, 163, 184, 0.10)',
        }}
      >
        {label}
      </span>
    )
  }

  function StatusPill({ label, value, tone = 'neutral', hint = null }) {
    const tones = {
      neutral: {
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        color: '#e2e8f0',
      },
      warn: {
        border: '1px solid rgba(250, 204, 21, 0.35)',
        background: 'rgba(250, 204, 21, 0.10)',
        color: '#fde68a',
      },
      danger: {
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(239, 68, 68, 0.10)',
        color: '#fecaca',
      },
      muted: {
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background: 'rgba(148, 163, 184, 0.08)',
        color: '#94a3b8',
      },
      premium: {
        border: '1px solid rgba(249, 115, 22, 0.35)',
        background: 'rgba(249, 115, 22, 0.12)',
        color: '#fdba74',
      },
      diamond: {
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(239, 68, 68, 0.10)',
        color: '#fecaca',
      },
      admin: {
        border: '1px solid rgba(96, 165, 250, 0.35)',
        background: 'rgba(96, 165, 250, 0.12)',
        color: '#93c5fd',
      },
    }

    const style = tones[tone] || tones.neutral

    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          border: style.border,
          background: style.background,
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
            color: style.color,
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

  function PreviewRow({ title, body }) {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(148, 163, 184, 0.22)',
          background: 'rgba(148, 163, 184, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{title}</div>
          <div style={{ color: '#cbd5e1', lineHeight: 1.55, fontSize: '0.94rem' }}>{body}</div>
        </div>
        <PreviewBadge label="Not connected yet" />
      </div>
    )
  }

  function DisabledAction({ label }) {
    return (
      <button
        type="button"
        disabled
        title="Preview only — not connected yet"
        style={{
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.25)',
          background: 'rgba(148, 163, 184, 0.08)',
          color: '#64748b',
          fontWeight: 700,
          fontSize: '0.86rem',
          cursor: 'not-allowed',
          opacity: 0.72,
        }}
      >
        {label}
      </button>
    )
  }

  const pillGrid = {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  }

  const previewNoticeStyle = {
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px dashed rgba(148, 163, 184, 0.35)',
    background: 'rgba(148, 163, 184, 0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  }

  const queueCardStyle = {
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(8, 12, 20, 0.55)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  }

  const queueFieldGrid = {
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  }

  const queueFieldStyle = {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
  }

  const queueLabelStyle = {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: '4px',
  }

  const queueValueStyle = {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#94a3b8',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PlatformSnapshot platformSnapshot={platformSnapshot} />

      <BusinessOverview businessOverview={businessOverview} />

      <CriticalAlerts criticalAlerts={criticalAlerts} />

      <UserDirectory userDirectory={userDirectory} />

      <MarketplaceOperations marketplaceOperations={marketplaceOperations} />

      <OwnerReviewQueue ownerReviewQueue={ownerReviewQueue} />

      <AuditSecurityBlackBox auditSecurity={auditSecurity} />

      {/* 5. System Health */}
      <BlockShell
        eyebrow="Health"
        title="System Health"
        description="Infrastructure and integration status. All channels are preview placeholders until monitoring is wired."
      >
        <div style={pillGrid}>
          <StatusPill label="Stripe" value="Preview" tone="muted" hint="Payments and billing API." />
          <StatusPill label="Supabase" value="Preview" tone="muted" hint="Auth, database, and storage." />
          <StatusPill
            label="Edge Functions"
            value="Preview"
            tone="muted"
            hint="checkout, webhooks, admin-access."
          />
          <StatusPill
            label="Factory pipeline"
            value="Preview"
            tone="muted"
            hint="Investigation scoring and recommendations."
          />
          <StatusPill
            label="Email delivery"
            value="Preview"
            tone="muted"
            hint="Transactional and alert notifications."
          />
          <StatusPill
            label="Webhooks"
            value="Preview"
            tone="muted"
            hint="Inbound event delivery and retry health."
          />
        </div>
        <div style={previewNoticeStyle}>
          <span style={{ color: '#94a3b8', fontWeight: 600, lineHeight: 1.5 }}>
            Live uptime, latency, and incident history will appear here when observability is
            connected.
          </span>
          <PreviewBadge label="Not connected yet" />
        </div>
      </BlockShell>
    </div>
  )
}
