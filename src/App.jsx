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
  'https://wa.me/16026355082?text=Hi%2C%20I%20came%20across%20RealEstateSniper.%20I%20am%20an%20investor%20interested%20in%20off-market%20opportunities.%20Are%20you%20currently%20accepting%20new%20founders%3F'
const TELEGRAM_LINK = 'https://t.me/+wkrc3-lnWihlMDNk'

const TOTAL_FOUNDER_SPOTS = 10
const REMAINING_FOUNDER_SPOTS = 7

const PREMIUM_ACCESS_PRICE = 4500
const DIAMOND_LAUNCH_PRICE = 7500

const FOUNDER_CODES = [
  'RS-FOUNDER-001',
  'RS-FOUNDER-002',
  'RS-FOUNDER-003',
  'RS-FOUNDER-004',
  'RS-FOUNDER-005',
  'RS-FOUNDER-006',
  'RS-FOUNDER-007',
  'RS-FOUNDER-008',
  'RS-FOUNDER-009',
  'RS-FOUNDER-010',
]

const FOUNDER_STORAGE_KEY = 'realestatesniper_founder_access'
const PREMIUM_STORAGE_KEY = 'realestatesniper_premium_access'
const DIAMOND_STORAGE_KEY = 'realestatesniper_diamond_access'

