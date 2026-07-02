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
  const warnings = criticalAlerts?.warnings

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Critical Alerts</h2>

      <section>
        <h3>Active Warnings</h3>
        <ul>
          <li>Marketplace Empty: {warnings?.marketplaceEmpty === true ? 'Yes' : 'No'}</li>
          <li>Founders Cohort Full: {warnings?.foundersCohortFull === true ? 'Yes' : 'No'}</li>
          <li>Admin Panel Error: {formatMetric(warnings?.adminPanelError)}</li>
          <li>User Directory Loaded: {warnings?.userDirectoryLoaded === true ? 'Yes' : 'No'}</li>
        </ul>
      </section>

      <section>
        <h3>Stripe</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Webhooks</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Subscriptions</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Payments</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Owner Queue</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Factory</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Supabase</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Emails</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Security</h3>
        <NotConnected />
      </section>

      <section>
        <h3>System</h3>
        <NotConnected />
      </section>
    </section>
  )
}
