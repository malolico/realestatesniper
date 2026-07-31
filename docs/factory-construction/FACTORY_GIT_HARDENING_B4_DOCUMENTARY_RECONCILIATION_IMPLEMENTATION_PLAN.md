# FACTORY GIT HARDENING — B4-DOC OFFICIAL IMPLEMENTATION PLAN

## Documentary Reconciliation Follow-on — Official Controlled Documentary Publication

**Status:** OFFICIAL IMPLEMENTATION PLAN — DOCUMENTARY ONLY — CORRECTED AFTER INDEPENDENT PLAN AUDIT  
**Classification:** DOCUMENTARY RECONCILIATION  
**Authority:** Arquitecto Jefe / CTO / Auditor Principal — RealEstateSniper Factory 2.0  
**Mode at creation / correction:** STRICT DOCUMENTARY MODE — planning and Plan corrections only; no publication executed  
**Parent phase:** Factory Git Hardening — Phase B  
**Canonical block name:** **B4-DOC — B4 Documentary Reconciliation Follow-on**  
**Independent Plan Audit:** PASS WITH OBSERVATIONS  
**Corrections applied:** MINOR-1 (mandatory governance chain); MINOR-2 (Mandate B4 cryptographic baseline)

---

## 1. Document identity

| Field | Value |
|---|---|
| Document ID | `FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN` |
| Path | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| Block | **B4-DOC** |
| Block type | Documentary Reconciliation Follow-on |
| Created under HEAD | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| Technical parent commit (immutable) | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| Related Mandate to publish (content immutable) | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| Related technical Plan (already published) | `docs/factory-construction/FACTORY_GIT_HARDENING_PHASE_B4_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| Required future execution Mandate | `FACTORY_GIT_HARDENING_B4_DOC_IMPLEMENTATION_MANDATE` (path to be fixed by that Mandate; **mandatory** before any git mutation) |
| Discovery basis | Documentary Follow-on Discovery — PASS |
| Forensic basis | FORENSIC SCOPE AUDIT — PASS; MANDATE B4 OUTSIDE COMMIT — DESIGN ISSUE |

This document is the **sole official Implementation Plan** for B4-DOC.

**This Plan does not authorize execution.** It does not authorize `git add`, `git commit`, `git push`, technical hardening changes, B5, Carlos activation, amend of the technical B4 commit, or any rewrite of published history.

Verbal Director authorization **does not** substitute the written B4-DOC Implementation Mandate.

---

## 2. Block classification

| Dimension | Official value |
|---|---|
| Canonical name | B4-DOC — B4 Documentary Reconciliation Follow-on |
| Classification | **DOCUMENTARY RECONCILIATION** |
| Nature | Follow-on documentary publication of an authority artifact that remained outside the technical B4 commit by design timing |
| Technical risk | NONE (forensic) |
| Documentary risk | LOW (forensic) |
| Option B consistency | YES |

**Explicit non-classifications (forbidden labels for this block):**

- technical implementation  
- hardening implementation  
- B5  
- activation  
- hotfix  
- amend  
- correction of the technical B4 commit  

---

## 3. Background

B4 technical publication completed under OPTION B with a closed authorized list of **exactly 10 paths**. That list was locked **before** the B4 Implementation Mandate was authored.

Consequently:

1. Technical B4 published successfully as commit `7282ddb8ca483d60b2d1bc898410640695fa5739`.
2. B4-07 push verification: PASS; local and remote HEAD aligned; ahead/behind `0/0`.
3. Forensic Scope Audit: PASS on technical scope; classified Mandate-outside-commit as **DESIGN ISSUE**, not technical failure.
4. Documentary Follow-on Discovery: PASS; determined a new independent documentary block is required.
5. The Mandate file remains the governing operational authority that executed B4, but was never staged into the technical commit — by design of the closed list, not by accidental omission of hardening content.

B4-DOC exists solely to reconcile that documentary gap without altering the immutable technical commit.

---

## 4. Official baseline

| Item | Official value |
|---|---|
| Repository | `C:\Users\Malolico\realestatesniper` |
| Official branch | `integration/factory-complete-20260725` |
| Official local HEAD | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| Official remote HEAD | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| Sync | `0` ahead / `0` behind |
| B4 technical status | COMPLETE / AUDITED / PUBLISHED / VERIFIED |
| B4-07 | PASS |
| Technical B4 commit | `7282ddb8ca483d60b2d1bc898410640695fa5739` — **immutable** |
| B4-DOC authorization at Plan creation / correction | **AUTHORIZED FOR PLANNING AND PLAN CORRECTIONS ONLY** |
| B5 | NOT STARTED / NOT AUTHORIZED |
| Carlos | NOT ACTIVATED / NOT AUTHORIZED in this block |
| Expected untracked Mandate | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| `core.hooksPath` (Manolo) | `.githooks` (must remain) |

**Immutability of technical B4 commit — absolute:**

- No amend  
- No rewrite  
- No reset  
- No rebase  
- No content alteration  
- No SHA alteration  

---

## 5. Problem statement

The operational Mandate that governed B4 technical publication exists on disk as an untracked file and is not present in the published Git history of commit `7282ddb8...`.

This creates a **documentary reconciliation gap**:

- Technical publication is complete and correct under OPTION B.
- Traceability of the Mandate as a versioned authority artifact is incomplete.
- Amending or rewriting the technical commit is forbidden and unnecessary.
- The gap must be closed by an independent documentary follow-on block with a single-path publication of the Mandate, after this Plan itself is versioned in a separate prior documentary commit, and only after the full mandatory governance chain in Section 13.

---

## 6. Objective

Publish the B4 Implementation Mandate into official Git history through a controlled, audited, Mandate-governed, Director-authorized documentary sequence that:

1. Leaves technical commit `7282ddb8...` untouched.
2. Publishes exactly one Mandate path in the B4-DOC implementation commit.
3. Prevents contamination of any other path.
4. Does not modify Mandate content during publication.
5. Captures and repeatedly verifies a cryptographic baseline of the Mandate (Section 13A).
6. Enforces the full mandatory governance chain before any git mutation.
7. Enforces pre-commit and post-commit validations.
8. Uses normal push only (never force).
9. Ends with local and remote HEAD aligned.
10. Keeps B5 completely separate and unstarted until its own Mandate after B4-DOC closeout.
11. Does not activate Carlos.
12. Ends with a clean working tree after the full B4-DOC sequence.
13. Makes each new commit a direct child of the then-current official published HEAD.
14. Preserves complete evidence of traceability.

---

## 7. Scope

B4-DOC scope is **documentary only** and consists of exactly two future commits (never combined), each authorized only after the mandatory governance chain and written B4-DOC Implementation Mandate:

### Commit A — Documentary Plan Commit

| Field | Value |
|---|---|
| Purpose | Version this Official Implementation Plan |
| Exclusive path | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| Parent | Must be direct child of official HEAD at time of commit (baseline parent expected: `7282ddb8ca483d60b2d1bc898410640695fa5739` if no intervening authorized commits) |

### Commit B — B4-DOC Implementation Commit

| Field | Value |
|---|---|
| Purpose | Publish the B4 Implementation Mandate without content change |
| Exclusive path | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| Parent | Must be direct child of Commit A (after Commit A is pushed, independently verified, and local/remote aligned) |

**Combining Commit A and Commit B into one commit is forbidden.**

---

## 8. Closed authorized file list

### For Commit A (Documentary Plan Commit) — closed list size = 1

1. `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md`

### For Commit B (B4-DOC Implementation Commit) — closed list size = 1

1. `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md`

No other path is authorized for staging, commit, or push content under B4-DOC.

**Execution authorization rule (absolute):**

- This Plan **never** authorizes `git add`, `git commit`, or `git push`.
- Publication of either path is authorized **only** by the written **B4-DOC Implementation Mandate**, after Independent Mandate Audit (and Mandate Verification Audit when corrections occurred), and after the corresponding **separate** Director authorization gates for Commit A, Push A, Commit B, and Push B.
- Verbal Director authorization **does not** substitute the written Mandate.
- No phase in Section 13 may be skipped.

---

## 9. Explicit out-of-scope

Out of scope for B4-DOC:

- Any modification to technical commit `7282ddb8...`
- Any amend, rebase, reset, rewrite, or force push
- Any change to Mandate B4 content (including normalize, reformat, rename, move, regenerate, replace, encoding change, line-ending change)
- Any additional documentation beyond the two authorized paths (in their respective commits)
- Hooks content changes
- Scripts changes
- `.gitignore` / `.gitattributes` changes
- Git config changes (except read-only verification of existing `core.hooksPath`)
- B5 planning, Mandates, implementation, or push (B5 may open **only after** B4-DOC closeout, via its own Mandate)
- Carlos activation or coordination
- Runtime / Factory / Supabase / Web / CB-* / IB-* / DB-* changes
- Staging of any path outside the closed lists above
- Trailer injection of any kind
- Combined Plan+Mandate commit
- Treating this Plan as an execution Mandate

---

## 10. Constitutional constraints

1. Technical B4 commit is immutable.
2. Documentary follow-on must not be disguised as technical correction.
3. OPTION B technical integrity remains the published truth for hardening artifacts.
4. Mandate B4 content is authority-of-record for what B4 executed; publication must not rewrite that record.
5. Plan and Mandate publications must remain separate commits.
6. No Co-authored-by / Signed-off-by / unaudited automatic metadata on official commits.
7. `core.hooksPath` must remain `.githooks`.
8. Official verifier must PASS at defined gates.
9. **B4-DOC Implementation Mandate is mandatory** before any git mutation.
10. **Independent Mandate Audit is mandatory** before Director execution gates.
11. **Corrections are mandatory** when an independent audit contains any actionable finding (MINOR or higher, or any Director-designated actionable INFORMATIONAL).
12. **Independent Verification Audit is mandatory** after every corrections round.
13. Director authorization is required as **separate gates** for Commit A, Push A, Commit B, and Push B; Director verbal approval does not replace the written Mandate.
14. Independent Plan Audit is mandatory before corrections / Mandate creation.
15. B5 remains NOT AUTHORIZED until after B4-DOC closeout and only via B5’s own Mandate; B4-DOC must not start B5.
16. Carlos must not be activated during B4-DOC.
17. **MANDATE B4 CRYPTOGRAPHIC BASELINE** (Section 13A) is mandatory and fail-closed.

---

## 11. Git constraints

**Allowed (only when the written B4-DOC Implementation Mandate and the matching Director gate authorize that exact step):**

- Targeted `git add -- <exact authorized path>`
- `git commit -m "<exact message>"` with hooks enabled (no `--no-verify`)
- Normal `git push origin HEAD:<official-branch>` (or equivalent non-force push of current HEAD to tracked upstream)

**Forbidden at all times under B4-DOC, including while only this Plan exists:**

- Any `git add` / `git commit` / `git push` authorized “by the Plan alone”
- `git add .` / broad adds  
- `git commit --amend`  
- `git commit --trailer ...` / any trailer injection  
- `git push --force` / `--force-with-lease`  
- `git reset` / `git restore` / `git checkout` / `git switch` (except if separately Director-authorized for emergency STOP recovery outside this Plan — default: forbidden)  
- `git clean` / `git stash` / `git merge` / `git rebase`  
- Any rewrite of `7282ddb8...`  

**Parent rule:**

- Each B4-DOC commit must be a **direct child** of the then-current official published HEAD.
- After Commit A push and independent post-push verification: HEAD advances; Commit B parent = Commit A SHA.
- No intermediate unauthorized commits.

---

## 12. Preconditions

### Global preconditions (before any B4-DOC git mutation)

1. Official branch is exactly `integration/factory-complete-20260725`.
2. Local HEAD equals remote HEAD.
3. Ahead/behind is `0/0`.
4. Staged set is empty.
5. `git config --local --get core.hooksPath` equals `.githooks`.
6. Official verifier PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git\verifyGitHardening.ps1`
7. Technical commit `7282ddb8...` still present and unchanged as ancestor/baseline reference.
8. B5 not started.
9. Carlos not activated for this block.
10. Independent Plan Audit completed.
11. All actionable Plan findings corrected; Independent Verification Audit of Plan corrections PASS (mandatory when corrections occurred; also mandatory whenever Independent Plan Audit was not a clean PASS without actionable findings).
12. Written **B4-DOC Implementation Mandate** exists and embeds the exact expected Mandate B4 SHA-256 baseline.
13. Independent Mandate Audit PASS (or PASS WITH OBSERVATIONS fully corrected).
14. If Mandate corrections occurred: Independent Verification Audit of Mandate PASS.
15. **MANDATE B4 CRYPTOGRAPHIC BASELINE** captured and recorded (Section 13A) **before** any `git add` related to B4-DOC.
16. Director has issued the **specific** gate authorization for the next allowed mutation only (Commit A, Push A, Commit B, or Push B — never bundled as a blanket “execute B4-DOC”).

