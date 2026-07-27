import { randomUUID } from "node:crypto";
import {
  FACTORY_EDGE_ERROR_CODES,
  FACTORY_EDGE_ROUTE_SPECS,
  buildErrorEnvelope,
  buildSuccessEnvelope,
} from "./contract.js";
import {
  InMemoryAuthnAdapter,
  InMemoryAuthzAdapter,
  InMemoryAuditAdapter,
  InMemoryRateLimitAdapter,
  SystemClock,
  hashClientIp,
} from "./adapters.js";
import { ReadOnlyFactoryReadPort } from "./factoryReadPort.js";

function sanitizeMessage(value, fallback = "internal_error") {
  if (typeof value !== "string" || value.length === 0) return fallback;
  return value
    .replace(/[A-Za-z]:\\[^\s:]+/g, "[path]")
    .replace(/\/Users\/[^\s:]+/g, "[path]")
    .replace(/\bat\s+\S+\s+\([^)]+:\d+:\d+\)/g, "[stack]")
    .slice(0, 200);
}

function normalizeHeaders(headers = {}) {
  const out = {};
  for (const [key, value] of Object.entries(headers)) {
    out[String(key).toLowerCase()] = Array.isArray(value) ? value.join(",") : String(value);
  }
  return out;
}

function parseCorrelationId(value) {
  if (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  ) {
    return value;
  }
  return randomUUID();
}

function parseUrlPath(rawUrl = "/") {
  const url = new URL(rawUrl, "http://localhost");
  return {
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
  };
}

function makeJsonResponse(statusCode, body, correlationId, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-correlation-id": correlationId,
      ...extraHeaders,
    },
    body: JSON.stringify(body, null, 2),
  };
}

function routeLookup(method, path) {
  return Object.values(FACTORY_EDGE_ROUTE_SPECS).find(
    (route) => route.method === method && route.path === path
  );
}

export class FactoryServiceEdgeCore {
  constructor(options = {}) {
    this.clock = options.clock ?? new SystemClock();
    this.authn = options.authn ?? new InMemoryAuthnAdapter();
    this.authz = options.authz ?? new InMemoryAuthzAdapter();
    this.rateLimit = options.rateLimit ?? new InMemoryRateLimitAdapter({ clock: this.clock });
    this.audit = options.audit ?? new InMemoryAuditAdapter();
    this.factoryReads = options.factoryReads ?? new ReadOnlyFactoryReadPort();
  }

  async handle(request) {
    const headers = normalizeHeaders(request.headers);
    const { path, query } = parseUrlPath(request.url);
    const correlationId = parseCorrelationId(headers["x-correlation-id"]);
    const method = String(request.method ?? "GET").toUpperCase();
    const route = routeLookup(method, path);

    if (!route) {
      return makeJsonResponse(
        404,
        buildErrorEnvelope(
          FACTORY_EDGE_ERROR_CODES.NOT_FOUND,
          "Endpoint not found",
          correlationId
        ),
        correlationId
      );
    }

    const queryKeys = Object.keys(query);
    if (queryKeys.some((key) => !route.maxQueryKeys.includes(key))) {
      return makeJsonResponse(
        400,
        buildErrorEnvelope(
          FACTORY_EDGE_ERROR_CODES.VALIDATION_FAIL,
          "Unsupported query parameter",
          correlationId
        ),
        correlationId
      );
    }

    const bodyText = typeof request.bodyText === "string" ? request.bodyText : "";
    if (bodyText.length > 0 || Number(headers["content-length"] ?? "0") > 0) {
      return makeJsonResponse(
        400,
        buildErrorEnvelope(
          FACTORY_EDGE_ERROR_CODES.VALIDATION_FAIL,
          "GET body not allowed",
          correlationId
        ),
        correlationId
      );
    }

    if (!route.authenticated) {
      const limit = this.rateLimit.consume(`health:${request.remoteAddress ?? "unknown"}`, {
        limit: 30,
        burst: 10,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return makeJsonResponse(
          429,
          buildErrorEnvelope(
            FACTORY_EDGE_ERROR_CODES.RATE_LIMITED,
            "Rate limit exceeded",
            correlationId
          ),
          correlationId,
          { "retry-after": String(limit.retryAfterSeconds) }
        );
      }

      const payload = { status: "ok" };
      return makeJsonResponse(200, payload, correlationId);
    }

    const principal = this.authn.authenticate({ ...request, headers });
    if (!principal) {
      return makeJsonResponse(
        401,
        buildErrorEnvelope(
          FACTORY_EDGE_ERROR_CODES.UNAUTHENTICATED,
          "Authentication required",
          correlationId
        ),
        correlationId
      );
    }

    const authz = this.authz.authorize(principal, route.capability, route.roles);
    if (!authz.allowed) {
      await this.#safeAudit({
        correlationId,
        principal,
        route,
        statusCode: 403,
        outcome: "DENY",
        request,
      });
      return makeJsonResponse(
        403,
        buildErrorEnvelope(FACTORY_EDGE_ERROR_CODES.FORBIDDEN, "Forbidden", correlationId),
        correlationId
      );
    }

