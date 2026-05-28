/**
 * AdminDashboard — v1 operations console (presentation only).
 * Static UI prepared for future wiring. No backend, no gates.
 */

export default function AdminDashboard() {
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

  function StatusPill({ label, value, tone = 'neutral', hint = null }) {
    const tones = {
      neutral: {
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        color: '#e2e8f0',
      },
      good: {
        border: '1px solid rgba(34, 197, 94, 0.35)',
        background: 'rgba(34, 197, 94, 0.12)',
        color: '#4ade80',
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

  function ComingSoonBadge() {
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
        Coming soon
      </span>
    )
  }

  function AuditRow({ title, body }) {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(96, 165, 250, 0.22)',
          background: 'rgba(96, 165, 250, 0.06)',
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
        <ComingSoonBadge />
      </div>
    )
  }

  const pillGrid = {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. System Overview */}
      <BlockShell
        eyebrow="System"
        title="System Overview"
        description="High-level platform metrics across users, cohorts, and monetized deal access."
      >
        <div style={pillGrid}>
          <StatusPill
            label="Active users"
            value="—"
            tone="admin"
            hint="Registered accounts with recent session activity."
          />
          <StatusPill
            label="Subscribers"
            value="—"
            tone="good"
            hint="Accounts with active subscription metadata."
          />
          <StatusPill
            label="Founder cohort"
            value="— / 10"
            tone="warn"
            hint="Redeemed founder codes vs total cohort capacity."
          />
          <StatusPill
            label="Premium/Diamond purchases"
            value="—"
            tone="diamond"
            hint="Deal access purchases across all tiers."
          />
        </div>
      </BlockShell>

      {/* 2. User Management */}
      <BlockShell
        eyebrow="Users"
        title="User Management"
        description="Segmented view of investor, founder, owner, and restricted accounts."
      >
        <div style={pillGrid}>
          <StatusPill
            label="Subscribers"
            value="—"
            tone="good"
            hint="Manage subscription status and access role."
          />
          <StatusPill
            label="Founders"
            value="—"
            tone="warn"
            hint="Active founder trials and expired cohort members."
          />
          <StatusPill
            label="Owners"
            value="—"
            tone="neutral"
            hint="Property owners connected to the platform."
          />
          <StatusPill
            label="Restricted users"
            value="—"
            tone="danger"
            hint="Accounts flagged or limited by admin action."
          />
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1px dashed rgba(148, 163, 184, 0.35)',
            background: 'rgba(148, 163, 184, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ color: '#94a3b8', fontWeight: 600, lineHeight: 1.5 }}>
            Full user directory, search, and role editing will connect to admin-access.
          </span>
          <ComingSoonBadge />
        </div>
      </BlockShell>

      {/* 3. Deal Access Control */}
      <BlockShell
        eyebrow="Deals"
        title="Deal Access Control"
        description="Monitor Premium and Diamond unlocks, slot capacity, and anomalous access patterns."
      >
        <div style={pillGrid}>
          <StatusPill
            label="Premium unlocks"
            value="—"
            tone="premium"
            hint="Total premium_one_time purchases."
          />
          <StatusPill
            label="Diamond unlocks"
            value="—"
            tone="diamond"
            hint="Total platinum_one_time purchases."
          />
          <StatusPill
            label="Sold-out slots"
            value="—"
            tone="muted"
            hint="Deals at Diamond slot capacity."
          />
          <StatusPill
            label="Suspicious access"
            value="—"
            tone="danger"
            hint="Patterns requiring manual review."
          />
        </div>
      </BlockShell>

      {/* 4. Owner Review */}
      <BlockShell
        eyebrow="Owners"
        title="Owner Review"
        description="Queue for owner verification, property authorization, and investor contact approvals."
      >
        <div style={pillGrid}>
          <StatusPill
            label="Pending owner validations"
            value="—"
            tone="warn"
            hint="Owners awaiting identity and listing verification."
          />
          <StatusPill
            label="Property authorizations"
            value="—"
            tone="neutral"
            hint="Listings pending platform or owner sign-off."
          />
          <StatusPill
            label="Contact permissions"
            value="—"
            tone="admin"
            hint="Investor contact releases awaiting owner consent."
          />
          <StatusPill
            label="Diamond slot approvals"
            value="—"
            tone="diamond"
            hint="Owner-approved Diamond capacity requests."
          />
        </div>
      </BlockShell>

      {/* 5. Audit & Security */}
      <BlockShell
        eyebrow="Audit"
        title="Audit & Security"
        description="Compliance-ready tracking for admin actions, sensitive data changes, and protected owner/investor records."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <AuditRow
            title="Audit logs prepared"
            body="Immutable event stream for sign-ins, role changes, purchases, and authorization updates."
          />
          <AuditRow
            title="Sensitive data changes tracked"
            body="Metadata edits, contact releases, and deal visibility changes logged with actor and timestamp."
          />
          <AuditRow
            title="Admin actions traceable"
            body="Every approve, revoke, and manual override attributed to an admin account."
          />
          <AuditRow
            title="Protected owner/contact/consent data"
            body="Owner contact details and investor consent records remain gated until explicit authorization."
          />
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#cbd5e1',
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <li>Export and retention policies for audit records — coming soon.</li>
          <li>Real-time alerts for suspicious admin or access events — coming soon.</li>
        </ul>
      </BlockShell>

      {/* 6. System Health */}
      <BlockShell
        eyebrow="Health"
        title="System Health"
        description="Operational status of payments, edge functions, database, and deal data pipeline."
      >
        <div style={pillGrid}>
          <StatusPill
            label="Stripe webhooks"
            value="Monitoring"
            tone="muted"
            hint="Checkout and subscription event delivery."
          />
          <StatusPill
            label="Supabase functions"
            value="Monitoring"
            tone="muted"
            hint="create-checkout-session, stripe-webhook, admin-access."
          />
          <StatusPill
            label="Database status"
            value="Monitoring"
            tone="muted"
            hint="Auth, deals, purchases, founder_codes."
          />
          <StatusPill
            label="Data pipeline status"
            value="Monitoring"
            tone="muted"
            hint="Markets, deals scoring, and purchase counts sync."
          />
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
            color: '#94a3b8',
            fontWeight: 600,
            lineHeight: 1.55,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span>
            Live health checks and incident history will appear here once monitoring is wired.
          </span>
          <ComingSoonBadge />
        </div>
      </BlockShell>
    </div>
  )
}
