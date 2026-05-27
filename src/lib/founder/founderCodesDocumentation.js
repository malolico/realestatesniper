/**
 * Founder System — Phase 1A documentation & future constants.
 *
 * This file is documentation-only for engineers. It does not call Supabase,
 * does not fetch data, and is not imported by App.jsx in Phase 1A.
 *
 * Database:
 *   - supabase/founder_codes_schema.sql
 *   - supabase/founder_codes_seed.sql
 *   - supabase/founder_codes_apply.sql (single paste for SQL Editor)
 *   - supabase/migrations/20260526120000_founder_codes.sql (CLI migration)
 */

/** Maximum founders allowed in the private beta cohort. */
export const TOTAL_FOUNDER_SPOTS = 10

/** Supabase table name (Phase 1A schema). */
export const FOUNDER_CODES_TABLE = 'founder_codes'

/**
 * Founder code lifecycle (future Supabase-backed flow).
 *
 * 1. Seed — Insert up to 10 rows in `founder_codes` with unique `code` values.
 * 2. Issue — Optionally set `assigned_email` when inviting a specific investor.
 * 3. Validate — User enters code; backend looks up by `code` where `used = false`
 *    and (`expires_at` is null or `expires_at` > now()).
 * 4. Redeem — Atomic update: `used = true`, `used_by_user_id`, `used_at = now()`.
 * 5. Activate — Set user metadata (founder trial) via existing auth path (later phase).
 * 6. Cohort full — When `count(*) where used = true` = 10:
 *    - Reject further redemptions
 *    - Hide / remove the Founder entry button in the UI automatically
 */
export const FOUNDER_CODE_LIFECYCLE = [
  'seed',
  'issue',
  'validate',
  'redeem',
  'activate',
  'cohort_full',
]

/**
 * Rules documented for Phase 1B+ implementation (not enforced in this file).
 */
export const FOUNDER_CODE_RULES = {
  oneTimeUse: true,
  maxBetaFounders: TOTAL_FOUNDER_SPOTS,
  hideFounderButtonWhenAllUsed:
    'When all 10 founder_codes rows have used=true, the Founder CTA should not render.',
  assignedEmailOptional: true,
  codeExpiryOptional: true,
}

/**
 * UI behavior (implemented in App / FounderStatus / getFounderCodesStatus).
 * Legacy removed: FOUNDER_CODES (App), founderVisualMock.js — validation is Supabase-only.
 */
export const FOUNDER_UI_FUTURE = {
  totalSpots: TOTAL_FOUNDER_SPOTS,
  founderButtonVisibleWhen:
    'At least one founder_codes row has used=false OR cohort count < 10',
  founderButtonHiddenWhen:
    'All 10 founder_codes have used=true (cohort full)',
  statusCounterFormat: '{remaining} / {total} Founder Spots Remaining',
  privateBetaCopy: 'Only invited investors can access the private beta',
}

/**
 * Example seed codes for SQL migrations only (not used at runtime).
 */
export const FUTURE_SEED_CODES = [
  'RS-FOUNDER-001',
  'RS-FOUNDER-002',
  'RS-FOUNDER-003',
  'RS-FOUNDER-004',
  'RS-FOUNDER-005',
  'RS-FOUNDER-006',
  'RS-FOUNDER-007',
  'RS-FOUNDER-008',
  'RS-FOUNDER-009',
  'RS-FOUNDER-010',
]

/**
 * Phase checklist — what connects after 1A (documentation only).
 */
export const FOUNDER_PHASE_CHECKLIST = {
  phase1a: {
    artifacts: [
      'founder_codes_schema.sql',
      'founder_codes_seed.sql',
      'founder_codes_apply.sql',
      'migrations/20260526120000_founder_codes.sql',
      'founderCodesDocumentation.js',
    ],
    apply: {
      recommendedFile: 'supabase/founder_codes_apply.sql',
      steps: [
        'Open Supabase Dashboard → SQL Editor',
        'Paste and run supabase/founder_codes_apply.sql',
        'Confirm: select count(*) from public.founder_codes; -- 10',
        'Confirm: select count(*) filter (where not used) from public.founder_codes; -- remaining spots',
      ],
      migrationFile: 'supabase/migrations/20260526120000_founder_codes.sql',
      seedFile: 'supabase/founder_codes_seed.sql',
    },
  },
  phase1b: [
    'supabase/redeem_and_activate_founder_code.sql (RPC + RLS select)',
    'App.jsx wired to redeemAndActivateFounderCode helper',
  ],
  phase1c: [
    'getFounderCodesStatus.js wired in App (FounderStatus count from DB)',
    'Founder full state: Founders Complete CTA + modal guard',
    'Production cleanup: FOUNDER_CODES + founderVisualMock.js removed',
    'founderFeedbackCopy.js — UI strings only',
    'getFounderAccessState.js — metadata-driven founder flags (App.jsx)',
    'Retire client-only activateFounderForCurrentUser when RPC is stable',
  ],
  legacyRemoved: [
    'App.jsx FOUNDER_CODES hardcoded list',
    'founderVisualMock.js (fake validation / mock cohort)',
    'Local approve-list check in handleFounderCodeSubmit',
  ],
}