### Additional precondition uniqueness

- Before Commit A: Mandate B4 remains untracked; cryptographic baseline still matches; only authorized pending documentary artifact for Commit A is this Plan.
- Before Commit B: this Plan is already published on local and remote; Mandate B4 is the sole authorized pending path; cryptographic baseline still matches.

---

## 13. Implementation sequence

**No phase may be skipped. Each gate requires independent evidence.**

### Mandatory ordered sequence (canonical)

| Step | Phase | Mutation allowed? |
|---|---|---|
| 1 | B4-DOC Implementation Plan creation | No git mutation |
| 2 | Independent Plan Audit | No git mutation |
| 3 | Corrections (mandatory if any actionable audit finding) | Plan file edit only; no git mutation |
| 4 | Independent Verification Audit of Plan corrections (mandatory when Step 3 occurred; mandatory after any actionable finding path) | No git mutation |
| 5 | B4-DOC Implementation Mandate written and specific | Create Mandate document only; no git mutation |
| 6 | Independent Mandate Audit | No git mutation |
| 7 | Corrections of the Mandate (mandatory if any actionable finding) | Mandate-of-execution edit only; **never** edit Mandate B4 publish target |
| 8 | Verification Audit of the Mandate (mandatory when Step 7 occurred) | No git mutation |
| 9 | Director authorization for Documentary Plan Commit | Authorization record only |
| 10 | Documentary Plan Commit (Commit A) | Only after Steps 1–9 and Section 13A baseline |
| 11 | Independent verification of Documentary Plan Commit | No further mutation until PASS |
| 12 | Director authorization for Documentary Plan Push | Authorization record only |
| 13 | Documentary Plan Push | Only after Step 12 |
| 14 | Independent post-push verification | No further mutation until PASS |
| 15 | Director authorization for B4-DOC Implementation Commit | Authorization record only |
| 16 | B4-DOC Implementation Commit (Commit B) | Only after Step 15; Mandate B4 SHA-256 must still match baseline |
| 17 | Independent verification of B4-DOC Implementation Commit | No further mutation until PASS |
| 18 | Director authorization for B4-DOC Implementation Push | Authorization record only |
| 19 | B4-DOC Implementation Push | Only after Step 18 |
| 20 | Independent post-push verification | No further mutation until PASS |
| 21 | B4-DOC closeout | Evidence pack + Director acceptance |
| 22 | B5 may open **only after** Step 21, via **B5’s own Mandate** | Outside B4-DOC |

