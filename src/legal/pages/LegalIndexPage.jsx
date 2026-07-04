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

const h3Style = {
  color: '#e2e8f0',
  fontSize: '1.05rem',
  fontWeight: 700,
  margin: '20px 0 6px',
}

const pStyle = {
  margin: '0 0 12px',
}

const ulStyle = {
  margin: '0 0 12px',
  paddingLeft: '24px',
}

const olStyle = {
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

const linkStyle = {
  color: '#60a5fa',
  textDecoration: 'none',
}

export default function LegalIndexPage() {
  return (
    <LegalDocumentLayout
      title="Legal Documentation Index"
      subtitle="Complete index of legal documents governing the RealEstateSniper platform."
    >
      <div style={sectionStyle}>

        <p style={pStyle}>
          This Legal Documentation Index identifies the official legal documents governing
          the operation of RealEstateSniper.
        </p>
        <p style={pStyle}>
          It serves as the master reference for the Platform's legal architecture.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>CORE LEGAL DOCUMENTS</h2>

        <h3 style={h3Style}>
          1. <a href="/legal/terms-of-service" style={linkStyle}>Terms of Service</a>
        </h3>
        <p style={pStyle}>
          Primary legal agreement governing access to and use of the Platform.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          2. <a href="/legal/privacy-policy" style={linkStyle}>Privacy Policy</a>
        </h3>
        <p style={pStyle}>
          Explains how personal information is collected, processed, protected and retained.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          3. <a href="/legal/cookie-policy" style={linkStyle}>Cookie Policy</a>
        </h3>
        <p style={pStyle}>
          Explains the use of cookies and similar technologies.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          4. <a href="/legal/investment-disclaimer" style={linkStyle}>Investment Disclaimer</a>
        </h3>
        <p style={pStyle}>
          Explains that Platform information is informational only and does not constitute
          investment, financial, legal, tax or brokerage advice.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>USER-SPECIFIC DOCUMENTS</h2>

        <h3 style={h3Style}>
          5. <a href="/legal/owner-agreement" style={linkStyle}>Owner Agreement</a>
        </h3>
        <p style={pStyle}>
          Regulates the relationship between RealEstateSniper and Owners.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          6. <a href="/legal/subscription-terms" style={linkStyle}>Subscriber Terms</a>
        </h3>
        <p style={pStyle}>
          Regulates subscription services and Subscriber rights.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          7. <a href="/legal/founder-program-terms" style={linkStyle}>Founder Program Terms</a>
        </h3>
        <p style={pStyle}>
          Regulates participation in the Founder Program.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>PRODUCT DOCUMENTS</h2>

        <h3 style={h3Style}>
          8. <a href="/legal/premium-purchase-terms" style={linkStyle}>Premium Purchase Terms</a>
        </h3>
        <p style={pStyle}>
          Regulates purchases of Premium opportunities.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          9. <a href="/legal/diamond-purchase-terms" style={linkStyle}>Diamond Purchase Terms</a>
        </h3>
        <p style={pStyle}>
          Regulates purchases of Diamond opportunities.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          10. <a href="/legal/diamond-authorization-agreement" style={linkStyle}>Diamond Authorization Agreement</a>
        </h3>
        <p style={pStyle}>
          Regulates Owner authorization for Diamond publication.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>OPERATIONAL DOCUMENTS</h2>

        <h3 style={h3Style}>
          11. <a href="/legal/marketplace-rules" style={linkStyle}>Marketplace Rules</a>
        </h3>
        <p style={pStyle}>
          Rules governing Marketplace participation.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          12. <a href="/legal/acceptable-use-policy" style={linkStyle}>Acceptable Use Policy</a>
        </h3>
        <p style={pStyle}>
          Rules governing acceptable Platform use.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          13. <a href="/legal/refund-policy" style={linkStyle}>Refund Policy</a>
        </h3>
        <p style={pStyle}>
          Explains the Platform's refund rules.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          14. <a href="/legal/data-retention-policy" style={linkStyle}>Data Retention Policy</a>
        </h3>
        <p style={pStyle}>
          Explains how records and information are retained.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          15. <a href="/legal/ai-automation-disclosure" style={linkStyle}>AI &amp; Automation Disclosure</a>
        </h3>
        <p style={pStyle}>
          Explains the use of artificial intelligence and automation within the Platform.
        </p>

        <hr style={dividerStyle} />

        <h3 style={h3Style}>
          16. <a href="/legal/legal-notice" style={linkStyle}>Legal Notice</a>
        </h3>
        <p style={pStyle}>
          Provides the official legal information relating to the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>REFERENCE DOCUMENTS</h2>

        <h3 style={h3Style}>
          17. <a href="/legal/legal-definitions" style={linkStyle}>Legal Definitions</a>
        </h3>
        <p style={pStyle}>
          Contains the official legal definitions used throughout the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>INTERNAL DOCUMENTS</h2>
        <p style={pStyle}>
          The following documents are maintained internally by RealEstateSniper and are not
          intended for public publication:
        </p>
        <ul style={ulStyle}>
          <li>Legal Change Log.</li>
          <li>Internal Legal Review Notes.</li>
          <li>Legal Evidence Engine Documentation.</li>
          <li>Version Control Records.</li>
          <li>U.S. Legal Review Notes.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>DOCUMENT HIERARCHY</h2>
        <p style={pStyle}>
          The hierarchy of legal authority within the Platform is as follows:
        </p>
        <ol style={olStyle}>
          <li>Terms of Service.</li>
          <li>Legal Definitions.</li>
          <li>User-Specific Agreements.</li>
          <li>Product Agreements.</li>
          <li>Operational Policies.</li>
          <li>Informational Documents.</li>
        </ol>
        <p style={pStyle}>
          Where a conflict exists, the higher-ranking document shall prevail unless
          mandatory law requires otherwise.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

      </div>
    </LegalDocumentLayout>
  )
}
