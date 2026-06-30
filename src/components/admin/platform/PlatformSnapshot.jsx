function formatMetric(value) {
  if (value === null || value === undefined) {
    return '—'
  }

  return String(value)
}

export default function PlatformSnapshot({ platformSnapshot = null }) {
  const generalStatus = platformSnapshot?.generalStatus
  const quickMetrics = platformSnapshot?.quickMetrics
  const pendingActions = platformSnapshot?.pendingActions
  const warnings = platformSnapshot?.warnings
  const lastUpdate = platformSnapshot?.lastUpdate

  const marketplaceLoading = generalStatus?.marketplaceLoading === true
  const marketplaceReady = lastUpdate?.marketplaceReady === true

  return (
    <section>
      <h2>Platform Snapshot</h2>

      <section>
        <h3>General Status</h3>
        {marketplaceLoading ? <p>Loading marketplace data</p> : null}
        <ul>
          <li>Workspace: {formatMetric(generalStatus?.workspaceLabel)}</li>
          <li>Admin email: {formatMetric(generalStatus?.adminEmail)}</li>
        </ul>
      </section>

      <section>
        <h3>Quick Metrics</h3>
        <ul>
          <li>Active markets: {formatMetric(quickMetrics?.activeMarketsCount)}</li>
          <li>Cities: {formatMetric(quickMetrics?.citiesCount)}</li>
          <li>Total deals: {formatMetric(quickMetrics?.totalDealsCount)}</li>
          <li>Tracked opportunities: {formatMetric(quickMetrics?.trackedOpportunitiesCount)}</li>
          <li>Sniper deals: {formatMetric(quickMetrics?.sniperDealsCount)}</li>
          <li>Yellow deals: {formatMetric(quickMetrics?.yellowDealsCount)}</li>
          <li>Green deals: {formatMetric(quickMetrics?.greenDealsCount)}</li>
          <li>Red deals: {formatMetric(quickMetrics?.redDealsCount)}</li>
          <li>Unpriced leads: {formatMetric(quickMetrics?.unpricedLeadsCount)}</li>
          <li>Premium deals: {formatMetric(quickMetrics?.premiumDealsCount)}</li>
          <li>Diamond deals: {formatMetric(quickMetrics?.diamondDealsCount)}</li>
          <li>Average deal score: {formatMetric(quickMetrics?.averageDealScore)}</li>
          <li>Total premium purchases: {formatMetric(quickMetrics?.totalPremiumPurchases)}</li>
          <li>Total diamond purchases: {formatMetric(quickMetrics?.totalDiamondPurchases)}</li>
          <li>
            Founder spots: {formatMetric(quickMetrics?.founderSpotsRemaining)} /{' '}
            {formatMetric(quickMetrics?.founderSpotsTotal)}
          </li>
        </ul>
      </section>

      <section>
        <h3>Pending Actions</h3>
        <ul>
          <li>
            User directory loaded:{' '}
            {pendingActions?.userDirectoryLoaded === true ? 'Yes' : 'No'}
          </li>
          <li>Registered users: {formatMetric(pendingActions?.registeredUsersCount)}</li>
        </ul>
      </section>

      <section>
        <h3>Platform Warnings</h3>
        <ul>
          <li>
            Marketplace empty: {warnings?.marketplaceEmpty === true ? 'Yes' : 'No'}
          </li>
          <li>
            Founders cohort full: {warnings?.foundersCohortFull === true ? 'Yes' : 'No'}
          </li>
          <li>Admin panel error: {formatMetric(warnings?.adminPanelError)}</li>
        </ul>
      </section>

      <section>
        <h3>Last Update</h3>
        {marketplaceLoading ? <p>Loading marketplace data</p> : null}
        {marketplaceReady ? <p>Marketplace data ready</p> : null}
        {!marketplaceLoading && !marketplaceReady ? <p>—</p> : null}
      </section>
    </section>
  )
}
