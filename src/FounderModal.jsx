function FounderModal({
  showFounderGate,
  founderCodeInput,
  setFounderCodeInput,
  founderError,
  setFounderError,
  handleFounderCodeSubmit,
  handleFounderGateClose,
}) {
  if (!showFounderGate) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#0b1120',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '22px',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#dbeafe',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            Founder Access
          </div>
        </div>

        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>
          Enter Founder Code
        </h3>

        <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
          This area is restricted to approved founder investors only. Enter your
          one-time founder code to continue.
        </p>

        <input
          type="text"
          value={founderCodeInput}
          onChange={(e) => {
            setFounderCodeInput(e.target.value)
            if (founderError) setFounderError('')
          }}
          placeholder="RS-FOUNDER-001"
          autoFocus
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '16px 18px',
            borderRadius: '14px',
            border: founderError
              ? '1px solid rgba(255, 77, 77, 0.8)'
              : '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFounderCodeSubmit()
            if (e.key === 'Escape') handleFounderGateClose()
          }}
        />

        {founderError && (
          <p style={{ marginTop: '12px', color: '#ff6b6b', fontWeight: 600 }}>
            {founderError}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button onClick={handleFounderCodeSubmit} className="primary-button">
            Validate Founder Code
          </button>

          <button onClick={handleFounderGateClose} className="secondary-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default FounderModal