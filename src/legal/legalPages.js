/**
 * Legal document registry — metadata only. Content to be added later.
 */

export const LEGAL_PAGES = {
  legalIndex: {
    path: '/legal',
    title: 'Legal Documentation',
    subtitle: 'Complete index of legal documents governing the RealEstateSniper platform.',
    isIndex: true,
  },
  termsOfService: {
    path: '/legal/terms-of-service',
    title: 'Terms of Service',
    subtitle: 'Platform rules and conditions for using RealEstateSniper.',
  },
  privacyPolicy: {
    path: '/legal/privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'How RealEstateSniper collects, uses, and protects personal data.',
  },
  cookiePolicy: {
    path: '/legal/cookie-policy',
    title: 'Cookie Policy',
    subtitle: 'Information about cookies and similar technologies on this site.',
  },
  investmentDisclaimer: {
    path: '/legal/investment-disclaimer',
    title: 'Investment Disclaimer',
    subtitle: 'Important limitations regarding deal information and investment decisions.',
  },
  subscriptionTerms: {
    path: '/legal/subscription-terms',
    title: 'Subscription Terms',
    subtitle: 'Terms governing subscriber membership and recurring platform access.',
  },
  premiumPurchaseTerms: {
    path: '/legal/premium-purchase-terms',
    title: 'Premium Purchase Terms',
    subtitle: 'Terms for per-deal Premium access purchases.',
  },
  diamondPurchaseTerms: {
    path: '/legal/diamond-purchase-terms',
    title: 'Diamond Purchase Terms',
    subtitle: 'Terms for per-deal Diamond access purchases and owner-contact rules.',
  },
  ownerAgreement: {
    path: '/legal/owner-agreement',
    title: 'Owner Agreement',
    subtitle: 'Terms for property owners using the Owner Portal.',
  },
  acceptableUsePolicy: {
    path: '/legal/acceptable-use-policy',
    title: 'Acceptable Use Policy',
    subtitle: 'Permitted and prohibited uses of platform content and accounts.',
  },
  legalNotice: {
    path: '/legal/legal-notice',
    title: 'Legal Notice / Contact',
    subtitle: 'Company information and legal contact details.',
  },
  diamondAuthorizationAgreement: {
    path: '/legal/diamond-authorization-agreement',
    title: 'Diamond Authorization Agreement',
    subtitle: 'Authorization terms for Diamond-tier owner contact and deal access.',
  },
  founderProgramTerms: {
    path: '/legal/founder-program-terms',
    title: 'Founder Program Terms',
    subtitle: 'Terms governing participation in the RealEstateSniper Founder cohort.',
  },
  marketplaceRules: {
    path: '/legal/marketplace-rules',
    title: 'Marketplace Rules',
    subtitle: 'Rules governing deal listings, scoring, and marketplace conduct.',
  },
  refundPolicy: {
    path: '/legal/refund-policy',
    title: 'Refund Policy',
    subtitle: 'Conditions and procedures for purchase refunds.',
  },
  dataRetentionPolicy: {
    path: '/legal/data-retention-policy',
    title: 'Data Retention Policy',
    subtitle: 'How long personal and platform data is stored and when it is deleted.',
  },
  aiAutomationDisclosure: {
    path: '/legal/ai-automation-disclosure',
    title: 'AI & Automation Disclosure',
    subtitle: 'Transparency about automated systems used in the platform.',
  },
  legalDefinitions: {
    path: '/legal/legal-definitions',
    title: 'Legal Definitions',
    subtitle: 'Glossary of defined terms used across all legal documents.',
  },
}

export const LEGAL_PAGE_LIST = Object.values(LEGAL_PAGES)

const PATH_TO_PAGE = new Map(LEGAL_PAGE_LIST.map((page) => [page.path, page]))

export function getLegalPage(key) {
  return LEGAL_PAGES[key] ?? null
}

export function resolveLegalPage(pathname) {
  const normalized = (pathname || '/').replace(/\/$/, '') || '/'
  return PATH_TO_PAGE.get(normalized) ?? null
}
