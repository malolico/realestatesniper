/**
 * Registry of legal page components with real content.
 * When a page component is rewritten with full content,
 * import it here and add it to the map.
 * Root.jsx renders registered components directly;
 * unregistered pages fall back to the generic placeholder.
 */

import TermsOfServicePage from './pages/TermsOfServicePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import OwnerAgreementPage from './pages/OwnerAgreementPage'
import DiamondAuthorizationAgreementPage from './pages/DiamondAuthorizationAgreementPage'
import DiamondPurchaseTermsPage from './pages/DiamondPurchaseTermsPage'
import PremiumPurchaseTermsPage from './pages/PremiumPurchaseTermsPage'
import FounderProgramTermsPage from './pages/FounderProgramTermsPage'
import SubscriptionTermsPage from './pages/SubscriptionTermsPage'
import MarketplaceRulesPage from './pages/MarketplaceRulesPage'
import AcceptableUsePolicyPage from './pages/AcceptableUsePolicyPage'
import RefundPolicyPage from './pages/RefundPolicyPage'
import LegalNoticePage from './pages/LegalNoticePage'
import DataRetentionPolicyPage from './pages/DataRetentionPolicyPage'
import AiAutomationDisclosurePage from './pages/AiAutomationDisclosurePage'
import LegalDefinitionsPage from './pages/LegalDefinitionsPage'
import InvestmentDisclaimerPage from './pages/InvestmentDisclaimerPage'

const registry = new Map()

registry.set('/legal/terms-of-service', TermsOfServicePage)
registry.set('/legal/privacy-policy', PrivacyPolicyPage)
registry.set('/legal/cookie-policy', CookiePolicyPage)
registry.set('/legal/owner-agreement', OwnerAgreementPage)
registry.set('/legal/diamond-authorization-agreement', DiamondAuthorizationAgreementPage)
registry.set('/legal/diamond-purchase-terms', DiamondPurchaseTermsPage)
registry.set('/legal/premium-purchase-terms', PremiumPurchaseTermsPage)
registry.set('/legal/founder-program-terms', FounderProgramTermsPage)
registry.set('/legal/subscription-terms', SubscriptionTermsPage)
registry.set('/legal/marketplace-rules', MarketplaceRulesPage)
registry.set('/legal/acceptable-use-policy', AcceptableUsePolicyPage)
registry.set('/legal/refund-policy', RefundPolicyPage)
registry.set('/legal/legal-notice', LegalNoticePage)
registry.set('/legal/data-retention-policy', DataRetentionPolicyPage)
registry.set('/legal/ai-automation-disclosure', AiAutomationDisclosurePage)
registry.set('/legal/legal-definitions', LegalDefinitionsPage)
registry.set('/legal/investment-disclaimer', InvestmentDisclaimerPage)

export default registry
