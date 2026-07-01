function NotConnected() {
  return <p>Not connected yet</p>
}

export default function AuditSecurityBlackBox({ auditSecurity = null }) {
  const lastUpdate = auditSecurity?.lastUpdate
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Audit & Security Black Box</h2>

      <section>
        <h3>Authentication Events</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Payments</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Subscriptions</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Role Changes</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Owner Activity</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Factory Activity</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Admin Actions</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Security Events</h3>
        <NotConnected />
      </section>

      <section>
        <h3>System Events</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Request IDs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
