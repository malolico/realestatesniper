/**
 * SubmitNewPropertyForm — UI structure only. No backend or submission workflow.
 */

import { useState } from 'react'
import { getLegalPage } from '../../legal/legalPages'

const OWNER_AGREEMENT_PATH =
  getLegalPage('ownerAgreement')?.path ?? '/legal/owner-agreement'

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const labelStyle = {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: '#e2e8f0',
}

const inputStyle = {
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#ffffff',
  fontSize: '0.92rem',
  width: '100%',
  boxSizing: 'border-box',
}

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.02)',
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: '1.05rem',
  fontWeight: 800,
  color: '#ffffff',
}

const noteStyle = {
  margin: 0,
  fontSize: '0.85rem',
  color: '#94a3b8',
  lineHeight: 1.55,
}

const fieldGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
}

const questionStyle = {
  fontWeight: 700,
  color: '#e2e8f0',
  fontSize: '0.92rem',
  lineHeight: 1.5,
}

const radioRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '18px',
}

const radioLabelStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#cbd5e1',
  fontSize: '0.92rem',
  cursor: 'default',
}

const checkboxGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '12px',
}

const disabledButtonStyle = {
  padding: '12px 20px',
  borderRadius: '14px',
  border: '1px solid rgba(148, 163, 184, 0.28)',
  background: 'rgba(148, 163, 184, 0.10)',
  color: '#94a3b8',
  fontWeight: 700,
  fontSize: '0.92rem',
  cursor: 'not-allowed',
  opacity: 0.85,
}

function FieldLabel({ children, required = false, optional = false }) {
  return (
    <label style={labelStyle}>
      {children}
      {required ? <span style={{ color: '#f87171' }}> *</span> : null}
      {optional ? (
        <span style={{ color: '#64748b', fontWeight: 500 }}> (optional)</span>
      ) : null}
    </label>
  )
}

function TextField({ label, required = false, optional = false, type = 'text' }) {
  return (
    <div style={fieldStyle}>
      <FieldLabel required={required} optional={optional}>
        {label}
      </FieldLabel>
      <input type={type} readOnly style={inputStyle} tabIndex={-1} aria-readonly="true" />
    </div>
  )
}

function RadioOption({ name, value, label }) {
  return (
    <label style={radioLabelStyle}>
      <input type="radio" name={name} value={value} readOnly tabIndex={-1} />
      {label}
    </label>
  )
}

function CheckboxOption({ label }) {
  return (
    <label style={radioLabelStyle}>
      <input type="checkbox" readOnly tabIndex={-1} />
      {label}
    </label>
  )
}

function FormSection({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h4 style={sectionTitleStyle}>{title}</h4>
      {children}
    </section>
  )
}

function UploadPlaceholder({ label, required = false, optional = false }) {
  return (
    <div style={fieldStyle}>
      <FieldLabel required={required} optional={optional}>
        {label}
      </FieldLabel>
      <div
        style={{
          padding: '28px 20px',
          borderRadius: '14px',
          border: '1px dashed rgba(148, 163, 184, 0.35)',
          background: 'rgba(148, 163, 184, 0.06)',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '0.9rem',
          lineHeight: 1.5,
        }}
      >
        Drag and drop files here, or click to browse
      </div>
    </div>
  )
}

