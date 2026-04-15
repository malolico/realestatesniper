// NO CAMBIES NADA.
// NO OPTIMICES.
// NO AÑADAS NADA.
// NO INTERPRETES.
// SOLO EJECUTA EXACTAMENTE LO QUE TE DOY.

import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import logo from './assets/logo.png'

const WHATSAPP_LINK =
  'https://wa.me/16026355082?text=Hi%2C%20I%27m%20interested%20in%20your%20off-market%20deals.%20Can%20I%20get%20access%3F'
const TELEGRAM_LINK = 'https://t.me/+wkrc3-lnWihlMDNk'

function App() {
  const [markets, setMarkets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('All')
  const [userMode, setUserMode] = useState('visitor') // visitor | founder

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

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function openExternalLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

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
    return userMode === 'founder' ? 'FOUNDERS ACCESS' : 'FREE ACCESS'
  }

  function getAccessTierClass(accessTier) {
    if (accessTier === 'diamond') return 'tier-diamond'
    if (accessTier === 'premium') return 'tier-premium'
    return 'tier-standard'
  }

  function getGuestVisibilityLevel(score) {
    if (score >= 80) return '25%'
    if (score >= 60) return '50%'
    return '100%'
  }

  function getFounderVisibilityLevel(deal, allDeals) {
    const score = deal.score || 0

    if (score < 60) return '100%'

    const sameBandDeals = allDeals.filter((d) => {
      const s = d.score || 0
      if (score >= 80) return s >= 80 && d.access_tier === 'standard'
      if (score >= 60) return s >= 60 && s < 80 && d.access_tier === 'standard'
      return s < 60 && d.access_tier === 'standard'
    })

    const sorted = [...sameBandDeals].sort((a, b) => (a.score || 0) - (b.score || 0))

    let limit = 0
    if (score >= 80) {
      limit = Math.ceil(sorted.length * 0.25)
    } else {
      limit = Math.ceil(sorted.length * 0.5)
    }

    const visibleIds = new Set(sorted.slice(0, limit).map((d) => d.id))
    return visibleIds.has(deal.id) ? '100%' : score >= 80 ? '25%' : '50%'
  }

  function renderDealForTier(deal, allDeals) {
    const isDiamond = deal.access_tier === 'diamond'
    const isPremium = deal.access_tier === 'premium'
    const isStandard = deal.access_tier === 'standard'
    const score = deal.score || 0

    if (userMode === 'visitor') {
      if (isDiamond) {
        return {
          estValue: formatCurrency(deal.estimated_value),
          purchase: formatCurrency(deal.purchase_price),
          discount: `${deal.discount_percentage ?? '—'}%`,
          note: 'Diamond preview. Off-market seller access is restricted.',
          ownerLayer: true,
          footerType: 'diamond',
          visibilityLabel: 'Private',
          propertyType: 'Locked',
          showLocationData: false,
        }
      }

      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: 'Numbers visible. Map, address and location intelligence are locked.',
        ownerLayer: false,
        footerType: isPremium ? 'premium' : 'visitor',
        visibilityLabel: isStandard ? getGuestVisibilityLevel(score) : 'Preview',
        propertyType: isPremium ? 'Locked' : deal.property_type,
        showLocationData: false,
      }
    }

    if (isDiamond) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: 'Diamond preview. Off-market seller access is restricted.',
        ownerLayer: true,
        footerType: 'diamond',
        visibilityLabel: 'Private',
        propertyType: 'Locked',
        showLocationData: false,
      }
    }

    if (isPremium) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: 'Premium preview only. Full intelligence remains locked until purchase.',
        ownerLayer: false,
        footerType: 'premium',
        visibilityLabel: 'Preview',
        propertyType: 'Locked',
        showLocationData: false,
      }
    }

    const founderVisibility = getFounderVisibilityLevel(deal, allDeals)
    const hasFullAccess = founderVisibility === '100%'
    const hasHalfAccess = founderVisibility === '50%'
    const hasQuarterAccess = founderVisibility === '25%'

    if (score < 60) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: deal.description,
        ownerLayer: false,
        footerType: 'founder-yellow',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
      }
    }

    if (hasFullAccess) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: deal.description,
        ownerLayer: false,
        footerType: score >= 80 ? 'founder-red-full' : 'founder-green-full',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
      }
    }

    if (hasHalfAccess) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: '50% visible. Best green opportunities remain partially restricted during Founders Access.',
        ownerLayer: false,
        footerType: 'founder-green-partial',
        visibilityLabel: '50%',
        propertyType: 'Locked',
        showLocationData: false,
      }
    }

    if (hasQuarterAccess) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: '25% visible. Highest-confidence red opportunities remain mostly restricted during Founders Access.',
        ownerLayer: false,
        footerType: 'founder-red-partial',
        visibilityLabel: '25%',
        propertyType: 'Locked',
        showLocationData: false,
      }
    }

    return {
      estValue: formatCurrency(deal.estimated_value),
      purchase: formatCurrency(deal.purchase_price),
      discount: `${deal.discount_percentage ?? '—'}%`,
      note: 'Preview restricted.',
      ownerLayer: false,
      footerType: 'fallback',
      visibilityLabel: 'Preview',
      propertyType: 'Locked',
      showLocationData: false,
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="RealEstateSniper" className="logo-img" />
          <div className="brand-copy">
            <div className="brand-name">RealEstateSniper</div>
            <div className="brand-subtitle">Investment Intelligence Platform</div>
          </div>
        </div>

        <nav className="nav">
          <a
            href="#markets"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('markets')
            }}
          >
            Markets
          </a>
          <a
            href="#deals"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('deals')
            }}
          >
            Live Deals
          </a>
          <a
            href="#access"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('access')
            }}
          >
            Access
          </a>
        </nav>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setUserMode('visitor')}
            className={userMode === 'visitor' ? 'primary-button' : 'secondary-button'}
          >
            Visitor
          </button>

          <button
            onClick={() => setUserMode('founder')}
            className={userMode === 'founder' ? 'primary-button' : 'secondary-button'}
          >
            Founder
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">FOUNDERS ACCESS: 15-DAY PRIVATE WINDOW</div>
            <h1>Access undervalued real estate deals before the market</h1>
            <p>
              Limited early access to live deal flow before full public release.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => scrollToSection('deals')}
              >
                Enter Platform
              </button>

              <button
                className="secondary-button"
                onClick={() => openExternalLink(TELEGRAM_LINK)}
              >
                Join Telegram
              </button>
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
            {filteredDeals.map((deal) => {
              const view = renderDealForTier(deal, filteredDeals)

              return (
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
                  <p className="deal-type">{view.propertyType}</p>
                  <p className="deal-type">Visibility: {view.visibilityLabel}</p>

                  <div className="deal-metrics">
                    <div>
                      <span>Est. value</span>
                      <strong>{view.estValue}</strong>
                    </div>
                    <div>
                      <span>Purchase</span>
                      <strong>{view.purchase}</strong>
                    </div>
                    <div>
                      <span>Discount</span>
                      <strong>{view.discount}</strong>
                    </div>
                  </div>

                  <p className="deal-note">{view.note}</p>

                  {view.showLocationData && (
                    <div className="diamond-box">
                      <div>Map zone visible</div>
                      <div>Address layer visible</div>
                    </div>
                  )}

                  {view.ownerLayer && (
                    <div className="diamond-box">
                      <div>💎 OFF MARKET</div>
                      <div>Owner verified</div>
                      <div>Contact authorized</div>
                    </div>
                  )}

                  {view.footerType === 'premium' && (
                    <div className="premium-box">
                      Premium listing visible. Full intelligence remains locked until purchase.
                    </div>
                  )}

                  {view.footerType === 'diamond' && (
                    <div className="diamond-box">
                      <div>Direct seller access layer locked behind purchase</div>
                    </div>
                  )}

                  {view.footerType === 'visitor' && (
                    <div className="locked-box">
                      Public visitor preview. Numbers visible, location intelligence locked.
                    </div>
                  )}

                  {view.footerType === 'founder-yellow' && (
                    <div className="locked-box">
                      100% visible for Founders Access on lower-score opportunities.
                    </div>
                  )}

                  {view.footerType === 'founder-green-full' && (
                    <div className="locked-box">
                      Full visibility granted because this deal is inside the open 50% green tranche.
                    </div>
                  )}

                  {view.footerType === 'founder-green-partial' && (
                    <div className="locked-box">
                      Restricted green tranche. Only numbers remain visible during Founders Access.
                    </div>
                  )}

                  {view.footerType === 'founder-red-full' && (
                    <div className="locked-box">
                      Full visibility granted because this deal is inside the open 25% red tranche.
                    </div>
                  )}

                  {view.footerType === 'founder-red-partial' && (
                    <div className="locked-box">
                      Restricted red tranche. Only numbers remain visible during Founders Access.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section id="access" className="section-block cta-block">
          <div>
            <div className="eyebrow">Private window</div>
            <h2>Get Early Access</h2>
            <p>
              Only a limited group will get early visibility before the platform opens to broader subscriptions.
              High-confidence opportunities, off-market access and verified seller layers remain restricted during this phase.
            </p>
            <p style={{ marginTop: '14px', color: '#ffffff', fontWeight: 700 }}>
              Founders window active now. Limited access spots remain.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => openExternalLink(WHATSAPP_LINK)}
            >
              Request Access on WhatsApp
            </button>

            <button
              className="secondary-button"
              onClick={() => openExternalLink(TELEGRAM_LINK)}
            >
              Join Private Telegram
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App