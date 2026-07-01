# RealEstateSniper Black Box — Constitution

Official conceptual architecture for the platform's immutable audit, evidence, and trust layer.

This document defines **what the Black Box is, why it exists, and how it must behave**. It does not define storage schemas, APIs, UI, or implementation.

---

## 1. Purpose

The Black Box exists to preserve a **durable, independent, and verifiable record** of what happened inside RealEstateSniper when facts matter: money moved, access changed, ownership was asserted, marketplace state shifted, or an administrator acted.

Its purpose is not analytics, dashboards, or day-to-day operations. Its purpose is **truth under dispute**: what occurred, when, by whom or what system, under which context, and with what corroborating evidence.

The Black Box answers questions that operations tools cannot answer safely:

- What exactly happened?
- Can we prove it?
- Can we explain it to a user, regulator, partner, or court without rewriting history?

---

## 2. Mission

**Record reality. Explain events. Preserve evidence. Never interfere.**

The Black Box must capture meaningful platform events as they occur, attach or reference evidence where available, and remain available for investigation long after the moment has passed.

It must support:

- Internal accountability
- User trust
- Security response
- Business integrity
- Legal defensibility

It must never become a control surface, a workflow engine, or a substitute for product logic.

---

## 3. Core Principles

1. **Append-only truth** — History is written forward. Corrections are new records, never silent edits.
2. **Event-first thinking** — The unit of record is an event with meaning, not a raw log line.
3. **Separation of concerns** — Recording must not depend on Admin UI, business dashboards, or operator convenience.
4. **Evidence over assertion** — A claim without evidence is a note; a claim with evidence is a record worth trusting.
5. **Least privilege exposure** — The Black Box reveals only what investigation requires.
6. **Fail-safe recording** — If product features fail, the Black Box should still capture what it can without corrupting prior truth.
7. **Human-readable explanations** — Every record must be explainable to a qualified reviewer without insider folklore.
8. **Platform neutrality** — The Black Box serves RealEstateSniper the system, not any single team, role, or module.

---

## 4. Scope

The Black Box covers **platform-significant activity** across RealEstateSniper, including but not limited to:

- Identity and authentication events
- Authorization and role changes
- Subscription and payment-related state transitions
- Marketplace and deal lifecycle changes materially affecting access or eligibility
- Owner verification and review decisions
- Administrative actions with security or business impact
- Factory and enrichment pipeline outcomes that alter trust or availability
- System-level failures, security signals, and integrity warnings

The Black Box does **not** own:

- Product browsing behavior except where it affects trust, access, or compliance
- Marketing analytics
- General application telemetry unrelated to accountability
- Operational dashboards
- User-facing feature state

Scope expands only through deliberate constitutional amendment, not convenience.

---

## 5. What MUST be recorded

The Black Box must record events that change or confirm any of the following:

- **Who** acted — user, owner, founder, admin, service, or automated actor
- **What** changed — the meaningful business or security fact
- **When** it happened — authoritative event time, not merely processing time when they differ
- **Where in the platform** it happened — workspace, module, or domain context
- **Why it matters** — classification of event type and severity
- **How it was decided** — human action, automated rule, external webhook, or system default
- **What evidence exists** — references to receipts, payloads, documents, or corroborating artifacts
- **What resulted** — outcome state relevant to trust, access, money, or ownership

At minimum, the following classes of activity are in scope for recording:

- Login, logout, failed authentication, and elevated access grants
- Role, permission, and entitlement changes
- Purchase, refund, failed payment, and subscription state transitions
- Founder cohort and capacity-impacting changes
- Deal publication, restriction, tier change, or removal from eligible visibility
- Owner submission, verification, rejection, or escalation
- Admin approvals, overrides, suspensions, and destructive actions
- Security-relevant configuration changes
- Integrity warnings such as empty marketplace, failed ingestion, or inconsistent state detection
- External system callbacks that alter platform truth

If an event cannot yet be fully explained, it may still be recorded as **provisional**, but it must be marked as such and enriched later through additive records.

---

## 6. What MUST NEVER happen

The Black Box must never:

- Delete or overwrite prior records
- Rewrite history to match current product state
- Hide events because they are embarrassing, inconvenient, or commercially sensitive
- Depend on Admin screens to exist before recording
- Block core product flows when recording is unavailable
- Become the source of business rules or authorization decisions
- Store secrets in plain form when a reference or redacted representation suffices
- Mix operational metrics with immutable evidence without clear separation
- Allow unaudited administrative access to alter past truth
- Present inference as fact without evidence classification
- Collapse multiple meaningful events into one ambiguous record for convenience
- Expose private user data beyond investigation need

The Black Box is a witness, not a censor, editor, or operator console.

---

## 7. Immutability Rules

1. **No updates to historical records** — Once committed, a record is permanent.
2. **Corrections are additive** — Errors are addressed by superseding clarification records that reference the original.
3. **Tombstones, not erasure** — Legal or privacy obligations may require restricted visibility, never silent deletion of truth.
4. **Stable identity** — Every record must have a durable identifier and lineage.
5. **Versioned interpretation** — If event meaning changes because taxonomy evolves, old records retain their original classification with optional interpretive overlays added later.
6. **Clock integrity** — Event ordering must be reconstructible even across delayed ingestion.
7. **Tamper evidence** — The system must be designed so unauthorized modification is detectable in principle, even before implementation details exist.

Immutability applies to the **record of events**, not to the live state of the product. Product state may change; the Black Box remembers what happened.

---

## 8. Record → Explain → Evidence model

