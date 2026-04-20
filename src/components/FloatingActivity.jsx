function FloatingActivity({ activityFeed, activityIndex }) {
  return (
    <div
      style={{
        position: 'fixed',
        right: '18px',
        bottom: '18px',
        zIndex: 9998,
        width: '320px',
        maxWidth: 'calc(100vw - 24px)',
        padding: '14px 16px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(8, 15, 30, 0.92)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            background: '#22c55e',
            boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            color: '#e2e8f0',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {activityFeed[activityIndex].label}
        </div>
      </div>

      <div
        style={{
          color: '#f8fafc',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          fontWeight: 600,
        }}
      >
        {activityFeed[activityIndex].text}
      </div>
    </div>
  )
}

export default FloatingActivity