/**
 * P-INT-03 Durable — Local durable Object Store backend (Phase 2).
 *
 * Key → UTF-8 object bodies on local filesystem (object-store shape).
 * Survives process restart. No vendor SDK / package.json / network /
 * Supabase / SQLite / Dedicated DB.
 *
 * Mandate: P-INT-03-DURABLE-OBJECT-STORE-IMPL
 * Path: OBJECT STORE only.
 * Injectable only — never the FactoryRegistry default.
 *
 * Distinct from AtomicFileElrStore (Offline CLOSED) — this is a generic
 * ObjectStoreBackend medium for ObjectStoreElrStore injection.
 */

import fs from "node:fs";
import path from "node:path";
import { assertObjectStoreBackend } from "./objectStoreBackend.js";

/**
 * Map object-store key to a relative safe path segment.
 * Rejects absolute paths and traversal.
 * @param {string} key
 * @returns {string}
 */
function keyToRelativePath(key) {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error("[LocalDurableObjectStoreBackend] key must be a non-empty string");
  }
  if (key.includes("\0")) {
    throw new Error("[LocalDurableObjectStoreBackend] key contains NUL");
  }
  const normalized = key.replace(/\\/g, "/");
  if (path.isAbsolute(normalized) || normalized.startsWith("/") || /^[a-zA-Z]:/.test(normalized)) {
    throw new Error("[LocalDurableObjectStoreBackend] absolute keys forbidden");
  }
  const parts = normalized.split("/").filter((p) => p.length > 0);
  if (parts.length === 0) {
    throw new Error("[LocalDurableObjectStoreBackend] empty key path");
  }
  for (const part of parts) {
    if (part === "." || part === "..") {
      throw new Error("[LocalDurableObjectStoreBackend] path traversal forbidden");
    }
  }
  return parts.join(path.sep);
}

const WRITE_TEMP_SUFFIX = ".__os_write__";

export class LocalDurableObjectStoreBackend {
  /**
   * @param {string} rootDir Absolute or relative root for object bodies
   */
  constructor(rootDir) {
    if (typeof rootDir !== "string" || rootDir.length === 0) {
      throw new Error("[LocalDurableObjectStoreBackend] rootDir required");
    }
    this.rootDir = path.resolve(rootDir);
    fs.mkdirSync(this.rootDir, { recursive: true });
    assertObjectStoreBackend(this);
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  #resolveObjectPath(key) {
    const rel = keyToRelativePath(key);
    const full = path.resolve(this.rootDir, rel);
    const rootWithSep = this.rootDir.endsWith(path.sep)
      ? this.rootDir
      : `${this.rootDir}${path.sep}`;
    if (full !== this.rootDir && !full.startsWith(rootWithSep)) {
      throw new Error("[LocalDurableObjectStoreBackend] resolved path escapes root");
    }
    return full;
  }

  /**
   * Staging path that must not collide with ObjectStoreElrStore object keys (*.tmp / *.sha256.tmp).
   * @param {string} filePath
   */
  #writeTempPath(filePath) {
    return `${filePath}${WRITE_TEMP_SUFFIX}`;
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  exists(key) {
    return fs.existsSync(this.#resolveObjectPath(key));
  }

  /**
   * @param {string} key
   * @returns {string|null}
   */
  get(key) {
    const filePath = this.#resolveObjectPath(key);
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf8");
  }

  /**
   * @param {string} key
   * @param {string} body
   */
  put(key, body) {
    if (typeof body !== "string") {
      throw new Error("[LocalDurableObjectStoreBackend] body must be a UTF-8 string");
    }
    const filePath = this.#resolveObjectPath(key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tmpPath = this.#writeTempPath(filePath);
    fs.writeFileSync(tmpPath, body, "utf8");
    fs.renameSync(tmpPath, filePath);
  }

  /**
   * @param {string} key
   */
  delete(key) {
    const filePath = this.#resolveObjectPath(key);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      /* ignore */
    }
    try {
      const tmpPath = this.#writeTempPath(filePath);
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
  }

  /**
   * @param {string} [prefix]
   * @returns {string[]}
   */
  listKeys(prefix = "") {
    if (typeof prefix !== "string") {
      throw new Error("[LocalDurableObjectStoreBackend] prefix must be a string");
    }
    const keys = [];
    const walk = (dir, relParts) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.endsWith(WRITE_TEMP_SUFFIX)) continue;
        const nextRel = [...relParts, entry.name];
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full, nextRel);
        } else if (entry.isFile()) {
          const key = nextRel.join("/");
          if (prefix === "" || key.startsWith(prefix)) keys.push(key);
        }
      }
    };
    walk(this.rootDir, []);
    return keys.sort();
  }
}
