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
  color: '#ffffff',
  fontSize: '1.05rem',
  fontWeight: 700,
  margin: '24px 0 8px',
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

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      title="Privacy Policy"
      subtitle="How RealEstateSniper collects, uses, and protects personal data."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          RealEstateSniper respects your privacy and is committed to protecting your
          personal information.
        </p>
        <p style={pStyle}>
          This Privacy Policy explains how the Platform collects, uses, stores, protects
          and, where applicable, shares personal information.
        </p>
        <p style={pStyle}>
          By using the Platform, you acknowledge this Privacy Policy.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. SCOPE</h2>
        <p style={pStyle}>
          This Privacy Policy applies to all users of the Platform, including:
        </p>
        <ul style={ulStyle}>
          <li>Visitors</li>
          <li>Investors</li>
          <li>Founders</li>
          <li>Subscribers</li>
          <li>Owners</li>
          <li>Administrators</li>
        </ul>
        <p style={pStyle}>
          Different services may require the collection of different categories of
          information.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. INFORMATION WE COLLECT</h2>
        <p style={pStyle}>
          Depending on the services used, RealEstateSniper may collect:
        </p>

        <h3 style={h3Style}>Account Information</h3>
        <ul style={ulStyle}>
          <li>Name</li>
          <li>Email address</li>
          <li>Password (encrypted)</li>
          <li>Telephone number</li>
          <li>Account type</li>
        </ul>

        <h3 style={h3Style}>Identity Verification Information</h3>
        <p style={pStyle}>Where required:</p>
        <ul style={ulStyle}>
          <li>Identity verification documents</li>
          <li>Ownership verification documents</li>
          <li>Authorization documents</li>
        </ul>

        <h3 style={h3Style}>Property Information</h3>
        <p style={pStyle}>Owners may provide:</p>
        <ul style={ulStyle}>
          <li>Property details</li>
          <li>Supporting documentation</li>
          <li>Ownership information</li>
          <li>Authorization records</li>
        </ul>

        <h3 style={h3Style}>Payment Information</h3>
        <p style={pStyle}>
          Payments are processed through authorized third-party payment providers.
        </p>
        <p style={pStyle}>
          RealEstateSniper does not store complete payment card information.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. INFORMATION COLLECTED AUTOMATICALLY</h2>
        <p style={pStyle}>
          The Platform may automatically collect technical information including:
        </p>
        <ul style={ulStyle}>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>Session information</li>
          <li>Security logs</li>
          <li>Authentication records</li>
        </ul>
        <p style={pStyle}>
          Only information necessary for Platform operation and security will be collected.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. HOW WE USE INFORMATION</h2>
        <p style={pStyle}>Personal information may be used to:</p>
        <ul style={ulStyle}>
          <li>Create accounts.</li>
          <li>Authenticate users.</li>
          <li>Provide Platform services.</li>
          <li>Verify Owners.</li>
          <li>Verify authorizations.</li>
          <li>Operate subscriptions.</li>
          <li>Deliver Premium and Diamond products.</li>
          <li>Improve Platform security.</li>
          <li>Prevent fraud.</li>
          <li>Comply with legal obligations.</li>
          <li>Operate the Legal Evidence Engine.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. LEGAL BASIS</h2>
        <p style={pStyle}>
          Personal information is processed only when an appropriate legal basis exists,
          including:
        </p>
        <ul style={ulStyle}>
          <li>user consent;</li>
          <li>contract performance;</li>
          <li>legal obligations;</li>
          <li>legitimate business interests where permitted by law.</li>
        </ul>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. INFORMATION SHARING</h2>
        <p style={pStyle}>
          RealEstateSniper does not sell personal information.
        </p>
        <p style={pStyle}>
          Information may only be shared when necessary with:
        </p>
        <ul style={ulStyle}>
          <li>payment providers;</li>
          <li>identity verification providers;</li>
          <li>cloud infrastructure providers;</li>
          <li>legal advisors;</li>
          <li>government authorities where legally required.</li>
        </ul>
        <p style={pStyle}>
          Third parties shall receive only the information necessary for their services.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. DATA SECURITY</h2>
        <p style={pStyle}>
          RealEstateSniper implements reasonable technical and organizational measures to
          protect personal information.
        </p>
        <p style={pStyle}>
          Although reasonable security measures are applied, no electronic system can
          guarantee absolute security.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. DATA RETENTION</h2>
        <p style={pStyle}>
          Personal information will be retained only for as long as necessary to:
        </p>
        <ul style={ulStyle}>
          <li>provide services;</li>
          <li>comply with legal obligations;</li>
          <li>resolve disputes;</li>
          <li>prevent fraud;</li>
          <li>preserve evidence within the Legal Evidence Engine.</li>
        </ul>
        <p style={pStyle}>
          Specific retention periods are defined in the Data Retention Policy.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. USER RIGHTS</h2>
        <p style={pStyle}>
          Where applicable under relevant law, users may have the right to:
        </p>
        <ul style={ulStyle}>
          <li>access their personal information;</li>
          <li>request correction;</li>
          <li>request deletion;</li>
          <li>request restriction of processing;</li>
          <li>request data portability;</li>
          <li>withdraw consent where processing is based on consent.</li>
        </ul>
        <p style={pStyle}>
          Certain rights may be limited where legal obligations require continued retention.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. INTERNATIONAL DATA TRANSFERS</h2>
        <p style={pStyle}>
          Where personal information is transferred internationally, RealEstateSniper will
          implement appropriate safeguards as required by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. CHILDREN</h2>
        <p style={pStyle}>
          The Platform is intended exclusively for adults.
        </p>
        <p style={pStyle}>
          Persons under eighteen (18) years of age may not create accounts.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. CHANGES TO THIS POLICY</h2>
        <p style={pStyle}>
          This Privacy Policy may be updated when necessary.
        </p>
        <p style={pStyle}>
          Where required by law, users will be asked to accept material changes affecting
          their rights.
        </p>
        <p style={pStyle}>
          Previous versions may be retained within the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>14. CONTACT</h2>
        <p style={pStyle}>
          Privacy-related requests may be submitted through the official contact channels
          published by RealEstateSniper before launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>15. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Privacy Policy becomes effective on the date specified in its published
          version and forms part of the legal documentation governing the use of the
          Platform.
        </p>

      </div>
    </LegalDocumentLayout>
  )
}
