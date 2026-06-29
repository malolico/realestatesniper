import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function DiamondPurchaseTermsPage() {
  return <LegalDocumentPage page={getLegalPage('diamondPurchaseTerms')} />
}
