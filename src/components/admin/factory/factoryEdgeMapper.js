/**
 * Admin Live Wiring — map Slice A envelopes / I.1 snapshot → FCC view model.
 * No Factory / Service Edge imports.
 */

const EXPECTED_SNAPSHOT_SCHEMA = '1.0.0'
const EXPECTED_SNAPSHOT_MODE = 'READ_ONLY'
const MAX_EXPEDIENTES = 20
const MAX_WARNINGS = 12
const MAX_EVENT_KINDS = 24
const MAX_WARNING_CHARS = 200

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function clipText(value, max = 160) {
  if (typeof value !== 'string') return ''
  return value.length > max ? `${value.slice(0, max)}…` : value
}

function sanitizeWarningList(lists) {
  const out = []
  for (const list of lists) {
    if (!Array.isArray(list)) continue
    for (const item of list) {
      const text = clipText(String(item), MAX_WARNING_CHARS)
      if (text) out.push(text)
      if (out.length >= MAX_WARNINGS) return out
    }
  }
  return out
}

export function validateObservabilityContract(payload) {
  if (!isPlainObject(payload)) {
    return { ok: false, reason: 'Payload is not an object.' }
  }
  if (payload.schemaVersion !== EXPECTED_SNAPSHOT_SCHEMA) {
    return { ok: false, reason: 'Incompatible schemaVersion.' }
  }
  if (payload.mode !== EXPECTED_SNAPSHOT_MODE) {
    return { ok: false, reason: 'mode must be READ_ONLY.' }
  }
  if (!isPlainObject(payload.factory)) {
    return { ok: false, reason: 'factory must be an object.' }
  }
  if (!isPlainObject(payload.elrHealth)) {
    return { ok: false, reason: 'elrHealth must be an object.' }
  }
  if (!Array.isArray(payload.expedientes)) {
    return { ok: false, reason: 'expedientes must be an array.' }
  }
  if (!Array.isArray(payload.warnings)) {
    return { ok: false, reason: 'warnings must be an array.' }
  }
  if (!isPlainObject(payload.governance)) {
    return { ok: false, reason: 'governance must be an object.' }
  }
  if (!isPlainObject(payload.lineage)) {
    return { ok: false, reason: 'lineage must be an object.' }
  }
  if (!Array.isArray(payload.lineage.eventKinds)) {
    return { ok: false, reason: 'lineage.eventKinds must be an array.' }
  }
  return { ok: true, reason: null }
}

export function hasCanonDrift(governance) {
  const drift = governance?.canonDrift
  if (!isPlainObject(drift)) return false
  return (
    drift.hasDrift === true ||
    drift.driftDetected === true ||
    (typeof drift.driftCount === 'number' && drift.driftCount > 0)
  )
}

/**
 * Degraded expediente rows from registry keySample (no state / maturity_score).
 */
export function mapKeySampleToExpedientes(keySample, max = MAX_EXPEDIENTES) {
  if (!Array.isArray(keySample)) return []
  return keySample.slice(0, max).map((key) => ({
    factory_key: typeof key === 'string' ? key : String(key ?? ''),
    state: null,
    keyStatus: null,
    maturity: null,
    degraded: true,
  }))
}

/**
 * @param {{ byPath: Record<string, object>, correlationId: string }} live
 */