### Phase notes

**Phase 0–4 — Plan creation, audit, corrections, verification (THIS DOCUMENT LIVES HERE UNTIL VERIFICATION AUDIT PASSES)**

1. Create / correct this Plan only.
2. Do not stage, commit, or push.
3. Leave Mandate B4 untracked and unmodified.
4. Capture Section 13A baseline **before any later `git add`** (baseline capture is mandatory before Step 10; may be captured earlier for evidence continuity, then re-verified).

**Phase 5–8 — B4-DOC Implementation Mandate + audits (mandatory)**

1. Author the written B4-DOC Implementation Mandate.
2. The Mandate **must** include the exact expected SHA-256 of Mandate B4 before authorizing execution.
3. Independent Mandate Audit is mandatory.
4. Corrections + Verification Audit are mandatory when findings are actionable.
5. Verbal Director approval does not replace this Mandate.

**Phase 9–14 — Commit A + Push A (separate Director gates)**

1. Pre-staging validation (Section 14 — Commit A gates) including SHA-256 match.
2. Stage exactly the Plan path.
3. Contamination checks.
4. Commit with exact message (Section 18).
5. Independent post-commit verification + SHA-256 re-check of Mandate B4.
6. Separate Director authorization for Push A.
7. Normal push.
8. Independent post-push verification + SHA-256 re-check.

