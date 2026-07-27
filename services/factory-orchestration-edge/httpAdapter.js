/**
 * P-INT-01 Slice B3 — HTTP adapter for Orchestration Command Edge (staging).
 */

import http from "node:http";
import { OrchestrationCommandCore } from "./commandCore.js";
import {
  StagingAuthzAdapter,
  StagingBearerAuthnAdapter,
  createDefaultStagingSessions,
} from "./stagingAuth.js";
import { InMemoryJobStore } from "./jobStore.js";
import { JobRunnerCore } from "./workerRunner.js";
import {
  FACTORY_ORCHESTRATION_API_VERSION,
  FACTORY_ORCHESTRATION_ERROR_CODES,
} from "./contract.js";

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

/**
 * @param {OrchestrationCommandCore} core
 */
export function createOrchestrationCommandHandler(core) {
  return async function handleNodeRequest(req, res) {
    try {
      const bodyText = await collectBody(req);
      const response = await core.handle({
        method: req.method,
        url: req.url,
        headers: req.headers,
        bodyText,
      });
      res.statusCode = response.statusCode;
      for (const [key, value] of Object.entries(response.headers)) {
        res.setHeader(key, value);
      }
      res.end(response.body);
    } catch {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify(
          {
            schemaVersion: FACTORY_ORCHESTRATION_API_VERSION,
            error: {
              code: FACTORY_ORCHESTRATION_ERROR_CODES.INTERNAL_ERROR,
              message: "Unhandled transport failure",
              correlationId: "transport-failure",
            },
          },
          null,
          2
        )
      );
    }
  };
}

/**
 * Build a ready-to-use staging command core (memory store).
 * @param {object} [options]
 */
export function createStagingOrchestrationCommandCore(options = {}) {
  const store = options.store ?? new InMemoryJobStore();
  const runner = options.runner ?? new JobRunnerCore(store, options.runnerOptions);
  const authn =
    options.authn ??
    new StagingBearerAuthnAdapter({
      sessions: options.sessions ?? createDefaultStagingSessions(),
    });
  const authz = options.authz ?? new StagingAuthzAdapter();
  return new OrchestrationCommandCore({
    runner,
    authn,
    authz,
    clock: options.clock,
  });
}

/**
 * @param {object} [options]
 */
export function startOrchestrationCommandHttpServer(options = {}) {
  const core = options.core ?? createStagingOrchestrationCommandCore(options);
  const handler = createOrchestrationCommandHandler(core);
  const server = http.createServer((req, res) => {
    void handler(req, res);
  });
  return { server, core };
}
