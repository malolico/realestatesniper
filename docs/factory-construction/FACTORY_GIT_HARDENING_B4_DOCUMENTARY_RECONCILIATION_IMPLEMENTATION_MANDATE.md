# FACTORY GIT HARDENING — B4-DOC
# OFFICIAL DOCUMENTARY RECONCILIATION IMPLEMENTATION MANDATE

| Campo | Valor |
|-------|--------|
| **Document title** | Factory Git Hardening — B4-DOC Documentary Reconciliation Implementation Mandate |
| **Block** | `B4-DOC — B4 Documentary Reconciliation Follow-on` |
| **Mandate ID** | `FACTORY-GIT-HARDENING-B4-DOC-IMPLEMENTATION` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_MANDATE.md` |
| **Classification** | **DOCUMENTARY RECONCILIATION IMPLEMENTATION MANDATE** |
| **Nature** | Normative · Executable · Fail-closed · Auditable · Single authority for B4-DOC A/B execution |
| **Parent Plan** | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| **Parent Plan SHA256 at Mandate creation** | `C1C6F9A702168229E5ECEEE0C08DF19F933AB2895A79B9E7585F62B4E5F0CD17` |
| **Protected Mandate B4 (publish target Phase B)** | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| **Mandate B4 SHA-256 (EXPECTED · IMMUTABLE)** | `0B0096167FE97E77F7E665BAE37066973214CDA73C861CC2098260F93624542F` |
| **Mandate B4 size_bytes at Mandate creation** | `11662` |
| **Authorized Documentary Residual (this file)** | See §4A — `B4-DOC MANDATE AUTHORIZED DOCUMENTARY RESIDUAL` |
| **Authorized operator** | Manolo (machine with `core.hooksPath=.githooks` already active) |
| **Official repository root** | `C:\Users\Malolico\realestatesniper` |
| **Official branch** | `integration/factory-complete-20260725` |
| **Official origin** | `https://github.com/malolico/realestatesniper.git` |
| **Technical B4 commit (immutable)** | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| **Pre-B4-DOC official HEAD** | `7282ddb8ca483d60b2d1bc898410640695fa5739` |
| **Corrections** | MINOR-1 (authorized residual / closeout model); INFORMATIONAL-1 (incorrect repository root STOP + evidence) |
| **Date** | 2026-07-31 |

---

## MANDATE STATUS

```text
MANDATE STATUS:
Independent Audit: PASSED
Commit: COMPLETED
Push: COMPLETED
Repository Status: SYNCHRONIZED
Local HEAD = Remote HEAD
Working Tree Clean (except this documentary file while being updated)

IMPLEMENTATION AUTHORIZED:
YES — A/B EXECUTED AND PUBLISHED

DIRECTOR AUTHORIZATION REQUIRED:
NO — A/B GATES COMPLETED
```

B4-DOC Phase A/B has been executed and published. This Mandate remains the authority-of-record for that A/B execution and may be published into Git as the remaining documentary residual after B4 A/B closure.

---

## 1. Object of B4-DOC

B4-DOC publishes two **separate** documentary commits that reconcile the B4 Implementation Mandate into official Git history without altering the immutable technical B4 commit.

### PHASE A — DOCUMENTARY PLAN PUBLICATION

| Field | Value |
|---|---|
| Commit | Commit A — Documentary Plan Commit |
| Exclusive path | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| Exact message | `docs(factory): plan B4 documentary reconciliation` |

### PHASE B — B4 MANDATE RECONCILIATION

| Field | Value |
|---|---|
| Commit | Commit B — B4-DOC Implementation Commit |
| Exclusive path | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |
| Exact message | `docs(factory): mandates B4 documentary reconciliation` |

**Combining Phase A and Phase B paths or commits is forbidden.**

After successful Phase A and Phase B:

- Phase A may be COMPLETE / PUBLISHED / VERIFIED  
- Phase B may be COMPLETE / PUBLISHED / VERIFIED  
- B4-DOC Implementation A/B is COMPLETE  
- B4-DOC global closeout proceeds by publishing this Mandate residual into Git after A/B closure

---

## 2. Authority

This document is the **sole Official Implementation Mandate** governing B4-DOC **Phase A/B** execution.

