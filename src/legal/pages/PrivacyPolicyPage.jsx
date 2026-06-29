import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage page={getLegalPage('privacyPolicy')} />
}
