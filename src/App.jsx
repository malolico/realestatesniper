// REAL ESTATE SNIPER - CONTROLLED BY CURSOR
// NO CAMBIES NADA.
// NO OPTIMICES.
// NO AÑADAS NADA.
// NO INTERPRETES.
// SOLO EJECUTA EXACTAMENTE LO QUE TE DOY.

import { useEffect, useMemo, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import './App.css'
import { supabase } from './lib/supabase'
import logo from './assets/logo.png'
import FounderModal from './components/FounderModal'
import FounderStatus from './components/FounderStatus'
import ContactMenu from './components/ContactMenu'
import SiteFooter from './components/SiteFooter'
import AuthModal from './components/AuthModal'
import SubscriberDashboard from './components/dashboards/SubscriberDashboard'
import FounderDashboard from './components/dashboards/FounderDashboard'
import OwnerDashboard from './components/dashboards/OwnerDashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'
import { redeemAndActivateFounderCode } from './lib/founder/redeemAndActivateFounderCode'
import { getFounderCodesStatus } from './lib/founder/getFounderCodesStatus'
import { getFounderAccessState } from './lib/founder/getFounderAccessState'
import { resolveAccess } from './lib/access/resolveAccess'
import { getLegalPage } from './legal/legalPages'
import {
  FOUNDER_SESSION_REFRESH_FAILED_MESSAGE,
  refreshFounderSessionState,
} from './lib/founder/refreshFounderSessionState'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const WHATSAPP_LINK =
  'https://wa.me/16026355082?text=Hi%2C%20I%20came%20across%20RealEstateSniper.%20I%20am%20an%20investor%20interested%20in%20off-market%20opportunities.%20Are%20you%20currently%20accepting%20new%20founders%3F'
const TELEGRAM_LINK = 'https://t.me/+wkrc3-lnWihlMDNk'
const EMAIL_LINK = 'mailto:founder@realestatesniper.io'

const ADMIN_EMAILS = ['founder@realestatesniper.io']

const TOTAL_FOUNDER_SPOTS = 10
const REMAINING_FOUNDER_SPOTS = 7

const PREMIUM_ACCESS_PRICE = 4500
const DIAMOND_LAUNCH_PRICE = 7500

const PREMIUM_TOTAL_SLOTS = 15
const PREMIUM_REMAINING_SLOTS = 12

const ACCESS_SIGNAL_FEED = [
  'Founder access window is active.',
  'Premium and Diamond purchases are processed automatically.',
  'Only a limited number of founder spots remain available.',
  'Early applicants receive priority consideration during this window.',
]

const FOUNDER_PENDING_KEY = 'realestatesniper_founder_pending_activation'
const FOUNDER_PENDING_CODE_KEY = 'realestatesniper_founder_pending_code'
const SUBSCRIPTION_SYNC_PENDING_KEY = 'realestatesniper_subscription_sync_pending'
const STRIPE_SUCCESS_RELOAD_DONE_KEY = 'realestatesniper_stripe_success_reload_done'
const DEAL_CHECKOUT_SYNC_PENDING_KEY = 'realestatesniper_deal_checkout_sync_pending'
const DEAL_CHECKOUT_DEAL_ID_KEY = 'realestatesniper_deal_checkout_deal_id'
const DEAL_CHECKOUT_TIER_KEY = 'realestatesniper_deal_checkout_tier'
const PREMIUM_MAX_SLOTS = 15
const DIAMOND_DEFAULT_MAX_SLOTS = 10

const SUBSCRIPTION_TERMS_PATH =
  getLegalPage('subscriptionTerms')?.path ?? '/legal/subscription-terms'
const TERMS_OF_SERVICE_PATH =
  getLegalPage('termsOfService')?.path ?? '/legal/terms-of-service'
const PREMIUM_PURCHASE_TERMS_PATH =
  getLegalPage('premiumPurchaseTerms')?.path ?? '/legal/premium-purchase-terms'
const DIAMOND_PURCHASE_TERMS_PATH =
  getLegalPage('diamondPurchaseTerms')?.path ?? '/legal/diamond-purchase-terms'

const ENGINE_SIGNAL_LABELS = {
  active_distress_enforcement_engine: 'Distress',
  probate_csv_engine: 'Probate',
  tax_delinquency_csv_engine: 'Tax delinquency',
  pre_foreclosure_csv_engine: 'Pre-foreclosure',
  repricing_csv_engine: 'Repricing',
}

function canonicalCity(value) {
  if (value == null || value === '') return ''

  const trimmed = String(value).trim()
  if (!trimmed) return ''

  return trimmed
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function isOwnerAccessRole(user) {
  return user?.user_metadata?.access_role === 'owner'
}

function App() {
  const [markets, setMarkets] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('All')
  const [userMode, setUserMode] = useState('visitor')
  const [subscriberUnlocked, setSubscriberUnlocked] = useState(false)
  const [premiumUnlocked, setPremiumUnlocked] = useState(false)
  const [diamondUnlocked, setDiamondUnlocked] = useState(false)
  const [showFounderGate, setShowFounderGate] = useState(false)
  const [founderCodeInput, setFounderCodeInput] = useState('')
  const [founderError, setFounderError] = useState('')
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [accessSignalIndex, setAccessSignalIndex] = useState(0)
  const [remainingFounderSpots, setRemainingFounderSpots] = useState(
    REMAINING_FOUNDER_SPOTS,
  )
  const [totalFounderSpots, setTotalFounderSpots] = useState(TOTAL_FOUNDER_SPOTS)
  const [foundersCohortFull, setFoundersCohortFull] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showPlatformInfo, setShowPlatformInfo] = useState(false)
  const [platformInfoAccessNotice, setPlatformInfoAccessNotice] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [authContext, setAuthContext] = useState('subscriber')
  const [showPasswordResetFlow, setShowPasswordResetFlow] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [passwordResetSubmitting, setPasswordResetSubmitting] = useState(false)
  const [passwordResetError, setPasswordResetError] = useState('')
  const [passwordResetInfo, setPasswordResetInfo] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [dealPurchaseCounts, setDealPurchaseCounts] = useState({})
  const [purchasedDealAccess, setPurchasedDealAccess] = useState({})
  const [purchasesLoaded, setPurchasesLoaded] = useState(false)
  const [unlockFeedbackMessage, setUnlockFeedbackMessage] = useState('')
  const [purchaseConfirmation, setPurchaseConfirmation] = useState(null)
  const [purchaseTermsAccepted, setPurchaseTermsAccepted] = useState(false)
  const [showSubscriptionConfirmation, setShowSubscriptionConfirmation] = useState(false)
  const [subscriptionTermsAccepted, setSubscriptionTermsAccepted] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminActionLoading, setAdminActionLoading] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminSuccess, setAdminSuccess] = useState('')

  const contactMenuRef = useRef(null)
  const subscriptionPollGuardRef = useRef(false)
  /** While true, ignore onAuthStateChange user updates (avoid stale metadata overwriting post-RPC refresh). */
  const founderSessionSyncRef = useRef(false)
  const selectedDealRef = useRef(null)
  const dealDetailHistoryActiveRef = useRef(false)
  const skipDealDetailPopStateRef = useRef(false)
  const selectedCategoryRef = useRef(null)
  const categoryHistoryActiveRef = useRef(false)
  const skipCategoryPopStateRef = useRef(false)

  selectedDealRef.current = selectedDeal
  selectedCategoryRef.current = selectedCategory

  const SHOW_SUBSCRIBER_DASHBOARD = Boolean(currentUser)

  const isAdmin = currentUser?.email
    ? ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
    : false

  // Founder access is metadata-driven — see getFounderAccessState.js (UI is not source of truth).
  const founderAccess = getFounderAccessState({
    user: currentUser,
    isAdmin,
    remainingFounderSpots,
    foundersCohortFull,
  })

  const {
    founderUnlocked,
    founderAccessClosed,
    canEnterFounderMode,
    founderTrialEndsAt,
    founderDaysRemaining,
    founderExpiredNotice,
  } = founderAccess

  // Display-only workspace hierarchy — does not affect userMode or gates.
  let primaryVisualWorkspace = 'visitor'
  if (currentUser) {
    if (isAdmin) {
      primaryVisualWorkspace = 'admin'
    } else if (currentUser.user_metadata?.access_role === 'owner') {
      primaryVisualWorkspace = 'owner'
    } else if (founderUnlocked) {
      primaryVisualWorkspace = 'founder'
    } else {
      primaryVisualWorkspace = 'investor'
    }
  }

  const showInvestorAccount =
    primaryVisualWorkspace === 'investor' || primaryVisualWorkspace === 'founder'

  const isOwnerRole = currentUser?.user_metadata?.access_role === 'owner'
  const showInvestorMarketplace = primaryVisualWorkspace !== 'owner'

  let headerPrimaryStatusLabel = 'Registered'
  if (isAdmin) {
    headerPrimaryStatusLabel = 'Admin'
  } else if (isOwnerRole) {
    headerPrimaryStatusLabel = 'Owner'
  } else if (founderUnlocked) {
    headerPrimaryStatusLabel = 'Founder Active'
  } else if (diamondUnlocked) {
    headerPrimaryStatusLabel = 'Diamond Active'
  } else if (premiumUnlocked) {
    headerPrimaryStatusLabel = 'Premium Active'
  } else if (subscriberUnlocked) {
    headerPrimaryStatusLabel = 'Subscriber Active'
  }

  let heroTitle = 'Private off-market deals before everyone else'
  let heroDescription = 'Limited early access to live deal flow before full public release.'

  if (primaryVisualWorkspace === 'founder') {
    heroTitle = 'Founder workspace for early deal intelligence'
    heroDescription =
      'Track your Founder window, review early opportunities, and manage Premium/Diamond unlocks.'
  } else if (primaryVisualWorkspace === 'investor') {
    heroTitle = 'Your investor account workspace'
    heroDescription =
      'Review live opportunities, track purchases, and manage verification before high-trust unlocks.'
  } else if (primaryVisualWorkspace === 'owner') {
    heroTitle = 'Private Off-Market Owner Portal'
    heroDescription =
      'Submit off-market properties for private review, authorize how your listings are shared, and manage properties connected to your owner account.'
  } else if (primaryVisualWorkspace === 'admin') {
    heroTitle = 'Operations command center'
    heroDescription =
      'Monitor users, deal access, owner review, audit readiness, and platform health.'
  }

  const compactHero = Boolean(currentUser)
  const isOwnerWorkspace = primaryVisualWorkspace === 'owner'
  const heroSectionStyle = compactHero
    ? {
        padding: isOwnerWorkspace ? '20px 0 8px' : '24px 0 12px',
        gap: isOwnerWorkspace ? '16px' : '20px',
      }
    : undefined
  const heroH1Style = compactHero
    ? { color: '#ffffff', fontSize: '40px', lineHeight: 1.12 }
    : { color: '#ffffff' }
  const heroDescStyle = compactHero
    ? { marginTop: '10px', fontSize: '16px', lineHeight: 1.55 }
    : undefined
  const heroActionsStyle = compactHero ? { marginTop: '14px' } : undefined
  const heroStatsStyle = compactHero ? { marginTop: '18px' } : undefined
  const heroNoticeSpacing = compactHero
    ? { marginTop: '10px', padding: '10px 14px' }
    : { marginTop: '18px', padding: '12px 16px' }
  const compactDeals = Boolean(currentUser)
  const dealsSectionStyle = compactDeals ? { padding: '20px 0 4px' } : undefined
  const dealsHeadingStyle = compactDeals
    ? { marginBottom: '10px', gap: '12px', alignItems: 'center' }
    : undefined
  const dealsEyebrowStyle = compactDeals
    ? { marginBottom: '6px', padding: '5px 10px', fontSize: '11px', letterSpacing: '0.1em' }
    : undefined
  const dealsH2Style = compactDeals
    ? { color: '#ffffff', fontSize: '24px', lineHeight: 1.2, letterSpacing: '-0.02em' }
    : { color: '#ffffff' }
  const dealsSubcopyStyle = compactDeals
    ? { margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#94a3b8', maxWidth: '520px' }
    : undefined
  const dealsFilterRowStyle = compactDeals ? { marginBottom: '12px' } : undefined
  const workspaceContextBarStyle = {
    marginTop: isOwnerWorkspace ? '4px' : '8px',
    marginBottom: isOwnerWorkspace ? '6px' : '10px',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(10, 14, 22, 0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  }

  let workspaceContextTitle = 'Investor Workspace'
  let workspaceContextStatus = 'Live opportunity flow'
  let workspaceContextNote = 'Filter markets and open active categories'

  if (primaryVisualWorkspace === 'founder') {
    workspaceContextTitle = 'Founder Workspace'
    workspaceContextStatus = 'Early access active'
    workspaceContextNote = 'Trial window and deal visibility in focus'
  } else if (primaryVisualWorkspace === 'owner') {
    workspaceContextTitle = 'Owner Portal'
    workspaceContextStatus = 'Owner account active'
    workspaceContextNote = 'Property review and submission tools are available in preview mode.'
  } else if (primaryVisualWorkspace === 'admin') {
    workspaceContextTitle = 'Admin Workspace'
    workspaceContextStatus = 'Operational monitoring active'
    workspaceContextNote = 'Platform health and access oversight'
  }
  const sectionDividerWrapStyle = {
    margin: '6px 0 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }
  const sectionDividerLabelStyle = {
    color: '#94a3b8',
    fontSize: '0.69rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  }
  const sectionDividerLineStyle = {
    flex: 1,
    height: '1px',
    background: 'rgba(148, 163, 184, 0.22)',
  }
  const founderWorkspaceModules = [
    {
      title: 'Founder Status',
      items: ['Founder Access Active', 'Trial Window Active', 'Access Scope Enabled'],
    },
    {
      title: 'Founder Access Scope',
      items: [
        'Yellow Deals: Full',
        'Green Deals: Partial',
        'Red Deals: Limited',
        'Premium/Diamond Purchases Enabled',
      ],
    },
    {
      title: 'Founder Activity',
      items: [
        'Premium reviews monitored',
        'Founder visibility active',
        'Early access flow enabled',
      ],
    },
    {
      title: 'Founder Upgrade Path',
      items: [
        'Upgrade to Subscriber',
        'Preserve Premium/Diamond history',
        'Maintain workspace continuity',
      ],
    },
  ]
  const founderWorkspaceGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '10px',
    marginBottom: '14px',
  }
  const founderWorkspaceCardStyle = {
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    background: 'rgba(8, 12, 20, 0.68)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }
  const founderWorkspaceTitleStyle = {
    fontSize: '0.78rem',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#cbd5e1',
  }
  const founderWorkspaceListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  }
  const founderWorkspaceItemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.78rem',
    color: '#94a3b8',
  }
  const founderWorkspaceDotStyle = {
    width: '5px',
    height: '5px',
    borderRadius: '999px',
    background: '#22c55e',
    flexShrink: 0,
  }
  const showWorkspaceModulesDivider =
    currentUser &&
    (primaryVisualWorkspace === 'founder' ||
      showInvestorAccount ||
      primaryVisualWorkspace === 'admin')

  function renderOperationalDivider(label) {
    if (!currentUser) return null
    return (
      <div style={sectionDividerWrapStyle}>
        <span style={sectionDividerLabelStyle}>{label}</span>
        <div style={sectionDividerLineStyle}></div>
      </div>
    )
  }

  const subscriberEmailVerified = Boolean(
    currentUser?.email_confirmed_at ||
      currentUser?.user_metadata?.email_verified === true,
  )

  const subscriberPhoneVerified = currentUser?.user_metadata?.phone_verified === true

  const dashboardAccess = resolveAccess(currentUser)

  const founderDashboardTrialStatus = currentUser?.user_metadata?.founder_trial_status ?? null
  const founderDashboardTrialEndsAt = currentUser?.user_metadata?.founder_trial_ends_at ?? null

  let founderDashboardDaysRemaining = null
  if (founderDashboardTrialEndsAt) {
    const diff = new Date(founderDashboardTrialEndsAt).getTime() - Date.now()
    founderDashboardDaysRemaining = diff <= 0 ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function getDealTier(deal) {
    if (deal?.is_diamond === true) return 'diamond'
    if (deal?.is_premium === true) return 'premium'
    return deal?.access_tier || 'standard'
  }

  function getLocationDisplay(deal, premiumUnlocked, diamondUnlocked) {
    const tier = getDealTier(deal)

    if (tier === 'premium' && !premiumUnlocked) {
      return `${getDealCity(deal)} (approximate area)`
    }

    if (tier === 'premium' && premiumUnlocked) {
      return deal?.address || getDealCity(deal)
    }

    if (tier === 'diamond' && !diamondUnlocked) {
      return `${getDealCity(deal)} (location restricted)`
    }

    if (tier === 'diamond' && diamondUnlocked) {
      return deal?.address || 'Full address available after access unlock'
    }

    return getDealCity(deal)
  }

  async function handleStripeCheckout(tier, deal) {
    if (!subscriberUnlocked && !founderUnlocked && !isAdmin) {
      alert('Subscribe first to unlock Premium and Diamond purchases.')
      return
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            type: tier,
            deal_id: deal.id,
          },
        },
      )

      if (error) {
        console.error('Stripe deal checkout function error:', error)
        alert('Error creating Premium/Diamond checkout session')
        return
      }

      if (data?.url) {
        sessionStorage.setItem(DEAL_CHECKOUT_SYNC_PENDING_KEY, '1')
        sessionStorage.setItem(DEAL_CHECKOUT_DEAL_ID_KEY, String(deal.id))
        sessionStorage.setItem(DEAL_CHECKOUT_TIER_KEY, String(tier))
        window.location.href = data.url
        return
      }

      console.error('No Stripe URL returned for deal checkout:', data)
      alert('Error creating Premium/Diamond checkout session')
    } catch (error) {
      console.error('Stripe deal checkout error:', error)
      alert('Error connecting to payment')
    }
  }

  function openPurchaseConfirmation(tier, deal) {
    if (!deal) return
    setPurchaseTermsAccepted(false)
    setPurchaseConfirmation({ tier, deal })
  }

  function closePurchaseConfirmation() {
    setPurchaseConfirmation(null)
    setPurchaseTermsAccepted(false)
  }

  async function confirmPurchaseCheckout() {
    if (!purchaseConfirmation || !purchaseTermsAccepted) return
    const { tier, deal } = purchaseConfirmation
    closePurchaseConfirmation()
    await handleStripeCheckout(tier, deal)
  }

  function openSubscriptionConfirmation() {
    setSubscriptionTermsAccepted(false)
    setShowSubscriptionConfirmation(true)
  }

  function closeSubscriptionConfirmation() {
    setShowSubscriptionConfirmation(false)
    setSubscriptionTermsAccepted(false)
  }

  async function confirmSubscriptionCheckout() {
    if (!subscriptionTermsAccepted) return
    closeSubscriptionConfirmation()
    await handleSubscriptionCheckout()
  }

  async function handleSubscriptionCheckout() {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            type: 'subscription',
          },
        },
      )

      if (error) {
        console.error('Stripe subscription function error:', error)
        alert('Error creating Stripe session')
        return
      }

      if (data?.url) {
        window.location.href = data.url
        return
      }

      console.error('No Stripe URL returned:', data)
      alert('Error creating Stripe session')
    } catch (error) {
      console.error('Stripe subscription checkout error:', error)
      alert('Error connecting to payment')
    }
  }

  async function loadDealPurchaseCounts() {
    const { data, error } = await supabase
      .from('deal_access_purchases')
      .select('deal_id, access_type')

    if (error) {
      console.error('ERROR LOADING DEAL PURCHASE COUNTS:', error)
      return
    }

    const counts = {}

    ;(data || []).forEach((purchase) => {
      if (!purchase.deal_id) return

      if (!counts[purchase.deal_id]) {
        counts[purchase.deal_id] = {
          premium: 0,
          diamond: 0,
        }
      }

      if (purchase.access_type === 'premium_one_time') {
        counts[purchase.deal_id].premium += 1
      }

      if (purchase.access_type === 'platinum_one_time') {
        counts[purchase.deal_id].diamond += 1
      }
    })

    setDealPurchaseCounts(counts)
  }

  useEffect(() => {
    let cancelled = false

    async function loadMarketplaceData() {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (isOwnerAccessRole(user) || isOwnerRole) {
        if (!cancelled) {
          setMarkets([])
          setDeals([])
          setDealPurchaseCounts({})
          setLoading(false)
        }
        return
      }

      if (!cancelled) {
        setLoading(true)
      }

      const { data: marketsData } = await supabase
        .from('markets')
        .select('*')
        .order('city', { ascending: true })

      const { data: dealsData } = await supabase
        .from('deals')
        .select('*')
        .order('score', { ascending: false })

      if (!cancelled) {
        setMarkets(marketsData || [])
        setDeals(
          (dealsData || []).map((deal) => ({
            ...deal,
            access_tier: getDealTier(deal),
          })),
        )
        setLoading(false)
      }
    }

    loadMarketplaceData()

    return () => {
      cancelled = true
    }
  }, [isOwnerRole])

  useEffect(() => {
    function handleWorkspacePopState() {
      if (skipDealDetailPopStateRef.current) {
        skipDealDetailPopStateRef.current = false
        return
      }

      if (skipCategoryPopStateRef.current) {
        skipCategoryPopStateRef.current = false
        return
      }

      if (selectedDealRef.current) {
        dealDetailHistoryActiveRef.current = false
        setSelectedDeal(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      if (selectedCategoryRef.current) {
        categoryHistoryActiveRef.current = false
        setSelectedCategory(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    window.addEventListener('popstate', handleWorkspacePopState)
    return () => window.removeEventListener('popstate', handleWorkspacePopState)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      const searchParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
      const stripeCanceled = searchParams.get('canceled') === 'true'
      const stripeSuccess = searchParams.get('success') === 'true'
      const recoveryRequested =
        searchParams.get('type') === 'recovery' || hashParams.get('type') === 'recovery'

      if (recoveryRequested && !cancelled) {
        setShowPasswordResetFlow(true)
        setShowAuthModal(false)
      }

      if (stripeCanceled && !cancelled) {
        setUnlockFeedbackMessage('Checkout canceled. No payment was made.')
        const cleanCanceledUrl = `${window.location.origin}${window.location.pathname}${window.location.hash || ''}`
        window.history.replaceState({}, '', cleanCanceledUrl)
      }

      if (stripeSuccess) {
        sessionStorage.setItem(SUBSCRIPTION_SYNC_PENDING_KEY, '1')
      }

      const reloadAlreadyDone =
        sessionStorage.getItem(STRIPE_SUCCESS_RELOAD_DONE_KEY) === '1'

      if (stripeSuccess && !reloadAlreadyDone) {
        subscriptionPollGuardRef.current = true
        await new Promise((resolve) => setTimeout(resolve, 2500))
        if (cancelled) {
          subscriptionPollGuardRef.current = false
          return
        }
        sessionStorage.setItem(STRIPE_SUCCESS_RELOAD_DONE_KEY, '1')
        window.location.reload()
        return
      }

      const pendingSubscriptionSync =
        sessionStorage.getItem(SUBSCRIPTION_SYNC_PENDING_KEY) === '1'

      const shouldSyncSubscription = stripeSuccess || pendingSubscriptionSync

      let initialUser = null

      if (shouldSyncSubscription) {
        await supabase.auth.refreshSession().catch(() => {})
        if (cancelled) return

        let { data: initialData } = await supabase.auth.getUser()
        initialUser = initialData?.user

        if (
          initialUser &&
          initialUser.user_metadata?.subscription_active !== true
        ) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          if (cancelled) return
          await supabase.auth.refreshSession().catch(() => {})
          if (cancelled) return
          ;({ data: initialData } = await supabase.auth.getUser())
          initialUser = initialData?.user
        }
      } else {
        const { data: initialData } = await supabase.auth.getUser()
        initialUser = initialData?.user
      }

      if (initialUser?.user_metadata?.subscription_active === true) {
        if (!cancelled) setCurrentUser(initialUser)
        sessionStorage.removeItem(SUBSCRIPTION_SYNC_PENDING_KEY)
        sessionStorage.removeItem(STRIPE_SUCCESS_RELOAD_DONE_KEY)
        if (stripeSuccess) {
          const dealCheckoutPending =
            sessionStorage.getItem(DEAL_CHECKOUT_SYNC_PENDING_KEY) === '1'
          if (!dealCheckoutPending) {
            setUnlockFeedbackMessage(
              'Subscription active. Your investor access is now enabled.',
            )
          }
          const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.hash || ''}`
          window.history.replaceState({}, '', cleanUrl)
        }
        return
      }

      if (!shouldSyncSubscription) {
        if (!cancelled) {
          setCurrentUser(initialUser || null)
        }
        return
      }

      if (!cancelled && initialUser) {
        setCurrentUser(initialUser)
      } else if (!cancelled && !initialUser) {
        setCurrentUser(null)
        sessionStorage.removeItem(SUBSCRIPTION_SYNC_PENDING_KEY)
        sessionStorage.removeItem(STRIPE_SUCCESS_RELOAD_DONE_KEY)
        if (stripeSuccess) {
          const cleanUrl = `${window.location.origin}${window.location.pathname}${window.location.hash || ''}`
          window.history.replaceState({}, '', cleanUrl)
        }
        return
      }

      subscriptionPollGuardRef.current = false
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowPasswordResetFlow(true)
        setShowAuthModal(false)
      }
      if (subscriptionPollGuardRef.current) return
      if (founderSessionSyncRef.current) return
      setCurrentUser(session?.user || null)
    })

    return () => {
      cancelled = true
      subscriptionPollGuardRef.current = false
      listener.subscription.unsubscribe()
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
      setAccessSignalIndex((prev) => {
        const next = prev + 1
        return next >= ACCESS_SIGNAL_FEED.length ? 0 : next
      })
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadFounderCodesStatus() {
      const status = await getFounderCodesStatus()
      if (cancelled) return

      if (status.error) {
        setRemainingFounderSpots(REMAINING_FOUNDER_SPOTS)
        setTotalFounderSpots(TOTAL_FOUNDER_SPOTS)
        setFoundersCohortFull(false)
        return
      }

      setRemainingFounderSpots(status.remaining)
      setTotalFounderSpots(status.total)
      setFoundersCohortFull(status.foundersFull)
    }

    loadFounderCodesStatus()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!foundersCohortFull || !showFounderGate) return

    setShowFounderGate(false)
    setFounderCodeInput('')
    setFounderError('')
  }, [foundersCohortFull, showFounderGate])

  useEffect(() => {
    setSelectedDeal(null)
    setSelectedCategory(null)

    if (!currentUser) {
      setSubscriberUnlocked(false)
      setPremiumUnlocked(false)
      setDiamondUnlocked(false)
      setShowAdminPanel(false)
      setAdminUsers([])
      setAdminError('')
      setAdminSuccess('')
      setUserMode('visitor')
      return
    }

    const metadata = currentUser.user_metadata || {}

    const hasActiveSubscription = metadata.subscription_active === true

    const premiumAccess = metadata.premium_access === true
    const diamondAccess = metadata.diamond_access === true

    setSubscriberUnlocked(hasActiveSubscription)

    setPremiumUnlocked(isAdmin || premiumAccess || diamondAccess)
    setDiamondUnlocked(isAdmin || diamondAccess)

    if (isAdmin) {
      setUserMode('admin')
      return
    }

    const access = getFounderAccessState({
      user: currentUser,
      isAdmin,
      remainingFounderSpots,
      foundersCohortFull,
    })

    if (access.canEnterFounderMode) {
      setUserMode('founder')
      return
    }

    setUserMode(hasActiveSubscription ? 'subscriber' : 'registered')
  }, [currentUser, isAdmin, remainingFounderSpots, foundersCohortFull])

  // Block manual founder mode unless metadata grants access_role === 'founder' (active trial).
  useEffect(() => {
    if (userMode !== 'founder') return

    const access = getFounderAccessState({
      user: currentUser,
      isAdmin,
      remainingFounderSpots,
      foundersCohortFull,
    })

    if (access.canEnterFounderMode) return

    const metadata = currentUser?.user_metadata ?? {}
    setUserMode(metadata.subscription_active === true ? 'subscriber' : 'registered')
  }, [userMode, currentUser, isAdmin, remainingFounderSpots, foundersCohortFull])

  useEffect(() => {
    async function processPendingFounderActivation() {
      const pendingFounderActivation =
        window.sessionStorage.getItem(FOUNDER_PENDING_KEY) === 'pending'

      if (!pendingFounderActivation || !currentUser) return

      const metadata = currentUser.user_metadata || {}

      if (metadata.access_role === 'owner') {
        window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
        window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)
        return
      }

      if (foundersCohortFull) {
        window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
        window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)
        return
      }

      if (metadata.access_role === 'founder' && metadata.founder_trial_status === 'active') {
        founderSessionSyncRef.current = true
        try {
          const snapshot = await refreshFounderSessionState({
            isAdmin,
            remainingFounderSpots,
            foundersCohortFull,
            requireFounderAccess: true,
          })
          if (snapshot.user) setCurrentUser(snapshot.user)
        } finally {
          founderSessionSyncRef.current = false
        }
        window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
        window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)
        return
      }

      const pendingCode = (
        window.sessionStorage.getItem(FOUNDER_PENDING_CODE_KEY) || ''
      )
        .trim()
        .toUpperCase()

      if (!pendingCode) {
        window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
        setFounderError('Founder code missing after sign-in. Please enter your code again.')
        openFounderGate()
        return
      }

      // Post sign-up/login: same atomic RPC so code is never used without founder access.
      await redeemAndActivateFounderForUser(pendingCode, currentUser.id)
    }

    processPendingFounderActivation()
  }, [currentUser, foundersCohortFull])

  async function loadUserPurchases(userId) {
    if (!userId) {
      setPurchasedDealAccess({})
      setPurchasesLoaded(true)
      return {}
    }

    setPurchasesLoaded(false)

    try {
      const { data: purchases } = await supabase
        .from('deal_access_purchases')
        .select('deal_id, access_type')
        .eq('user_id', userId)

      const purchaseMap = {}

      ;(purchases || []).forEach((p) => {
        if (!p.deal_id) return

        if (!purchaseMap[p.deal_id]) {
          purchaseMap[p.deal_id] = {
            premium: false,
            diamond: false,
          }
        }

        if (p.access_type === 'premium_one_time') {
          purchaseMap[p.deal_id].premium = true
        }

        if (p.access_type === 'platinum_one_time') {
          purchaseMap[p.deal_id].diamond = true
          purchaseMap[p.deal_id].premium = true
        }
      })

      setPurchasedDealAccess(purchaseMap)
      return purchaseMap
    } finally {
      setPurchasesLoaded(true)
    }
  }

  useEffect(() => {
    async function loadPurchases() {
      if (!currentUser || isOwnerRole) {
        await loadUserPurchases(null)
        return
      }

      await loadUserPurchases(currentUser.id)
    }

    loadPurchases()
  }, [currentUser, isOwnerRole])

  useEffect(() => {
    if (!unlockFeedbackMessage) return

    const timer = setTimeout(() => {
      setUnlockFeedbackMessage('')
    }, 4000)

    return () => clearTimeout(timer)
  }, [unlockFeedbackMessage])

  useEffect(() => {
    let cancelled = false
    let intervalId = null

    async function syncDealCheckoutPurchases() {
      if (!currentUser?.id) return
      if (isOwnerRole) return

      const pending =
        sessionStorage.getItem(DEAL_CHECKOUT_SYNC_PENDING_KEY) === '1'
      const dealId = sessionStorage.getItem(DEAL_CHECKOUT_DEAL_ID_KEY)
      const tier = sessionStorage.getItem(DEAL_CHECKOUT_TIER_KEY)

      if (!pending || !dealId || (tier !== 'premium' && tier !== 'diamond')) {
        return
      }

      const startedAt = Date.now()
      const maxWaitMs = 20000
      const stepMs = 1500

      const hasTargetAccess = (purchaseMap) => {
        const purchase = purchaseMap?.[dealId]
        if (!purchase) return false
        if (tier === 'diamond') return purchase.diamond === true
        return purchase.premium === true || purchase.diamond === true
      }

      const clearFlags = () => {
        sessionStorage.removeItem(DEAL_CHECKOUT_SYNC_PENDING_KEY)
        sessionStorage.removeItem(DEAL_CHECKOUT_DEAL_ID_KEY)
        sessionStorage.removeItem(DEAL_CHECKOUT_TIER_KEY)
      }

      let purchaseMap = await loadUserPurchases(currentUser.id)
      if (cancelled) return

      if (hasTargetAccess(purchaseMap)) {
        setUnlockFeedbackMessage(
          tier === 'diamond'
            ? 'Diamond access unlocked successfully.'
            : 'Premium access unlocked successfully.',
        )
        clearFlags()
        return
      }

      intervalId = setInterval(async () => {
        if (cancelled) return

        const timedOut = Date.now() - startedAt >= maxWaitMs
        if (timedOut) {
          clearInterval(intervalId)
          clearFlags()
          return
        }

        const nextMap = await loadUserPurchases(currentUser.id)
        if (cancelled) return

        if (hasTargetAccess(nextMap)) {
          setUnlockFeedbackMessage(
            tier === 'diamond'
              ? 'Diamond access unlocked successfully.'
              : 'Premium access unlocked successfully.',
          )
          clearInterval(intervalId)
          clearFlags()
        }
      }, stepMs)
    }

    syncDealCheckoutPurchases()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
    }
  }, [currentUser, isOwnerRole])

  function userHasPurchasedDeal(deal, tier) {
    if (!deal?.id) return false

    const purchase = purchasedDealAccess[deal.id]
    if (!purchase) return false

    if (tier === 'diamond') return purchase.diamond === true
    if (tier === 'premium') return purchase.premium === true || purchase.diamond === true

    return false
  }

  useEffect(() => {
    if (isOwnerRole) return
    if (!deals.length) return

    loadDealPurchaseCounts()
  }, [currentUser, deals, isOwnerRole])

  // Founder expiration: read-only via getFounderAccessState (no client updateUser / downgrade).

  const cities = useMemo(() => {
    const canonicalSet = new Set()

    deals.forEach((d) => {
      const city = canonicalCity(d.city)
      if (city) canonicalSet.add(city)
    })

    return ['All', ...Array.from(canonicalSet).sort()]
  }, [deals])

  const filteredDeals = useMemo(() => {
    if (selectedCity === 'All') return deals

    const selectedCanonical = canonicalCity(selectedCity)
    return deals.filter((d) => canonicalCity(d.city) === selectedCanonical)
  }, [deals, selectedCity])

  const myPurchasedEntries = useMemo(() => {
    if (!currentUser) return []

    return Object.keys(purchasedDealAccess)
      .map((dealId) => {
        const access = purchasedDealAccess[dealId]
        const deal = deals.find((d) => String(d.id) === String(dealId))
        return { dealId, deal, access }
      })
      .filter((row) => row.deal)
  }, [currentUser, purchasedDealAccess, deals])

  const unpricedLeads = useMemo(
    () => filteredDeals.filter((deal) => isUnpricedLead(deal)),
    [filteredDeals],
  )

  const yellowDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
      if (!isPricedOpportunity(deal)) return false
      const score = getDealScore(deal)
      return deal.access_tier === 'standard' && score < 60
    })
  }, [filteredDeals])

  const greenDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
      if (!isPricedOpportunity(deal)) return false
      const score = deal.score || 0
      return deal.access_tier === 'standard' && score >= 60 && score < 80
    })
  }, [filteredDeals])

  const redDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
      if (!isPricedOpportunity(deal)) return false
      const score = deal.score || 0
      return deal.access_tier === 'standard' && score >= 80
    })
  }, [filteredDeals])

  const premiumDeals = useMemo(() => {
  return filteredDeals.filter((deal) => deal.access_tier === 'premium')
  }, [filteredDeals])

  const diamondDeals = useMemo(() => {
  return filteredDeals.filter((deal) => deal.access_tier === 'diamond')
  }, [filteredDeals])

  const platformSnapshot = {
    generalStatus: {
      workspaceLabel: workspaceContextTitle,
      marketplaceLoading: loading,
      adminEmail: currentUser?.email ?? null,
    },
    quickMetrics: {
      activeMarketsCount: markets.filter((market) => market.status === 'active').length,
      citiesCount: new Set(deals.map((deal) => deal.city).filter(Boolean)).size,
      totalDealsCount: deals.length,
      trackedOpportunitiesCount: markets.reduce(
        (sum, market) => sum + (market.opportunities_count || 0),
        0,
      ),
      sniperDealsCount: markets.reduce(
        (sum, market) => sum + (market.sniper_deals_count || 0),
        0,
      ),
      yellowDealsCount: yellowDeals.length,
      greenDealsCount: greenDeals.length,
      redDealsCount: redDeals.length,
      unpricedLeadsCount: unpricedLeads.length,
      premiumDealsCount: premiumDeals.length,
      diamondDealsCount: diamondDeals.length,
      averageDealScore:
        deals.length > 0
          ? Math.round(deals.reduce((sum, deal) => sum + (deal.score || 0), 0) / deals.length)
          : null,
      totalPremiumPurchases: Object.values(dealPurchaseCounts).reduce(
        (sum, counts) => sum + (counts.premium || 0),
        0,
      ),
      totalDiamondPurchases: Object.values(dealPurchaseCounts).reduce(
        (sum, counts) => sum + (counts.diamond || 0),
        0,
      ),
      founderSpotsRemaining: remainingFounderSpots,
      founderSpotsTotal: totalFounderSpots,
      premiumRatio: `${premiumDeals.length}/${deals.length}`,
      diamondRatio: `${diamondDeals.length}/${deals.length}`,
      premiumPercentage:
        deals.length > 0
          ? `${Math.round((premiumDeals.length / deals.length) * 100)}%`
          : '0%',
      diamondPercentage:
        deals.length > 0
          ? `${Math.round((diamondDeals.length / deals.length) * 100)}%`
          : '0%',
      yellowPercentage:
        deals.length > 0
          ? `${Math.round((yellowDeals.length / deals.length) * 100)}%`
          : '0%',
      greenPercentage:
        deals.length > 0
          ? `${Math.round((greenDeals.length / deals.length) * 100)}%`
          : '0%',
      redPercentage:
        deals.length > 0
          ? `${Math.round((redDeals.length / deals.length) * 100)}%`
          : '0%',
    },
    pendingActions: {
      userDirectoryLoaded: adminUsers.length > 0,
      registeredUsersCount:
        showAdminPanel && !adminLoading ? adminUsers.length : null,
    },
    warnings: {
      marketplaceEmpty: !loading && deals.length === 0,
      foundersCohortFull,
      adminPanelError: adminError || null,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const businessOverview = {
    revenue: {
      available: false,
    },
    subscriptions: {
      available: false,
      loaded: purchasesLoaded === true,
    },
    premium: {
      totalPurchases: platformSnapshot.quickMetrics.totalPremiumPurchases,
    },
    diamond: {
      totalPurchases: platformSnapshot.quickMetrics.totalDiamondPurchases,
    },
    refunds: {
      available: false,
    },
    failedPayments: {
      available: false,
    },
    conversion: {
      available: false,
    },
    churn: {
      available: false,
    },
    revenueByProduct: {
      available: false,
    },
    revenueByState: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const criticalAlerts = {
    stripe: {
      available: false,
    },
    webhooks: {
      available: false,
    },
    subscriptions: {
      available: false,
    },
    payments: {
      available: false,
    },
    ownerQueue: {
      available: false,
    },
    factory: {
      available: false,
    },
    supabase: {
      available: false,
    },
    emails: {
      available: false,
    },
    security: {
      available: false,
    },
    system: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
    warnings: {
      marketplaceEmpty: !loading && deals.length === 0,
      foundersCohortFull,
      adminPanelError: adminError || null,
      userDirectoryLoaded: adminUsers.length > 0,
    },
  }

  const userDirectoryLoaded =
    (showAdminPanel && !adminLoading) || adminUsers.length > 0 || Boolean(adminError)

  const userDirectory = {
    loaded: userDirectoryLoaded && !adminLoading,
    loading: showAdminPanel && adminLoading,
    error: adminError || null,
    registeredUsers: userDirectoryLoaded && !adminLoading ? adminUsers.length : null,
    subscribers:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) => user.subscription_active === true).length
        : null,
    subscriberPercentage:
      userDirectoryLoaded && !adminLoading && adminUsers.length > 0
        ? `${Math.round(
            (adminUsers.filter((user) => user.subscription_active === true).length /
              adminUsers.length) *
              100,
          )}%`
        : '0%',
    founders:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) => user.founder_trial_status === 'active').length
        : null,
    premiumUsers:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) => (user.premium_purchase_count || 0) > 0).length
        : null,
    diamondUsers:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) => (user.diamond_purchase_count || 0) > 0).length
        : null,
    owners:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) => user.access_role === 'owner').length
        : null,
    admins:
      userDirectoryLoaded && !adminLoading
        ? adminUsers.filter((user) =>
            ADMIN_EMAILS.includes((user.email || '').toLowerCase()),
          ).length
        : null,
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const marketplaceOperations = {
    marketplaceStatus: {
      marketplaceReady: !loading,
      marketplaceEmpty: !loading && deals.length === 0,
    },
    marketSummary: {
      activeMarkets: platformSnapshot.quickMetrics.activeMarketsCount,
      cities: platformSnapshot.quickMetrics.citiesCount,
      trackedOpportunities: platformSnapshot.quickMetrics.trackedOpportunitiesCount,
      sniperDeals: platformSnapshot.quickMetrics.sniperDealsCount,
      averageDealScore: platformSnapshot.quickMetrics.averageDealScore,
    },
    liveDeals: {
      totalDeals: deals.length,
      yellowDeals: yellowDeals.length,
      greenDeals: greenDeals.length,
      redDeals: redDeals.length,
      yellowPercentage: platformSnapshot.quickMetrics.yellowPercentage,
      greenPercentage: platformSnapshot.quickMetrics.greenPercentage,
      redPercentage: platformSnapshot.quickMetrics.redPercentage,
    },
    premium: {
      premiumDeals: premiumDeals.length,
    },
    diamond: {
      diamondDeals: diamondDeals.length,
    },
    marketplaceEligible: {
      available: false,
    },
    enrichmentPending: {
      unpricedLeads: unpricedLeads.length,
      unpricedPercentage:
        deals.length > 0
          ? `${Math.round((unpricedLeads.length / deals.length) * 100)}%`
          : '0%',
    },
    internalSignals: {
      available: false,
    },
    factorySync: {
      available: false,
    },
    pipelineStatus: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const ownerReviewQueue = {
    pendingReviews: {
      available: false,
    },
    ownerIdentity: {
      available: false,
    },
    propertyVerification: {
      available: false,
    },
    brokerRisk: {
      available: false,
    },
    offMarketConfidence: {
      available: false,
    },
    missingDocuments: {
      available: false,
    },
    factoryRecommendation: {
      available: false,
    },
    adminDecision: {
      available: false,
    },
    nextActions: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const auditSecurity = {
    authentication: {
      available: false,
    },
    payments: {
      available: false,
    },
    subscriptions: {
      available: false,
    },
    roleChanges: {
      available: false,
    },
    ownerActivity: {
      available: false,
    },
    factoryActivity: {
      available: false,
    },
    adminActions: {
      available: false,
    },
    securityEvents: {
      available: false,
    },
    systemEvents: {
      available: false,
    },
    requestIds: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const systemHealth = {
    stripe: {
      available: false,
    },
    supabase: {
      available: false,
    },
    edgeFunctions: {
      available: false,
    },
    marketplace: {
      ready: !loading,
    },
    factory: {
      available: false,
    },
    emailServices: {
      available: false,
    },
    storage: {
      available: false,
    },
    backups: {
      available: false,
    },
    cronJobs: {
      available: false,
    },
    webhooks: {
      available: false,
    },
    performance: {
      available: false,
    },
    latency: {
      available: false,
    },
    errors: {
      available: false,
    },
    warnings: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  const factoryControl = {
    factoryStatus: {
      available: false,
    },
    registeredEngines: {
      available: false,
    },
    runningJobs: {
      available: false,
    },
    completedJobs: {
      available: false,
    },
    failedJobs: {
      available: false,
    },
    warnings: {
      available: false,
    },
    duplicates: {
      available: false,
    },
    pendingQueue: {
      available: false,
    },
    processingTime: {
      available: false,
    },
    lastSynchronization: {
      available: false,
    },
    nextScheduledRun: {
      available: false,
    },
    lastUpdate: {
      marketplaceReady: !loading,
    },
  }

  function getPremiumSlotsTaken(deal) {
    return dealPurchaseCounts[deal?.id]?.premium || 0
  }

  function getDiamondSlotsTaken(deal) {
    return dealPurchaseCounts[deal?.id]?.diamond || 0
  }

  function getDiamondMaxSlots(deal) {
    return deal?.slots_max || DIAMOND_DEFAULT_MAX_SLOTS
  }

  function getPremiumSlotsRemaining(deal) {
    return Math.max(PREMIUM_MAX_SLOTS - getPremiumSlotsTaken(deal), 0)
  }

  function getDiamondSlotsRemaining(deal) {
    return Math.max(getDiamondMaxSlots(deal) - getDiamondSlotsTaken(deal), 0)
  }

  function isPremiumSoldOut(deal) {
    return getPremiumSlotsTaken(deal) >= PREMIUM_MAX_SLOTS
  }

  function isDiamondSoldOut(deal) {
    return getDiamondSlotsTaken(deal) >= getDiamondMaxSlots(deal)
  }

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function handleOwnerDiscoveryRequest() {
    if (selectedDeal) {
      closeDealDetail()
      return
    }
    scrollToSection('owners')
  }

  function openExternalLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }


  function getDealScore(deal) {
    if (!deal) return 0

    const possibleScore =
      deal.score ??
      deal.deal_score ??
      deal.opportunity_score ??
      deal.ai_score ??
      deal.final_score ??
      deal.sniper_score ??
      0

    const numericScore = Number(possibleScore)
    return Number.isFinite(numericScore) ? numericScore : 0
  }

  function getDealTitle(deal) {
    return deal?.title || deal?.name || deal?.deal_title || 'Untitled deal'
  }

  function getDealCity(deal) {
    return deal?.city || deal?.market_city || deal?.market || 'Unknown City'
  }

  function getDealPurchasePrice(deal) {
    return (
      deal?.purchase_price ??
      deal?.asking_price ??
      deal?.price ??
      deal?.estimated_purchase_price ??
      null
    )
  }

  function getDealDiscount(deal) {
    const possibleDiscount =
      deal?.discount_percentage ??
      deal?.discount_pct ??
      deal?.descuento_pct ??
      deal?.discount_percent ??
      deal?.discount ??
      null

    if (possibleDiscount == null) return '—'

    const numericDiscount = Number(possibleDiscount)
    return Number.isFinite(numericDiscount) ? `${numericDiscount}%` : `${possibleDiscount}%`
  }

  function getDealEstimatedValue(deal) {
    return deal?.estimated_value ?? deal?.arv ?? deal?.after_repair_value ?? null
  }

  function formatCurrency(value) {
    if (value == null) return '—'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function parseDealShortNote(deal) {
    const raw = deal?.short_note
    if (!raw || typeof raw !== 'string') return null
    try {
      const parsed = JSON.parse(raw)
      return parsed && typeof parsed === 'object' ? parsed : null
    } catch {
      return null
    }
  }

  function getDealSignalLabel(deal) {
    const engine = deal?.engine_name
    if (engine && ENGINE_SIGNAL_LABELS[engine]) {
      return ENGINE_SIGNAL_LABELS[engine]
    }
    return null
  }

  function getDealSignalLabels(deal) {
    const labels = []
    const primary = getDealSignalLabel(deal)
    if (primary) labels.push(primary)

    const note = parseDealShortNote(deal)
    const overlapHint = [note?.factory_key, note?.account_number, deal?.factory_key]
      .filter(Boolean)
      .join(' ')
      .toUpperCase()
      .includes('OVERLAP')

    if (overlapHint && !labels.includes('Overlap')) {
      labels.push('Overlap')
    }
    return labels
  }

  function getDealClassificationDisplay(deal) {
    const c = (deal?.classification || '').toLowerCase()
    if (c === 'red') return 'High conviction'
    if (c === 'green') return 'Qualified'
    if (c === 'yellow') return 'Watchlist band'
    return null
  }

  function getDealCandidateChips(deal) {
    const chips = []
    if (deal?.is_premium_candidate === true) chips.push('Premium candidate')
    if (deal?.is_diamond_candidate === true) chips.push('Diamond candidate')
    return chips
  }

  function buildDealSummaryText(deal, parsedNote = null) {
    const parts = []
    if (deal?.description?.trim()) parts.push(deal.description.trim())

    const note = parsedNote ?? parseDealShortNote(deal)
    if (note?.notes_excerpt) parts.push(note.notes_excerpt)
    if (note?.source_type && note?.source) {
      parts.push(`Source: ${note.source} (${note.source_type})`)
    }
    if (note?.previous_price != null && note?.current_price != null) {
      parts.push(
        `Price change: ${formatCurrency(note.previous_price)} → ${formatCurrency(note.current_price)}`,
      )
    }
    if (note?.tax_year) parts.push(`Tax year: ${note.tax_year}`)
    if (note?.csm_status) parts.push(`Enforcement status: ${note.csm_status}`)
    if (note?.days_on_market != null) parts.push(`${note.days_on_market} days on market`)
    if (note?.as_of_date) parts.push(`Data as of ${note.as_of_date}`)

    return parts.length ? parts.join(' · ') : null
  }

  function extractSourceFromDescription(description) {
    if (!description?.trim()) return null
    const match = description.match(/Source:\s*([^|]+)/)
    return match ? match[1].trim() : null
  }

  function buildDealFactsItems(deal, parsedNote, pricing, signalLabel) {
    const items = []
    const note = parsedNote ?? parseDealShortNote(deal)

    if (pricing?.priced) {
      if (pricing.discount && pricing.discount !== '—') {
        items.push({ label: 'Verified discount', value: pricing.discount })
      }
      if (pricing.estValue && pricing.estValue !== 'Pricing not verified yet') {
        items.push({ label: 'Estimated value', value: pricing.estValue })
      }
      if (pricing.purchase && pricing.purchase !== 'Pricing not verified yet') {
        items.push({ label: 'Property price signal', value: pricing.purchase })
      }
    }

    if (deal?.city) items.push({ label: 'City', value: deal.city })

    const propertyType = deal?.property_type?.trim()
    if (propertyType) items.push({ label: 'Property type', value: propertyType })

    const source = note?.source || extractSourceFromDescription(deal?.description)
    if (source) items.push({ label: 'Source', value: source })

    if (note?.source_type) items.push({ label: 'Source type', value: note.source_type })

    if (signalLabel) items.push({ label: 'Signal', value: signalLabel })

    return items
  }

  function buildStructuredSourceSignalItems(deal, parsedNote = null) {
    const items = []
    const note = parsedNote ?? parseDealShortNote(deal)
    const engine = deal?.engine_name

    if (engine) {
      items.push(`Engine: ${ENGINE_SIGNAL_LABELS[engine] || engine}`)
    }
    if (note?.csm_status) items.push(`Enforcement status: ${note.csm_status}`)
    if (note?.notes_excerpt) items.push(`Notes: ${note.notes_excerpt}`)
    if (note?.previous_price != null && note?.current_price != null) {
      items.push(
        `Price change: ${formatCurrency(note.previous_price)} → ${formatCurrency(note.current_price)}`,
      )
    }
    if (note?.days_on_market != null) items.push(`Days on market: ${note.days_on_market}`)
    if (note?.as_of_date) items.push(`Data as of: ${note.as_of_date}`)
    if (note?.source) items.push(`Source: ${note.source}`)
    if (note?.source_type) items.push(`Source type: ${note.source_type}`)
    if (note?.tax_year) items.push(`Tax year: ${note.tax_year}`)

    return items
  }

  function getDealAddressLine(deal, showLocationData) {
    if (!showLocationData) return null
    return deal?.full_address || deal?.address || null
  }

  function getDealIntelSummary(deal, view, parsedNote = null) {
    if (!view?.showLocationData) {
      return view?.note || null
    }
    return buildDealSummaryText(deal, parsedNote) || view?.note || null
  }

  function getDealSignalDetailItems(deal, view, parsedNote = null) {
    return buildStructuredSourceSignalItems(deal, parsedNote)
  }

  function toPositiveNumber(value) {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }

  function getRepricingSpread(parsedNote) {
    if (!parsedNote) return null
    const prev = toPositiveNumber(parsedNote.previous_price)
    const curr = toPositiveNumber(parsedNote.current_price)
    if (prev > 1 && curr > 1 && curr < prev) {
      return {
        estimatedValue: prev,
        purchasePrice: curr,
        discountPct: Math.round(((prev - curr) / prev) * 100),
      }
    }
    return null
  }

  function isPricedOpportunity(deal, parsedNote = null) {
    const note = parsedNote ?? parseDealShortNote(deal)
    if (getRepricingSpread(note)) return true

    const ev = toPositiveNumber(getDealEstimatedValue(deal))
    const pp = toPositiveNumber(getDealPurchasePrice(deal))
    return ev > 1 && pp > 1 && pp < ev
  }

  function hasLeadContext(deal, parsedNote = null) {
    const note = parsedNote ?? parseDealShortNote(deal)
    return Boolean(
      getDealSignalLabel(deal) ||
        deal?.engine_name ||
        deal?.city ||
        deal?.full_address ||
        deal?.address ||
        note?.source ||
        note?.source_type,
    )
  }

  function isUnpricedLead(deal, parsedNote = null) {
    if (isPricedOpportunity(deal, parsedNote)) return false

    const note = parsedNote ?? parseDealShortNote(deal)
    const ev = toPositiveNumber(getDealEstimatedValue(deal))
    const pp = toPositiveNumber(getDealPurchasePrice(deal))

    const placeholderPrice =
      (ev !== null && ev <= 1) || (pp !== null && pp <= 1)
    const equalNoSpread = ev > 1 && pp > 1 && pp >= ev

    return (placeholderPrice || equalNoSpread) && hasLeadContext(deal, note)
  }

  function getVerifiedDiscountDisplay(deal, parsedNote = null) {
    const note = parsedNote ?? parseDealShortNote(deal)
    const repricing = getRepricingSpread(note)
    if (repricing) return `${repricing.discountPct}%`

    const ev = toPositiveNumber(getDealEstimatedValue(deal))
    const pp = toPositiveNumber(getDealPurchasePrice(deal))
    if (ev > 1 && pp > 1 && pp < ev) {
      return `${Math.round(((ev - pp) / ev) * 100)}%`
    }
    return '—'
  }

  function getVerifiedFinancialDisplay(deal, parsedNote = null) {
    const note = parsedNote ?? parseDealShortNote(deal)
    const repricing = getRepricingSpread(note)
    if (repricing) {
      return {
        priced: true,
        estValue: formatCurrency(repricing.estimatedValue),
        purchase: formatCurrency(repricing.purchasePrice),
        discount: `${repricing.discountPct}%`,
      }
    }
    if (!isPricedOpportunity(deal, note)) {
      return {
        priced: false,
        estValue: 'Pricing not verified yet',
        purchase: 'Pricing not verified yet',
        discount: '—',
      }
    }
    const ev = toPositiveNumber(getDealEstimatedValue(deal))
    const pp = toPositiveNumber(getDealPurchasePrice(deal))
    return {
      priced: true,
      estValue: formatCurrency(ev),
      purchase: formatCurrency(pp),
      discount: getVerifiedDiscountDisplay(deal, note),
    }
  }

  function getDealProductLabel(deal, parsedNote = null) {
    if (isPricedOpportunity(deal, parsedNote)) {
      if (deal?.status === 'sniper_deal') return 'SNIPER DEAL'
      if (deal?.status === 'opportunity') return 'OPPORTUNITY'
      return 'PRICED LEAD'
    }
    if (isUnpricedLead(deal, parsedNote)) {
      const signal = getDealSignalLabel(deal)
      if (signal === 'Distress' || signal === 'Pre-foreclosure') {
        return 'UNPRICED LEAD'
      }
      return 'LEAD'
    }
    return 'PARTIAL LEAD'
  }

  function getDealProductBadgeClass(deal, parsedNote = null) {
    if (isPricedOpportunity(deal, parsedNote)) {
      if (deal?.status === 'sniper_deal') return 'badge-sniper-deal'
      if (deal?.status === 'opportunity') return 'badge-opportunity'
      return 'badge-watchlist'
    }
    if (isUnpricedLead(deal, parsedNote)) return 'badge-unpriced-lead'
    return 'badge-watchlist'
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
    if (userMode === 'founder') return 'FOUNDERS ACCESS'
    if (subscriberUnlocked) return 'SUBSCRIBER ACCESS'
    return 'FREE ACCESS'
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

  async function refreshFounderCodesStatus() {
    const status = await getFounderCodesStatus()

    if (status.error) {
      setRemainingFounderSpots(REMAINING_FOUNDER_SPOTS)
      setTotalFounderSpots(TOTAL_FOUNDER_SPOTS)
      setFoundersCohortFull(false)
      return
    }

    setRemainingFounderSpots(status.remaining)
    setTotalFounderSpots(status.total)
    setFoundersCohortFull(status.foundersFull)
  }

  function applyFounderSessionRefreshFailure(message) {
    const metadata = currentUser?.user_metadata ?? {}
    setUserMode(metadata.subscription_active === true ? 'subscriber' : 'registered')
    setFounderError(message || FOUNDER_SESSION_REFRESH_FAILED_MESSAGE)
    openFounderGate()
  }

  // Auth metadata may lag briefly after RPC — refresh session before reading founder flags.
  async function applyFounderSessionAfterAtomicActivate(successMessage) {
    founderSessionSyncRef.current = true

    let snapshot

    try {
      snapshot = await refreshFounderSessionState({
        isAdmin,
        remainingFounderSpots,
        foundersCohortFull,
        requireFounderAccess: true,
      })
    } finally {
      founderSessionSyncRef.current = false
    }

    window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
    window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)

    if (!snapshot.success || !snapshot.user) {
      if (snapshot.user) setCurrentUser(snapshot.user)
      applyFounderSessionRefreshFailure(snapshot.message)
      return false
    }

    setCurrentUser(snapshot.user)

    setUserMode('founder')
    setFounderError('')
    setFounderCodeInput('')
    setShowAuthModal(false)
    setShowFounderGate(false)
    setUnlockFeedbackMessage(
      successMessage || 'Founder access activated successfully.',
    )
    await refreshFounderCodesStatus()
    return true
  }

  // Official founder activation: redeemAndActivateFounderCode (RPC) + refreshFounderSessionState.
  async function redeemAndActivateFounderForUser(code, userId) {
    const result = await redeemAndActivateFounderCode({ code, userId })

    if (!result.success) {
      window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
      window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)
      setFounderError(result.message || 'Unable to activate founder access.')
      openFounderGate()
      return false
    }

    return applyFounderSessionAfterAtomicActivate(result.message)
  }

  async function activateSubscriberForCurrentUser() {
    if (!currentUser) return

    const metadata = currentUser.user_metadata || {}

    if (metadata.access_role === 'subscriber' || metadata.access_role === 'founder' || metadata.access_role === 'owner') {
      return
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        access_role: 'subscriber',
        subscriber_started_at: metadata.subscriber_started_at || new Date().toISOString(),
      },
    })

    if (!error && data?.user) {
      setCurrentUser(data.user)
    }
  }

  async function invokeAdminAccess(action, userId = null) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No active session found.')
    }

    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-access`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        user_id: userId,
      }),
    })

    const rawText = await response.text()
    let data = {}

    try {
      data = rawText ? JSON.parse(rawText) : {}
    } catch {
      data = { error: rawText || 'Non-JSON response from admin function.' }
    }

    if (!response.ok) {
      throw new Error(
        data?.error || `Admin function failed with status ${response.status}.`,
      )
    }

    return data
  }

  async function loadAdminRequests() {
    setAdminLoading(true)
    setAdminError('')
    setAdminSuccess('')

    try {
      const data = await invokeAdminAccess('list_requests')
      setAdminUsers(data?.users || [])
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Unable to load admin panel.')
      setAdminUsers([])
    } finally {
      setAdminLoading(false)
    }
  }

  async function handleAdminAction(action, userId, successMessage) {
    const key = `${action}-${userId}`
    setAdminActionLoading(key)
    setAdminError('')
    setAdminSuccess('')

    try {
      await invokeAdminAccess(action, userId)
      setAdminSuccess(successMessage)
      await loadAdminRequests()
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : 'Admin action failed.')
    } finally {
      setAdminActionLoading('')
    }
  }

  async function handleOpenAdminPanel() {
    if (!isAdmin) return

    const nextValue = !showAdminPanel
    setShowAdminPanel(nextValue)

    if (nextValue) {
      await loadAdminRequests()
    }
  }

  function openFounderGate() {
    if (foundersCohortFull) return

    setFounderCodeInput('')
    setFounderError('')
    setShowFounderGate(true)
  }

  function handleFounderAccessRequest() {
    if (canEnterFounderMode) {
      setUserMode('founder')
      return
    }

    if (foundersCohortFull) return

    openFounderGate()
  }

  async function handleSubscriberAccessRequest() {
    if (currentUser) {
      await activateSubscriberForCurrentUser()
      return
    }

    setAuthContext('subscriber')
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  function handleOwnerAccessRequest() {
    if (currentUser) {
      if (currentUser.user_metadata?.access_role === 'owner') {
        scrollToSection('owner-dashboard')
        return
      }

      setPlatformInfoAccessNotice(
        'Owner Portal uses a separate owner workspace. Please sign up as a property owner to continue.',
      )
      setShowPlatformInfo(true)
      return
    }

    setAuthContext('owner')
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  async function handleFounderCodeSubmit() {
    if (foundersCohortFull) return

    const normalizedCode = founderCodeInput.trim().toUpperCase()

    if (!normalizedCode) {
      setFounderError('Please enter a valid founder code.')
      return
    }

    if (currentUser) {
      await redeemAndActivateFounderForUser(normalizedCode, currentUser.id)
      return
    }

    window.sessionStorage.setItem(FOUNDER_PENDING_KEY, 'pending')
    window.sessionStorage.setItem(FOUNDER_PENDING_CODE_KEY, normalizedCode)
    setShowFounderGate(false)
    setFounderCodeInput('')
    setFounderError('')
    setAuthContext('founder')
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  function handleFounderGateClose() {
    setShowFounderGate(false)
    setFounderCodeInput('')
    setFounderError('')
  }

  function handleAuthModalClose() {
    setShowAuthModal(false)
  }

  function clearPasswordResetState() {
    setNewPassword('')
    setConfirmNewPassword('')
    setShowResetPassword(false)
    setPasswordResetSubmitting(false)
    setPasswordResetError('')
    setPasswordResetInfo('')
  }

  function closePasswordResetFlow() {
    setShowPasswordResetFlow(false)
    clearPasswordResetState()
    const cleanUrl = `${window.location.origin}${window.location.pathname}`
    window.history.replaceState({}, '', cleanUrl)
  }

  async function handlePasswordResetSubmit() {
    setPasswordResetError('')
    setPasswordResetInfo('')

    if (!newPassword.trim()) {
      setPasswordResetError('Please enter your new password.')
      return
    }
    if (!confirmNewPassword.trim()) {
      setPasswordResetError('Please confirm your new password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordResetError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordResetError('Passwords do not match.')
      return
    }

    setPasswordResetSubmitting(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordResetError(error.message)
        setPasswordResetSubmitting(false)
        return
      }

      setPasswordResetInfo('Password updated successfully. You can continue using your account.')
      setPasswordResetSubmitting(false)
      setTimeout(() => {
        closePasswordResetFlow()
      }, 1200)
    } catch (_error) {
      setPasswordResetError('Unexpected error while updating password. Please try again.')
      setPasswordResetSubmitting(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setSelectedDeal(null)
    setSelectedCategory(null)
    setSubscriberUnlocked(false)
    setPremiumUnlocked(false)
    setDiamondUnlocked(false)
    setPurchasedDealAccess({})
    setShowAdminPanel(false)
    setAdminUsers([])
    setAdminError('')
    setAdminSuccess('')
    setUserMode('visitor')
  }

  function pushDealDetailHistory(dealId) {
    if (dealDetailHistoryActiveRef.current) {
      window.history.replaceState({ rsDealDetail: dealId }, '')
      return
    }

    window.history.pushState({ rsDealDetail: dealId }, '')
    dealDetailHistoryActiveRef.current = true
  }

  function pushCategoryHistory(category) {
    if (categoryHistoryActiveRef.current) {
      window.history.replaceState({ rsDealCategory: category }, '')
      return
    }

    window.history.pushState({ rsDealCategory: category }, '')
    categoryHistoryActiveRef.current = true
  }

  function openDealDetail(deal) {
    if (!deal) return

    if (isAdmin) {
      if (selectedDeal?.id === deal.id) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      setSelectedDeal(deal)
      pushDealDetailHistory(deal.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!currentUser || userMode === 'visitor') {
      setPlatformInfoAccessNotice(null)
      setShowPlatformInfo(true)
      return
    }

    const canOpen =
      subscriberUnlocked ||
      founderUnlocked ||
      userHasPurchasedDeal(deal, 'premium') ||
      userHasPurchasedDeal(deal, 'diamond')

    if (!canOpen) {
      setPlatformInfoAccessNotice(
        'Subscribe first to access full standard deal intelligence.',
      )
      setShowPlatformInfo(true)
      return
    }

    if (selectedDeal?.id === deal.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSelectedDeal(deal)
    pushDealDetailHistory(deal.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeDealDetail() {
    setSelectedDeal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (dealDetailHistoryActiveRef.current) {
      dealDetailHistoryActiveRef.current = false
      skipDealDetailPopStateRef.current = true
      window.history.back()
    }
  }

  function openCategory(category) {
    if (!category) return

    if (!currentUser || userMode === 'visitor') {
      setPlatformInfoAccessNotice(null)
      setShowPlatformInfo(true)
      return
    }

    if (
      userMode === 'registered' &&
      !subscriberUnlocked &&
      !founderUnlocked &&
      !isAdmin
    ) {
      setPlatformInfoAccessNotice(
        'Subscribe first to access full standard deal intelligence.',
      )
      setShowPlatformInfo(true)
      return
    }

    if (selectedCategory === category) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSelectedCategory(category)
    setSelectedDeal(null)
    pushCategoryHistory(category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeCategory() {
    setSelectedCategory(null)
    setSelectedDeal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (categoryHistoryActiveRef.current) {
      categoryHistoryActiveRef.current = false
      skipCategoryPopStateRef.current = true
      window.history.back()
    }
  }

  function renderDealForTier(deal, allDeals) {
  const tier = getDealTier(deal)
  const isDiamond = tier === 'diamond'
  const isPremium = tier === 'premium'
  const isStandard = tier === 'standard'
    const score = deal.score || 0
    const hasDiamondAccess = diamondUnlocked || userHasPurchasedDeal(deal, 'diamond')
    const hasPremiumAccess =
      premiumUnlocked ||
      hasDiamondAccess ||
      userHasPurchasedDeal(deal, 'premium')

    if (isDiamond && hasDiamondAccess) {
      return {
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
        note: 'Diamond access unlocked. Owner-verified and off-market execution layer visible.',
        ownerLayer: true,
        footerType: 'diamond-unlocked',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
        accessPriceLabel: `Launch Access Price: ${formatCurrency(DIAMOND_LAUNCH_PRICE)}`,
      }
    }

    if (isPremium && hasPremiumAccess) {
      return {
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
          estValue: formatCurrency(getDealEstimatedValue(deal)),
          purchase: formatCurrency(getDealPurchasePrice(deal)),
          discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
        note: 'Premium preview only. Full intelligence remains locked until purchase.',
        ownerLayer: false,
        footerType: 'premium',
        visibilityLabel: 'Preview',
        propertyType: 'Locked',
        showLocationData: false,
        accessPriceLabel: `Access Price: ${formatCurrency(PREMIUM_ACCESS_PRICE)}`,
      }
    }

    if (subscriberUnlocked && !founderUnlocked) {
      return {
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
        note: deal.description,
        ownerLayer: false,
        footerType:
          score >= 80 ? 'founder-red-full' : score >= 60 ? 'founder-green-full' : 'founder-yellow',
        visibilityLabel: '100%',
        propertyType: deal.property_type,
        showLocationData: true,
        accessPriceLabel: '',
      }
    }

    const founderVisibility = getFounderVisibilityLevel(deal, allDeals)
    const hasFullAccess = founderVisibility === '100%'
    const hasHalfAccess = founderVisibility === '50%'
    const hasQuarterAccess = founderVisibility === '25%'

    if (score < 60) {
      return {
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
        estValue: formatCurrency(getDealEstimatedValue(deal)),
        purchase: formatCurrency(getDealPurchasePrice(deal)),
        discount: getDealDiscount(deal),
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
      estValue: formatCurrency(getDealEstimatedValue(deal)),
      purchase: formatCurrency(getDealPurchasePrice(deal)),
      discount: getDealDiscount(deal),
      note: 'Preview restricted.',
      ownerLayer: false,
      footerType: 'fallback',
      visibilityLabel: 'Preview',
      propertyType: 'Locked',
      showLocationData: false,
      accessPriceLabel: '',
    }
  }

  function handleSummaryCardAction(type, previewDeal) {
    if (userMode === 'visitor') {
      setPlatformInfoAccessNotice(null)
      setShowPlatformInfo(true)
      return
    }

    openCategory(type)
  }

  function renderSummaryCard(title, description, blockDeals, accentColor, type) {
    const previewDeal = blockDeals[0]

    let actionLabel = 'View More'

    if (type === 'premium') {
      actionLabel = 'View Premium Deals'
    }

    if (type === 'diamond') {
      actionLabel = 'View Diamond Deals'
    }

    if (type === 'unpriced') {
      actionLabel = 'View Unpriced Leads'
    }

    if (userMode === 'visitor' && (type === 'yellow' || type === 'green' || type === 'red')) {
      actionLabel = 'View Detail'
    }

    if (previewDeal && userMode !== 'visitor' && (type === 'yellow' || type === 'green' || type === 'red')) {
      actionLabel = 'View Detail'
    }

    return (
      <div
        style={{
          padding: '20px',
          borderRadius: '22px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: '#ffffff',
              fontSize: '1.15rem',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>

          <div
            style={{
              color: accentColor,
              fontWeight: 800,
              fontSize: '0.92rem',
              whiteSpace: 'nowrap',
            }}
          >
            {blockDeals.length}
          </div>
        </div>

        <p
          style={{
            margin: '0 0 14px',
            color: '#94a3b8',
            lineHeight: 1.55,
            fontSize: '0.9rem',
            minHeight: '68px',
          }}
        >
          {description}
        </p>

        <div
          onClick={() => openCategory(type)}
          style={{
            padding: '14px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '14px',
            minHeight: '126px',
            cursor: blockDeals.length > 0 ? 'pointer' : 'default',
          }}
        >
          {previewDeal ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginBottom: '8px',
                }}
              >
                {(() => {
                  const previewNote = parseDealShortNote(previewDeal)
                  const previewBadge = getDealProductBadgeClass(previewDeal, previewNote)
                  return (
                    <span
                      className={`deal-badge ${previewBadge}`}
                      style={{
                        alignSelf: 'flex-start',
                        ...(previewBadge === 'badge-unpriced-lead'
                          ? {
                              background: 'rgba(251, 146, 60, 0.18)',
                              color: '#fed7aa',
                            }
                          : {}),
                      }}
                    >
                      {getDealProductLabel(previewDeal, previewNote)}
                    </span>
                  )
                })()}

                <div
                  style={{
                    color:
                      (previewDeal.score || 0) >= 80
                        ? '#ef4444'
                        : (previewDeal.score || 0) >= 60
                          ? '#22c55e'
                          : '#facc15',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                  }}
                >
                  {previewDeal.score || 0}/100
                </div>
              </div>

              <div
                style={{
                  color: '#ffffff',
                  fontWeight: 700,
                  lineHeight: 1.4,
                  fontSize: '0.95rem',
                  marginBottom: '6px',
                }}
              >
                {previewDeal.city} · {previewDeal.title}
              </div>

              <div
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}
              >
                {(() => {
                  const previewNote = parseDealShortNote(previewDeal)
                  const previewPricing = getVerifiedFinancialDisplay(previewDeal, previewNote)
                  return previewPricing.priced
                    ? `${previewPricing.purchase} · ${previewPricing.discount} discount`
                    : 'Pricing not verified yet'
                })()}
              </div>
            </>
          ) : (
            <div
              style={{
                color: '#64748b',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              No deals visible in this block yet.
            </div>
          )}
        </div>

        {type === 'premium' ? (
          <>
            <div style={{ marginTop: '10px', color: '#f3f4f6', fontSize: '0.9rem' }}>
              {`Limited access: ${getPremiumSlotsTaken(previewDeal)} / ${PREMIUM_MAX_SLOTS} sold`}
            </div>
            {getPremiumSlotsRemaining(previewDeal) > 0 && (
              <div
                style={
                  getPremiumSlotsRemaining(previewDeal) <= 3
                    ? {
                        color: '#ef4444',
                        marginTop: '6px',
                        fontWeight: 800,
                      }
                    : { color: '#facc15', marginTop: '6px', fontWeight: 600 }
                }
              >
                {getPremiumSlotsRemaining(previewDeal) <= 3
                  ? `🚨 LAST ${getPremiumSlotsRemaining(previewDeal)} SLOTS — HIGH DEMAND`
                  : `⚡ Only ${getPremiumSlotsRemaining(previewDeal)} spots remaining`}
              </div>
            )}
          </>
        ) : null}

        {type === 'diamond' ? (
          <>
            <div style={{ marginTop: '10px', color: '#f3f4f6', fontSize: '0.9rem' }}>
              {`Limited owner access: ${getDiamondSlotsTaken(previewDeal)} / ${getDiamondMaxSlots(previewDeal)} slots taken`}
            </div>

            {getDiamondSlotsRemaining(previewDeal) > 0 && (
              <div
                style={
                  getDiamondSlotsRemaining(previewDeal) <= 3
                    ? {
                        color: '#ef4444',
                        marginTop: '6px',
                        fontWeight: 800,
                      }
                    : { color: '#facc15', marginTop: '6px', fontWeight: 600 }
                }
              >
                {getDiamondSlotsRemaining(previewDeal) <= 3
                  ? `🚨 LAST ${getDiamondSlotsRemaining(previewDeal)} INVESTORS — HIGH DEMAND`
                  : `🔥 Only ${getDiamondSlotsRemaining(previewDeal)} investors can still access`}
              </div>
            )}
          </>
        ) : null}

        <button
          onClick={() => {
            handleSummaryCardAction(type, previewDeal)
          }}
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '12px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#ffffff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      </div>
    )
  }

  function renderCategoryPage() {
    if (!selectedCategory) return null

    let dealsToShow = []
    let categoryTitle = 'Deals'
    let categoryDescription = 'Explore the opportunities available in this category.'
    let accentColor = '#ffffff'

    if (selectedCategory === 'yellow') {
      dealsToShow = yellowDeals
      categoryTitle = '🟡 Watchlist Deals'
      categoryDescription =
        subscriberUnlocked && !founderUnlocked
          ? 'Lower-priority discoveries and weaker signals. Full detail included with your subscription.'
          : 'Lower-priority discoveries and weaker signals. Founder access can review all yellow opportunities.'
      accentColor = '#facc15'
    }

    if (selectedCategory === 'green') {
      dealsToShow = greenDeals
      categoryTitle = '🟢 Opportunity Deals'
      categoryDescription =
        subscriberUnlocked && !founderUnlocked
          ? 'Qualified opportunities with full detail included with your subscription.'
          : 'Qualified opportunities. Founder access sees the lower-score 50% with full detail and the rest as restricted previews.'
      accentColor = '#22c55e'
    }

    if (selectedCategory === 'red') {
      dealsToShow = redDeals
      categoryTitle = '🔴 Sniper Deals'
      categoryDescription =
        subscriberUnlocked && !founderUnlocked
          ? 'Highest-priority standard-access opportunities with full detail included with your subscription.'
          : 'Highest-priority standard-access opportunities. Founder access sees the lower-score 25% with full detail and the rest as restricted previews.'
      accentColor = '#ef4444'
    }

    if (selectedCategory === 'premium') {
      dealsToShow = premiumDeals
      categoryTitle = '🔵 Premium Deals'
      categoryDescription = 'Premium opportunities. General information is visible here; full intelligence unlocks after Premium approval or purchase.'
      accentColor = '#60a5fa'
    }

    if (selectedCategory === 'diamond') {
      dealsToShow = diamondDeals
      categoryTitle = '💎 Diamond Deals'
      categoryDescription = 'Diamond opportunities. General information is visible here; full intelligence unlocks after Diamond approval or purchase.'
      accentColor = '#facc15'
    }

    if (selectedCategory === 'unpriced') {
      dealsToShow = unpricedLeads
      categoryTitle = '🟠 Unpriced Leads'
      categoryDescription = 'Early distress and enforcement signals without verified pricing. Review the signal and source before treating this as a priced opportunity.'
      accentColor = '#fb923c'
    }

    const categoryCountLabel =
      selectedCategory === 'unpriced'
        ? `${dealsToShow.length} unpriced leads`
        : selectedCategory === 'red' ||
            selectedCategory === 'green' ||
            selectedCategory === 'yellow'
          ? `${dealsToShow.length} priced opportunities`
          : `${dealsToShow.length} deals`

    return (
      <main className="main-content">
        <section className="section-block" style={{ paddingTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '22px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={closeCategory}
              className="secondary-button"
            >
              ← Back to Home
            </button>

            <div
              style={{
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: accentColor,
                fontWeight: 800,
              }}
            >
              {categoryCountLabel}
            </div>
          </div>

          <div className="section-heading">
            <div>
              <div className="eyebrow">Deal Category</div>
              <h2 style={{ color: '#ffffff' }}>{categoryTitle}</h2>
            </div>
            <p>{categoryDescription}</p>
          </div>

          {dealsToShow.length === 0 ? (
            <div
              style={{
                padding: '22px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#94a3b8',
              }}
            >
              No deals visible in this category yet.
            </div>
          ) : null}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '16px',
            }}
          >
            {dealsToShow.map((deal) => {
              const view = renderDealForTier(deal, filteredDeals)
              const parsedNote = parseDealShortNote(deal)
              const pricing = getVerifiedFinancialDisplay(deal, parsedNote)
              const productBadge = getDealProductBadgeClass(deal, parsedNote)
              const intelSummary = getDealIntelSummary(deal, view, parsedNote)
              const signalLabel = getDealSignalLabel(deal)
              const classificationLabel = getDealClassificationDisplay(deal)
              const candidateChips =
                userMode !== 'visitor' ? getDealCandidateChips(deal) : []
              const tier = getDealTier(deal)
              const isPremium = tier === 'premium'
              const isDiamond = tier === 'diamond'
              const purchasedPremium = userHasPurchasedDeal(deal, 'premium')
              const purchasedDiamond = userHasPurchasedDeal(deal, 'diamond')
              const isLockedPremium = isPremium && !premiumUnlocked && !purchasedPremium
              const isLockedDiamond = isDiamond && !diamondUnlocked && !purchasedDiamond
              const premiumSoldOut = isPremiumSoldOut(deal)
              const diamondSoldOut = isDiamondSoldOut(deal)

              let actionLabel = 'View Deal Detail'

              if (purchasedDiamond) {
                actionLabel = 'Diamond Access Active'
              } else if (purchasedPremium) {
                actionLabel = 'Premium Access Active'
              } else if (isLockedPremium) {
                actionLabel = premiumSoldOut ? 'Premium Sold Out' : 'Unlock Premium Access — $4,500'
              } else if (isLockedDiamond) {
                actionLabel = diamondSoldOut ? 'Diamond Sold Out' : 'Unlock Diamond Access — $7,500'
              }

              return (
                <div
                  key={deal.id}
                  style={{
                    padding: '18px',
                    borderRadius: '20px',
                    background: isDiamond
                      ? 'linear-gradient(180deg, rgba(25, 5, 5, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)'
                      : isPremium
                        ? 'linear-gradient(180deg, rgba(22, 14, 10, 0.92) 0%, rgba(12, 12, 14, 0.96) 100%)'
                        : 'rgba(255,255,255,0.03)',
                    border: isDiamond
                      ? '1px solid rgba(239, 68, 68, 0.56)'
                      : isPremium
                        ? '1px solid rgba(249, 115, 22, 0.28)'
                        : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isDiamond
                      ? '0 20px 50px rgba(239, 68, 68, 0.24)'
                      : isPremium
                        ? '0 12px 30px rgba(249, 115, 22, 0.12)'
                        : '0 18px 40px rgba(0,0,0,0.16)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100%',
                    transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = isDiamond
                      ? '0 24px 56px rgba(239, 68, 68, 0.34)'
                      : isPremium
                        ? '0 16px 36px rgba(249, 115, 22, 0.18)'
                        : '0 22px 46px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = isDiamond
                      ? '0 20px 50px rgba(239, 68, 68, 0.24)'
                      : isPremium
                        ? '0 12px 30px rgba(249, 115, 22, 0.12)'
                        : '0 18px 40px rgba(0,0,0,0.16)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      className={`deal-badge ${productBadge}`}
                      style={
                        productBadge === 'badge-unpriced-lead'
                          ? {
                              background: 'rgba(251, 146, 60, 0.18)',
                              color: '#fed7aa',
                            }
                          : undefined
                      }
                    >
                      {getDealProductLabel(deal, parsedNote)}
                    </span>

                    <div
                      style={{
                        color: getDealScore(deal) >= 80 ? '#ef4444' : getDealScore(deal) >= 60 ? '#22c55e' : '#facc15',
                        fontWeight: 900,
                      }}
                    >
                      {getDealScore(deal)}/100
                    </div>
                  </div>

                  {(isPremium || isDiamond) ? (
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        marginBottom: '10px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        color: isDiamond ? '#fecaca' : '#fdba74',
                        background: isDiamond
                          ? 'rgba(239, 68, 68, 0.16)'
                          : 'rgba(249, 115, 22, 0.14)',
                        border: isDiamond
                          ? '1px solid rgba(239, 68, 68, 0.34)'
                          : '1px solid rgba(249, 115, 22, 0.24)',
                      }}
                    >
                      {isDiamond ? 'DIAMOND' : 'PREMIUM'}
                    </div>
                  ) : null}

                  {signalLabel || classificationLabel || candidateChips.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '10px',
                      }}
                    >
                      {signalLabel ? (
                        <span
                          style={{
                            padding: '5px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#e2e8f0',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          {signalLabel}
                        </span>
                      ) : null}
                      {classificationLabel ? (
                        <span
                          style={{
                            padding: '5px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          {classificationLabel}
                        </span>
                      ) : null}
                      {candidateChips.map((chip) => (
                        <span
                          key={chip}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#cbd5e1',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px dashed rgba(255,255,255,0.14)',
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 800,
                      lineHeight: 1.4,
                      fontSize: '1rem',
                      marginBottom: '8px',
                    }}
                  >
                    {getDealCity(deal)} · {getDealTitle(deal)}
                  </div>

                  {view.showLocationData && deal.property_type ? (
                    <div
                      style={{
                        marginBottom: '8px',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                      }}
                    >
                      {deal.property_type}
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '10px',
                      marginTop: '8px',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.16)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {pricing.priced ? 'Purchase' : 'Pricing status'}
                      </div>
                      <div style={{ color: '#ffffff', fontWeight: 800, marginTop: '6px' }}>
                        {pricing.purchase}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.16)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        {pricing.priced ? 'Discount' : 'Verified discount'}
                      </div>
                      <div style={{ color: '#ffffff', fontWeight: 800, marginTop: '6px' }}>
                        {pricing.discount}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '12px',
                      color: '#94a3b8',
                      lineHeight: 1.6,
                      fontSize: '0.9rem',
                    }}
                  >
                    Visibility: {view.visibilityLabel} · {view.showLocationData ? 'Location layer available' : 'Location layer restricted'}
                  </div>

                  <div
                    style={{
                      marginTop: '12px',
                      color: '#cbd5e1',
                      lineHeight: 1.6,
                      fontSize: '0.9rem',
                    }}
                  >
                    {intelSummary || 'General deal preview available.'}
                  </div>

                  {isLockedPremium ? (
                    <>
                      <div
                        style={{
                          marginTop: '10px',
                          color: '#f3f4f6',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {`Limited access: ${getPremiumSlotsTaken(deal)} / ${PREMIUM_MAX_SLOTS} sold`}
                      </div>
                      {getPremiumSlotsRemaining(deal) > 0 && (
                        <div
                          style={
                            getPremiumSlotsRemaining(deal) <= 3
                              ? {
                                  color: '#ef4444',
                                  marginTop: '6px',
                                  fontWeight: 800,
                                }
                              : { color: '#facc15', marginTop: '6px', fontWeight: 600 }
                          }
                        >
                          {getPremiumSlotsRemaining(deal) <= 3
                            ? `🚨 LAST ${getPremiumSlotsRemaining(deal)} SLOTS — HIGH DEMAND`
                            : `⚡ Only ${getPremiumSlotsRemaining(deal)} spots remaining`}
                        </div>
                      )}
                    </>
                  ) : null}

                  {isLockedDiamond ? (
                    <div
                      style={{
                        marginTop: '10px',
                        color: '#f3f4f6',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                      }}
                    >
                      <div>
                        {`Limited owner access: ${getDiamondSlotsTaken(deal)} / ${getDiamondMaxSlots(deal)} slots taken`}
                      </div>
                      {getDiamondSlotsRemaining(deal) > 0 && (
                        <div
                          style={
                            getDiamondSlotsRemaining(deal) <= 3
                              ? {
                                  color: '#ef4444',
                                  marginTop: '6px',
                                  fontWeight: 800,
                                }
                              : { color: '#facc15', marginTop: '6px', fontWeight: 600 }
                          }
                        >
                          {getDiamondSlotsRemaining(deal) <= 3
                            ? `🚨 LAST ${getDiamondSlotsRemaining(deal)} INVESTORS — HIGH DEMAND`
                            : `🔥 Only ${getDiamondSlotsRemaining(deal)} investors can still access`}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <button
                    onClick={() => {
                      if (isLockedPremium) {
                        if (premiumSoldOut) return
                        openDealDetail(deal)
                        return
                      }

                      if (isLockedDiamond) {
                        if (diamondSoldOut) return
                        openDealDetail(deal)
                        return
                      }

                      openDealDetail(deal)
                    }}
                    className="secondary-button"
                    style={{ marginTop: 'auto', width: '100%' }}
                  >
                    {actionLabel}
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderDetailPage() {
    if (!selectedDeal) return null

    const tier = getDealTier(selectedDeal)
    const checkingDealAccess =
      Boolean(currentUser) &&
      !purchasesLoaded &&
      !isAdmin &&
      (tier === 'premium' || tier === 'diamond')

    const detailView = renderDealForTier(selectedDeal, filteredDeals)
    const parsedNote = parseDealShortNote(selectedDeal)
    const pricing = getVerifiedFinancialDisplay(selectedDeal, parsedNote)
    const productBadge = getDealProductBadgeClass(selectedDeal, parsedNote)
    const intelSummary = getDealIntelSummary(selectedDeal, detailView, parsedNote)
    const signalLabel = getDealSignalLabel(selectedDeal)
    const dealFactsItems = buildDealFactsItems(
      selectedDeal,
      parsedNote,
      pricing,
      signalLabel,
    )
    const signalItems = getDealSignalDetailItems(selectedDeal, detailView, parsedNote)
    const addressLine = getDealAddressLine(selectedDeal, detailView.showLocationData)
    const classificationLabel = getDealClassificationDisplay(selectedDeal)
    const candidateChips =
      userMode !== 'visitor' ? getDealCandidateChips(selectedDeal) : []
    const score = selectedDeal.score || 0
    const selectedDealDiamondUnlocked =
      diamondUnlocked || userHasPurchasedDeal(selectedDeal, 'diamond')
    const selectedDealPremiumUnlocked =
      premiumUnlocked ||
      selectedDealDiamondUnlocked ||
      userHasPurchasedDeal(selectedDeal, 'premium')

    const scoreColor =
      score >= 80 ? '#ef4444' : score >= 60 ? '#22c55e' : '#facc15'

    const scoreBand = !pricing.priced
      ? 'Signal detected — pricing not verified'
      : score >= 80
        ? 'Internal ranking score'
        : score >= 60
          ? 'Qualified opportunity signal'
          : 'Watchlist opportunity'

    return (
      <main className="main-content">
        <section className="section-block" style={{ paddingTop: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={closeDealDetail}
              className="secondary-button"
            >
              {selectedCategory ? '← Back to Results' : '← Back to Home'}
            </button>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                className={`deal-badge ${productBadge}`}
                style={
                  productBadge === 'badge-unpriced-lead'
                    ? {
                        background: 'rgba(251, 146, 60, 0.18)',
                        color: '#fed7aa',
                      }
                    : undefined
                }
              >
                {getDealProductLabel(selectedDeal, parsedNote)}
              </span>

              <span className={`access-tier-badge ${getAccessTierClass(selectedDeal.access_tier)}`}>
                {getAccessTierLabel(selectedDeal.access_tier)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '20px',
            }}
          >
            <div
              style={{
                padding: '24px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
              }}
            >
              {checkingDealAccess ? (
                <div style={{ color: '#cbd5e1', marginBottom: '20px' }}>
                  Checking access...
                </div>
              ) : null}

              {getDealTier(selectedDeal) === 'diamond' &&
              !selectedDealDiamondUnlocked &&
              !checkingDealAccess ? (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(239, 68, 68, 0.42)',
                    background:
                      'linear-gradient(180deg, rgba(30, 8, 8, 0.96) 0%, rgba(14, 10, 12, 0.98) 100%)',
                    boxShadow: '0 18px 44px rgba(239, 68, 68, 0.18)',
                  }}
                >
                  <div
                    style={{
                      color: '#ff6b6b',
                      fontWeight: 900,
                      fontSize: '20px',
                      marginBottom: '6px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    DIAMOND OPPORTUNITY
                  </div>

                  <div style={{ color: '#ffffff', lineHeight: 1.85 }}>
                    <div>✔ Owner/contact layer unlocked after Diamond access</div>
                    <div>✔ Off-market seller context</div>
                    <div>✔ Direct execution path for serious investors</div>
                    <div>✔ Limited investor access for this deal</div>
                  </div>

                  <div style={{ color: '#e5e7eb', marginTop: '12px', fontWeight: 700 }}>
                    Limited investor window for this opportunity.
                  </div>

                  <div style={{ color: '#e5e7eb', marginTop: '8px' }}>
                    {`${getDiamondSlotsTaken(selectedDeal)} / ${getDiamondMaxSlots(selectedDeal)} Diamond slots taken`}
                  </div>

                  {getDiamondSlotsRemaining(selectedDeal) > 0 && (
                    <div
                      style={
                        getDiamondSlotsRemaining(selectedDeal) <= 3
                          ? {
                              color: '#ef4444',
                              marginTop: '6px',
                              fontWeight: 900,
                            }
                          : { color: '#fca5a5', marginTop: '6px', fontWeight: 700 }
                      }
                    >
                      {getDiamondSlotsRemaining(selectedDeal) <= 3
                        ? `🚨 LAST ${getDiamondSlotsRemaining(selectedDeal)} INVESTORS — PRIORITY WINDOW`
                        : `🔥 Only ${getDiamondSlotsRemaining(selectedDeal)} investors can still unlock Diamond`}
                    </div>
                  )}

                  {!subscriberUnlocked && !founderUnlocked && !isAdmin ? (
                    <div style={{ marginTop: '12px', color: '#fca5a5', fontWeight: 700 }}>
                      Subscribe first to unlock Premium and Diamond purchases.
                    </div>
                  ) : null}

                  {isDiamondSoldOut(selectedDeal) ? (
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ marginTop: '14px' }}
                      disabled
                    >
                      Diamond Sold Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="secondary-button"
                      style={{
                        marginTop: '14px',
                        background: 'rgba(239, 68, 68, 0.18)',
                        border: '1px solid rgba(239, 68, 68, 0.34)',
                        color: '#ffe4e6',
                        fontWeight: 800,
                      }}
                      onClick={() => {
                        openPurchaseConfirmation('diamond', selectedDeal)
                      }}
                    >
                      Unlock Diamond Access — $7,500
                    </button>
                  )}

                  <div style={{ color: '#cbd5e1', marginTop: '12px', fontSize: '13px', lineHeight: 1.6 }}>
                    By purchasing this Diamond access, you agree to:
                    <br />
                    - Contact the owner respectfully and professionally
                    <br />
                    - Use only the allowed communication channels
                    <br />
                    - Avoid harassment or excessive contact
                    <br />
                    <br />
                    Failure to comply may result in restricted access to future opportunities.
                  </div>

                  <div style={{ color: '#e2e8f0', marginTop: '10px', fontWeight: 600 }}>
                    Full property intelligence, owner layer, and contact path unlock after Diamond access purchase.
                  </div>
                </div>
              ) : null}

              {getDealTier(selectedDeal) === 'premium' &&
              !selectedDealPremiumUnlocked &&
              !checkingDealAccess ? (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(249, 115, 22, 0.32)',
                    background:
                      'linear-gradient(180deg, rgba(24, 16, 10, 0.94) 0%, rgba(12, 12, 14, 0.96) 100%)',
                    boxShadow: '0 14px 36px rgba(249, 115, 22, 0.14)',
                  }}
                >
                  <div
                    style={{
                      color: '#fdba74',
                      fontWeight: 900,
                      fontSize: '20px',
                      marginBottom: '6px',
                      letterSpacing: '0.03em',
                    }}
                  >
                    PREMIUM OPPORTUNITY
                  </div>

                  <div style={{ color: '#f1f5f9', marginBottom: '12px', fontWeight: 600 }}>
                    Full deal intelligence for early investor advantage.
                  </div>

                  <div style={{ color: '#ffffff', lineHeight: 1.85 }}>
                    <div>✔ Full deal intelligence and analysis</div>
                    <div>✔ Location and execution context</div>
                    <div>✔ Faster decision advantage vs public visibility</div>
                    <div>✔ Limited access tier at launch pricing</div>
                  </div>

                  <div style={{ color: '#e5e7eb', marginTop: '12px', fontWeight: 700 }}>
                    {`${getPremiumSlotsTaken(selectedDeal)} / ${PREMIUM_MAX_SLOTS} Premium accesses sold`}
                  </div>

                  {getPremiumSlotsRemaining(selectedDeal) > 0 && (
                    <div
                      style={
                        getPremiumSlotsRemaining(selectedDeal) <= 3
                          ? {
                              color: '#ef4444',
                              marginTop: '6px',
                              fontWeight: 900,
                            }
                          : { color: '#facc15', marginTop: '6px', fontWeight: 700 }
                      }
                    >
                      {getPremiumSlotsRemaining(selectedDeal) <= 3
                        ? `🚨 LAST ${getPremiumSlotsRemaining(selectedDeal)} SLOTS — HIGH URGENCY`
                        : `⚡ Only ${getPremiumSlotsRemaining(selectedDeal)} spots remaining`}
                    </div>
                  )}

                  {!subscriberUnlocked && !founderUnlocked && !isAdmin ? (
                    <div style={{ marginTop: '12px', color: '#fca5a5', fontWeight: 700 }}>
                      Subscribe first to unlock Premium and Diamond purchases.
                    </div>
                  ) : null}

                  {isPremiumSoldOut(selectedDeal) ? (
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ marginTop: '14px' }}
                      disabled
                    >
                      Premium Sold Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="secondary-button"
                      style={{
                        marginTop: '14px',
                        background: 'rgba(249, 115, 22, 0.16)',
                        border: '1px solid rgba(249, 115, 22, 0.28)',
                        color: '#ffedd5',
                        fontWeight: 800,
                      }}
                      onClick={() => {
                        openPurchaseConfirmation('premium', selectedDeal)
                      }}
                    >
                      Unlock Premium Access — $4,500
                    </button>
                  )}

                  <div style={{ color: '#e2e8f0', marginTop: '10px', fontWeight: 600 }}>
                    Full opportunity intelligence is unlocked immediately after Premium access purchase.
                  </div>
                </div>
              ) : null}

              <div className="eyebrow">Deal Detail</div>

              <h1
                style={{
                  margin: '0 0 12px',
                  color: '#ffffff',
                  fontSize: '42px',
                  lineHeight: 1.1,
                  maxWidth: '100%',
                }}
              >
                {selectedDeal.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: '#cbd5e1',
                  fontSize: '18px',
                  lineHeight: 1.8,
                }}
              >
                {detailView.showLocationData
                  ? `${selectedDeal.city || 'Unknown City'} · ${detailView.propertyType || 'Unknown Type'}`
                  : `${selectedDeal.city || 'Unknown City'} · Locked Property Type`}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginTop: '22px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '999px',
                      background: scoreColor,
                    }}
                  />
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>
                    Score: {score}/100
                  </span>
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#e5e7eb',
                    fontWeight: 700,
                  }}
                >
                  Visibility: {detailView.visibilityLabel}
                </div>

                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: scoreColor,
                    fontWeight: 800,
                  }}
                >
                  {scoreBand}
                </div>
              </div>

              {signalLabel || classificationLabel || candidateChips.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: '16px',
                  }}
                >
                  {signalLabel ? (
                    <span
                      style={{
                        padding: '8px 12px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#e2e8f0',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      {signalLabel}
                    </span>
                  ) : null}
                  {classificationLabel ? (
                    <span
                      style={{
                        padding: '8px 12px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#94a3b8',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {classificationLabel}
                    </span>
                  ) : null}
                  {candidateChips.map((chip) => (
                    <span
                      key={chip}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#cbd5e1',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(255,255,255,0.14)',
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}

              <div
                style={{
                  marginTop: '26px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    padding: '18px',
                    borderRadius: '18px',
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                    {pricing.priced ? 'Estimated Value' : 'Pricing status'}
                  </div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {pricing.estValue}
                  </div>
                </div>

                <div
                  style={{
                    padding: '18px',
                    borderRadius: '18px',
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                    {pricing.priced ? 'Property price signal' : 'Verified property pricing'}
                  </div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {pricing.purchase}
                  </div>
                </div>

                <div
                  style={{
                    padding: '18px',
                    borderRadius: '18px',
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                    {pricing.priced ? 'Discount' : 'Verified discount'}
                  </div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {pricing.discount}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '10px',
                  }}
                >
                  {pricing.priced ? 'Deal Summary' : 'Lead Summary'}
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontSize: '0.96rem',
                  }}
                >
                  {intelSummary || 'No detail available.'}
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '12px',
                  }}
                >
                  Deal Facts
                </div>

                {dealFactsItems.length === 0 ? (
                  <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.96rem' }}>
                    No verified deal facts available yet.
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {dealFactsItems.map((fact) => (
                      <div key={fact.label}>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>{fact.label}</div>
                        <div
                          style={{
                            marginTop: '6px',
                            color: '#cbd5e1',
                            lineHeight: 1.6,
                            fontSize: '0.96rem',
                            fontWeight: 600,
                          }}
                        >
                          {fact.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '12px',
                  }}
                >
                  Source Signals
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '12px',
                  }}
                >
                  {signalItems.length === 0 ? (
                    <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                      No structured source signals available yet.
                    </div>
                  ) : (
                    signalItems.map((signal) => (
                      <div
                        key={signal}
                        style={{
                          padding: '14px',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.06)',
                          background: 'rgba(0,0,0,0.16)',
                          color: '#cbd5e1',
                          lineHeight: 1.6,
                        }}
                      >
                        {signal}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '12px',
                  }}
                >
                  Location & Property Layer
                </div>

                {detailView.showLocationData ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>City</div>
                      <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 700 }}>
                        {getLocationDisplay(
                          selectedDeal,
                          selectedDealPremiumUnlocked,
                          selectedDealDiamondUnlocked,
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '13px' }}>Property Type</div>
                      <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 700 }}>
                        {detailView.propertyType || 'Unknown'}
                      </div>
                    </div>

                    {addressLine ? (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>Address</div>
                        <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 700 }}>
                          {addressLine}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div
                    style={{
                      color: '#cbd5e1',
                      lineHeight: 1.7,
                    }}
                  >
                    {getLocationDisplay(
                      selectedDeal,
                      selectedDealPremiumUnlocked,
                      selectedDealDiamondUnlocked,
                    )}
                  </div>
                )}

                <div
                  style={{
                    marginTop: '20px',
                    padding: '18px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.16)',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                  }}
                >
                  Location data not available yet
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '20px',
                alignSelf: 'start',
              }}
            >
              <div
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '14px',
                  }}
                >
                  Access Layer
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>Tier</div>
                    <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800 }}>
                      {getAccessTierLabel(selectedDeal.access_tier)}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>Status</div>
                    <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800 }}>
                      {getDealProductLabel(selectedDeal, parsedNote)}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>Current User Mode</div>
                    <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800 }}>
                      {userMode === 'admin'
                        ? 'Admin'
                        : userMode === 'founder'
                          ? 'Founder'
                          : userMode === 'subscriber'
                            ? 'Subscriber'
                            : userMode === 'registered'
                              ? 'Registered'
                              : 'Visitor'}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '14px',
                  }}
                >
                  Restricted Layer
                </div>

                {selectedDeal.access_tier === 'premium' && !selectedDealPremiumUnlocked ? (
                  <div className="premium-box">
                    <strong style={{ display: 'block', marginBottom: '8px' }}>
                      Premium access required
                    </strong>
                    <div>{detailView.accessPriceLabel}</div>
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'diamond' && !selectedDealDiamondUnlocked ? (
                  <div className="diamond-box">
                    <strong style={{ display: 'block' }}>
                      Diamond access required
                    </strong>
                    <div>{detailView.accessPriceLabel}</div>
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'standard' &&
                detailView.visibilityLabel !== '100%' ? (
                  <div className="locked-box">
                    This standard deal is only partially visible at your current access level.
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'premium' && selectedDealPremiumUnlocked ? (
                  <div className="premium-box">
                    Premium access unlocked. Full premium intelligence is visible.
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'diamond' && selectedDealDiamondUnlocked ? (
                  <div className="diamond-box">
                    <strong style={{ display: 'block' }}>Diamond access unlocked</strong>
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'standard' &&
                detailView.visibilityLabel === '100%' ? (
                  <div className="locked-box">
                    Standard layer visible under your current access rules.
                  </div>
                ) : null}
              </div>

              <div
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    marginBottom: '14px',
                  }}
                >
                  Investor View
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.7,
                    marginBottom: '16px',
                  }}
                >
                  This section is designed to help the investor understand not just the raw numbers, but the strategic value behind the opportunity. Over time, this panel will become the strongest conversion layer for Premium and Diamond access.
                </div>

                <button
                  onClick={closeDealDetail}
                  className="primary-button"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  function renderAdminPanel() {
    if (!showAdminPanel) return null

    return (
      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Internal admin</div>
            <h2 style={{ color: '#ffffff' }}>Admin Access Panel</h2>
          </div>
          <p>
            View subscriber state, founder trial status, and per-deal Premium/Diamond purchase counts.
            Premium and Diamond access is purchased via Stripe; there is no manual approval in this panel.
          </p>
        </div>

        <div
          style={{
            padding: '22px',
            borderRadius: '22px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '18px',
            }}
          >
            <button
              onClick={loadAdminRequests}
              className="secondary-button"
            >
              Refresh
            </button>

            <button
              onClick={() => setShowAdminPanel(false)}
              className="secondary-button"
            >
              Close Admin Panel
            </button>
          </div>

          {adminError ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(239, 68, 68, 0.28)',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ff8b8b',
                fontWeight: 700,
              }}
            >
              {adminError}
            </div>
          ) : null}

          {adminSuccess ? (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(34, 197, 94, 0.28)',
                background: 'rgba(34, 197, 94, 0.12)',
                color: '#4ade80',
                fontWeight: 700,
              }}
            >
              {adminSuccess}
            </div>
          ) : null}

          {adminLoading ? (
            <div style={{ color: '#cbd5e1', fontWeight: 700 }}>Loading...</div>
          ) : null}

          {!adminLoading && adminUsers.length === 0 ? (
            <div style={{ color: '#94a3b8' }}>No admin-visible users found.</div>
          ) : null}

          {!adminLoading && adminUsers.length > 0 ? (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '720px',
              }}
            >
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Role</th>
                  <th style={tableHeaderStyle}>Subscription</th>
                  <th style={tableHeaderStyle}>Founder Status</th>
                  <th style={tableHeaderStyle}>Premium Purchases</th>
                  <th style={tableHeaderStyle}>Diamond Purchases</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => {
                  const subscriptionLabel =
                    user.subscription_active === true
                      ? 'Active'
                      : user.subscription_active === false
                        ? 'Inactive'
                        : '—'

                  const founderLabel =
                    user.founder_trial_status != null && user.founder_trial_status !== ''
                      ? String(user.founder_trial_status)
                      : '—'

                  const premiumCount =
                    user.premium_purchase_count != null ? String(user.premium_purchase_count) : '—'

                  const diamondCount =
                    user.diamond_purchase_count != null ? String(user.diamond_purchase_count) : '—'

                  return (
                    <tr key={user.id}>
                      <td style={tableCellStyle}>{user.email || '—'}</td>
                      <td style={tableCellStyle}>{user.access_role || 'standard'}</td>
                      <td style={tableCellStyle}>{subscriptionLabel}</td>
                      <td style={tableCellStyle}>{founderLabel}</td>
                      <td style={tableCellStyle}>{premiumCount}</td>
                      <td style={tableCellStyle}>{diamondCount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </section>
    )
  }

  function renderPlatformInfoModal() {
    if (!showPlatformInfo) return null

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10000,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '760px',
            background: '#0b1120',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '22px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            maxHeight: '85vh',
            overflowY: 'auto',
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
              About RealEstateSniper
            </div>
          </div>

          {platformInfoAccessNotice ? (
            <div
              style={{
                marginBottom: '18px',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(250, 204, 21, 0.35)',
                background: 'rgba(250, 204, 21, 0.1)',
                color: '#fde68a',
                fontWeight: 800,
                lineHeight: 1.5,
              }}
            >
              {platformInfoAccessNotice}
            </div>
          ) : null}

          <h3 style={{ margin: 0, fontSize: '1.9rem', color: '#ffffff' }}>
            This is not a real estate listing platform
          </h3>

          <div style={{ marginTop: '18px', display: 'grid', gap: '16px' }}>
            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              What you are seeing is only the surface. RealEstateSniper is built to detect opportunities before they become public.
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Most investors are already too late. By the time a deal appears on platforms like Zillow, the real opportunity is gone.
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              We are building a system powered by AI and big data, using multiple data sources and search engines to identify undervalued properties across U.S. markets. We begin in Arizona, starting with Phoenix, Tucson and additional key cities — but the model is designed to scale.
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              This is not about searching listings. This is about receiving opportunities before the market sees them.
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Access is intentionally limited. Only a small group of investors can see the full standard deal intelligence layer.
            </div>

            <div style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              The goal is simple: Investors don’t search for deals — deals come to them.
            </div>

            <div style={{ color: '#ffffff', lineHeight: 1.8, fontWeight: 700 }}>
              If you want early positioning, you need access — not visibility.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setPlatformInfoAccessNotice(null)
                setShowPlatformInfo(false)
              }}
              className="primary-button"
            >
              Close
            </button>

            <button
              onClick={() => {
                setPlatformInfoAccessNotice(null)
                setShowPlatformInfo(false)
                handleSubscriberAccessRequest()
              }}
              className="secondary-button"
            >
              Subscriber Access
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderSubscriptionConfirmationModal() {
    if (!showSubscriptionConfirmation) return null

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10001,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '640px',
            background: '#0b1120',
            border: '1px solid rgba(34, 197, 94, 0.28)',
            borderRadius: '22px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                color: '#bbf7d0',
                border: '1px solid rgba(34, 197, 94, 0.32)',
                background: 'rgba(34, 197, 94, 0.12)',
              }}
            >
              Subscription Confirmation
            </div>
          </div>

          <h3 style={{ margin: '0 0 8px', color: '#ffffff', fontSize: '1.5rem' }}>
            Subscription
          </h3>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              marginBottom: '18px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Price</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>$1,500/month</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Billing</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>Recurring monthly</span>
            </div>
          </div>

          <div
            style={{
              marginBottom: '18px',
              color: '#cbd5e1',
              lineHeight: 1.6,
              fontSize: '0.92rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
              Subscriber access includes:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li>Full visibility on all standard deals available to subscribers.</li>
              <li>Deal Facts, Source Signals, pricing context and internal ranking score.</li>
              <li>Access to Arizona deal intelligence and opportunity discovery.</li>
              <li>Access to verified marketplace opportunities across Arizona.</li>
              <li>Eligibility to purchase Premium and Diamond opportunities.</li>
            </ul>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 16px',
              marginBottom: '18px',
              fontSize: '0.92rem',
            }}
          >
            <a
              href={SUBSCRIPTION_TERMS_PATH}
              style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
            >
              Subscription Terms
            </a>
            <a
              href={TERMS_OF_SERVICE_PATH}
              style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
            >
              Terms of Service
            </a>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px',
              color: '#e2e8f0',
              lineHeight: 1.5,
              fontSize: '0.92rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={subscriptionTermsAccepted}
              onChange={(event) => setSubscriptionTermsAccepted(event.target.checked)}
              style={{ marginTop: '3px' }}
            />
            <span>
              I have read and agree to the{' '}
              <a
                href={SUBSCRIPTION_TERMS_PATH}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                Subscription Terms
              </a>{' '}
              and{' '}
              <a
                href={TERMS_OF_SERVICE_PATH}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                Terms of Service
              </a>
              .
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={closeSubscriptionConfirmation}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmSubscriptionCheckout}
              className="primary-button"
              disabled={!subscriptionTermsAccepted}
              style={
                !subscriptionTermsAccepted
                  ? { opacity: 0.55, cursor: 'not-allowed' }
                  : undefined
              }
            >
              Continue to Stripe
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderPurchaseConfirmationModal() {
    if (!purchaseConfirmation) return null

    const { tier, deal } = purchaseConfirmation
    const isDiamond = tier === 'diamond'
    const tierLabel = isDiamond ? 'Diamond' : 'Premium'
    const accessPrice = isDiamond ? DIAMOND_LAUNCH_PRICE : PREMIUM_ACCESS_PRICE
    const purchaseTermsPath = isDiamond
      ? DIAMOND_PURCHASE_TERMS_PATH
      : PREMIUM_PURCHASE_TERMS_PATH
    const purchaseTermsLabel = isDiamond
      ? 'Diamond Purchase Terms'
      : 'Premium Purchase Terms'
    const dealTitle = getDealTitle(deal)
    const dealAddress = deal?.address || getDealCity(deal)

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 10001,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '640px',
            background: '#0b1120',
            border: isDiamond
              ? '1px solid rgba(239, 68, 68, 0.28)'
              : '1px solid rgba(249, 115, 22, 0.28)',
            borderRadius: '22px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            maxHeight: '85vh',
            overflowY: 'auto',
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
                color: isDiamond ? '#fecaca' : '#fdba74',
                border: isDiamond
                  ? '1px solid rgba(239, 68, 68, 0.32)'
                  : '1px solid rgba(249, 115, 22, 0.32)',
                background: isDiamond
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(249, 115, 22, 0.12)',
              }}
            >
              Purchase Confirmation
            </div>
          </div>

          <h3 style={{ margin: '0 0 8px', color: '#ffffff', fontSize: '1.5rem' }}>
            Confirm {tierLabel} Access
          </h3>

          <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '4px' }}>{dealTitle}</div>
          <div style={{ color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>{dealAddress}</div>

          <div
            style={{
              display: 'grid',
              gap: '10px',
              marginBottom: '18px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Tier</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>{tierLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Price</span>
              <span style={{ color: '#ffffff', fontWeight: 800 }}>
                {formatCurrency(accessPrice)}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '18px',
              color: '#cbd5e1',
              lineHeight: 1.6,
              fontSize: '0.92rem',
            }}
          >
            <p style={{ margin: 0 }}>
              This purchase provides access to the selected opportunity only.
            </p>
            <p style={{ margin: 0 }}>
              Purchases are final and non-refundable once access is delivered.
            </p>
            <p style={{ margin: 0 }}>
              RealEstateSniper does not guarantee property condition, transaction outcome,
              profit, financing, inspection results, or seller response.
            </p>
            <p style={{ margin: 0 }}>You are responsible for your own due diligence.</p>
          </div>

          {isDiamond ? (
            <div
              style={{
                marginBottom: '18px',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(239, 68, 68, 0.28)',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#fecaca',
                lineHeight: 1.6,
                fontSize: '0.92rem',
              }}
            >
              Diamond access includes owner contact rules. Unauthorized contact,
              harassment, redistribution or misuse of owner/property information may
              result in account restriction or removal.
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px 16px',
              marginBottom: '18px',
              fontSize: '0.92rem',
            }}
          >
            <a
              href={purchaseTermsPath}
              style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
            >
              {purchaseTermsLabel}
            </a>
            <a
              href={TERMS_OF_SERVICE_PATH}
              style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
            >
              Terms of Service
            </a>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px',
              color: '#e2e8f0',
              lineHeight: 1.5,
              fontSize: '0.92rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={purchaseTermsAccepted}
              onChange={(event) => setPurchaseTermsAccepted(event.target.checked)}
              style={{ marginTop: '3px' }}
            />
            <span>
              I have read and agree to the{' '}
              <a
                href={purchaseTermsPath}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                {purchaseTermsLabel}
              </a>{' '}
              and{' '}
              <a
                href={TERMS_OF_SERVICE_PATH}
                style={{ color: '#93c5fd', fontWeight: 700, textDecoration: 'underline' }}
              >
                Terms of Service
              </a>
              .
            </span>
          </label>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={closePurchaseConfirmation}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmPurchaseCheckout}
              className="primary-button"
              disabled={!purchaseTermsAccepted}
              style={
                !purchaseTermsAccepted
                  ? { opacity: 0.55, cursor: 'not-allowed' }
                  : undefined
              }
            >
              Continue to Stripe
            </button>
          </div>
        </div>
      </div>
    )
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
          {showInvestorMarketplace ? (
            <a
              href="#markets"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('markets')
              }}
            >
              Markets
            </a>
          ) : null}
          {showInvestorMarketplace ? (
            <a
              href="#deals"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('deals')
              }}
            >
              Live Deals
            </a>
          ) : null}
          {showInvestorAccount ? (
            <a
              href="#subscriber-dashboard"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('subscriber-dashboard')
              }}
            >
              Account
            </a>
          ) : null}
          {primaryVisualWorkspace === 'founder' ? (
            <a
              href="#founder-dashboard"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('founder-dashboard')
              }}
            >
              Founder
            </a>
          ) : null}
          {primaryVisualWorkspace === 'owner' ? (
            <a
              href="#owner-dashboard"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('owner-dashboard')
              }}
            >
              Owner Portal
            </a>
          ) : null}
          {primaryVisualWorkspace === 'admin' ? (
            <a
              href="#admin-dashboard"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('admin-dashboard')
              }}
            >
              Admin
            </a>
          ) : null}
          {showInvestorMarketplace && primaryVisualWorkspace !== 'admin' ? (
            <a
              href="#tiers"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('tiers')
              }}
            >
              Tiers
            </a>
          ) : null}
          {showInvestorMarketplace && primaryVisualWorkspace !== 'admin' ? (
            <a
              href="#owners"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('owners')
              }}
            >
              Property Owners
            </a>
          ) : null}
          {!currentUser ? (
            <a
              href="#access"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('access')
              }}
            >
              Access
            </a>
          ) : null}
        </nav>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {!currentUser ? (
            <button
              type="button"
              onClick={handleFounderAccessRequest}
              disabled={founderAccessClosed}
              className={userMode === 'founder' ? 'primary-button' : 'secondary-button'}
              style={
                founderAccessClosed
                  ? { opacity: 0.55, cursor: 'not-allowed' }
                  : undefined
              }
            >
              {founderAccessClosed ? 'Founders Complete' : 'Founder'}
            </button>
          ) : null}

          {!currentUser ? (
            <>
              <button
                onClick={handleSubscriberAccessRequest}
                className="secondary-button"
              >
                Subscriber
              </button>

              <button
                type="button"
                onClick={handleOwnerDiscoveryRequest}
                className="secondary-button"
              >
                Property Owners
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  maxWidth: '240px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={currentUser.email || ''}
              >
                {currentUser.email}
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: founderUnlocked || subscriberUnlocked || premiumUnlocked || diamondUnlocked
                    ? 'rgba(34, 197, 94, 0.12)'
                    : 'rgba(255,255,255,0.04)',
                  border: founderUnlocked || subscriberUnlocked || premiumUnlocked || diamondUnlocked
                    ? '1px solid rgba(34, 197, 94, 0.28)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {headerPrimaryStatusLabel}
              </div>

              {isAdmin ? (
                <button
                  onClick={handleOpenAdminPanel}
                  className="secondary-button"
                >
                  {showAdminPanel ? 'Close Admin' : 'Admin Panel'}
                </button>
              ) : null}

              <button
                onClick={handleSignOut}
                className="secondary-button"
              >
                Logout
              </button>
            </>
          )}

          {currentUser &&
          !subscriberUnlocked &&
          (primaryVisualWorkspace === 'investor' || primaryVisualWorkspace === 'founder') ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '6px',
                maxWidth: '240px',
              }}
            >
              <button
                onClick={openSubscriptionConfirmation}
                className="secondary-button"
              >
                Subscribe — $1,500/month
              </button>
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  lineHeight: 1.45,
                  textAlign: 'right',
                  fontWeight: 600,
                }}
              >
                Subscription unlocks all standard deals. Premium and Diamond are optional
                per-deal purchases.
              </span>
            </div>
          ) : null}

          {!currentUser ? (
            <button
              onClick={() => {
                setPlatformInfoAccessNotice(null)
                setShowPlatformInfo(true)
              }}
              className="secondary-button"
            >
              Platform Info
            </button>
          ) : null}

          <ContactMenu
            showContactMenu={showContactMenu}
            setShowContactMenu={setShowContactMenu}
            contactMenuRef={contactMenuRef}
            openExternalLink={openExternalLink}
            EMAIL_LINK={EMAIL_LINK}
            WHATSAPP_LINK={WHATSAPP_LINK}
            TELEGRAM_LINK={TELEGRAM_LINK}
          />
        </div>
      </header>

      {unlockFeedbackMessage ? (
        <div
          style={{
            margin: '14px 0 0',
            padding: '12px 16px',
            borderRadius: '14px',
            border: '1px solid rgba(34, 197, 94, 0.28)',
            background: 'rgba(34, 197, 94, 0.12)',
            color: '#4ade80',
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          {unlockFeedbackMessage}
        </div>
      ) : null}

      {selectedDeal ? (
        renderDetailPage()
      ) : selectedCategory ? (
        renderCategoryPage()
      ) : (
        <main className="main-content">
          <section className="hero" style={heroSectionStyle}>
            <div className="hero-copy">
              {!compactHero ? (
                <div className="eyebrow">FOUNDERS ACCESS: 15-DAY PRIVATE WINDOW</div>
              ) : null}
              <h1 style={heroH1Style}>{heroTitle}</h1>
              <p style={heroDescStyle}>{heroDescription}</p>

              {primaryVisualWorkspace === 'owner' ? (
                <p
                  style={{
                    margin: compactHero ? '12px 0 0' : '14px 0 0',
                    maxWidth: '720px',
                    color: '#94a3b8',
                    fontSize: compactHero ? '0.92rem' : '0.95rem',
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  RealEstateSniper never charges commissions or listing fees to property owners.
                  Our compensation comes exclusively from investor subscriptions and optional
                  Premium and Diamond access purchases.
                </p>
              ) : null}

              {!currentUser ? (
                <FounderStatus
                  remainingSpots={remainingFounderSpots}
                  totalSpots={totalFounderSpots}
                  foundersFull={foundersCohortFull}
                />
              ) : null}

              <div className="hero-actions" style={heroActionsStyle}>
                <button
                  onClick={() => {
                    setPlatformInfoAccessNotice(null)
                    setShowPlatformInfo(true)
                  }}
                  className="secondary-button"
                >
                  About the Platform
                </button>

                {!currentUser ? (
                  <button
                    onClick={handleSubscriberAccessRequest}
                    className="secondary-button"
                  >
                    Subscriber Access
                  </button>
                ) : null}

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={handleOwnerAccessRequest}
                    className="secondary-button"
                  >
                    Create Free Owner Account
                  </button>
                ) : null}

                {!currentUser ? (
                  <button
                    type="button"
                    onClick={handleFounderAccessRequest}
                    disabled={founderAccessClosed}
                    className="primary-button"
                    style={
                      founderAccessClosed
                        ? { opacity: 0.55, cursor: 'not-allowed' }
                        : undefined
                    }
                  >
                    {founderAccessClosed ? 'Founders Complete' : 'Founder Access'}
                  </button>
                ) : null}
              </div>

              {founderExpiredNotice ? (
                <div
                  style={{
                    ...heroNoticeSpacing,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    border: '1px solid rgba(239, 68, 68, 0.28)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Founder trial expired. Founder privileges have been removed.
                </div>
              ) : null}

              {subscriberUnlocked && !founderUnlocked ? (
                <div
                  style={{
                    ...heroNoticeSpacing,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    border: '1px solid rgba(34, 197, 94, 0.28)',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Subscriber account active
                </div>
              ) : null}

              {founderUnlocked && founderDaysRemaining != null ? (
                <div
                  style={{
                    ...heroNoticeSpacing,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    border: '1px solid rgba(34, 197, 94, 0.28)',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Founder trial active · {founderDaysRemaining} day{founderDaysRemaining === 1 ? '' : 's'} remaining
                </div>
              ) : null}

              {premiumUnlocked && !diamondUnlocked ? (
                <div
                  style={{
                    ...heroNoticeSpacing,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    border: '1px solid rgba(96, 165, 250, 0.28)',
                    background: 'rgba(96, 165, 250, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Premium access active
                </div>
              ) : null}

              {diamondUnlocked ? (
                <div
                  style={{
                    ...heroNoticeSpacing,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '14px',
                    border: '1px solid rgba(250, 204, 21, 0.28)',
                    background: 'rgba(250, 204, 21, 0.12)',
                    color: '#ffffff',
                    fontWeight: 700,
                  }}
                >
                  Diamond access active
                </div>
              ) : null}

              {showInvestorMarketplace ? (
                <div className="hero-stats" style={heroStatsStyle}>
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
              ) : null}
            </div>

            {showInvestorMarketplace ? (
            <div className="hero-panel">
              <div className="panel-card">
                <div className="panel-header">
                  <div>
                    <h3>Signal Overview</h3>
                    <p>Current feed in active markets</p>
                  </div>
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
              </div>
            </div>
            ) : null}
          </section>

          {currentUser ? (
            <div style={workspaceContextBarStyle}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '999px',
                    background: '#22c55e',
                    boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                    flexShrink: 0,
                  }}
                />
                <strong style={{ color: '#e5e7eb', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                  {workspaceContextTitle}
                </strong>
                <span style={{ color: '#64748b' }}>·</span>
                <span style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>{workspaceContextStatus}</span>
              </div>

              <span style={{ color: '#94a3b8', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                {workspaceContextNote}
              </span>
            </div>
          ) : null}

          {renderAdminPanel()}
          {showInvestorMarketplace ? renderOperationalDivider('MARKET ACCESS') : null}

          {showInvestorMarketplace ? (
          <section id="markets" className="section-block">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Markets & scalability</div>
                <h2 style={{ color: '#ffffff' }}>Launch city by city, scale nationally</h2>
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
          ) : null}

          {showWorkspaceModulesDivider ? renderOperationalDivider('WORKSPACE MODULES') : null}
          {primaryVisualWorkspace === 'founder' ? (
            <section id="founder-dashboard" className="section-block">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Founder workspace</div>
                  <h2 style={{ color: '#ffffff' }}>Founder Dashboard</h2>
                </div>
                <p>
                  Your Founder trial window, visibility rules, benefits, and limits.
                </p>
              </div>

              <div style={founderWorkspaceGridStyle}>
                {founderWorkspaceModules.map((module) => (
                  <div key={module.title} style={founderWorkspaceCardStyle}>
                    <div style={founderWorkspaceTitleStyle}>{module.title}</div>
                    <div style={founderWorkspaceListStyle}>
                      {module.items.map((item) => (
                        <span key={item} style={founderWorkspaceItemStyle}>
                          <span style={founderWorkspaceDotStyle}></span>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <FounderDashboard
                founderTrialStatus={founderDashboardTrialStatus}
                founderTrialEndsAt={founderDashboardTrialEndsAt}
                founderAccessActive={founderUnlocked}
                founderDaysRemaining={founderDashboardDaysRemaining}
              />
            </section>
          ) : null}

          {showInvestorAccount ? (
            <section id="subscriber-dashboard" className="section-block">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Subscriber workspace</div>
                  <h2 style={{ color: '#ffffff' }}>Dashboard</h2>
                </div>
                <p>
                  Your account status, verification progress, purchases, and upcoming alerts.
                </p>
              </div>

              <SubscriberDashboard
                user={currentUser}
                subscriberUnlocked={subscriberUnlocked}
                userMode={userMode}
                emailVerified={subscriberEmailVerified}
                phoneVerified={subscriberPhoneVerified}
                purchasesLoaded={purchasesLoaded}
                myPurchasedEntries={myPurchasedEntries}
                getDealTitle={getDealTitle}
                getDealCity={getDealCity}
                getDealScore={getDealScore}
                onViewDeal={openDealDetail}
                onGoToAccess={() => scrollToSection('access')}
                onExploreMarketplace={() => scrollToSection('deals')}
                access={dashboardAccess}
              />
            </section>
          ) : null}

          {primaryVisualWorkspace === 'owner' ? (
            <section
              id="owner-dashboard"
              className="section-block"
              style={{ padding: '16px 0 4px' }}
            >
              <div className="section-heading" style={{ marginBottom: '14px' }}>
                <div>
                  <h2 style={{ color: '#ffffff' }}>Owner Portal</h2>
                </div>
                <p>
                  Submit off-market properties for private review. Review detected properties.
                  Manage properties connected to your owner account.
                </p>
              </div>

              <OwnerDashboard />
            </section>
          ) : null}

          {primaryVisualWorkspace === 'admin' ? (
            <section id="admin-dashboard" className="section-block">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Admin workspace</div>
                  <h2 style={{ color: '#ffffff' }}>Admin Dashboard</h2>
                </div>
                <p>
                  System overview, user management, deal access, owner review, audit, and health.
                </p>
              </div>

              <AdminDashboard
                platformSnapshot={platformSnapshot}
                businessOverview={businessOverview}
                criticalAlerts={criticalAlerts}
                userDirectory={userDirectory}
                marketplaceOperations={marketplaceOperations}
                ownerReviewQueue={ownerReviewQueue}
                auditSecurity={auditSecurity}
                systemHealth={systemHealth}
                factoryControl={factoryControl}
              />
            </section>
          ) : null}

          {currentUser ? (
            !SHOW_SUBSCRIBER_DASHBOARD && (
              <section id="my-purchases" className="section-block">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Your account</div>
                  <h2 style={{ color: '#ffffff' }}>My Purchases</h2>
                </div>
                <p>
                  Deals where you unlocked Premium or Diamond access via purchase.
                </p>
              </div>

              {!purchasesLoaded ? (
                <div style={{ color: '#94a3b8' }}>Loading purchases...</div>
              ) : myPurchasedEntries.length === 0 ? (
                <div style={{ color: '#94a3b8' }}>No purchases yet.</div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '14px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  }}
                >
                  {myPurchasedEntries.map(({ deal, access }) => {
                    const isDiamond = access.diamond === true
                    const typeLabel = isDiamond
                      ? 'Diamond Access Active'
                      : 'Premium Access Active'
                    const badgeLabel = isDiamond ? '◆ DIAMOND' : 'PREMIUM 🔴'
                    const score = getDealScore(deal)

                    return (
                      <div
                        key={deal.id}
                        style={{
                          padding: '20px',
                          borderRadius: '20px',
                          border: isDiamond
                            ? '1px solid rgba(239, 68, 68, 0.65)'
                            : '1px solid rgba(249, 115, 22, 0.25)',
                          background: isDiamond
                            ? 'linear-gradient(180deg, rgba(25, 5, 5, 0.98) 0%, rgba(10, 10, 12, 1) 100%)'
                            : 'linear-gradient(180deg, rgba(22, 14, 10, 0.94) 0%, rgba(12, 12, 14, 0.96) 100%)',
                          boxShadow: isDiamond
                            ? '0 20px 50px rgba(239, 68, 68, 0.28)'
                            : '0 12px 28px rgba(249, 115, 22, 0.10)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          minHeight: '100%',
                          transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                          transform: 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = isDiamond ? 'scale(1.03)' : 'scale(1.015)'
                          e.currentTarget.style.boxShadow = isDiamond
                            ? '0 24px 58px rgba(239, 68, 68, 0.38)'
                            : '0 16px 34px rgba(249, 115, 22, 0.14)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.boxShadow = isDiamond
                            ? '0 20px 50px rgba(239, 68, 68, 0.28)'
                            : '0 12px 28px rgba(249, 115, 22, 0.10)'
                        }}
                      >
                        <div
                          style={{
                            alignSelf: 'flex-start',
                            padding: '7px 12px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.08em',
                            color: isDiamond ? '#fecaca' : '#fdba74',
                            background: isDiamond
                              ? 'rgba(239, 68, 68, 0.16)'
                              : 'rgba(249, 115, 22, 0.14)',
                            border: isDiamond
                              ? '1px solid rgba(239, 68, 68, 0.36)'
                              : '1px solid rgba(249, 115, 22, 0.24)',
                          }}
                        >
                          {badgeLabel}
                        </div>

                        <div
                          style={{
                            color: isDiamond ? '#ff3b3b' : '#f4a261',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                          }}
                        >
                          {typeLabel}
                        </div>

                        <div
                          style={{
                            color: '#ffffff',
                            fontWeight: 900,
                            lineHeight: 1.35,
                            fontSize: '1.08rem',
                          }}
                        >
                          {getDealTitle(deal)}
                        </div>

                        <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                          {getDealCity(deal)}
                        </div>

                        <div
                          style={{
                            color: '#e5e7eb',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '999px',
                              background:
                                score >= 80 ? '#ef4444' : score >= 60 ? '#22c55e' : '#facc15',
                              boxShadow: isDiamond
                                ? score >= 80
                                  ? '0 0 14px rgba(239, 68, 68, 0.65)'
                                  : score >= 60
                                    ? '0 0 14px rgba(34, 197, 94, 0.45)'
                                    : '0 0 14px rgba(250, 204, 21, 0.45)'
                                : score >= 80
                                  ? '0 0 10px rgba(239, 68, 68, 0.45)'
                                  : score >= 60
                                    ? '0 0 10px rgba(34, 197, 94, 0.35)'
                                    : '0 0 10px rgba(250, 204, 21, 0.35)',
                            }}
                          />
                          Score: {score}/100
                        </div>

                        <button
                          type="button"
                          className="secondary-button"
                          style={{
                            marginTop: 'auto',
                            alignSelf: 'flex-start',
                            padding: '12px 18px',
                            fontSize: '0.96rem',
                            fontWeight: 800,
                            border: isDiamond
                              ? '1px solid rgba(239, 68, 68, 0.34)'
                              : '1px solid rgba(249, 115, 22, 0.3)',
                            background: isDiamond
                              ? 'rgba(239, 68, 68, 0.22)'
                              : 'rgba(249, 115, 22, 0.12)',
                            color: '#ffffff',
                          }}
                          onClick={() => openDealDetail(deal)}
                        >
                          View Deal
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              </section>
            )
          ) : null}

          {showInvestorMarketplace ? (
          <>
          <section id="deals" className="section-block" style={dealsSectionStyle}>
            <div className="section-heading" style={dealsHeadingStyle}>
              <div>
                <div className="eyebrow" style={dealsEyebrowStyle}>
                  {compactDeals ? 'Live Deals' : 'Live investment opportunities'}
                </div>
                <h2 style={dealsH2Style}>{compactDeals ? 'Active deal pipeline' : 'Current deal flow'}</h2>
              </div>
              {compactDeals ? (
                <p style={dealsSubcopyStyle}>
                  Filter by market and open a category to work scored opportunities.
                </p>
              ) : (
                <p>
                  One preview card per category keeps the home clean while still showing what exists inside each layer.
                </p>
              )}
            </div>

            <div className="filter-row" style={dealsFilterRowStyle}>
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

            <div
              className="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: '16px',
              }}
            >
              {renderSummaryCard(
                '🟡 Watchlist',
                'Lower-priority priced discoveries and weaker signals.',
                yellowDeals,
                '#facc15',
                'yellow',
              )}

              {renderSummaryCard(
                '🟢 Opportunities',
                'Priced opportunities with verified spread and stronger commercial interest.',
                greenDeals,
                '#22c55e',
                'green',
              )}

              {renderSummaryCard(
                '🔴 Sniper Deals',
                'Highest-priority priced standard-access opportunities.',
                redDeals,
                '#ef4444',
                'red',
              )}

              {renderSummaryCard(
                '🟠 Unpriced Leads',
                'Early distress and enforcement signals without verified pricing.',
                unpricedLeads,
                '#fb923c',
                'unpriced',
              )}

              {renderSummaryCard(
                '🔵 Premium',
                'Restricted opportunities for paid premium access.',
                premiumDeals,
                '#60a5fa',
                'premium',
              )}

              {renderSummaryCard(
                '💎 Diamond',
                'Top restricted layer. We will refine this logic next.',
                diamondDeals,
                '#facc15',
                'diamond',
              )}
            </div>
          </section>

          {primaryVisualWorkspace !== 'admin' ? (
          <section id="tiers" className="section-block">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Access tiers</div>
                <h2 style={{ color: '#ffffff' }}>Choose the level of intelligence you need</h2>
              </div>
              <p>
                Each tier defines a different level of marketplace visibility, deal intelligence
                and optional per-deal access.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '18px',
              }}
            >
              <div
                style={{
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                  Subscriber Access
                </div>
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 800,
                    marginTop: '8px',
                    marginBottom: '12px',
                  }}
                >
                  $1,500/month
                </div>
                <div style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Includes:
                  </div>
                  <ul style={{ margin: '0 0 12px', paddingLeft: '18px' }}>
                    <li>Full visibility on all standard deals available to subscribers.</li>
                    <li>
                      Deal Facts, Source Signals, pricing context and internal ranking score.
                    </li>
                    <li>Access to Arizona deal intelligence and opportunity discovery.</li>
                    <li>Access to verified marketplace opportunities across Arizona.</li>
                    <li>Eligibility to purchase Premium and Diamond opportunities.</li>
                  </ul>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Does not include:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px' }}>
                    <li>Premium deal unlocks.</li>
                    <li>Diamond deal unlocks.</li>
                    <li>Owner contact access.</li>
                    <li>Investment advice.</li>
                    <li>Guaranteed returns.</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid rgba(96, 165, 250, 0.18)',
                  background: 'rgba(96, 165, 250, 0.06)',
                }}
              >
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                  Premium
                </div>
                <div
                  style={{
                    color: '#60a5fa',
                    fontWeight: 800,
                    marginTop: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {formatCurrency(PREMIUM_ACCESS_PRICE)} per deal
                </div>
                <div style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  <p style={{ margin: '0 0 12px', lineHeight: 1.65 }}>
                    Unlock the full intelligence package for a single Premium opportunity.
                  </p>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Includes:
                  </div>
                  <ul style={{ margin: '0 0 12px', paddingLeft: '18px' }}>
                    <li>Exact property location when available in the deal record.</li>
                    <li>Full Deal Facts and Source Signals.</li>
                    <li>Pricing context, discount data and internal ranking score.</li>
                    <li>Full standard intelligence for the purchased Premium deal.</li>
                    <li>Permanent platform access to intelligence for that opportunity.</li>
                  </ul>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Does not include:
                  </div>
                  <ul style={{ margin: '0 0 12px', paddingLeft: '18px' }}>
                    <li>Owner contact access.</li>
                    <li>Legal, financial or investment advice.</li>
                    <li>Guaranteed acquisition or returns.</li>
                  </ul>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    Premium purchases are final and non-refundable once access is delivered.
                  </p>
                </div>

                <button
                  onClick={() => scrollToSection('deals')}
                  className="secondary-button"
                  style={{ marginTop: '14px' }}
                >
                  View Premium Deals
                </button>
              </div>

              <div
                style={{
                  padding: '22px',
                  borderRadius: '20px',
                  border: '1px solid rgba(250, 204, 21, 0.18)',
                  background: 'rgba(250, 204, 21, 0.06)',
                }}
              >
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>
                  Diamond
                </div>
                <div
                  style={{
                    color: '#facc15',
                    fontWeight: 800,
                    marginTop: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {formatCurrency(DIAMOND_LAUNCH_PRICE)} launch price per deal
                </div>
                <div style={{ color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.92rem' }}>
                  <p style={{ margin: '0 0 12px', lineHeight: 1.65 }}>
                    Diamond is the highest restricted layer for opportunities with owner-controlled
                    access.
                  </p>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Includes:
                  </div>
                  <ul style={{ margin: '0 0 12px', paddingLeft: '18px' }}>
                    <li>Everything included in Premium.</li>
                    <li>Owner-authorized sharing when available.</li>
                    <li>Diamond-level opportunity context after publication.</li>
                    <li>Strict investor access limit for each Diamond deal.</li>
                    <li>Permanent platform access to intelligence for that opportunity.</li>
                  </ul>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Owner-Controlled Access:
                  </div>
                  <p style={{ margin: '0 0 12px', lineHeight: 1.55 }}>
                    The property owner determines how many investors may access each Diamond
                    opportunity. This limit is strict and cannot be increased by RealEstateSniper
                    after publication.
                  </p>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Launch Price Note:
                  </div>
                  <p style={{ margin: '0 0 12px', lineHeight: 1.55 }}>
                    Diamond launch access is {formatCurrency(DIAMOND_LAUNCH_PRICE)} per deal. Planned
                    future price: $10,500 once RealEstateSniper reaches 3 active states.
                  </p>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Does not include:
                  </div>
                  <ul style={{ margin: '0 0 12px', paddingLeft: '18px' }}>
                    <li>Guaranteed transaction with the owner.</li>
                    <li>Guaranteed profitability or returns.</li>
                    <li>Legal, financial or investment advice.</li>
                    <li>Unauthorized owner contact information.</li>
                  </ul>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    Diamond purchases are final and non-refundable once access is delivered.
                  </p>
                </div>

                <button
                  onClick={() => scrollToSection('deals')}
                  className="secondary-button"
                  style={{ marginTop: '14px' }}
                >
                  View Diamond Deals
                </button>
              </div>
            </div>
          </section>
          ) : null}

          {primaryVisualWorkspace !== 'admin' ? (
          <section id="owners" className="section-block" style={{ padding: '20px 0 8px' }}>
            <div
              className="section-heading"
              style={{ marginBottom: '12px', gap: '14px', alignItems: 'flex-start' }}
            >
              <div>
                <div className="eyebrow" style={{ marginBottom: '8px' }}>
                  Property Owners
                </div>
                <h2 style={{ color: '#ffffff', fontSize: '1.35rem' }}>Own property too?</h2>
                <p
                  style={{
                    maxWidth: '560px',
                    margin: '8px 0 0',
                    color: '#94a3b8',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                  }}
                >
                  List privately, stay in control, and decide what investors can see.
                </p>
              </div>
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: '18px',
                color: '#94a3b8',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxWidth: '560px',
              }}
            >
              <li>Owners pay nothing.</li>
              <li>No obligation to sell.</li>
              <li>Contact details are shared only with your permission.</li>
            </ul>

            <div style={{ marginTop: '14px' }}>
              <button
                type="button"
                onClick={handleOwnerAccessRequest}
                className="secondary-button"
              >
                Open Owner Portal
              </button>
            </div>
          </section>
          ) : null}
          </>
          ) : null}

          {!currentUser ? (
            <section id="access" className="section-block cta-block">
            <div>
              <div className="eyebrow">Private window</div>
              <h2 style={{ color: '#ffffff' }}>Only 10 Investors Will Get Access</h2>
              <p>
                Only 10 investors will be selected for the private founders window. Once full, access will close and move to paid tiers only.
              </p>
              <p style={{ marginTop: '14px', color: '#ffffff', fontWeight: 700 }}>
                {founderAccessClosed
                  ? 'Founder cohort is complete. New founder invitations are closed.'
                  : 'Founders window active now. Limited access spots remain.'}
              </p>

              <div
                style={{
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={handleFounderAccessRequest}
                  disabled={founderAccessClosed}
                  style={{
                    padding: '14px 22px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#ff3b3b',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: founderAccessClosed ? 'not-allowed' : 'pointer',
                    opacity: founderAccessClosed ? 0.55 : 1,
                    boxShadow: founderAccessClosed
                      ? 'none'
                      : '0 0 20px rgba(255,59,59,0.35)',
                  }}
                >
                  {founderAccessClosed
                    ? 'Founders Complete'
                    : 'Apply for Founder Access'}
                </button>

                {!currentUser ? (
                  <button
                    onClick={handleSubscriberAccessRequest}
                    style={{
                      padding: '14px 22px',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Subscriber Access
                  </button>
                ) : null}

                <button
                  onClick={() => openExternalLink(WHATSAPP_LINK)}
                  style={{
                    padding: '14px 22px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Speak Directly
                </button>
              </div>

              {founderExpiredNotice ? (
                <div
                  style={{
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(239, 68, 68, 0.28)',
                    background: 'rgba(239, 68, 68, 0.12)',
                  }}
                >
                  <span style={{ color: '#ff8b8b', fontWeight: 800, fontSize: '1rem' }}>
                    Founder Trial Expired
                  </span>
                </div>
              ) : null}

              {subscriberUnlocked && !founderUnlocked ? (
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
                    Subscriber Account Active
                  </span>
                </div>
              ) : null}

              {premiumUnlocked && !diamondUnlocked ? (
                <div
                  style={{
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(96, 165, 250, 0.28)',
                    background: 'rgba(96, 165, 250, 0.12)',
                  }}
                >
                  <span style={{ color: '#93c5fd', fontWeight: 800, fontSize: '1rem' }}>
                    Premium Access Active
                  </span>
                </div>
              ) : null}

              {diamondUnlocked ? (
                <div
                  style={{
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: '1px solid rgba(250, 204, 21, 0.28)',
                    background: 'rgba(250, 204, 21, 0.12)',
                  }}
                >
                  <span style={{ color: '#fde68a', fontWeight: 800, fontSize: '1rem' }}>
                    Diamond Access Active
                  </span>
                </div>
              ) : null}

              {founderUnlocked && founderDaysRemaining != null ? (
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
                    Founder Trial Active · {founderDaysRemaining} Day{founderDaysRemaining === 1 ? '' : 's'} Remaining
                  </span>
                </div>
              ) : null}

              <div
                style={{
                  marginTop: '16px',
                  maxWidth: '560px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 59, 59, 0.18)',
                  background: 'rgba(255, 59, 59, 0.06)',
                  boxShadow: '0 0 18px rgba(255, 59, 59, 0.08)',
                }}
              >
                <div
                  style={{
                    color: '#ff8b8b',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}
                >
                  Live founder signal
                </div>
                <div
                  style={{
                    color: '#ffffff',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    fontSize: '0.96rem',
                  }}
                >
                  {ACCESS_SIGNAL_FEED[accessSignalIndex]}
                </div>
              </div>

              <FounderStatus
                remainingSpots={remainingFounderSpots}
                totalSpots={totalFounderSpots}
                foundersFull={foundersCohortFull}
              />

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

              {founderTrialEndsAt ? (
                <p style={{ marginTop: '14px', color: '#94a3b8', fontWeight: 600, maxWidth: '540px' }}>
                  Trial end date: {new Date(founderTrialEndsAt).toLocaleDateString()}
                </p>
              ) : null}

              {founderExpiredNotice ? (
                <p style={{ marginTop: '14px', color: '#ffffff', fontWeight: 700, maxWidth: '540px' }}>
                  Founder access has expired. Continue with subscriber access or move to the next paid stage when enabled.
                </p>
              ) : null}
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
          ) : null}
        </main>
      )}

      {renderPlatformInfoModal()}
      {renderSubscriptionConfirmationModal()}
      {renderPurchaseConfirmationModal()}

      {!foundersCohortFull ? (
        <FounderModal
          showFounderGate={showFounderGate}
          founderCodeInput={founderCodeInput}
          setFounderCodeInput={setFounderCodeInput}
          founderError={founderError}
          setFounderError={setFounderError}
          handleFounderCodeSubmit={handleFounderCodeSubmit}
          handleFounderGateClose={handleFounderGateClose}
          remainingSpots={remainingFounderSpots}
          totalSpots={totalFounderSpots}
          foundersFullMock={foundersCohortFull}
        />
      ) : null}

      {showPasswordResetFlow ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 10002,
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
            <div style={{ marginBottom: '16px' }}>
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
                Password Recovery
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#ffffff' }}>Set new password</h3>
            <p style={{ marginTop: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>
              Enter your new password to complete account recovery.
            </p>

            <div style={{ position: 'relative', marginTop: '18px' }}>
              <input
                type={showResetPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (passwordResetError) setPasswordResetError('')
                  if (passwordResetInfo) setPasswordResetInfo('')
                }}
                placeholder="New password"
                style={{
                  width: '100%',
                  marginTop: 0,
                  padding: '16px 88px 16px 18px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePasswordResetSubmit()
                  if (e.key === 'Escape') closePasswordResetFlow()
                }}
              />
              <button
                type="button"
                onClick={() => setShowResetPassword((value) => !value)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: '1px solid rgba(148, 163, 184, 0.32)',
                  background: 'rgba(15, 23, 42, 0.55)',
                  color: '#cbd5e1',
                  borderRadius: '999px',
                  padding: '5px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                {showResetPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <input
              type={showResetPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value)
                if (passwordResetError) setPasswordResetError('')
                if (passwordResetInfo) setPasswordResetInfo('')
              }}
              placeholder="Confirm new password"
              style={{
                width: '100%',
                marginTop: '14px',
                padding: '16px 18px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePasswordResetSubmit()
                if (e.key === 'Escape') closePasswordResetFlow()
              }}
            />

            {passwordResetError || passwordResetInfo ? (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: passwordResetError
                    ? '1px solid rgba(239, 68, 68, 0.35)'
                    : '1px solid rgba(34, 197, 94, 0.35)',
                  background: passwordResetError
                    ? 'rgba(239, 68, 68, 0.10)'
                    : 'rgba(34, 197, 94, 0.10)',
                  color: passwordResetError ? '#fecaca' : '#bbf7d0',
                  fontWeight: 600,
                  lineHeight: 1.55,
                  fontSize: '0.95rem',
                }}
              >
                {passwordResetError || passwordResetInfo}
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePasswordResetSubmit}
                className="primary-button"
                disabled={passwordResetSubmitting}
                style={{ opacity: passwordResetSubmitting ? 0.7 : 1 }}
              >
                {passwordResetSubmitting ? 'Updating...' : 'Update password'}
              </button>

              <button
                onClick={closePasswordResetFlow}
                className="secondary-button"
                disabled={passwordResetSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal
        showAuthModal={showAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authContext={authContext}
        handleAuthModalClose={handleAuthModalClose}
      />

      <SiteFooter />
    </div>
  )
}

const tableHeaderStyle = {
  textAlign: 'left',
  padding: '12px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  color: '#94a3b8',
  fontSize: '0.85rem',
  fontWeight: 800,
}

const tableCellStyle = {
  padding: '14px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  color: '#ffffff',
  verticalAlign: 'top',
}

export default App