- Parent Plan is binding reference for governance; **execution authority for A/B is this Mandate only**.
- Parent Plan does **not** authorize `git add`, `git commit`, or `git push`.
- Technical B4 Mandate remains historical authority for what B4 executed; its **content must not be modified** during B4-DOC.
- Independent audits and separate Director gates remain mandatory per §6.
- After A/B completion, this Mandate may be published into Git as the remaining documentary residual.

---

## 3. What this Mandate does NOT authorize

This Mandate does **not**:

- reopen B4 technical implementation;
- modify commit `7282ddb8ca483d60b2d1bc898410640695fa5739`;
- authorize amend, rewrite, reset, rebase, or force push;
- authorize technical hardening changes;
- authorize B5;
- authorize Carlos activation;
- authorize Web / Supabase / scripts / hooks / Git config changes;
- authorize combining Commit A and Commit B;
- authorize modifying Mandate B4 original content;
- authorize modifying the Plan after its Commit A except under formal FAIL and a new Mandate;
- auto-authorize Commit A or Commit B outside the completed A/B Director gates.

---

## 4. Closed authorized file lists

### 4.1 Phase A — closed list size = 1

1. `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md`

### 4.2 Phase B — closed list size = 1

1. `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md`

### 4.3 Forbidden in Commit A / Commit B

- any third path;
- staging both Phase paths in one commit;
- technical files;
- hooks / scripts / config;
- **this B4-DOC Mandate file** (see §4A).

Default B4-DOC A/B publish targets remain exactly the two paths above. No expansion of closed scope A/B is authorized by this Mandate.

---

## 4A. B4-DOC MANDATE AUTHORIZED DOCUMENTARY RESIDUAL

**Control name:** `B4-DOC MANDATE AUTHORIZED DOCUMENTARY RESIDUAL`  
**Status:** MANDATORY · CONSCIOUS · FAIL-CLOSED · OUTSIDE COMMIT A/B

### 4A.1 Residual path (exact)

```text
docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_MANDATE.md
```

### 4A.2 Classification

This path is classified as:

```text
AUTHORIZED DOCUMENTARY RESIDUAL
```

Its exclusion from Commit A and Commit B is **conscious, deliberate, and necessary** to preserve the Plan’s closed A/B scope.

### 4A.3 What the residual is NOT

The residual is **not**:

- unexpected contamination;
- a third path authorized for Commit A or Commit B;
- content of Commit A;
- content of Commit B;
- authorization to modify it during A/B;
- content that was authorized inside Commit A or Commit B;
- a general exception to the closed A/B scope during A/B execution.

### 4A.4 Required residual state during A/B

Throughout Phase A and Phase B the residual file must remain:

- untracked;
- unstaged;
- unmodified (relative to the audited Mandate content then in force for execution);
- outside Commit A;
- outside Commit B.

### 4A.5 Expected working-tree model (A/B)

Do **not** require a fully clean working tree after Push A or Push B while the residual exists.

Required formulation:

```text
WORKING TREE CONFORMS TO THE AUTHORIZED RESIDUAL MODEL
```

**EXPECTED WORKING TREE ITEMS** by phase:

| Moment | Expected items only |
|---|---|
| Pre-Commit A | Phase A path (Plan) pending as authorized publish target + this residual + Mandate B4 still pending for Phase B |
| Post-Commit A / Post-Push A | Residual + Mandate B4 still untracked (Plan now tracked) |
| Pre-Commit B | Residual + Mandate B4 as sole pending Phase B publish target |
| Post-Commit B / Post-Push B | Residual only (Plan + Mandate B4 tracked); **no other paths** |

Any other path ⇒ **B4-DOC BLOCKED** / **STOP**.

### 4A.6 Residual integrity STOP

If the residual:

- changes content unexpectedly during A/B execution;  
- is staged;  
- enters Commit A;  
- enters Commit B;  
- disappears unexpectedly;  
- is renamed;  
- is moved;

then:

```text
B4-DOC BLOCKED
STOP.
```

### 4A.7 Status model after Push B verification

After Push B and independent verification PASS:

| Status layer | Allowed result |
|---|---|
| PHASE A STATUS | COMPLETE / PUBLISHED / VERIFIED |
| PHASE B STATUS | COMPLETE / PUBLISHED / VERIFIED |
| B4-DOC IMPLEMENTATION A/B STATUS | COMPLETE |
| Two-document reconciliation (Plan + Mandate B4) | COMPLETE |
| Independent Audit | PASSED |
| Commit | COMPLETED |
| Push | COMPLETED |
| Repository Status | SYNCHRONIZED |
| Local HEAD = Remote HEAD | YES |
| Working Tree | Clean except this documentary residual while being updated/published |
| B4-DOC GLOBAL CLOSEOUT | COMPLETE upon publication of this Mandate residual |
| B4-DOC FULLY CLOSED | YES upon publication of this Mandate residual |

Exact status banner after A/B publication:

```text
Independent Audit: PASSED
Commit: COMPLETED
Push: COMPLETED
Repository Status: SYNCHRONIZED
Local HEAD = Remote HEAD
Working Tree Clean (except this documentary file while being updated)
IMPLEMENTATION A/B COMPLETE
```

### 4A.8 Residual publication after A/B closure

A/B has been executed and published. Publication of this B4-DOC Mandate residual into Git is the remaining documentary closure step. It is not blocked by any later independent Mandate requirement.

That residual publication:

- is **not** part of Commit A;
- is **not** part of Commit B;
- does **not** reopen B4 technical implementation;
- must not combine with B5;
- must not activate Carlos.

Upon publication of this residual, B4-DOC may receive **FULLY CLOSED**.

### 4A.9 B5 dependency on FULLY CLOSED

B5 remains **prohibited** by this Mandate until B4-DOC has reached **FULLY CLOSED** by publication of this residual, unless a separate constitutional Director decision explicitly modifies that dependency. No such decision is authorized by this Mandate.

---

## 5. MANDATE B4 CRYPTOGRAPHIC BASELINE

### 5.1 Expected hash (literal · immutable)

```text
SHA256 EXPECTED:
0B0096167FE97E77F7E665BAE37066973214CDA73C861CC2098260F93624542F
```

Path:

```text
docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md
```

### 5.2 Capture before any `git add` related to B4-DOC

Before the first B4-DOC `git add`, capture and record:

| Field | Required |
|---|---|
| repository_root | must equal `C:\Users\Malolico\realestatesniper` |
| path | exact Mandate B4 path |
| size_bytes | file length in bytes |
| sha256 | SHA-256 hex digest |
| captured_at | date and time |
| official_head | `git rev-parse HEAD` |
| official_branch | exact branch name |
| staged_state | staged count / paths |
| working_tree_state | `git status --short` (must conform to authorized residual model) |

Canonical capture:

```powershell
(Get-Location).Path
Get-FileHash -LiteralPath 'docs\factory-construction\FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md' -Algorithm SHA256
(Get-Item -LiteralPath 'docs\factory-construction\FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md').Length
git rev-parse HEAD
git branch --show-current
git status --short
git diff --cached --name-only
```

Actual SHA-256 **must equal** the EXPECTED value above. If not:

```text
B4-DOC BLOCKED
STOP.
```

### 5.3 Ten mandatory re-verification gates

Recompute SHA-256 and require exact match to EXPECTED at:

1. Before Documentary Plan Commit  
2. After Documentary Plan Commit  
3. Before Documentary Plan Push  
4. After Documentary Plan Push  
5. Before stage of Mandate B4  
6. After stage of Mandate B4  
7. Before B4-DOC Implementation Commit  
8. After B4-DOC Implementation Commit  
9. Before B4-DOC Implementation Push  
10. After B4-DOC Implementation Push  

### 5.4 Fail-closed

If SHA-256 differs from EXPECTED at any moment:

```text
B4-DOC BLOCKED
STOP.
```

### 5.5 Mutation prohibitions on Mandate B4

Forbidden during B4-DOC:

- edit · normalize · reformat · rename · move · regenerate · replace  
- change encoding · change line endings  
- any content mutation  

---

## 6. Mandatory gate sequence

**No gate may be skipped. No gates may be combined.**  
Commit authorization ≠ push authorization.  
Phase A authorization ≠ Phase B authorization.