function App() {
  const [markets, setMarkets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('All')
  const [userMode, setUserMode] = useState('visitor') // visitor | founder
  const [founderUnlocked, setFounderUnlocked] = useState(false)
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [diamondUnlocked, setDiamondUnlocked] = useState(false)
  const [showFounderGate, setShowFounderGate] = useState(false)
  const [founderCodeInput, setFounderCodeInput] = useState('')
  const [founderError, setFounderError] = useState('')

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

    const storedFounderAccess = window.localStorage.getItem(FOUNDER_STORAGE_KEY)
    if (storedFounderAccess === 'granted') {
      setFounderUnlocked(true)
      setUserMode('founder')
    }

    const storedPremiumAccess = window.localStorage.getItem(PREMIUM_STORAGE_KEY)
    if (storedPremiumAccess === 'granted') {
      setPremiumUnlocked(true)
    }

    const storedDiamondAccess = window.localStorage.getItem(DIAMOND_STORAGE_KEY)
    if (storedDiamondAccess === 'granted') {
      setDiamondUnlocked(true)
    }
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

  function handleFounderAccessRequest() {
    if (founderUnlocked) {
      setUserMode('founder')
      return
    }

    setFounderCodeInput('')
    setFounderError('')
    setShowFounderGate(true)
  }

  function handleFounderCodeSubmit() {
    const normalizedCode = founderCodeInput.trim().toUpperCase()

    if (!normalizedCode) {
      setFounderError('Please enter a valid founder code.')
      return
    }

    if (!FOUNDER_CODES.includes(normalizedCode)) {
      setFounderError('Access denied. This founder code is not approved.')
      return
    }

    setFounderUnlocked(true)
    setUserMode('founder')
    setShowFounderGate(false)
    setFounderError('')
    window.localStorage.setItem(FOUNDER_STORAGE_KEY, 'granted')
  }

  function handleFounderGateClose() {
    setShowFounderGate(false)
    setFounderCodeInput('')
    setFounderError('')
  }

  function handleVisitorMode() {
    setUserMode('visitor')
  }

  function handlePremiumUnlock() {
    setPremiumUnlocked(true)
    window.localStorage.setItem(PREMIUM_STORAGE_KEY, 'granted')
  }

  function handleDiamondUnlock() {
    setDiamondUnlocked(true)
    window.localStorage.setItem(DIAMOND_STORAGE_KEY, 'granted')
  }

  function renderDealForTier(deal, allDeals) {
    const isDiamond = deal.access_tier === 'diamond'
    const isPremium = deal.access_tier === 'premium'
    const isStandard = deal.access_tier === 'standard'
    const score = deal.score || 0

    if (isDiamond && diamondUnlocked) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: 'Diamond access unlocked. Owner-verified and off-market execution layer visible.',
        ownerLayer: true,
        footerType: 'diamond-unlocked',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
        accessPriceLabel: `Launch Access Price: ${formatCurrency(DIAMOND_LAUNCH_PRICE)}`,
      }
    }

    if (isPremium && premiumUnlocked) {
      return {
        estValue: formatCurrency(deal.estimated_value),
        purchase: formatCurrency(deal.purchase_price),
        discount: `${deal.discount_percentage ?? '—'}%`,
        note: 'Premium access unlocked. Full deal intelligence and location layers visible.',
        ownerLayer: false,
        footerType: 'premium-unlocked',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
        accessPriceLabel: `Access Price: ${formatCurrency(PREMIUM_ACCESS_PRICE)}`,
      }
    }

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
          accessPriceLabel: `Launch Access Price: ${formatCurrency(DIAMOND_LAUNCH_PRICE)}`,
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
        accessPriceLabel: isPremium ? `Access Price: ${formatCurrency(PREMIUM_ACCESS_PRICE)}` : '',
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
        accessPriceLabel: `Launch Access Price: ${formatCurrency(DIAMOND_LAUNCH_PRICE)}`,
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
        accessPriceLabel: `Access Price: ${formatCurrency(PREMIUM_ACCESS_PRICE)}`,
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
        accessPriceLabel: '',
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
        accessPriceLabel: '',
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
        accessPriceLabel: '',
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
        accessPriceLabel: '',
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
      accessPriceLabel: '',
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
            href="#tiers"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('tiers')
            }}
          >
            Tiers
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
            onClick={handleVisitorMode}
            className={userMode === 'visitor' ? 'primary-button' : 'secondary-button'}
          >
            Visitor
          </button>

          <button
            onClick={handleFounderAccessRequest}
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
            <h1>Private off-market deals before everyone else</h1>
            <p>
              Limited early access to live deal flow before full public release.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => openExternalLink(WHATSAPP_LINK)}
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

                  {view.accessPriceLabel && (
                    <div
                      style={{
                        marginTop: '12px',
                        display: 'inline-flex',
                        padding: '8px 12px',
                        borderRadius: '999px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {view.accessPriceLabel}
                    </div>
                  )}

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
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        background: 'rgba(37, 99, 235, 0.12)',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#93c5fd' }}>
                        Premium Access Required
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px' }}>
                        Full deal intelligence, location layers and execution data are locked behind premium access.
                      </div>
                    </div>
                  )}

                  {view.footerType === 'premium-unlocked' && (
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: '1px solid rgba(34, 197, 94, 0.28)',
                        background: 'rgba(34, 197, 94, 0.12)',
                      }}
                    >
                      <div style={{ fontWeight: 700, color: '#86efac' }}>
                        Premium Access Unlocked
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#dcfce7', marginTop: '4px' }}>
                        Full deal intelligence and location layers are now visible.
                      </div>
                    </div>
                  )}

                  {view.footerType === 'diamond' && (
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '16px 18px',
                        borderRadius: '16px',
                        border: '1px solid rgba(251, 191, 36, 0.35)',
                        background: 'rgba(120, 53, 15, 0.18)',
                        boxShadow: '0 0 18px rgba(251, 191, 36, 0.12)',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#facc15' }}>
                        💎 Diamond Layer — Restricted Access
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#e5e7eb', marginTop: '6px' }}>
                        Owner-verified deal. Direct seller contact and off-market execution rights are protected behind diamond access.
                      </div>
                    </div>
                  )}

                  {view.footerType === 'diamond-unlocked' && (
                    <div
                      style={{
                        marginTop: '14px',
                        padding: '16px 18px',
                        borderRadius: '16px',
                        border: '1px solid rgba(34, 197, 94, 0.28)',
                        background: 'rgba(34, 197, 94, 0.12)',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#86efac' }}>
                        💎 Diamond Access Unlocked
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#dcfce7', marginTop: '6px' }}>
                        Owner-verified contact layer and off-market execution rights are now visible.
                      </div>
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

        <section id="tiers" className="section-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Access tiers</div>
              <h2>Choose the level of intelligence you need</h2>
            </div>
            <p>
              Each tier unlocks a different level of visibility, execution advantage and contact access.
            </p>
          </div>

          <div className="grid grid-3">
            <div
              className="data-card"
              style={{
                border: '1px solid rgba(59, 130, 246, 0.25)',
                background: 'rgba(37, 99, 235, 0.08)',
              }}
            >
              <div style={{ fontWeight: 800, color: '#93c5fd', fontSize: '1.1rem' }}>
                PREMIUM
              </div>
              <p style={{ marginTop: '12px', color: '#e5e7eb' }}>
                Unlock deeper deal intelligence before the broader network sees the full opportunity.
              </p>
              <div style={{ marginTop: '14px', color: '#cbd5e1', lineHeight: 1.7 }}>
                <div>• Full deal intelligence</div>
                <div>• Location layers and execution data</div>
                <div>• Higher-conviction opportunity access</div>
              </div>

              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  color: '#e0f2fe',
                  fontWeight: 800,
                }}
              >
                Access Price: {formatCurrency(PREMIUM_ACCESS_PRICE)}
              </div>

              <div style={{ marginTop: '18px' }}>
                <button
                  className="primary-button"
                  onClick={handlePremiumUnlock}
                >
                  {premiumUnlocked ? 'Premium Access Unlocked' : 'Unlock Premium Access'}
                </button>
              </div>
            </div>

            <div
              className="data-card"
              style={{
                border: '1px solid rgba(251, 191, 36, 0.35)',
                background: 'rgba(120, 53, 15, 0.12)',
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.08)',
              }}
            >
              <div style={{ fontWeight: 800, color: '#facc15', fontSize: '1.1rem' }}>
                💎 DIAMOND
              </div>
              <p style={{ marginTop: '12px', color: '#f3f4f6' }}>
                Restricted access reserved for the most valuable owner-verified and off-market opportunities.
              </p>
              <div style={{ marginTop: '14px', color: '#e5e7eb', lineHeight: 1.7 }}>
                <div>• Owner-verified opportunities</div>
                <div>• Direct seller contact visibility</div>
                <div>• Off-market execution rights</div>
              </div>

              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1px solid rgba(251, 191, 36, 0.22)',
                  background: 'rgba(251, 191, 36, 0.08)',
                  color: '#fef3c7',
                  fontWeight: 800,
                }}
              >
                Launch Access Price: {formatCurrency(DIAMOND_LAUNCH_PRICE)}
              </div>

              <div
                style={{
                  marginTop: '18px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(251, 191, 36, 0.22)',
                  background: 'rgba(251, 191, 36, 0.06)',
                }}
              >
                <p style={{ margin: 0, color: '#f8fafc', lineHeight: 1.7 }}>
                  The first <strong>25 Diamond investors</strong> will secure access at a launch rate of <strong>$7,500</strong>.
                </p>
                <p style={{ marginTop: '10px', color: '#e5e7eb', lineHeight: 1.7 }}>
                  Once this early access allocation is filled, Diamond access will transition to <strong>$10,500+</strong>, reflecting increased data intelligence, stronger deal validation, and higher-quality off-market opportunities.
                </p>
                <p style={{ marginTop: '10px', color: '#cbd5e1', lineHeight: 1.7 }}>
                  Early participants are entering before full-scale system deployment.
                </p>
              </div>

              <div style={{ marginTop: '18px' }}>
                <button
                  className="primary-button"
                  onClick={handleDiamondUnlock}
                >
                  {diamondUnlocked ? 'Diamond Access Unlocked' : 'Request Diamond Access'}
                </button>
              </div>
            </div>

            <div
              className="data-card"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
                WHY IT MATTERS
              </div>
              <p style={{ marginTop: '12px', color: '#cbd5e1' }}>
                The faster you see the right deal, the better your pricing, negotiation and execution position becomes.
              </p>
              <div style={{ marginTop: '14px', color: '#e5e7eb', lineHeight: 1.7 }}>
                <div>• Earlier access</div>
                <div>• Better positioning</div>
                <div>• More control before exposure expands</div>
              </div>
            </div>
          </div>
        </section>

        <section id="access" className="section-block cta-block">
          <div>
            <div className="eyebrow">Private window</div>
            <h2>Only 10 Investors Will Get Access</h2>
            <p>
              Only 10 investors will be selected for the private founders window. Once full, access will close and move to paid tiers only.
            </p>
            <p style={{ marginTop: '14px', color: '#ffffff', fontWeight: 700 }}>
              Founders window active now. Limited access spots remain.
            </p>

            <div
              style={{
                marginTop: '18px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 18px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 59, 59, 0.35)',
                background: 'rgba(255, 59, 59, 0.08)',
                boxShadow: '0 0 22px rgba(255, 59, 59, 0.12)',
              }}
            >
              <span style={{ color: '#ff4d4d', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.02em' }}>
                {REMAINING_FOUNDER_SPOTS} / {TOTAL_FOUNDER_SPOTS} Spots Remaining
              </span>
            </div>

            <div
              style={{
                marginTop: '18px',
                maxWidth: '540px',
                padding: '16px 18px',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.28)',
                background: 'rgba(91, 33, 182, 0.14)',
              }}
            >
              <p style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.5 }}>
                Only the first 10 approved investors will receive 30-day free access.
              </p>
            </div>

            <p style={{ marginTop: '14px', color: '#cbd5e1', fontWeight: 600, maxWidth: '540px' }}>
              Applications are reviewed manually. Approval is not guaranteed.
            </p>

            {founderUnlocked && (
              <div
                style={{
                  marginTop: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(34, 197, 94, 0.28)',
                  background: 'rgba(34, 197, 94, 0.12)',
                }}
              >
                <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '1rem' }}>
                  Founder Access Unlocked
                </span>
              </div>
            )}
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

      {showFounderGate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#0b1120',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '22px',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#dbeafe',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                Founder Access
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>
              Enter Founder Code
            </h3>

            <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
              This area is restricted to approved founder investors only. Enter your one-time founder code to continue.
            </p>

            <input
              type="text"
              value={founderCodeInput}
              onChange={(e) => {
                setFounderCodeInput(e.target.value)
                if (founderError) setFounderError('')
              }}
              placeholder="RS-FOUNDER-001"
              autoFocus
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '16px 18px',
                borderRadius: '14px',
                border: founderError
                  ? '1px solid rgba(255, 77, 77, 0.8)'
                  : '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFounderCodeSubmit()
                if (e.key === 'Escape') handleFounderGateClose()
              }}
            />

            {founderError && (
              <p style={{ marginTop: '12px', color: '#ff6b6b', fontWeight: 600 }}>
                {founderError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
              <button
                onClick={handleFounderCodeSubmit}
                className="primary-button"
              >
                Validate Founder Code
              </button>

              <button
                onClick={handleFounderGateClose}
                className="secondary-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App