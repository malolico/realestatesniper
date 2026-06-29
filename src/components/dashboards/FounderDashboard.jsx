export default function FounderDashboard({
  founderTrialStatus = null,
  founderTrialEndsAt = null,
  founderAccessActive = false,
  founderDaysRemaining = null,
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

  function StatCard({ label, value, tone = 'neutral', hint = null }) {
    const tones = {
      neutral: {
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.04)',
        value: '#e2e8f0',
      },
      good: {
        border: '1px solid rgba(34, 197, 94, 0.35)',
        background: 'rgba(34, 197, 94, 0.12)',
        value: '#4ade80',
      },
      warn: {
        border: '1px solid rgba(250, 204, 21, 0.35)',
        background: 'rgba(250, 204, 21, 0.10)',
        value: '#fde68a',
      },
      danger: {
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(239, 68, 68, 0.10)',
        value: '#fecaca',
      },
      muted: {
        border: '1px solid rgba(148, 163, 184, 0.35)',
        background: 'rgba(148, 163, 184, 0.08)',
        value: '#94a3b8',
      },
    }

    const style = tones[tone] || tones.neutral

    return (
      <div
        style={{
          padding: '16px 16px',
          borderRadius: '16px',
          border: style.border,
          background: style.background,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minHeight: '86px',
        }}
      >
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#94a3b8',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>

        <div style={{ fontSize: '1.05rem', fontWeight: 900, color: style.value, lineHeight: 1.25 }}>
          {value}
        </div>

        {hint ? (
          <div style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.4 }}>{hint}</div>
        ) : null}
      </div>
    )
  }

  function BulletList({ items }) {
    return (
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
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    )
  }

  const trialEndLabel = founderTrialEndsAt
    ? new Date(founderTrialEndsAt).toLocaleDateString()
    : 'No expiration date available'

  const daysRemainingLabel =
    founderDaysRemaining != null
      ? `${founderDaysRemaining} day${founderDaysRemaining === 1 ? '' : 's'}`
      : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <BlockShell
        eyebrow="Founder"
        title="Founder Status"
        description="Your Founder access window and what it unlocks."
      >
        <div
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          }}
        >
          <StatCard
            label="Founder access"
            value={founderAccessActive ? 'Active' : 'Expired'}
            tone={founderAccessActive ? 'good' : 'danger'}
            hint={founderAccessActive ? 'Founder Access Active' : 'Founder access has expired'}
          />
          <StatCard
            label="Trial status"
            value={founderTrialStatus || '—'}
            tone="warn"
            hint={`Trial ends: ${trialEndLabel}`}
          />
          <StatCard
            label="Private window"
            value="15-day private window"
            tone="neutral"
            hint="Private founder window period."
          />
          <StatCard
            label="Days remaining"
            value={daysRemainingLabel}
            tone={founderDaysRemaining != null && founderDaysRemaining > 0 ? 'good' : 'muted'}
            hint={founderTrialEndsAt ? `Trial end: ${trialEndLabel}` : 'No expiration date available'}
          />
        </div>

        <div
          style={{
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.03)',
            color: '#cbd5e1',
            fontWeight: 600,
            lineHeight: 1.55,
          }}
        >
          During your Founder window, you can review deal intelligence early and purchase
          Premium/Diamond access unlocks.
          {founderTrialEndsAt
            ? ` Your trial ends on ${trialEndLabel}.`
            : ' No expiration date available.'}
          {founderDaysRemaining != null
            ? ` ${founderDaysRemaining} day${founderDaysRemaining === 1 ? '' : 's'} remaining.`
            : ''}
        </div>
      </BlockShell>

      <BlockShell
        eyebrow="Visibility"
        title="Founder Visibility"
        description="Founder mode shows a larger slice of the market to accelerate deal discovery."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <div
            style={{
              padding: '16px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(250, 204, 21, 0.35)',
              background: 'rgba(250, 204, 21, 0.10)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontWeight: 900, color: '#fde68a', marginBottom: '6px' }}>
                100% Yellow
              </div>
              <div style={{ color: '#e5e7eb', lineHeight: 1.55 }}>
                Full visibility into Yellow-tier opportunities for maximum pipeline coverage.
              </div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#fde68a',
                border: '1px solid rgba(250, 204, 21, 0.35)',
                background: 'rgba(250, 204, 21, 0.12)',
              }}
            >
              FULL
            </div>
          </div>

          <div
            style={{
              padding: '16px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.30)',
              background: 'rgba(34, 197, 94, 0.10)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontWeight: 900, color: '#4ade80', marginBottom: '6px' }}>
                50% Green (lower-value deals)
              </div>
              <div style={{ color: '#e5e7eb', lineHeight: 1.55 }}>
                Partial visibility into Green-tier lower-value deals to keep focus while
                expanding deal flow.
              </div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.32)',
                background: 'rgba(34, 197, 94, 0.12)',
              }}
            >
              PARTIAL
            </div>
          </div>

          <div
            style={{
              padding: '16px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              background: 'rgba(239, 68, 68, 0.10)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontWeight: 900, color: '#fecaca', marginBottom: '6px' }}>
                25% Red (lower-value deals)
              </div>
              <div style={{ color: '#e5e7eb', lineHeight: 1.55 }}>
                Minimal visibility into Red-tier lower-value deals to reduce noise while still
                sampling the long tail.
              </div>
            </div>
            <div
              style={{
                flexShrink: 0,
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                color: '#fecaca',
                border: '1px solid rgba(239, 68, 68, 0.32)',
                background: 'rgba(239, 68, 68, 0.12)',
              }}
            >
              LIMITED
            </div>
          </div>
        </div>
      </BlockShell>

      <BlockShell
        eyebrow="Benefits"
        title="Founder Benefits"
        description="What Founder status unlocks during the trial window."
      >
        <BulletList
          items={[
            'Early access to the private window and new deal intelligence.',
            'Can purchase Premium/Diamond access during the Founder window.',
            'Private beta investor status (Founder cohort).',
          ]}
        />
      </BlockShell>

      <BlockShell
        eyebrow="Limits"
        title="Founder Limits"
        description="Founder access is intentionally scarce and time-limited."
      >
        <BulletList
          items={[
            'Only 10 invited investors (Founder spots are limited).',
            'Access expires after the trial window ends.',
            'Must subscribe after trial to continue full access.',
          ]}
        />

        <div
          style={{
            padding: '14px 16px',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            background: 'rgba(148, 163, 184, 0.08)',
            color: '#cbd5e1',
            fontWeight: 600,
            lineHeight: 1.55,
          }}
        >
          {founderTrialEndsAt
            ? `Trial end date: ${trialEndLabel}. Subscribe after trial to continue full access.`
            : 'No expiration date available. Subscribe after trial to continue full access.'}
        </div>
      </BlockShell>
    </div>
  )
}