| Step | Gate | Git mutation? |
|---|---|---|
| 1 | Mandate creation / correction (this document) | No |
| 2 | Independent Mandate Audit | No |
| 3 | Corrections if actionable findings | Edit this Mandate only if required; **never** Mandate B4; residual rules still apply |
| 4 | Verification Audit of Mandate if corrections occurred | No |
| 5 | Director authorization for Commit A | No |
| 6 | Commit A | Yes — Plan path only |
| 7 | Independent verification of Commit A | No |
| 8 | Director authorization for Push A | No |
| 9 | Push A | Yes — normal push only |
| 10 | Independent post-push verification | No |
| 11 | Director authorization for Commit B | No |
| 12 | Commit B | Yes — Mandate B4 path only |
| 13 | Independent verification of Commit B | No |
| 14 | Director authorization for Push B | No |
| 15 | Push B | Yes — normal push only |
| 16 | Independent post-push verification | No |
| 17 | A/B closeout record (Implementation A/B COMPLETE; global closeout BLOCKED per §4A) | No residual publication |
| 18 | B5 remains prohibited until FULLY CLOSED (§4A.9); residual publication closes B4-DOC documentary authority | Outside A/B |

---

## 7. Preconditions (before any future execution mutation)

All must be true:

| # | Precondition | Expected |
|---|---|---|
| 1 | Repository root | exactly `C:\Users\Malolico\realestatesniper` |
| 2 | Official branch | `integration/factory-complete-20260725` |
| 3 | Official origin | `https://github.com/malolico/realestatesniper.git` |
| 4 | Local HEAD (pre-Commit A) | `7282ddb8ca483d60b2d1bc898410640695fa5739` unless already advanced solely by authorized prior B4-DOC Commit A |
| 5 | Remote HEAD equals local HEAD | YES |
| 6 | Ahead/behind | `0/0` |
| 7 | Staged | `0` before each staging operation |
| 8 | `core.hooksPath` | `.githooks` |
| 9 | Official verifier | PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\git\verifyGitHardening.ps1` |
| 10 | Working tree | conforms to **AUTHORIZED RESIDUAL MODEL** (§4A); no unexpected paths |
| 11 | Residual present | B4-DOC Mandate path untracked / unstaged / not in A/B |
| 12 | Mandate B4 SHA-256 | `0B0096167FE97E77F7E665BAE37066973214CDA73C861CC2098260F93624542F` |
| 13 | Technical B4 commit intact | `7282ddb8ca483d60b2d1bc898410640695fa5739` unmodified |
| 14 | B5 started | NO |
| 15 | Carlos activated | NO |
| 16 | This Mandate audited | Independent Mandate Audit complete; Verification Audit complete if corrections occurred |
| 17 | Matching Director gate | Issued for the next step only |

### Phase A expected working tree

EXPECTED WORKING TREE ITEMS only:

- Plan path as the Phase A authorized publish target (until committed);
- Mandate B4 still pending for Phase B;
- B4-DOC Mandate as **AUTHORIZED DOCUMENTARY RESIDUAL**;
- no other path.

### Phase B expected working tree

EXPECTED WORKING TREE ITEMS only:

- Mandate B4 as the Phase B authorized publish target (until committed);
- B4-DOC Mandate as **AUTHORIZED DOCUMENTARY RESIDUAL**;
- no other path.

Unexpected paths ⇒ **B4-DOC BLOCKED**.

---

## 8. Phase A — executable rules

### 8.1 Staging

```text
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md
```

Then verify:

```text
git diff --cached --name-only
```

Must show **exactly** that one path. Residual must remain unstaged.

### 8.2 Commit A rules

| Rule | Value |
|---|---|
| Parent | exact official HEAD at time of commit (pre-B4-DOC: `7282ddb8ca483d60b2d1bc898410640695fa5739`) |
| Paths | Plan path only |
| Message | exactly `docs(factory): plan B4 documentary reconciliation` |
| Body | none (no unaudited additional body) |
| Trailers | none |
| Co-authored-by | forbidden |
| Signed-off-by | forbidden |
| Amend | forbidden |
| `--no-verify` | forbidden |
| Hooks | must run (`core.hooksPath=.githooks`) |
| Residual | must remain outside the commit |

```text
git commit -m "docs(factory): plan B4 documentary reconciliation"
```

### 8.3 Push A rules

Only after independent Commit A verification PASS **and** separate Director Push A authorization:

```text
git push origin HEAD:integration/factory-complete-20260725
```

(or equivalent non-force push to the tracked official upstream)

Forbidden: `--force`, `--force-with-lease`, `--all`, `--mirror`.

### 8.4 Phase A post-commit / post-push required state

- local HEAD = remote HEAD (after push)  
- ahead/behind `0/0` (after push)  
- staged `0`  
- verifier PASS  
- Mandate B4 SHA-256 = EXPECTED  
- **WORKING TREE CONFORMS TO THE AUTHORIZED RESIDUAL MODEL** (residual + Mandate B4 still untracked; Plan tracked)  
- residual still untracked / unstaged / unmodified / not in Commit A  
- B5 not started · Carlos not activated  
- Phase A may be marked COMPLETE / PUBLISHED / VERIFIED after independent post-push verification  

**Do not require working tree clean after Push A.**

---

## 9. Phase B — executable rules

### 9.1 Staging

Before and after stage: SHA-256 must equal EXPECTED. Residual must remain unstaged.

```text
git add -- docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md
```

```text
git diff --cached --name-only
```

Must show **exactly** that one path.

### 9.2 Commit B rules

| Rule | Value |
|---|---|
| Parent | exact published Commit A SHA |
| Paths | Mandate B4 path only |
| Message | exactly `docs(factory): mandates B4 documentary reconciliation` |
| Body | none (no unaudited additional body) |
| Trailers | none |
| Co-authored-by | forbidden |
| Signed-off-by | forbidden |
| Amend | forbidden |
| `--no-verify` | forbidden |
| Content | byte-identical to cryptographic baseline |
| Residual | must remain outside the commit |

```text
git commit -m "docs(factory): mandates B4 documentary reconciliation"
```

### 9.3 Push B rules

Only after independent Commit B verification PASS **and** separate Director Push B authorization. Same normal-push rules as §8.3.

### 9.4 Phase B post-commit / post-push required state

- local HEAD = remote HEAD (after push)  
- ahead/behind `0/0` (after push)  
- staged `0`  
- verifier PASS  
- Mandate B4 content SHA-256 still EXPECTED  
- technical B4 commit still intact in history  
- **WORKING TREE CONFORMS TO THE AUTHORIZED RESIDUAL MODEL** — residual only; no other untracked/modified paths  
- residual still untracked / unstaged / not in Commit B  
- B5 not started · Carlos not activated  
- Phase B may be marked COMPLETE / PUBLISHED / VERIFIED  
- B4-DOC Implementation A/B may be marked COMPLETE  
- Independent Audit: PASSED · Commit: COMPLETED · Push: COMPLETED · Repository Status: SYNCHRONIZED · Local HEAD = Remote HEAD  
- Working Tree Clean (except this documentary residual while being updated/published)  
- B4-DOC global closeout completes upon publication of this Mandate residual  

**Do not require working tree clean after Push B while the residual remains unpublished.**  
**Upon residual publication, B4-DOC may be declared FULLY CLOSED.**

---

## 10. Absolute prohibitions

Forbidden under this Mandate:

- `git reset` · `git restore` · `git checkout` · `git switch` · `git clean` · `git stash`  
- `git merge` · `git rebase` · `git commit --amend`  
- `git push --force` · `git push --force-with-lease` · `git push --all` · `git push --mirror`  
- modify technical B4 commit  
- modify Plan outside authorized Commit A  
- modify Mandate B4 original content  
- combine Commit A and Commit B  
- stage / commit / push the B4-DOC Mandate residual **during Commit A or Commit B**  
- start B5 · activate Carlos  
- touch Web · Supabase · scripts · hooks · Git configuration  

---

## 11. STOP conditions

Declare immediately:

```text
B4-DOC BLOCKED
STOP.
```

If any of:

- **INCORRECT REPOSITORY ROOT** (actual root ≠ `C:\Users\Malolico\realestatesniper`)  
- incorrect branch  
- incorrect origin  
- unexpected local HEAD  
- unexpected remote HEAD  
- unexpected ahead/behind  
- staged non-empty when required empty  
- working tree does **not** conform to the authorized residual model  
- unexpected contamination (any path outside the expected residual model)  
- residual staged / committed / renamed / moved / missing / unexpectedly modified during A/B  
- Mandate B4 SHA-256 ≠ EXPECTED  
- additional path staged or committed beyond the single Phase path  
- trailer added  
- commit message differs from exact authorized text  
- incorrect parent  
- verifier FAIL  
- hooksPath ≠ `.githooks`  
- push rejected  
- amend attempted  
- force push attempted  
- any B5 start  
- any Carlos activation  

On STOP: do not commit further; do not push; preserve evidence; await Director.

---

## 12. Evidence requirements (every gate)

Capture for each gate:

| Evidence field | Required |
|---|---|
| repository_root | YES — must equal `C:\Users\Malolico\realestatesniper` |
| branch | YES |
| origin | YES |
| HEAD local | YES |
| HEAD remote | YES |
| parent | YES (for commits) |
| ahead/behind | YES |
| staged | YES |
| working tree | YES — must record residual-model conformance (not “clean” while residual exists) |
| authorized residual path present / untracked / unstaged | YES |
| hooksPath | YES |
| verifier | YES |
| path list of commit | YES (post-commit) |
| commit message | YES (post-commit) |
| trailers | YES (must be absent) |
| push result | YES (post-push) |
| SHA-256 expected | `0B0096167FE97E77F7E665BAE37066973214CDA73C861CC2098260F93624542F` |
| SHA-256 actual | YES |
| SHA-256 match | YES |
| B5 status | must be NOT STARTED |
| Carlos activation status | must be NOT ACTIVATED |
| A/B vs global closeout status | YES after Push B |

Baseline cryptographic capture (§5.2) and all ten re-verification results are mandatory in the final A/B evidence pack.

---

## 13. Failure conditions

Declare failure (do not continue) if:

1. Repository root incorrect.  
2. HEAD diverges unexpectedly from official remote.  
3. Staged set ≠ exact closed list for the active Phase.  
4. Mandate B4 content changes / SHA-256 ≠ EXPECTED.  
5. Residual violates §4A.6.  
6. Trailers appear in commit message.  
7. HooksPath ≠ `.githooks`.  
8. Verifier FAIL.  
9. Force push attempted or required.  
10. Any path outside closed A/B lists appears in a commit.  
11. Attempt to amend `7282ddb8...`.  
12. B5 work begins.  
13. Carlos activation begins.  
14. Commit A and Commit B are combined.  
15. Push succeeds but local/remote remain misaligned.  
16. Any §6 phase is skipped.  
17. Execution proceeds without written Mandate + matching Director gate.  
18. Working tree required to be “clean” in a way that denies the authorized residual during A/B.

---

## 14. Final acceptance criteria

### 14.1 Phase A acceptance (may COMPLETE)

1. Commit A on official branch: Plan path only; exact message; no trailers; parent correct.  
2. Push A normal, verified; HEAD sync `0/0`.  
3. Residual still authorized / untracked / unstaged / not in Commit A.  
4. Mandate B4 SHA-256 still EXPECTED.  
5. Working tree conforms to authorized residual model.

### 14.2 Phase B acceptance (may COMPLETE)

1. Commit B on official branch: Mandate B4 path only; exact message; no trailers; parent = Commit A.  
2. Push B normal, verified; HEAD sync `0/0`.  
3. Mandate B4 SHA-256 remained EXPECTED through all ten gates.  
4. Residual still authorized / untracked / unstaged / not in Commit B.  
5. Working tree conforms to authorized residual model (residual only).

### 14.3 B4-DOC Implementation A/B acceptance (may COMPLETE)

All of §14.1–§14.2 true; technical commit `7282ddb8...` unmodified; hooksPath `.githooks`; verifier PASS; B5 not started; Carlos not activated; evidence pack for A/B complete.

### 14.4 B4-DOC global closeout

After A/B completion and publication of this Mandate residual:

```text
Independent Audit: PASSED
Commit: COMPLETED
Push: COMPLETED
Repository Status: SYNCHRONIZED
Local HEAD = Remote HEAD
Working Tree Clean (except this documentary file while being updated)
IMPLEMENTATION A/B COMPLETE
B4-DOC FULLY CLOSED: YES
```

Publication of this residual after A/B closure completes B4-DOC documentary authority. It does not reopen B4 technical implementation and does not authorize B5 or Carlos.

---

## 15. Exact expected final state after A/B

| Item | Expected |
|---|---|
| Branch | `integration/factory-complete-20260725` |
| Origin | `https://github.com/malolico/realestatesniper.git` |
| Repository root | `C:\Users\Malolico\realestatesniper` |
| Local HEAD | SHA of Commit B |
| Remote HEAD | same as local |
| Ahead/behind | `0/0` |
| Working tree | Clean except this documentary residual while being updated/published |
| Staged | `0` |
| Technical B4 commit | `7282ddb8ca483d60b2d1bc898410640695fa5739` intact |
| Mandate B4 SHA-256 | `0B0096167FE97E77F7E665BAE37066973214CDA73C861CC2098260F93624542F` |
| Phase A | COMPLETE / PUBLISHED / VERIFIED |
| Phase B | COMPLETE / PUBLISHED / VERIFIED |
| Implementation A/B | COMPLETE |
| Independent Audit | PASSED |
| Commit | COMPLETED |
| Push | COMPLETED |
| Repository Status | SYNCHRONIZED |
| Global closeout | COMPLETE upon residual publication |
| FULLY CLOSED | YES upon residual publication |
| B5 | NOT STARTED |
| Carlos | NOT ACTIVATED |

