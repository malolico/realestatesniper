# RealEstateSniper — Owner Backend Foundation

**Status:** Architecture specification (pre-implementation)  
**Scope:** Owner invited/organic flows, property review codes, authorization, Diamond promotion  
**Out of scope for this document:** SQL, migrations, RPCs, Edge Functions, frontend changes

This document is the canonical reference for building the owner backend. No tables, RPCs, or Edge Functions should be created until this spec is agreed.

---

## 1. Principio arquitectónico

### Owner World vs Investor World

RealEstateSniper operates two separate product domains:

| Domain | Audience | Primary data | Visibility |
|--------|----------|--------------|------------|
| **Owner World** | Property owners | `owner_properties`, codes, authorizations | Owner sees only their linked properties |
| **Investor World** | Founders, subscribers, visitors | `deals`, `markets`, `deal_access_purchases` | Marketplace, tiers, purchases |

These domains must not share a single table for property lifecycle. Mixing owner consent workflows with investor marketplace rows creates RLS risk, data leaks, and unclear source of truth.

### Core rules

1. **`owner_properties` is not `deals`.**  
   Detected and invited properties live in the owner domain. They are internal records until explicitly published.

2. **`deals` only receives an owner property after authorization + admin review.**  
   A row in `deals` is created when an admin publishes a property to the investor marketplace — not at detection, not at claim, not at owner authorization alone.

3. **Diamond is never activated automatically from the owner side.**  
   Owner authorization is necessary but not sufficient. An admin must promote to `diamond_candidate` and then publish to `diamond_active`. No RPC, trigger, or frontend action may set `deals.is_diamond = true` without admin intent.

4. **The owner never reads the global deals catalog.**  
   Frontend already skips `markets` / `deals` for `access_role === 'owner'`. Backend RLS must enforce the same.

5. **Auth identity stays in `auth.users`.**  
   `access_role: 'owner'` (set at signup) identifies portal access. Property linkage is via `owner_properties.owner_user_id`, not via metadata alone.

---

## 2. Entidades MVP

Three new tables form the minimum backend. Existing tables (`auth.users`, `deals`, `markets`) are reused with minimal extension.

### `owner_properties`

Canonical record for a detected, invited, claimed, or published owner property.

**Responsibilities:**

- Store the detection snapshot (city, partial/full address, type, values, summary).
- Track lifecycle status (`detected` → … → `diamond_active` | `closed`).
- Hold `owner_user_id` after claim (null before).
- Hold `deal_id` after admin publish (null until `diamond_active`).
- Store owner corrections as data (JSON) while status is `claimed` — no separate corrections table in MVP.

### `property_review_codes`

One-time invitation codes that link an authenticated owner to a specific `owner_property`.

**Responsibilities:**

- Store **hashed** code only (never plaintext in the database).
- Enforce one-time use, expiry, and revocation.
- Record `claimed_at` and `claimed_by_user_id` on successful claim.
- Support at most one **active** (`pending`) code per property at a time; historical rows may exist after `revoked` or reissue (post-MVP).

### `owner_authorizations`

Explicit owner consent for sharing property information with investors.

**Responsibilities:**

- Separate legal/product consent from operational lifecycle on `owner_properties`.
- Track `pending` → `authorized` | `rejected`.
- Store `share_scopes` (what the owner allows: address, financials, investor contact, etc.).
- One current authorization record per property in MVP (mutable or single row).

### Existing entities (reuse, do not duplicate)

| Entity | Role |
|--------|------|
| `auth.users` | Owner account; `user_metadata.access_role = 'owner'` |
| `deals` | Investor marketplace row; created on admin publish only |
| `markets` | Referenced by `deals.market_id` (existing pipeline pattern) |

### Future extension on `deals`

- `deals.owner_property_id` (nullable FK) — back-link from marketplace deal to owner source record. Bridge field for traceability and admin tooling; not required for owner read access.

---

## 3. Entidades NO MVP

Do not build these in the foundation phase:

| Entity / capability | Reason to defer |
|---------------------|-----------------|
| `owner_profiles` | `auth.users` + metadata sufficient until KYC |
| `outreach_log` | Manual outreach first; optional columns on code/property later |
| `review_queue` (table) | Admin queue = filtered view on `owner_properties` by status |
| `owner_property_corrections` (table) | MVP uses JSON on `owner_properties` |
| Full audit trail | Phase 2 compliance; admin actions logged minimally at first |
| KYC / title verification | Product and legal scope later |
| WhatsApp / SMS / email automation | Outreach templates sent manually; no sender integration |

---

## 4. Estados MVP

Keep state machines small. Avoid states such as `owner_verified` or `correction_requested` as separate lifecycle values — corrections are **data** while status remains `claimed`.

### `owner_properties.lifecycle_status`

