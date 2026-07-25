/**
 * CB-16 — Decision Handoff Service
 *
 * Receives the Orchestration Bus (CB-15) expediente, verifies readiness,
 * builds one Decision Package, records ELR handoff, freezes Factory thesis,
 * and delivers via the Decision Handoff Interface.
 *
 * Does NOT: classify Deal/Premium/Diamond, execute IA/motors,
 * or modify Foundation / Evidence / Runtime.
 */

import { isPhaseApproved } from "../cb00/constructionGovernance.js";
import { FactoryRegistry } from "../cb01/factoryRegistry.js";
import { EvidenceService } from "../cb06/evidenceService.js";
import { SUFFICIENCY_STATUS } from "../cb06/sufficiencyGate.js";
import { DECISION_HANDOFF_ACTOR, DECISION_PACKAGE_VERSION } from "./decisionPackageSchema.js";
import { buildDecisionPackage } from "./decisionPackageBuilder.js";
import { evaluateDecisionReadiness } from "./decisionReadiness.js";
import {
  assertHandoffBoundary,
  createDecisionHandoffPort,
  deliverDecisionPackage,
} from "./decisionHandoffInterface.js";
import {
  collectDecisionHandoffLedger,
  recordDecisionHandoff,
  recordDecisionPackageBuilt,
  recordFactoryFreeze,
  recordHandoffComplete,
  recordPackageDelivered,
} from "./decisionLedger.js";

export class DecisionHandoffService {
  /**
   * @param {{
   *   registry?: FactoryRegistry,
   *   evidenceService?: EvidenceService|null,
   * }} [deps]
   */
  constructor(deps = {}) {
    if (!isPhaseApproved("CB-15")) {
      throw new Error(
        "[CB-16 Decision Handoff] CB-15 must be APPROVED before Decision Handoff Interface"
      );
    }
    this.registry = deps.registry ?? new FactoryRegistry();
    this.evidenceService = deps.evidenceService ?? null;
    this.port = createDecisionHandoffPort();
  }

  /**
   * Resolve readiness hints from Evidence Service + optional orchestration payload.
   * @param {string} factoryKey
   * @param {{
   *   maturity?: { maturity_score?: number },
   *   elrSnapshot?: object,
   *   maturity_score?: number,
   * }} [options]
   */
  resolveHints(factoryKey, options = {}) {
    const sufficiency = this.evidenceService?.getSufficiency?.(factoryKey) ?? null;
    return {
      evidenceRef: this.registry.getExpediente(factoryKey)?.elr?.evidence_registry_ref ?? null,
      sufficiencyStatus: sufficiency?.status ?? null,
      maturity_score: options.maturity?.maturity_score ?? options.maturity_score,
      elrSnapshot: options.elrSnapshot ?? null,
    };
  }

