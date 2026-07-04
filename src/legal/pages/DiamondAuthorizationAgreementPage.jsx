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

export default function DiamondAuthorizationAgreementPage() {
  return (
    <LegalDocumentLayout
      title="Diamond Authorization Agreement"
      subtitle="Authorization process for Diamond opportunity publication."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Diamond Authorization Agreement governs the authorization process by which an
          Owner permits RealEstateSniper to publish a property as a Diamond opportunity
          within the Platform.
        </p>
        <p style={pStyle}>
          This Agreement applies together with the Terms of Service, Owner Agreement and all
          other applicable Platform documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          The purpose of this Agreement is to regulate the Owner's authorization for the
          publication of a specific property as a Diamond opportunity.
        </p>
        <p style={pStyle}>This Agreement does not create:</p>
        <ul style={ulStyle}>
          <li>a brokerage agreement;</li>
          <li>an agency relationship;</li>
          <li>a listing agreement;</li>
          <li>a mandate to sell;</li>
          <li>representation of the Owner.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. PROPERTY-SPECIFIC AUTHORIZATION</h2>
        <p style={pStyle}>
          Each authorization applies exclusively to one Property Legal File.
        </p>
        <p style={pStyle}>
          Authorizations may not be reused for any other property, even if owned by the same
          Owner.
        </p>
        <p style={pStyle}>
          Each new property requires a new authorization process.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PRIOR VERIFICATION</h2>
        <p style={pStyle}>
          Before any Diamond publication, RealEstateSniper may complete verification
          procedures including:
        </p>
        <ul style={ulStyle}>
          <li>Owner identity;</li>
          <li>ownership or authority;</li>
          <li>public records;</li>
          <li>property information;</li>
          <li>supporting documentation;</li>
          <li>administrative review;</li>
          <li>AI-assisted verification.</li>
        </ul>
        <p style={pStyle}>
          Completion of verification does not guarantee publication.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. OWNER REVIEW</h2>
        <p style={pStyle}>
          Before granting authorization, the Owner may review the information prepared by
          RealEstateSniper.
        </p>
        <p style={pStyle}>The Owner may:</p>
        <ul style={ulStyle}>
          <li>approve the information;</li>
          <li>request corrections;</li>
          <li>provide updated documentation.</li>
        </ul>
        <p style={pStyle}>
          Publication cannot proceed until the authorization process has been completed.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. VOLUNTARY AUTHORIZATION</h2>
        <p style={pStyle}>
          The Owner authorizes publication voluntarily.
        </p>
        <p style={pStyle}>Authorization must be:</p>
        <ul style={ulStyle}>
          <li>informed;</li>
          <li>specific;</li>
          <li>documented;</li>
          <li>linked to the corresponding Property Legal File.</li>
        </ul>
        <p style={pStyle}>
          General authorizations are not accepted.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. REFLECTION PERIOD</h2>
        <p style={pStyle}>
          After all required documentation has been completed, a mandatory twenty-four (24)
          hour reflection period applies before publication.
        </p>
        <p style={pStyle}>
          During this period, the Owner may withdraw the authorization without penalty.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. FINAL APPROVAL</h2>
        <p style={pStyle}>
          Final approval of every Diamond opportunity is performed exclusively by
          RealEstateSniper.
        </p>
        <p style={pStyle}>
          No Diamond opportunity is published automatically.
        </p>
        <p style={pStyle}>
          The Platform reserves the right to reject publication even after completion of the
          authorization process.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. PUBLICATION</h2>
        <p style={pStyle}>
          Once approved, the Diamond opportunity may be published within the Marketplace.
        </p>
        <p style={pStyle}>
          Publication grants eligible Investors the opportunity to purchase access under the
          applicable Diamond Purchase Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. MAXIMUM NUMBER OF INVESTORS</h2>
        <p style={pStyle}>
          The Owner determines the maximum number of Investors who may acquire access to the
          Diamond opportunity.
        </p>
        <p style={pStyle}>
          RealEstateSniper will respect that limit throughout the publication period.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. EXPIRATION</h2>
        <p style={pStyle}>
          A Diamond opportunity may be removed from the Marketplace when:
        </p>
        <ul style={ulStyle}>
          <li>the Owner reports completion of the process;</li>
          <li>the authorized Investor limit has been reached;</li>
          <li>the publication expires under Platform rules;</li>
          <li>RealEstateSniper determines that continued publication is no longer appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. FRAUD</h2>
        <p style={pStyle}>
          If fraud, false documentation, identity misuse or material misrepresentation is
          detected, RealEstateSniper may immediately:
        </p>
        <ul style={ulStyle}>
          <li>terminate the authorization;</li>
          <li>reject publication;</li>
          <li>suspend or terminate the Owner Account;</li>
          <li>preserve all evidence;</li>
          <li>notify competent authorities where appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. LIMITATION OF RESPONSIBILITY</h2>
        <p style={pStyle}>
          Publication of a Diamond opportunity does not guarantee:
        </p>
        <ul style={ulStyle}>
          <li>offers;</li>
          <li>negotiations;</li>
          <li>sale of the property;</li>
          <li>completion of a transaction.</li>
        </ul>
        <p style={pStyle}>
          RealEstateSniper remains responsible only for the services provided through the
          Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. RECORDS</h2>
        <p style={pStyle}>
          Authorizations, approvals, revisions, withdrawals and related actions may be
          recorded within the Legal Evidence Engine for legal, contractual and evidentiary
          purposes.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>15. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Agreement becomes effective on the date specified in its published version.
        </p>
        <p style={pStyle}>
          Certain provisions may require adaptation before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

      </div>
    </LegalDocumentLayout>
  )
}