| State | Meaning |
|-------|---------|
| `detected` | Record created by detection or admin; no outreach code yet (or code not issued) |
| `invited` | Property Review Code issued; outreach in progress or sent |
| `claimed` | Owner redeemed code; property linked to `owner_user_id`; review and authorization in progress |
| `diamond_candidate` | Owner authorized sharing; admin queue for Diamond promotion |
| `diamond_active` | Published to investor marketplace; `deal_id` set |
| `closed` | Terminal: owner rejected, code expired unclaimed, admin archived, or deal unpublished |

### `property_review_codes.status`

| State | Meaning |
|-------|---------|
| `pending` | Issued, not used, within TTL |
| `claimed` | Redeemed once; cannot be reused |
| `expired` | Past `expires_at` without claim |
| `revoked` | Voided by admin before claim |

### `owner_authorizations.status`

| State | Meaning |
|-------|---------|
| `pending` | Property claimed; owner has not decided |
| `authorized` | Owner allows sharing per `share_scopes` |
| `rejected` | Owner declines sharing with investors |

**Post-MVP:** `revoked` on authorization (withdraw consent after prior authorization).

---

## 5. Relaciones

### Cardinality

```
auth.users (owner)  1 ──< N  owner_properties
owner_properties    1 ──< 0..1  property_review_codes   (one active pending code)
owner_properties    1 ──< 0..1  owner_authorizations    (one current consent)
owner_properties    1 ──< 0..1  deals                   (one published Diamond deal)
markets             1 ──< N     deals                   (existing)
```

### Rules

| Relationship | Rule |
|--------------|------|
| Owner → properties | One owner account may claim many properties over time (typically one per invited code). |
| Property → owner | `owner_user_id` is null until claim; then exactly one owner. |
| Property → review code | At most one `pending` code per property; prior codes may be `claimed`, `expired`, or `revoked`. |
| Property → authorization | Created as `pending` on successful claim; owner sets `authorized` or `rejected`. |
| Property → deal | At most one active marketplace deal per property; `deals.owner_property_id` points back to source. |
| Claim integrity | Claim RPC must reject if property already has a different `owner_user_id`. |

### Identity model

- **Owner** = `auth.users` with `access_role: 'owner'`.
- **No separate `owner_profiles` table in MVP.**

---

## 6. Flujo invited owner

End-to-end path for detected / invited property owners.

```
┌─────────────────┐
│ Detection /     │
│ Admin           │
└────────┬────────┘
         │ 1. Create owner_property (detected)
         ▼
┌─────────────────┐
│ owner_property  │  lifecycle: detected → invited
│ + review code   │  code: pending (hashed in DB)
└────────┬────────┘
         │ 2. Outreach (email / phone / WhatsApp — manual)
         ▼
┌─────────────────┐
│ Property owner  │  3. Create / verify Owner account
└────────┬────────┘
         │ 4. Enter Property Review Code (Review Detected Property)
         ▼
┌─────────────────┐
│ validate (read) │  No PII / full address in response
│ claim (atomic)  │  property → claimed; code → claimed
└────────┬────────┘     authorization → pending
         │ 5. Owner reviews snapshot, submits corrections (JSON)
         ▼
┌─────────────────┐
│ Authorization   │  6. Owner: authorized | rejected
└────────┬────────┘
         │ 7. If authorized: admin promotes → diamond_candidate
         ▼
┌─────────────────┐
│ Admin review    │  8. Admin publishes → deal row + diamond_active
└─────────────────┘
```

### Step detail

1. **Detect** — Engine or admin identifies a potential Diamond property.
2. **Create** — Service role or admin creates `owner_property` (`detected`).
3. **Issue code** — Generate Property Review Code; store hash; set property `invited`, code `pending`, `expires_at`.
4. **Outreach** — Team contacts owner with address identifier, product explanation, code, and Owner signup link (manual).
5. **Account** — Owner signs up or logs in with `access_role: 'owner'`.
6. **Claim** — Owner enters code; `validate` then `claim` (atomic transaction).
7. **Review** — Owner sees linked property; corrects fields via allowed updates / RPC.
8. **Authorize** — Owner sets `authorized` or `rejected` on `owner_authorizations`.
9. **Candidate** — Admin moves authorized property to `diamond_candidate`.
10. **Publish** — Admin creates `deals` row (snapshot), sets `is_diamond`, links `owner_property_id` / `deal_id`, status `diamond_active`.

**Diamond never auto-activates** at steps 6–8.

---

## 7. Flujo organic owner (futuro)

Not in MVP backend scope; documented for alignment.

```
Owner signup (organic)
    → Submit New Property (future UI)
    → Admin creates/reviews owner_property (no review code)
    → Admin qualifies → diamond_candidate (if criteria met)
    → Owner authorization (if not already captured)
    → Admin publish → diamond_active → deals
```

