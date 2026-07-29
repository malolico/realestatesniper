/**
 * P-INT-01 Slice B3 — Orchestration Command Core (HTTP request → B2 runner).
 */

import { randomUUID } from "node:crypto";
import {
  FACTORY_ORCHESTRATION_CAPABILITIES,
  FACTORY_ORCHESTRATION_ERROR_CODES,
  FACTORY_ORCHESTRATION_HTTP_STATUS,
  FACTORY_ORCHESTRATION_ROUTE_SPECS,
  buildCommandErrorEnvelope,
  buildCommandSuccessEnvelope,
} from "./contract.js";
import { IDEMPOTENCY_HEADER_NAME } from "./idempotency.js";
import { sanitizeLineageSummary, sanitizeResultSummary } from "./validation.js";
import { sanitizeJobError } from "./sanitize.js";
import { toRfc3339 } from "./rfc3339.js";
import { jobOwnerMatchesPrincipal, resolveVerifiedActorId } from "./jobOwnership.js";

function headerGet(headers, name) {
  if (!headers) return undefined;
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) {
      return Array.isArray(v) ? v[0] : v;
    }
  }
  return undefined;
}

function jsonResponse(statusCode, bodyObj, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
    body: `${JSON.stringify(bodyObj, null, 2)}\n`,
  };
}

function publicJobView(job) {
  if (!job) return null;
  return {
    jobId: job.jobId,
    type: job.type,
    factoryKey: job.factoryKey,
    state: job.state,
    cancelRequested: Boolean(job.cancelRequested),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    resultSummary: job.resultSummary ? sanitizeResultSummary(job.resultSummary) : null,
    error: job.error
      ? { code: job.error.code, message: sanitizeJobError(job.error).message }
      : null,
  };
}

function matchRoute(method, pathname) {
  const jobsBase = "/v1/factory/orchestration/jobs";
  if (method === "POST" && pathname === jobsBase) {
    return { name: "submitJob", spec: FACTORY_ORCHESTRATION_ROUTE_SPECS.submitJob };
  }
  const cancelMatch = pathname.match(/^\/v1\/factory\/orchestration\/jobs\/([^/]+)\/cancel$/);
  if (method === "POST" && cancelMatch) {
    return {
      name: "cancelJob",
      spec: FACTORY_ORCHESTRATION_ROUTE_SPECS.cancelJob,
      jobId: decodeURIComponent(cancelMatch[1]),
    };
  }
  const lineageMatch = pathname.match(/^\/v1\/factory\/orchestration\/jobs\/([^/]+)\/lineage$/);
  if (method === "GET" && lineageMatch) {
    return {
      name: "getJobLineage",
      spec: FACTORY_ORCHESTRATION_ROUTE_SPECS.getJobLineage,
      jobId: decodeURIComponent(lineageMatch[1]),
    };
  }
  const getMatch = pathname.match(/^\/v1\/factory\/orchestration\/jobs\/([^/]+)$/);
  if (method === "GET" && getMatch) {
    return {
      name: "getJob",
      spec: FACTORY_ORCHESTRATION_ROUTE_SPECS.getJob,
      jobId: decodeURIComponent(getMatch[1]),
    };
  }
  return null;
}

export class OrchestrationCommandCore {
  /**
   * @param {object} options
   * @param {import('./workerRunner.js').JobRunnerCore} options.runner
   * @param {object} options.authn
   * @param {object} options.authz
   * @param {{ now: () => string }} [options.clock]
   */
  constructor(options) {
    this.runner = options.runner;
    this.authn = options.authn;
    this.authz = options.authz;
    this.clock = options.clock ?? { now: () => toRfc3339() };
  }

