function NotConnected() {
  return <p>Not connected yet</p>
}

export default function SystemHealth({ systemHealth = null }) {
  const marketplace = systemHealth?.marketplace
  const lastUpdate = systemHealth?.lastUpdate
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2>System Health</h2>

      <section>
        <h3>Stripe</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Supabase</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Edge Functions</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Marketplace</h3>
        <p>Marketplace Ready: {marketplace?.ready === true ? 'Yes' : 'No'}</p>
      </section>

      <section>
        <h3>Factory</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Email Services</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Storage</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Backups</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Cron Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Webhooks</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Performance</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Latency</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Errors</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Warnings</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
