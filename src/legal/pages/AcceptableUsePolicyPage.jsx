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

export default function AcceptableUsePolicyPage() {
  return (
    <LegalDocumentLayout
      title="Acceptable Use Policy"
      subtitle="Permitted and prohibited uses of platform content and accounts."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Acceptable Use Policy establishes the rules governing the proper use of the
          RealEstateSniper Platform.
        </p>
        <p style={pStyle}>
          All users agree to comply with this Policy when accessing or using any Platform
          service.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>The purpose of this Policy is to protect:</p>
        <ul style={ulStyle}>
          <li>the Platform;</li>
          <li>its users;</li>
          <li>property Owners;</li>
          <li>Investors;</li>
          <li>Platform information;</li>
          <li>Platform security.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. PERMITTED USE</h2>
        <p style={pStyle}>
          Users may use the Platform only for lawful purposes and in accordance with all
          applicable Platform documents.
        </p>
        <p style={pStyle}>
          Users shall always act in good faith.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PROHIBITED ACTIVITIES</h2>
        <p style={pStyle}>Users may not:</p>
        <ul style={ulStyle}>
          <li>violate any applicable law;</li>
          <li>provide false information;</li>
          <li>impersonate another person;</li>
          <li>create multiple unauthorized accounts;</li>
          <li>bypass Platform security;</li>
          <li>attempt unauthorized access;</li>
          <li>interfere with Platform operations;</li>
          <li>distribute malware;</li>
          <li>reverse engineer Platform software where prohibited;</li>
          <li>exploit Platform vulnerabilities;</li>
          <li>interfere with other users.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. DATA PROTECTION</h2>
        <p style={pStyle}>Users may not:</p>
        <ul style={ulStyle}>
          <li>scrape Platform databases;</li>
          <li>extract data through automated systems;</li>
          <li>create competing databases;</li>
          <li>copy protected Platform content;</li>
          <li>harvest user information without authorization.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PREMIUM AND DIAMOND INFORMATION</h2>
        <p style={pStyle}>Users may not:</p>
        <ul style={ulStyle}>
          <li>resell purchased information;</li>
          <li>redistribute purchased information;</li>
          <li>publish purchased information;</li>
          <li>upload purchased information to MLS systems;</li>
          <li>publish purchased information on real estate portals;</li>
          <li>publish purchased information on social media;</li>
          <li>use purchased information to train artificial intelligence systems;</li>
          <li>license purchased information to third parties.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. OWNER PROTECTION</h2>
        <p style={pStyle}>Users shall not:</p>
        <ul style={ulStyle}>
          <li>harass Owners;</li>
          <li>intimidate Owners;</li>
          <li>misrepresent their identity;</li>
          <li>misuse Owner information;</li>
          <li>contact Owners for unlawful purposes;</li>
          <li>engage in abusive conduct.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. SECURITY</h2>
        <p style={pStyle}>Users may not attempt to:</p>
        <ul style={ulStyle}>
          <li>defeat authentication systems;</li>
          <li>access restricted areas;</li>
          <li>test Platform security without authorization;</li>
          <li>overload Platform infrastructure;</li>
          <li>interfere with Platform availability.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. ENFORCEMENT</h2>
        <p style={pStyle}>
          Where this Policy is violated, RealEstateSniper may:
        </p>
        <ul style={ulStyle}>
          <li>issue warnings;</li>
          <li>suspend accounts;</li>
          <li>permanently terminate accounts;</li>
          <li>remove content;</li>
          <li>restrict Platform access;</li>
          <li>preserve evidence;</li>
          <li>report unlawful conduct to competent authorities where appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. NO WAIVER</h2>
        <p style={pStyle}>
          Failure by RealEstateSniper to enforce any provision of this Policy does not
          constitute a waiver of its rights.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. RECORDS</h2>
        <p style={pStyle}>
          Investigations, violations, enforcement actions and related evidence may be
          retained within the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. RELATIONSHIP WITH OTHER DOCUMENTS</h2>
        <p style={pStyle}>This Policy shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Marketplace Rules;</li>
          <li>Privacy Policy;</li>
          <li>Subscriber Terms;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Acceptable Use Policy becomes effective on the date specified in its
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
