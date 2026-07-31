# FACTORY GIT HARDENING — OPERATIONS PROTOCOL

| Campo | Valor |
|-------|--------|
| **Document ID** | `FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
| **Path** | `docs/factory-construction/FACTORY_GIT_HARDENING_OPS_PROTOCOL.md` |
| **Program** | RealEstateSniper Factory 2.0 — Factory Git Hardening |
| **Parent Plan** | `FACTORY_GIT_HARDENING_PHASE_B_OFFICIAL_IMPLEMENTATION_PLAN.md` |
| **Date** | 2026-07-31 |

---

## 1. Identity

Official operational protocol for shared Git Hardening protections and dual-operator (Manolo / Carlos) local activation.

## 2. Objective

Prevent accidental republication of local Factory runtime stores and specific root artifacts, without deleting physical data, without ignoring `data/factory-dso-packs/`, and without modifying Factory functional code.

## 3. Threats covered

- Accidental `git add .` of protected runtime stores / root artifacts (via `.gitignore`).
- Accidental or forced staging of denylist paths (via guard + versioned hook when activated).
- Commits without denylist review when local `core.hooksPath=.githooks` is active.

## 4. Threats not covered (deliberate / residual)

- `git add -f` on ignored paths.
- `git commit --no-verify`.
- Manual disable/edit of guard or hook.
- Machine without local `core.hooksPath` activation.
- Missing `node` on PATH (blocks commits when hook active).
- Absolute protection is **not** claimed — staged-diff review remains mandatory.

## 5. Forbidden paths (denylist)

Runtime stores (directory-level):

- `data/factory-compliance/`
- `data/factory-distress/`
- `data/factory-economy/`
- `data/factory-environment/`
- `data/factory-evidence/`
- `data/factory-foundation/`
- `data/factory-intelligence/`
- `data/factory-legitimacy/`
- `data/factory-registry/`

Root artifacts:

- `estructura_repo.txt`
- root names starting with `ersMalolicorealestatesniper` (including U+F03E)

Never use global `/data/` ignore.

## 6. Expressly allowed

- `data/factory-dso-packs/` (including the six historical Maricopa pilot files)
- All other non-denylist project paths

## 7. Shared protection (GitHub)

- `.gitignore` path-specific rules
- `.gitattributes` (`.githooks/* text eol=lf`)
- `.githooks/pre-commit`
- `scripts/git/guardStagedForbiddenPaths.js`
- `scripts/git/installGitHardening.ps1`
- `scripts/git/verifyGitHardening.ps1`
- This protocol

**Canonical guard invocation:**

```powershell
node scripts/git/guardStagedForbiddenPaths.js
```

(`package.json` script is intentionally excluded.)

## 8. Local activation

Shared files do **not** set `core.hooksPath`. Each machine must activate:

```powershell
powershell -File scripts/git/installGitHardening.ps1
powershell -File scripts/git/installGitHardening.ps1 -Apply
```

Dry-run first. `-Apply` only under Director GATE B3 (Manolo) or B5 (Carlos). Never `--global`.

Installer inventories `.git/hooks`, excludes only `*.sample`, and blocks if any real hook exists.

## 9. Manolo procedure

1. Sync official branch/HEAD after Implementation Audit PASS.
2. Confirm artifacts present.
3. Installer dry-run → GATE B3 `-Apply`.
4. `powershell -File scripts/git/verifyGitHardening.ps1` → PASS.
5. Only then GATE B4: exact `git add --`, guard, staged review, commit, push.

## 10. Carlos procedure

1. Stop prior work.
2. Sync from published official HEAD only.
3. Confirm local = remote.
4. Installer dry-run → GATE B5 `-Apply`.
5. Verifier PASS.
6. Do not continue Factory work without PASS (or mandatory STOP).

## 11. Staged review (mandatory normal procedure)

```powershell
git branch --show-current
git rev-parse HEAD
git status --short
git add -- <paths exactos autorizados>
node scripts/git/guardStagedForbiddenPaths.js
git status --short
git diff --cached --name-status
```

Then compare staged vs authorized scope → commit → authorized validations → normal push → HEAD match → tracked clean.

**Not authorized on official repo as normal procedure:** `git add .`

## 12. Case A — New untracked file staged by mistake

May evaluate `git rm --cached -- <exact-path>` **only if**:

- was untracked before;
- exact path confirmed;
- no wildcards;
- must remain on disk;
- post-check physical presence;
- specific operational authorization.

The guard **never** prints this command.

## 13. Case B — Tracked file modified

```text
STOP — SPECIFIC INDEX DIAGNOSIS REQUIRED
```

No generic recipe. No `git restore` / `git reset` / `git clean`.

## 14. Case C — Rename or copy

```text
STOP — RENAME/COPY INDEX DIAGNOSIS REQUIRED
```

Review origin and destination. No generic recipe.

## 15. Case D — Multiple paths or ambiguous index

```text
STOP — MULTI-PATH INDEX AUDIT REQUIRED
```

No bulk commands; no wildcards; no automatic cleanup.

## 16. Guard messages

On contamination the guard prints the contractual STOP message, lists status/paths/reasons, and exits `1`. Technical failures exit `2`. No remediation commands.

## 17. Deliberate bypasses

- `git add -f`
- `git commit --no-verify`
- Editing/removing guard or hook
- Leaving `core.hooksPath` unset

These are policy violations, not “features”.

## 18. Rollback

1. Read `core.hooksPath`.
2. If exactly `.githooks`, authorized: `git config --local --unset core.hooksPath`
3. Verify empty.
4. Only then remove versioned `.githooks/pre-commit` via corrective commit.
5. Verify no broken hooksPath reference.

If value differs: `ROLLBACK BLOCKED — CONFIGURATION MISMATCH`.

Never reset/restore/clean/rebase/force-push; never delete runtime or dso-packs.

## 19. TEMP testing

Only under `$env:TEMP\realestatesniper-git-hardening-test-<timestamp>` with path guards, test marker, base commit, and safe delete after revalidation. Official repo must never be the `git add .` test bed.

## 20. Future store escape hatch

If official content must be versioned under a protected store: STOP → Director Mandate → Discovery → coordinated `.gitignore` + guard + verifier + protocol changes → Independent Audit → separate commit → publish → revalidate Manolo/Carlos. **`git add -f` is not a normal procedure.**

## 21. Prohibitions

- `git restore` / `git reset` / `git clean` / rebase / force push
- Official `git add .` as normal flow
- Deleting physical runtime to “fix” Git
- Global Git config / Husky / lint-staged / new deps for this hardening
- Activating hooks without inventory of existing `.git/hooks`

## 22. Gates

B1 Plan → B1-A Audit → B1-B Correction → B2 Mandate/ImpL → B2-B ImpL Audit → **B3 Manolo activate** → **B4 publish** → **B5 Carlos** → B6 closeout.

## 23. Evidence of PASS

Retain: HEAD SHA, installer output, verifier PASS, staged name-status for commits, TEMP test summary (if run), confirmation `core.hooksPath` state.

## 24. Dual-operator closeout

Phase B is fully closed only when hardening is published **and** Manolo PASS **and** (Carlos PASS **or** mandatory STOP for Carlos).
