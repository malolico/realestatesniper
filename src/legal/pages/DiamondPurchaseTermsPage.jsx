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

export default function DiamondPurchaseTermsPage() {
  return (
    <LegalDocumentLayout
      title="Diamond Purchase Terms"
      subtitle="Terms for per-deal Diamond access purchases and owner-contact rules."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          These Diamond Purchase Terms govern every purchase of a Diamond opportunity
          through RealEstateSniper.
        </p>
        <p style={pStyle}>
          They apply together with the Terms of Service and all other applicable Platform
          documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. DIGITAL PRODUCT</h2>
        <p style={pStyle}>
          A Diamond opportunity is a digital product.
        </p>
        <p style={pStyle}>
          The purchase grants the Buyer access to specific information relating to a
          particular property.
        </p>
        <p style={pStyle}>
          The purchase does not transfer ownership of the property or create any legal
          interest in the property.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. ELIGIBILITY</h2>
        <p style={pStyle}>
          Only eligible users with an active subscription and the required account status
          may purchase a Diamond opportunity.
        </p>
        <p style={pStyle}>
          RealEstateSniper may refuse any purchase that does not satisfy Platform
          requirements.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PURCHASE</h2>
        <p style={pStyle}>A purchase is completed only after:</p>
        <ul style={ulStyle}>
          <li>successful payment;</li>
          <li>confirmation by the payment provider;</li>
          <li>activation of access by the Platform.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. ACCESS</h2>
        <p style={pStyle}>
          Once the purchase has been completed, the Buyer receives access to the Diamond
          information associated with that specific Property Legal File.
        </p>
        <p style={pStyle}>
          Access is personal and linked exclusively to the purchasing account.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PERMITTED USE</h2>
        <p style={pStyle}>
          The Buyer may use the information solely for legitimate evaluation of the
          investment opportunity.
        </p>
        <p style={pStyle}>
          No other rights are granted.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. PROHIBITED USE</h2>
        <p style={pStyle}>The Buyer may not:</p>
        <ul style={ulStyle}>
          <li>resell the information;</li>
          <li>distribute the information;</li>
          <li>publish the information;</li>
          <li>share account access;</li>
          <li>upload the information to MLS services;</li>
          <li>publish the information on real estate portals;</li>
          <li>publish the information on social media;</li>
          <li>use the information to train artificial intelligence systems;</li>
          <li>create commercial databases using the information;</li>
          <li>use the information in violation of Platform rules.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. NO REFUNDS</h2>
        <p style={pStyle}>
          Because access to the digital information is provided immediately after purchase,
          all Diamond purchases are final.
        </p>
        <p style={pStyle}>
          No refunds will be issued once access has been granted, except where required by
          applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. PLATFORM RESPONSIBILITY</h2>
        <p style={pStyle}>RealEstateSniper does not guarantee:</p>
        <ul style={ulStyle}>
          <li>successful negotiations;</li>
          <li>purchase of the property;</li>
          <li>investment profitability;</li>
          <li>future property availability;</li>
          <li>acceptance of offers by the Owner.</li>
        </ul>
        <p style={pStyle}>
          The Platform provides access to information only.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. BUYER RESPONSIBILITY</h2>
        <p style={pStyle}>
          The Buyer remains solely responsible for conducting independent legal, financial,
          tax and commercial due diligence before making any investment decision.
        </p>
        <p style={pStyle}>
          Nothing provided through the Platform constitutes legal, financial or investment
          advice.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. FRAUD</h2>
        <p style={pStyle}>
          RealEstateSniper may suspend or permanently terminate access where fraudulent
          activity, misuse of information or material violations of these Terms are
          detected.
        </p>
        <p style={pStyle}>
          Legal action may be taken where appropriate.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. RECORDS</h2>
        <p style={pStyle}>
          Purchases, payments, access logs and related records may be retained within the
          Legal Evidence Engine for contractual, legal and evidentiary purposes.
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
          These Diamond Purchase Terms become effective on the date specified in their
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
