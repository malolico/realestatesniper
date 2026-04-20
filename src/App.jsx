// NO CAMBIES NADA.
// NO OPTIMICES.
// NO AÑADAS NADA.
// NO INTERPRETES.
// SOLO EJECUTA EXACTAMENTE LO QUE TE DOY.

import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import logo from './assets/logo.png'
import FloatingActivity from './components/FloatingActivity'

const WHATSAPP_LINK =
  'https://wa.me/16026355082?text=Hi%2C%20I%20came%20across%20RealEstateSniper.%20I%20am%20an%20investor%20interested%20in%20off-market%20opportunities.%20Are%20you%20currently%20accepting%20new%20founders%3F'
const TELEGRAM_LINK = 'https://t.me/+wkrc3-lnWihlMDNk'
const EMAIL_LINK = 'mailto:founder@realestatesniper.io'

const TOTAL_FOUNDER_SPOTS = 10
const REMAINING_FOUNDER_SPOTS = 7

const PREMIUM_ACCESS_PRICE = 4500
const DIAMOND_LAUNCH_PRICE = 7500

const PREMIUM_TOTAL_SLOTS = 15
const PREMIUM_REMAINING_SLOTS = 12

const DIAMOND_TOTAL_POSITIONS = 7
const DIAMOND_REMAINING_POSITIONS = 5

const PREMIUM_RECENT_ACTIVITY = '2 investors unlocked this in the last hour'
const DIAMOND_RECENT_ACTIVITY = '1 investor secured access recently'

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

const ACTIVITY_FEED = [
  {
    label: 'Live activity',
    text: 'Premium interest detected in Phoenix',
  },
  {
    label: 'Live activity',
    text: 'Diamond review opened in Tucson',
  },
  {
    label: 'Live activity',
    text: 'Founder access request submitted',
  },
  {
    label: 'Live activity',
    text: 'Premium deal page viewed in Phoenix',
  },
  {
    label: 'Live activity',
    text: 'Diamond investor position checked',
  },
]

const FOUNDER_STORAGE_KEY = 'realestatesniper_founder_access'
const PREMIUM_STORAGE_KEY = 'realestatesniper_premium_access'
const DIAMOND_STORAGE_KEY = 'realestatesniper_diamond_access'