Every meaningful Black Box entry follows three layers:

### Record

The atomic fact that something happened.

A record answers: **What event occurred?**

It is concise, typed, timestamped, attributable, and immutable.

### Explain

The human-understandable interpretation of the record.

An explanation answers: **Why does this matter, and what does it mean in platform language?**

Explanations may evolve as taxonomy improves, but they must not rewrite the underlying record.

### Evidence

The corroborating material that supports the record.

Evidence answers: **What proof exists?**

Evidence may include external references, redacted payloads, document handles, correlation identifiers, or system-generated artifacts. Evidence is linked, not embedded recklessly.

### Model rule

No record of consequence should exist without an explanation path.  
No disputed record should remain without an evidence path when evidence is available.  
Evidence may arrive after the record, but the linkage must be explicit and additive.

---

## 9. Trust Model

Trust in the Black Box is built on five pillars:

1. **Completeness** — Material events are not missing because a module forgot to log them.
2. **Integrity** — Records cannot be silently changed after the fact.
3. **Attribution** — Actors and systems are identifiable with appropriate confidence levels.
4. **Corroboration** — Important claims are backed by evidence or explicitly marked unverified.
5. **Independence** — The Black Box is not controlled by the same convenience paths as daily operations.

Trust levels may be assigned to records:

- **Verified** — corroborated by independent evidence
- **Asserted** — reported by a trusted internal source without external corroboration yet
- **Observed** — detected by monitoring or inference, pending confirmation
- **Disputed** — contradicted by later additive records or investigation

The Black Box must make uncertainty visible. False certainty is worse than provisional truth.

---

## 10. Security Principles

- **Record by default for sensitive change** — If an action affects money, access, ownership, or admin power, recording is mandatory in principle.
- **Separation of duties** — Those who operate the product should not be the only ones who can inspect immutable history without oversight.
- **Redaction before exposure** — Evidence is stored and displayed with minimum necessary disclosure.
- **Strong actor identity** — Human, service, and automated actors must be distinguishable.
- **Non-repudiation ambition** — Important actions should be traceable to an identifiable originator where technically and legally possible.
- **Defense in depth** — Recording paths must not trust a single UI or client claim without server-side validation where applicable.
- **Incident readiness** — The Black Box must support reconstruction of security timelines without requiring production debugging access.
- **No secret leakage** — Tokens, credentials, full payment instruments, and private documents do not belong in unrestricted record bodies.

Security monitoring may consume Black Box outputs, but monitoring is not the Black Box itself.

---

## 11. Legal Objectives

The Black Box must help RealEstateSniper:

- Demonstrate due diligence in platform governance
- Support dispute resolution with contemporaneous records
- Preserve chain-of-custody thinking for evidence
- Enable lawful response to regulatory, partner, or user inquiries
- Distinguish platform action from user action from third-party action
- Document consent-relevant and access-relevant changes where applicable
- Retain records according to future policy without presuming infinite retention today

The Black Box is designed for **defensibility**, not for collecting data without purpose.

Privacy rights and retention limits are acknowledged constraints. When deletion or restriction is legally required, the constitution prefers **access restriction and anonymization records** over destruction of audit lineage, unless law explicitly requires otherwise.

---

## 12. Separation from Admin

The Admin Operations Center is an **operator interface**.  
The Black Box is a **constitutional memory layer**.

They are related but not the same.

Admin is optimized for action; the Black Box is optimized for memory.  
Admin may show summaries and placeholders; the Black Box must preserve durable event truth.  
Admin can evolve quickly for operator ROI; the Black Box evolves cautiously under constitutional rules.  
Admin displays current state; the Black Box preserves historical fact.  
Admin may be incomplete during rollout; the Black Box must not wait for UI completeness to justify existence.

Rules:

- Admin modules may **read** Black Box outputs when authorized.
- Admin modules must not **be** the Black Box.
- No Admin dashboard feature is a prerequisite for Black Box recording.
- The existence of `Audit & Security Black Box` in Admin does not define the Black Box; it is only a future viewport.

The Black Box belongs to the platform architecture, not to a single Admin viewport.

---

## 13. Integration Philosophy

Integration with RealEstateSniper must follow these rules:

1. **Emit at the source of truth** — Records should be created where authoritative decisions happen, not only where data is displayed.
2. **Loose coupling** — Product modules should not need to understand Black Box internals to participate.
3. **Additive enrichment** — Downstream systems may add explanation or evidence later.
4. **Idempotent intent** — Replayed processing must not create false duplicate meaning.
5. **Graceful degradation** — If enrichment fails, the core record should still survive.
6. **Cross-domain correlation** — Related events across marketplace, billing, identity, and admin should be linkable through shared correlation context.
7. **Human investigation first** — Design for reviewers, counsel, and incident response before designing for charts.

The Black Box integrates with the platform as infrastructure for accountability, not as a feature flag afterthought.

---

## 14. Future Expansion Rules

Expansion of the Black Box is allowed only when it strengthens truth, trust, or defensibility.

### Allowed expansion

- New event classes with clear business or security significance
- Richer evidence linking models
- Better explanation taxonomy
- Improved investigation workflows that remain read-only with respect to history
- Stronger tamper detection and retention policy support

### Expansion requirements

Every proposed expansion must answer:

1. What new truth does this preserve?
2. Why is it materially important?
3. Does it violate immutability, privacy, or separation principles?
4. Can it be additive without rewriting prior records?
5. Is Admin independence preserved?

### Disallowed expansion