export default function SubmitNewPropertyForm() {
  const [ownerAgreementAccepted, setOwnerAgreementAccepted] = useState(false)

  const representativeRoles = [
    'Authorized Representative',
    'Trustee',
    'Executor',
    'Power of Attorney',
    'Other',
  ]

  const propertyStatusOptions = [
    'Owner Occupied',
    'Vacant',
    'Tenant Occupied',
    'Probate',
    'Divorce',
    'Pre-Foreclosure',
    'Other',
  ]

  const declarationItems = [
    'I confirm that I am authorized to submit this property.',
    'I authorize RealEstateSniper to verify public records.',
    'I understand that submission does not guarantee publication.',
    'I understand that RealEstateSniper charges no commissions or listing fees.',
    'I understand that publication requires my final authorization.',
  ]

  return (
    <div
      id="submit-new-property-form"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <FormSection title="Owner Information">
        <div style={fieldGridStyle}>
          <TextField label="First Name" required />
          <TextField label="Last Name" required />
          <TextField label="Email" required type="email" />
          <TextField label="Mobile Phone" required type="tel" />
          <div style={{ gridColumn: '1 / -1' }}>
            <TextField label="Mailing Address" optional />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={questionStyle}>Are you the legal owner of this property?</p>
          <div style={radioRowStyle}>
            <RadioOption name="legal-owner" value="yes" label="Yes" />
            <RadioOption name="legal-owner" value="no" label="No" />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(148, 163, 184, 0.05)',
          }}
        >
          <p style={{ ...questionStyle, margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
            If you are not the legal owner, select your role:
          </p>
          <div style={radioRowStyle}>
            {representativeRoles.map((role) => (
              <RadioOption key={role} name="owner-role" value={role} label={role} />
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection title="Property Information">
        <div style={fieldGridStyle}>
          <div style={{ gridColumn: '1 / -1' }}>
            <TextField label="Property Address" required />
          </div>
          <TextField label="City" required />
          <TextField label="State" required />
          <TextField label="ZIP Code" required />
          <TextField label="APN / Parcel Number" required />
        </div>
        <p style={noteStyle}>APN is required to verify the property.</p>
      </FormSection>

      <FormSection title="Off-Market Verification">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={questionStyle}>
              Has this property been publicly listed for sale during the last 36 months?
            </p>
            <div style={radioRowStyle}>
              <RadioOption name="listed-36mo" value="yes" label="Yes" />
              <RadioOption name="listed-36mo" value="no" label="No" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={questionStyle}>
              Is the property currently listed with a real estate agent, brokerage or MLS?
            </p>
            <div style={radioRowStyle}>
              <RadioOption name="currently-listed" value="yes" label="Yes" />
              <RadioOption name="currently-listed" value="no" label="No" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={questionStyle}>Is there an active exclusive listing agreement?</p>
            <div style={radioRowStyle}>
              <RadioOption name="exclusive-listing" value="yes" label="Yes" />
              <RadioOption name="exclusive-listing" value="no" label="No" />
            </div>
          </div>
        </div>
        <p style={noteStyle}>
          Properties previously marketed through MLS, public listing websites or real estate
          agencies may require additional review and may not qualify for Diamond publication.
        </p>
      </FormSection>

      <FormSection title="Property Status">
        <div style={checkboxGridStyle}>
          {propertyStatusOptions.map((option) => (
            <CheckboxOption key={option} label={option} />
          ))}
        </div>
      </FormSection>

      <FormSection title="Documents">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <UploadPlaceholder label="Interior Photos" required />
          <UploadPlaceholder label="Property Documents" />
          <UploadPlaceholder label="HOA Information" optional />
        </div>
        <p style={noteStyle}>
          Interior photographs are required for the review process.
        </p>
      </FormSection>

      <FormSection title="Investor Contact Preferences">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={questionStyle}>
              Are you willing to receive offers from qualified investors?
            </p>
            <div style={radioRowStyle}>
              <RadioOption name="investor-offers" value="yes" label="Yes" />
              <RadioOption name="investor-offers" value="no" label="No" />
            </div>
          </div>

          <div style={fieldStyle}>
            <FieldLabel>Maximum number of investors</FieldLabel>
            <select
              defaultValue="4"
              disabled
              style={{
                ...inputStyle,
                cursor: 'not-allowed',
                opacity: 0.85,
                maxWidth: '120px',
              }}
            >
              {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={questionStyle}>Preferred Contact Method</p>
            <div style={radioRowStyle}>
              <RadioOption name="contact-method" value="email" label="Email" />
              <RadioOption name="contact-method" value="phone" label="Phone" />
              <RadioOption name="contact-method" value="both" label="Both" />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Declarations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {declarationItems.map((item) => (
            <CheckboxOption key={item} label={item} />
          ))}
        </div>
      </FormSection>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          paddingTop: '4px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button type="button" disabled style={disabledButtonStyle}>
            Save Draft
          </button>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#e2e8f0',
            lineHeight: 1.5,
            fontSize: '0.92rem',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={ownerAgreementAccepted}
            onChange={(event) => setOwnerAgreementAccepted(event.target.checked)}
            style={{ marginTop: '3px' }}
          />
          <span>
            I have read and agree to the{' '}
            <a
              href={OWNER_AGREEMENT_PATH}
              style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
            >
              Owner Agreement
            </a>
            .
          </span>
        </label>

        <button
          type="button"
          disabled={!ownerAgreementAccepted}
          style={
            !ownerAgreementAccepted
              ? disabledButtonStyle
              : {
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                }
          }
        >
          Submit for Review
        </button>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.55, maxWidth: '720px' }}>
          Submission workflow under development. Every property will be reviewed after identity
          and ownership verification.
        </p>
      </div>
    </div>
  )
}
