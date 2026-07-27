/**
 * Admin Live Wiring — plan validations (unit + static).
 * Does not start Edge / Vite; no Slice B / Auth prod tests.
 *
 * Run: node src/runAdminLiveWiringValidation.js
 */

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AUTHENTICATED_LIVE_PATHS,
  FACTORY_EDGE_CONTRACT_ID,
  FACTORY_EDGE_PATHS,
  validateLiveEnvelope,
} from './components/admin/factory/factoryEdgeClient.js'
import {
  hasCanonDrift,
  mapKeySampleToExpedientes,
  mapLiveEnvelopesToView,
  mapSnapshotToView,
  resolveUiPhase,
  validateObservabilityContract,
} from './components/admin/factory/factoryEdgeMapper.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

function envelope(payload, warnings = []) {
  return {
    apiVersion: '1.0.0',
    contractId: FACTORY_EDGE_CONTRACT_ID,
    mode: 'READ_ONLY',
    dataClassification: 'INTERNAL_OPS',
    correlationId: '11111111-1111-4111-8111-111111111111',
    generatedAt: '2026-07-27T00:00:00.000Z',
    observationStatus: 'HEALTHY',
    payload,
    warnings,
  }
}

function run(name, fn) {
  try {
    fn()
    console.log(`PASS  ${name}`)
    return true
  } catch (err) {
    console.error(`FAIL  ${name}`)
    console.error(err)
    return false
  }
}

let passed = 0
let failed = 0

function check(name, fn) {
  if (run(name, fn)) passed += 1
  else failed += 1
}

check('01 validateLiveEnvelope accepts Slice A shape', () => {
  const v = validateLiveEnvelope(envelope({ ready: true, empty: false }))
  assert.equal(v.ok, true)
})

check('02 validateLiveEnvelope rejects wrong contractId', () => {
  const bad = envelope({ ready: true })
  bad.contractId = 'wrong'
  assert.equal(validateLiveEnvelope(bad).ok, false)
})

check('03 mapKeySampleToExpedientes is degraded (no state/maturity)', () => {
  const rows = mapKeySampleToExpedientes(['AZ-1', 'AZ-2'])
  assert.equal(rows.length, 2)
  assert.equal(rows[0].factory_key, 'AZ-1')
  assert.equal(rows[0].state, null)
  assert.equal(rows[0].degraded, true)
})

