/**
 * CB-07 — Legitimacy motor scaffolding handlers
 */

import { stubBusinessTrustMeta } from "../cb05/decisionTrustBoundary.js";
import { buildLegitimacyFixtureBundle } from "./legitimacySourceFixtures.js";
import { C1_BLOCKER_CODES } from "./legitimacyCatalog.js";

/**
 * @param {object} ctx
 * @param {string} mpiDomain
 * @param {object} delta
 * @param {object[]} sourceRefs
 */
function record(ctx, mpiDomain, delta, sourceRefs) {
  ctx.knowledgeStore?.recordDomainProduction(ctx.factoryKey, mpiDomain, { delta, sourceRefs });
}

/**
 * PS05-01 marking-only — stub values remain; Decision trust blocked.
 * @param {{ outputs?: object, knowledgeDelta?: object }} result
 */
function withStubTrust(result) {
  const trust = stubBusinessTrustMeta();
  return {
    ...result,
    outputs: { ...(result.outputs ?? {}), ...trust },
    knowledgeDelta: { ...(result.knowledgeDelta ?? {}), ...trust },
  };
}

export const LEGITIMACY_MOTOR_HANDLERS = {
  "MOT-REG-01": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    record(ctx, "04", { motorId: "MOT-REG-01", permits: 2, mpiDomain: "04" }, [fixtures.recorder]);
    return withStubTrust({ outputs: { permitCount: 2 }, knowledgeDelta: { domain: "04", permits: "stub" } });
  },
  "MOT-REG-02": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    record(ctx, "04", { motorId: "MOT-REG-02", zoning: "R-1", mpiDomain: "04" }, [fixtures.recorder]);
    return withStubTrust({ outputs: { zoning: "R-1" }, knowledgeDelta: { domain: "04", zoning: "stub" } });
  },
  "MOT-REG-03": async (ctx) => {
    record(ctx, "04", { motorId: "MOT-REG-03", far: 0.45, mpiDomain: "04" }, []);
    return withStubTrust({ outputs: { far: 0.45 }, knowledgeDelta: { domain: "04", envelope: "stub" } });
  },
  "MOT-LEG-01": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const titleCloud = ctx.inputs?.simulateTitleCloud === true;
    const marketable = !titleCloud;
    const juniorUnresolved = ctx.inputs?.simulateJuniorLien === true;
    record(
      ctx,
      "07",
      { motorId: "MOT-LEG-01", marketable, titleCloud, mpiDomain: "07" },
      [fixtures.titleCommitment, fixtures.courtIndex]
    );
    record(
      ctx,
      "09",
      {
        motorId: "MOT-LEG-01",
        lienStub: true,
        lienCount: 2,
        juniorUnresolved,
        mpiDomain: "09",
        note: "Lien encumbrance stub — MOT-LIEN-01 deferred (CB-00 actor pattern)",
      },
      [fixtures.recorder]
    );
    if (titleCloud) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.TITLE_CLOUD,
        severity: "C1",
        motorId: "MOT-LEG-01",
      });
    }
    if (juniorUnresolved) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.LIEN_JUNIOR_UNRESOLVED,
        severity: "C1",
        motorId: "MOT-LEG-01",
      });
    }
    return withStubTrust({
      outputs: { marketable, titleCloud },
      knowledgeDelta: { domain: "07", marketability: marketable ? "clear" : "clouded" },
    });
  },
  "MOT-OWN-01": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const owner = ctx.inputs?.recordOwner ?? "Smith Family Trust";
    record(ctx, "08", { motorId: "MOT-OWN-01", owner, mpiDomain: "08" }, [fixtures.recorder]);
    return withStubTrust({ outputs: { recordOwner: owner }, knowledgeDelta: { domain: "08", owner: "stub" } });
  },
  "MOT-OWN-02": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const mismatch = ctx.inputs?.simulateOwnerMismatch === true;
    const verified = !mismatch;
    record(
      ctx,
      "08",
      { motorId: "MOT-OWN-02", verified, mismatch, mpiDomain: "08" },
      [fixtures.recorder, fixtures.titleCommitment]
    );
    if (mismatch) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.OWNER_MISMATCH,
        severity: "C1",
        motorId: "MOT-OWN-02",
      });
    }
    return withStubTrust({
      outputs: { verified, mismatch },
      knowledgeDelta: { domain: "08", ownerVerified: verified },
    });
  },
  "MOT-LIEN-01": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const juniorUnresolved = ctx.inputs?.simulateJuniorLien === true;
    record(
      ctx,
      "09",
      { motorId: "MOT-LIEN-01", lienCount: 2, juniorUnresolved, mpiDomain: "09" },
      [fixtures.recorder]
    );
    if (juniorUnresolved) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.LIEN_JUNIOR_UNRESOLVED,
        severity: "C1",
        motorId: "MOT-LIEN-01",
      });
    }
    return withStubTrust({
      outputs: { lienCount: 2, juniorUnresolved },
      knowledgeDelta: { domain: "09", liens: "stub" },
    });
  },
  "MOT-OCR-01": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const docGap = ctx.inputs?.simulateDocGap === true;
    record(
      ctx,
      "10",
      { motorId: "MOT-OCR-01", deedAcquired: !docGap, mpiDomain: "10" },
      [fixtures.recorder]
    );
    if (docGap) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.DOC_GAP_OBL,
        severity: "C1",
        motorId: "MOT-OCR-01",
      });
    }
    return withStubTrust({
      outputs: { deedAcquired: !docGap },
      knowledgeDelta: { domain: "10", corpus: docGap ? "gap" : "acquired" },
    });
  },
  "MOT-OCR-02": async (ctx) => {
    const fixtures = buildLegitimacyFixtureBundle(ctx.factoryKey);
    const authentic = ctx.inputs?.simulateAuthenticityFail !== true;
    record(
      ctx,
      "10",
      { motorId: "MOT-OCR-02", authentic, mpiDomain: "10" },
      [fixtures.titleCommitment]
    );
    if (!authentic) {
      ctx.knowledgeStore?.addBlocker(ctx.factoryKey, {
        code: C1_BLOCKER_CODES.AUTHENTICITY_FAIL,
        severity: "C1",
        motorId: "MOT-OCR-02",
      });
    }
    return withStubTrust({
      outputs: { authentic },
      knowledgeDelta: { domain: "10", authenticity: authentic ? "pass" : "fail" },
    });
  },
};

/**
 * @param {import('../cb04/motorRuntime.js').MotorRuntime} runtime
 * @param {import('./legitimacyKnowledgeStore.js').LegitimacyKnowledgeStore} knowledgeStore
 */
export function registerLegitimacyMotorHandlers(runtime, knowledgeStore) {
  for (const [motorId, handler] of Object.entries(LEGITIMACY_MOTOR_HANDLERS)) {
    runtime.registerHandler(motorId, async (ctx) =>
      handler({ ...ctx, knowledgeStore })
    );
  }
}