**Phase 15–20 — Commit B + Push B (separate Director gates)**

1. Pre-staging validation (Section 14 — Commit B gates) including SHA-256 match before and after stage.
2. Stage exactly the Mandate B4 path.
3. Contamination checks.
4. Commit with exact message (Section 18).
5. Independent post-commit verification + SHA-256 re-check.
6. Separate Director authorization for Push B.
7. Normal push.
8. Independent post-push verification + SHA-256 re-check + clean working tree.

**Phase 21–22 — Closeout / B5 boundary**

1. Evidence pack complete, including cryptographic baseline evidence.
2. Declare B4-DOC COMPLETE only if Section 32 criteria all PASS.
3. Do not start B5 inside B4-DOC. B5 opens only after closeout via its own Mandate.

---

## 13A. MANDATE B4 CRYPTOGRAPHIC BASELINE

**Control name:** `MANDATE B4 CRYPTOGRAPHIC BASELINE`  
**Status:** MANDATORY · FAIL-CLOSED · IMMUTABLE DURING B4-DOC

### 13A.1 Capture requirement

Before executing any `git add` related to B4-DOC, capture the SHA-256 of:

`docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md`

Canonical capture example (PowerShell):

```powershell
Get-FileHash -LiteralPath 'docs\factory-construction\FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md' -Algorithm SHA256
(Get-Item -LiteralPath 'docs\factory-construction\FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md').Length
```

### 13A.2 Evidence record (mandatory fields)

The baseline evidence record must include:

| Field | Required |
|---|---|
| path | exact Mandate B4 path |
| size_bytes | file length in bytes |
| sha256 | SHA-256 hex digest |
| captured_at | date and time of capture |
| official_head | `git rev-parse HEAD` |
| official_branch | exact branch name |
| staged_state | staged count / staged paths |
| working_tree_state | `git status --short` snapshot |

That SHA-256 is the **immutable cryptographic baseline** for the entire B4-DOC block.

### 13A.3 Mandate-of-execution binding

The written B4-DOC Implementation Mandate **must** embed the exact expected baseline SHA-256 **before** authorizing any execution step. Execution without the embedded expected hash is forbidden.

### 13A.4 Mandatory re-verification gates

Recompute SHA-256 and require exact match to baseline at **every** gate below:

1. Before Documentary Plan Commit  
2. After Documentary Plan Commit  
3. Before Documentary Plan Push  
4. After Documentary Plan Push  
5. Before staging Mandate B4  
6. After staging Mandate B4  
7. Before B4-DOC Implementation Commit  
8. After B4-DOC Implementation Commit  
9. Before B4-DOC Implementation Push  
10. After B4-DOC Implementation Push  

### 13A.5 Fail-closed rule

If the SHA-256 differs from baseline at any moment:

```text
B4-DOC BLOCKED
STOP.
```

Do not stage further. Do not commit. Do not push. Escalate to Director with evidence.

### 13A.6 Mutation prohibitions on Mandate B4

During B4-DOC it is forbidden to:

- edit  
- normalize  
- reformat  
- rename  
- move  
- regenerate  
- replace  
- change encoding  
- change line endings  
- touch the file with editing tools in any way that alters content  
- perform any other mutation of Mandate B4  

