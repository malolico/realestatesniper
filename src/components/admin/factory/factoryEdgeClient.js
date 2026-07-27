/**
 * Admin Live Wiring — READ_ONLY HTTP client for P-INT-01 Slice A Service Edge.
 * Browser-only. Does not import src/factory or services/factory-service-edge.
 *
 * DEV Auth: VITE_FACTORY_EDGE_DEV_BEARER (never commit real secrets).
 * TD-AUTH-PROD remains OPEN.
 */

export const FACTORY_EDGE_CONTRACT_ID = 'factory.service_edge.read'
export const FACTORY_EDGE_API_VERSION = '1.0.0'
export const FACTORY_EDGE_MODE = 'READ_ONLY'
export const FACTORY_EDGE_CLASSIFICATION = 'INTERNAL_OPS'

export const SNAPSHOT_URL = '/factory-observability-snapshot.json'
export const FETCH_TIMEOUT_MS = 5000

export const FACTORY_EDGE_PATHS = Object.freeze({
  health: '/v1/factory/health',
  readiness: '/v1/factory/readiness',
  registrySummary: '/v1/factory/registry/summary',
  elrSummary: '/v1/factory/elr/summary',
  governanceDashboard: '/v1/factory/governance/dashboard',
  governanceDrift: '/v1/factory/governance/drift',
  governanceCompliance: '/v1/factory/governance/compliance',
  governanceMaturity: '/v1/factory/governance/maturity',
})

export const AUTHENTICATED_LIVE_PATHS = Object.freeze([
  FACTORY_EDGE_PATHS.readiness,
  FACTORY_EDGE_PATHS.registrySummary,
  FACTORY_EDGE_PATHS.elrSummary,
  FACTORY_EDGE_PATHS.governanceDashboard,
  FACTORY_EDGE_PATHS.governanceDrift,
  FACTORY_EDGE_PATHS.governanceCompliance,
  FACTORY_EDGE_PATHS.governanceMaturity,
])

export function createCorrelationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getDevBearer() {
  const raw = import.meta.env?.VITE_FACTORY_EDGE_DEV_BEARER
  return typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : ''
}

/** OFFLINE_ONLY when VITE_FACTORY_EDGE_MODE=offline */
export function isOfflineOnlyMode() {
  const mode = String(import.meta.env?.VITE_FACTORY_EDGE_MODE ?? '')
    .trim()
    .toLowerCase()
  return mode === 'offline'
}

