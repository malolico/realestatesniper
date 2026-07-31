# FACTORY GIT HARDENING — PHASE B4
# OFFICIAL IMPLEMENTATION PLAN

| Campo | Valor |
|-------|--------|
| **Document title** | Factory Git Hardening — Phase B4 Official Implementation Plan |
| **Phase ID** | `B4` |
| **Plan ID** | `FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Nature** | **PLAN ONLY** · organizes future B4 execution · **does not stage** · **does not commit** · **does not push** · **does not modify Git config** |
| **Parent Plan** | `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Parent Plan SHA256** | `C49030D70EA88549EB473E911F23085A7C6DEE87D092F86F23CF85B3D0D4F82C` |
| **Ops Protocol** | `FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
| **B3 Mandate** | `FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md` |
| **B3 Mandate SHA256** | `5757E5A4548A82A5958B0989C3657F2C44665DFB78CC35776C64EA3DD2416D9F` |
| **B4 Discovery** | Official Discovery PASS WITH OBSERVATIONS (approved) |
| **Official branch** | `integration/factory-complete-20260725` |
| **Pre-B4 reference HEAD** | `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` |
| **Authorized operator** | Manolo (publication machine with active `core.hooksPath=.githooks`) |
| **Date** | 2026-07-31 |

---

## 1. Executive Summary

B4 is **Exact Staging, Commit and Publication** of Factory Git Hardening to the official remote.

B4 does **not**:

- re-activate local hooks (already done in B3);
- activate Carlos (B5);
- implement new hardening code;
- modify `core.hooksPath`;
- run `git add .`;
- touch Factory / Supabase / Web / Arizona / Marketplace / physical runtime.

B4 **does**:

- stage an **exact authorized path list**;
- run the guard;
- review staged `name-status`;
- create **one** publication commit with hook active;
- push to the official upstream;
- verify HEAD local = remote and tracked clean for the publication scope.

**This Plan does not authorize execution.** Execution requires a separate Director gate and a B4 Official Mandate (or equivalent Director-authorized execution order referencing this Plan).

Director gate text (from Parent Plan):

```text
Aprobado. Publica Factory Git Hardening Fase B.
```

---

## 2. Objective

Publish the shared Git Hardening package so that:

1. GitHub contains the versioned protections (`.gitignore` rules, `.gitattributes`, guard, hook, installer, verifier, Ops Protocol, and the Phase B governance documents authorized below);
2. Manolo’s publication commit is produced **with** `core.hooksPath=.githooks` already active (Parent Plan rule: Manolo hook before publication commit);
3. Carlos can later sync the published HEAD and perform B5 local activation;
4. Phase B can proceed to B5 → B6 closeout.

---

## 3. Scope

### 3.1 In scope (B4 operations)

| Operation | Authorized? |
|-----------|-------------|
| Exact `git add -- <paths>` | YES — authorized list only |
| `node scripts/git/guardStagedForbiddenPaths.js` | YES |
| Staged review (`status`, `diff --cached --name-status`) | YES |
| One publication `git commit` | YES — after Director Mandate |
| Normal `git push` to configured upstream | YES — after commit PASS |
| Post-push HEAD sync verification | YES |
| Read-only inventory / hashes | YES |

### 3.2 Out of scope

- B3 re-Apply / hooksPath changes;
- B5 Carlos activation;
- B6 closeout;
- `git add .` / `git add -f` as normal procedure;
- `git commit --no-verify`;
- `git reset` / `restore` / `clean` / `rm` / rebase / force-push;
- editing hardening scripts during B4;
- runtime deletion;
- package.json;
- any path not listed in §5.

---

## 4. Documentary scope decision (CRITICAL)

### 4.1 Problem statement

Parent Plan §26 locked an audited **exact 7-file** commit scope for the technical Hardening package.

After that lock, Phase B produced additional **official governance documents**, notably:

- `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` (Parent Plan itself, still untracked at Discovery time);
- `FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md`;
- this B4 Plan document.

B4 Discovery recorded this discrepancy as an observation requiring explicit resolution before publication.

### 4.2 Decision: **OPTION B** (formal scope extension for B4 publication)

**Decision:** B4 publication scope **extends** Parent Plan §26 to include the official Phase B governance documents required for dual-operator continuity and auditability on the remote.

### 4.3 Justification

1. **Does not silently break Parent Plan §26.**  
   §26 remains the audited technical package definition. This B4 Plan is a **later gate-specific Plan** that **formally amends publication scope for B4 only**, after Discovery, under Director review. It does not rewrite B2 ImpL history or reopen B2 code.

2. **Traceability.**  
   Publishing only the 7 technical files without the Parent Plan and B3 Mandate would leave GitHub without the authoritative activation/publication governance that Manolo already executed and that Carlos must follow. Dual-operator closeout (B6) requires remote availability of those norms.

3. **Contamination control.**  
   Extension is a **closed named list** (see §5). Still forbids `git add .`, wildcards, runtime, and unrelated docs. Guard + staged `name-status` review remain mandatory. No automatic inclusion of “any Phase B file.”

4. **Option A rejected for B4 sole publish.**  
   Option A (strict 7 files) remains a valid technical subset but would force a second documentary publication Mandate immediately after B4, increasing gate fragmentation and risk that Carlos syncs a HEAD lacking activation Mandates. OPTION B consolidates one publication commit for technical + Phase B governance docs.

### 4.4 Director ratification

Because OPTION B amends the audited §26 publication set, **Director Decision Required = YES** before any B4 Mandate/execution.

Until Director accepts OPTION B (or explicitly selects OPTION A instead), B4 execution remains **blocked**.

---

## 5. Authorized staging scope (exact)

If Director accepts **OPTION B**, the **only** authorized staged paths for the B4 publication commit are:

```text
.gitignore
.gitattributes
.githooks/pre-commit
scripts/git/guardStagedForbiddenPaths.js
scripts/git/installGitHardening.ps1
scripts/git/verifyGitHardening.ps1
docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md
docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md
docs/factory-construction/FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md
docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md
```

**Count:** 10 paths (7 technical §26 + 3 Phase B governance documents).

If Director instead selects **OPTION A**, staging is **exactly** the first 7 paths above, and the three governance documents remain untracked pending a separate documentary Mandate.

**Default recommendation of this Plan:** OPTION B.

**EXCLUDE always:** `package.json`, runtime stores, `estructura_repo.txt`, anomalous root names, Factory functional code, Supabase/Web/Arizona/Marketplace, any other docs unless a new Director Mandate amends this list.

---

## 6. Preconditions

All must be true before staging:

| # | Precondition |
|---|--------------|
| 1 | B2 ImpL + ImpL Audit + Minor Correction Verification complete |
| 2 | B3 Manolo Local Activation = `B3 ACTIVATION PASS` (or already-active verified) |
| 3 | `core.hooksPath` = `.githooks` on Manolo publication machine |
| 4 | Official verifier PASS with active hooksPath (no inactive bypass) |
| 5 | Branch = `integration/factory-complete-20260725` |
| 6 | Origin = `https://github.com/malolico/realestatesniper.git` |
| 7 | Local HEAD = remote HEAD; ahead/behind = `0/0` |
| 8 | Pre-B4 reference HEAD still `c2c5f7f3b56b750e9bf44b2620baf7be059c658d` unless Director amends |
| 9 | Staged files = `0` before B4 staging begins |
| 10 | Working tree contains exactly the authorized paths as M/?? as applicable; no unauthorized tracked dirty |
| 11 | Parent Plan SHA256 matches `C49030D7…D4F82C` |
| 12 | B3 Mandate SHA256 matches `5757E5A4…416D9F` |
| 13 | Director gate text for B4 granted |
| 14 | Director accepts documentary scope decision (OPTION B recommended) |
| 15 | B4 Official Mandate (or equivalent execution order) issued — **this Plan alone is insufficient to execute** |