---

## 16. Closeout and residual publication (summary)

1. A/B has been executed and published.  
2. Publication of this Mandate residual completes B4-DOC documentary closeout.  
3. Residual publication is outside Commit A and Commit B.  
4. It must not be combined with B5 and must not activate Carlos.  
5. Status after A/B:

```text
Independent Audit: PASSED
Commit: COMPLETED
Push: COMPLETED
Repository Status: SYNCHRONIZED
Local HEAD = Remote HEAD
Working Tree Clean (except this documentary file while being updated)
```

---

## 17. Expected state after THIS Mandate correction only

| Item | Expected |
|---|---|
| Local HEAD | equals Remote HEAD (Commit B published) |
| Ahead/behind | `0/0` |
| Staged | `0` |
| Untracked | this B4-DOC Mandate only (while being updated) |
| Mandate B4 modified | NO |
| Plan modified by this step | NO |
| A/B Commit / Push | COMPLETED |
| Independent Audit | PASSED |
| Repository Status | SYNCHRONIZED |
| Working Tree | Clean except this documentary file while being updated |

---

## Appendix A — Status layers (canonical)

| Layer | Status after A/B |
|---|---|
| PHASE A STATUS | COMPLETE / PUBLISHED / VERIFIED |
| PHASE B STATUS | COMPLETE / PUBLISHED / VERIFIED |
| B4-DOC IMPLEMENTATION A/B STATUS | COMPLETE |
| Independent Audit | PASSED |
| Commit | COMPLETED |
| Push | COMPLETED |
| Repository Status | SYNCHRONIZED |
| B4-DOC GLOBAL CLOSEOUT | COMPLETE upon residual publication |
| B4-DOC FULLY CLOSED | YES upon residual publication |