    const rate = this.rateLimit.consume(`principal:${principal.principalId}`, {
      limit: 60,
      burst: 10,
      windowMs: 60_000,
    });
    if (!rate.allowed) {
      await this.#safeAudit({
        correlationId,
        principal,
        route,
        statusCode: 429,
        outcome: "RATE_LIMITED",
        request,
      });
      return makeJsonResponse(
        429,
        buildErrorEnvelope(
          FACTORY_EDGE_ERROR_CODES.RATE_LIMITED,
          "Rate limit exceeded",
          correlationId
        ),
        correlationId,
        { "retry-after": String(rate.retryAfterSeconds) }
      );
    }

    try {
      const result = this.#executeRoute(path);
      if (result.ok === false) {
        await this.#strictAudit({
          correlationId,
          principal,
          route,
          statusCode: result.httpStatus ?? 503,
          outcome: "ERROR",
          request,
        });
        return makeJsonResponse(
          result.httpStatus ?? 503,
          buildErrorEnvelope(
            FACTORY_EDGE_ERROR_CODES.NOT_READY,
            "Dependency unavailable",
            correlationId
          ),
          correlationId
        );
      }

      await this.#strictAudit({
        correlationId,
        principal,
        route,
        statusCode: result.httpStatus ?? 200,
        outcome: "SUCCESS",
        request,
      });
      return makeJsonResponse(
        result.httpStatus ?? 200,
        buildSuccessEnvelope({
          correlationId,
          generatedAt: this.clock.now(),
          observationStatus: result.observationStatus,
          payload: result.payload,
          warnings: result.warnings ?? [],
        }),
        correlationId
      );
    } catch (error) {
      const auditError = await this.#strictAudit({
        correlationId,
        principal,
        route,
        statusCode: 500,
        outcome: "ERROR",
        request,
      }).catch((err) => err);
      const message =
        auditError instanceof Error
          ? "Audit append failed"
          : sanitizeMessage(error?.message, "Internal error");
      return makeJsonResponse(
        auditError instanceof Error ? 503 : 500,
        buildErrorEnvelope(
          auditError instanceof Error
            ? FACTORY_EDGE_ERROR_CODES.NOT_READY
            : FACTORY_EDGE_ERROR_CODES.INTERNAL_ERROR,
          message,
          correlationId
        ),
        correlationId
      );
    }
  }

  #executeRoute(path) {
    switch (path) {
      case FACTORY_EDGE_ROUTE_SPECS.readiness.path:
        return this.factoryReads.probeReadiness();
      case FACTORY_EDGE_ROUTE_SPECS.registrySummary.path:
        return this.factoryReads.readRegistrySummary();
      case FACTORY_EDGE_ROUTE_SPECS.elrSummary.path:
        return this.factoryReads.readElrSummary();
      case FACTORY_EDGE_ROUTE_SPECS.governanceDashboard.path:
        return this.factoryReads.readGovernanceDashboard();
      case FACTORY_EDGE_ROUTE_SPECS.governanceDrift.path:
        return this.factoryReads.readGovernanceDrift();
      case FACTORY_EDGE_ROUTE_SPECS.governanceCompliance.path:
        return this.factoryReads.readGovernanceCompliance();
      case FACTORY_EDGE_ROUTE_SPECS.governanceMaturity.path:
        return this.factoryReads.readGovernanceMaturity();
      default:
        return {
          ok: false,
          httpStatus: 404,
          observationStatus: "UNAVAILABLE",
          payload: {},
          warnings: [],
        };
    }
  }

  async #safeAudit(args) {
    try {
      await this.#strictAudit(args);
    } catch {
      // Deny/error paths should not cascade further.
    }
  }

  async #strictAudit({ correlationId, principal, route, statusCode, outcome, request }) {
    this.audit.append({
      ts: this.clock.now(),
      correlationId,
      principalId: principal.principalId,
      roles: principal.roles,
      method: request.method,
      path: route.path,
      statusCode,
      outcome,
      capability: route.capability,
      clientIpHash: hashClientIp(request.remoteAddress ?? ""),
      userAgentClass: request.headers?.["user-agent"] ? "browserish" : "unknown",
    });
  }
}
