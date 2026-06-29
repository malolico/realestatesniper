import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function TermsOfServicePage() {
  return <LegalDocumentPage page={getLegalPage('termsOfService')} />
}
