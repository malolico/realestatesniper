import {
  PlatformSnapshot,
  BusinessOverview,
  CriticalAlerts,
  OwnerReviewQueue,
  MarketplaceOperations,
  AuditSecurityBlackBox,
  SystemHealth,
  FactoryControlCenter,
  UserDirectory,
} from './index.js'

export default function OperationsCenter() {
  return (
    <>
      <PlatformSnapshot />
      <BusinessOverview />
      <CriticalAlerts />
      <OwnerReviewQueue />
      <MarketplaceOperations />
      <AuditSecurityBlackBox />
      <SystemHealth />
      <FactoryControlCenter />
      <UserDirectory />
    </>
  )
}
