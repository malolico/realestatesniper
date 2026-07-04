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

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  margin: '28px 0',
}

export default function LegalDefinitionsPage() {
  return (
    <LegalDocumentLayout
      title="Legal Definitions"
      subtitle="Glossary of defined terms used across all legal documents."
    >
      <div style={sectionStyle}>

        <p style={pStyle}>
          These definitions apply throughout all legal documentation published by
          RealEstateSniper unless a document expressly provides otherwise.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Account</h2>
        <p style={pStyle}>
          A registered user account created within the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Administrator</h2>
        <p style={pStyle}>
          A user authorized by RealEstateSniper to administer the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Diamond</h2>
        <p style={pStyle}>
          A premium digital product providing access to verified property information
          subject to the Diamond Purchase Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Founder</h2>
        <p style={pStyle}>
          A user participating in the Founder Program under the applicable Founder Program
          Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Investor</h2>
        <p style={pStyle}>
          A user who accesses the Platform to evaluate opportunities, maintain a
          subscription and, where eligible, purchase Premium or Diamond opportunities.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Legal Evidence Engine</h2>
        <p style={pStyle}>
          The internal evidentiary system used by RealEstateSniper to record legally
          relevant events, including account creation, consent, authorizations, purchases,
          verifications, approvals, audit records and other evidence necessary for
          contractual, legal or regulatory purposes.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Marketplace</h2>
        <p style={pStyle}>
          The section of the Platform through which eligible users may access property
          opportunities and related digital products.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Owner</h2>
        <p style={pStyle}>
          A user who submits or manages one or more properties through the Platform under
          the Owner Agreement.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Owner Account</h2>
        <p style={pStyle}>
          The account through which an Owner accesses Owner services and manages Property
          Legal Files.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Platform</h2>
        <p style={pStyle}>
          The RealEstateSniper website, applications, databases, software, Marketplace,
          digital products, services, tools and related technologies.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Premium</h2>
        <p style={pStyle}>
          A digital product providing access to enhanced property information under the
          Premium Purchase Terms.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Property Legal File</h2>
        <p style={pStyle}>
          The complete legal and operational record relating to one specific property.
        </p>
        <p style={pStyle}>
          Each Property Legal File is independent and possesses its own verification
          history, authorizations, consents and Legal File ID.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Legal File ID</h2>
        <p style={pStyle}>
          The unique identifier assigned to each Property Legal File.
        </p>
        <p style={pStyle}>
          No Legal File ID may be reused for another property.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Subscriber</h2>
        <p style={pStyle}>
          A user with an active subscription that provides access to subscription services
          offered by the Platform.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Terms</h2>
        <p style={pStyle}>
          The complete body of legal documentation governing the use of the Platform,
          including the Terms of Service and all documents incorporated by reference.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>User</h2>
        <p style={pStyle}>
          Any person or legal entity accessing or using the Platform, including Visitors,
          Investors, Subscribers, Founders, Owners and Administrators.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>Visitor</h2>
        <p style={pStyle}>
          A person accessing the public areas of the Platform without the privileges granted
          to registered subscription users.
        </p>

      </div>
    </LegalDocumentLayout>
  )
}
