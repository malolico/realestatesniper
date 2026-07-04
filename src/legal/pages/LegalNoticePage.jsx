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

export default function LegalNoticePage() {
  return (
    <LegalDocumentLayout
      title="Legal Notice / Contact"
      subtitle="Company information and legal contact details."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Legal Notice provides general legal information regarding the operation of
          the RealEstateSniper Platform.
        </p>
        <p style={pStyle}>
          It forms part of the Platform's legal documentation and should be read together
          with all other applicable legal documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PLATFORM OPERATOR</h2>
        <p style={pStyle}>
          RealEstateSniper is operated by the legal entity identified in the official
          published version of this Legal Notice.
        </p>
        <p style={pStyle}>
          Corporate information will be completed before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. CONTACT INFORMATION</h2>
        <p style={pStyle}>
          Official contact information will be published before launch and may include:
        </p>
        <ul style={ulStyle}>
          <li>Legal contact email.</li>
          <li>General support email.</li>
          <li>Business address where legally required.</li>
          <li>Other official communication channels.</li>
        </ul>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PURPOSE OF THE PLATFORM</h2>
        <p style={pStyle}>
          RealEstateSniper is a technology platform that provides digital services relating
          to real estate opportunities.
        </p>
        <p style={pStyle}>The Platform:</p>
        <ul style={ulStyle}>
          <li>organizes information;</li>
          <li>verifies information where applicable;</li>
          <li>provides digital access to information;</li>
          <li>facilitates communication through its authorized processes.</li>
        </ul>
        <p style={pStyle}>The Platform does not operate as:</p>
        <ul style={ulStyle}>
          <li>a real estate broker;</li>
          <li>a real estate agent;</li>
          <li>a listing service;</li>
          <li>a law firm;</li>
          <li>an investment advisory firm.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. INTELLECTUAL PROPERTY</h2>
        <p style={pStyle}>
          Unless otherwise indicated, all Platform content, including software, databases,
          text, graphics, trademarks, logos, documentation, interfaces and proprietary
          materials, belongs to RealEstateSniper or its licensors.
        </p>
        <p style={pStyle}>
          Unauthorized use is prohibited.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. LIMITATION OF LIABILITY</h2>
        <p style={pStyle}>
          RealEstateSniper shall not be responsible for decisions made by users based on
          information obtained through the Platform.
        </p>
        <p style={pStyle}>
          Users remain solely responsible for conducting their own independent due diligence
          before entering into any transaction.
        </p>
        <p style={pStyle}>
          Nothing in this Legal Notice excludes liability where exclusion is prohibited by
          applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. THIRD-PARTY SERVICES</h2>
        <p style={pStyle}>
          The Platform may integrate third-party services necessary for its operation.
        </p>
        <p style={pStyle}>
          Those services remain governed by their own legal documentation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. APPLICABLE LAW</h2>
        <p style={pStyle}>
          The governing law and jurisdiction applicable to the Platform will be specified
          before public launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. UPDATES</h2>
        <p style={pStyle}>
          This Legal Notice may be updated whenever reasonably necessary to reflect legal,
          technical or operational changes.
        </p>
        <p style={pStyle}>
          Material updates will be implemented in accordance with applicable law.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Legal Notice becomes effective on the date specified in its published
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
