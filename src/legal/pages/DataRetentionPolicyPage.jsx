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

export default function DataRetentionPolicyPage() {
  return (
    <LegalDocumentLayout
      title="Data Retention Policy"
      subtitle="How long personal and platform data is stored and when it is deleted."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Data Retention Policy explains how RealEstateSniper retains, manages and
          securely disposes of information collected through the Platform.
        </p>
        <p style={pStyle}>
          This Policy forms part of the Platform's legal documentation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          The purpose of this Policy is to ensure that information is retained only for
          legitimate legal, contractual, operational and security purposes.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. INFORMATION COVERED</h2>
        <p style={pStyle}>
          This Policy applies to information including, but not limited to:
        </p>
        <ul style={ulStyle}>
          <li>account information;</li>
          <li>Owner records;</li>
          <li>Investor records;</li>
          <li>Property Legal Files;</li>
          <li>subscription records;</li>
          <li>payment records;</li>
          <li>verification records;</li>
          <li>consent records;</li>
          <li>authorization records;</li>
          <li>Marketplace activity;</li>
          <li>audit logs;</li>
          <li>Legal Evidence Engine records.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. RETENTION PRINCIPLES</h2>
        <p style={pStyle}>
          RealEstateSniper retains information only for purposes such as:
        </p>
        <ul style={ulStyle}>
          <li>providing Platform services;</li>
          <li>complying with legal obligations;</li>
          <li>preventing fraud;</li>
          <li>resolving disputes;</li>
          <li>protecting Platform security;</li>
          <li>maintaining evidentiary records;</li>
          <li>enforcing contractual rights.</li>
        </ul>
        <p style={pStyle}>
          Information will not be retained longer than reasonably necessary, except where
          longer retention is required by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. LEGAL EVIDENCE ENGINE</h2>
        <p style={pStyle}>
          Records stored within the Legal Evidence Engine may be retained for evidentiary
          purposes where necessary to:
        </p>
        <ul style={ulStyle}>
          <li>demonstrate user consent;</li>
          <li>verify contractual acceptance;</li>
          <li>document Platform actions;</li>
          <li>investigate fraud;</li>
          <li>respond to legal claims;</li>
          <li>comply with legal obligations.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. ACCOUNT CLOSURE</h2>
        <p style={pStyle}>
          Closing an account does not automatically require deletion of all related records.
        </p>
        <p style={pStyle}>
          Certain information may continue to be retained where necessary for:
        </p>
        <ul style={ulStyle}>
          <li>legal compliance;</li>
          <li>contractual obligations;</li>
          <li>fraud prevention;</li>
          <li>dispute resolution;</li>
          <li>evidentiary purposes.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. DELETION REQUESTS</h2>
        <p style={pStyle}>
          Where applicable law grants deletion rights, RealEstateSniper will evaluate each
          request individually.
        </p>
        <p style={pStyle}>
          Deletion may be refused where continued retention is legally required or otherwise
          permitted by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. SECURITY</h2>
        <p style={pStyle}>
          Retained information will remain subject to the Platform's security measures
          throughout the applicable retention period.
        </p>
        <p style={pStyle}>
          Reasonable technical and organizational safeguards will continue to apply until
          lawful deletion.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. POLICY UPDATES</h2>
        <p style={pStyle}>
          This Policy may be updated whenever necessary to reflect legal, operational or
          technical changes.
        </p>
        <p style={pStyle}>
          Material updates will be implemented in accordance with applicable law.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Data Retention Policy becomes effective on the date specified in its
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
