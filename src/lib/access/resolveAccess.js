/**
 * resolveAccess — future single source of truth for RealEstateSniper permissions.
 *
 * This module centralizes how we interpret Supabase Auth `user` objects
 * (email + user_metadata) into a stable access shape for the UI and guards.
 *
 * App.jsx still uses its legacy flags today; wiring this in will be a separate,
 * intentional migration step so we do not change visible behavior prematurely.
 *
 * Role priority (highest wins): admin → founder (active trial) → owner → subscriber → registered → visitor
 */

/** Admin emails — keep in sync with App.jsx until both read from config. */
const ADMIN_EMAILS = ['founder@realestatesniper.io']

const VISITOR_ACCESS = {
  role: 'visitor',
  isVisitor: true,
  isRegistered: false,
  isFounder: false,
  isSubscriber: false,
  isOwner: false,
  isAdmin: false,
  emailVerified: false,
  phoneVerified: false,
  identityVerified: false,
  canViewDeals: false,
  canBuyPremium: false,
  canBuyDiamond: false,
  canAccessAdmin: false,
  canAccessOwnerPortal: false,
  founderTrialActive: false,
  founderTrialExpired: false,
  subscriptionActive: false,
  requiresPhoneVerification: false,
  requiresIdentityVerificationForDiamond: false,
}

/**
 * @param {string | null | undefined} dateString ISO date for trial end
 * @returns {number | null} Whole days remaining, 0 if expired, null if no date
 */
function getDaysRemaining(dateString) {
  if (!dateString) return null

  const now = Date.now()
  const ends = new Date(dateString).getTime()
  const diff = ends - now

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * @param {import('@supabase/supabase-js').User | null | undefined} user
 * @returns {typeof VISITOR_ACCESS}
 */
export function resolveAccess(user) {
  if (!user) {
    return { ...VISITOR_ACCESS }
  }

  const metadata = user.user_metadata || {}
  const email = (user.email || '').toLowerCase()

  const isAdmin = ADMIN_EMAILS.includes(email)

  const accessRole = metadata.access_role || 'standard'
  const trialEndsAt = metadata.founder_trial_ends_at || null
  const founderTrialStatus = metadata.founder_trial_status || null
  const daysRemaining = trialEndsAt ? getDaysRemaining(trialEndsAt) : null

  const founderTrialActive =
    accessRole === 'founder' &&
    trialEndsAt != null &&
    daysRemaining != null &&
    daysRemaining > 0

  const founderTrialExpired =
    accessRole === 'founder' &&
    trialEndsAt != null &&
    (daysRemaining === 0 || founderTrialStatus === 'expired')

  const subscriptionActive = metadata.subscription_active === true
  const isOwnerRole = accessRole === 'owner'

  const emailVerified = Boolean(
    user.email_confirmed_at ||
      metadata.email_verified === true,
  )

  const phoneVerified = metadata.phone_verified === true
  const identityVerified = metadata.identity_verified === true

  /** @type {'visitor' | 'registered' | 'founder' | 'subscriber' | 'owner' | 'admin'} */
  let role = 'registered'

  if (isAdmin) {
    role = 'admin'
  } else if (founderTrialActive) {
    role = 'founder'
  } else if (isOwnerRole) {
    role = 'owner'
  } else if (subscriptionActive) {
    role = 'subscriber'
  } else {
    role = 'registered'
  }

  const isVisitor = false
  const isRegistered = role === 'registered'
  const isFounder = role === 'founder'
  const isSubscriber = role === 'subscriber'
  const isOwner = role === 'owner'

  // Founder (active trial) or paid subscriber may purchase tiers; admin bypasses gates.
  const eligibleToPurchase = isAdmin || founderTrialActive || subscriptionActive

  const purchaseVerificationOk = emailVerified && phoneVerified

  const canBuyPremium = eligibleToPurchase && (isAdmin || purchaseVerificationOk)
  const canBuyDiamond = eligibleToPurchase && (isAdmin || purchaseVerificationOk)

  const canViewDeals =
    isAdmin || founderTrialActive || subscriptionActive || isOwnerRole

  const canAccessAdmin = isAdmin
  const canAccessOwnerPortal = isOwnerRole

  // Logged-in users who can buy but have not verified phone yet.
  const requiresPhoneVerification =
    eligibleToPurchase && !isAdmin && !phoneVerified

  // Reserved for future KYC before Diamond checkout — always false for now.
  const requiresIdentityVerificationForDiamond = false
  // When enabled later, example shape:
  // requiresIdentityVerificationForDiamond =
  //   canBuyDiamond && !identityVerified && !isAdmin

  return {
    role,
    isVisitor,
    isRegistered,
    isFounder,
    isSubscriber,
    isOwner,
    isAdmin,
    emailVerified,
    phoneVerified,
    identityVerified,
    canViewDeals,
    canBuyPremium,
    canBuyDiamond,
    canAccessAdmin,
    canAccessOwnerPortal,
    founderTrialActive,
    founderTrialExpired,
    subscriptionActive,
    requiresPhoneVerification,
    requiresIdentityVerificationForDiamond,
  }
}
