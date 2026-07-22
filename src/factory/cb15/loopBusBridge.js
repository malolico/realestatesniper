/**
 * CB-15 — Loop bus bridge (run OLC loops on existing expediente without new foundation)
 */

import { OLC_LOOP_CATALOG } from "../cb11/loopEngineCatalog.js";
import { runIntegratedLoop } from "../cb11/integrationLoopRunners.js";
import {
  recordLoopLedger,
  recordLoopEngineRegistryComplete,
  recordOlcHandoff,
} from "../cb11/loopLedger.js";
import { coordinateFinalizers } from "../cb11/finalizerCoordinator.js";
import { buildOlcPipelineHandoffs } from "../cb11/loopEnginePipeline.js";
import { MOTOR_LOOP_SUPERVISION } from "../cb11/loopEngineCatalog.js";

const FOUNDATION_MOTOR_IDS = ["MOT-IDN-01", "MOT-LOC-01", "MOT-PHY-01", "MOT-FRS-01"];

/**
 * @param {import('../cb11/loopEngineService.js').LoopEngineService} loopEngine
 * @param {string} factoryKey
 */
export async function runOlcLoopsOnExisting(loopEngine, factoryKey) {
  const record = loopEngine.registry.getExpediente(factoryKey);
  const motorManifests = record?.elr?.motor_manifests ?? [];

  const foundationStub = {
    manifests: motorManifests.filter((m) => FOUNDATION_MOTOR_IDS.includes(m.motorId)),
    mpiCoverage: loopEngine.foundation.knowledgeStore.mpiCoverage(factoryKey),
    quality: { metrics: { identity_confidence: "C2" } },
    freshness: { sourceRefs: [] },
  };

  const legitimacy = await loopEngine.legitimacy.bootstrapLegitimacy(factoryKey);
  const distress = await loopEngine.distress.bootstrapDistress(factoryKey);
  const economy = await loopEngine.economy.bootstrapEconomy(factoryKey);
  const environment = await loopEngine.environment.bootstrapEnvironment(factoryKey);

  const snapshot = loopEngine.buildExecutionSnapshot(factoryKey, {
    foundation: foundationStub,
    legitimacy,
    distress,
    economy,
    environment,
  });

  const loopResults = [];
  for (const entry of OLC_LOOP_CATALOG) {
    loopEngine.loopLock.acquire(factoryKey, entry.id, "OrchestrationBus");
    try {
      const result = runIntegratedLoop(entry.id, {
        snapshot,
        signals: { layerHandoff: true, orchestrationBus: true },
      });
      recordLoopLedger(loopEngine.registry, factoryKey, result);
      loopResults.push(result);
    } finally {
      loopEngine.loopLock.release(factoryKey, entry.id);
    }
  }

  recordLoopEngineRegistryComplete(
    loopEngine.registry,
    factoryKey,
    loopResults.map((r) => r.loopId)
  );

  const coordination = coordinateFinalizers(loopResults);
  const pipeline = buildOlcPipelineHandoffs({ loopResults });
  for (const handoff of pipeline.handoffs) {
    recordOlcHandoff(loopEngine.registry, factoryKey, handoff);
  }

  return {
    factoryKey,
    loopResults,
    loopCount: loopResults.length,
    dominantFinalizer: coordination.dominant,
    motorSupervisionCount: Object.keys(MOTOR_LOOP_SUPERVISION).length,
    mode: "existing_expediente",
  };
}
