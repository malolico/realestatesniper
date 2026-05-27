# Founder System — Final Audit Checklist

**Audit date:** 2026-05-26  
**Scope:** Frontend founder flow only (read-only review; no logic changes in this audit).  
**Out of scope:** Subscriber, Stripe, Premium/Diamond, `resolveAccess.js` integration, running SQL/npm/lint.

---

## 1. Current founder files

| Path | Role | Status |
|------|------|--------|
| `src/lib/founder/validateFounderCode.js` | Read-only lookup on `founder_codes` | **Production** |
| `src/lib/founder/redeemAndActivateFounderCode.js` | RPC `redeem_and_activate_founder_code` | **Production (App)** |
| `src/lib/founder/refreshFounderSessionState.js` | `refreshSession` + `getUser` + access snapshot | **Production (App)** |
| `src/lib/founder/getFounderAccessState.js` | UI flags from metadata + cohort | **Production (App)** |
| `src/lib/founder/founderMetadataUtils.js` | Defensive metadata parse / expiration helpers | **Production** |
| `src/lib/founder/getFounderCodesStatus.js` | Cohort counter from `founder_codes.used` | **Production (App)** |
| `src/lib/founder/founderFeedbackCopy.js` | Banner copy + unavailable message | **Production (FounderModal)** |
| `src/lib/founder/founderCodesDocumentation.js` | Engineer checklist (not runtime) | **Docs** |
| `src/lib/founder/redeemFounderCode.js` | RPC `redeem_founder_code` only (no activate) | **Orphan — not imported by App** |
| `src/components/FounderModal.jsx` | Validate → submit → auth | **Production** |
| `src/components/FounderStatus.jsx` | Remaining / full UI | **Production** |
| `src/App.jsx` | Orchestration, guards, CTAs | **Production** |

**Removed (confirmed absent):**

- `src/lib/founder/founderVisualMock.js`
- `App.jsx` `FOUNDER_CODES` hardcoded array
- `App.jsx` `activateFounderForCurrentUser`
- `App.jsx` `processFounderExpiry` (client downgrade)
- `FOUNDER_SPOT_FEED` animated counter

**Supabase artifacts (repo; must be applied in dashboard separately):**

- `supabase/founder_codes_schema.sql`
- `supabase/founder_codes_seed.sql`
- `supabase/founder_codes_apply.sql`
- `supabase/founder_codes_anon_select_rls.sql`
- `supabase/redeem_and_activate_founder_code.sql`
- `supabase/migrations/20260526120000_founder_codes.sql`
- `supabase/migrations/20260526130000_redeem_and_activate_founder_code.sql`

---

## 2. Checklist — items requested

| Check | Result | Notes |
|-------|--------|-------|
| **Mocks** | ✅ None in runtime UI | No `founderVisualMock.js`. `founderFeedbackCopy.js` is UI strings only. |
| **`FOUNDER_CODES` hardcoded in App** | ✅ Removed | Seed examples only in `founderCodesDocumentation.js` → `FUTURE_SEED_CODES`. |
| **`activateFounderForCurrentUser`** | ✅ Removed | Was ~App.jsx; no references in codebase. |
| **`redeemFounderCode` used in App** | ✅ Not used | File exists; App uses `redeemAndActivateFounderCode` only. |
| **Duplicated `founderUnlocked` state** | ✅ Centralized | Single derive via `getFounderAccessState()` per render; no `setFounderUnlocked`. |
| **`updateUser` for founder from frontend** | ✅ None for founder | Only `activateSubscriberForCurrentUser` uses `updateUser` (subscriber). Founder activation is RPC-only. |
| **preview / demo / mock copy** | ✅ Removed from UI | No “visual preview” / “offline preview” in components. |

### Minor naming / non-blocking leftovers

| Item | Risk | Recommendation |
|------|------|----------------|
| `FounderModal` prop `foundersFullMock` | Low — receives **real** `foundersCohortFull` from App | Optional rename to `foundersFull` (cosmetic). |
| `redeemFounderCode.js` | Low — dead code path if RPC never deployed alone | Delete or mark deprecated when redeem-only RPC is officially dropped. |
| Counter fallback `REMAINING_FOUNDER_SPOTS = 7` on DB error | Medium UX | Documented; fix with anon RLS or public count RPC. |
| `resolveAccess.js` | N/A founder audit | Not wired to App; separate track. |

---

## 3. Official founder flow (current)

