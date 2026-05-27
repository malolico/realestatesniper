/**
 * FounderStatus — private beta cohort counter (data from App / Supabase).
 */

const DEFAULT_TOTAL = 10
const DEFAULT_REMAINING = 5

function FounderStatus({
  remainingSpots = DEFAULT_REMAINING,
  totalSpots = DEFAULT_TOTAL,
  foundersFull = false,
  compact = false,
}) {
  const safeTotal = Math.max(totalSpots, 1)
  const safeRemaining = Math.max(0, Math.min(remainingSpots, safeTotal))
  const taken = safeTotal - safeRemaining

  return (
    <div
      style={{
        marginTop: compact ? '0' : '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '540px',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: '10px',
          padding: compact ? '10px 14px' : '12px 18px',
          borderRadius: '14px',
          border: foundersFull
            ? '1px solid rgba(148, 163, 184, 0.35)'
            : '1px solid rgba(255, 59, 59, 0.35)',
          background: foundersFull
            ? 'rgba(148, 163, 184, 0.08)'
            : 'rgba(255, 59, 59, 0.08)',
          boxShadow: foundersFull
            ? 'none'
            : '0 0 22px rgba(255, 59, 59, 0.12)',
        }}
      >
        <span
          style={{
            color: foundersFull ? '#94a3b8' : '#ff4d4d',
            fontWeight: 800,
            fontSize: compact ? '1rem' : '1.2rem',
            letterSpacing: '0.02em',
          }}
        >
          {foundersFull
            ? `${safeTotal} / ${safeTotal} Founder Spots Filled`
            : `${safeRemaining} / ${safeTotal} Founder Spots Remaining`}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          color: '#cbd5e1',
          fontWeight: 600,
          fontSize: compact ? '0.9rem' : '1rem',
          lineHeight: 1.55,
        }}
      >
        Only invited investors can access the private beta
      </p>

      {!foundersFull && taken > 0 ? (
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
          {taken} founder {taken === 1 ? 'spot' : 'spots'} already reserved
        </p>
      ) : null}

      {foundersFull ? (
        <p
          style={{
            margin: 0,
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            background: 'rgba(148, 163, 184, 0.08)',
            color: '#e2e8f0',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}
        >
          Founder cohort is full. New invitations are closed.
        </p>
      ) : null}
    </div>
  )
}

export default FounderStatus
