import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function LegalNoticePage() {
  return <LegalDocumentPage page={getLegalPage('legalNotice')} />
}