check('04 mapLiveEnvelopesToView maps readiness/registry/elr/governance', () => {
  const live = {
    correlationId: '22222222-2222-4222-8222-222222222222',
    byPath: {
      [FACTORY_EDGE_PATHS.readiness]: envelope({
        ready: true,
        empty: false,
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.registrySummary]: envelope({
        available: true,
        empty: false,
        expedienteCount: 2,
        keysTruncated: false,
        keySample: ['K1', 'K2'],
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.elrSummary]: envelope({
        available: true,
        empty: false,
        expedienteCount: 2,
        status: 'OK',
        sectionCounts: { loop_ledger_refs: 1 },
        eventKindCounts: { FFO_ORCHESTRATION_EVENT: 3 },
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.governanceDashboard]: envelope({
        maturity: { maturityScore: 0.9 },
        compliance: { healthy: true },
        coverage: { motors: 1 },
        canonDrift: { driftDetected: false, driftCount: 0 },
        constitutional: { ppCount: 1, lffCount: 2, pConstCount: 3, ffoLawsCount: 4, omcMotorsConstitutional: 5 },
        warnings: ['dash-warn'],
      }),
      [FACTORY_EDGE_PATHS.governanceDrift]: envelope({
        driftDetected: false,
        findings: [],
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.governanceCompliance]: envelope({
        summary: { healthy: true },
        items: [],
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.governanceMaturity]: envelope({
        maturityScore: 0.9,
        warnings: [],
      }),
    },
  }
  const view = mapLiveEnvelopesToView(live)
  assert.equal(view.dataSource, 'live')
  assert.equal(view.sourceLabel, 'live Control Plane')
  assert.equal(view.factory.available, true)
  assert.equal(view.factory.constitutionalPhaseSpan, null)
  assert.equal(view.factory.constitutional.ppCount, 1)
  assert.equal(view.expedientes.length, 2)
  assert.equal(view.expedientesDegraded, true)
  assert.equal(view.elrHealth.status, 'OK')
  assert.ok(view.lineage.eventKinds.includes('FFO_ORCHESTRATION_EVENT'))
  assert.ok(view.warnings.includes('dash-warn'))
  assert.equal(hasCanonDrift(view.governance), false)
  assert.equal(resolveUiPhase(view, { stale: false }), 'available')
})

check('05 mapLiveEnvelopesToView empty-state is honest', () => {
  const live = {
    correlationId: '33333333-3333-4333-8333-333333333333',
    byPath: {
      [FACTORY_EDGE_PATHS.readiness]: envelope({ ready: true, empty: true, warnings: [] }),
      [FACTORY_EDGE_PATHS.registrySummary]: envelope({
        available: true,
        empty: true,
        expedienteCount: 0,
        keysTruncated: false,
        keySample: [],
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.elrSummary]: envelope({
        available: true,
        empty: true,
        expedienteCount: 0,
        status: 'MISSING_OR_EMPTY',
        sectionCounts: {},
        eventKindCounts: {},
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.governanceDashboard]: envelope({
        maturity: {},
        compliance: {},
        coverage: {},
        canonDrift: {},
        constitutional: {},
        warnings: [],
      }),
      [FACTORY_EDGE_PATHS.governanceDrift]: envelope({ driftDetected: false, findings: [], warnings: [] }),
      [FACTORY_EDGE_PATHS.governanceCompliance]: envelope({ summary: {}, items: [], warnings: [] }),
      [FACTORY_EDGE_PATHS.governanceMaturity]: envelope({ warnings: [] }),
    },
  }
  const view = mapLiveEnvelopesToView(live)
  assert.equal(view.empty, true)
  assert.equal(resolveUiPhase(view, { stale: false }), 'empty')
})

check('06 mapSnapshotToView dual-path labels', () => {
  const snapshot = {
    schemaVersion: '1.0.0',
    mode: 'READ_ONLY',
    generatedAt: '2026-07-27T00:00:00.000Z',
    factory: {
      available: true,
      constitutionalPhaseSpan: { from: 'CB-00', to: 'CB-19', approvedCount: 20, totalCount: 20 },
    },
    elrHealth: { available: true, empty: false, expedienteCount: 1, status: 'OK' },
    expedientes: [{ factory_key: 'S1', state: 'ST-RDY' }],
    warnings: [],
    governance: { canonDrift: { hasDrift: false, driftCount: 0 } },
    lineage: { eventKinds: ['FFO_X'] },
  }
  assert.equal(validateObservabilityContract(snapshot).ok, true)
  const liveFallback = mapSnapshotToView(snapshot, { fallback: true })
  assert.equal(liveFallback.ok, true)
  assert.equal(liveFallback.view.sourceLabel, 'static snapshot (fallback)')
  const offline = mapSnapshotToView(snapshot, { fallback: false })
  assert.equal(offline.view.sourceLabel, 'static snapshot')
})

check('07 AUTHENTICATED_LIVE_PATHS covers 7 auth endpoints (+ health separate)', () => {
  assert.equal(AUTHENTICATED_LIVE_PATHS.length, 7)
  assert.equal(Object.keys(FACTORY_EDGE_PATHS).length, 8)
  assert.ok(!AUTHENTICATED_LIVE_PATHS.includes(FACTORY_EDGE_PATHS.health))
})

check('08 static — no src/factory / Edge / observability imports in Admin FCC helpers', () => {
  const files = [
    'src/components/admin/factory/FactoryControlCenter.jsx',
    'src/components/admin/factory/factoryEdgeClient.js',
    'src/components/admin/factory/factoryEdgeMapper.js',
  ]
  for (const rel of files) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8')
    assert.equal(/from\s+['"][^'"]*src\/factory\//.test(text), false, `${rel} src/factory import`)
    assert.equal(
      /from\s+['"][^'"]*services\/factory-service-edge/.test(text),
      false,
      `${rel} edge import`
    )
    assert.equal(
      /from\s+['"][^'"]*services\/factory-observability/.test(text),
      false,
      `${rel} observability import`
    )
    assert.equal(/from\s+['"]@supabase\//.test(text), false, `${rel} supabase import`)
  }
})

check('09 static — Jobs panels remain Not connected yet', () => {
  const text = fs.readFileSync(
    path.join(root, 'src/components/admin/factory/FactoryControlCenter.jsx'),
    'utf8'
  )
  for (const title of [
    'Registered Engines',
    'Running Jobs',
    'Completed Jobs',
    'Failed Jobs',
    'Duplicates',
    'Pending Queue',
    'Next Scheduled Run',
  ]) {
    assert.ok(text.includes(`<h3>${title}</h3>`), title)
  }
  const enginesIdx = text.indexOf('<h3>Registered Engines</h3>')
  const warningsIdx = text.indexOf('<h3>Warnings</h3>')
  const jobsBlock = text.slice(enginesIdx, warningsIdx)
  assert.equal((jobsBlock.match(/<NotConnected\s*\/>/g) || []).length, 4)
  const dupIdx = text.indexOf('<h3>Duplicates</h3>')
  const syncIdx = text.indexOf('<h3>Last Synchronization</h3>')
  const midBlock = text.slice(dupIdx, syncIdx)
  assert.equal((midBlock.match(/<NotConnected\s*\/>/g) || []).length, 3)
  assert.ok(text.includes('Not connected yet'))
})

check('10 static — snapshot file still present; AdminDashboard untouched by this block marker', () => {
  assert.equal(fs.existsSync(path.join(root, 'public/factory-observability-snapshot.json')), true)
  const vite = fs.readFileSync(path.join(root, 'vite.config.js'), 'utf8')
  assert.ok(vite.includes("'/v1/factory'") || vite.includes('"/v1/factory"'))
  assert.ok(vite.includes('VITE_FACTORY_EDGE_PROXY_TARGET') || vite.includes('8787'))
})

check('11 static — no Product/Marketplace/Supabase calls in FCC client/mapper/FCC', () => {
  const files = [
    'src/components/admin/factory/FactoryControlCenter.jsx',
    'src/components/admin/factory/factoryEdgeClient.js',
    'src/components/admin/factory/factoryEdgeMapper.js',
  ]
  for (const rel of files) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8')
    assert.equal(/supabase/i.test(text), false, rel)
    assert.equal(/\/api\/product/i.test(text), false, rel)
    assert.equal(/createClient\(/.test(text), false, rel)
  }
})

check('12 correlation id field present on live view mapping', () => {
  const view = mapLiveEnvelopesToView({
    correlationId: '44444444-4444-4444-8444-444444444444',
    byPath: {
      [FACTORY_EDGE_PATHS.readiness]: envelope({ ready: false, empty: true }),
      [FACTORY_EDGE_PATHS.registrySummary]: envelope({
        available: false,
        empty: true,
        expedienteCount: 0,
        keySample: [],
      }),
      [FACTORY_EDGE_PATHS.elrSummary]: envelope({
        available: false,
        empty: true,
        expedienteCount: 0,
        status: 'DEGRADED',
        sectionCounts: {},
        eventKindCounts: {},
      }),
      [FACTORY_EDGE_PATHS.governanceDashboard]: envelope({
        maturity: {},
        compliance: {},
        coverage: {},
        canonDrift: {},
        constitutional: {},
      }),
      [FACTORY_EDGE_PATHS.governanceDrift]: envelope({ driftDetected: false, findings: [] }),
      [FACTORY_EDGE_PATHS.governanceCompliance]: envelope({ summary: {}, items: [] }),
      [FACTORY_EDGE_PATHS.governanceMaturity]: envelope({}),
    },
  })
  assert.equal(view.correlationId, '44444444-4444-4444-8444-444444444444')
  assert.equal(resolveUiPhase(view, { stale: false }), 'unavailable')
})

check('13 MAJOR-01 live timeout uses independent snapshot AbortController → SNAPSHOT_FALLBACK', () => {
  const fcc = fs.readFileSync(
    path.join(root, 'src/components/admin/factory/FactoryControlCenter.jsx'),
    'utf8'
  )
  assert.ok(fcc.includes('liveController'), 'liveController required')
  assert.ok(fcc.includes('beginSnapshotAbort'), 'beginSnapshotAbort required')
  assert.ok(
    (fcc.match(/new AbortController\(\)/g) || []).length >= 2,
    'live + snapshot AbortControllers'
  )
  // Fallback path must pass snap.controller.signal, not liveController.signal
  assert.ok(/signal:\s*snap\.controller\.signal/.test(fcc))
  assert.equal(
    /loadSnapshotView\(\{\s*fallback:\s*true,\s*signal:\s*liveController\.signal/.test(fcc),
    false
  )

  // Behavioral simulation of the fixed policy (no React mount).
  const liveController = new AbortController()
  liveController.abort()
  assert.equal(liveController.signal.aborted, true, 'live signal aborted after timeout')

  const snapshotController = new AbortController()
  assert.equal(snapshotController.signal.aborted, false, 'snapshot signal must be fresh')
  assert.notEqual(snapshotController.signal, liveController.signal)

  let observedSignalAborted = null
  function simulateSnapshotFetch(signal) {
    observedSignalAborted = signal.aborted
    if (signal.aborted) {
      const err = new Error('aborted')
      err.name = 'AbortError'
      throw err
    }
    return {
      schemaVersion: '1.0.0',
      mode: 'READ_ONLY',
      generatedAt: '2026-07-27T00:00:00.000Z',
      factory: { available: true, constitutionalPhaseSpan: null },
      elrHealth: { available: true, empty: false, expedienteCount: 1, status: 'OK' },
      expedientes: [{ factory_key: 'K1' }],
      warnings: [],
      governance: { canonDrift: { hasDrift: false, driftCount: 0 } },
      lineage: { eventKinds: [] },
    }
  }

  // Wrong policy (pre-fix): reuse aborted live signal → cannot reach SNAPSHOT_FALLBACK.
  assert.throws(() => simulateSnapshotFetch(liveController.signal))

  // Fixed policy: fresh snapshot signal → SNAPSHOT_FALLBACK, not read_error.
  const payload = simulateSnapshotFetch(snapshotController.signal)
  assert.equal(observedSignalAborted, false)
  const mapped = mapSnapshotToView(payload, { fallback: true })
  assert.equal(mapped.ok, true)
  assert.equal(mapped.view.dataSource, 'snapshot_fallback')
  assert.equal(mapped.view.sourceLabel, 'static snapshot (fallback)')
  assert.notEqual(mapped.view.dataSource, 'read_error')
})

console.log('')
console.log(`Admin Live Wiring validation: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