- Turning the Black Box into a general-purpose analytics warehouse
- Using the Black Box as the primary product database
- Recording noise without investigable meaning
- Expanding scope because a dashboard has empty space
- Coupling record creation to a specific frontend release cadence

Amendments to this constitution require explicit review. Convenience is not sufficient justification.

---

## Event Categories

This section defines the **conceptual taxonomy** of events the Black Box must be able to represent. Categories are domains of platform meaning, not storage partitions and not Admin modules.

Every record belongs to one primary category. Related categories may appear in explanations or evidence links, but classification must remain clear for investigation.

---

### Authentication

**Purpose**  
Preserve who attempted to access the platform, whether access succeeded, and whether identity signals were trusted or rejected.

**Typical events**  
Sign-in success, sign-in failure, sign-out, session establishment, session expiry, multi-factor challenge, password reset request, credential recovery, suspicious login pattern, blocked authentication attempt.

**Why it matters**  
Authentication is the front door to accountability. Without it, downstream events cannot be attributed confidently to a person, service, or session.

---

### User Account

**Purpose**  
Capture lifecycle changes to a user's account as a durable identity on the platform.

**Typical events**  
Account creation, activation, suspension, reactivation, closure request, email change, profile update with trust impact, account merge or split decision, founder trial state change, subscription eligibility change.

**Why it matters**  
User account events define **who exists on the platform** and whether they are allowed to participate. They are central to support, billing disputes, and access restoration.

---

### Legal Acceptance

**Purpose**  
Record when users or owners accept terms, policies, disclosures, or other legally meaningful consent.

**Typical events**  
Terms of service acceptance, privacy policy acceptance, founder agreement acceptance, owner disclosure acceptance, policy version change acknowledgment, withdrawal of optional consent where permitted.

**Why it matters**  
Legal acceptance events support defensibility when access, monetization, or data use is challenged. They must be contemporaneous and attributable.

---

### Marketplace

**Purpose**  
Document changes to the deal marketplace that affect what opportunities exist, who can see them, and how they are classified.

**Typical events**  
Deal published, deal hidden, deal tier changed, deal score changed materially, deal removed, marketplace became empty, city or market filter affected visibility, sniper deal surfaced, premium or diamond eligibility changed for a deal.

**Why it matters**  
The marketplace is the core product surface. Its history explains what investors could see, when, and under what classification.

---

### Purchases

**Purpose**  
Record business-level purchase actions that grant access to deals or product tiers.

**Typical events**  
Premium purchase completed, diamond purchase completed, purchase attempt abandoned, purchase entitlement granted, purchase entitlement revoked, duplicate purchase prevented, purchase tied to a specific deal.

**Why it matters**  
Purchases define **commercial entitlement**. They are often the first question in refund, access, and fairness disputes.

---

### Payments

**Purpose**  
Capture payment attempts and outcomes independent of the product meaning of the purchase.

**Typical events**  
Payment initiated, payment authorized, payment captured, payment failed, payment canceled, payment retry, partial payment outcome, payment reconciliation mismatch detected.

**Why it matters**  
Payments explain whether money actually moved. They separate financial fact from product access fact.

---

### Stripe

**Purpose**  
Preserve platform-relevant interactions with Stripe as the external payment authority.

**Typical events**  
Checkout session created, checkout completed, webhook received, webhook validation failed, customer created, subscription synced from Stripe, Stripe dispute opened, Stripe refund issued, Stripe configuration mismatch.

**Why it matters**  
Stripe is an external system of record for money. Black Box events must make platform state and Stripe state reconstructible during reconciliation.

---

### Founder

**Purpose**  
Record events tied to the founder program, cohort capacity, and founder-specific entitlements.

**Typical events**  
Founder spot claimed, founder cohort nearing capacity, founder cohort full, founder trial started, founder trial ended, founder benefit granted, founder benefit removed, founder gate shown or bypassed.

**Why it matters**  
The founder program is a controlled growth mechanism. Its history explains who received scarce access and when limits were reached.

---

### Owner Portal

**Purpose**  
Document owner-facing actions that assert property interest or initiate off-market participation.

**Typical events**  
Owner portal accessed, property submission started, property submission completed, owner profile updated, owner invitation accepted, owner listing withdrawn, owner communication preference changed.

**Why it matters**  
Owner Portal events establish **who claimed ownership intent** and when the platform received it.

---

### Property Verification

**Purpose**  
Record the review and decision path for whether a property or owner claim is credible enough for platform use.

**Typical events**  
Verification requested, verification assigned, verification approved, verification rejected, verification escalated, verification expired, reverification required, risk score materially changed.

**Why it matters**  
Property verification protects marketplace integrity and reduces fraud, misrepresentation, and broker risk.

---

### Documents

**Purpose**  
Track document submission, validation, rejection, and replacement in trust-sensitive flows.

**Typical events**  
Document uploaded, document accepted, document rejected, document replaced, required document missing, document expired, document access restricted, document linked to verification case.

**Why it matters**  
Documents are often the strongest evidence in owner and compliance disputes. Their history must be preserved without exposing unnecessary content in the record itself.

---

### Admin Actions

**Purpose**  
Record deliberate actions taken by administrators that alter users, deals, access, or platform configuration.

**Typical events**  
Manual user adjustment, manual deal override, admin panel access, admin approval granted, admin rejection issued, emergency suspension, manual founder decision, manual marketplace correction.

**Why it matters**  
Administrative power must be visible. Every meaningful override is a potential trust event and accountability event.

---

### Role Changes

