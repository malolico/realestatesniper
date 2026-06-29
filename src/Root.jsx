import { useSyncExternalStore } from 'react'
import App from './App.jsx'
import { resolveLegalPage } from './legal/legalPages'
import LegalDocumentPage from './legal/LegalDocumentPage'

function subscribeToPathname(onStoreChange) {
  window.addEventListener('popstate', onStoreChange)
  return () => window.removeEventListener('popstate', onStoreChange)
}

function getPathname() {
  return window.location.pathname
}

function getServerPathname() {
  return '/'
}

function usePathname() {
  return useSyncExternalStore(subscribeToPathname, getPathname, getServerPathname)
}

function Root() {
  const pathname = usePathname()
  const legalPage = resolveLegalPage(pathname)

  if (legalPage) {
    return <LegalDocumentPage page={legalPage} />
  }

  return <App />
}

export default Root