function App() {
  const [markets, setMarkets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('All')
  const [userMode, setUserMode] = useState('visitor')
  const [founderUnlocked, setFounderUnlocked] = useState(false)
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [diamondUnlocked, setDiamondUnlocked] = useState(false)
  const [showFounderGate, setShowFounderGate] = useState(false)
  const [founderCodeInput, setFounderCodeInput] = useState('')
  const [founderError, setFounderError] = useState('')
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [activityIndex, setActivityIndex] = useState(0)

  const contactMenuRef = useRef(null)

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (contactMenuRef.current && !contactMenuRef.current.contains(event.target)) {
        setShowContactMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => {
        const next = prev + 1
        return next >= ACTIVITY_FEED.length ? 0 : next
      })
    }, 12000)

    return () => clearInterval(interval)
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

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
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

          <div style={{ position: 'relative' }} ref={contactMenuRef}>
            <button
              onClick={() => setShowContactMenu((prev) => !prev)}
              className="secondary-button"
            >
              Contact
            </button>

            {showContactMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  minWidth: '220px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(10, 13, 18, 0.98)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                  padding: '10px',
                  zIndex: 20,
                }}
              >
                <button
                  className="secondary-button"
                  style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}
                  onClick={() => openExternalLink(EMAIL_LINK)}
                >
                  Email
                </button>

                <button
                  className="secondary-button"
                  style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}
                  onClick={() => openExternalLink(WHATSAPP_LINK)}
                >
                  WhatsApp
                </button>

                <button
                  className="secondary-button"
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => openExternalLink(TELEGRAM_LINK)}
                >
                  Telegram
                </button>
              </div>
            )}
          </div>
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
                <div
                  className="deal-card"
                  key={deal.id}
                  style={{
                    padding: '24px',
                    borderRadius: '22px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '14px',
                      marginBottom: '18px',
                    }}
                  >
                    <div className="deal-badge-stack">
                      <span className={`deal-badge ${getDealBadge(deal.status)}`}>
                        {getDealLabel(deal.status)}
                      </span>
                      <span className={`access-tier-badge ${getAccessTierClass(deal.access_tier)}`}>
                        {getAccessTierLabel(deal.access_tier)}
                      </span>
                    </div>

                    <div
                      style={{
                        minWidth: '84px',
                        textAlign: 'right',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                          marginBottom: '4px',
                        }}
                      >
                        Score
                      </div>
                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 800,
                          color:
                            deal.score >= 80 ? '#ef4444' : deal.score >= 60 ? '#22c55e' : '#facc15',
                        }}
                      >
                        {deal.score}/100
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        lineHeight: 1.3,
                        color: '#ffffff',
                      }}
                    >
                      {deal.city} · {deal.title}
                    </h3>
                    <p
                      style={{
                        marginTop: '6px',
                        color: '#94a3b8',
                        fontSize: '0.95rem',
                      }}
                    >
                      {view.propertyType}
                    </p>
                    <p
                      style={{
                        marginTop: '4px',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                      }}
                    >
                      Visibility: {view.visibilityLabel}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                        }}
                      >
                        Est. Value
                      </div>
                      <div
                        style={{
                          marginTop: '8px',
                          fontWeight: 800,
                          color: '#ffffff',
                          fontSize: '1rem',
                        }}
                      >
                        {view.estValue}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                        }}
                      >
                        Purchase
                      </div>
                      <div
                        style={{
                          marginTop: '8px',
                          fontWeight: 800,
                          color: '#ffffff',
                          fontSize: '1rem',
                        }}
                      >
                        {view.purchase}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.72rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                        }}
                      >
                        Discount
                      </div>
                      <div
                        style={{
                          marginTop: '8px',
                          fontWeight: 800,
                          color: '#22c55e',
                          fontSize: '1rem',
                        }}
                      >
                        {view.discount}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      paddingTop: '14px',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#cbd5e1',
                        lineHeight: 1.65,
                        fontSize: '0.93rem',
                      }}
                    >
                      {view.note}
                    </p>
                  </div>

                  {view.accessPriceLabel && (
                    <div
                      style={{
                        marginTop: '14px',
                        display: 'inline-flex',
                        alignSelf: 'flex-start',
                        padding: '10px 14px',
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

                      <div
                        style={{
                          marginTop: '10px',
                          color: '#bfdbfe',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                        }}
                      >
                        {PREMIUM_REMAINING_SLOTS} / {PREMIUM_TOTAL_SLOTS} Premium slots remaining
                      </div>

                      <button
                        onClick={handlePremiumUnlock}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#3b82f6',
                          color: '#ffffff',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Unlock Premium
                      </button>

                      <div
                        style={{
                          marginTop: '10px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {['Instant unlock', 'Secure checkout', 'Limited spots'].map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '999px',
                              border: '1px solid rgba(147, 197, 253, 0.18)',
                              background: 'rgba(255,255,255,0.04)',
                              color: '#dbeafe',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: '10px',
                          color: '#bfdbfe',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        }}
                      >
                        {PREMIUM_RECENT_ACTIVITY}
                      </div>

                      <div
                        style={{
                          marginTop: '8px',
                          color: '#dbeafe',
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                        }}
                      >
                        High demand. Limited premium access remains available.
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

                      <div
                        style={{
                          marginTop: '10px',
                          color: '#fde68a',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                        }}
                      >
                        {DIAMOND_REMAINING_POSITIONS} / {DIAMOND_TOTAL_POSITIONS} Diamond positions left
                      </div>

                      <button
                        onClick={handleDiamondUnlock}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#f59e0b',
                          color: '#000000',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        💎 Secure Position
                      </button>

                      <div
                        style={{
                          marginTop: '10px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {['Instant unlock', 'Priority access', 'Few positions'].map((item) => (
                          <div
                            key={item}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '999px',
                              border: '1px solid rgba(253, 230, 138, 0.18)',
                              background: 'rgba(255,255,255,0.04)',
                              color: '#fde68a',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: '10px',
                          color: '#fde68a',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                        }}
                      >
                        {DIAMOND_RECENT_ACTIVITY}
                      </div>

                      <div
                        style={{
                          marginTop: '8px',
                          color: '#fde68a',
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                        }}
                      >
                        Very limited allocation. Early access closes when positions are filled.
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              padding: '22px 28px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>
              WHY IT MATTERS
            </div>

            <div style={{ color: '#e5e7eb', fontWeight: 600, lineHeight: 1.7, flex: '1 1 420px' }}>
              The faster you see the right deal, the better your pricing, negotiation and execution position becomes.
            </div>

            <div
              style={{
                display: 'flex',
                gap: '22px',
                flexWrap: 'wrap',
                color: '#cbd5e1',
                fontWeight: 700,
              }}
            >
              <div>Earlier access</div>
              <div>Better positioning</div>
              <div>More control before exposure expands</div>
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

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              minWidth: '240px',
            }}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e5e7eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.901 1.153h3.68l-8.04 9.19 9.458 12.504H16.59l-5.8-7.584-6.64 7.584H.47l8.6-9.83L0 1.154h7.598l5.243 6.932 6.06-6.932Zm-1.29 19.494h2.039L6.49 3.248H4.302l13.31 17.399Z" />
              </svg>
              <span>X</span>
            </a>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e5e7eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554V14.87c0-1.331-.027-3.043-1.852-3.043-1.853 0-2.136 1.445-2.136 2.946v5.679H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </section>
      </main>

      <FloatingActivity
        activityFeed={ACTIVITY_FEED}
        activityIndex={activityIndex}
      />

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