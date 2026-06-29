import { resolveLegalPage } from './legalPages'
import LegalDocumentPage from './LegalDocumentPage'

function LegalRouter({ pathname }) {
  const page = resolveLegalPage(pathname)
  if (!page) return null
  return <LegalDocumentPage page={page} />
}

export default LegalRouter
