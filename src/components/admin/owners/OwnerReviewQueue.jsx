function NotConnected() {
  return <p>Not connected yet</p>
}

export default function OwnerReviewQueue({ ownerReviewQueue = null }) {
  const lastUpdate = ownerReviewQueue?.lastUpdate
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2>Owner Review Queue</h2>

      <section>
        <h3>Pending Reviews</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Owner Identity</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Property Verification</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Broker Risk Score</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Off-Market Confidence</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Missing Documents</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Factory Recommendation</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Admin Decision</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Next Actions</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
