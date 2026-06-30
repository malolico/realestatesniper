/**
 * AdminDashboard — Operations Center shell.
 * Composes admin modules with props from App.jsx.
 */

import {
  PlatformSnapshot,
  BusinessOverview,
  CriticalAlerts,
  UserDirectory,
  MarketplaceOperations,
  OwnerReviewQueue,
  AuditSecurityBlackBox,
  SystemHealth,
  FactoryControlCenter,
} from '../admin'

export default function AdminDashboard({
  platformSnapshot = null,
  businessOverview = null,
  criticalAlerts = null,
  userDirectory = null,
  marketplaceOperations = null,
  ownerReviewQueue = null,
  auditSecurity = null,
  systemHealth = null,
  factoryControl = null,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <PlatformSnapshot platformSnapshot={platformSnapshot} />

      <BusinessOverview businessOverview={businessOverview} />

      <CriticalAlerts criticalAlerts={criticalAlerts} />

      <UserDirectory userDirectory={userDirectory} />

      <MarketplaceOperations marketplaceOperations={marketplaceOperations} />

      <OwnerReviewQueue ownerReviewQueue={ownerReviewQueue} />

      <AuditSecurityBlackBox auditSecurity={auditSecurity} />

      <SystemHealth systemHealth={systemHealth} />

      <FactoryControlCenter factoryControl={factoryControl} />
    </div>
  )
}