**Purpose**  
Preserve changes to roles, permissions, and elevated access across the platform.

**Typical events**  
Role granted, role revoked, admin email recognized, owner role assigned, owner role removed, permission elevation, permission reduction, unauthorized role change blocked.

**Why it matters**  
Role changes explain **who was allowed to do what**. They are essential for security investigations and internal governance.

---

### Factory

**Purpose**  
Record orchestration events from the platform's factory layer that coordinate generation, sync, or transformation work.

**Typical events**  
Factory run started, factory run completed, factory run failed, factory paused, factory resumed, factory configuration changed, factory output published to marketplace.

**Why it matters**  
Factory events explain how machine-driven changes entered the product, especially when no human clicked a button.

---

### Engines

**Purpose**  
Document behavior of individual engines within the factory ecosystem.

**Typical events**  
Engine registered, engine started, engine stopped, engine degraded, engine produced output, engine rejected input, engine version changed, engine health warning.

**Why it matters**  
Engines are specialized workers. Their history helps isolate which component caused a bad outcome.

---

### Pipelines

**Purpose**  
Capture multi-step processing flows that move data or deals through stages.

**Typical events**  
Pipeline started, stage entered, stage completed, stage failed, pipeline retried, pipeline abandoned, pipeline output delivered, pipeline backlog threshold crossed.

**Why it matters**  
Pipelines explain **process**, not just outcome. They are critical when a deal or property is stuck, duplicated, or partially processed.

---

### Enrichment

**Purpose**  
Record efforts to improve, classify, price, or qualify marketplace data.

**Typical events**  
Enrichment started, enrichment completed, unpriced lead detected, pricing applied, classification changed, enrichment failed, enrichment deferred, enrichment source conflict detected.

**Why it matters**  
Enrichment affects deal quality, monetization tiers, and investor trust. Its history explains why a deal looked one way and later another.

---

### Notifications

**Purpose**  
Preserve meaningful notification events where delivery or failure has business or legal consequence.

**Typical events**  
Critical email sent, email delivery failed, owner notified of verification outcome, founder cohort alert sent, payment receipt notification sent, security alert sent, notification suppressed by policy.

**Why it matters**  
Notifications prove the platform attempted to inform a user or owner. They matter in disputes about awareness and timely disclosure.

---

### Security

**Purpose**  
Record events that indicate threat, misuse, policy violation, or protective response.

**Typical events**  
Suspicious access blocked, repeated failed login threshold reached, privilege abuse detected, tamper attempt detected, sensitive action challenged, security policy violation, incident opened, incident contained.

**Why it matters**  
Security events protect users, owners, and the business. They must be preserved with high fidelity and clear severity.

---

### System

**Purpose**  
Capture platform-level health and lifecycle events that affect overall reliability or truthfulness of the product.

**Typical events**  
Service startup, service shutdown, deployment completed, configuration loaded, marketplace data ready, marketplace empty, dependency unavailable, recovery after outage, integrity check passed or failed.

**Why it matters**  
System events explain whether the platform was in a state where its other records and product promises could be trusted.

---

### Edge Functions

**Purpose**  
Document serverless execution events at platform boundaries where external input becomes internal action.

**Typical events**  
Function invoked, function succeeded, function failed, function timed out, function rejected invalid payload, function emitted downstream event, function authorization failure.

**Why it matters**  
Edge Functions are often the bridge between external systems and internal truth. Their failures can silently break accountability if not recorded.

---

### Integrations

**Purpose**  
Preserve events involving third-party systems beyond Stripe where they alter or confirm platform truth.

**Typical events**  
Integration connected, integration disconnected, external sync started, external sync completed, external payload rejected, partner webhook received, partner API unavailable, integration drift detected.

**Why it matters**  
Integrations introduce external dependencies. Their event history explains whether the platform or the partner was the source of a bad state.

---

### Background Jobs

**Purpose**  
Record asynchronous work that changes or confirms platform state outside user-facing request paths.

**Typical events**  
Job queued, job started, job completed, job failed, job retried, job abandoned, job produced side effect, job backlog elevated.

**Why it matters**  
Many consequential changes happen after the user leaves the screen. Background jobs must not become invisible history.

---

### Scheduled Tasks

**Purpose**  
Document time-based execution that affects data freshness, cleanup, reconciliation, or recurring operations.

**Typical events**  
Schedule triggered, scheduled sync ran, scheduled cleanup ran, scheduled report generated, scheduled task skipped, scheduled task failed, schedule disabled or changed.

**Why it matters**  
Scheduled tasks explain why something changed overnight or at a boundary moment without direct human action.

---

### Errors

**Purpose**  
Capture meaningful failures that prevented expected platform behavior or corrupted a flow.

**Typical events**  
Unhandled exception in trust path, payment flow error, verification flow error, factory failure, enrichment failure, data load failure, fatal integrity error, repeated error threshold reached.

**Why it matters**  
Errors explain **what broke and when**. They are often the first clue in incident review and user support escalation.

---

### Warnings

**Purpose**  
Record non-fatal conditions that signal risk, degradation, or incomplete truth.

**Typical events**  
Purchase data not loaded, founders cohort full, marketplace empty warning, stale data detected, partial enrichment, delayed webhook, degraded engine performance, suspicious but unconfirmed activity.

**Why it matters**  
Warnings preserve early signals before they become failures or disputes. They help explain why operators or users saw incomplete information.

---

### Data Changes

**Purpose**  
Document material mutations to authoritative platform data where the change itself is the event of interest.

