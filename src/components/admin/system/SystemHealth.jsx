function NotConnected() {
  return <p>Not connected yet</p>
}

const statusStyles = {
  ready: { color: '#86efac', fontWeight: 700 },
  loaded: { color: '#86efac', fontWeight: 700 },
  active: { color: '#86efac', fontWeight: 700 },
  loading: { color: '#cbd5e1', fontWeight: 700 },
  empty: { color: '#fbbf24', fontWeight: 700 },
  error: { color: '#fca5a5', fontWeight: 700 },
  idle: { color: '#94a3b8' },
}

function HealthStatus({ status, label, detail }) {
  return (
    <p style={statusStyles[status] || statusStyles.idle}>
      {label}
      {detail ? ` — ${detail}` : ''}
    </p>
  )
}

function getMarketplaceHealth(marketplace) {
  if (marketplace?.loading === true) {
    return { status: 'loading', label: 'Loading', detail: 'Marketplace data is loading.' }
  }

  if (marketplace?.ready === true && marketplace?.empty === true) {
    return { status: 'empty', label: 'Empty', detail: 'Marketplace is ready but has no deals.' }
  }

  if (marketplace?.ready === true) {
    return { status: 'ready', label: 'Ready', detail: 'Marketplace data is ready.' }
  }

  return { status: 'idle', label: 'Not ready', detail: 'Marketplace data is not ready yet.' }
}

function getPurchaseHealth(purchases) {
  if (purchases?.loaded === true) {
    return { status: 'loaded', label: 'Loaded', detail: 'Purchase data is available.' }
  }

  return { status: 'idle', label: 'Not loaded', detail: 'Purchase data is not available yet.' }
}

function getUserDirectoryHealth(userDirectory) {
  if (userDirectory?.loading === true) {
    return { status: 'loading', label: 'Loading', detail: 'User directory is loading.' }
  }

  if (userDirectory?.error) {
    return { status: 'error', label: 'Error', detail: String(userDirectory.error) }
  }

  if (userDirectory?.loaded === true) {
    return { status: 'loaded', label: 'Loaded', detail: 'User directory is available.' }
  }

  return { status: 'idle', label: 'Not loaded', detail: 'User directory is not available yet.' }
}

function getAdminWorkspaceHealth(adminWorkspace) {
  if (adminWorkspace?.active === true) {
    const email = adminWorkspace?.adminEmail
    const label = adminWorkspace?.label || 'Admin Workspace'

    return {
      status: 'active',
      label: 'Active',
      detail: email ? `${label} (${email})` : label,
    }
  }

  return { status: 'idle', label: 'Inactive', detail: 'Admin workspace is not active.' }
}

export default function SystemHealth({ systemHealth = null }) {
  const marketplaceHealth = getMarketplaceHealth(systemHealth?.marketplace)
  const purchaseHealth = getPurchaseHealth(systemHealth?.purchases)
  const userDirectoryHealth = getUserDirectoryHealth(systemHealth?.userDirectory)
  const adminWorkspaceHealth = getAdminWorkspaceHealth(systemHealth?.adminWorkspace)

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>System Health</h2>

      <section>
        <h3>Admin Workspace</h3>
        <HealthStatus
          status={adminWorkspaceHealth.status}
          label={adminWorkspaceHealth.label}
          detail={adminWorkspaceHealth.detail}
        />
      </section>

      <section>
        <h3>Marketplace</h3>
        <HealthStatus
          status={marketplaceHealth.status}
          label={marketplaceHealth.label}
          detail={marketplaceHealth.detail}
        />
      </section>

      <section>
        <h3>Purchase Data</h3>
        <HealthStatus
          status={purchaseHealth.status}
          label={purchaseHealth.label}
          detail={purchaseHealth.detail}
        />
      </section>

      <section>
        <h3>User Directory</h3>
        <HealthStatus
          status={userDirectoryHealth.status}
          label={userDirectoryHealth.label}
          detail={userDirectoryHealth.detail}
        />
      </section>

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
    </section>
  )
}
