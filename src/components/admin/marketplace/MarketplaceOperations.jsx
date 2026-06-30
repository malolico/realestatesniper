function formatMetric(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  return String(value)
}

function NotConnected() {
  return <p>Not connected yet</p>
}

export default function MarketplaceOperations({ marketplaceOperations = null }) {
  const marketplaceStatus = marketplaceOperations?.marketplaceStatus
  const marketSummary = marketplaceOperations?.marketSummary
  const liveDeals = marketplaceOperations?.liveDeals
  const premium = marketplaceOperations?.premium
  const diamond = marketplaceOperations?.diamond
  const enrichmentPending = marketplaceOperations?.enrichmentPending
  const lastUpdate = marketplaceOperations?.lastUpdate
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2>Marketplace Operations</h2>

      <section>
        <h3>Marketplace Status</h3>
        <ul>
          <li>
            Marketplace Ready:{' '}
            {marketplaceStatus?.marketplaceReady === true ? 'Yes' : 'No'}
          </li>
          <li>
            Marketplace Empty:{' '}
            {marketplaceStatus?.marketplaceEmpty === true ? 'Yes' : 'No'}
          </li>
        </ul>
      </section>

      <section>
        <h3>Market Summary</h3>
        <ul>
          <li>Active Markets: {formatMetric(marketSummary?.activeMarkets)}</li>
          <li>Cities: {formatMetric(marketSummary?.cities)}</li>
          <li>Tracked Opportunities: {formatMetric(marketSummary?.trackedOpportunities)}</li>
          <li>Sniper Deals: {formatMetric(marketSummary?.sniperDeals)}</li>
          <li>Average Deal Score: {formatMetric(marketSummary?.averageDealScore)}</li>
        </ul>
      </section>

      <section>
        <h3>Live Deals</h3>
        <ul>
          <li>Total Deals: {formatMetric(liveDeals?.totalDeals)}</li>
          <li>Yellow Deals: {formatMetric(liveDeals?.yellowDeals)} ({formatMetric(liveDeals?.yellowPercentage)})</li>
          <li>Green Deals: {formatMetric(liveDeals?.greenDeals)} ({formatMetric(liveDeals?.greenPercentage)})</li>
          <li>Red Deals: {formatMetric(liveDeals?.redDeals)} ({formatMetric(liveDeals?.redPercentage)})</li>
        </ul>
      </section>

      <section>
        <h3>Premium Opportunities</h3>
        <p>Premium Deals: {formatMetric(premium?.premiumDeals)} ({formatMetric(premium?.premiumPercentage)})</p>
      </section>

      <section>
        <h3>Diamond Opportunities</h3>
        <p>Diamond Deals: {formatMetric(diamond?.diamondDeals)} ({formatMetric(diamond?.diamondPercentage)})</p>
      </section>

      <section>
        <h3>Marketplace Eligible</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Enrichment Pending</h3>
        <p>Unpriced Leads: {formatMetric(enrichmentPending?.unpricedLeads)}</p>
        <p>Unpriced Percentage: {formatMetric(enrichmentPending?.unpricedPercentage)}</p>
      </section>

      <section>
        <h3>Internal Signals</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Factory Sync</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Pipeline Status</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceReady ? <p>Marketplace data ready</p> : <p>—</p>}
      </section>
    </section>
  )
}
