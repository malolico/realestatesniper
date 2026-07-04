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

export default function CookiePolicyPage() {
  return (
    <LegalDocumentLayout
      title="Cookie Policy"
      subtitle="Information about cookies and similar technologies on this site."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Cookie Policy explains how RealEstateSniper uses cookies and similar
          technologies when users access the Platform.
        </p>
        <p style={pStyle}>
          This Policy should be read together with the Privacy Policy and the Terms of
          Service.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. WHAT ARE COOKIES</h2>
        <p style={pStyle}>
          Cookies are small text files stored on a user&apos;s device that allow the
          Platform to operate correctly, maintain secure sessions and remember certain user
          preferences.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. COOKIES USED BY REALESTATESNIPER</h2>
        <p style={pStyle}>
          At launch, RealEstateSniper uses only cookies that are strictly necessary for the
          operation of the Platform.
        </p>
        <p style={pStyle}>These may include:</p>
        <ul style={ulStyle}>
          <li>Authentication cookies.</li>
          <li>Session management cookies.</li>
          <li>Security cookies.</li>
          <li>Login protection cookies.</li>
          <li>Technical preference cookies.</li>
          <li>Load balancing cookies where applicable.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. COOKIES NOT USED</h2>
        <p style={pStyle}>
          At launch, RealEstateSniper does not use cookies for:
        </p>
        <ul style={ulStyle}>
          <li>advertising;</li>
          <li>behavioral profiling;</li>
          <li>remarketing;</li>
          <li>third-party advertising networks;</li>
          <li>marketing analytics not essential for Platform operation.</li>
        </ul>
        <p style={pStyle}>
          If additional categories of cookies are introduced in the future, this Policy will
          be updated accordingly.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. PURPOSE OF NECESSARY COOKIES</h2>
        <p style={pStyle}>
          Necessary cookies are used exclusively to:
        </p>
        <ul style={ulStyle}>
          <li>authenticate users;</li>
          <li>maintain secure sessions;</li>
          <li>protect user accounts;</li>
          <li>prevent fraud;</li>
          <li>ensure proper Platform functionality;</li>
          <li>remember essential technical preferences.</li>
        </ul>
        <p style={pStyle}>
          Without these cookies, certain Platform functions may not operate correctly.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. COOKIE MANAGEMENT</h2>
        <p style={pStyle}>
          Most web browsers allow users to block or delete cookies.
        </p>
        <p style={pStyle}>
          However, disabling necessary cookies may prevent some parts of the Platform from
          functioning properly.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. THIRD-PARTY COOKIES</h2>
        <p style={pStyle}>
          Certain integrated third-party service providers may place their own necessary
          cookies in connection with services such as:
        </p>
        <ul style={ulStyle}>
          <li>authentication;</li>
          <li>payment processing;</li>
          <li>security services;</li>
          <li>infrastructure services.</li>
        </ul>
        <p style={pStyle}>
          Such cookies remain subject to the privacy policies of the respective providers.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. POLICY UPDATES</h2>
        <p style={pStyle}>
          This Cookie Policy may be updated whenever necessary to reflect legal, technical
          or operational changes.
        </p>
        <p style={pStyle}>
          Where required by law, users will be informed before material changes become
          effective.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. CONTACT</h2>
        <p style={pStyle}>
          Questions regarding this Cookie Policy may be submitted through the official
          contact channels published by RealEstateSniper before launch.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Cookie Policy becomes effective on the date specified in its published
          version and forms part of the legal documentation governing the use of the
          Platform.
        </p>

      </div>
    </LegalDocumentLayout>
  )
}
