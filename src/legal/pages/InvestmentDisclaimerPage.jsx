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

export default function InvestmentDisclaimerPage() {
  return (
    <LegalDocumentLayout
      title="Investment Disclaimer"
      subtitle="Important limitations regarding deal information and investment decisions."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Investment Disclaimer applies to all users accessing investment-related
          information through the RealEstateSniper Platform.
        </p>
        <p style={pStyle}>
          By using the Platform, users acknowledge and accept this Disclaimer.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. INFORMATION PURPOSE</h2>
        <p style={pStyle}>
          All information published by RealEstateSniper is provided solely for
          informational purposes.
        </p>
        <p style={pStyle}>Nothing contained on the Platform constitutes:</p>
        <ul style={ulStyle}>
          <li>investment advice;</li>
          <li>financial advice;</li>
          <li>legal advice;</li>
          <li>tax advice;</li>
          <li>accounting advice;</li>
          <li>brokerage services.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. NO RECOMMENDATION</h2>
        <p style={pStyle}>
          RealEstateSniper does not recommend that any user:
        </p>
        <ul style={ulStyle}>
          <li>purchase a property;</li>
          <li>sell a property;</li>
          <li>submit an offer;</li>
          <li>negotiate with an Owner;</li>
          <li>invest in any opportunity.</li>
        </ul>
        <p style={pStyle}>
          All decisions remain solely the responsibility of the user.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. NO GUARANTEE</h2>
        <p style={pStyle}>
          RealEstateSniper makes no guarantee regarding:
        </p>
        <ul style={ulStyle}>
          <li>profitability;</li>
          <li>future appreciation;</li>
          <li>investment performance;</li>
          <li>market conditions;</li>
          <li>resale value;</li>
          <li>rental income;</li>
          <li>financing availability.</li>
        </ul>
        <p style={pStyle}>
          Past performance does not guarantee future results.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. INDEPENDENT DUE DILIGENCE</h2>
        <p style={pStyle}>
          Before making any investment decision, every user should conduct independent due
          diligence.
        </p>
        <p style={pStyle}>Users are encouraged to consult qualified:</p>
        <ul style={ulStyle}>
          <li>attorneys;</li>
          <li>accountants;</li>
          <li>tax advisors;</li>
          <li>financial advisors;</li>
          <li>real estate professionals.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PROPERTY INFORMATION</h2>
        <p style={pStyle}>
          Although RealEstateSniper seeks to provide accurate information, errors, omissions
          or changes may occur.
        </p>
        <p style={pStyle}>
          Users remain responsible for independently verifying:
        </p>
        <ul style={ulStyle}>
          <li>ownership;</li>
          <li>title;</li>
          <li>liens;</li>
          <li>taxes;</li>
          <li>permits;</li>
          <li>zoning;</li>
          <li>valuations;</li>
          <li>market conditions.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. THIRD-PARTY INFORMATION</h2>
        <p style={pStyle}>
          Some information may originate from public records or third-party sources.
        </p>
        <p style={pStyle}>
          RealEstateSniper cannot guarantee the completeness or accuracy of third-party
          information.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. LIMITATION OF LIABILITY</h2>
        <p style={pStyle}>
          RealEstateSniper shall not be liable for investment losses, business losses or
          other damages arising from reliance on information provided through the Platform,
          except where liability cannot legally be excluded.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. CHANGES</h2>
        <p style={pStyle}>
          This Investment Disclaimer may be updated whenever necessary.
        </p>
        <p style={pStyle}>
          Material updates will be reflected within the Platform's legal documentation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Investment Disclaimer becomes effective on the date specified in its
          published version.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

      </div>
    </LegalDocumentLayout>
  )
}
