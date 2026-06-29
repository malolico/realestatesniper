/**
 * Legal document registry — metadata only. Content to be added later.
 */

export const LEGAL_PAGES = {
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
