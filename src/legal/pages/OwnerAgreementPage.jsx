import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function OwnerAgreementPage() {
  return <LegalDocumentPage page={getLegalPage('ownerAgreement')} />
}
