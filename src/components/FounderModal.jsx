import { useEffect, useState } from 'react'
import {
  FOUNDER_FEEDBACK_COPY,
  FOUNDER_VISUAL_MOCK,
} from '../lib/founder/founderVisualMock'
import FounderStatus from './FounderStatus'

const FEEDBACK_STYLES = {
  valid: {
    border: '1px solid rgba(34, 197, 94, 0.35)',
    background: 'rgba(34, 197, 94, 0.12)',
    color: '#4ade80',
  },
  invalid: {
    border: '1px solid rgba(239, 68, 68, 0.35)',
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#ff8b8b',
  },
  used: {
    border: '1px solid rgba(250, 204, 21, 0.35)',
    background: 'rgba(250, 204, 21, 0.1)',
    color: '#fde68a',
  },
  full: {
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: 'rgba(148, 163, 184, 0.12)',
    color: '#e2e8f0',
  },
}

function FeedbackBanner({ type, customMessage }) {
  if (!type) return null

  const copy = FOUNDER_FEEDBACK_COPY[type]
  const style = FEEDBACK_STYLES[type]

  return (
    <div
      style={{
        marginTop: '14px',
        padding: '14px 16px',
        borderRadius: '14px',
        ...style,
      }}
      role="status"
    >
      <div style={{ fontWeight: 800, marginBottom: '6px' }}>{copy.title}</div>
      <div style={{ lineHeight: 1.55, fontWeight: 600, fontSize: '0.95rem' }}>
        {customMessage || copy.body}
      </div>
    </div>
  )
}

function resolveVisualFeedback(normalizedCode, foundersFullOverride) {
  if (foundersFullOverride || FOUNDER_VISUAL_MOCK.foundersFull) {
    return { type: 'full', message: null }
  }

  if (!normalizedCode) {
    return {
      type: 'invalid',
      message: 'Please enter your founder invitation code.',
    }
  }

  if (FOUNDER_VISUAL_MOCK.usedCodes.includes(normalizedCode)) {
    return { type: 'used', message: null }
  }

  if (!FOUNDER_VISUAL_MOCK.validCodes.includes(normalizedCode)) {
    return { type: 'invalid', message: null }
  }

  return { type: 'valid', message: null }
}

function FounderModal({
  showFounderGate,
  founderCodeInput,
  setFounderCodeInput,
  founderError,
  setFounderError,
  handleFounderCodeSubmit,
  handleFounderGateClose,
  remainingSpots = 5,
  totalSpots = 10,
  foundersFullMock = false,
}) {
  const [visualFeedback, setVisualFeedback] = useState(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!showFounderGate) {
      setVisualFeedback(null)
      setIsValidating(false)
    }
  }, [showFounderGate])

  useEffect(() => {
    if (!founderError) return
    setVisualFeedback({
      type: 'invalid',
      message: founderError,
    })
  }, [founderError])

  if (!showFounderGate) return null

  const foundersFull = foundersFullMock || FOUNDER_VISUAL_MOCK.foundersFull
  const feedbackType = visualFeedback?.type || null
  const inputBorder =
    feedbackType === 'valid'
      ? '1px solid rgba(34, 197, 94, 0.55)'
      : feedbackType === 'used'
        ? '1px solid rgba(250, 204, 21, 0.55)'
        : feedbackType === 'full'
          ? '1px solid rgba(148, 163, 184, 0.45)'
          : feedbackType === 'invalid' || founderError
            ? '1px solid rgba(255, 77, 77, 0.8)'
            : '1px solid rgba(255,255,255,0.12)'

  function handleValidateClick() {
    const normalizedCode = founderCodeInput.trim().toUpperCase()
    const result = resolveVisualFeedback(normalizedCode, foundersFullMock)

    setVisualFeedback(result)
    setIsValidating(true)

    // Mock "full" is visual-only demo — does not change live access rules when false (default).
    if (result.type === 'full') {
      if (setFounderError) {
        setFounderError(result.message || 'Founder spots are full.')
      }
      setIsValidating(false)
      return
    }

    // Invalid empty/code: mirror parent messaging; parent still authoritative on submit.
    if (result.type === 'invalid') {
      if (setFounderError) {
        setFounderError(
          result.message || 'Access denied. This founder code is not approved.',
        )
      }
      setIsValidating(false)
      return
    }

    // "used" / "valid" banners are preview states; real activation stays in App.jsx handler.
    setTimeout(() => {
      setIsValidating(false)
      if (result.type === 'valid' && setFounderError) setFounderError('')
      handleFounderCodeSubmit()
    }, result.type === 'valid' ? 650 : 400)
  }

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
            Founder Access · V1
          </div>
        </div>

        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>
          Enter Founder Code
        </h3>

        <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
          This area is restricted to approved founder investors only. Enter your
          one-time founder code to continue.
        </p>

        <FounderStatus
          remainingSpots={remainingSpots}
          totalSpots={totalSpots}
          foundersFull={foundersFull}
          compact
        />

        <input
          type="text"
          value={founderCodeInput}
          onChange={(e) => {
            setFounderCodeInput(e.target.value)
            setVisualFeedback(null)
            if (founderError && setFounderError) setFounderError('')
          }}
          placeholder="RS-FOUNDER-001"
          autoFocus
          disabled={foundersFull || isValidating}
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '16px 18px',
            borderRadius: '14px',
            border: inputBorder,
            background: 'rgba(255,255,255,0.04)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            opacity: foundersFull ? 0.55 : 1,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !foundersFull && !isValidating) handleValidateClick()
            if (e.key === 'Escape') handleFounderGateClose()
          }}
        />

        <FeedbackBanner type={feedbackType} customMessage={visualFeedback?.message} />

        <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button
            onClick={handleValidateClick}
            className="primary-button"
            disabled={foundersFull || isValidating}
            style={{ opacity: foundersFull || isValidating ? 0.65 : 1 }}
          >
            {isValidating ? 'Validating…' : 'Validate Founder Code'}
          </button>

          <button onClick={handleFounderGateClose} className="secondary-button">
            Cancel
          </button>
        </div>

        <p
          style={{
            marginTop: '16px',
            color: '#64748b',
            fontSize: '0.8rem',
            lineHeight: 1.5,
          }}
        >
          Visual validation preview only. Supabase founder inventory sync coming next.
        </p>
      </div>
    </div>
  )
}

export default FounderModal