**Differences from invited flow:**

- No `property_review_codes` row (or optional internal code omitted).
- Property may enter as `detected` or `claimed` with `owner_user_id` set on submit.
- Same authorization and admin publish gates apply before Diamond.

---

## 8. Seguridad

### Access boundaries

| Actor | owner_properties | property_review_codes | owner_authorizations | deals (global) |
|-------|------------------|----------------------|----------------------|----------------|
| Owner (authenticated) | Read/write own only (via RLS + RPC) | No direct table access | Read/write own via RPC | **Deny** |
| Admin (Edge Function + service role) | Full CRUD for operations | Create, revoke, list | Read for queue | Create on publish |
| Service role | Create, batch, cron expiry | Hash insert, claim internals | System create on claim | Publish bridge |
| Anon | Deny | `validate` RPC only (generic response) | Deny | Existing public marketplace rules |

### Review codes

- **One-time use** — After `claimed`, code cannot be redeemed again.
- **Expiry** — `expires_at` required; cron or lazy check sets `expired`.
- **Hashed storage** — Plaintext exists only in outreach message and client input; DB stores hash (+ pepper strategy at implementation).
- **Validate before claim** — Read-only RPC; must not return full address, owner contact, or financials pre-claim.
- **Generic errors** — Avoid distinguishing invalid vs used vs expired in client messages where it aids enumeration (log detail server-side).
- **Creation** — Only admin / service role; never client-side insert.

### Claim

- **Atomic transaction** — Single RPC: lock code row, verify `pending` + not expired, set `claimed`, assign `owner_user_id`, set property `claimed`, insert authorization `pending`.
- **Auth required** — `auth.uid()` must match claimant; user must have owner role.
- **Rate limiting** — Implement on validate/claim (implementation phase).

### RLS

- **Owner-scoped mandatory** — `owner_properties.owner_user_id = auth.uid()` for SELECT and limited UPDATE.
- **No owner SELECT on `deals`** — Even after publish; owner sees status via `owner_properties.lifecycle_status` and linked `deal_id`, not marketplace catalog.

### Alignment with current frontend

- `App.jsx` already skips loading `markets`, `deals`, and `deal_access_purchases` for owners (Phase 0). Backend must match.

---

## 9. Reglas de producto

These rules are non-negotiable for owner-facing copy and backend gates:

1. **Owners pay nothing** — No Stripe, no checkout, no fees in owner flows.
2. **No obligation to sell** — Authorization and Diamond are optional paths.
3. **No contact details shared without explicit authorization** — `share_scopes` must include contact only if owner opts in; nothing flows to investors before `authorized` + admin publish.
4. **Diamond requires owner authorization + admin review** — `authorized` + `diamond_candidate` + admin publish; never owner-only activation.
5. **Investor marketplace remains separate** — Owners do not browse or purchase deals; investors do not read `owner_properties` directly.

---

## 10. Orden futuro de implementación

| Phase | Deliverable | Notes |
|-------|-------------|-------|
| **Phase 1** | SQL tables + RLS | `owner_properties`, `property_review_codes`, `owner_authorizations`; optional `deals.owner_property_id` |
| **Phase 2** | validate / claim RPC | `validate_property_review_code_public`, `claim_property_review_code` (atomic) |
| **Phase 3** | OwnerDashboard claim UI | Code entry, linked property display (invited path) |
| **Phase 4** | Owner authorization UI | Corrections, authorize / reject, scopes |
| **Phase 5** | Admin owner review actions | Extend `admin-access`: queue, promote, revoke code, archive |
| **Phase 6** | Diamond bridge to `deals` | Admin publish: snapshot → `deals`, `diamond_active`, `is_diamond` |

**Do not implement out of order:** RLS before RPCs; RPCs before frontend claim; authorization before Diamond candidate.

---

## Appendix A — Reference pattern (founder codes)

The existing founder system (`founder_codes`, `redeem_and_activate_founder_code`) provides a **UX and RPC shape** reference:

- Validate (read-only) → redeem (atomic, `FOR UPDATE`, used/expired checks).
- Post-auth pending flow via sessionStorage.

**Owner codes must improve on founder security:** hash storage, no property PII in validate, separate tables, no plaintext code column.

---

## Appendix B — Files explicitly out of scope for this foundation doc

Until later phases, do not modify as part of foundation documentation work:

- `src/App.jsx`
- `src/components/AuthModal.jsx`
- `src/components/dashboards/OwnerDashboard.jsx`
- Supabase SQL / migrations
- Edge Functions
- Stripe integration
- Factory / pipeline automation
- `scripts/`

---

*Document version: 1.0 — Owner Backend Foundation spec (pre-implementation)*