---

## 7. Hard gates (fail-closed)

Any failure ⇒ **B4 BLOCKED** — STOP. No auto-repair.

1. Identity: root / origin / branch.  
2. HEAD sync hard-fail (`0/0`, local = remote).  
3. hooksPath exactly `.githooks`.  
4. Staged empty before start.  
5. Unauthorized tracked dirty absent.  
6. Scope decision ratified by Director.  
7. Exact path list only — any extra staged path ⇒ BLOCKED.  
8. Guard exit `0` on the staged set.  
9. Staged `name-status` matches authorized list 1:1 (no extras, no missing required paths that should be in the commit).  
10. Hook fires on commit (no `--no-verify`).  
11. Push only to configured upstream of the official branch.  
12. Post-push: local HEAD = remote HEAD; ahead/behind `0/0`.

---

## 8. Execution phases (ordered)

### PHASE B4-0 — Authorization

- Confirm Director gate + scope decision (A or B).  
- Confirm B4 Mandate/execution order exists.  
- **Mutations:** none.

### PHASE B4-1 — Pre-publish baseline (READ ONLY)

Record root, origin, branch, HEAD local/remote, ahead/behind, staged, hooksPath, status porcelain, Plan/Mandate hashes, artifact presence.

### PHASE B4-2 — Exact staging

