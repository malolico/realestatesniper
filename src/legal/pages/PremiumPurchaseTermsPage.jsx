import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function PremiumPurchaseTermsPage() {
  return <LegalDocumentPage page={getLegalPage('premiumPurchaseTerms')} />
}