  /**
   * Verify expediente readiness without building or delivering.
   * @param {string} factoryKey
   * @param {object} [options]
   */
  verifyReadiness(factoryKey, options = {}) {
    assertHandoffBoundary("verify_readiness");
    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-16 Decision Handoff] Expediente not found: ${factoryKey}`);
    }
    return evaluateDecisionReadiness(record, this.resolveHints(factoryKey, options));
  }

  /**
   * Full handoff pipeline: verify → build → ELR → ST-DEC → freeze → deliver.
   *
   * @param {string} factoryKey — expediente already prepared by Orchestration Bus (CB-15)
   * @param {{
   *   maturity?: { maturity_score?: number },
   *   elrSnapshot?: object,
   *   maturity_score?: number,
   *   transitionToDec?: boolean,
   *   recipient?: string,
   * }} [options]
   */
  prepareAndDeliver(factoryKey, options = {}) {
    assertHandoffBoundary("prepare_and_deliver", {
      accessTier: options.accessTier,
      pricing: options.pricing,
      dealClass: options.dealClass,
    });

    const record = this.registry.getExpediente(factoryKey);
    if (!record) {
      throw new Error(`[CB-16 Decision Handoff] Expediente not found: ${factoryKey}`);
    }

    if (record.state !== "ST-RDY") {
      throw new Error(
        `[CB-16 Decision Handoff] Expected ST-RDY before handoff, got ${record.state}`
      );
    }

    const hints = this.resolveHints(factoryKey, options);
    const built = buildDecisionPackage(record, hints);
    if (!built.ok) {
      throw new Error(
        `[CB-16 Decision Handoff] Decision Package build failed: ${built.errors.join("; ")}`
      );
    }

    const decisionPackage = built.package;

    recordDecisionPackageBuilt(this.registry, factoryKey, {
      packageVersion: DECISION_PACKAGE_VERSION,
      maturity_score: decisionPackage.scores.maturity_score,
      gatePassCount: decisionPackage.readiness.passCount,
    });

    const fromState = record.state;
    const shouldTransition = options.transitionToDec !== false;
    let toState = fromState;

    if (shouldTransition) {
      this.registry.transitionState(factoryKey, "ST-DEC", {
        actor: DECISION_HANDOFF_ACTOR,
        reason: "CB-16 Decision Handoff — Factory frontier ST-RDY → ST-DEC",
      });
      toState = "ST-DEC";
    }

    recordDecisionHandoff(this.registry, factoryKey, {
      fromState,
      toState,
      packageId: `${factoryKey}@${DECISION_PACKAGE_VERSION}`,
    });

    recordFactoryFreeze(this.registry, factoryKey, {
      reason: "Post-handoff freeze — Factory does not modify Decision thesis",
    });

    const delivery = deliverDecisionPackage(decisionPackage, {
      recipient: options.recipient ?? "DecisionEngine",
    });

    recordPackageDelivered(this.registry, factoryKey, {
      deliveryId: delivery.deliveryId,
      recipient: delivery.recipient,
    });

    recordHandoffComplete(this.registry, factoryKey, {
      factory_key: factoryKey,
      fromState,
      toState,
      deliveryId: delivery.deliveryId,
      maturity_score: decisionPackage.scores.maturity_score,
      gatesPass: decisionPackage.readiness.allPass,
      frozen: true,
    });

    const finalRecord = this.registry.getExpediente(factoryKey);
    const ledger = collectDecisionHandoffLedger(finalRecord.elr);

    return {
      factoryKey,
      state: finalRecord.state,
      fromState,
      toState,
      decisionPackage,
      delivery,
      readiness: built.readiness,
      ledger,
      boundary: {
        factoryOnly: true,
        decisionSeparated: true,
        decides: false,
        frozen: ledger.frozen,
        sufficiencyHint: hints.sufficiencyStatus === SUFFICIENCY_STATUS.PASS || hints.sufficiencyStatus == null,
      },
      port: this.port.interfaceId,
    };
  }

  /**
   * Accept an Orchestration Bus (CB-15) result and run handoff.
   * @param {{ factoryKey: string, maturity?: object, elrSnapshot?: object }} orchestrationResult
   * @param {object} [options]
   */
  handoffFromOrchestration(orchestrationResult, options = {}) {
    if (!orchestrationResult?.factoryKey) {
      throw new Error("[CB-16 Decision Handoff] orchestrationResult.factoryKey required");
    }
    return this.prepareAndDeliver(orchestrationResult.factoryKey, {
      maturity: orchestrationResult.maturity,
      elrSnapshot: orchestrationResult.elrSnapshot,
      ...options,
    });
  }

  /**
   * @param {string} factoryKey
   */
  getHandoffLineage(factoryKey) {
    const record = this.registry.getExpediente(factoryKey);
    const ledger = collectDecisionHandoffLedger(record?.elr);
    const complete = (record?.elr?.loop_ledger_refs ?? []).filter((r) =>
      String(r.kind ?? "").startsWith("DHI_")
    );
    return {
      factory_key: factoryKey,
      state: record?.state,
      ledger,
      events: complete,
      frozen: ledger.frozen,
    };
  }
}