```powershell
git add -- .gitignore
git add -- .gitattributes
git add -- .githooks/pre-commit
git add -- scripts/git/guardStagedForbiddenPaths.js
git add -- scripts/git/installGitHardening.ps1
git add -- scripts/git/verifyGitHardening.ps1
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md
```

If OPTION B (recommended):

```powershell
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_B3_MANOLO_LOCAL_ACTIVATION_MANDATE.md
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md
```

**Forbidden:** `git add .` · `git add -A` · `git add -f` · pathspecs with globs for this publish.

### PHASE B4-3 — Guard

```powershell
node scripts/git/guardStagedForbiddenPaths.js
```

Expected exit `0`. Exit `1` or `2` ⇒ **B4 BLOCKED**.

### PHASE B4-4 — Index review

```powershell
git status --short
git diff --cached --name-status
```

Compare staged set to §5 authorized list. Any mismatch ⇒ **B4 BLOCKED** (do not commit; do not auto-unstaging recipes; STOP for Director/Case diagnosis per Ops Protocol).

### PHASE B4-5 — Commit (hook active)

Single publication commit. Suggested message subject/body intent:

```text
Publish Factory Git Hardening Phase B (B4).

Version shared ignore rules, gitattributes, guard, hook, installer,
verifier, ops protocol, and Phase B governance documents authorized
for publication. Manolo local hooksPath already active before commit.
```

Exact final message may be fixed by the B4 Mandate.  
**Forbidden:** `--no-verify`.

### PHASE B4-6 — Push

```powershell
git push
```

(or equivalent normal upstream push for the official branch — **no force**).

### PHASE B4-7 — Post-push verification

- local HEAD = remote HEAD;  
- ahead/behind `0/0`;  
- staged `0`;  
- published paths present in `git ls-files` / remote tip;  
- hooksPath still `.githooks` on Manolo;  
- no unexpected tracked contamination;  
- runtime physically preserved;  
- `factory-dso-packs` 6/6 still tracked;  
- Carlos still unaffected (no B5 yet).

### PHASE B4-8 — B4 closeout report + STOP

Emit B4 PASS/FAIL report. **STOP.** Do not start B5 without Director gate.

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Staging contamination (`git add .`) | Exact `git add --` list; hard gate on name-status |
| Publishing without active hook | Precondition hooksPath; ban `--no-verify` |
| Scope creep beyond §5 | Closed list; Director must amend to add paths |
| OPTION B vs audited §26 dispute | Explicit Director ratification of OPTION B |
| Force-push / wrong remote | Ban force; verify origin/branch |
| Intermediate staged failure | STOP; Ops Cases A–D; no auto reset/restore/clean |
| Carlos confusion | B4 does not activate Carlos; B5 separate |
| Runtime deletion | Explicitly forbidden |

---

## 10. Rollback (conceptual only — not authorized by this Plan)

This Plan **does not authorize rollback**.

Conceptual reference only (requires independent Director Mandate):

- Do not force-push to rewrite published history as normal procedure;  
- Corrective forward commits preferred;  
- Local hooksPath rollback remains under Ops/Plan B3 rules and is **not** part of B4;  
- Never use `git reset` / `restore` / `clean` on official repo as a generic remediation.

---

## 11. PASS criteria

B4 PASS only if all are true:

1. Director gate + scope decision recorded;  
2. Exact authorized paths committed (OPTION B list if selected);  
3. Guard `0` before commit;  
4. Hook participated (no `--no-verify`);  
5. Push succeeded;  
6. HEAD local = remote; ahead/behind `0/0`;  
7. Staged `0` after publish;  
8. hooksPath still `.githooks` on Manolo;  
9. No unauthorized paths in the publication commit;  
10. B4 report issued; STOP observed (B5 not auto-started).

Terminals (for future Mandate):

```text
B4 PUBLICATION PASS
B4 BLOCKED
```

---

## 12. Transition to B5

After **B4 PUBLICATION PASS**:

- Carlos may be authorized (separate Mandate) to sync the **new published HEAD** and activate local `core.hooksPath=.githooks` (B5);  
- Manolo must not treat B4 PASS as Carlos activation;  
- B6 closeout requires published hardening **and** Manolo PASS **and** (Carlos PASS or mandatory STOP for Carlos).

**This Plan does not authorize B5.**

---

## 13. Implementation readiness

| Item | Status |
|------|--------|
| Discovery | Approved |
| This Plan | Created (documentary) |
| Scope decision | OPTION B recommended; **Director ratification required** |
| B4 Mandate | **Not created by this Plan** — required before execution |
| Staging/commit/push | **Not executed** by this Plan |

**IMPLEMENTATION READY:** YES for Mandate drafting / Director decision — **NO** for unsupervised execution without Mandate + Director gate.

---

## 14. End of Plan

End of `FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN`.
