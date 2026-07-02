function formatCount(value) {
  if (value === null || value === undefined) {
    return 'Not available'
  }

  return String(value)
}

function formatCell(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  return String(value)
}

function formatSubscriptionStatus(subscriptionActive) {
  if (subscriptionActive === true) {
    return 'Active'
  }

  if (subscriptionActive === false) {
    return 'Inactive'
  }

  return '—'
}

const tableHeaderStyle = {
  textAlign: 'left',
  padding: '12px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8',
  fontSize: '0.85rem',
  fontWeight: 800,
}

const tableCellStyle = {
  padding: '14px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  color: '#ffffff',
  verticalAlign: 'top',
}

function NotConnected() {
  return <p>Not connected yet</p>
}

export default function UserDirectory({ userDirectory = null }) {
  const loaded = userDirectory?.loaded === true
  const loading = userDirectory?.loading === true
  const error = userDirectory?.error
  const users = userDirectory?.users
  const lastUpdate = userDirectory?.lastUpdate
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>User Directory</h2>

      <section>
        <h3>User Search</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Role Filters</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Registered Users</h3>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: '#fca5a5' }}>{error}</p>
        ) : loaded ? (
          <p>{formatCount(userDirectory?.registeredUsers)}</p>
        ) : (
          <p>User data not available yet.</p>
        )}
      </section>

      <section>
        <h3>Subscribers</h3>
        {loaded ? (
          <p>
            Subscribers: {formatCount(userDirectory?.subscribers)} ({formatCount(userDirectory?.subscriberPercentage)})
          </p>
        ) : null}
      </section>

      <section>
        <h3>Founders</h3>
        {loaded ? (
          <p>
            Founders: {formatCount(userDirectory?.founders)} ({formatCount(userDirectory?.founderPercentage)})
          </p>
        ) : null}
      </section>

      <section>
        <h3>Premium Users</h3>
        {loaded ? <p>{formatCount(userDirectory?.premiumUsers)}</p> : null}
      </section>

      <section>
        <h3>Diamond Users</h3>
        {loaded ? <p>{formatCount(userDirectory?.diamondUsers)}</p> : null}
      </section>

      <section>
        <h3>Owners</h3>
        {loaded ? <p>{formatCount(userDirectory?.owners)}</p> : null}
      </section>

      <section>
        <h3>Admins</h3>
        {loaded ? <p>{formatCount(userDirectory?.admins)}</p> : null}
      </section>

      <section>
        <h3>Users</h3>
        {loading ? (
          <p style={{ color: '#cbd5e1', fontWeight: 700 }}>Loading users...</p>
        ) : error ? (
          <p style={{ color: '#fca5a5' }}>{error}</p>
        ) : loaded && Array.isArray(users) && users.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No admin-visible users found.</p>
        ) : loaded && Array.isArray(users) && users.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '720px',
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Access Role</th>
                  <th style={tableHeaderStyle}>Subscription Status</th>
                  <th style={tableHeaderStyle}>Founder Status</th>
                  <th style={tableHeaderStyle}>Premium Purchases</th>
                  <th style={tableHeaderStyle}>Diamond Purchases</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={tableCellStyle}>{formatCell(user.email)}</td>
                    <td style={tableCellStyle}>{formatCell(user.access_role || 'standard')}</td>
                    <td style={tableCellStyle}>
                      {formatSubscriptionStatus(user.subscription_active)}
                    </td>
                    <td style={tableCellStyle}>{formatCell(user.founder_trial_status)}</td>
                    <td style={tableCellStyle}>{formatCell(user.premium_purchase_count)}</td>
                    <td style={tableCellStyle}>{formatCell(user.diamond_purchase_count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>User data not available yet.</p>
        )}
      </section>

      <section>
        <h3>Recent Activity</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Account Status</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