export function mapLiveEnvelopesToView(live) {
  const byPath = live?.byPath ?? {}
  const readiness = byPath['/v1/factory/readiness']
  const registry = byPath['/v1/factory/registry/summary']
  const elr = byPath['/v1/factory/elr/summary']
  const dashboard = byPath['/v1/factory/governance/dashboard']
  const drift = byPath['/v1/factory/governance/drift']
  const compliance = byPath['/v1/factory/governance/compliance']
  const maturity = byPath['/v1/factory/governance/maturity']

  const registryPayload = registry?.payload ?? {}
  const elrPayload = elr?.payload ?? {}
  const dashboardPayload = dashboard?.payload ?? {}
  const driftPayload = drift?.payload ?? {}
  const readinessPayload = readiness?.payload ?? {}

  const governance = {
    maturity: isPlainObject(dashboardPayload.maturity)
      ? dashboardPayload.maturity
      : isPlainObject(maturity?.payload)
        ? maturity.payload
        : {},
    compliance: isPlainObject(dashboardPayload.compliance)
      ? dashboardPayload.compliance
      : isPlainObject(compliance?.payload?.summary)
        ? compliance.payload.summary
        : {},
    coverage: isPlainObject(dashboardPayload.coverage) ? dashboardPayload.coverage : {},
    canonDrift: isPlainObject(dashboardPayload.canonDrift)
      ? dashboardPayload.canonDrift
      : {
          driftDetected: driftPayload.driftDetected === true,
          driftCount: Array.isArray(driftPayload.findings) ? driftPayload.findings.length : 0,
        },
  }

  const eventKindCounts = isPlainObject(elrPayload.eventKindCounts)
    ? elrPayload.eventKindCounts
    : {}
  const eventKinds = Object.keys(eventKindCounts)
    .filter((k) => typeof k === 'string')
    .slice(0, MAX_EVENT_KINDS)
    .map((k) => clipText(k, 64))

  const warnings = sanitizeWarningList([
    readiness?.warnings,
    readinessPayload.warnings,
    registry?.warnings,
    registryPayload.warnings,
    elr?.warnings,
    elrPayload.warnings,
    dashboard?.warnings,
    dashboardPayload.warnings,
    drift?.warnings,
    driftPayload.warnings,
    compliance?.warnings,
    maturity?.warnings,
  ])

  const generatedAt =
    (typeof readiness?.generatedAt === 'string' && readiness.generatedAt) ||
    (typeof dashboard?.generatedAt === 'string' && dashboard.generatedAt) ||
    (typeof registry?.generatedAt === 'string' && registry.generatedAt) ||
    null

  const factoryAvailable =
    readinessPayload.ready === true ||
    registryPayload.available === true ||
    elrPayload.available === true

  const empty =
    factoryAvailable &&
    (readinessPayload.empty === true ||
      registryPayload.empty === true ||
      elrPayload.empty === true ||
      Number(registryPayload.expedienteCount ?? 0) === 0)

  return {
    dataSource: 'live',
    sourceLabel: 'live Control Plane',
    correlationId: live?.correlationId ?? null,
    mode: EXPECTED_SNAPSHOT_MODE,
    generatedAt,
    factory: {
      available: factoryAvailable,
      constitutional: isPlainObject(dashboardPayload.constitutional)
        ? dashboardPayload.constitutional
        : null,
      // Slice A does not expose CB-00→19 span over HTTP — do not invent it.
      constitutionalPhaseSpan: null,
    },
    elrHealth: {
      available: elrPayload.available === true,
      empty: elrPayload.empty === true,
      expedienteCount: Number(elrPayload.expedienteCount ?? registryPayload.expedienteCount ?? 0),
      status: typeof elrPayload.status === 'string' ? elrPayload.status : null,
    },
    expedientes: mapKeySampleToExpedientes(registryPayload.keySample),
    expedientesDegraded: true,
    keysTruncated: registryPayload.keysTruncated === true,
    warnings,
    governance,
    lineage: { eventKinds },
    empty,
    driftFindingsCount: Array.isArray(driftPayload.findings) ? driftPayload.findings.length : 0,
  }
}

/**
 * Snapshot I.1 → same view shape (dual-path).
 */
export function mapSnapshotToView(payload, { fallback = false } = {}) {
  const validation = validateObservabilityContract(payload)
  if (!validation.ok) {
    return { ok: false, reason: validation.reason, view: null }
  }

  const expedientes = Array.isArray(payload.expedientes)
    ? payload.expedientes.slice(0, MAX_EXPEDIENTES)
    : []
  const warnings = Array.isArray(payload.warnings)
    ? payload.warnings.slice(0, MAX_WARNINGS).map((w) => clipText(String(w), MAX_WARNING_CHARS))
    : []
  const eventKinds = Array.isArray(payload.lineage?.eventKinds)
    ? payload.lineage.eventKinds
        .filter((k) => typeof k === 'string')
        .slice(0, MAX_EVENT_KINDS)
        .map((k) => clipText(k, 64))
    : []

  const factoryAvailable = payload.factory.available === true
  const empty =
    factoryAvailable &&
    (payload.elrHealth.empty === true ||
      payload.elrHealth.expedienteCount === 0 ||
      expedientes.length === 0)

  return {
    ok: true,
    reason: null,
    view: {
      dataSource: fallback ? 'snapshot_fallback' : 'offline_snapshot',
      sourceLabel: fallback ? 'static snapshot (fallback)' : 'static snapshot',
      correlationId: null,
      mode: EXPECTED_SNAPSHOT_MODE,
      generatedAt: typeof payload.generatedAt === 'string' ? payload.generatedAt : null,
      factory: {
        available: factoryAvailable,
        constitutional: null,
        constitutionalPhaseSpan: payload.factory.constitutionalPhaseSpan ?? null,
      },
      elrHealth: {
        available: payload.elrHealth.available === true,
        empty: payload.elrHealth.empty === true,
        expedienteCount: Number(payload.elrHealth.expedienteCount ?? 0),
        status: typeof payload.elrHealth.status === 'string' ? payload.elrHealth.status : null,
      },
      expedientes,
      expedientesDegraded: false,
      keysTruncated: false,
      warnings,
      governance: isPlainObject(payload.governance) ? payload.governance : {},
      lineage: { eventKinds },
      empty,
      driftFindingsCount: 0,
    },
  }
}

export function resolveUiPhase(view, freshness) {
  if (!view) return 'read_error'
  if (!view.factory?.available) return 'unavailable'
  if (view.empty) return 'empty'
  if (freshness?.stale) return 'stale'
  return 'available'
}
