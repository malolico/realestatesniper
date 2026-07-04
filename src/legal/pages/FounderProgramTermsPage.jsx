import LegalDocumentLayout from '../LegalDocumentLayout'

const sectionStyle = {
  color: '#e2e8f0',
  lineHeight: 1.7,
  fontSize: '0.95rem',
}

const h2Style = {
  color: '#ffffff',
  fontSize: '1.3rem',
  fontWeight: 800,
  margin: '32px 0 12px',
}

const pStyle = {
  margin: '0 0 12px',
}

const ulStyle = {
  margin: '0 0 12px',
  paddingLeft: '24px',
}

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  margin: '28px 0',
}

const draftNoticeStyle = {
  margin: '8px 0 12px',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  background: 'rgba(251, 191, 36, 0.08)',
  color: '#fbbf24',
  fontWeight: 700,
  fontSize: '0.88rem',
}

export default function FounderProgramTermsPage() {
  return (
    <LegalDocumentLayout
      title="Founder Program Terms"
      subtitle="Terms governing participation in the RealEstateSniper Founder cohort."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          These Founder Program Terms govern participation in the RealEstateSniper Founder
          Program.
        </p>
        <p style={pStyle}>
          Participation is voluntary and subject to these Terms and all other applicable
          Platform documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          The Founder Program is a limited promotional program created to support the
          initial launch of RealEstateSniper.
        </p>
        <p style={pStyle}>
          The Program grants temporary benefits to a limited number of eligible users.
        </p>
        <p style={pStyle}>
          Participation does not create ownership, partnership or equity rights in
          RealEstateSniper.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. ELIGIBILITY</h2>
        <p style={pStyle}>
          Participation is available only through a valid Founder invitation code issued by
          RealEstateSniper.
        </p>
        <p style={pStyle}>Each Founder code:</p>
        <ul style={ulStyle}>
          <li>may be used only once;</li>
          <li>is personal;</li>
          <li>is non-transferable once redeemed.</li>
        </ul>
        <p style={pStyle}>
          RealEstateSniper may refuse any registration that does not satisfy Program
          requirements.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. LIMITED AVAILABILITY</h2>
        <p style={pStyle}>
          The Founder Program is limited to the number of Founder codes established by
          RealEstateSniper.
        </p>
        <p style={pStyle}>
          Once all Founder codes have been redeemed, the Program will automatically close.
        </p>
        <p style={pStyle}>
          No additional Founder accounts will be created unless expressly decided by
          RealEstateSniper.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. FOUNDER BENEFITS</h2>
        <p style={pStyle}>
          During the Founder period, eligible users may receive the benefits announced by
          the Platform, including access to Founder features and the ability to purchase
          Premium and Diamond opportunities where applicable.
        </p>
        <p style={pStyle}>
          Founder status does not guarantee the availability of any specific opportunity.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. END OF FOUNDER STATUS</h2>
        <p style={pStyle}>
          Founder status is temporary.
        </p>
        <p style={pStyle}>
          When the Founder period ends, the account will automatically lose Founder status.
        </p>
        <p style={pStyle}>
          Continued access to subscription services will require compliance with the
          Platform's standard subscription requirements.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. USER RESPONSIBILITIES</h2>
        <p style={pStyle}>Founders agree to:</p>
        <ul style={ulStyle}>
          <li>comply with all Platform documents;</li>
          <li>protect account credentials;</li>
          <li>use the Platform lawfully;</li>
          <li>refrain from sharing Founder access;</li>
          <li>respect all confidentiality obligations relating to purchased information.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. TERMINATION</h2>
        <p style={pStyle}>
          RealEstateSniper may suspend or terminate Founder status where:
        </p>
        <ul style={ulStyle}>
          <li>these Terms are violated;</li>
          <li>fraudulent conduct is detected;</li>
          <li>false information is provided;</li>
          <li>Platform security is compromised.</li>
        </ul>
        <p style={pStyle}>
          Termination of Founder status does not affect obligations previously accepted by
          the user.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. PROGRAM MODIFICATIONS</h2>
        <p style={pStyle}>
          RealEstateSniper may modify or discontinue the Founder Program where reasonably
          necessary.
        </p>
        <p style={pStyle}>
          Such modifications shall not affect rights already acquired unless required by
          applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. RECORDS</h2>
        <p style={pStyle}>
          Founder registrations, code redemptions, account status changes and related
          records may be retained within the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. GOVERNING DOCUMENTS</h2>
        <p style={pStyle}>These Terms shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Marketplace Rules;</li>
          <li>Subscriber Terms;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          These Founder Program Terms become effective on the date specified in their
          published version.
        </p>
        <p style={pStyle}>
          Certain provisions may require adaptation before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

      </div>
    </LegalDocumentLayout>
  )
}
