/**
 * CB-12 — Mission Ledger (EVF-04) — swarm_id linked to ELR
 */

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} mission
 * @param {{ actor: string }} context
 */
export function recordSwarmMissionOpen(registry, factoryKey, mission, context) {
  return registry.registerElrAct(
    factoryKey,
    "swarm_mission_refs",
    {
      kind: "EVF-04_SWARM_MISSION_OPEN",
      evf: "EVF-04",
      swarmId: mission.swarmId,
      swarmPattern: mission.swarmPattern,
      loopParent: mission.loopParent,
      phase: "SWA-IN",
      mandate: {
        objectiveEpistemic: mission.objectiveEpistemic,
        authorizedMotors: mission.authorizedMotors,
        authorizedCaps: mission.authorizedCaps,
        strategiesExhausted: mission.strategiesExhausted,
      },
      derivationRef: mission.derivationRef,
      constitutionalPhase: "CB-12",
    },
    context
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} swaOut
 * @param {{ actor: string }} context
 */
export function recordSwarmMissionClose(registry, factoryKey, swaOut, outcome, context) {
  return registry.registerElrAct(
    factoryKey,
    "swarm_mission_refs",
    {
      kind: "EVF-04_SWARM_MISSION_CLOSE",
      evf: "EVF-04",
      swarmId: swaOut.swarmId,
      swarmPattern: swaOut.swarmPattern,
      loopParent: swaOut.loopParent,
      phase: "SWA-OUT",
      outcomeCode: outcome.outcomeCode,
      consensusScore: swaOut.consensusScore,
      uncertaintyScore: swaOut.uncertaintyScore,
      csLevel: swaOut.csLevel,
      usLevel: swaOut.usLevel,
      swarmDissolved: true,
      constitutionalPhase: "CB-12",
    },
    context
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {object} loopReturn
 * @param {{ actor: string }} context
 */
export function recordSwarmLoopReturn(registry, factoryKey, loopReturn, context) {
  return registry.registerElrAct(
    factoryKey,
    "loop_ledger_refs",
    {
      kind: "SWARM_LOOP_RETURN",
      swarmId: loopReturn.swarmId,
      loopParent: loopReturn.loopParent,
      outcomeCode: loopReturn.outcomeCode,
      recommendationLoop: loopReturn.recommendationLoop,
      swarmDissolved: true,
      constitutionalPhase: "CB-12",
    },
    context
  );
}

/**
 * @param {import('../cb01/factoryRegistry.js').FactoryRegistry} registry
 * @param {string} factoryKey
 * @param {string[]} registeredSwmIds
 */
export function recordSwarmCoordinatorRegistryComplete(registry, factoryKey, registeredSwmIds) {
  return registry.registerElrAct(
    factoryKey,
    "swarm_mission_refs",
    {
      kind: "SWARM_COORDINATOR_REGISTRY_COMPLETE",
      swmCount: registeredSwmIds.length,
      swmIds: registeredSwmIds,
      evf: "EVF-04",
      constitutionalPhase: "CB-12",
    },
    { actor: "SWM-SYN-01" }
  );
}
