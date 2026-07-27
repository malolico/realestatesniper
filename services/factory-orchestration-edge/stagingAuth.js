/**
 * P-INT-01 Slice B3 — Staging AuthN/AuthZ (Bearer DEV). Deny-by-default.
 * Local copy of discipline — MUST NOT import factory-service-edge.
 */

export class StagingBearerAuthnAdapter {
  /**
   * @param {{ sessions?: Record<string, { principalId: string, roles: string[], capabilities: string[] }> }} [options]
   */
  constructor(options = {}) {
    this.sessions = new Map(Object.entries(options.sessions ?? {}));
  }

  /**
   * @param {{ headers: Record<string, string | string[] | undefined> }} request
   */
  authenticate(request) {
    const raw = request.headers.authorization ?? request.headers.Authorization;
    const header = Array.isArray(raw) ? raw[0] : raw;
    if (typeof header !== "string" || !header.startsWith("Bearer ")) {
      return null;
    }
    const token = header.slice("Bearer ".length).trim();
    if (!token) return null;
    // Reject JWT-like tokens in staging DEV bearer mode
    if (token.includes(".")) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    return {
      principalId: session.principalId,
      roles: [...(session.roles ?? [])],
      tokenType: "STAGING_DEV_BEARER",
      capabilities: [...(session.capabilities ?? [])],
    };
  }
}

export class StagingAuthzAdapter {
  /**
   * Deny-by-default: requires matching role AND capability.
   * @param {object|null} principal
   * @param {string} capability
   * @param {readonly string[]} allowedRoles
   */
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

/**
 * Default DEV sessions for local harness / validation.
 */
export function createDefaultStagingSessions() {
  const capsAll = [
    "factory.command.orchestrate",
    "factory.command.job.read",
    "factory.command.job.lineage",
  ];
  return {
    "dev-ops-token": {
      principalId: "staging-ops",
      roles: ["FACTORY_OPS"],
      capabilities: [...capsAll],
    },
    "dev-director-token": {
      principalId: "staging-director",
      roles: ["FACTORY_DIRECTOR"],
      capabilities: [...capsAll],
    },
    "dev-ops-no-cap-token": {
      principalId: "staging-ops-nocap",
      roles: ["FACTORY_OPS"],
      capabilities: [],
    },
  };
}
