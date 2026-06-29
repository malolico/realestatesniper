import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getLegalPage } from '../legal/legalPages'

const TERMS_OF_SERVICE_PATH =
  getLegalPage('termsOfService')?.path ?? '/legal/terms-of-service'
const PRIVACY_POLICY_PATH =
  getLegalPage('privacyPolicy')?.path ?? '/legal/privacy-policy'

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
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authInfo, setAuthInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [legalTermsAccepted, setLegalTermsAccepted] = useState(false)

  useEffect(() => {
    if (!showAuthModal) {
      setFullName('')
      setEmail('')
      setPassword('')
      setShowPassword(false)
      setAuthError('')
      setAuthInfo('')
      setSubmitting(false)
      setLegalTermsAccepted(false)
    }
  }, [showAuthModal])

  async function handleForgotPassword() {
    setAuthError('')
    setAuthInfo('')
    if (!email.trim()) {
      setAuthError('Please enter your email first.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      })

      if (error) {
        setAuthError(error.message)
        setSubmitting(false)
        return
      }

      setAuthInfo('Password reset email sent. Check your inbox and spam folder.')
      setSubmitting(false)
    } catch (_error) {
      setAuthError('Unexpected error while sending reset email. Please try again.')
      setSubmitting(false)
    }
  }

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

    if (authMode === 'signup' && !legalTermsAccepted) {
      return
    }

    setSubmitting(true)

    try {
      if (authMode === 'signup') {
        let metadata = { full_name: fullName.trim() }

        if (authContext === 'subscriber') {
          metadata = {
            ...metadata,
            access_role: 'subscriber',
            subscriber_started_at: new Date().toISOString(),
          }
        } else if (authContext === 'owner') {
          metadata = {
            ...metadata,
            access_role: 'owner',
            owner_registered_at: new Date().toISOString(),
          }
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
  const isOwnerFlow = authContext === 'owner'

  const eyebrowText = isFounderFlow
    ? 'Founder Access'
    : isOwnerFlow
      ? 'Property Owners'
      : 'Subscriber Access'
  const titleText =
    authMode === 'signup'
      ? isFounderFlow
        ? 'Create your founder account'
        : isOwnerFlow
          ? 'Create your free owner account'
          : 'Create your subscriber account'
      : isFounderFlow
        ? 'Sign in to continue founder access'
        : isOwnerFlow
          ? 'Sign in to continue owner access'
          : 'Sign in to continue subscriber access'
  const descriptionText =
    authMode === 'signup'
      ? isFounderFlow
        ? 'Complete your real founder account setup to access the private window and activate your 30-day founder trial.'
        : isOwnerFlow
          ? 'Create your free owner account to manage property authorization, contact preferences, and Diamond controls.'
          : 'Create your real subscriber account. This will become the base account for future paid access.'
      : isFounderFlow
        ? 'Sign in with your real founder account to continue.'
        : isOwnerFlow
          ? 'Sign in with your owner account to access the Owner Portal.'
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

        <div style={{ position: 'relative', marginTop: '14px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (authError) setAuthError('')
              if (authInfo) setAuthInfo('')
            }}
            placeholder="Password"
            style={{
              width: '100%',
              marginTop: 0,
              padding: '16px 88px 16px 18px',
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
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: '1px solid rgba(148, 163, 184, 0.32)',
              background: 'rgba(15, 23, 42, 0.55)',
              color: '#cbd5e1',
              borderRadius: '999px',
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {authMode === 'signin' ? (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={submitting}
            style={{
              marginTop: '10px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              padding: 0,
              fontSize: '0.9rem',
            }}
          >
            Forgot your password?
          </button>
        ) : null}

        {authError || authInfo ? (
          <div
            style={{
              marginTop: '12px',
              padding: '10px 12px',
              borderRadius: '12px',
              border: authError
                ? '1px solid rgba(239, 68, 68, 0.35)'
                : '1px solid rgba(34, 197, 94, 0.35)',
              background: authError ? 'rgba(239, 68, 68, 0.10)' : 'rgba(34, 197, 94, 0.10)',
              color: authError ? '#fecaca' : '#bbf7d0',
              fontWeight: 600,
              lineHeight: 1.55,
              fontSize: '0.95rem',
            }}
          >
            {authError || authInfo}
          </div>
        ) : null}

        {authMode === 'signup' ? (
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginTop: '18px',
              color: '#e2e8f0',
              lineHeight: 1.5,
              fontSize: '0.92rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={legalTermsAccepted}
              onChange={(event) => setLegalTermsAccepted(event.target.checked)}
              style={{ marginTop: '3px' }}
            />
            <span>
              I have read and agree to the{' '}
              <a
                href={TERMS_OF_SERVICE_PATH}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href={PRIVACY_POLICY_PATH}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>
        ) : null}

        <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSubmit}
            className="primary-button"
            disabled={submitting || (authMode === 'signup' && !legalTermsAccepted)}
            style={{
              opacity:
                submitting || (authMode === 'signup' && !legalTermsAccepted) ? 0.55 : 1,
              cursor:
                submitting || (authMode === 'signup' && !legalTermsAccepted)
                  ? 'not-allowed'
                  : 'pointer',
            }}
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