**Typical events**  
Deal record materially changed, user entitlement changed, owner case updated, market summary changed, purchase count changed, document metadata changed, state correction applied, stale record refreshed.

**Why it matters**  
Data changes are the substrate of product truth. Recording them makes before-and-after reconstruction possible without guessing from current state alone.

---

### Audit Events

**Purpose**  
Record meta-events about the audit and investigation process itself.

**Typical events**  
Black Box record created, explanation added, evidence linked, investigation opened, investigation note added, restricted record viewed, export authorized, constitutional classification amended for future records only.

**Why it matters**  
Audit events preserve **who investigated what and when**. They prevent the audit layer from becoming an unobserved black hole of its own.

---

## Event Lifecycle

This section defines how an event **comes into existence, remains trustworthy over time, relates to other events, and remains available for investigation** within the Black Box.

The lifecycle is conceptual. It describes obligations and phases, not implementation mechanics.

---

### Event Creation

An event is born at the moment a **material platform fact** occurs or is authoritatively recognized.

Creation must happen as close as possible to the source of truth: the place where the decision, failure, or state transition actually happened. A Black Box event is not created because a dashboard needs content. It is created because reality changed or was confirmed.

Creation implies:

- The platform recognizes that something meaningful happened
- The event can be classified into the constitutional taxonomy
- A durable record can be initiated even if explanation or evidence arrives later

Events may be created synchronously with user action, asynchronously after background processing, or retroactively when delayed external confirmation arrives. Late creation is allowed; silent omission is not.

---

### Event Validation

Before an event becomes part of trusted history, it must pass through validation appropriate to its category and source.

Validation answers:

- Is this event structurally coherent?
- Is the actor plausible?
- Is the category correct?
- Is the timing credible?
- Does the source have authority to assert this fact?

Validation is not censorship. It is quality control on truth entry.

Invalid or incomplete events must not be silently discarded when they represent real attempts or failures. They should either be rejected with a recorded reason or admitted in provisional form until corroboration arrives.

---

### Event Persistence

Persistence is the moment an event becomes part of the Black Box's durable memory.

Once persisted, the event is no longer merely in flight. It becomes part of reconstructible history. Persistence must be designed so that the loss of UI, Admin availability, or non-critical downstream services does not erase the record.

Persistence does not require that all explanation or evidence exist at the same moment. The core event may persist first; enrichment follows through additive lifecycle stages.

---

### Event Immutability

After persistence, the event enters the immutable phase of its life.

Immutability means:

- The original fact is never rewritten
- Corrections arrive as new events or additive overlays
- Interpretation may mature, but the historical assertion remains visible

An event's immutable life protects investigators from retroactive convenience. The platform may change forward; the Black Box remembers what was true when the event was recorded.

---

### Event Correlation

Events rarely exist alone. Correlation is how the Black Box expresses that separate events belong to the same story.

Correlation links events that share:

- A user or owner journey
- A payment or purchase flow
- A verification case
- An admin intervention
- A factory or pipeline run
- An incident or outage
- An external webhook sequence

Correlation does not merge events into one. It preserves distinct facts while making the narrative reconstructible.

---

### Event Timeline

The timeline is the ordered reconstruction of events as they mattered to the platform.

A timeline is not merely chronological sorting. It is the investigator's view of causality, concurrency, delay, and consequence. The Black Box must support timelines at multiple scopes:

- Single actor
- Single deal or property case
- Single payment flow
- Single admin action chain
- Single system incident

Timelines must tolerate delayed events, out-of-order ingestion, and provisional records without breaking narrative integrity.

---

### Event Relationships

Relationships describe how one event stands relative to another.

Common relationship types include:

- **Caused by** — one event led to another
- **Supersedes** — a later clarification replaces interpretive understanding, not historical fact
- **Contradicts** — two events assert incompatible truths pending resolution
- **Enriches** — explanation or evidence added to an earlier event
- **Blocks** — one event prevented another outcome
- **Confirms** — independent corroboration of an earlier assertion

Relationships make the Black Box a graph of meaning, not a flat log.

---

### Event Evidence Chain

The evidence chain is the lifecycle path by which an event becomes supportable.

It typically progresses from assertion to corroboration:

1. Event recorded
2. Explanation attached
3. Evidence linked or referenced
4. Trust level upgraded, downgraded, or explicitly left provisional

The chain may branch. Multiple evidence sources may support one event. One evidence artifact may support multiple related events. The chain must remain explicit so investigators can see not only what was claimed, but what proof was available at the time.

---

### Event Integrity

Integrity is the ongoing assurance that an event remains authentic, complete enough for its class, and uncorrupted over time.

Integrity covers:

- Protection against unauthorized modification
- Protection against silent loss
- Detection of gaps in expected sequences
- Consistency between related events
- Visibility of provisional or disputed status

An event that loses integrity stops being a reliable witness. Integrity is therefore a lifecycle obligation, not a one-time creation property.

---

### Event Retention

Retention defines how long an event remains available under active governance rules.

Retention is driven by legal, security, and business necessity — not by dashboard convenience. Different categories may deserve different retention thinking, but all retention decisions must be explicit and reviewable.

Retention policy must prefer:

- Preserving investigability for consequential events
- Restricting access when exposure risk grows
- Documenting why an event is no longer actively available if policy changes

Retention is about governed availability, not rewriting the past.

---

### Event Archiving

Archiving is the phase in which events move from active operational investigation to long-term preservation.

Archived events remain part of institutional memory but are no longer expected to be queried with the same immediacy as live incident response. Archiving must not destroy lineage, correlation, or legal relevance.

