import { randomUUID, createHash } from "node:crypto";

function nowMs(clock) {
  return clock && typeof clock.nowMs === "function" ? clock.nowMs() : Date.now();
}

export class SystemClock {
  now() {
    return new Date().toISOString();
  }

  nowMs() {
    return Date.now();
  }
}

export class FixedClock {
  constructor(iso = "2026-07-27T00:00:00.000Z") {
    this.iso = iso;
  }

  now() {
    return this.iso;
  }

  nowMs() {
    return new Date(this.iso).getTime();
  }
}

export class InMemoryAuthnAdapter {
  constructor(options = {}) {
    this.sessions = new Map(Object.entries(options.sessions ?? {}));
  }

  authenticate(request) {
    const header = request.headers.authorization;
    if (typeof header !== "string" || !header.startsWith("Bearer ")) {
      return null;
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) return null;
    if (token.includes(".")) {
      return null;
    }
    const session = this.sessions.get(token);
    if (!session) return null;
    return {
      principalId: session.principalId,
      roles: [...(session.roles ?? [])],
      tokenType: "ADMIN_SESSION",
      capabilities: [...(session.capabilities ?? [])],
    };
  }
}

export class InMemoryAuthzAdapter {
  authorize(principal, capability, allowedRoles) {
    if (!principal) return { allowed: false, reason: "missing_principal" };
    const roles = Array.isArray(principal.roles) ? principal.roles : [];
    const hasRole = roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) return { allowed: false, reason: "role_denied" };
    const caps = Array.isArray(principal.capabilities) ? principal.capabilities : [];
    if (!caps.includes(capability)) {
      return { allowed: false, reason: "capability_denied" };
    }
    return { allowed: true };
  }
}

export class InMemoryRateLimitAdapter {
  constructor(options = {}) {
    this.clock = options.clock ?? new SystemClock();
    this.buckets = new Map();
  }

  consume(key, policy) {
    const currentMs = nowMs(this.clock);
    const windowMs = policy.windowMs;
    const refillPerMs = policy.limit / windowMs;
    const capacity = policy.limit + policy.burst;
    const bucket = this.buckets.get(key) ?? {
      tokens: capacity,
      updatedAtMs: currentMs,
    };
    const elapsedMs = Math.max(0, currentMs - bucket.updatedAtMs);
    bucket.tokens = Math.min(capacity, bucket.tokens + elapsedMs * refillPerMs);
    bucket.updatedAtMs = currentMs;
    if (bucket.tokens < 1) {
      this.buckets.set(key, bucket);
      const deficit = 1 - bucket.tokens;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(deficit / refillPerMs / 1000)),
      };
    }
    bucket.tokens -= 1;
    this.buckets.set(key, bucket);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export class InMemoryAuditAdapter {
  constructor() {
    this.events = [];
    this.failOnAppend = false;
  }

  append(event) {
    if (this.failOnAppend) {
      throw new Error("audit_append_failed");
    }
    this.events.push({
      auditId: event.auditId ?? randomUUID(),
      ...event,
    });
  }
}

export function hashClientIp(input) {
  if (typeof input !== "string" || input.length === 0) return null;
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}