---

## Appendix B — Two commits (executed)

| ID | Message | Exclusive path |
|---|---|---|
| A | `docs(factory): plan B4 documentary reconciliation` | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_DOCUMENTARY_RECONCILIATION_IMPLEMENTATION_PLAN.md` |
| B | `docs(factory): mandates B4 documentary reconciliation` | `docs/factory-construction/FACTORY_GIT_HARDENING_B4_IMPLEMENTATION_MANDATE.md` |

**Never combine A and B. Never include the residual path in A or B.**

---

**END OF OFFICIAL B4-DOC IMPLEMENTATION MANDATE**

```text
MANDATE ID:
FACTORY-GIT-HARDENING-B4-DOC-IMPLEMENTATION

MANDATE STATUS:
Independent Audit: PASSED
Commit: COMPLETED
Push: COMPLETED
Repository Status: SYNCHRONIZED
Local HEAD = Remote HEAD
Working Tree Clean (except this documentary file while being updated)

IMPLEMENTATION A/B:
COMPLETED

B4-DOC MANDATE AUTHORIZED DOCUMENTARY RESIDUAL:
ACTIVE — READY FOR PUBLICATION AFTER A/B CLOSURE

B4-DOC FULL CLOSEOUT:
COMPLETE UPON RESIDUAL PUBLICATION
```