Archiving is a state of governed accessibility, not deletion by another name.

---

### Event Export

Export is the controlled release of event history for investigation, counsel, compliance, or dispute resolution outside the normal product interface.

Export must be:

- Authorized
- Scoped to need
- Traceable as its own audit event
- Redacted where necessary

Export does not transfer ownership of truth away from the Black Box. It is a temporary, accountable copy for external review.

---

### Event Recovery

Recovery addresses what happens when parts of the lifecycle fail: ingestion delay, partial loss, downstream outage, or post-incident reconstruction.

Recovery principles:

- Missing events should be detectable where possible
- Replayed or reconstructed events must be clearly marked as such
- Recovery must not fabricate certainty
- Additive recovery records must explain what was restored and from what source

The goal of recovery is not perfection. It is honest reconstruction with visible uncertainty.

---

### Event Traceability

Traceability is the end-to-end ability to follow an event from origin to consequence.

A fully traceable event can answer:

- Where did it come from?
- Who or what created it?
- What did it affect?
- What evidence supports it?
- What later events depended on it?
- Who viewed or exported it under investigation?

Traceability closes the lifecycle loop. It ensures the Black Box remains accountable not only for platform behavior, but for its own role as witness.

---

## Trust Guarantees

This section defines the **promises** the Black Box makes to the platform, its users, its operators, and external reviewers.

These are guarantees of trust, auditability, and legal defensibility — not implementation claims. They describe what the Black Box must be able to stand behind when facts are questioned.

---

### Integrity

**Guarantee**  
Once recorded, material events remain complete, unaltered, and internally consistent with their stated meaning.

**What this means in practice**  
Investigators can rely on the Black Box as a faithful witness. Gaps, contradictions, and provisional status may exist, but silent corruption must not.

**Why it matters**  
Without integrity, every other guarantee collapses. Trust begins with the assurance that history was not rewritten for convenience.

---

### Authenticity

**Guarantee**  
Events reflect what actually occurred or was authoritatively recognized, with identifiable origin and classification.

**What this means in practice**  
The Black Box distinguishes platform fact from operator summary, user claim, external callback, or inferred monitoring signal.

**Why it matters**  
Authenticity prevents fabricated or decorative records from masquerading as truth.

---

### Non-Repudiation

**Guarantee**  
Material actions attributable to a human, service, or authorized system can be traced back with sufficient confidence that denial becomes implausible without evidence.

**What this means in practice**  
Important decisions — purchases, role changes, admin overrides, owner submissions, verification outcomes — leave attributable traces.

**Why it matters**  
Non-repudiation supports accountability, dispute resolution, and internal governance when someone says, "That was not me" or "That never happened."

---

### Chain of Custody

**Guarantee**  
Evidence linked to events maintains a reconstructible custody path from creation through review, enrichment, restriction, export, and archival.

**What this means in practice**  
An investigator can understand how evidence entered the system, who accessed it, and whether its handling changed its trustworthiness.

**Why it matters**  
Chain of custody is essential when documents, receipts, or external artifacts must hold up outside the product.

---

### Time Accuracy

**Guarantee**  
Events preserve meaningful time truth: when the fact occurred, when it was recorded, and when enrichment arrived, with ambiguity made visible when clocks disagree.

**What this means in practice**  
Timelines remain credible across delayed webhooks, background jobs, retries, and cross-system synchronization.

**Why it matters**  
Many legal and financial disputes hinge on sequence and timing. Approximate time is not enough when order of events determines liability or access.

---

### Evidence Preservation

**Guarantee**  
Corroborating material necessary to support consequential events is preserved, referenced, or governed according to need — not discarded when inconvenient.

**What this means in practice**  
The Black Box favors durable references, redacted representations, and explicit linkage over fragile embedded copies.

**Why it matters**  
A record without preserved evidence is an assertion. A record with preserved evidence becomes defensible truth.

---

### Version Traceability

**Guarantee**  
When meaning, taxonomy, or interpretive context evolves, prior records retain their original classification while later overlays remain visibly additive.

**What this means in practice**  
Reviewers can understand both what was believed at the time and how later understanding changed.

**Why it matters**  
Platforms evolve. Trust requires that old truth is not retroactively re-labeled to match new product language.

---

### User Accountability

**Guarantee**  
User actions with business, legal, or security consequence can be attributed to an identifiable account and session context with appropriate confidence.

**What this means in practice**  
The Black Box supports fair investigation of user behavior without turning every click into surveillance.

**Why it matters**  
Users must be accountable for meaningful actions; the platform must also avoid over-collecting noise in the name of accountability.

---

### Admin Accountability

**Guarantee**  
Administrative power leaves a durable trail. Overrides, approvals, rejections, and sensitive access are never invisible.

**What this means in practice**  
Admin convenience never outranks institutional memory. The Black Box does not depend on Admin UI, but it must record admin consequence wherever authority is exercised.

**Why it matters**  
Privileged actors pose the highest governance risk. Their actions require the clearest trail.

---

### Data Provenance

**Guarantee**  
Material data changes can be traced to an originating event, actor, process, or external source rather than appearing as unexplained state drift.

**What this means in practice**  
Investigators can distinguish user-driven change, automated enrichment, factory output, webhook sync, and manual correction.

**Why it matters**  
Provenance answers the question every serious audit asks: **Where did this value come from?**

---

### Legal Defensibility

**Guarantee**  
The Black Box is designed so that platform decisions can be explained to counsel, regulators, partners, or courts using contemporaneous records rather than reconstructed memory.

