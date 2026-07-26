/**
 * P-INT-02 Offline — CHECKSUMS.sha256 authority (no self-hash in manifest).
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const CHECKSUMS_FILENAME = "CHECKSUMS.sha256";

/**
 * @param {Buffer|string} data
 */
export function sha256Hex(data) {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * @param {string} filePath
 */
export function sha256File(filePath) {
  return sha256Hex(fs.readFileSync(filePath));
}

/**
 * @param {string} packRoot
 * @param {string[]} relativePaths paths relative to packRoot (posix-style preferred)
 */
export function writeChecksumsAuthority(packRoot, relativePaths) {
  const lines = ["# algorithm: SHA-256", "# authority: CHECKSUMS.sha256 (external)"];
  for (const rel of relativePaths) {
    const normalized = rel.replace(/\\/g, "/");
    const abs = path.join(packRoot, ...normalized.split("/"));
    if (!fs.existsSync(abs)) {
      throw new Error(`[P-INT-02] Missing file for checksum: ${normalized}`);
    }
    lines.push(`${sha256File(abs)}  ${normalized}`);
  }
  const out = path.join(packRoot, CHECKSUMS_FILENAME);
  fs.writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
  return out;
}

/**
 * Parse CHECKSUMS.sha256 — lines "hex  relative/path"
 * @param {string} packRoot
 * @returns {{ ok: true, entries: Map<string,string> } | { ok: false, reason: string }}
 */
export function readChecksumsAuthority(packRoot) {
  const filePath = path.join(packRoot, CHECKSUMS_FILENAME);
  if (!fs.existsSync(filePath)) {
    return { ok: false, reason: "checksums_file_missing" };
  }
  const text = fs.readFileSync(filePath, "utf8");
  const entries = new Map();
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^([a-f0-9]{64})\s+(.+)$/i.exec(line);
    if (!m) {
      return { ok: false, reason: `checksums_line_invalid:${line.slice(0, 80)}` };
    }
    entries.set(m[2].replace(/\\/g, "/"), m[1].toLowerCase());
  }
  if (entries.size === 0) {
    return { ok: false, reason: "checksums_empty" };
  }
  return { ok: true, entries };
}

/**
 * Verify all entries in CHECKSUMS.sha256 against disk.
 * @param {string} packRoot
 */
export function verifyChecksumsAuthority(packRoot) {
  const parsed = readChecksumsAuthority(packRoot);
  if (!parsed.ok) return parsed;

  for (const [rel, expected] of parsed.entries) {
    const abs = path.join(packRoot, ...rel.split("/"));
    if (!fs.existsSync(abs)) {
      return { ok: false, reason: `checksum_target_missing:${rel}` };
    }
    const actual = sha256File(abs);
    if (actual !== expected) {
      return { ok: false, reason: `checksum_mismatch:${rel}` };
    }
  }
  return { ok: true, entries: parsed.entries };
}
