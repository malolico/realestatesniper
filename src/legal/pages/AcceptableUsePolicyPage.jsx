import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function AcceptableUsePolicyPage() {
  return <LegalDocumentPage page={getLegalPage('acceptableUsePolicy')} />
}