**What this means in practice**  
Legal review can rely on attributable events, preserved evidence, visible uncertainty, and immutable history.

**Why it matters**  
Defensibility is not about winning every dispute. It is about being able to show due diligence, good faith, and factual basis.

---

### Audit Readiness

**Guarantee**  
The platform can enter an audit or incident review without improvising history from production databases or operator recollection.

**What this means in practice**  
Reviewers can reconstruct timelines, actor chains, payment paths, owner verification paths, and admin interventions from the Black Box alone.

**Why it matters**  
Audit readiness reduces panic, shortens investigations, and protects leadership when questions arrive without warning.

---

### Disaster Recovery Principles

**Guarantee**  
Loss of application availability must not casually erase institutional memory. Recovery efforts must be honest, additive, and visibly marked.

**What this means in practice**  
If reconstruction is required after failure, the platform distinguishes recovered truth from live-witnessed truth.

**Why it matters**  
Disasters happen. Trust survives only if recovery does not quietly invent a cleaner past.

---

### Privacy Principles

**Guarantee**  
The Black Box collects and exposes only what accountability requires, with restraint proportional to event significance.

**What this means in practice**  
Sensitive personal, financial, and documentary detail is minimized in the record body, redacted on export, and restricted on access.

**Why it matters**  
A witness system must not become a hoard of unnecessary personal data. Privacy and accountability must coexist.

---

### Access Principles

**Guarantee**  
Access to Black Box history is governed, scoped, logged, and justified — especially for sensitive, privileged, or legally restricted material.

**What this means in practice**  
Reading history is itself a consequential act when the content is sensitive. Access leaves its own trace.

**Why it matters**  
Uncontrolled access to audit history creates a second-order security and privacy risk.

---

### Separation of Duties

**Guarantee**  
Those who operate the product, those who investigate history, and those who can alter live state must not collapse into a single unchecked role.

**What this means in practice**  
Recording, reviewing, exporting, and governing the Black Box require distinct responsibilities with overlapping visibility but not unbounded power.

**Why it matters**  
Separation of duties protects the Black Box from becoming both the weapon and the alibi.

---

## Evidence Model

This section defines how the Black Box transforms raw platform activity into **investigable truth**.

The Evidence Model is built on three distinct layers — **Record**, **Explain**, and **Evidence** — and on the investigative structures that combine them into cases, timelines, and defensible packages.

These layers were introduced constitutionally. Here they are developed as a full philosophy.

---

### Record

**Philosophy**  
A Record is the immutable assertion that a material event occurred.

It is the smallest unit of institutional memory. A Record does not argue. It does not interpret. It does not prove. It states:

- something happened
- it happened in a classifiable domain
- it happened in time
- it is attributable with stated confidence

**What a Record is**  
A witness statement from the platform at the moment of recognition.

**What a Record is not**  
A dashboard metric, a user-facing message, a log dump, or a summary written after the fact.

**Design obligation**  
Records must be durable even when explanation is incomplete and evidence has not yet arrived. A late explanation does not recreate the moment. A missing record cannot be replaced by eloquent prose later.

**Trust posture**  
A Record may be verified, asserted, observed, or disputed — but it must always be visible as a claim of fact, not as neutral background noise.

---

### Explain

**Philosophy**  
Explain is the human-meaning layer that answers: **Why does this Record matter, and what does it mean inside RealEstateSniper?**

Explanation translates platform language into investigable language. It connects category, actor, consequence, and severity without altering the underlying Record.

**What Explain is**  
Interpretation bound to a Record, written for reviewers, counsel, operators, and future maintainers who were not present when the event happened.

**What Explain is not**  
A substitute for evidence, a permission to rewrite history, or a place to hide uncertainty behind jargon.

**Design obligation**  
Explanation may evolve as taxonomy matures, but only through additive overlays. Better words must not erase worse words; they must supersede them visibly.

**Trust posture**  
Explain reduces dependence on tribal knowledge. A qualified reviewer should understand the business or security significance of a Record without reading source code or asking the engineer who was on call.

---

### Evidence

**Philosophy**  
Evidence is the corroboration layer that answers: **What proof supports or weakens this Record?**

Evidence turns assertion into defensibility. It may be internal, external, documentary, financial, or procedural — but it must always be linked with explicit custody thinking.

**What Evidence is**  
A reference, artifact, receipt, payload summary, document handle, external confirmation, or corroborating event that supports investigation.

**What Evidence is not**  
The Record itself, casual operator belief, or an undocumented assumption that "the system must have checked it."

**Design obligation**  
Evidence should be linked rather than recklessly duplicated. Sensitive material should be represented with minimum necessary disclosure while preserving investigability.

**Trust posture**  
Evidence upgrades or downgrades confidence. Its absence must be visible. Its presence must be traceable. Its handling must not break chain of custody.

---

### The Three-Layer Relationship

Record answers: **What happened?** It is immutable fact.  
Explain answers: **What does it mean?** It is interpretive meaning.  
Evidence answers: **What proves it?** It is corroboration.

**Rule of separation**  
No layer may silently impersonate another. A beautiful explanation does not create evidence. A strong external receipt does not replace the need for a platform Record. A Record without Explain is cryptic; a Record without Evidence may still matter, but must be marked accordingly.

**Rule of additive enrichment**  
Record first. Explain when possible. Evidence when available. Revisions only forward.

---

### Case Reconstruction

**Philosophy**  
A case is not a single event. It is a **reconstructed narrative** built from related Records, their Explanations, and their Evidence.