/** Snapshot fallback default ON; set VITE_FACTORY_EDGE_SNAPSHOT_FALLBACK=false to disable */
export function isSnapshotFallbackEnabled() {
  const raw = String(import.meta.env?.VITE_FACTORY_EDGE_SNAPSHOT_FALLBACK ?? 'true')
    .trim()
    .toLowerCase()
  return raw !== '0' && raw !== 'false' && raw !== 'off'
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function validateLiveEnvelope(body) {
  if (!isPlainObject(body)) {
    return { ok: false, reason: 'Envelope is not an object.' }
  }
  if (body.contractId !== FACTORY_EDGE_CONTRACT_ID) {
    return { ok: false, reason: 'Incompatible contractId.' }
  }
  if (body.apiVersion !== FACTORY_EDGE_API_VERSION) {
    return { ok: false, reason: 'Incompatible apiVersion.' }
  }
  if (body.mode !== FACTORY_EDGE_MODE) {
    return { ok: false, reason: 'mode must be READ_ONLY.' }
  }
  if (body.dataClassification !== FACTORY_EDGE_CLASSIFICATION) {
    return { ok: false, reason: 'dataClassification must be INTERNAL_OPS.' }
  }
  if (!isPlainObject(body.payload)) {
    return { ok: false, reason: 'payload must be an object.' }
  }
  if (!Array.isArray(body.warnings)) {
    return { ok: false, reason: 'warnings must be an array.' }
  }
  return { ok: true, reason: null }
}

export class FactoryEdgeHttpError extends Error {
  constructor(message, { status, code, authFailure = false, retryAfter = null } = {}) {
    super(message)
    this.name = 'FactoryEdgeHttpError'
    this.status = status
    this.code = code
    this.authFailure = authFailure
    this.retryAfter = retryAfter
  }
}

async function readJson(response) {
  try {
    return await response.json()
  } catch {
    throw new FactoryEdgeHttpError('Response is not valid JSON.', {
      status: response.status,
      code: 'INVALID_JSON',
    })
  }
}

/**
 * GET-only Slice A client. No body, no query params.
 */
export async function factoryEdgeGet(path, { bearer, correlationId, signal, requireAuth } = {}) {
  const headers = {
    Accept: 'application/json',
  }
  if (correlationId) {
    headers['X-Correlation-Id'] = correlationId
  }
  if (requireAuth) {
    if (!bearer) {
      throw new FactoryEdgeHttpError('DEV Bearer missing (VITE_FACTORY_EDGE_DEV_BEARER).', {
        status: 401,
        code: 'UNAUTHENTICATED',
        authFailure: true,
      })
    }
    headers.Authorization = `Bearer ${bearer}`
  }

  let response
  try {
    response = await fetch(path, {
      method: 'GET',
      headers,
      signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new FactoryEdgeHttpError('Factory Edge request timed out.', {
        status: 0,
        code: 'TIMEOUT',
      })
    }
    throw new FactoryEdgeHttpError('Factory Edge network failure.', {
      status: 0,
      code: 'NETWORK',
    })
  }

  const retryAfter = response.headers?.get?.('Retry-After') ?? null

  if (response.status === 401 || response.status === 403) {
    throw new FactoryEdgeHttpError('Factory Edge authentication/authorization failed.', {
      status: response.status,
      code: response.status === 401 ? 'UNAUTHENTICATED' : 'FORBIDDEN',
      authFailure: true,
      retryAfter,
    })
  }

  if (response.status === 429) {
    throw new FactoryEdgeHttpError('Factory Edge rate limited.', {
      status: 429,
      code: 'RATE_LIMITED',
      retryAfter,
    })
  }

  if (!response.ok) {
    const body = await readJson(response).catch(() => null)
    const code = body?.error?.code ?? `HTTP_${response.status}`
    throw new FactoryEdgeHttpError('Factory Edge request failed.', {
      status: response.status,
      code,
      retryAfter,
    })
  }

  return readJson(response)
}

/**
 * Optional health (no auth). Failures are non-fatal for the live bundle.
 */
export async function fetchFactoryEdgeHealth({ correlationId, signal } = {}) {
  try {
    const body = await factoryEdgeGet(FACTORY_EDGE_PATHS.health, {
      correlationId,
      signal,
      requireAuth: false,
    })
    return { ok: true, body }
  } catch {
    return { ok: false, body: null }
  }
}

/**
 * Fetch all authenticated Slice A read endpoints in parallel (one correlation id).
 */
export async function fetchFactoryEdgeLiveReads({
  bearer = getDevBearer(),
  correlationId = createCorrelationId(),
  signal,
} = {}) {
  const entries = await Promise.all(
    AUTHENTICATED_LIVE_PATHS.map(async (path) => {
      const body = await factoryEdgeGet(path, {
        bearer,
        correlationId,
        signal,
        requireAuth: true,
      })
      const validation = validateLiveEnvelope(body)
      if (!validation.ok) {
        throw new FactoryEdgeHttpError(validation.reason || 'Invalid live envelope.', {
          status: 200,
          code: 'INVALID_ENVELOPE',
        })
      }
      return [path, body]
    })
  )

  const byPath = Object.fromEntries(entries)
  return { correlationId, byPath }
}

export async function fetchObservabilitySnapshot({ signal } = {}) {
  let response
  try {
    response = await fetch(SNAPSHOT_URL, {
      method: 'GET',
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new FactoryEdgeHttpError('Snapshot read timed out.', {
        status: 0,
        code: 'TIMEOUT',
      })
    }
    throw new FactoryEdgeHttpError('Snapshot network failure.', {
      status: 0,
      code: 'NETWORK',
    })
  }

  if (!response.ok) {
    throw new FactoryEdgeHttpError('Snapshot unavailable.', {
      status: response.status,
      code: `HTTP_${response.status}`,
    })
  }

  try {
    return await response.json()
  } catch {
    throw new FactoryEdgeHttpError('Snapshot is not valid JSON.', {
      status: response.status,
      code: 'INVALID_JSON',
    })
  }
}
