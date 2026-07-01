function formatCount(value) {
  if (value === null || value === undefined) {
    return 'Not available'
  }

  return String(value)
}

function NotConnected() {
  return <p>Not connected yet</p>
}

export default function UserDirectory({ userDirectory = null }) {
  const loaded = userDirectory?.loaded === true
  const loading = userDirectory?.loading === true
  const error = userDirectory?.error
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
        ) : !loaded ? (
          <p>Open Admin Access Panel to load users.</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>{formatCount(userDirectory?.registeredUsers)}</p>
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
