import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function CookiePolicyPage() {
  return <LegalDocumentPage page={getLegalPage('cookiePolicy')} />
}
