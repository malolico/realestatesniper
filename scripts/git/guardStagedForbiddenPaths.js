/**
 * Factory Git Hardening — staged forbidden-path guard
 * READ-ONLY regarding the working tree / index mutation.
 * Exit: 0 clean | 1 forbidden staged | 2 technical / unreliable
 *
 * Official: node scripts/git/guardStagedForbiddenPaths.js
 * TEMP tests: node scripts/git/guardStagedForbiddenPaths.js --test-repository
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const EXPECTED_ORIGIN = "https://github.com/malolico/realestatesniper.git";
const EXPECTED_BRANCH = "integration/factory-complete-20260725";

const RUNTIME_PREFIXES = [
  "data/factory-compliance/",
  "data/factory-distress/",
  "data/factory-economy/",
  "data/factory-environment/",
  "data/factory-evidence/",
  "data/factory-foundation/",
  "data/factory-intelligence/",
  "data/factory-legitimacy/",
  "data/factory-registry/",
];

const ROOT_EXACT = "estructura_repo.txt";
const ROOT_PREFIX = "ersMalolicorealestatesniper";
const ALLOW_PREFIX = "data/factory-dso-packs/";

const BLOCK_MSG = `COMMIT BLOCKED — FORBIDDEN STAGED PATHS DETECTED

The staged index contains one or more paths protected by Factory Git Hardening.

Review the staged diff and follow:
docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md

Do not delete physical files.
Do not use reset, restore or clean.
No automatic remediation has been performed.`;

function runGit(args, cwd) {
  const r = spawnSync("git", args, {
    cwd,
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  return r;
}

function runGitText(args, cwd) {
  const r = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return r;
}

function failTech(msg, detail) {
  console.error("COMMIT BLOCKED — TECHNICAL / UNRELIABLE GUARD RESULT");
  console.error(msg);
  if (detail) console.error(detail);
  process.exit(2);
}

function normalizeForCompare(p) {
  let s = String(p).replace(/\\/g, "/");
  if (s.startsWith("./")) s = s.slice(2);
  return s;
}

function fold(s, ignoreCase) {
  return ignoreCase ? s.toLocaleLowerCase("en-US") : s;
}

function isAllowed(norm, ignoreCase) {
  const n = fold(norm, ignoreCase);
  return n === fold(ALLOW_PREFIX.slice(0, -1), ignoreCase) ||
    n.startsWith(fold(ALLOW_PREFIX, ignoreCase));
}

function isRootPath(norm) {
  return !norm.includes("/");
}

function isForbidden(norm, ignoreCase) {
  if (isAllowed(norm, ignoreCase)) return false;
  const n = fold(norm, ignoreCase);
  for (const pref of RUNTIME_PREFIXES) {
    if (n === fold(pref.slice(0, -1), ignoreCase) || n.startsWith(fold(pref, ignoreCase))) {
      return "runtime-store";
    }
  }
  if (isRootPath(norm) && n === fold(ROOT_EXACT, ignoreCase)) {
    return "root-estructura";
  }
  if (isRootPath(norm)) {
    const base = norm.split("/").pop() || norm;
    const b = fold(base, ignoreCase);
    if (b.startsWith(fold(ROOT_PREFIX, ignoreCase))) {
      return "root-anomalous-prefix";
    }
  }
  return null;
}

function parseNameStatusNul(buf) {
  if (!buf || buf.length === 0) return [];
  const parts = [];
  let start = 0;
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) {
      parts.push(buf.slice(start, i).toString("utf8"));
      start = i + 1;
    }
  }
  // trailing non-NUL remnant is an error if any bytes remain
  if (start < buf.length) {
    throw new Error("NUL-delimited stream incomplete (trailing bytes without NUL)");
  }
  // drop final empty token if buffer ended with NUL
  if (parts.length && parts[parts.length - 1] === "") parts.pop();

  const entries = [];
  let i = 0;
  while (i < parts.length) {
    const status = parts[i++];
    if (!status) throw new Error("empty status token");
    const code = status[0];
    if (code === "A" || code === "M" || code === "T") {
      if (i >= parts.length) throw new Error(`incomplete ${code} entry`);
      const p = parts[i++];
      entries.push({ status, paths: [p] });
    } else if (code === "R" || code === "C") {
      if (i + 1 >= parts.length) throw new Error(`incomplete ${code} entry`);
      const oldP = parts[i++];
      const newP = parts[i++];
      entries.push({ status, paths: [oldP, newP] });
    } else {
      throw new Error(`unknown or disallowed status token: ${status}`);
    }
  }
  return entries;
}

function detectIgnoreCase(cwd) {
  const r = runGitText(["config", "--get", "core.ignorecase"], cwd);
  if (r.error) return { ignoreCase: true, source: "fail-closed-spawn" };
  const v = (r.stdout || "").trim().toLowerCase();
  if (r.status === 0 && (v === "true" || v === "false")) {
    return { ignoreCase: v === "true", source: "config" };
  }
  // Windows default posture: fail-closed case-insensitive
  if (process.platform === "win32") {
    return { ignoreCase: true, source: "fail-closed-windows" };
  }
  return { ignoreCase: true, source: "fail-closed-unknown" };
}

function assertOfficialRepo(root, testMode) {
  if (testMode) return;

  const gitPath = path.join(root, ".git");
  if (fs.existsSync(gitPath) && fs.statSync(gitPath).isFile()) {
    failTech("BLOCKED — WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW");
  }

  const common = runGitText(["rev-parse", "--git-common-dir"], root);
  const gdir = runGitText(["rev-parse", "--git-dir"], root);
  if (common.status !== 0 || gdir.status !== 0) {
    failTech("unable to resolve git-dir / git-common-dir", common.stderr || gdir.stderr);
  }
  const commonAbs = path.resolve(root, (common.stdout || "").trim());
  const gdirAbs = path.resolve(root, (gdir.stdout || "").trim());
  if (commonAbs !== gdirAbs) {
    failTech("BLOCKED — WORKTREE OR NONSTANDARD GIT DIR REQUIRES REVIEW");
  }

  const origin = runGitText(["remote", "get-url", "origin"], root);
  if (origin.status !== 0) {
    failTech("unable to read remote.origin.url", origin.stderr);
  }
  const originUrl = (origin.stdout || "").trim();
  if (originUrl !== EXPECTED_ORIGIN) {
    failTech(`origin mismatch: expected ${EXPECTED_ORIGIN}, got ${originUrl}`);
  }

  const branch = runGitText(["branch", "--show-current"], root);
  if (branch.status !== 0) {
    failTech("unable to read current branch", branch.stderr);
  }
  const b = (branch.stdout || "").trim();
  if (b !== EXPECTED_BRANCH) {
    // Soft diagnostic on official: still allow guard of staged paths, but warn?
    // Plan: "comprobar rama oficial o permitir diagnóstico claro" — for official harden commits
    // we require official branch.
    failTech(`branch mismatch: expected ${EXPECTED_BRANCH}, got ${b || "(detached)"}`);
  }

  // Project markers
  const markers = [
    "docs/factory-construction",
    "services/factory-orchestration-edge",
    "src/runSp01Ib09Cb15OrchestrationValidation.js",
  ];
  for (const m of markers) {
    if (!fs.existsSync(path.join(root, m))) {
      failTech(`project marker missing: ${m}`);
    }
  }
}

function main() {
  const testMode = process.argv.includes("--test-repository");

  const top = runGitText(["rev-parse", "--show-toplevel"], process.cwd());
  if (top.error) failTech("git spawn failed", String(top.error));
  if (top.status !== 0) {
    failTech("not inside a Git repository", top.stderr);
  }
  const root = (top.stdout || "").trim();
  if (!root) failTech("empty git toplevel");

  assertOfficialRepo(root, testMode);

  const { ignoreCase } = detectIgnoreCase(root);

  const diff = runGit(
    ["diff", "--cached", "--name-status", "-z", "--diff-filter=ACMRT"],
    root,
  );
  if (diff.error) failTech("git diff spawn failed", String(diff.error));
  if (diff.status !== 0) {
    failTech("git diff --cached failed", (diff.stderr || Buffer.alloc(0)).toString("utf8"));
  }

  let entries;
  try {
    entries = parseNameStatusNul(diff.stdout || Buffer.alloc(0));
  } catch (e) {
    failTech("NUL parse failure", e && e.message ? e.message : String(e));
  }

  const hits = [];
  for (const entry of entries) {
    for (const original of entry.paths) {
      const norm = normalizeForCompare(original);
      const reason = isForbidden(norm, ignoreCase);
      if (reason) {
        hits.push({ status: entry.status, original, reason, paths: entry.paths });
      }
    }
  }

  // Deduplicate by original path+status
  const seen = new Set();
  const unique = [];
  for (const h of hits) {
    const k = `${h.status}\0${h.original}`;
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(h);
  }

  if (unique.length === 0) {
    process.exit(0);
  }

  console.error(BLOCK_MSG);
  console.error("");
  for (const h of unique) {
    if (h.paths.length === 2) {
      console.error(`status=${h.status} old=${h.paths[0]} new=${h.paths[1]} reason=${h.reason}`);
    } else {
      console.error(`status=${h.status} path=${h.original} reason=${h.reason}`);
    }
  }
  process.exit(1);
}

main();
