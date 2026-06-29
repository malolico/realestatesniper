/**
 * SubscriberDashboard — v1 personal zone (presentation only).
 * Data and gates come from App.jsx; no Stripe or new backend here.
 * resolveAccess (via `access` prop) is display-only — does not affect app gates.
 */

function StatusPill({ label, value, tone = 'neutral', ellipsis = false }) {
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
      background: 'rgba(250, 204, 21, 0.1)',
      color: '#fde68a',
    },
    muted: {
      border: '1px solid rgba(148, 163, 184, 0.35)',
      background: 'rgba(148, 163, 184, 0.08)',
      color: '#94a3b8',
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
          ...(ellipsis
            ? {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }
            : {
                overflow: 'hidden',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }),
        }}
        title={ellipsis ? String(value) : undefined}
      >
        {value}
      </span>
    </div>
  )
}

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
              maxWidth: '720px',
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

function SubscriberDashboard({
  user,
  subscriberUnlocked = false,
  emailVerified = false,
  phoneVerified = false,
  purchasesLoaded = false,
  myPurchasedEntries = [],
  getDealTitle,
  getDealCity,
  getDealScore,
  onViewDeal,
  onGoToAccess,
  onExploreMarketplace,
  access = null,
}) {
  const email = user?.email || '—'

  const displayEmailVerified = access != null ? access.emailVerified : emailVerified
  const displayPhoneVerified = access != null ? access.phoneVerified : phoneVerified
  const displayIdentityVerified = access != null ? access.identityVerified : false
  const displaySubscriptionActive =
    access != null ? access.subscriptionActive : subscriberUnlocked
  const displayRequiresPhone =
    access != null ? access.requiresPhoneVerification : false
  const displayRequiresIdentity =
    access != null ? access.requiresIdentityVerificationForDiamond : false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Account Status */}
      <BlockShell
        eyebrow="Account"
        title="Account Status"
        description="Your signed-in profile and current platform access level."
      >
        <div
          style={{
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          <StatusPill label="Email" value={email} ellipsis />
          <StatusPill
            label="Subscriber active"
            value={displaySubscriptionActive ? 'Active' : 'Inactive'}
            tone={displaySubscriptionActive ? 'good' : 'muted'}
          />
          <StatusPill
            label="Email verified"
            value={displayEmailVerified ? 'Verified' : 'Not verified'}
            tone={displayEmailVerified ? 'good' : 'warn'}
          />
          <StatusPill
            label="Phone verified"
            value={displayPhoneVerified ? 'Verified' : 'Not verified'}
            tone={displayPhoneVerified ? 'good' : 'warn'}
          />
        </div>

        {!displaySubscriptionActive ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 59, 59, 0.22)',
              background: 'rgba(255, 59, 59, 0.08)',
              color: '#fecaca',
              fontWeight: 600,
              lineHeight: 1.55,
            }}
          >
            Subscriber membership is not active on this account yet. You can still manage
            verification settings and review any access purchases below.
            {onGoToAccess ? (
              <div style={{ marginTop: '12px' }}>
                <button type="button" className="secondary-button" onClick={onGoToAccess}>
                  View access options
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {displaySubscriptionActive && onExploreMarketplace ? (
          <div style={{ marginTop: '4px' }}>
            <button type="button" className="primary-button" onClick={onExploreMarketplace}>
              Explore Marketplace
            </button>
          </div>
        ) : null}
      </BlockShell>

      {/* 2. Verification Center */}
      <BlockShell
        eyebrow="Verification"
        title="Verification Center"
        description="Verification status for your investor account. Additional checks apply before Premium and Diamond purchases."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              Email
            </div>
            <div style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
              {displayEmailVerified
                ? 'Your email address is verified.'
                : 'Email verification is pending. Check your inbox to confirm your address.'}
            </div>
          </div>

          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              Phone
            </div>
            <div style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
              {displayPhoneVerified
                ? 'Your phone number is verified on this account.'
                : 'Phone verification is not complete yet. A guided flow will be added in a future release.'}
              {displayRequiresPhone ? (
                <div
                  style={{
                    marginTop: '8px',
                    color: '#fde68a',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Phone verification is recommended before Premium or Diamond purchases.
                </div>
              ) : null}
            </div>
          </div>

          <div
            style={{
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              background: 'rgba(148, 163, 184, 0.08)',
            }}
          >
            <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '6px' }}>
              Identity verification
            </div>
            <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>
              {displayIdentityVerified
                ? 'Identity verified on this account.'
                : 'Coming later for Premium/Diamond. Identity checks will be required before high-trust deal unlocks.'}
              {displayRequiresIdentity ? (
                <div
                  style={{
                    marginTop: '8px',
                    color: '#fde68a',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  Identity verification will be required before Diamond checkout.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </BlockShell>

      {/* 3. My Access Purchases — same data as legacy #my-purchases */}
      <BlockShell
        eyebrow="Purchases"
        title="My Access Purchases"
        description="Opportunities where you activated Premium or Diamond platform access."
      >
        {!purchasesLoaded ? (
          <div style={{ color: '#94a3b8' }}>Loading purchases...</div>
        ) : myPurchasedEntries.length === 0 ? (
          <div style={{ color: '#94a3b8' }}>No access purchases yet.</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '14px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            }}
          >
            {myPurchasedEntries.map(({ deal, access }) => {
              const isDiamond = access.diamond === true
              const typeLabel = isDiamond ? 'Diamond Access Active' : 'Premium Access Active'
              const badgeLabel = isDiamond ? '◆ DIAMOND' : 'PREMIUM 🔴'
              const score = getDealScore(deal)

              return (
                <div
                  key={deal.id}
                  style={{
                    padding: '20px',
                    borderRadius: '20px',
                    border: isDiamond
                      ? '1px solid rgba(239, 68, 68, 0.65)'
                      : '1px solid rgba(249, 115, 22, 0.25)',
                    background: isDiamond
                      ? 'linear-gradient(180deg, rgba(25, 5, 5, 0.98) 0%, rgba(10, 10, 12, 1) 100%)'
                      : 'linear-gradient(180deg, rgba(22, 14, 10, 0.94) 0%, rgba(12, 12, 14, 0.96) 100%)',
                    boxShadow: isDiamond
                      ? '0 20px 50px rgba(239, 68, 68, 0.28)'
                      : '0 12px 28px rgba(249, 115, 22, 0.10)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minHeight: '100%',
                  }}
                >
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '7px 12px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      color: isDiamond ? '#fecaca' : '#fdba74',
                      background: isDiamond
                        ? 'rgba(239, 68, 68, 0.16)'
                        : 'rgba(249, 115, 22, 0.14)',
                      border: isDiamond
                        ? '1px solid rgba(239, 68, 68, 0.36)'
                        : '1px solid rgba(249, 115, 22, 0.24)',
                    }}
                  >
                    {badgeLabel}
                  </div>

                  <div
                    style={{
                      color: isDiamond ? '#ff3b3b' : '#f4a261',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                    }}
                  >
                    {typeLabel}
                  </div>

                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 900,
                      lineHeight: 1.35,
                      fontSize: '1.08rem',
                    }}
                  >
                    {getDealTitle(deal)}
                  </div>

                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                    {getDealCity(deal)}
                  </div>

                  <div
                    style={{
                      color: '#e5e7eb',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '999px',
                        background:
                          score >= 80 ? '#ef4444' : score >= 60 ? '#22c55e' : '#facc15',
                      }}
                    />
                    Score: {score}/100
                  </div>

                  <button
                    type="button"
                    className="secondary-button"
                    style={{
                      marginTop: 'auto',
                      alignSelf: 'flex-start',
                      padding: '12px 18px',
                      fontSize: '0.96rem',
                      fontWeight: 800,
                      border: isDiamond
                        ? '1px solid rgba(239, 68, 68, 0.34)'
                        : '1px solid rgba(249, 115, 22, 0.3)',
                      background: isDiamond
                        ? 'rgba(239, 68, 68, 0.22)'
                        : 'rgba(249, 115, 22, 0.12)',
                      color: '#ffffff',
                    }}
                    onClick={() => onViewDeal(deal)}
                  >
                    View Opportunity
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </BlockShell>

      {/* 4. Watchlist & Alerts — UI only */}
      <BlockShell
        eyebrow="Alerts"
        title="Watchlist & Alerts"
        description="Save deals and receive notifications when new opportunities match your criteria."
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              title: 'Saved deals watchlist',
              body: 'Track markets and deals you want to monitor over time.',
            },
            {
              title: 'Email alerts',
              body: 'Get notified when new deals match your investor profile.',
            },
            {
              title: 'WhatsApp alerts',
              body: 'Receive high-priority deal signals on mobile.',
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px dashed rgba(148, 163, 184, 0.35)',
                background: 'rgba(148, 163, 184, 0.06)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: '#e2e8f0', marginBottom: '6px' }}>
                  {item.title}
                </div>
                <div style={{ color: '#94a3b8', lineHeight: 1.5 }}>{item.body}</div>
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
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  background: 'rgba(148, 163, 184, 0.1)',
                }}
              >
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </BlockShell>

      {/* 5. Security & Trust */}
      <BlockShell
        eyebrow="Security"
        title="Security & Trust"
        description="How RealEstateSniper protects deal flow and investor data."
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
          <li>This account is for individual investor use. Account sharing is not permitted.</li>
          <li>
            Deal information, addresses, and underwriting details must not be resold,
            republished, or redistributed outside the platform.
          </li>
          <li>
            Access to Premium and Diamond content is tied to your account and purchase history.
          </li>
          <li>
            Security activity log — coming soon. You will be able to review sign-ins and sensitive
            account actions here.
          </li>
        </ul>
      </BlockShell>
    </div>
  )
}

export default SubscriberDashboard
