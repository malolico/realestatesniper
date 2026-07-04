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

export default function RefundPolicyPage() {
  return (
    <LegalDocumentLayout
      title="Refund Policy"
      subtitle="Conditions and procedures for purchase refunds."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          This Refund Policy explains when refunds may or may not be available for products
          and services offered by RealEstateSniper.
        </p>
        <p style={pStyle}>
          This Policy forms part of the Terms of Service and all other applicable Platform
          documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. DIGITAL SERVICES</h2>
        <p style={pStyle}>
          Most products offered through the Platform are digital products or digital
          services.
        </p>
        <p style={pStyle}>
          Access to digital content may be provided immediately after payment.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. SUBSCRIPTIONS</h2>
        <p style={pStyle}>
          Subscription fees cover access to subscription services during the applicable
          billing period.
        </p>
        <p style={pStyle}>
          Unless required by applicable law, subscription fees already charged are
          non-refundable.
        </p>
        <p style={pStyle}>
          Cancellation prevents future renewals but does not generate refunds for the
          current billing period.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. PREMIUM PURCHASES</h2>
        <p style={pStyle}>
          Premium opportunities are digital products.
        </p>
        <p style={pStyle}>
          Once access to the purchased information has been granted, the purchase becomes
          final.
        </p>
        <p style={pStyle}>
          No refunds will be issued after delivery except where required by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. DIAMOND PURCHASES</h2>
        <p style={pStyle}>
          Diamond opportunities are digital products.
        </p>
        <p style={pStyle}>
          Access is provided immediately after successful purchase.
        </p>
        <p style={pStyle}>
          Once access has been granted, no refunds will be available except where required
          by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. PAYMENT ERRORS</h2>
        <p style={pStyle}>
          If a duplicate payment, technical billing error or other payment processing error
          occurs, RealEstateSniper may investigate the matter and issue an appropriate
          correction where justified.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. FRAUD</h2>
        <p style={pStyle}>
          Refund requests arising from fraudulent activity, abuse of the Platform or
          violations of applicable Platform documents may be denied.
        </p>
        <p style={pStyle}>
          RealEstateSniper reserves the right to investigate any suspicious refund request.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. CHARGEBACKS</h2>
        <p style={pStyle}>
          Users are encouraged to contact RealEstateSniper before initiating a chargeback
          with their payment provider.
        </p>
        <p style={pStyle}>
          Fraudulent or abusive chargebacks may result in:
        </p>
        <ul style={ulStyle}>
          <li>suspension of the account;</li>
          <li>permanent termination of Platform access;</li>
          <li>recovery actions where legally permitted.</li>
        </ul>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. STATUTORY RIGHTS</h2>
        <p style={pStyle}>
          Nothing in this Policy limits any mandatory consumer rights granted under
          applicable law.
        </p>
        <p style={pStyle}>
          Where the law provides non-waivable refund rights, those rights shall prevail.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. RELATIONSHIP WITH OTHER DOCUMENTS</h2>
        <p style={pStyle}>This Policy shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Subscriber Terms;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>Privacy Policy;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          This Refund Policy becomes effective on the date specified in its published
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
