import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function SubscriptionTermsPage() {
  return <LegalDocumentPage page={getLegalPage('subscriptionTerms')} />
}
