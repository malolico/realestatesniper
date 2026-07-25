import { useEffect, useState } from 'react'

const SNAPSHOT_URL = '/factory-observability-snapshot.json'
const FETCH_TIMEOUT_MS = 5000
const STALE_MS = 24 * 60 * 60 * 1000
const MAX_EXPEDIENTES = 20
const MAX_WARNINGS = 12
const MAX_EVENT_KINDS = 24
const EXPECTED_SCHEMA = '1.0.0'
const EXPECTED_MODE = 'READ_ONLY'

function NotConnected() {
  return <p>Not connected yet</p>
}

function PanelLine({ children }) {
  return <p style={{ margin: '6px 0', color: '#e2e8f0', fontSize: '0.9rem' }}>{children}</p>
}

function PanelNote({ children, tone = 'neutral' }) {
  const color =
    tone === 'error'
      ? '#fca5a5'
      : tone === 'warn'
        ? '#fbbf24'
        : tone === 'ok'
          ? '#86efac'
          : '#cbd5e1'
  return <p style={{ margin: '6px 0', color, fontSize: '0.9rem', fontWeight: 600 }}>{children}</p>
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function validateObservabilityContract(payload) {
  if (!isPlainObject(payload)) {
    return { ok: false, reason: 'Payload is not an object.' }
  }
  if (payload.schemaVersion !== EXPECTED_SCHEMA) {
    return { ok: false, reason: 'Incompatible schemaVersion.' }
  }
  if (payload.mode !== EXPECTED_MODE) {
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

function parseGeneratedAt(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return { valid: false, date: null, stale: false }
  }
  const ms = Date.parse(value)
  if (Number.isNaN(ms)) {
    return { valid: false, date: null, stale: false }
  }
  const date = new Date(ms)
  const stale = Date.now() - ms > STALE_MS
  return { valid: true, date, stale }
}

function clipText(value, max = 160) {
  if (typeof value !== 'string') return ''
  return value.length > max ? `${value.slice(0, max)}…` : value
}

function formatScalar(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string') return clipText(value, 80)
  return '—'
}

function hasCanonDrift(governance) {
  const drift = governance?.canonDrift
  if (!isPlainObject(drift)) return false
  return drift.hasDrift === true || (typeof drift.driftCount === 'number' && drift.driftCount > 0)
}

/**
 * Factory Integration I.2 — Admin consumer of static I.1 snapshot (READ_ONLY).
 * Does not import Factory or services/factory-observability (Node/fs).
 */
export default function FactoryControlCenter() {
  const [phase, setPhase] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [contract, setContract] = useState(null)
  const [freshness, setFreshness] = useState({
    valid: false,
    stale: false,
    label: 'unknown',
  })

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    async function loadSnapshot() {
      setPhase('loading')
      setErrorMessage('')
      setContract(null)

      try {
        const response = await fetch(SNAPSHOT_URL, {
          method: 'GET',
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })

        if (!response.ok) {
          throw new Error('Snapshot unavailable.')
        }

        let payload
        try {
          payload = await response.json()
        } catch {
          throw new Error('Snapshot is not valid JSON.')
        }

        const validation = validateObservabilityContract(payload)
        if (!validation.ok) {
          throw new Error(validation.reason || 'Incompatible observability contract.')
        }

        if (cancelled) return

        const generated = parseGeneratedAt(payload.generatedAt)
        const freshnessState = generated.valid
          ? {
              valid: true,
              stale: generated.stale,
              label: generated.date.toISOString(),
            }
          : {
              valid: false,
              stale: false,
              label: 'unknown',
            }

        const factoryAvailable = payload.factory.available === true
        const empty =
          factoryAvailable &&
          (payload.elrHealth.empty === true ||
            payload.elrHealth.expedienteCount === 0 ||
            payload.expedientes.length === 0)

        let nextPhase = 'available'
        if (!factoryAvailable) {
          nextPhase = 'unavailable'
        } else if (empty) {
          nextPhase = 'empty'
        }
        if (freshnessState.stale) {
          nextPhase = 'stale'
        }

        setFreshness(freshnessState)
        setContract(payload)
        setPhase(nextPhase)
      } catch (err) {
        if (cancelled) return
        const aborted = err?.name === 'AbortError'
        setContract(null)
        setPhase('read_error')
        setErrorMessage(
          aborted ? 'Snapshot read timed out.' : 'Unable to load Factory observability snapshot.'
        )
      } finally {
        clearTimeout(timer)
      }
    }

    loadSnapshot()

    return () => {
      cancelled = true
      clearTimeout(timer)
      controller.abort()
    }
  }, [])

  const span = contract?.factory?.constitutionalPhaseSpan
  const elr = contract?.elrHealth
  const expedientes = Array.isArray(contract?.expedientes)
    ? contract.expedientes.slice(0, MAX_EXPEDIENTES)
    : []
  const warnings = Array.isArray(contract?.warnings)
    ? contract.warnings.slice(0, MAX_WARNINGS).map((w) => clipText(String(w), 200))
    : []
  const eventKinds = Array.isArray(contract?.lineage?.eventKinds)
    ? contract.lineage.eventKinds
        .filter((k) => typeof k === 'string')
        .slice(0, MAX_EVENT_KINDS)
        .map((k) => clipText(k, 64))
    : []
  const governance = isPlainObject(contract?.governance) ? contract.governance : {}
  const driftWarning = contract ? hasCanonDrift(governance) : false

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Factory Control Center</h2>

      {phase === 'loading' ? <PanelNote>Loading Factory observability snapshot…</PanelNote> : null}

      {phase === 'read_error' ? (
        <PanelNote tone="error">Read error — {errorMessage}</PanelNote>
      ) : null}

      {contract && phase !== 'read_error' ? (
        <>
          {driftWarning ? (
            <PanelNote tone="warn">Canon drift warning — review governance.canonDrift aggregates.</PanelNote>
          ) : null}
          {!freshness.valid ? (
            <PanelNote tone="warn">Freshness warning — generatedAt missing or invalid.</PanelNote>
          ) : null}
          {phase === 'stale' ? (
            <PanelNote tone="warn">Stale snapshot — generatedAt is older than 24 hours.</PanelNote>
          ) : null}
        </>
      ) : null}

      <section>
        <h3>Factory Status</h3>
        {phase === 'loading' ? (
          <PanelLine>Loading…</PanelLine>
        ) : phase === 'read_error' ? (
          <PanelNote tone="error">Snapshot not loaded.</PanelNote>
        ) : contract ? (
          <>
            <PanelNote tone={contract.factory.available ? 'ok' : 'warn'}>
              Mode: {EXPECTED_MODE}
              {' — '}
              {phase === 'unavailable'
                ? 'unavailable'
                : phase === 'empty'
                  ? 'empty'
                  : phase === 'stale'
                    ? 'stale'
                    : 'available'}
            </PanelNote>
            <PanelLine>Factory available: {formatScalar(contract.factory.available)}</PanelLine>
            <PanelLine>
              Constitutional span:{' '}
              {formatScalar(span?.from)} → {formatScalar(span?.to)} (
              {formatScalar(span?.approvedCount)}/{formatScalar(span?.totalCount)} approved)
            </PanelLine>
            <PanelLine>
              ELR — available: {formatScalar(elr?.available)}; empty: {formatScalar(elr?.empty)};
              count: {formatScalar(elr?.expedienteCount)}; status: {formatScalar(elr?.status)}
            </PanelLine>

            <h4 style={{ color: '#ffffff', marginBottom: 4 }}>Expedientes (summary)</h4>
            {expedientes.length === 0 ? (
              <PanelLine>No expedientes in snapshot.</PanelLine>
            ) : (
              expedientes.map((item, index) => {
                const keyLabel = formatScalar(item?.factory_key)
                const maturitySource =
                  typeof item?.maturity?.source === 'string' ? item.maturity.source : null
                const observational =
                  maturitySource === 'LFF-12_COMPUTED'
                    ? ' (observational computed score — not a business decision)'
                    : ''
                return (
                  <PanelLine key={`${keyLabel}-${index}`}>
                    {keyLabel} | state: {formatScalar(item?.state)} | keyStatus:{' '}
                    {formatScalar(item?.keyStatus)} | maturity_score:{' '}
                    {formatScalar(item?.maturity?.maturity_score)}
                    {observational}
                  </PanelLine>
                )
              })
            )}

            <h4 style={{ color: '#ffffff', marginBottom: 4 }}>Governance (aggregates)</h4>
            <PanelLine>
              Maturity keys: {Object.keys(governance.maturity || {}).join(', ') || '—'}
            </PanelLine>
            <PanelLine>
              Compliance keys: {Object.keys(governance.compliance || {}).join(', ') || '—'}
            </PanelLine>
            <PanelLine>
              Coverage keys: {Object.keys(governance.coverage || {}).join(', ') || '—'}
            </PanelLine>
            <PanelLine>
              Canon drift: hasDrift={formatScalar(governance.canonDrift?.hasDrift)}; driftCount=
              {formatScalar(governance.canonDrift?.driftCount)}
            </PanelLine>

            <h4 style={{ color: '#ffffff', marginBottom: 4 }}>Lineage event kinds</h4>
            {eventKinds.length === 0 ? (
              <PanelLine>No FFO event kinds in snapshot.</PanelLine>
            ) : (
              <PanelLine>{eventKinds.join(', ')}</PanelLine>
            )}
          </>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Registered Engines</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Running Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Completed Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Failed Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Warnings</h3>
        {phase === 'loading' ? (
          <PanelLine>Loading…</PanelLine>
        ) : phase === 'read_error' ? (
          <PanelNote tone="error">Snapshot warnings unavailable.</PanelNote>
        ) : contract ? (
          <>
            {driftWarning ? (
              <PanelNote tone="warn">Canon drift indicated by observability contract.</PanelNote>
            ) : null}
            {warnings.length === 0 ? (
              <PanelLine>No warnings in snapshot.</PanelLine>
            ) : (
              warnings.map((warning, index) => (
                <PanelLine key={`warn-${index}`}>{warning}</PanelLine>
              ))
            )}
          </>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Duplicates</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Pending Queue</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Processing Time</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Synchronization</h3>
        {phase === 'loading' ? (
          <PanelLine>Loading…</PanelLine>
        ) : phase === 'read_error' ? (
          <PanelNote tone="error">Synchronization unknown (read error).</PanelNote>
        ) : contract ? (
          <>
            <PanelLine>generatedAt: {freshness.label}</PanelLine>
            <PanelLine>
              Freshness:{' '}
              {!freshness.valid
                ? 'unknown'
                : freshness.stale
                  ? 'stale (>24h)'
                  : 'current (<24h)'}
            </PanelLine>
          </>
        ) : (
          <NotConnected />
        )}
      </section>

      <section>
        <h3>Next Scheduled Run</h3>
        <NotConnected />
      </section>
    </section>
  )
}