### 13A.7 Final evidence

The baseline hash, all re-verification results, and size_bytes must be part of the B4-DOC final evidence pack. Final acceptance requires baseline match through the last post-push gate.

---

## 14. Pre-staging validation

### Before Documentary Plan Commit (Commit A)

Must all PASS:

| # | Check | Required result |
|---|---|---|
| A1 | Official branch exact | `integration/factory-complete-20260725` |
| A2 | Local HEAD exact | equals official published HEAD (baseline: `7282ddb8...` if no intervening authorized commits) |
| A3 | Remote HEAD exact | equals local HEAD |
| A4 | Ahead/behind | `0/0` |
| A5 | Staged empty | staged count = `0` |
| A6 | Only allowed pending change for Commit A | this Plan file present as the sole authorized new path to publish |
| A7 | Mandate B4 remains untracked | `?? docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| A8 | hooksPath | `.githooks` |
| A9 | Official verifier | PASS |
| A10 | Independent Plan Audit + Verification Audit path | complete per Section 13 Steps 2–4 |
| A11 | B4-DOC Implementation Mandate | written, audited, verification-complete per Steps 5–8 |
| A12 | Mandate B4 SHA-256 | equals cryptographic baseline (Section 13A) |
| A13 | Director gate | AUTHORIZED for **Commit A only** (not push) |

### Before B4-DOC Implementation Commit (Commit B)

Must all PASS:

| # | Check | Required result |
|---|---|---|
| B1 | Plan already published | Plan path exists in HEAD history |
| B2 | Local HEAD = remote HEAD | YES |
| B3 | Ahead/behind | `0/0` |
| B4 | Mandate is sole authorized pending path | YES |
| B5 | Before stage: Mandate B4 SHA-256 | equals baseline |
| B6 | After staging: staged contains exactly one path | Mandate path only |
| B7 | After stage: Mandate B4 SHA-256 | equals baseline |
| B8 | No other staged or modified files | YES |
| B9 | hooksPath | `.githooks` |
| B10 | Official verifier | PASS |
| B11 | Independent Commit A + Push A verifications | PASS |
| B12 | Director gate | AUTHORIZED for **Commit B only** (not push) |

**Mandate integrity rule:** If purely documentary verification proves objective corruption of Mandate B4, or SHA-256 diverges from baseline, **STOP** and declare **B4-DOC BLOCKED**. Do not “fix” content during B4-DOC publication.

---

## 15. Staging rules

1. Stage only with explicit path form: `git add -- <exact-path>`.
2. Commit A: stage only the Plan path.
3. Commit B: stage only the Mandate B4 path.
4. Never stage both in the same commit.
5. Never use `git add .` or wildcard expansion that could include other files.
6. Immediately after staging, run contamination checks (Section 16) and SHA-256 re-check (Section 13A).
7. If contamination or hash mismatch detected: do not commit; default STOP / B4-DOC BLOCKED.
8. No staging is authorized by this Plan alone.

---

## 16. Contamination checks

After staging and before commit, require:

```text
git diff --cached --name-only
```

| Commit | Required staged set |
|---|---|
| A | Exactly 1 path: the Plan path |
| B | Exactly 1 path: the Mandate B4 path |

Also require:

```text
git status --short
```

- No unexpected modified tracked files.
- No unexpected untracked files beyond the known remaining authorized artifact(s) for the phase.
- After Commit A (pre-Commit B): Mandate B4 may remain `??`.
- After Commit B: working tree must be clean (no pending authorized leftovers).
- For Commit B: SHA-256 after stage must equal baseline.

Any extra path or hash mismatch ⇒ **B4-DOC BLOCKED**.

---

## 17. Commit rules

1. Hooks must run (`core.hooksPath=.githooks`).
2. `--no-verify` forbidden.
3. `--amend` forbidden.
4. Parent must be current official HEAD (direct child).
5. Message must match Section 18 exactly (subject line as specified; body optional only if the written B4-DOC Implementation Mandate requires a specific audited body — default: subject-only exact match to base messages below).
6. No trailers (Section 19).
7. One path only per commit.
8. Do not include Plan and Mandate B4 together.
9. Commit is allowed only under the matching Director Commit gate and written Mandate step authorization.
10. Before and after each commit, verify Mandate B4 SHA-256 against baseline (Section 13A).

---

## 18. Commit message specification

### Commit A — Documentary Plan Commit (exact base message)

```text
docs(factory): plan B4 documentary reconciliation
```

### Commit B — B4-DOC Implementation Commit (exact base message)

```text
docs(factory): reconcile B4 implementation mandate
```

These are the **exact authorized subject lines**. Do not embellish with trailers or auto-metadata. If an agent or tool attempts to append Co-authored-by or similar, the commit must be rejected/recreated under Director control **without amend of the technical B4 commit** and without rewriting remote history; prefer abort and retry clean commit before any push.

---

## 19. Trailer prohibition

**Prohibited on both B4-DOC commits:**

- `Co-authored-by`
- `Signed-off-by`
- Any automatic unaudited metadata trailer
- `git commit --trailer ...`
- Any hook or agent post-processing that injects authorship trailers

Absence of trailers must be verified post-commit via `git log -1 --format=%B` (or equivalent full message inspection).

---

## 20. Hook requirements

1. `core.hooksPath` must be `.githooks` before commit.
2. Pre-commit guard must execute.
3. Official verifier must PASS before staging gates and after push gates.
4. Do not modify hook files during B4-DOC.
5. Do not disable hooks.

---

## 21. Push rules

1. Push only after independent post-commit verification PASS for that commit.
2. Push requires a **separate** Director authorization gate (Push A ≠ Commit A; Push B ≠ Commit B).
3. Normal push only to official branch upstream.
4. Force push forbidden (`--force`, `--force-with-lease`).
5. Push each commit separately in sequence (A then later B), each followed by independent post-push verification.
6. After each push: local HEAD must equal remote HEAD; ahead/behind `0/0`.
7. Before and after each push, verify Mandate B4 SHA-256 against baseline (Section 13A), including after Commit B when the file is tracked (hash of blob/content must still equal baseline).

---

## 22. Post-commit verification

After each commit, before any push authorization:

| Check | Required |
|---|---|
| Commit created | YES |
| Parent SHA | equals previous official HEAD |
| Paths in commit | exact closed list for that commit (size 1) |
| Path contents | as expected; Mandate B4 bytes/SHA-256 unchanged for Commit B |
| Mandate B4 SHA-256 vs baseline | MATCH |
| Trailers absent | YES |
| Staged empty | YES |
| Working tree | expected residual only (Mandate B4 untracked after A; clean after B) |
| B5 started | NO |
| Technical B4 SHA altered | NO |
| Independent verification | PASS before requesting Push Director gate |

---

## 23. Post-push verification

After each push:

| Check | Required |
|---|---|
| Local HEAD = remote HEAD | YES |
| Ahead/behind | `0/0` |
| Push type | normal (not force) |
| Official verifier | PASS |
| Branch | still `integration/factory-complete-20260725` |
| Mandate B4 SHA-256 vs baseline | MATCH |
| B5 started | NO |
| Independent post-push verification | PASS before next Director gate |

---

## 24. Working tree reconciliation

| Moment | Expected working tree |
|---|---|
| After Plan creation / corrections (now) | Plan untracked (or new/modified untracked); Mandate B4 untracked; staged 0; HEAD unchanged |
| After Commit A + Push A + verifications | Plan tracked in HEAD; Mandate B4 still `??`; staged 0; sync 0/0; SHA-256 match |
| After Commit B + Push B + verifications | Clean working tree; both paths in history; staged 0; sync 0/0; baseline evidence complete |

Any unexpected path or hash mismatch at any gate ⇒ **B4-DOC BLOCKED**.

---

## 25. Rollback prohibition

Under B4-DOC:

- No rollback via amend of published commits.
- No reset of published technical B4 commit.
- No rebase.
- No force push to “undo”.
- If a bad documentary commit is created **before push**, STOP and escalate to Director; do not invent rewrite procedures in this Plan.
- If a bad documentary commit is **already pushed**, STOP and escalate; recovery is outside this Plan and requires separate Director constitutional authorization.

Default posture: **forward-only documentary correction via new authorized commits**, never history rewrite.

---

## 26. Failure conditions

Declare failure (do not continue) if:

1. HEAD diverges unexpectedly from official remote.
2. Staged set ≠ exact closed list.
3. Mandate B4 content changes during B4-DOC / SHA-256 ≠ baseline.
4. Trailers appear in commit message.
5. HooksPath ≠ `.githooks`.
6. Verifier FAIL.
7. Force push attempted or required.
8. Any path outside closed lists appears.
9. Attempt to amend `7282ddb8...`.
10. B5 work begins inside this block.
11. Carlos activation begins inside this block.
12. Commit A and Commit B are combined.
13. Push succeeds but local/remote remain misaligned.
14. Any Section 13 phase is skipped.
15. Execution proceeds without written B4-DOC Implementation Mandate.
16. Execution proceeds on verbal Director authorization alone.
17. Commit and Push gates are bundled into a single blanket authorization.
18. Mandatory Verification Audit after corrections is skipped.
19. Independent Mandate Audit is skipped.
20. B4-DOC Implementation Mandate lacks the expected Mandate B4 SHA-256.

---

## 27. STOP conditions

Immediate STOP / **B4-DOC BLOCKED** if:

1. Objective corruption of Mandate B4 proven during documentary verification.
2. Mandate B4 SHA-256 diverges from cryptographic baseline at any Section 13A gate.
3. Unexpected tracked modifications appear.
4. Unexpected untracked files appear beyond authorized residuals.
5. Any required Director authorization missing at its specific gate.
6. Independent Plan Audit FAIL (unresolved).
7. Independent Verification Audit FAIL after corrections.
8. Independent Mandate Audit FAIL (unresolved).
9. Written B4-DOC Implementation Mandate missing.
10. Any forbidden git operation is requested as “shortcut”.
11. Technical B4 commit integrity is threatened.
12. Scope creep toward B5/Carlos/hardening code.
13. Attempt to treat this Plan as execution authority.

On STOP: do not commit; do not push; report evidence; await Director.

---

## 28. Evidence requirements

Retain / capture for audit:

1. Pre-gate `git status --short`, `git rev-parse HEAD`, `git rev-parse @{u}`, ahead/behind.
2. `git config --local --get core.hooksPath`.
3. Verifier stdout for each required PASS.
4. Independent Plan Audit verdict and Verification Audit verdict(s).
5. Written B4-DOC Implementation Mandate identity and Independent Mandate Audit / Verification Audit verdicts.
6. Separate Director authorization records for Commit A, Push A, Commit B, Push B.
7. **MANDATE B4 CRYPTOGRAPHIC BASELINE** full record (Section 13A.2) and every re-verification result at the ten mandatory gates.
8. `git diff --cached --name-only` immediately before each commit.
9. `git log -1 --format=%H%n%P%n%B` after each commit.
10. `git show --name-only --pretty=format: <commit>` path list proof.
11. Post-push sync proof (`0/0`, HEAD match).
12. Explicit statements: NO amend of technical B4; NO B5; NO Carlos; NO force push; NO Plan-as-Mandate execution.

---

## 29. Audit requirements

1. **Independent Plan Audit** of this document is mandatory.
2. **Corrections** are mandatory when the Plan audit contains any actionable finding.
3. **Independent Verification Audit** of Plan corrections is mandatory whenever corrections occurred (and whenever the actionable-finding path applies).
4. **B4-DOC Implementation Mandate** is mandatory and must be written and specific.
5. **Independent Mandate Audit** is mandatory.
6. **Mandate corrections** are mandatory when the Mandate audit contains any actionable finding.
7. **Independent Verification Audit of the Mandate** is mandatory whenever Mandate corrections occurred.
8. Auditor must not be the same unchecked self-approval loop without Director visibility.
9. Audits must confirm: classification, closed lists, two-commit separation, immutability of `7282ddb8...`, trailer ban, push rules, B5 separation, Carlos non-activation, cryptographic baseline control, separate Commit/Push Director gates, and that this Plan does not authorize execution.
10. Material contradictions ⇒ FAIL.
11. Implementation execution requires the written Mandate plus the matching Director gate after audits; this Plan alone never authorizes execution.

---

## 30. Director authorization gates

| Gate | Required Director action | Substitutable by verbal-only approval without written Mandate? |
|---|---|---|
| After Plan creation | Authorize Independent Plan Audit | N/A |
| After Plan Audit / Verification Audit path complete | Authorize creation of B4-DOC Implementation Mandate | No execution yet |
| After Mandate Audit / Verification Audit path complete | Review readiness | Still no git mutation |
| **Commit A** | Explicit authorization for Documentary Plan Commit only | **NO** — written Mandate required |
| **Push A** | Explicit authorization for Documentary Plan Push only | **NO** |
| **Commit B** | Explicit authorization for B4-DOC Implementation Commit only | **NO** |
| **Push B** | Explicit authorization for B4-DOC Implementation Push only | **NO** |
| After Push B verification | Accept B4-DOC COMPLETE (closeout) | N/A |
| After closeout | B5 may be opened only via B5’s own Mandate | Outside this block |

**Hard rules:**

- No gate may be skipped.
- Commit gates do not authorize push.
- Push gates do not authorize the next commit.
- Planning-only creation or correction of this Plan does **not** authorize Commit A, Push A, Commit B, or Push B.
- Verbal Director authorization **does not** substitute the written B4-DOC Implementation Mandate.

---

## 31. Relationship with B5

| Statement | Official value |
|---|---|
| B5 depends on B4-DOC for technical readiness | **NO** (per Documentary Follow-on Discovery) |
| B4-DOC may start B5 | **NO** |
| B5 started during B4-DOC | **FORBIDDEN** |
| Mixing B5 files into B4-DOC commits | **FORBIDDEN** |
| Carlos activation during B4-DOC | **FORBIDDEN** |
| When B5 may open | **Only after B4-DOC closeout (Section 13 Step 21)**, via **B5’s own Mandate** (Step 22) |

B5 remains a separate future block under separate authorization. Completing B4-DOC improves documentary traceability; it is not a B5 trigger and does not embed B5 work.

---

## 32. Final acceptance criteria

B4-DOC is COMPLETE only when all are true:

1. Full Section 13 governance chain completed with evidence (Steps 1–21).
2. Written B4-DOC Implementation Mandate existed before any git mutation and embedded the expected Mandate B4 SHA-256.
3. Independent Plan Audit + required Verification Audit path completed.
4. Independent Mandate Audit + required Verification Audit path completed.
5. Separate Director authorizations recorded for Commit A, Push A, Commit B, Push B.
6. Commit A exists on official branch with exact Plan path only and exact message base.
7. Commit B exists on official branch with exact Mandate B4 path only and exact message base.
8. Commit A parent chain connects from official pre-B4-DOC HEAD (`7282ddb8...` or authorized equivalent baseline).
9. Commit B is direct child of Commit A (no unauthorized intermediates).
10. Technical commit `7282ddb8...` unchanged in content and SHA.
11. No trailers on Commit A or B.
12. Local HEAD = remote HEAD; ahead/behind `0/0`.
13. Working tree clean.
14. hooksPath still `.githooks`; verifier PASS.
15. Mandate B4 content matches cryptographic baseline through all Section 13A gates; baseline evidence in final pack.
16. B5 not started; Carlos not activated.
17. Evidence pack complete; Director closeout acceptance recorded.

---

## 33. Exact expected final state

After full B4-DOC sequence (future; not this planning/correction step):

| Item | Expected |
|---|---|
| Branch | `integration/factory-complete-20260725` |
| Local HEAD | SHA of Commit B |
| Remote HEAD | same as local HEAD |
| Ahead/behind | `0/0` |
| Working tree | clean |
| Staged | `0` |
| Technical B4 commit | `7282ddb8ca483d60b2d1bc898410640695fa5739` still in history, unmodified |
| Plan path | tracked in history via Commit A |
| Mandate B4 path | tracked in history via Commit B |
| Mandate B4 SHA-256 | equals baseline captured before first B4-DOC `git add` |
| B4-DOC status | COMPLETE |
| B5 | NOT STARTED (may open only after closeout via own Mandate) |
| Carlos | NOT ACTIVATED |
| Force push used | NO |

### Expected state after THIS Plan correction step only

| Item | Expected |
|---|---|
| HEAD | `7282ddb8ca483d60b2d1bc898410640695fa5739` (unchanged) |
| Remote HEAD | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| Ahead/behind | `0/0` |
| Staged | `0` |
| Untracked | Plan (corrected) + Mandate B4 (unchanged) only |
| Mandate B4 content modified | NO |
| Commit executed | NO |
| Push executed | NO |
| B5 started | NO |
| Ready for Independent Verification Audit of Plan corrections | YES |
| Ready for Implementation Mandate | NO (only after Verification Audit PASS) |

---

## Appendix A — Two future commits (summary)

| ID | Message | Exclusive path |
|---|---|---|
| A | `docs(factory): plan B4 documentary reconciliation` | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| B | `docs(factory): reconcile B4 implementation mandate` | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |

**Never combine A and B.**

---

## Appendix B — Authority chain (mandatory, non-optional)

1. Forensic Scope Audit — PASS; DESIGN ISSUE on Mandate-outside-commit.  
2. Documentary Follow-on Discovery — PASS; new B4-DOC block required.  
3. This Official Implementation Plan — planning artifact only; **not** execution authority.  
4. Independent Plan Audit — mandatory.  
5. Plan Corrections — mandatory when actionable findings exist.  
6. Independent Verification Audit of Plan corrections — mandatory when corrections occurred / actionable-finding path applies.  
7. **B4-DOC Implementation Mandate** — **mandatory**; must embed Mandate B4 expected SHA-256.  
8. Independent Mandate Audit — mandatory.  
9. Mandate Corrections — mandatory when actionable findings exist.  
10. Independent Verification Audit of Mandate — mandatory when Mandate corrections occurred.  
11. Director gates — separate for Commit A, Push A, Commit B, Push B.  
12. Execution — only under written Mandate + matching Director gate.  
13. B4-DOC closeout.  
14. B5 — only after closeout, via B5’s own Mandate.

---

## Appendix C — Validation checklist for corrected Plan (A–L)

| ID | Requirement | Plan status |
|---|---|---|
| A | Mandatory chain Plan Audit → Corrections → Verification Audit → Implementation Mandate → Mandate Audit → Director Gate → Execution | Embedded in §13 / §29 / §30 / Appendix B |
| B | B4-DOC Implementation Mandate mandatory | YES |
| C | Mandate Audit mandatory | YES |
| D | Verification Audit mandatory after corrections | YES |
| E | Separate Director gates for Commit A, Push A, Commit B, Push B | YES |
| F | SHA-256 baseline mandatory | YES — §13A |
| G | Hash re-verified at all relevant gates | YES — §13A.4 |
| H | Fail-closed on hash change | YES — §13A.5 |
| I | Technical B4 commit immutable | YES |
| J | B5 fully isolated | YES — §31 / Step 22 |
| K | No implementation authorization inside this Plan | YES |
| L | No conditional wording making Mandate or audits optional | YES — Mandate and audits are unconditional obligations |

---

**END OF OFFICIAL IMPLEMENTATION PLAN — B4-DOC**

**PLANNING / PLAN-CORRECTION ONLY — NO PUBLICATION EXECUTED**  
**NO GIT ADD / COMMIT / PUSH AUTHORIZED BY THIS DOCUMENT**
