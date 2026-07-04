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

export default function AiAutomationDisclosurePage() {
  return (
    <LegalDocumentLayout
      title="AI & Automation Disclosure"
      subtitle="Transparency about automated systems used in the platform."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This AI &amp; Automation Disclosure explains how RealEstateSniper uses artificial
          intelligence and automated systems within the Platform.
        </p>
        <p style={pStyle}>
          This Disclosure forms part of the Platform's legal documentation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          RealEstateSniper uses artificial intelligence and automation to improve the
          efficiency, security and operation of the Platform.
        </p>
        <p style={pStyle}>
          Artificial intelligence is used as a support technology and does not replace final
          human decisions where human review is required.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. PLATFORM USE OF AI</h2>
        <p style={pStyle}>
          Artificial intelligence and automated systems may be used for purposes including:
        </p>
        <ul style={ulStyle}>
          <li>processing public records;</li>
          <li>data enrichment;</li>
          <li>document analysis;</li>
          <li>property verification support;</li>
          <li>fraud detection;</li>
          <li>duplicate detection;</li>
          <li>data quality improvement;</li>
          <li>workflow automation;</li>
          <li>internal operational analysis.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. HUMAN REVIEW</h2>
        <p style={pStyle}>
          Certain Platform decisions remain subject to human review.
        </p>
        <p style={pStyle}>These may include, where applicable:</p>
        <ul style={ulStyle}>
          <li>Diamond approval;</li>
          <li>Owner verification;</li>
          <li>fraud investigations;</li>
          <li>administrative decisions;</li>
          <li>exceptional cases requiring manual evaluation.</li>
        </ul>
        <p style={pStyle}>
          Artificial intelligence assists these processes but does not automatically replace
          human judgment where Platform procedures require manual approval.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. DATA SOURCES</h2>
        <p style={pStyle}>
          Artificial intelligence may process information obtained from:
        </p>
        <ul style={ulStyle}>
          <li>publicly available records;</li>
          <li>information submitted by users;</li>
          <li>internal Platform records;</li>
          <li>legally obtained third-party data sources.</li>
        </ul>
        <p style={pStyle}>
          Processing remains subject to the Platform's Privacy Policy and applicable law.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. NO AUTOMATED LEGAL OR FINANCIAL ADVICE</h2>
        <p style={pStyle}>
          Artificial intelligence used by RealEstateSniper does not provide:
        </p>
        <ul style={ulStyle}>
          <li>legal advice;</li>
          <li>financial advice;</li>
          <li>tax advice;</li>
          <li>investment advice.</li>
        </ul>
        <p style={pStyle}>
          Users remain solely responsible for their own independent decisions.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. USER INFORMATION</h2>
        <p style={pStyle}>
          RealEstateSniper does not use Premium or Diamond information purchased by users to
          train public artificial intelligence models.
        </p>
        <p style={pStyle}>
          The Platform will not use user information for AI training except where expressly
          authorized or permitted by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. FUTURE DEVELOPMENTS</h2>
        <p style={pStyle}>
          As artificial intelligence technologies evolve, RealEstateSniper may introduce
          additional AI-assisted services.
        </p>
        <p style={pStyle}>
          Material changes affecting users will be reflected in the applicable legal
          documentation where required.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. RELATIONSHIP WITH OTHER DOCUMENTS</h2>
        <p style={pStyle}>This Disclosure shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Acceptable Use Policy;</li>
          <li>Marketplace Rules;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This AI &amp; Automation Disclosure becomes effective on the date specified in its
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
