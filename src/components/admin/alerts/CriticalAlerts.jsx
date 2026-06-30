function formatMetric(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return String(value)
}

function NotConnected() {
  return <p>Not connected yet</p>
}

export default function CriticalAlerts({ criticalAlerts = null }) {
  const stripe = criticalAlerts?.stripe
  const webhooks = criticalAlerts?.webhooks
  const subscriptions = criticalAlerts?.subscriptions
  const payments = criticalAlerts?.payments
  const ownerQueue = criticalAlerts?.ownerQueue
  const factory = criticalAlerts?.factory
  const supabase = criticalAlerts?.supabase
  const emails = criticalAlerts?.emails
  const security = criticalAlerts?.security
  const system = criticalAlerts?.system
  const lastUpdate = criticalAlerts?.lastUpdate
  const warnings = criticalAlerts?.warnings

  return (
    <section>
      <h2>Critical Alerts</h2>

      <section>
        <h3>Stripe</h3>
        {stripe?.available === true ? <p>Stripe alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Webhooks</h3>
        {webhooks?.available === true ? <p>Webhook alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Subscriptions</h3>
        {subscriptions?.available === true ? (
          <p>Subscription alerts will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Payments</h3>
        {payments?.available === true ? <p>Payment alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Owner Queue</h3>
        {ownerQueue?.available === true ? (
          <p>Owner queue alerts will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Factory</h3>
        {factory?.available === true ? <p>Factory alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Supabase</h3>
        {supabase?.available === true ? <p>Supabase alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Emails</h3>
        {emails?.available === true ? <p>Email alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Security</h3>
        {security?.available === true ? <p>Security alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>System</h3>
        {system?.available === true ? <p>System alerts will appear here.</p> : <NotConnected />}
      </section>

      <section>
        <h3>Last Update</h3>
        <ul>
          <li>Marketplace Empty: {warnings?.marketplaceEmpty === true ? 'Yes' : 'No'}</li>
          <li>Admin Panel Error: {formatMetric(warnings?.adminPanelError)}</li>
          <li>
            Marketplace Ready: {lastUpdate?.marketplaceReady === true ? 'Yes' : 'No'}
          </li>
        </ul>
      </section>
    </section>
  )
}
