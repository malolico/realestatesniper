/**
 * ReviewDetectedPropertyPanel — UI structure only. No backend, validation, or state logic.
 */

import { getLegalPage } from '../../legal/legalPages'

const OWNER_AGREEMENT_PATH =
  getLegalPage('ownerAgreement')?.path ?? '/legal/owner-agreement'

const pendingReviewValue = '— Pending review —'

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

const bodyStyle = {
  margin: 0,
  fontSize: '0.92rem',
  color: '#94a3b8',
  lineHeight: 1.6,
}

const footerNoteStyle = {
  margin: 0,
  fontSize: '0.88rem',
  color: '#94a3b8',
  lineHeight: 1.55,
  maxWidth: '720px',
}

const fieldGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '14px',
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const fieldLabelStyle = {
  fontSize: '0.88rem',
  fontWeight: 700,
  color: '#e2e8f0',
}

const fieldValueStyle = {
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#94a3b8',
  fontSize: '0.92rem',
  lineHeight: 1.45,
}

const statusRowStyle = {
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  background: 'rgba(148, 163, 184, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const statusLabelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#94a3b8',
  letterSpacing: '0.04em',
}

const statusValueStyle = {
  fontSize: '0.98rem',
  fontWeight: 800,
  color: '#cbd5e1',
  lineHeight: 1.4,
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

function FormSection({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h4 style={sectionTitleStyle}>{title}</h4>
      {children}
    </section>
  )
}

function InfoField({ label, value = pendingReviewValue }) {
  return (
    <div style={fieldStyle}>
      <span style={fieldLabelStyle}>{label}</span>
      <div style={fieldValueStyle}>{value}</div>
    </div>
  )
}

function StatusRow({ label, value }) {
  return (
    <div style={statusRowStyle}>
      <span style={statusLabelStyle}>{label}</span>
      <span style={statusValueStyle}>{value}</span>
    </div>
  )
}

export default function ReviewDetectedPropertyPanel() {
  const propertyFields = [
    'Property Address',
    'City',
    'County',
    'Parcel Number (APN)',
    'Property Type',
    'Occupancy',
    'Bedrooms',
    'Bathrooms',
    'Living Area',
    'Lot Size',
    'Year Built',
  ]

  return (
    <div
      id="review-detected-property"
      style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      <FormSection title="Property Detected by RealEstateSniper Intelligence">
        <p style={bodyStyle}>
          Our research identified a property that appears to belong to you.
        </p>
        <p style={bodyStyle}>
          Before any information can be shared with investors, please review the property
          information and decide what you authorize RealEstateSniper to publish.
        </p>
      </FormSection>

      <FormSection title="Property Information">
        <div style={fieldGridStyle}>
          {propertyFields.map((label) => (
            <InfoField key={label} label={label} />
          ))}
        </div>
      </FormSection>

      <FormSection title="Owner Review">
        <p style={bodyStyle}>
          Review the detected property information before publication.
        </p>
        <p style={bodyStyle}>
          If any information is incorrect, you will be able to request corrections before
          publication.
        </p>
      </FormSection>

      <FormSection title="Contact Authorization">
        <p style={bodyStyle}>
          Your personal contact information will never be shared without your explicit
          authorization.
        </p>
        <StatusRow label="Contact Authorization" value="Pending Owner Approval" />
      </FormSection>

      <FormSection title="Publication Authorization">
        <p style={bodyStyle}>
          Your property cannot be published until you authorize RealEstateSniper.
        </p>
        <p style={{ ...bodyStyle, color: '#cbd5e1' }}>
          Publication of your property is subject to the{' '}
          <a
            href={OWNER_AGREEMENT_PATH}
            style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
          >
            Owner Agreement
          </a>
          .
        </p>
        <StatusRow label="Publication Status" value="Pending" />
      </FormSection>

      <FormSection title="Qualified Investor Access">
        <p style={bodyStyle}>
          If your property qualifies after review, you may decide how many qualified investors
          can access it.
        </p>
        <StatusRow label="Status" value="Pending qualification" />
      </FormSection>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          paddingTop: '2px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button type="button" disabled style={disabledButtonStyle}>
            Review Property
          </button>
          <button type="button" disabled style={disabledButtonStyle}>
            Authorize Publication
          </button>
        </div>
        <p style={footerNoteStyle}>
          These actions will become available after your property has been verified.
        </p>
      </div>
    </div>
  )
}
