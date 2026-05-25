import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function AuthModal({
  showAuthModal,
  authMode,
  setAuthMode,
  authContext,
  handleAuthModalClose,
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authInfo, setAuthInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!showAuthModal) {
      setFullName('')
      setEmail('')
      setPassword('')
      setAuthError('')
      setAuthInfo('')
      setSubmitting(false)
    }
  }, [showAuthModal])

  async function handleSubmit() {
    setAuthError('')
    setAuthInfo('')

    if (!email.trim()) {
      setAuthError('Please enter your email.')
      return
    }

    if (!password.trim()) {
      setAuthError('Please enter your password.')
      return
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setAuthError('Please enter your full name.')
      return
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)

    try {
      if (authMode === 'signup') {
        const metadata =
          authContext === 'subscriber'
            ? {
                full_name: fullName.trim(),
                access_role: 'subscriber',
                subscriber_started_at: new Date().toISOString(),
              }
            : {
                full_name: fullName.trim(),
              }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: metadata,
            emailRedirectTo: window.location.origin,
          },
        })

        if (error) {
          setAuthError(error.message)
          setSubmitting(false)
          return
        }

        if (data?.user && !data?.session) {
          setAuthInfo(
            'Account created. Check your email and confirm your address before continuing.',
          )
          setSubmitting(false)
          return
        }

        setAuthInfo('Account created successfully.')
        setSubmitting(false)
        handleAuthModalClose()
        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setAuthError(error.message)
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      handleAuthModalClose()
    } catch (_error) {
      setAuthError('Unexpected error. Please try again.')
      setSubmitting(false)
    }
  }

  if (!showAuthModal) return null

  const isFounderFlow = authContext === 'founder'

  const eyebrowText = isFounderFlow ? 'Founder Access' : 'Subscriber Access'
  const titleText =
    authMode === 'signup'
      ? isFounderFlow
        ? 'Create your founder account'
        : 'Create your subscriber account'
      : isFounderFlow
        ? 'Sign in to continue founder access'
        : 'Sign in to continue subscriber access'
  const descriptionText =
    authMode === 'signup'
      ? isFounderFlow
        ? 'Complete your real founder account setup to access the private window and activate your 30-day founder trial.'
        : 'Create your real subscriber account. This will become the base account for future paid access.'
      : isFounderFlow
        ? 'Sign in with your real founder account to continue.'
        : 'Sign in with your existing subscriber account.'

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
        zIndex: 10001,
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
            {eyebrowText}
          </div>
        </div>

        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>
          {titleText}
        </h3>

        <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
          {descriptionText}
        </p>

        {authMode === 'signup' && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (authError) setAuthError('')
              if (authInfo) setAuthInfo('')
            }}
            placeholder="Full name"
            style={{
              width: '100%',
              marginTop: '18px',
              padding: '16px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (authError) setAuthError('')
            if (authInfo) setAuthInfo('')
          }}
          placeholder="Email address"
          style={{
            width: '100%',
            marginTop: '18px',
            padding: '16px 18px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (authError) setAuthError('')
            if (authInfo) setAuthInfo('')
          }}
          placeholder="Password"
          style={{
            width: '100%',
            marginTop: '14px',
            padding: '16px 18px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#ffffff',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit()
            if (e.key === 'Escape') handleAuthModalClose()
          }}
        />

        {authError && (
          <p style={{ marginTop: '12px', color: '#ff6b6b', fontWeight: 600 }}>
            {authError}
          </p>
        )}

        {authInfo && (
          <p style={{ marginTop: '12px', color: '#4ade80', fontWeight: 600, lineHeight: 1.6 }}>
            {authInfo}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSubmit}
            className="primary-button"
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting
              ? 'Please wait...'
              : authMode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
          </button>

          <button onClick={handleAuthModalClose} className="secondary-button">
            Cancel
          </button>
        </div>

        <div style={{ marginTop: '18px', color: '#cbd5e1', lineHeight: 1.6 }}>
          {authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setAuthMode('signin')
                  setAuthError('')
                  setAuthInfo('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account yet?{' '}
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setAuthError('')
                  setAuthInfo('')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal