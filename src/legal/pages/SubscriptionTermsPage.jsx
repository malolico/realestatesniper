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

export default function SubscriptionTermsPage() {
  return (
    <LegalDocumentLayout
      title="Subscriber Terms"
      subtitle="Terms governing subscriber membership and recurring platform access."
    >
      <div style={sectionStyle}>

        <h2 style={h2Style}>1. INTRODUCTION</h2>
        <p style={pStyle}>
          These Subscriber Terms govern subscription services offered by RealEstateSniper.
        </p>
        <p style={pStyle}>
          They apply together with the Terms of Service and all other applicable Platform
          documents.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>2. PURPOSE</h2>
        <p style={pStyle}>
          A subscription grants eligible users access to the subscription features offered
          by the Platform during the active subscription period.
        </p>
        <p style={pStyle}>
          The subscription does not include ownership of the Platform or any property.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>3. ELIGIBILITY</h2>
        <p style={pStyle}>
          Only registered users who successfully complete the subscription process may
          become Subscribers.
        </p>
        <p style={pStyle}>
          RealEstateSniper may refuse or cancel subscriptions where Platform requirements
          are not satisfied.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>4. SUBSCRIPTION ACTIVATION</h2>
        <p style={pStyle}>A subscription becomes active only after:</p>
        <ul style={ulStyle}>
          <li>successful payment;</li>
          <li>confirmation by the payment provider;</li>
          <li>activation by the Platform.</li>
        </ul>
        <p style={pStyle}>
          Access begins only after activation.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>5. SUBSCRIPTION BENEFITS</h2>
        <p style={pStyle}>
          During an active subscription, Subscribers may access the services included in
          their subscription plan.
        </p>
        <p style={pStyle}>Subscription benefits may include:</p>
        <ul style={ulStyle}>
          <li>access to subscriber-only Marketplace information;</li>
          <li>eligibility to purchase Premium opportunities;</li>
          <li>eligibility to purchase Diamond opportunities;</li>
          <li>other services announced by the Platform.</li>
        </ul>
        <p style={pStyle}>
          Access remains subject to Platform availability.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>6. RENEWAL</h2>
        <p style={pStyle}>
          Subscriptions renew according to the billing cycle selected during purchase unless
          cancelled in accordance with the applicable procedures.
        </p>
        <p style={pStyle}>
          Failure to complete renewal payment may result in suspension of subscription
          benefits.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>7. CANCELLATION</h2>
        <p style={pStyle}>
          Subscribers may cancel future renewals at any time.
        </p>
        <p style={pStyle}>
          Cancellation does not automatically generate refunds for subscription periods
          already paid, except where required by applicable law.
        </p>
        <div style={draftNoticeStyle}>Revisión obligatoria por abogado de EE. UU.</div>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>8. ACCOUNT STATUS</h2>
        <p style={pStyle}>
          Subscriber accounts may transition between different statuses depending on
          subscription activity, payment status or Platform rules.
        </p>
        <p style={pStyle}>
          Changes of status may affect access to subscription services.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>9. USER RESPONSIBILITIES</h2>
        <p style={pStyle}>Subscribers agree to:</p>
        <ul style={ulStyle}>
          <li>maintain accurate account information;</li>
          <li>protect account credentials;</li>
          <li>use subscription services lawfully;</li>
          <li>comply with all Platform documentation;</li>
          <li>avoid unauthorized sharing of subscriber access.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>10. SUSPENSION</h2>
        <p style={pStyle}>
          RealEstateSniper may suspend subscription access where:
        </p>
        <ul style={ulStyle}>
          <li>payment obligations are not fulfilled;</li>
          <li>fraudulent activity is detected;</li>
          <li>Platform security is compromised;</li>
          <li>these Terms or other Platform documents are materially violated.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>11. RECORDS</h2>
        <p style={pStyle}>
          Subscription activations, renewals, cancellations, payment confirmations and
          account status changes may be retained within the Legal Evidence Engine.
        </p>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>12. GOVERNING DOCUMENTS</h2>
        <p style={pStyle}>These Terms shall be interpreted together with:</p>
        <ul style={ulStyle}>
          <li>Terms of Service;</li>
          <li>Privacy Policy;</li>
          <li>Marketplace Rules;</li>
          <li>Refund Policy;</li>
          <li>Premium Purchase Terms;</li>
          <li>Diamond Purchase Terms;</li>
          <li>all other applicable Platform documents.</li>
        </ul>

        <hr style={dividerStyle} />

        <h2 style={h2Style}>13. EFFECTIVE DATE</h2>
        <p style={pStyle}>
          These Subscriber Terms become effective on the date specified in their published
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