  /**
   * @param {{ method: string, url: string, headers: object, bodyText?: string }} request
   */
  async handle(request) {
    const correlationId =
      headerGet(request.headers, "x-correlation-id") || randomUUID();
    const method = String(request.method || "GET").toUpperCase();
    let pathname = "/";
    try {
      const u = new URL(request.url || "/", "http://orchestration.local");
      pathname = u.pathname;
      if ([...u.searchParams.keys()].length > 0) {
        return jsonResponse(
          FACTORY_ORCHESTRATION_HTTP_STATUS.BAD_REQUEST,
          buildCommandErrorEnvelope(
            FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
            "query parameters are not allowed",
            correlationId
          )
        );
      }
    } catch {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.BAD_REQUEST,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
          "invalid URL",
          correlationId
        )
      );
    }

    const route = matchRoute(method, pathname);
    if (!route) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
          "route not found",
          correlationId
        )
      );
    }

    const principal = this.authn.authenticate(request);
    if (!principal) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.UNAUTHORIZED,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.UNAUTHENTICATED,
          "authentication required",
          correlationId,
          route.spec.capability
        )
      );
    }

    const authz = this.authz.authorize(
      principal,
      route.spec.capability,
      route.spec.roles
    );
    if (!authz.allowed) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.FORBIDDEN,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.FORBIDDEN,
          "authorization denied",
          correlationId,
          route.spec.capability
        )
      );
    }

    try {
      if (route.name === "submitJob") {
        return this._submit(request, principal, correlationId);
      }
      if (route.name === "getJob") {
        return this._getJob(route.jobId, principal, correlationId, route.spec.capability);
      }
      if (route.name === "getJobLineage") {
        return this._getLineage(route.jobId, principal, correlationId, route.spec.capability);
      }
      if (route.name === "cancelJob") {
        return this._cancel(route.jobId, principal, correlationId, route.spec.capability);
      }
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
          "route not found",
          correlationId
        )
      );
    } catch (error) {
      const sanitized = sanitizeJobError(error);
      const status =
        sanitized.code === FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL
          ? FACTORY_ORCHESTRATION_HTTP_STATUS.BAD_REQUEST
          : sanitized.code === FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT
            ? FACTORY_ORCHESTRATION_HTTP_STATUS.CONFLICT
            : sanitized.code === FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND
              ? FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND
              : FACTORY_ORCHESTRATION_HTTP_STATUS.INTERNAL;
      return jsonResponse(
        status,
        buildCommandErrorEnvelope(sanitized.code, sanitized.message, correlationId)
      );
    }
  }

  _submit(request, principal, correlationId) {
    // HQ-05: persist only canonical verified actorId (exact AuthN identity, no trim/rewrite).
    const actorId = resolveVerifiedActorId(principal);
    if (!actorId) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.FORBIDDEN,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.FORBIDDEN,
          "authorization denied",
          correlationId,
          FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE
        )
      );
    }
    const idempotencyKey = headerGet(request.headers, IDEMPOTENCY_HEADER_NAME);
    let body = {};
    const text = request.bodyText ?? "";
    if (text.trim()) {
      try {
        body = JSON.parse(text);
      } catch {
        return jsonResponse(
          FACTORY_ORCHESTRATION_HTTP_STATUS.BAD_REQUEST,
          buildCommandErrorEnvelope(
            FACTORY_ORCHESTRATION_ERROR_CODES.VALIDATION_FAIL,
            "invalid JSON body",
            correlationId,
            FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE
          )
        );
      }
    }
    const { job, created } = this.runner.enqueue(body, idempotencyKey, actorId);
    return jsonResponse(
      FACTORY_ORCHESTRATION_HTTP_STATUS.ACCEPTED,
      buildCommandSuccessEnvelope({
        correlationId,
        generatedAt: this.clock.now(),
        capability: FACTORY_ORCHESTRATION_CAPABILITIES.ORCHESTRATE,
        actor: { principalId: actorId },
        result: {
          jobId: job.jobId,
          state: job.state,
          created,
        },
      })
    );
  }

  /**
   * HQ-05 — fail-closed owner-match before exposing job or mutating cancel.
   * Uses existing FORBIDDEN envelope (no owner / state leakage in message).
   */
  _denyOwnership(correlationId, capability) {
    return jsonResponse(
      FACTORY_ORCHESTRATION_HTTP_STATUS.FORBIDDEN,
      buildCommandErrorEnvelope(
        FACTORY_ORCHESTRATION_ERROR_CODES.FORBIDDEN,
        "authorization denied",
        correlationId,
        capability
      )
    );
  }

  _getJob(jobId, principal, correlationId, capability) {
    const job = this.runner.read(jobId);
    if (!job) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
          "job not found",
          correlationId,
          capability
        )
      );
    }
    const ownership = jobOwnerMatchesPrincipal(job, principal);
    if (!ownership.ok) {
      return this._denyOwnership(correlationId, capability);
    }
    return jsonResponse(
      FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      buildCommandSuccessEnvelope({
        correlationId,
        generatedAt: this.clock.now(),
        capability,
        result: { job: publicJobView(job) },
      })
    );
  }

  _getLineage(jobId, principal, correlationId, capability) {
    const job = this.runner.read(jobId);
    if (!job) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
          "job not found",
          correlationId,
          capability
        )
      );
    }
    const ownership = jobOwnerMatchesPrincipal(job, principal);
    if (!ownership.ok) {
      return this._denyOwnership(correlationId, capability);
    }
    const lineage = sanitizeLineageSummary({
      jobId: job.jobId,
      factoryKey: job.factoryKey,
      state: job.state,
      eventCount: job.lastCheckpoint ? 1 : 0,
      elr: job.elr,
      rawElr: true,
      decisionPackage: {},
      claimToken: job.claimToken,
    });
    return jsonResponse(
      FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      buildCommandSuccessEnvelope({
        correlationId,
        generatedAt: this.clock.now(),
        capability,
        result: { lineage },
      })
    );
  }

  _cancel(jobId, principal, correlationId, capability) {
    const job = this.runner.read(jobId);
    if (!job) {
      return jsonResponse(
        FACTORY_ORCHESTRATION_HTTP_STATUS.NOT_FOUND,
        buildCommandErrorEnvelope(
          FACTORY_ORCHESTRATION_ERROR_CODES.NOT_FOUND,
          "job not found",
          correlationId,
          capability
        )
      );
    }
    const ownership = jobOwnerMatchesPrincipal(job, principal);
    if (!ownership.ok) {
      return this._denyOwnership(correlationId, capability);
    }
    const result = this.runner.requestCancel(jobId);
    if (!result.ok) {
      return jsonResponse(
        result.httpStatus || FACTORY_ORCHESTRATION_HTTP_STATUS.CONFLICT,
        buildCommandErrorEnvelope(
          result.code || FACTORY_ORCHESTRATION_ERROR_CODES.CONFLICT,
          result.message || "cancel failed",
          correlationId,
          capability
        )
      );
    }
    return jsonResponse(
      FACTORY_ORCHESTRATION_HTTP_STATUS.OK,
      buildCommandSuccessEnvelope({
        correlationId,
        generatedAt: this.clock.now(),
        capability,
        result: {
          job: publicJobView(result.job),
          idempotent: Boolean(result.idempotent),
          pendingCheckpoint: Boolean(result.pendingCheckpoint),
        },
      })
    );
  }
}
