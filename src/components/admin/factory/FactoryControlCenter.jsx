import { useEffect, useState } from 'react'
import {
  FactoryEdgeHttpError,
  FETCH_TIMEOUT_MS,
  fetchFactoryEdgeHealth,
  fetchFactoryEdgeLiveReads,
  fetchObservabilitySnapshot,
  getDevBearer,
  isOfflineOnlyMode,
  isSnapshotFallbackEnabled,
} from './factoryEdgeClient.js'
import {
  clipText,
  hasCanonDrift,
  mapLiveEnvelopesToView,
  mapSnapshotToView,
  resolveUiPhase,
} from './factoryEdgeMapper.js'

const STALE_MS = 24 * 60 * 60 * 1000

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

function formatScalar(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'yes' : 'no'
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  if (typeof value === 'string') return clipText(value, 80)
  return '—'
}

/**
 * Factory Integration — Admin Live Wiring (FCC → P-INT-01 Slice A).
 * Dual-path: live Control Plane preferred; I.1 snapshot fallback/offline.
 * Does not import Factory modules or the Service Edge package.
 */
export default function FactoryControlCenter() {
  const [phase, setPhase] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [view, setView] = useState(null)
  const [freshness, setFreshness] = useState({
    valid: false,
    stale: false,
    label: 'unknown',
  })

  useEffect(() => {
    let cancelled = false
    // MAJOR-01: live abort must never be reused for snapshot fallback/offline.
    const liveController = new AbortController()
    const liveTimer = setTimeout(() => liveController.abort(), FETCH_TIMEOUT_MS)
    const snapshotHandles = []

    function beginSnapshotAbort() {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
      const handle = { controller, timer }
      snapshotHandles.push(handle)
      return handle
    }

    function clearSnapshotHandle(handle) {
      if (!handle) return
      clearTimeout(handle.timer)
    }

    function applyView(nextView, { applyStale = false } = {}) {
      const generated = parseGeneratedAt(nextView.generatedAt)
      const freshnessState = generated.valid
        ? {
            valid: true,
            stale: applyStale ? generated.stale : false,
            label: generated.date.toISOString(),
          }
        : {
            valid: false,
            stale: false,
            label: 'unknown',
          }
      const nextPhase = resolveUiPhase(nextView, applyStale ? freshnessState : { stale: false })
      setFreshness(freshnessState)
      setView(nextView)
      setPhase(nextPhase)
      setErrorMessage('')
    }

    async function loadSnapshotView({ fallback, signal }) {
      const payload = await fetchObservabilitySnapshot({ signal })
      const mapped = mapSnapshotToView(payload, { fallback })
      if (!mapped.ok) {
        throw new Error(mapped.reason || 'Incompatible observability contract.')
      }
      return mapped.view
    }

    async function load() {
      setPhase('loading')
      setErrorMessage('')
      setView(null)

      try {
        const bearer = getDevBearer()
        // Offline-only config, or Edge not provisioned (no DEV Bearer) → static snapshot.
        if (isOfflineOnlyMode() || !bearer) {
          const snap = beginSnapshotAbort()
          try {
            const snapshotView = await loadSnapshotView({
              fallback: false,
              signal: snap.controller.signal,
            })
            if (cancelled) return
            applyView(snapshotView, { applyStale: true })
          } finally {
            clearSnapshotHandle(snap)
          }
          return
        }

        try {
          // Optional health first — non-fatal; live-only signal.
          const healthProbe = await fetchFactoryEdgeHealth({ signal: liveController.signal })
          const correlationIdBundle = await fetchFactoryEdgeLiveReads({
            bearer,
            signal: liveController.signal,
          })
          if (cancelled) return
          const liveView = mapLiveEnvelopesToView(correlationIdBundle)
          if (healthProbe.ok === false) {
            liveView.warnings = [
              ...(liveView.warnings ?? []),
              'Health probe unreachable; authenticated reads succeeded.',
            ].slice(0, 12)
          }
          applyView(liveView, { applyStale: false })
        } catch (err) {
          if (cancelled) return

          const authFailure = err instanceof FactoryEdgeHttpError && err.authFailure === true
          if (authFailure) {
            setView(null)
            setPhase('read_error')
            setErrorMessage(
              'Factory Edge auth failed (DEV Bearer). Snapshot fallback suppressed for auth failures.'
            )
            return
          }

          // 5xx / network / live timeout → labeled snapshot fallback on a fresh signal.
          if (isSnapshotFallbackEnabled()) {
            const snap = beginSnapshotAbort()
            try {
              const snapshotView = await loadSnapshotView({
                fallback: true,
                signal: snap.controller.signal,
              })
              if (cancelled) return
              applyView(snapshotView, { applyStale: true })
              return
            } catch {
              /* fall through to read_error */
            } finally {
              clearSnapshotHandle(snap)
            }
          }

          const aborted = err?.name === 'AbortError' || err?.code === 'TIMEOUT'
          setView(null)
          setPhase('read_error')
          setErrorMessage(
            aborted
              ? 'Factory observability read timed out.'
              : err?.message === 'DEV Bearer missing (VITE_FACTORY_EDGE_DEV_BEARER).'
                ? 'DEV Bearer missing — set VITE_FACTORY_EDGE_DEV_BEARER for live Control Plane.'
                : 'Unable to load Factory observability (live and snapshot).'
          )
        }
      } finally {
        clearTimeout(liveTimer)
      }
    }

    load()

    return () => {
      cancelled = true
      clearTimeout(liveTimer)
      liveController.abort()
      for (const handle of snapshotHandles) {
        clearTimeout(handle.timer)
        handle.controller.abort()
      }
    }
  }, [])

  const span = view?.factory?.constitutionalPhaseSpan
  const constitutional = view?.factory?.constitutional
  const elr = view?.elrHealth
  const expedientes = Array.isArray(view?.expedientes) ? view.expedientes : []
  const warnings = Array.isArray(view?.warnings) ? view.warnings : []
  const eventKinds = Array.isArray(view?.lineage?.eventKinds) ? view.lineage.eventKinds : []
  const governance =
    view?.governance && typeof view.governance === 'object' ? view.governance : {}
  const driftWarning = view ? hasCanonDrift(governance) : false
  const sourceLabel = view?.sourceLabel ?? null
  const isLive = view?.dataSource === 'live'

  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Factory Control Center</h2>

      {phase === 'loading' ? <PanelNote>Loading Factory observability…</PanelNote> : null}

      {phase === 'read_error' ? (
        <PanelNote tone="error">Read error — {errorMessage}</PanelNote>
      ) : null}

      {view && phase !== 'read_error' ? (
        <>
          <PanelNote tone={isLive ? 'ok' : 'warn'}>
            Source: {sourceLabel}
            {view.correlationId ? ` — correlation: ${view.correlationId}` : ''}
          </PanelNote>
          {driftWarning ? (
            <PanelNote tone="warn">Canon drift warning — review governance aggregates.</PanelNote>
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
          <PanelNote tone="error">Observability not loaded.</PanelNote>
        ) : view ? (
          <>
            <PanelNote tone={view.factory.available ? 'ok' : 'warn'}>
              Mode: {view.mode}
              {' — '}
              {phase === 'unavailable'
                ? 'unavailable'
                : phase === 'empty'
                  ? 'empty'
                  : phase === 'stale'
                    ? 'stale'
                    : 'available'}
            </PanelNote>
            <PanelLine>Factory available: {formatScalar(view.factory.available)}</PanelLine>
            {span ? (
              <PanelLine>
                Constitutional span:{' '}
                {formatScalar(span?.from)} → {formatScalar(span?.to)} (
                {formatScalar(span?.approvedCount)}/{formatScalar(span?.totalCount)} approved)
              </PanelLine>
            ) : constitutional ? (
              <PanelLine>
                Constitutional counts (live): pp={formatScalar(constitutional.ppCount)}; lff=
                {formatScalar(constitutional.lffCount)}; pConst=
                {formatScalar(constitutional.pConstCount)}; ffoLaws=
                {formatScalar(constitutional.ffoLawsCount)}; omc=
                {formatScalar(constitutional.omcMotorsConstitutional)}
              </PanelLine>
            ) : (
              <PanelLine>Constitutional span: — (not exposed on live Control Plane)</PanelLine>
            )}
            <PanelLine>
              ELR — available: {formatScalar(elr?.available)}; empty: {formatScalar(elr?.empty)};
              count: {formatScalar(elr?.expedienteCount)}; status: {formatScalar(elr?.status)}
            </PanelLine>

            <h4 style={{ color: '#ffffff', marginBottom: 4 }}>Expedientes (summary)</h4>
            {view.expedientesDegraded ? (
              <PanelNote tone="warn">
                Live keySample only — state/maturity not available via Slice A (
                {view.keysTruncated ? 'sample truncated' : 'full sample'}).
              </PanelNote>
            ) : null}
            {expedientes.length === 0 ? (
              <PanelLine>No expedientes.</PanelLine>
            ) : (
              expedientes.map((item, index) => {
                const keyLabel = formatScalar(item?.factory_key)
                if (view.expedientesDegraded) {
                  return (
                    <PanelLine key={`${keyLabel}-${index}`}>
                      {keyLabel} | state: — | keyStatus: — | maturity_score: —
                    </PanelLine>
                  )
                }
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
              Canon drift: driftDetected=
              {formatScalar(
                governance.canonDrift?.driftDetected ?? governance.canonDrift?.hasDrift
              )}
              ; driftCount={formatScalar(governance.canonDrift?.driftCount)}
            </PanelLine>

            <h4 style={{ color: '#ffffff', marginBottom: 4 }}>Lineage event kinds</h4>
            {eventKinds.length === 0 ? (
              <PanelLine>No FFO event kinds.</PanelLine>
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
          <PanelNote tone="error">Warnings unavailable.</PanelNote>
        ) : view ? (
          <>
            {driftWarning ? (
              <PanelNote tone="warn">Canon drift indicated by observability data.</PanelNote>
            ) : null}
            {warnings.length === 0 ? (
              <PanelLine>No warnings.</PanelLine>
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
        ) : view ? (
          <>
            <PanelLine>Source: {sourceLabel}</PanelLine>
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
