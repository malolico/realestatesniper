function formatMetric(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  return String(value)
}

function NotConnected() {
  return <p>Not connected yet</p>
}

export default function BusinessOverview({ businessOverview = null }) {
  const revenue = businessOverview?.revenue
  const subscriptions = businessOverview?.subscriptions
  const premium = businessOverview?.premium
  const diamond = businessOverview?.diamond
  const refunds = businessOverview?.refunds
  const failedPayments = businessOverview?.failedPayments
  const conversion = businessOverview?.conversion
  const churn = businessOverview?.churn
  const revenueByProduct = businessOverview?.revenueByProduct
  const revenueByState = businessOverview?.revenueByState
  const lastUpdate = businessOverview?.lastUpdate

  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2>Business Overview</h2>

      <section>
        <h3>Revenue</h3>
        {revenue?.available === true ? (
          <p>Revenue metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Subscriptions</h3>
        {subscriptions?.available === true ? (
          <p>Subscription metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
        <p>Purchase data loaded: {subscriptions?.loaded === true ? 'Yes' : 'No'}</p>
      </section>

      <section>
        <h3>Premium Access</h3>
        <p>Total Premium Purchases: {formatMetric(premium?.totalPurchases)}</p>
      </section>

      <section>
        <h3>Diamond Access</h3>
        <p>Total Diamond Purchases: {formatMetric(diamond?.totalPurchases)}</p>
      </section>

      <section>
        <h3>Refunds</h3>
        {refunds?.available === true ? (
          <p>Refund metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Failed Payments</h3>
        {failedPayments?.available === true ? (
          <p>Failed payment metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Conversion</h3>
        {conversion?.available === true ? (
          <p>Conversion metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Churn</h3>
        {churn?.available === true ? (
          <p>Churn metrics will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Revenue by Product</h3>
        {revenueByProduct?.available === true ? (
          <p>Revenue by product will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Revenue by State</h3>
        {revenueByState?.available === true ? (
          <p>Revenue by state will appear here.</p>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
