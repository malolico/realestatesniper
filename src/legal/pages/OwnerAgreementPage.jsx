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

export default function OwnerAgreementPage() {
  return (
    <LegalDocumentLayout
      title="Owner Agreement"
      subtitle="Terms for property owners using the Owner Portal."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Owner Agreement governs the relationship between RealEstateSniper and every
          user acting as an Owner through the Platform.
        </p>
        <p style={pStyle}>
          This Agreement applies in addition to the Terms of Service, Privacy Policy and
          all other applicable Platform documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          The purpose of this Agreement is to regulate the participation of Owners in the
          Platform and the management of Property Legal Files.
        </p>
        <p style={pStyle}>
          This Agreement does not create a brokerage relationship, agency relationship,
          representation agreement or mandate.
        </p>
        <p style={pStyle}>
          RealEstateSniper provides a technology platform and related verification services
          only.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. OWNER ACCOUNT</h2>
        <p style={pStyle}>
          Each Owner may maintain only one active Owner Account.
        </p>
        <p style={pStyle}>
          The Owner Account is personal, unique and non-transferable.
        </p>
        <p style={pStyle}>
          An Owner Account may manage multiple properties.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PROPERTY LEGAL FILES</h2>
        <p style={pStyle}>
          Each property constitutes an independent Property Legal File.
        </p>
        <p style={pStyle}>Each file has its own:</p>
        <ul style={ulStyle}>
          <li>Legal File ID;</li>
          <li>verification process;</li>
          <li>authorizations;</li>
          <li>consents;</li>
          <li>supporting documentation;</li>
          <li>legal history.</li>
        </ul>
        <p style={pStyle}>
          No Property Legal File may be reused for another property.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. OWNER DECLARATIONS</h2>
        <p style={pStyle}>
          By submitting a property, the Owner declares that:
        </p>
        <ul style={ulStyle}>
          <li>the information provided is accurate;</li>
          <li>the documentation is authentic;</li>
          <li>the Owner has the legal authority to act regarding the property;</li>
          <li>all submitted information is provided in good faith.</li>
        </ul>
        <p style={pStyle}>
          Providing false information constitutes a material breach of this Agreement.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. OWNERSHIP VERIFICATION</h2>
        <p style={pStyle}>
          RealEstateSniper may require any documentation reasonably necessary to verify:
        </p>
        <ul style={ulStyle}>
          <li>ownership;</li>
          <li>authority;</li>
          <li>legal representation;</li>
          <li>authorization to act.</li>
        </ul>
        <p style={pStyle}>
          Submission of documentation does not guarantee acceptance into the Marketplace.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. PROPERTY REVIEW</h2>
        <p style={pStyle}>
          Every property submitted to the Platform is independently reviewed.
        </p>
        <p style={pStyle}>The review process may include:</p>
        <ul style={ulStyle}>
          <li>identity verification;</li>
          <li>ownership verification;</li>
          <li>public record verification;</li>
          <li>property verification;</li>
          <li>AI-assisted verification;</li>
          <li>administrative review.</li>
        </ul>
        <p style={pStyle}>
          RealEstateSniper may request additional information whenever reasonably necessary.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. OWNER RIGHTS</h2>
        <p style={pStyle}>Owners may:</p>
        <ul style={ulStyle}>
          <li>review property information;</li>
          <li>request corrections;</li>
          <li>approve or reject proposed information;</li>
          <li>determine the maximum number of Diamond Investors;</li>
          <li>decide whether to authorize publication as a Diamond opportunity.</li>
        </ul>
        <p style={pStyle}>
          All rights remain subject to Platform procedures.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. OWNER RESPONSIBILITIES</h2>
        <p style={pStyle}>Owners agree to:</p>
        <ul style={ulStyle}>
          <li>cooperate during verification;</li>
          <li>provide truthful information;</li>
          <li>notify relevant changes affecting submitted properties;</li>
          <li>avoid fraudulent conduct;</li>
          <li>comply with Platform documentation.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. MULTIPLE OWNERS</h2>
        <p style={pStyle}>
          Where multiple persons or entities hold rights over a property, the submitting
          Owner must demonstrate sufficient legal authority to act.
        </p>
        <p style={pStyle}>
          RealEstateSniper may reject any submission where authority cannot be reasonably
          verified.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. FRAUD</h2>
        <p style={pStyle}>
          If fraud, forgery, identity misuse or material misrepresentation is detected,
          RealEstateSniper may:
        </p>
        <ul style={ulStyle}>
          <li>reject the property;</li>
          <li>suspend the Owner Account;</li>
          <li>permanently terminate Platform access;</li>
          <li>retain all relevant evidence;</li>
          <li>report the matter to competent authorities where legally appropriate.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. ACCOUNT CLOSURE</h2>
        <p style={pStyle}>
          Owners may request closure of their Owner Account.
        </p>
        <p style={pStyle}>
          Where active Property Legal Files remain open, RealEstateSniper may postpone
          permanent account closure until those files have been properly concluded.
        </p>
        <p style={pStyle}>
          Legal records may continue to be retained in accordance with applicable law and
          the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. LIMITATION OF PLATFORM RESPONSIBILITY</h2>
        <p style={pStyle}>RealEstateSniper does not guarantee:</p>
        <ul style={ulStyle}>
          <li>acceptance of any property;</li>
          <li>publication in the Marketplace;</li>
          <li>sale of any property;</li>
          <li>receipt of offers;</li>
          <li>successful negotiations;</li>
          <li>completion of any transaction.</li>
        </ul>
        <p style={pStyle}>
          The Platform remains responsible only for its own services and procedures.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. GOVERNING DOCUMENTS</h2>
        <p style={pStyle}>
          This Agreement forms part of the complete legal framework of RealEstateSniper and
          shall be interpreted together with:
        </p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Marketplace Rules;</li>
          <li>Diamond Authorization;</li>
          <li>other applicable Platform documents.</li>
        </ul>

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