```
User opens FounderModal
  → validateFounderCode()           [founder_codes SELECT]
  → handleFounderCodeSubmit (App)

Logged in:
  → redeemAndActivateFounderForUser
  → redeemAndActivateFounderCode()  [RPC redeem_and_activate_founder_code]
  → applyFounderSessionAfterAtomicActivate
  → refreshFounderSessionState()    [refreshSession + getUser + getFounderAccessState]
  → setCurrentUser + userMode('founder') if canEnterFounderMode
  → refreshFounderCodesStatus()     [cohort counter]

Guest:
  → sessionStorage pending + code
  → AuthModal (founder context)
  → processPendingFounderActivation → same RPC + refresh path

Access gating (read-only):
  → getFounderAccessState / founderMetadataUtils
  → requires access_role === 'founder', founder_trial_status === 'active', valid founder_trial_ends_at
  → founderSessionSyncRef blocks stale onAuthStateChange during refresh

Cohort full:
  → foundersCohortFull from getFounderCodesStatus
  → founderAccessClosed, "Founders Complete", modal not mounted
```

**Authority model**

- **Backend (when SQL applied):** `founder_codes` rows, atomic RPC metadata + `used=true`.
- **Frontend:** interprets metadata only; does not expire or downgrade users.

---

## 4. Real production pieces (wired)

- Supabase validation + atomic redeem helper
- Session refresh after activation (anti–stale metadata)
- Metadata-driven `founderUnlocked` / `canEnterFounderMode` / expiration notice
- Real cohort counter + full-state CTAs
- Professional error copy (`FOUNDER_VERIFICATION_UNAVAILABLE`, session refresh failures)
- Guards: no founder mode without metadata; no modal when cohort full

---

## 5. Legacy eliminated (historical)

- Client-only founder code whitelist (`FOUNDER_CODES`)
- `founderVisualMock` fake valid/used code lists
- Animated fake remaining spots (`FOUNDER_SPOT_FEED`)
- `activateFounderForCurrentUser` (`updateUser` founder metadata from client)
- `processFounderExpiry` client downgrade
- Redeem-without-activate in App (`redeemFounderCode` path)
- Mock / preview user-facing strings in `FounderStatus` / `FounderModal`

---

## 6. Pending — real founder work (not done in frontend-only scope)

### Supabase / backend (must run in project dashboard)

- [ ] Apply `founder_codes_apply.sql` (or migration) if not already
- [ ] Apply `redeem_and_activate_founder_code.sql` (or migration)
- [ ] Apply `founder_codes_anon_select_rls.sql` so **anonymous** visitors get real cohort counts (otherwise fallback 7/10)
- [ ] Confirm RLS: authenticated `SELECT` on `founder_codes` for validation

### Backend enforcement (recommended)

- [ ] Server-side founder trial expiration (cron / Edge Function / auth hook) updating `founder_trial_status` and `access_role` — frontend will reflect via `getFounderAccessState` after refresh
- [ ] Decide fate of `redeem_founder_code` RPC vs only `redeem_and_activate_founder_code`; remove `redeemFounderCode.js` if unused
- [ ] Optional: dedicated session/claims endpoint for “backend authoritative sessions”

### Frontend polish (optional, non-blocking)

- [ ] Rename `foundersFullMock` → `foundersFull` in `FounderModal` props
- [ ] Hide Founder nav button entirely when `foundersCohortFull` (today: disabled + “Founders Complete”)
- [ ] Integrate or explicitly defer `resolveAccess.js` (out of founder V1 scope)

### QA scenarios

- [ ] Guest: validate → signup → pending RPC → refresh → founder mode
- [ ] Logged-in: validate → RPC → refresh → founder mode
- [ ] Used / invalid / expired codes from DB
- [ ] Cohort full: CTAs disabled, modal not shown
- [ ] RPC success but metadata lag: retry message from `refreshFounderSessionState`
- [ ] Expired trial in metadata: `founderExpiredNotice`, no `canEnterFounderMode`

---

## 7. Audit conclusion

The **frontend Founder System is production-shaped** for initial beta: validation and activation go through Supabase; UI does not fake codes or downgrade users. Remaining gaps are **operational** (SQL/RLS in Supabase), **server expiration**, and **cosmetic/dead-code cleanup** — not a second client-side activation path.

For living checklist details see also `founderCodesDocumentation.js` (`FOUNDER_PHASE_CHECKLIST`, `legacyRemoved`, `expirationEnforcement`, `sessionConsistency`).
