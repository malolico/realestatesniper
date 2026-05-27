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
import FloatingActivity from './components/FloatingActivity'
import FounderModal from './components/FounderModal'
import FounderStatus from './components/FounderStatus'
import ContactMenu from './components/ContactMenu'
import AuthModal from './components/AuthModal'
import SubscriberDashboard from './components/dashboards/SubscriberDashboard'
import FounderDashboard from './components/dashboards/FounderDashboard'
import OwnerDashboard from './components/dashboards/OwnerDashboard'
import { redeemAndActivateFounderCode } from './lib/founder/redeemAndActivateFounderCode'
import { getFounderCodesStatus } from './lib/founder/getFounderCodesStatus'
import { getFounderAccessState } from './lib/founder/getFounderAccessState'
import { resolveAccess } from './lib/access/resolveAccess'
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

const DIAMOND_TOTAL_POSITIONS = 7
const DIAMOND_REMAINING_POSITIONS = 5

const PREMIUM_RECENT_ACTIVITY = '2 investors unlocked this in the last hour'
const DIAMOND_RECENT_ACTIVITY = '1 investor secured access recently'

const ACTIVITY_FEED = [
  {
    label: 'Live activity',
    text: 'Premium interest detected in Phoenix',
  },
  {
    label: 'Live activity',
    text: 'Diamond deal opened in Tucson',
  },
  {
    label: 'Live activity',
    text: 'Founder access activated',
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
  const [activityIndex, setActivityIndex] = useState(0)
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
  const [currentUser, setCurrentUser] = useState(null)
  const [dealPurchaseCounts, setDealPurchaseCounts] = useState({})
  const [purchasedDealAccess, setPurchasedDealAccess] = useState({})
  const [purchasesLoaded, setPurchasesLoaded] = useState(false)
  const [unlockFeedbackMessage, setUnlockFeedbackMessage] = useState('')
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
      return deal?.address || 'Full address available after purchase'
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
      setDeals(
        (dealsData || []).map((deal) => ({
          ...deal,
          access_tier: getDealTier(deal),
        })),
      )
      setLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      const searchParams = new URLSearchParams(window.location.search)
      const stripeSuccess = searchParams.get('success') === 'true'

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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      setActivityIndex((prev) => {
        const next = prev + 1
        return next >= ACTIVITY_FEED.length ? 0 : next
      })
    }, 12000)

    return () => clearInterval(interval)
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

      if (foundersCohortFull) {
        window.sessionStorage.removeItem(FOUNDER_PENDING_KEY)
        window.sessionStorage.removeItem(FOUNDER_PENDING_CODE_KEY)
        return
      }

      const metadata = currentUser.user_metadata || {}

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
      if (!currentUser) {
        await loadUserPurchases(null)
        return
      }

      await loadUserPurchases(currentUser.id)
    }

    loadPurchases()
  }, [currentUser])

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
  }, [currentUser])

  function userHasPurchasedDeal(deal, tier) {
    if (!deal?.id) return false

    const purchase = purchasedDealAccess[deal.id]
    if (!purchase) return false

    if (tier === 'diamond') return purchase.diamond === true
    if (tier === 'premium') return purchase.premium === true || purchase.diamond === true

    return false
  }

  useEffect(() => {
    if (!deals.length) return

    loadDealPurchaseCounts()
  }, [currentUser, deals])

  // Founder expiration: read-only via getFounderAccessState (no client updateUser / downgrade).

  const cities = useMemo(() => {
    return ['All', ...new Set(deals.map((d) => d.city).filter(Boolean))]
  }, [deals])

  const filteredDeals = useMemo(() => {
    if (selectedCity === 'All') return deals
    return deals.filter((d) => d.city === selectedCity)
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

  const yellowDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
    const score = getDealScore(deal)
    return deal.access_tier === 'standard' && score < 60
    })
  }, [filteredDeals])

  const greenDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
    const score = deal.score || 0
    return deal.access_tier === 'standard' && score >= 60 && score < 80
    })
  }, [filteredDeals])

  const redDeals = useMemo(() => {
    return filteredDeals.filter((deal) => {
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

    if (metadata.access_role === 'subscriber' || metadata.access_role === 'founder') {
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

  function openDealDetail(deal) {
    if (!deal) return

    if (isAdmin) {
      setSelectedDeal(deal)
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
        'Subscribe first to access full deal intelligence.',
      )
      setShowPlatformInfo(true)
      return
    }

    setSelectedDeal(deal)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeDealDetail() {
    setSelectedDeal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        'Subscribe first to access full deal intelligence.',
      )
      setShowPlatformInfo(true)
      return
    }

    setSelectedCategory(category)
    setSelectedDeal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function closeCategory() {
    setSelectedCategory(null)
    setSelectedDeal(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
                <span
                  className={`deal-badge ${getDealBadge(previewDeal.status)}`}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {getDealLabel(previewDeal.status)}
                </span>

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
                {formatCurrency(previewDeal.purchase_price)} ·{' '}
                {previewDeal.discount_percentage ?? 0}% discount
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
      categoryDescription = 'Lower-priority discoveries and weaker signals. Founder access can review all yellow opportunities.'
      accentColor = '#facc15'
    }

    if (selectedCategory === 'green') {
      dealsToShow = greenDeals
      categoryTitle = '🟢 Opportunity Deals'
      categoryDescription = 'Qualified opportunities. Founder access sees the lower-score 50% with full detail and the rest as restricted previews.'
      accentColor = '#22c55e'
    }

    if (selectedCategory === 'red') {
      dealsToShow = redDeals
      categoryTitle = '🔴 Sniper Deals'
      categoryDescription = 'Highest-priority standard-access opportunities. Founder access sees the lower-score 25% with full detail and the rest as restricted previews.'
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
              {dealsToShow.length} deals
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
                actionLabel = 'Diamond Purchased'
              } else if (purchasedPremium) {
                actionLabel = 'Premium Purchased'
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
                    <span className={`deal-badge ${getDealBadge(deal.status)}`}>
                      {getDealLabel(deal.status)}
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
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>Purchase</div>
                      <div style={{ color: '#ffffff', fontWeight: 800, marginTop: '6px' }}>
                        {view.purchase}
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
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>Discount</div>
                      <div style={{ color: '#ffffff', fontWeight: 800, marginTop: '6px' }}>
                        {view.discount}
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
                    {view.note || 'General deal preview available.'}
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
    const score = selectedDeal.score || 0
    const selectedDealDiamondUnlocked =
      diamondUnlocked || userHasPurchasedDeal(selectedDeal, 'diamond')
    const selectedDealPremiumUnlocked =
      premiumUnlocked ||
      selectedDealDiamondUnlocked ||
      userHasPurchasedDeal(selectedDeal, 'premium')

    const scoreColor =
      score >= 80 ? '#ef4444' : score >= 60 ? '#22c55e' : '#facc15'

    const scoreBand =
      score >= 80 ? 'High-priority sniper signal' : score >= 60 ? 'Qualified opportunity signal' : 'Watchlist opportunity'

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
              <span className={`deal-badge ${getDealBadge(selectedDeal.status)}`}>
                {getDealLabel(selectedDeal.status)}
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

                  <div style={{ color: '#f1f5f9', marginBottom: '12px', fontWeight: 600 }}>
                    Owner-verified opportunity with direct execution advantage.
                  </div>

                  <div style={{ color: '#ffffff', lineHeight: 1.85 }}>
                    <div>✔ Owner/contact layer unlocked after purchase</div>
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
                        handleStripeCheckout('diamond', selectedDeal)
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
                    Full property intelligence, owner layer, and contact path unlock after purchase.
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
                        handleStripeCheckout('premium', selectedDeal)
                      }}
                    >
                      Unlock Premium Access — $4,500
                    </button>
                  )}

                  <div style={{ color: '#e2e8f0', marginTop: '10px', fontWeight: 600 }}>
                    Full deal intelligence is unlocked immediately after purchase.
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

              {getDealTier(selectedDeal) === 'diamond' && selectedDealDiamondUnlocked ? (
                <div
                  style={{
                    marginBottom: '14px',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '1px solid rgba(250, 204, 21, 0.32)',
                    background: 'rgba(250, 204, 21, 0.08)',
                  }}
                >
                  <div
                    style={{
                      color: '#fde68a',
                      fontWeight: 800,
                      marginBottom: '8px',
                    }}
                  >
                    Owner Access
                  </div>

                  <div style={{ color: '#ffffff', marginBottom: '8px' }}>
                    <strong>Name:</strong> Owner Verified
                  </div>

                  <div style={{ color: '#e5e7eb', marginBottom: '6px' }}>
                    <strong>Contact Methods:</strong>
                  </div>

                  <div style={{ color: '#e5e7eb', lineHeight: 1.8 }}>
                    <div>- Phone: +1 XXX</div>
                    <div>- WhatsApp: Available</div>
                    <div>- Email: owner@email.com</div>
                  </div>
                </div>
              ) : null}

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
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Estimated Value</div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {detailView.estValue}
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
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Purchase Price</div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {detailView.purchase}
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
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>Discount</div>
                  <div style={{ marginTop: '8px', color: '#ffffff', fontWeight: 800, fontSize: '22px' }}>
                    {detailView.discount}
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
                  Deal Summary
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontSize: '0.96rem',
                  }}
                >
                  {detailView.note || 'No detail available.'}
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
                  Why This Deal Matters
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontSize: '0.96rem',
                  }}
                >
                  This opportunity stands out because the spread between estimated value and entry price suggests pricing inefficiency relative to the current market. For investors looking for off-market or under-recognized value, this kind of signal can indicate a higher probability of margin, repositioning potential or faster decision advantage before broader visibility appears.
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
                  AI Signals Detected
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    'Price below estimated market value',
                    'Potential seller motivation pattern',
                    'Market inefficiency signal in this area',
                    'Comparable activity imbalance detected',
                  ].map((signal) => (
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
                  ))}
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
                  Execution Angle
                </div>

                <div
                  style={{
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontSize: '0.96rem',
                  }}
                >
                  Depending on investor profile, this deal may fit a short-to-mid term repositioning thesis, a discounted acquisition strategy, or a rental optimization angle. The goal here is not only to identify a cheap asset, but to identify a deal where timing, visibility and execution quality can create a stronger outcome than the public market typically offers.
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

                {tier === 'diamond' && selectedDealDiamondUnlocked ? (
                  <div
                    style={{
                      marginTop: '20px',
                      height: '220px',
                      borderRadius: '16px',
                      background: `
                        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        #0f172a
                      `,
                      backgroundSize: '40px 40px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#22c55e',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        width: '100%',
                        textAlign: 'center',
                        color: '#22c55e',
                        fontWeight: 700,
                      }}
                    >
                      Exact property location unlocked
                    </div>
                  </div>
                ) : tier === 'premium' && selectedDealPremiumUnlocked ? (
                  <div
                    style={{
                      marginTop: '20px',
                      height: '220px',
                      borderRadius: '16px',
                      background: `
                        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        #0f172a
                      `,
                      backgroundSize: '40px 40px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(234, 179, 8, 0.25)',
                        border: '2px solid #eab308',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#eab308',
                      }}
                    />

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        width: '100%',
                        textAlign: 'center',
                        color: '#eab308',
                        fontWeight: 700,
                      }}
                    >
                      Approximate investment area (~5 km radius)
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: '20px',
                      height: '220px',
                      borderRadius: '16px',
                      background: `
                        radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 1px, transparent 1px),
                        #0f172a
                      `,
                      backgroundSize: '40px 40px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.25)',
                        border: '2px solid #ef4444',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        width: '100%',
                        textAlign: 'center',
                        color: '#ef4444',
                        fontWeight: 700,
                      }}
                    >
                      General area only — exact location locked
                    </div>
                  </div>
                )}
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
                      {getDealLabel(selectedDeal.status)}
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
                    <div style={{ marginTop: '8px' }}>{PREMIUM_RECENT_ACTIVITY}</div>
                  </div>
                ) : null}

                {selectedDeal.access_tier === 'diamond' && !selectedDealDiamondUnlocked ? (
                  <div className="diamond-box">
                    <strong style={{ display: 'block' }}>
                      Diamond access required
                    </strong>
                    <div>{detailView.accessPriceLabel}</div>
                    <div>{DIAMOND_RECENT_ACTIVITY}</div>
                    <div>
                      {DIAMOND_REMAINING_POSITIONS} / {DIAMOND_TOTAL_POSITIONS} positions remaining
                    </div>
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
                    <div>Owner layer is visible in this preview state.</div>
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
              Access is intentionally limited. Only a small group of investors can see the full deal intelligence layer.
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
              if (selectedDeal) {
                closeDealDetail()
                return
              }
              scrollToSection('markets')
            }}
          >
            Markets
          </a>
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
          {currentUser && !SHOW_SUBSCRIBER_DASHBOARD ? (
            <a
              href="#my-purchases"
              onClick={(e) => {
                e.preventDefault()
                if (selectedDeal) {
                  closeDealDetail()
                  return
                }
                scrollToSection('my-purchases')
              }}
            >
              My Purchases
            </a>
          ) : null}
          {currentUser ? (
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
              Dashboard
            </a>
          ) : null}
          {currentUser && founderUnlocked ? (
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
              Founder Dashboard
            </a>
          ) : null}
          {currentUser?.user_metadata?.access_role === 'owner' ? (
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

          {!currentUser ? (
            <button
              onClick={handleSubscriberAccessRequest}
              className="secondary-button"
            >
              Subscriber
            </button>
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
                {diamondUnlocked
                  ? 'Diamond Active'
                  : premiumUnlocked
                    ? 'Premium Active'
                    : founderUnlocked
                      ? 'Founder Active'
                      : subscriberUnlocked
                        ? 'Subscriber Active'
                        : 'Registered'}
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

          {currentUser && !subscriberUnlocked && !founderUnlocked ? (
            <button
              onClick={handleSubscriptionCheckout}
              className="secondary-button"
            >
              Subscribe — $1,500/month
            </button>
          ) : null}

          <button
            onClick={() => {
              setPlatformInfoAccessNotice(null)
              setShowPlatformInfo(true)
            }}
            className="secondary-button"
          >
            Platform Info
          </button>

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
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">FOUNDERS ACCESS: 15-DAY PRIVATE WINDOW</div>
              <h1 style={{ color: '#ffffff' }}>Private off-market deals before everyone else</h1>
              <p>
                Limited early access to live deal flow before full public release.
              </p>

              <FounderStatus
                remainingSpots={remainingFounderSpots}
                totalSpots={totalFounderSpots}
                foundersFull={foundersCohortFull}
              />

              <div className="hero-actions">
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
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
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
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
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
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
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
                    marginTop: '18px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
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

          {renderAdminPanel()}

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

          {currentUser && founderUnlocked ? (
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

              <FounderDashboard
                founderTrialStatus={founderDashboardTrialStatus}
                founderTrialEndsAt={founderDashboardTrialEndsAt}
                founderAccessActive={founderUnlocked}
                founderDaysRemaining={founderDashboardDaysRemaining}
              />
            </section>
          ) : null}

          {currentUser ? (
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
                access={dashboardAccess}
              />
            </section>
          ) : null}

          {currentUser?.user_metadata?.access_role === 'owner' ? (
            <section id="owner-dashboard" className="section-block">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">Owner workspace</div>
                  <h2 style={{ color: '#ffffff' }}>Owner Portal</h2>
                </div>
                <p>
                  Manage properties, authorization, contact preferences, and Diamond controls.
                </p>
              </div>

              <OwnerDashboard />
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
                      ? 'Diamond Purchased'
                      : 'Premium Purchased'
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

          <section id="deals" className="section-block">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Live investment opportunities</div>
                <h2 style={{ color: '#ffffff' }}>Current deal flow</h2>
              </div>
              <p>
                One preview card per category keeps the home clean while still showing what exists inside each layer.
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

            <div
              className="grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: '16px',
              }}
            >
              {renderSummaryCard(
                '🟡 Watchlist',
                'Lower-priority discoveries and weaker signals.',
                yellowDeals,
                '#facc15',
                'yellow',
              )}

              {renderSummaryCard(
                '🟢 Opportunities',
                'Filtered opportunities with stronger commercial interest.',
                greenDeals,
                '#22c55e',
                'green',
              )}

              {renderSummaryCard(
                '🔴 Sniper Deals',
                'Highest-priority standard-access opportunities.',
                redDeals,
                '#ef4444',
                'red',
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

          <section id="tiers" className="section-block">
            <div className="section-heading">
              <div>
                <div className="eyebrow">Access tiers</div>
                <h2 style={{ color: '#ffffff' }}>Choose the level of intelligence you need</h2>
              </div>
              <p>
                Each tier unlocks a different level of visibility, execution advantage and contact access.
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
                  Subscriber
                </div>
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                  Base real account layer for platform access and future paid upgrades.
                </p>
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
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                  Unlocks premium deal intelligence and full premium layer visibility.
                </p>

                <div style={{ color: '#60a5fa', fontWeight: 800, marginBottom: '10px' }}>
                  {formatCurrency(PREMIUM_ACCESS_PRICE)}
                </div>

                <button
                  onClick={() => scrollToSection('deals')}
                  className="secondary-button"
                >
                  {premiumUnlocked ? 'Premium Active' : 'View Premium Deals'}
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
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                  Unlocks the highest restricted layer and diamond-level opportunity access.
                </p>

                <div style={{ color: '#facc15', fontWeight: 800, marginBottom: '10px' }}>
                  {formatCurrency(DIAMOND_LAUNCH_PRICE)}
                </div>

                <button
                  onClick={() => scrollToSection('deals')}
                  className="secondary-button"
                >
                  {diamondUnlocked ? 'Diamond Active' : 'View Diamond Deals'}
                </button>
              </div>
            </div>
          </section>

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
        </main>
      )}

      {renderPlatformInfoModal()}

      <FloatingActivity
        activityFeed={ACTIVITY_FEED}
        activityIndex={activityIndex}
      />

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

      <AuthModal
        showAuthModal={showAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authContext={authContext}
        handleAuthModalClose={handleAuthModalClose}
      />
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