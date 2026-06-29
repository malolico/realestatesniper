import LegalDocumentPage from '../LegalDocumentPage'
import { getLegalPage } from '../legalPages'

export default function InvestmentDisclaimerPage() {
  return <LegalDocumentPage page={getLegalPage('investmentDisclaimer')} />
}
