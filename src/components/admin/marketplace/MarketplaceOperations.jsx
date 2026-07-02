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

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Marketplace Operations</h2>

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
          <li>Total: {formatMetric(liveDeals?.totalDeals)}</li>
          <li>Yellow: {formatMetric(liveDeals?.yellowDeals)} ({formatMetric(liveDeals?.yellowPercentage)})</li>
          <li>Green: {formatMetric(liveDeals?.greenDeals)} ({formatMetric(liveDeals?.greenPercentage)})</li>
          <li>Red: {formatMetric(liveDeals?.redDeals)} ({formatMetric(liveDeals?.redPercentage)})</li>
        </ul>
      </section>

      <section>
        <h3>Premium Deals</h3>
        <ul>
          <li>Total: {formatMetric(premium?.premiumDeals)}</li>
          <li>Percentage: {formatMetric(premium?.premiumPercentage)}</li>
        </ul>
      </section>

      <section>
        <h3>Diamond Deals</h3>
        <ul>
          <li>Total: {formatMetric(diamond?.diamondDeals)}</li>
          <li>Percentage: {formatMetric(diamond?.diamondPercentage)}</li>
        </ul>
      </section>

      <section>
        <h3>Enrichment Pending</h3>
        <ul>
          <li>Unpriced Leads: {formatMetric(enrichmentPending?.unpricedLeads)}</li>
          <li>Unpriced Percentage: {formatMetric(enrichmentPending?.unpricedPercentage)}</li>
        </ul>
      </section>

      <section>
        <h3>Marketplace Eligible</h3>
        <NotConnected />
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
    </section>
  )
}
