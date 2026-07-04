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

export default function MarketplaceRulesPage() {
  return (
    <LegalDocumentLayout
      title="Marketplace Rules"
      subtitle="Rules governing deal listings, scoring, and marketplace conduct."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          These Marketplace Rules govern the use of the RealEstateSniper Marketplace by all
          users with access to Marketplace services.
        </p>
        <p style={pStyle}>
          These Rules apply together with the Terms of Service and all other applicable
          Platform documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          The Marketplace is designed to provide eligible users with access to real estate
          opportunities made available through the Platform.
        </p>
        <p style={pStyle}>
          The Marketplace is an information platform.
        </p>
        <p style={pStyle}>
          It is not a brokerage, agency or representation service.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. ACCESS</h2>
        <p style={pStyle}>
          Only users with the appropriate account status may access Marketplace services.
        </p>
        <p style={pStyle}>Certain Marketplace sections may require:</p>
        <ul style={ulStyle}>
          <li>an active subscription;</li>
          <li>purchase of a Premium opportunity;</li>
          <li>purchase of a Diamond opportunity;</li>
          <li>additional verification where applicable.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. MARKETPLACE INFORMATION</h2>
        <p style={pStyle}>
          Information displayed within the Marketplace is provided to assist users in
          evaluating opportunities.
        </p>
        <p style={pStyle}>
          Users remain solely responsible for independently verifying all information before
          making any investment or commercial decision.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. USER CONDUCT</h2>
        <p style={pStyle}>Users must:</p>
        <ul style={ulStyle}>
          <li>act honestly;</li>
          <li>comply with all Platform documents;</li>
          <li>respect other users;</li>
          <li>use Marketplace information only for lawful purposes.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PROHIBITED CONDUCT</h2>
        <p style={pStyle}>Users may not:</p>
        <ul style={ulStyle}>
          <li>share restricted Marketplace information;</li>
          <li>copy Marketplace databases;</li>
          <li>scrape Marketplace content;</li>
          <li>use automated systems without authorization;</li>
          <li>redistribute Premium or Diamond information;</li>
          <li>publish Marketplace information outside the Platform;</li>
          <li>impersonate other users;</li>
          <li>interfere with Marketplace operations;</li>
          <li>attempt unauthorized access.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. PREMIUM AND DIAMOND INFORMATION</h2>
        <p style={pStyle}>
          Premium and Diamond information is confidential.
        </p>
        <p style={pStyle}>
          Access is granted only to the purchasing account.
        </p>
        <p style={pStyle}>
          Purchased information may not be transferred, copied, sold, licensed or
          redistributed.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. OWNER PROTECTION</h2>
        <p style={pStyle}>Users must not:</p>
        <ul style={ulStyle}>
          <li>harass Owners;</li>
          <li>pressure Owners;</li>
          <li>misuse Owner information;</li>
          <li>contact Owners for unlawful purposes;</li>
          <li>engage in abusive or deceptive conduct.</li>
        </ul>
        <p style={pStyle}>
          RealEstateSniper may immediately suspend users who violate these protections.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. PLATFORM RIGHTS</h2>
        <p style={pStyle}>RealEstateSniper may:</p>
        <ul style={ulStyle}>
          <li>remove Marketplace content;</li>
          <li>suspend opportunities;</li>
          <li>restrict access;</li>
          <li>suspend accounts;</li>
          <li>permanently terminate Marketplace access where appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. NO GUARANTEE</h2>
        <p style={pStyle}>The Marketplace does not guarantee:</p>
        <ul style={ulStyle}>
          <li>property availability;</li>
          <li>transaction completion;</li>
          <li>investment profitability;</li>
          <li>acceptance of offers;</li>
          <li>future publication of opportunities.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. FRAUD</h2>
        <p style={pStyle}>Fraudulent conduct may result in:</p>
        <ul style={ulStyle}>
          <li>immediate suspension;</li>
          <li>permanent account termination;</li>
          <li>cancellation of purchases where legally permitted;</li>
          <li>preservation of evidence;</li>
          <li>notification of competent authorities where appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. RECORDS</h2>
        <p style={pStyle}>
          Marketplace activity, purchases, access records, account actions and enforcement
          decisions may be retained within the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. RELATIONSHIP WITH OTHER DOCUMENTS</h2>
        <p style={pStyle}>These Rules shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Acceptable Use Policy;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>Subscriber Terms;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          These Marketplace Rules become effective on the date specified in their published
          version.
        </p>
        <p style={pStyle}>
          Certain provisions may require adaptation before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

      </div>
    </LegalDocumentLayout>
  )
}
