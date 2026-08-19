/**
 * SP11-P1-D — Zero-network LIVE Discovery acceptance harness (CB-02)
 *
 * Runnable:
 *   node src/factory/cb02/validateSp11LiveDiscovery.js
 *
 * Inert injected transport only. No real HTTP. No token. No data/** writes.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FileElrStore } from "../cb01/fileElrStore.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { SCHEMA_ASR_MC_V1, validatePayloadAgainstSchema } from "./connectors/payloadSchemas.js";
import { DiscoveryDedupRegistry } from "./discovery/discoveryDedupRegistry.js";
import { hasDiscoveryHandoff } from "./discovery/discoveryHandoff.js";
import {
  DEFAULT_LIVE_AUTHORIZATION_ENVELOPE,
  LIVE_EXECUTION_NOT_AUTHORIZED,
  LIVE_HTTP_FORBIDDEN,
  gateLiveTransport,
} from "./discovery/liveExecutionGuard.js";
import {
  LIVE_FAMILY_ID,
  LIVE_OBSERVATION_AUTHORITY,
  LIVE_ORGANISM_ID,
  LIVE_SIGNAL_AUTHORITY,
  LIVE_SOURCE_MODE,
  LIVE_UNKNOWN_OBSERVED_AT,
  buildLiveApnToken,
  buildLiveCandidateRef,
  buildLiveObservation,
  buildLiveObservationId,
  computeLivePayloadFingerprint,
} from "./discovery/liveObservationContract.js";
import {
  LIVE_DISCOVERY_DISPOSITION,
  processLiveObservation,
} from "./discovery/liveDiscoveryPipeline.js";
import {
  MARICOPA_ASSESSOR_FAMILY_ID,
  MARICOPA_ASSESSOR_HOST,
  MARICOPA_ASSESSOR_METHOD,
  MARICOPA_ASSESSOR_ORGANISM_ID,
  P1C_IMPLEMENTATION_BOUNDS,
  fetchMaricopaAssessorParcel,
} from "./discovery/maricopaAssessorLiveClient.js";
import {
  ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED,
  adaptMaricopaAssessorLiveResponse,
  validateMappedAssessorLivePayload,
} from "./discovery/maricopaAssessorLiveResponseAdapter.js";
import { runSp10RecordedDiscoveryValidation } from "./validateSp10RecordedDiscovery.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const REF_PAYLOAD_PATH = path.join(
  REPO_ROOT,
  "data/factory-dso-packs/maricopa/pilot-001/response/ORG-ASR-MC.json"
);

const COMPLETE_ENVELOPE = Object.freeze({
  tokenAvailable: true,
  tokenExternalToRepo: true,
  directorLiveExecutionApproval: true,
});

const FIXTURE_APN = "304-11-022";
const RECEIVED_AT = "2026-08-19T12:00:00.000Z";
const SOURCE_OBSERVED_AT = "2024-06-01T00:00:00.000Z";

const P1_RUNTIME_RELATIVE = Object.freeze([
  "discovery/liveObservationContract.js",
  "discovery/liveExecutionGuard.js",
  "discovery/liveDiscoveryPipeline.js",
  "discovery/maricopaAssessorLiveClient.js",
  "discovery/maricopaAssessorLiveResponseAdapter.js",
  "validateSp11LiveDiscovery.js",
]);

function pass(id, errors = []) {
  return { id, passed: errors.length === 0, errors };
}

function loadRecordedAssessorPayload() {
  return JSON.parse(fs.readFileSync(REF_PAYLOAD_PATH, "utf8"));
}

function createHarness() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "sp11-p1d-"));
  const registryDir = path.join(base, "registry");
  const dedupDir = path.join(base, "dedup");
  const store = new FileElrStore(registryDir);
  const registry = new FactoryRegistry({ store });
  const dedupRegistry = new DiscoveryDedupRegistry(dedupDir);
  return { base, registryDir, dedupDir, store, registry, dedupRegistry };
}

function withHarness(fn) {
  const harness = createHarness();
  try {
    return fn(harness);
  } finally {
    fs.rmSync(harness.base, { recursive: true, force: true });
  }
}

function countingTransport(impl) {
  const state = { callCount: 0, requests: [] };
  const transport = (request) => {
    state.callCount += 1;
    state.requests.push(request);
    return impl(request);
  };
  return { transport, state };
}

function observationStub(overrides = {}) {
  return {
    apn: overrides.apn ?? FIXTURE_APN,
    rawApn: overrides.rawApn,
    receivedAt: overrides.receivedAt ?? RECEIVED_AT,
    observedAt: overrides.observedAt,
    payload: overrides.payload ?? loadRecordedAssessorPayload(),
  };
}

function jsonOkBody(obj = { ok: true }) {
  return {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(obj),
  };
}

function readP1Sources() {
  return P1_RUNTIME_RELATIVE.map((rel) => {
    const filePath = path.join(__dirname, rel);
    return { rel, filePath, source: fs.readFileSync(filePath, "utf8") };
  });
}

function assertRefuse(errors, label, result, callCount) {
  if (result?.ok !== false && result?.disposition !== LIVE_DISCOVERY_DISPOSITION.REFUSED) {
    errors.push(`${label}: expected refuse, got ${JSON.stringify(result?.disposition ?? result?.ok)}`);
  }
  const code = result?.code ?? result?.liveHttp;
  if (code !== LIVE_HTTP_FORBIDDEN && result?.reason !== LIVE_EXECUTION_NOT_AUTHORIZED) {
    if (result?.reason !== LIVE_HTTP_FORBIDDEN && result?.code !== LIVE_EXECUTION_NOT_AUTHORIZED) {
      errors.push(`${label}: expected LIVE wall refusal, got reason=${result?.reason} code=${result?.code}`);
    }
  }
  if (callCount !== 0) {
    errors.push(`${label}: transport callCount=${callCount}, expected 0`);
  }
}

function t01DefaultEnvelope() {
  const errors = [];
  const env = DEFAULT_LIVE_AUTHORIZATION_ENVELOPE;
  if (env.tokenAvailable !== false) errors.push("tokenAvailable default must be false");
  if (env.tokenExternalToRepo !== false) errors.push("tokenExternalToRepo default must be false");
  if (env.directorLiveExecutionApproval !== false) {
    errors.push("directorLiveExecutionApproval default must be false");
  }

  const { transport, state } = countingTransport(() => observationStub());
  const gated = gateLiveTransport(env, transport, { apn: FIXTURE_APN });
  assertRefuse(errors, "default gate", gated, state.callCount);

  const client = fetchMaricopaAssessorParcel({ apn: FIXTURE_APN }, { transport });
  if (client.ok !== false) errors.push("default client must refuse");
  if (state.callCount !== 0) errors.push("default client must not invoke transport");
  return pass("T01", errors);
}

function t02IncompleteWalls() {
  const errors = [];
  const incomplete = [
    ["tokenAvailable-only", { tokenAvailable: true, tokenExternalToRepo: false, directorLiveExecutionApproval: false }],
    ["tokenExternalToRepo-only", { tokenAvailable: false, tokenExternalToRepo: true, directorLiveExecutionApproval: false }],
    ["director-only", { tokenAvailable: false, tokenExternalToRepo: false, directorLiveExecutionApproval: true }],
    ["two-token-external", { tokenAvailable: true, tokenExternalToRepo: true, directorLiveExecutionApproval: false }],
    ["two-token-director", { tokenAvailable: true, tokenExternalToRepo: false, directorLiveExecutionApproval: true }],
    ["two-external-director", { tokenAvailable: false, tokenExternalToRepo: true, directorLiveExecutionApproval: true }],
  ];

  for (const [label, envelope] of incomplete) {
    const { transport, state } = countingTransport(() => observationStub());
    const gated = gateLiveTransport(envelope, transport, { apn: FIXTURE_APN });
    assertRefuse(errors, `gate ${label}`, gated, state.callCount);

    const client = fetchMaricopaAssessorParcel({ envelope, apn: FIXTURE_APN }, { transport });
    if (client.ok !== false) errors.push(`client ${label} must refuse`);
    if (state.callCount !== 0) errors.push(`client ${label} callCount=${state.callCount}`);

    withHarness((h) => {
      const pipeline = processLiveObservation(
        { envelope, request: { apn: FIXTURE_APN } },
        {
          transport,
          registry: h.registry,
          registryStore: h.store,
          dedupRegistry: h.dedupRegistry,
          ingestedAt: RECEIVED_AT,
        }
      );
      if (pipeline.disposition !== LIVE_DISCOVERY_DISPOSITION.REFUSED) {
        errors.push(`pipeline ${label} must REFUSE`);
      }
      if (state.callCount !== 0) errors.push(`pipeline ${label} callCount=${state.callCount}`);
    });
  }
  return pass("T02", errors);
}

function t03CompleteWallInjectedOnly() {
  const errors = [];
  const { transport, state } = countingTransport(() => observationStub());
  const gated = gateLiveTransport(COMPLETE_ENVELOPE, transport, { apn: FIXTURE_APN });
  if (gated.ok !== true) errors.push("complete wall + inject must pass gate");
  if (state.callCount !== 1) errors.push(`complete gate callCount=${state.callCount}, expected 1`);

  const noInjectGate = gateLiveTransport(COMPLETE_ENVELOPE, undefined, { apn: FIXTURE_APN });
  if (noInjectGate.ok !== false) errors.push("complete wall without transport must refuse");
  if (noInjectGate.code !== LIVE_HTTP_FORBIDDEN && noInjectGate.liveHttp !== LIVE_HTTP_FORBIDDEN) {
    errors.push("complete wall without transport must remain LIVE_HTTP_FORBIDDEN");
  }

  const clientNoInject = fetchMaricopaAssessorParcel({
    envelope: COMPLETE_ENVELOPE,
    apn: FIXTURE_APN,
  });
  if (clientNoInject.ok !== false) errors.push("complete client without inject must refuse");
  if (clientNoInject.reason !== LIVE_HTTP_FORBIDDEN && clientNoInject.code !== LIVE_HTTP_FORBIDDEN) {
    errors.push("complete client without inject must be LIVE_HTTP_FORBIDDEN");
  }
  if (clientNoInject.retryCount !== 0) errors.push("no-inject client retryCount must be 0");

  const { transport: clientTransport, state: clientState } = countingTransport(() => jsonOkBody());
  const clientOk = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport: clientTransport }
  );
  if (clientOk.ok !== true) errors.push(`complete client + inject must accept 2xx JSON, got ${clientOk.reason}`);
  if (clientState.callCount !== 1) {
    errors.push(`complete client inject callCount=${clientState.callCount}, expected 1`);
  }
  return pass("T03", errors);
}

function t04Identity() {
  const errors = [];
  const token = buildLiveApnToken(" 304-11-022 ");
  const expected = "30411022";
  if (token !== expected) errors.push(`apnToken expected ${expected} got ${token}`);
  if (token !== token.toUpperCase()) errors.push("apnToken must be uppercase");
  if (/[^A-Z0-9]/.test(token)) errors.push("apnToken must strip non-alphanumerics");
  if (buildLiveApnToken("304-11-022") !== buildLiveApnToken("304-11-022")) {
    errors.push("apnToken must be deterministic");
  }

  const observationId = buildLiveObservationId(token);
  const candidateRef = buildLiveCandidateRef(token);
  if (observationId !== `live-${LIVE_ORGANISM_ID}-${token}`) {
    errors.push(`observationId mismatch: ${observationId}`);
  }
  if (!observationId.startsWith("live-")) errors.push("observationId must use live-* namespace");
  if (candidateRef !== observationId) errors.push("candidateRef must equal observationId");
  if (observationId.startsWith("disc-") || candidateRef.startsWith("disc-")) {
    errors.push("LIVE identity must never use disc-*");
  }

  const built = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: RECEIVED_AT,
    payload: { marker: 1 },
  });
  if (!built.ok) errors.push(`buildLiveObservation failed: ${built.reason}`);
  else {
    if (built.observation.observationId !== observationId) errors.push("built observationId mismatch");
    if (built.observation.candidateRef !== observationId) errors.push("built candidateRef mismatch");
    if (built.observation.sourceMode !== LIVE_SOURCE_MODE) errors.push("sourceMode must be LIVE");
  }
  return pass("T04", errors);
}

function t05Temporal() {
  const errors = [];
  const missing = buildLiveObservation({ apn: FIXTURE_APN, payload: {} });
  if (missing.ok !== false || missing.reason !== "receivedAt_required") {
    errors.push("receivedAt must be required");
  }
  const invalid = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: "not-iso",
    payload: {},
  });
  if (invalid.ok !== false || invalid.reason !== "receivedAt_invalid") {
    errors.push("invalid receivedAt must be rejected");
  }

  const withSource = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: RECEIVED_AT,
    observedAt: SOURCE_OBSERVED_AT,
    payload: {},
  });
  if (!withSource.ok) errors.push(`source observedAt rejected: ${withSource.reason}`);
  else if (withSource.observation.observedAt !== SOURCE_OBSERVED_AT) {
    errors.push("observedAt must keep explicit source timestamp");
  }

  const unknown = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: RECEIVED_AT,
    payload: {},
  });
  if (!unknown.ok) errors.push(`absent observedAt rejected: ${unknown.reason}`);
  else if (unknown.observation.observedAt !== LIVE_UNKNOWN_OBSERVED_AT) {
    errors.push("absent source timestamp must be literal UNKNOWN");
  }

  const substituted = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: RECEIVED_AT,
    observedAt: RECEIVED_AT,
    payload: {},
  });
  if (substituted.ok !== false || substituted.reason !== "receivedAt_used_as_observedAt") {
    errors.push("receivedAt must never be substituted for observedAt");
  }

  if (withSource.ok) {
    if ("recordedAt" in withSource.observation) errors.push("LIVE observation must not introduce recordedAt");
    if ("recordedAt" in withSource.signal) errors.push("LIVE signal must not introduce recordedAt");
    if (withSource.signal.receivedAt !== RECEIVED_AT) errors.push("signal must carry receivedAt");
  }
  return pass("T05", errors);
}

function t06FingerprintDedup() {
  const errors = [];
  const payload = { b: 2, a: 1 };
  const fp1 = computeLivePayloadFingerprint(payload);
  const fp2 = computeLivePayloadFingerprint({ a: 1, b: 2 });
  if (fp1 !== fp2) errors.push("payload fingerprint must be deterministic");

  const first = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: RECEIVED_AT,
    observedAt: SOURCE_OBSERVED_AT,
    payload,
  });
  const second = buildLiveObservation({
    apn: FIXTURE_APN,
    receivedAt: "2026-08-19T18:00:00.000Z",
    observedAt: SOURCE_OBSERVED_AT,
    payload,
  });
  if (!first.ok || !second.ok) {
    errors.push("fingerprint observations must build");
    return pass("T06", errors);
  }
  if (first.observation.payloadFingerprint !== fp1) errors.push("observation fingerprint mismatch");
  if (first.observation.dedupKey !== second.observation.dedupKey) {
    errors.push("changing receivedAt alone must not change dedup identity");
  }
  if (first.observation.signalId !== first.observation.dedupKey) errors.push("signalId must equal dedupKey");
  if (first.observation.candidateId !== first.observation.dedupKey) {
    errors.push("candidateId must equal dedupKey");
  }
  if (first.signal.signalId !== first.observation.dedupKey) errors.push("wrapped signalId must equal dedupKey");
  return pass("T06", errors);
}

function t07PipelineCardinalityReplay() {
  const errors = [];
  withHarness((h) => {
    const { transport, state } = countingTransport(() => observationStub());
    const first = processLiveObservation(
      { envelope: COMPLETE_ENVELOPE, request: { apn: FIXTURE_APN } },
      {
        transport,
        registry: h.registry,
        registryStore: h.store,
        dedupRegistry: h.dedupRegistry,
        ingestedAt: RECEIVED_AT,
      }
    );
    if (state.callCount !== 1) errors.push(`pipeline first-pass callCount=${state.callCount}`);
    if (first.disposition !== LIVE_DISCOVERY_DISPOSITION.CREATED) {
      errors.push(`expected CREATED got ${first.disposition} (${first.reason ?? ""})`);
    }
    const signals = first.signal ? 1 : 0;
    const candidates = first.candidate ? 1 : 0;
    const handoffs = first.handoffRecorded ? 1 : 0;
    if (signals > 1) errors.push("first pass Signal count must be <= 1");
    if (candidates > 1) errors.push("first pass Candidate count must be <= 1");
    if (handoffs > 1) errors.push("first pass Handoff count must be <= 1");
    if (signals !== 1) errors.push("first pass must produce one Signal");
    if (candidates !== 1) errors.push("first pass must produce one Candidate");
    if (handoffs !== 1) errors.push("first pass must record one Handoff");
    if (first.identity && first.identity.status === "MATCH") {
      errors.push("one-source Assessor fixture must not be forced to MATCH");
    }
    const expedienteCount = h.registry.listExpedientes().length;
    const dedupCount = h.dedupRegistry.listAll().length;
    if (expedienteCount !== 1) errors.push(`expected 1 expediente, got ${expedienteCount}`);
    if (dedupCount !== 1) errors.push(`expected 1 dedup record, got ${dedupCount}`);
    if (first.factoryKey) {
      const lineage = h.registry.getLineage(first.factoryKey);
      if (!hasDiscoveryHandoff(lineage?.elr)) errors.push("STOP at Discovery handoff: handoff missing");
    }

    const replay = processLiveObservation(
      { envelope: COMPLETE_ENVELOPE, request: { apn: FIXTURE_APN } },
      {
        transport,
        registry: h.registry,
        registryStore: h.store,
        dedupRegistry: h.dedupRegistry,
        ingestedAt: "2026-08-19T13:00:00.000Z",
      }
    );
    if (replay.disposition !== LIVE_DISCOVERY_DISPOSITION.DUPLICATE) {
      errors.push(`replay expected DUPLICATE got ${replay.disposition}`);
    }
    if (replay.dedupKey !== first.dedupKey) errors.push("replay dedupKey must match");
    if (h.registry.listExpedientes().length !== expedienteCount) {
      errors.push("replay must add 0 Candidate/expediente");
    }
    if (h.dedupRegistry.listAll().length !== dedupCount) {
      errors.push("replay must not add a second dedup identity");
    }
    const replayHandoffs = first.factoryKey
      ? (h.registry.getLineage(first.factoryKey)?.elr?.decision_handoffs ?? []).filter(
          (item) => item.kind === "DISCOVERY_HANDOFF_CB13"
        ).length
      : 0;
    if (replayHandoffs !== 1) errors.push("replay must add 0 Handoff");
  });
  return pass("T07", errors);
}

function t08AuthorityWall() {
  const errors = [];
  const flags = [
    ["isResearchAction", LIVE_OBSERVATION_AUTHORITY.isResearchAction],
    ["isEvidence", LIVE_OBSERVATION_AUTHORITY.isEvidence],
    ["isFact", LIVE_OBSERVATION_AUTHORITY.isFact],
    ["isOpportunity", LIVE_OBSERVATION_AUTHORITY.isOpportunity],
    ["isProduct", LIVE_OBSERVATION_AUTHORITY.isProduct],
  ];
  for (const [name, value] of flags) {
    if (value !== false) errors.push(`LIVE observation ${name} must be false`);
  }
  if (LIVE_SIGNAL_AUTHORITY.isEvidence !== false) errors.push("LIVE signal isEvidence must be false");
  if (LIVE_SIGNAL_AUTHORITY.isFact !== false) errors.push("LIVE signal isFact must be false");
  if (LIVE_SIGNAL_AUTHORITY.isOpportunity !== false) errors.push("LIVE signal isOpportunity must be false");
  if (LIVE_SIGNAL_AUTHORITY.isProduct !== false) errors.push("LIVE signal isProduct must be false");
  if (LIVE_SIGNAL_AUTHORITY.isResearchAction !== false) {
    errors.push("LIVE signal isResearchAction must be false");
  }

  withHarness((h) => {
    const { transport } = countingTransport(() => observationStub());
    const result = processLiveObservation(
      { envelope: COMPLETE_ENVELOPE },
      {
        transport,
        registry: h.registry,
        registryStore: h.store,
        dedupRegistry: h.dedupRegistry,
        ingestedAt: RECEIVED_AT,
      }
    );
    if (result.observation?.authority?.isFact === true) {
      errors.push("canonical adapter output must not become Fact authority");
    }
    if (result.observation?.authority?.isEvidence === true) {
      errors.push("LIVE observation must not be Evidence");
    }
    if (result.research || result.opportunity || result.publication || result.delivery) {
      errors.push("pipeline must not emit research/opportunity/publication/delivery");
    }
  });
  return pass("T08", errors);
}

function t09ClientBindingAndBounds() {
  const errors = [];
  if (MARICOPA_ASSESSOR_ORGANISM_ID !== "ORG-ASR-MC") errors.push("organism must be ORG-ASR-MC");
  if (MARICOPA_ASSESSOR_FAMILY_ID !== "REGISTRAL_ASSESSOR") errors.push("family must be REGISTRAL_ASSESSOR");
  if (MARICOPA_ASSESSOR_HOST !== "mcassessor.maricopa.gov") errors.push("host allowlist mismatch");
  if (MARICOPA_ASSESSOR_METHOD !== "GET") errors.push("method must be GET");
  if (!(P1C_IMPLEMENTATION_BOUNDS.timeoutMs > 0)) errors.push("timeout bound must be finite positive");
  if (!(P1C_IMPLEMENTATION_BOUNDS.maxResponseBytes > 0)) {
    errors.push("byte cap must be finite positive");
  }
  if (P1C_IMPLEMENTATION_BOUNDS.freezeSpecified !== false) {
    errors.push("implementation bounds must not be represented as freeze-defined numeric values");
  }

  const { transport, state } = countingTransport(() => jsonOkBody());
  const result = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport }
  );
  if (result.ok !== true) errors.push(`binding request failed: ${result.reason}`);
  if (state.callCount !== 1) errors.push("client must issue one request-equivalent maximum");
  const request = state.requests[0];
  if (!request) {
    errors.push("injected transport received no request");
    return pass("T09", errors);
  }
  if (request.host !== MARICOPA_ASSESSOR_HOST) errors.push("request host must stay on allowlist");
  if (request.method !== "GET") errors.push("request method must be GET");
  if (request.path !== `/parcel/${FIXTURE_APN}`) errors.push(`path shape mismatch: ${request.path}`);
  if (request.url !== `https://${MARICOPA_ASSESSOR_HOST}/parcel/${FIXTURE_APN}`) {
    errors.push(`url mismatch: ${request.url}`);
  }
  if (String(request.url).includes("?")) errors.push("no query expansion");
  if (request.retryCount !== 0) errors.push("constructed retryCount must be 0");
  if (result.retryCount !== 0) errors.push("accepted retryCount must be 0");
  if (request.redirect !== "manual") errors.push("redirect policy must be manual");
  if (result.organismId !== "ORG-ASR-MC") errors.push("client organismId mismatch");
  if (result.familyId !== "REGISTRAL_ASSESSOR") errors.push("client familyId mismatch");
  return pass("T09", errors);
}

function t10ClientFailClosedMatrix() {
  const errors = [];
  const cases = [
    ["content_type", { status: 200, contentType: "text/plain", body: "{}" }],
    ["malformed_json", { status: 200, contentType: "application/json", body: "{not-json" }],
    [
      "oversized",
      {
        status: 200,
        contentType: "application/json",
        body: `{"x":"${"a".repeat(P1C_IMPLEMENTATION_BOUNDS.maxResponseBytes)}}`,
      },
    ],
    ["status_401", { status: 401, contentType: "application/json", body: "{}" }],
    ["status_403", { status: 403, contentType: "application/json", body: "{}" }],
    ["status_429", { status: 429, contentType: "application/json", body: "{}" }],
    ["non_2xx", { status: 500, contentType: "application/json", body: "{}" }],
    ["redirect", { status: 302, redirected: true, contentType: "application/json", body: "{}" }],
    ["timeout", { timeout: true }],
    ["timeout-abort", { aborted: true }],
    ["transport_exception", { error: new Error("injected") }],
  ];

  for (const [expected, raw] of cases) {
    const { transport, state } = countingTransport(() => raw);
    const result = fetchMaricopaAssessorParcel(
      { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
      { transport }
    );
    if (result.ok !== false) errors.push(`${expected}: must fail closed`);
    if (result.reason !== expected && !(expected === "timeout-abort" && result.reason === "timeout")) {
      errors.push(`${expected}: got reason=${result.reason}`);
    }
    if (result.retryCount !== 0) errors.push(`${expected}: retryCount must remain 0`);
    if (result.receivedAt !== null) errors.push(`${expected}: must not fabricate accepted receivedAt`);
    if (state.callCount !== 1) errors.push(`${expected}: expected one injected call`);
  }

  const { transport, state } = countingTransport(() => {
    throw new Error("boom");
  });
  const thrown = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport }
  );
  if (thrown.ok !== false || thrown.reason !== "transport_exception") {
    errors.push(`thrown transport: expected transport_exception got ${thrown.reason}`);
  }
  if (thrown.retryCount !== 0) errors.push("thrown transport must not retry");
  if (state.callCount !== 1) errors.push("thrown transport callCount mismatch");

  const { transport: okType } = countingTransport(() => ({
    status: 200,
    contentType: "application/json; charset=utf-8",
    body: JSON.stringify({ parcel: true }),
  }));
  const accepted = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport: okType }
  );
  if (accepted.ok !== true) errors.push("JSON content-type must be accepted when otherwise valid");
  return pass("T10", errors);
}

function t11ClientTemporalBoundary() {
  const errors = [];
  const accepted = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport: () => jsonOkBody({ n: 1 }) }
  );
  if (accepted.ok !== true) errors.push(`accepted client failed: ${accepted.reason}`);
  if (typeof accepted.receivedAt !== "string" || !accepted.receivedAt.includes("T")) {
    errors.push("accepted 2xx must receive valid receivedAt");
  }
  if ("observedAt" in accepted) errors.push("client must not fabricate observedAt");

  const failed = fetchMaricopaAssessorParcel(
    { envelope: COMPLETE_ENVELOPE, apn: FIXTURE_APN },
    { transport: () => ({ status: 401, contentType: "application/json", body: "{}" }) }
  );
  if (failed.receivedAt !== null) errors.push("failed client must not fabricate accepted receivedAt");

  const adapted = adaptMaricopaAssessorLiveResponse(accepted);
  if (adapted.observedAt !== null) errors.push("adapter must not claim observedAt");
  if (adapted.observedAt === adapted.receivedAt && adapted.receivedAt != null) {
    errors.push("adapter must not substitute receivedAt for observedAt");
  }
  return pass("T11", errors);
}

function t12AdapterFieldMapWall() {
  const errors = [];
  if (ASSESSOR_LIVE_FIELD_MAP_UNCONFIRMED !== "assessor_live_field_map_unconfirmed") {
    errors.push("exact refusal string mismatch");
  }

  const recorded = loadRecordedAssessorPayload();
  const clientShaped = {
    ok: true,
    body: recorded,
    receivedAt: RECEIVED_AT,
  };
  const adapted = adaptMaricopaAssessorLiveResponse(clientShaped);
  if (adapted.ok !== false) errors.push("adapter must refuse unconfirmed LIVE map");
  if (adapted.reason !== "assessor_live_field_map_unconfirmed") {
    errors.push(`adapter reason mismatch: ${adapted.reason}`);
  }
  if (adapted.payload !== null) errors.push("payload must remain null/unclaimed");
  if (adapted.observedAt !== null) errors.push("observedAt must remain unclaimed/null");
  if (adapted.payloadSchemaId !== "maricopa.assessor.payload.v1") {
    errors.push("payloadSchemaId contract mismatch");
  }
  if (adapted.targetSchemaId !== SCHEMA_ASR_MC_V1) errors.push("SCHEMA_ASR_MC_V1 contract changed");
  if (SCHEMA_ASR_MC_V1 !== "maricopa.assessor.payload.v1") errors.push("existing schema id changed");

  const schemaHook = validateMappedAssessorLivePayload(recorded);
  if (schemaHook.ok !== true) errors.push("schema hook must remain available for future confirmed mapping");
  const directSchema = validatePayloadAgainstSchema(SCHEMA_ASR_MC_V1, recorded);
  if (directSchema.ok !== true) errors.push("validatePayloadAgainstSchema contract must remain available");
  if (adapted.ok === true) errors.push("unconfirmed response must not claim schema-valid LIVE payload");

  const adapterSrc = fs.readFileSync(
    path.join(__dirname, "discovery/maricopaAssessorLiveResponseAdapter.js"),
    "utf8"
  );
  if (adapterSrc.includes("situsAddress") || adapterSrc.includes("parcelId") || adapterSrc.includes("landUseCode")) {
    errors.push("adapter must not speculatively map recorded-pack field names");
  }
  if (adapterSrc.includes("heuristic") && /map\s*\(.*heuristic/i.test(adapterSrc)) {
    errors.push("adapter must not implement heuristic identity mapping");
  }
  return pass("T12", errors);
}

function t13SecretsAndStaticAudit() {
  const errors = [];
  const files = readP1Sources();
  const production = files.filter((f) => f.rel !== "validateSp11LiveDiscovery.js");
  const productionJoined = production.map((f) => f.source).join("\n");
  const joined = files.map((f) => f.source).join("\n");

  if (/from\s+["'][^"']*cb13[^"']*["']/.test(joined)) {
    errors.push("SP11-P1 runtime must not import cb13 / SP09");
  }
  if (/from\s+["']node:https?["']/.test(joined) || /from\s+["']node:http["']/.test(joined)) {
    errors.push("SP11-P1 runtime must not import node:http/https");
  }
  if (/globalThis\.fetch\b/.test(productionJoined)) {
    errors.push("P1-A/B/C must not reference globalThis.fetch");
  }
  if (/from\s+["']puppeteer["']|from\s+["']playwright["']|from\s+["']cheerio["']/.test(joined)) {
    errors.push("browser/scraping imports are forbidden");
  }
  if (/sk_live_[A-Za-z0-9]+/.test(joined) || /sk_test_[A-Za-z0-9]+/.test(joined)) {
    errors.push("hardcoded secret material is forbidden");
  }
  if (/Authorization["']?\s*:\s*["']Bearer\s+[A-Za-z0-9._-]+/.test(joined)) {
    errors.push("hardcoded Authorization credential is forbidden");
  }
  if (/process\.env\.[A-Z0-9_]*TOKEN/.test(joined) || /process\.env\.[A-Z0-9_]*SECRET/.test(joined)) {
    errors.push("committed credential env assumption is forbidden");
  }
  if (/MARICOPA_ASSESSOR_ORGANISM_ID\s*=\s*["']ORG-GIS-MC["']/.test(joined)) {
    errors.push("ArcGIS must not substitute for ORG-ASR-MC");
  }

  const clientSrc = files.find((f) => f.rel.endsWith("maricopaAssessorLiveClient.js")).source;
  if (clientSrc.includes("setInterval") || clientSrc.includes("worker_threads")) {
    errors.push("client must remain serial/single-shot");
  }
  if (/\bretryCount\s*=\s*[1-9]/.test(clientSrc)) errors.push("client must not retry after failure");
  if (clientSrc.includes("globalThis.fetch") || /[^A-Za-z_.]fetch\s*\(/.test(clientSrc)) {
    errors.push("client must not call fetch(");
  }

  return pass("T13", errors);
}

function t14NetworkGuarantee() {
  const errors = [];
  const clientSrc = fs.readFileSync(
    path.join(__dirname, "discovery/maricopaAssessorLiveClient.js"),
    "utf8"
  );
  if (/from\s+["']node:https?["']/.test(clientSrc)) errors.push("client has node:http(s) path");
  if (clientSrc.includes("globalThis.fetch")) errors.push("client has globalThis.fetch path");
  if (!clientSrc.includes("typeof injected !== \"function\"") && !clientSrc.includes("typeof injected !== 'function'")) {
    errors.push("client must fail closed when inject is absent");
  }

  const completeNoInject = fetchMaricopaAssessorParcel({
    envelope: COMPLETE_ENVELOPE,
    apn: FIXTURE_APN,
  });
  if (completeNoInject.ok !== false) {
    errors.push("complete authorization flags alone must not perform HTTP");
  }

  return pass("T14", errors);
}

function t15Sp10Regression() {
  const errors = [];
  const sp10 = runSp10RecordedDiscoveryValidation();
  if (!sp10.passed) {
    errors.push(`SP10 regression failed: ${(sp10.results ?? []).filter((r) => !r.passed).map((r) => r.id).join(",")}`);
  }
  if (sp10.acceptanceToken !== "SP10_RECORDED_DISCOVERY_ACCEPTANCE_PASS") {
    errors.push("SP10_RECORDED_DISCOVERY_ACCEPTANCE_PASS missing");
  }
  return pass("T15", errors);
}

function t16IndexExports() {
  const errors = [];
  const indexSrc = fs.readFileSync(path.join(__dirname, "index.js"), "utf8");
  if (!indexSrc.includes("processLiveObservation")) {
    errors.push("index.js must export processLiveObservation");
  }
  if (!indexSrc.includes("runSp11LiveDiscoveryValidation")) {
    errors.push("index.js must export runSp11LiveDiscoveryValidation");
  }
  if (!indexSrc.includes("processRecordedObservation")) {
    errors.push("index.js must preserve processRecordedObservation");
  }
  if (!indexSrc.includes("runSp10RecordedDiscoveryValidation")) {
    errors.push("index.js must preserve runSp10RecordedDiscoveryValidation");
  }
  if (!indexSrc.includes('export { runSp11LiveDiscoveryValidation } from "./validateSp11LiveDiscovery.js"')) {
    errors.push("index.js SP11 validator export path mismatch");
  }
  if (!indexSrc.includes('export { processLiveObservation } from "./discovery/liveDiscoveryPipeline.js"')) {
    errors.push("index.js processLiveObservation export path mismatch");
  }
  return pass("T16", errors);
}

export function runSp11LiveDiscoveryValidation() {
  const originalFetch = globalThis.fetch;
  let realLiveRequestCount = 0;
  globalThis.fetch = (...args) => {
    realLiveRequestCount += 1;
    throw new Error("SP11-P1-D forbidden real fetch");
  };

  let results;
  try {
    results = [
      t01DefaultEnvelope(),
      t02IncompleteWalls(),
      t03CompleteWallInjectedOnly(),
      t04Identity(),
      t05Temporal(),
      t06FingerprintDedup(),
      t07PipelineCardinalityReplay(),
      t08AuthorityWall(),
      t09ClientBindingAndBounds(),
      t10ClientFailClosedMatrix(),
      t11ClientTemporalBoundary(),
      t12AdapterFieldMapWall(),
      t13SecretsAndStaticAudit(),
      t14NetworkGuarantee(),
      t15Sp10Regression(),
      t16IndexExports(),
    ];
  } finally {
    if (originalFetch === undefined) {
      delete globalThis.fetch;
    } else {
      globalThis.fetch = originalFetch;
    }
  }

  if (realLiveRequestCount !== 0) {
    results.push(pass("T-LIVE-HTTP", [`REAL LIVE REQUEST COUNT=${realLiveRequestCount}`]));
  }

  const passed = results.every((r) => r.passed);
  return {
    program: "SP11-P1",
    slice: "P1-D",
    passed,
    realLiveRequestCount,
    liveHttp: LIVE_HTTP_FORBIDDEN,
    liveExecutionAuthorized: false,
    results,
  };
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("validateSp11LiveDiscovery.js") ||
    process.argv[1].includes("validateSp11LiveDiscovery"));

if (isMain) {
  const result = runSp11LiveDiscoveryValidation();
  console.log("=== SP11-P1 LIVE Discovery Validation ===\n");
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) {
    console.error("\nSP11-P1-D validation FAILED");
    process.exit(1);
  }
  console.log(`\nSP11-P1-D validation PASSED — realLiveRequestCount=${result.realLiveRequestCount}`);
  process.exit(0);
}
