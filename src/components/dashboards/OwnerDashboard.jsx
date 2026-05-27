/**
 * OwnerDashboard — v1 owner portal (presentation only).
 * Static UI structure prepared for future wiring. No backend, no gates.
 */

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
      diamond: {
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(239, 68, 68, 0.10)',
        color: '#fecaca',
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

  function PropertyCard({ title, subtitle, badge, badgeTone = 'neutral' }) {
    const badgeTones = {
      good: {
        color: '#4ade80',
        border: '1px solid rgba(34, 197, 94, 0.32)',
        background: 'rgba(34, 197, 94, 0.12)',
      },
      warn: {
        color: '#fde68a',
        border: '1px solid rgba(250, 204, 21, 0.35)',
        background: 'rgba(250, 204, 21, 0.12)',
      },
      diamond: {
        color: '#fecaca',
        border: '1px solid rgba(239, 68, 68, 0.32)',
        background: 'rgba(239, 68, 68, 0.12)',
      },
      muted: {
        color: '#94a3b8',
        border: '1px solid rgba(148, 163, 184, 0.30)',
        background: 'rgba(148, 163, 184, 0.10)',
      },
    }

    const badgeStyle = badgeTones[badgeTone] || badgeTones.muted

    return (
      <div
        style={{
          padding: '18px 18px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minHeight: '120px',
        }}
      >
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '6px 10px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: badgeStyle.color,
            border: badgeStyle.border,
            background: badgeStyle.background,
          }}
        >
          {badge}
        </div>
        <div style={{ fontWeight: 900, color: '#ffffff', lineHeight: 1.35 }}>{title}</div>
        <div style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5 }}>{subtitle}</div>
      </div>
    )
  }

  function ToggleRow({ label, description, enabled = false }) {
    return (
      <div
        style={{
          padding: '14px 16px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{label}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5 }}>{description}</div>
        </div>
        <div
          style={{
            flexShrink: 0,
            width: '52px',
            height: '30px',
            borderRadius: '999px',
            border: enabled
              ? '1px solid rgba(34, 197, 94, 0.35)'
              : '1px solid rgba(148, 163, 184, 0.35)',
            background: enabled ? 'rgba(34, 197, 94, 0.20)' : 'rgba(148, 163, 184, 0.12)',
            position: 'relative',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: enabled ? '25px' : '3px',
              width: '22px',
              height: '22px',
              borderRadius: '999px',
              background: enabled ? '#4ade80' : '#94a3b8',
            }}
          />
        </div>
      </div>
    )
  }

  function AuthorizationItem({ title, body, status = 'Pending' }) {
    return (
      <div
        style={{
          padding: '16px 16px',
          borderRadius: '16px',
          border: '1px solid rgba(96, 165, 250, 0.22)',
          background: 'rgba(96, 165, 250, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ fontWeight: 900, color: '#ffffff' }}>{title}</div>
          <span
            style={{
              flexShrink: 0,
              padding: '5px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#93c5fd',
              border: '1px solid rgba(96, 165, 250, 0.30)',
              background: 'rgba(96, 165, 250, 0.12)',
            }}
          >
            {status}
          </span>
        </div>
        <div style={{ color: '#cbd5e1', lineHeight: 1.55, fontSize: '0.94rem' }}>{body}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Owner Status */}
      <BlockShell
        eyebrow="Owner"
        title="Owner Status"
        description="Your verified owner profile, connected properties, and platform permissions."
      >
        <div
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          <StatusPill
            label="Owner verification"
            value="Pending review"
            tone="warn"
            hint="Identity and ownership checks will appear here."
          />
          <StatusPill
            label="Properties connected"
            value="0"
            tone="muted"
            hint="Linked properties on the platform."
          />
          <StatusPill
            label="Diamond permissions"
            value="Not enabled"
            tone="diamond"
            hint="Owner-approved Diamond slots."
          />
          <StatusPill
            label="Contact preferences"
            value="Not configured"
            tone="neutral"
            hint="Investor contact rules for your listings."
          />
        </div>
      </BlockShell>

      {/* 2. Property Management */}
      <BlockShell
        eyebrow="Properties"
        title="Property Management"
        description="Manage active listings, pending reviews, and off-market submissions."
      >
        <div
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          }}
        >
          <PropertyCard
            title="No active property"
            subtitle="Your live owner-verified listing will appear here once connected."
            badge="Active"
            badgeTone="good"
          />
          <PropertyCard
            title="No pending review"
            subtitle="Properties awaiting your approval or platform review."
            badge="Pending review"
            badgeTone="warn"
          />
          <PropertyCard
            title="No off-market submissions"
            subtitle="Private deal submissions you send for investor matching."
            badge="Off-market"
            badgeTone="muted"
          />
          <PropertyCard
            title="No Diamond properties"
            subtitle="Listings with owner-approved Diamond investor unlocks."
            badge="Diamond enabled"
            badgeTone="diamond"
          />
        </div>
      </BlockShell>

      {/* 3. Owner Authorization */}
      <BlockShell
        eyebrow="Authorization"
        title="Owner Authorization"
        description="Legal controls for how your property data and contact details are shared with verified investors."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <AuthorizationItem
            title="Permission to share contact with investors"
            body="Explicit owner consent is required before any investor can receive direct contact details tied to your property."
            status="Not granted"
          />
          <AuthorizationItem
            title="Diamond slot approval"
            body="Approve which investors may unlock Diamond-level access for a specific property listing."
            status="Pending"
          />
          <AuthorizationItem
            title="Contact methods allowed"
            body="Choose which channels investors may use after authorization: email, phone, or WhatsApp."
            status="Configure"
          />
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px dashed rgba(148, 163, 184, 0.35)',
              background: 'rgba(148, 163, 184, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '6px' }}>
                Audit trail
              </div>
              <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>
                Full history of authorization changes, investor unlocks, and contact releases.
              </div>
            </div>
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
          </div>
        </div>
      </BlockShell>

      {/* 4. Contact Preferences */}
      <BlockShell
        eyebrow="Contact"
        title="Contact Preferences"
        description="Set how verified investors may reach you after owner authorization. Toggles are visual placeholders."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <ToggleRow
            label="Email allowed"
            description="Investors may contact you by email after authorization."
            enabled={false}
          />
          <ToggleRow
            label="Phone allowed"
            description="Share your phone number with authorized investors only."
            enabled={false}
          />
          <ToggleRow
            label="WhatsApp allowed"
            description="Enable WhatsApp as an approved investor contact channel."
            enabled={false}
          />
          <ToggleRow
            label="Investor direct contact"
            description="Allow direct investor outreach once Diamond or Premium unlock is approved."
            enabled={false}
          />
        </div>
      </BlockShell>

      {/* 5. Diamond Control */}
      <BlockShell
        eyebrow="Diamond"
        title="Diamond Control"
        description="Manage Diamond slots, investor unlocks, and deal visibility for your properties."
      >
        <div
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          <StatusPill
            label="Diamond slots"
            value="0 / 0"
            tone="diamond"
            hint="Owner-approved Diamond capacity per property."
          />
          <StatusPill
            label="Investors unlocked"
            value="0"
            tone="good"
            hint="Verified investors with Diamond access to your deals."
          />
          <StatusPill
            label="Pending approvals"
            value="0"
            tone="warn"
            hint="Investor unlock requests awaiting your review."
          />
          <StatusPill
            label="Deal visibility status"
            value="Hidden"
            tone="muted"
            hint="Current visibility tier for owner-connected listings."
          />
        </div>
      </BlockShell>

      {/* 6. Security & Trust */}
      <BlockShell
        eyebrow="Security"
        title="Security & Trust"
        description="How RealEstateSniper protects owner data, authorization records, and investor access."
      >
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
          <li>
            Audit logs — every authorization change and investor unlock will be recorded for owner
            review.
          </li>
          <li>
            Owner authorization tracking — contact sharing requires explicit, revocable owner
            consent.
          </li>
          <li>
            Protected data — property addresses, underwriting, and contact details stay gated until
            approved.
          </li>
          <li>
            Access traceability — investor access to your listings is tied to verified accounts and
            purchase history.
          </li>
        </ul>
      </BlockShell>
    </div>
  )
}
