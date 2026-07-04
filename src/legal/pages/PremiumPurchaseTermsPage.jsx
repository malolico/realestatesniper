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

export default function PremiumPurchaseTermsPage() {
  return (
    <LegalDocumentLayout
      title="Premium Purchase Terms"
      subtitle="Terms for per-deal Premium access purchases."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          These Premium Purchase Terms govern every purchase of a Premium opportunity
          through RealEstateSniper.
        </p>
        <p style={pStyle}>
          They apply together with the Terms of Service and all other applicable Platform
          documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. DIGITAL PRODUCT</h2>
        <p style={pStyle}>
          A Premium opportunity is a digital product.
        </p>
        <p style={pStyle}>
          The purchase grants access only to the Premium information associated with a
          specific property.
        </p>
        <p style={pStyle}>
          No ownership, representation or brokerage rights are transferred.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. ELIGIBILITY</h2>
        <p style={pStyle}>
          Only users with an active subscription and the required account status may
          purchase Premium opportunities.
        </p>
        <p style={pStyle}>
          RealEstateSniper may refuse any transaction that does not satisfy Platform
          requirements.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PURCHASE PROCESS</h2>
        <p style={pStyle}>A Premium purchase is completed only after:</p>
        <ul style={ulStyle}>
          <li>successful payment;</li>
          <li>confirmation from the payment provider;</li>
          <li>activation of access by the Platform.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. ACCESS RIGHTS</h2>
        <p style={pStyle}>
          Access is granted exclusively to the purchasing account.
        </p>
        <p style={pStyle}>Access is:</p>
        <ul style={ulStyle}>
          <li>personal;</li>
          <li>non-transferable;</li>
          <li>non-exclusive.</li>
        </ul>
        <p style={pStyle}>
          The purchase grants only the rights expressly described in these Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PERMITTED USE</h2>
        <p style={pStyle}>
          The Buyer may use the Premium information solely to evaluate the corresponding
          investment opportunity.
        </p>
        <p style={pStyle}>
          No additional rights are granted.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. PROHIBITED USE</h2>
        <p style={pStyle}>The Buyer may not:</p>
        <ul style={ulStyle}>
          <li>sell the information;</li>
          <li>redistribute the information;</li>
          <li>share purchased materials;</li>
          <li>allow third parties to use the purchased access;</li>
          <li>publish Premium information publicly;</li>
          <li>upload Premium information to MLS systems;</li>
          <li>publish Premium information on real estate portals;</li>
          <li>publish Premium information on social media;</li>
          <li>use the information to train artificial intelligence systems;</li>
          <li>create commercial databases using purchased information.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. NO REFUNDS</h2>
        <p style={pStyle}>
          Because access to the digital information is provided immediately after purchase,
          Premium purchases are final.
        </p>
        <p style={pStyle}>
          No refunds will be issued once access has been granted, except where required by
          applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. BUYER RESPONSIBILITY</h2>
        <p style={pStyle}>
          Each Buyer is solely responsible for conducting independent legal, financial, tax
          and commercial due diligence before making any investment decision.
        </p>
        <p style={pStyle}>
          Nothing contained in the Platform constitutes legal, financial or investment
          advice.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. PLATFORM RESPONSIBILITY</h2>
        <p style={pStyle}>RealEstateSniper does not guarantee:</p>
        <ul style={ulStyle}>
          <li>successful negotiations;</li>
          <li>acquisition of the property;</li>
          <li>investment profitability;</li>
          <li>acceptance of offers by property owners;</li>
          <li>future availability of the opportunity.</li>
        </ul>
        <p style={pStyle}>
          The Platform provides access to information only.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. FRAUD AND MISUSE</h2>
        <p style={pStyle}>
          RealEstateSniper may suspend or permanently terminate any account involved in:
        </p>
        <ul style={ulStyle}>
          <li>fraudulent activity;</li>
          <li>unauthorized sharing;</li>
          <li>misuse of Premium information;</li>
          <li>material violations of Platform rules.</li>
        </ul>
        <p style={pStyle}>
          Additional legal action may be taken where appropriate.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. RECORDS</h2>
        <p style={pStyle}>
          Purchases, payment confirmations, access records and related evidence may be
          retained within the Legal Evidence Engine for legal, contractual and evidentiary
          purposes.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. GOVERNING DOCUMENTS</h2>
        <p style={pStyle}>These Terms shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Marketplace Rules;</li>
          <li>Acceptable Use Policy;</li>
          <li>Refund Policy;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          These Premium Purchase Terms become effective on the date specified in their
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