Case reconstruction answers a bounded question such as:

- Did this investor receive the access they paid for?
- Was this owner verification decision supported?
- Did this admin override create an improper outcome?
- Did Stripe, the platform, and the user see the same payment truth?

Reconstruction must prefer linked truth over inferred convenience. Gaps in the case must remain visible.

---

### Investigation Workflow

**Philosophy**  
Investigation is a disciplined movement from question to reconstructed answer.

A constitutional workflow proceeds through:

1. **Question formation** — What dispute, incident, or audit matter is being examined?
2. **Scope definition** — Which actors, time window, and categories matter?
3. **Record gathering** — Which immutable events fall inside scope?
4. **Explanation review** — What meaning was attached at the time and later?
5. **Evidence assembly** — What proof supports, weakens, or contradicts the narrative?
6. **Correlation analysis** — What cross-system story emerges?
7. **Finding formulation** — What is known, provisional, unknown, or disputed?
8. **Action boundary** — What remediation belongs outside the Black Box?

The Black Box supports investigation. It does not replace judgment, legal advice, or executive decision.

---

### Evidence Package

**Philosophy**  
An evidence package is a **bounded collection of Records, Explanations, and Evidence** assembled to support a specific review.

It is not a dump of everything the platform knows. It is a curated investigatory object with:

- defined scope
- visible inclusion rules
- explicit omissions where policy requires
- traceable assembly history

A package must be sufficient for an outsider to understand the case without being overwhelmed by irrelevant platform noise.

---

### Chronological Timeline

**Philosophy**  
The timeline is the primary human interface to truth.

It orders Records by meaningful time, not merely by ingestion convenience. A constitutional timeline distinguishes:

- when the fact occurred
- when the platform recorded it
- when explanation was added
- when evidence arrived

Timelines must tolerate delay, concurrency, and provisional entries without pretending that history was simpler than it was.

---

### Cross-System Correlation

**Philosophy**  
RealEstateSniper truth is never confined to one system.

Cross-system correlation links platform Records with external realities such as Stripe events, document submissions, notification delivery, factory output, and admin intervention.

Correlation expresses shared context without collapsing distinct systems into one ambiguous blob. The platform said X. Stripe said Y. The owner uploaded Z. The investigator can see the triangle.

---

### Legal Case Support

**Philosophy**  
Legal case support means the Black Box can help counsel answer: **What did the platform know, do, and record at the time?**

It must support:

- contemporaneous reconstruction
- actor attribution
- policy and acceptance history where relevant
- visible uncertainty
- defensible export boundaries

The Black Box does not provide legal conclusions. It provides the factual substrate from which counsel works.

---

### Internal Audit Support

**Philosophy**  
Internal audit support helps leadership, security, and operations review whether the platform behaved as intended.

It emphasizes:

- admin accountability
- role integrity
- process adherence
- factory and enrichment behavior
- warning and error patterns
- completeness of recording in sensitive paths

Internal audit may be broader and more technical than external or legal review, but it remains bound by access principles.

---

### External Audit Support

**Philosophy**  
External audit support prepares the platform for review by partners, regulators, payment institutions, or professional auditors who do not live inside the product.

It requires:

- clarity over cleverness
- minimum necessary disclosure
- strong package boundaries
- traceable export
- independence from Admin convenience

External reviewers should not need production access to understand material events.

---

### Stripe Dispute Support

**Philosophy**  
Stripe disputes are a specialized class of cross-system reconstruction where money, entitlement, and user expectation collide.

Support requires the ability to reconstruct:

- what the user attempted to buy
- whether payment succeeded, failed, or was reversed
- what entitlement changed on the platform
- what Stripe callbacks were received and when
- whether the platform state matched financial reality at the time

The Black Box must never blur platform access fact with payment fact. Both may be necessary. They are not the same.

---

### Owner Dispute Support

**Philosophy**  
Owner disputes often concern identity, property claim, verification, document validity, and review fairness.

Support requires reconstruction of:

- submission history
- verification decisions
- document handling
- admin or automated review steps
- communications that materially affected the owner

Owner disputes are especially sensitive to chain of custody and visible decision rationale.

---

### Investor Dispute Support

**Philosophy**  
Investor disputes often concern access, purchase entitlement, deal visibility, founder status, and marketplace classification.

Support requires reconstruction of:

- account and role state
- purchase and payment path
- deal eligibility at the relevant time
- marketplace classification seen or claimable by the user
- admin overrides that may have changed access

Investor disputes test whether the marketplace truth shown to the user matches the institutional record.

---

### Export Philosophy

**Philosophy**  
Export is the controlled movement of truth out of the Black Box for review beyond the normal interface.

Export must be:

- **Authorized** — only for legitimate investigation, audit, or legal need
- **Scoped** — limited to the case, not the entire platform
- **Redacted** — privacy-preserving by default
- **Traceable** — export itself becomes part of audit history
- **Non-destructive** — export does not alter or consume the source truth
- **Explainable** — recipients can understand what they received and what was intentionally withheld

Export is not a backup tool, a reporting shortcut, or a way to bypass access principles. It is a formal act of disclosure.

---

## Closing Statement

The RealEstateSniper Black Box is the platform's institutional memory for consequential events.

It must remain:

- **Independent** from Admin
- **Immutable** in spirit and design
- **Explainable** to humans
- **Supportable** by evidence
- **Conservative** in scope
- **Ruthless** about truth

Everything else — storage, transport, UI, and tooling — is implementation. Implementation must serve this constitution, not redefine it.
