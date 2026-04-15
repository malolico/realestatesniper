// NO CAMBIES NADA.
// NO OPTIMICES.
// NO AÑADAS NADA.
// NO INTERPRETES.
// SOLO EJECUTA EXACTAMENTE LO QUE TE DOY.

import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

function App() {
  const [markets, setMarkets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('All')

  useEffect(() => {
    async function loadData() {
      const { data: marketsData } = await supabase
        .from('markets')
        .select('*')
        .order('city', { ascending: true })

      const { data: dealsData } = await supabase
        .from('deals')
        .select('*')
        .order('score', { ascending: false })

      setMarkets(marketsData || [])
      setDeals(dealsData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const cities = useMemo(() => {
    return ['All', ...new Set(deals.map((d) => d.city).filter(Boolean))]
  }, [deals])

  const filteredDeals = useMemo(() => {
    if (selectedCity === 'All') return deals
    return deals.filter((d) => d.city === selectedCity)
  }, [deals, selectedCity])

  function formatCurrency(value) {
    if (value == null) return '—'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function getScoreColor(score) {
    if (score >= 80) return 'score-red'
    if (score >= 60) return 'score-green'
    return 'score-yellow'
  }

  function getDealBadge(status) {
    if (status === 'sniper_deal') return 'badge-sniper-deal'
    if (status === 'opportunity') return 'badge-opportunity'
    return 'badge-watchlist'
  }

  function getDealLabel(status) {
    if (status === 'sniper_deal') return 'SNIPER DEAL'
    if (status === 'opportunity') return 'OPPORTUNITY'
    return 'WATCHLIST'
  }

  function getAccessTierLabel(accessTier) {
    if (accessTier === 'diamond') return '💎 DIAMOND PREMIUM'
    if (accessTier === 'premium') return 'PREMIUM'
    return 'STANDARD'
  }

  function getAccessTierClass(accessTier) {
    if (accessTier === 'diamond') return 'tier-diamond'
    if (accessTier === 'premium') return 'tier-premium'
    return 'tier-standard'
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">RS</div>
          <div>
            <div className="brand-name">RealEstateSniper</div>
            <div className="brand-subtitle">Investment Intelligence Platform</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#markets">Markets</a>
          <a href="#deals">Live Deals</a>
          <a href="#access">Access</a>
        </nav>

        <button className="primary-button">Get Early Access</button>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Private beta · Phoenix & Tucson</div>
            <h1>Access undervalued real estate deals before the market</h1>
            <p>
              A premium real estate intelligence platform using data, multi-source
              signals and scoring systems to surface investor opportunities before
              broad market discovery.
            </p>

            <div className="hero-actions">
              <button className="primary-button">Enter Platform</button>
              <button className="secondary-button">Join Telegram</button>
            </div>

            <div className="hero-stats">
              <div className="stat-card">
                <strong>{markets.filter((m) => m.status === 'active').length}</strong>
                <span>Active Markets</span>
              </div>
              <div className="stat-card">
                <strong>{markets.reduce((sum, m) => sum + (m.opportunities_count || 0), 0)}</strong>
                <span>Tracked Opportunities</span>
              </div>
              <div className="stat-card">
                <strong>{markets.reduce((sum, m) => sum + (m.sniper_deals_count || 0), 0)}</strong>
                <span>Sniper Deals</span>
              </div>
              <div className="stat-card">
                <strong>{deals.filter((d) => d.access_tier === 'premium' || d.access_tier === 'diamond').length}</strong>
                <span>Premium Deals</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-card">
              <div className="panel-header">
                <div>
                  <h3>Signal Overview</h3>
                  <p>Current feed in active markets</p>
                </div>
                <span className="live-badge">Live</span>
              </div>

              <div className="signal-boxes">
                <div className="signal-box">
                  <span>Average deal score</span>
                  <strong>
                    {deals.length > 0
                      ? Math.round(deals.reduce((sum, d) => sum + (d.score || 0), 0) / deals.length)
                      : 0}
                  </strong>
                </div>
                <div className="signal-box">
                  <span>Diamond deals</span>
                  <strong>{deals.filter((d) => d.access_tier === 'diamond').length}</strong>
                </div>
              </div>

              <div className="progress-group">
                <div className="progress-row">
                  <div className="progress-label">
                    <span>Phoenix spread intensity</span>
                    <span>84%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '84%' }}></div>
                  </div>
                </div>

                <div className="progress-row">
                  <div className="progress-label">
                    <span>Tucson repricing weakness</span>
                    <span>68%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <div className="progress-row">
                  <div className="progress-label">
                    <span>Off-market prediction confidence</span>
                    <span>61%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '61%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="markets" className="section-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Markets & scalability</div>
              <h2>Launch city by city, scale nationally</h2>
            </div>
            <p>
              Initial coverage starts with Phoenix and Tucson, with additional
              Arizona hubs and selected U.S. investor markets planned next.
            </p>
          </div>

          {loading && <p className="loading-text">Loading...</p>}

          <div className="grid grid-5">
            {markets.map((market) => (
              <div className="data-card" key={market.id}>
                <div className="market-row">
                  <h3>{market.city}</h3>
                  <span className={`status-pill status-${market.status.replace('_', '-')}`}>
                    {market.status}
                  </span>
                </div>

                <div className="market-stats">
                  <div>
                    <span>Opps</span>
                    <strong>{market.opportunities_count}</strong>
                  </div>
                  <div>
                    <span>Sniper</span>
                    <strong>{market.sniper_deals_count}</strong>
                  </div>
                  <div>
                    <span>Density</span>
                    <strong>{market.density_score}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="deals" className="section-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Live investment opportunities</div>
              <h2>Current deal flow</h2>
            </div>
            <p>
              A curated feed of scored opportunities designed for serious
              investors, flippers, wholesalers and deal sourcers.
            </p>
          </div>

          <div className="filter-row">
            {cities.map((city) => (
              <button
                key={city}
                className={`filter-button ${selectedCity === city ? 'filter-button-active' : ''}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="grid grid-3">
            {filteredDeals.map((deal) => (
              <div className="deal-card" key={deal.id}>
                <div className="deal-top">
                  <div className="deal-badge-stack">
                    <span className={`deal-badge ${getDealBadge(deal.status)}`}>
                      {getDealLabel(deal.status)}
                    </span>
                    <span className={`access-tier-badge ${getAccessTierClass(deal.access_tier)}`}>
                      {getAccessTierLabel(deal.access_tier)}
                    </span>
                  </div>

                  <div className="deal-score-box">
                    <div className={`score-circle ${getScoreColor(deal.score)}`}></div>
                    <span className="deal-score">{deal.score}/100</span>
                  </div>
                </div>

                <h3>{deal.city} · {deal.title}</h3>
                <p className="deal-type">{deal.property_type}</p>

                <div className="deal-metrics">
                  <div>
                    <span>Est. value</span>
                    <strong>{formatCurrency(deal.estimated_value)}</strong>
                  </div>
                  <div>
                    <span>Purchase</span>
                    <strong>{formatCurrency(deal.purchase_price)}</strong>
                  </div>
                  <div>
                    <span>Discount</span>
                    <strong>{deal.discount_percentage ?? '—'}%</strong>
                  </div>
                </div>

                <p className="deal-note">{deal.description}</p>

                {deal.access_tier === 'diamond' && (
                  <div className="diamond-box">
                    <div>Owner verified</div>
                    <div>Contact authorized</div>
                  </div>
                )}

                {deal.access_tier === 'premium' && (
                  <div className="premium-box">
                    Premium access required
                  </div>
                )}

                {deal.access_tier === 'standard' && (
                  <div className="locked-box">
                    Full deal access for early members only
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="access" className="section-block cta-block">
          <div>
            <div className="eyebrow">Private beta</div>
            <h2>Get Early Access</h2>
            <p>
              Private beta access is currently limited while the system expands
              city by city and the scoring engine continues to evolve.
            </p>
          </div>

          <div className="hero-actions">
            <button className="primary-button">WhatsApp</button>
            <button className="secondary-button">Telegram</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App