# RealEstateSniper Black Box — Architecture

General architecture of the Black Box as an independent accountability layer within RealEstateSniper.

This document defines **how the Black Box is positioned, how information flows through it, and how it relates to other platform domains**. It does not define storage, transport, permissions, or implementation.

For principles, guarantees, and taxonomy, see `BLACK_BOX_CONSTITUTION.md`.

---

## 1. Architecture Purpose

The Black Box architecture exists to give RealEstateSniper a **durable institutional memory** that is separate from product state, operator interfaces, and analytics.

Its architectural job is to:

- Receive meaningful platform events at the source of truth
- Preserve them as immutable Records
- Enrich them with Explain and Evidence over time
- Make them reconstructible for investigation, audit, and dispute resolution

The architecture is optimized for **truth preservation**, not for speed of dashboard delivery or convenience of daily operations.

---

## 2. System Position

Within RealEstateSniper, the Black Box sits **beside** the product, not inside it.

The product creates and changes live state: users, deals, purchases, owner cases, factory output, and admin decisions. The Black Box observes and records consequential change without becoming the mechanism that performs that change.

Architecturally, the Black Box is downstream of authoritative decisions and upstream of investigation. It is not on the critical path of user interaction, but it is on the critical path of trust.

---

## 3. Black Box as Independent Layer

The Black Box must be architected as an **independent layer** with its own obligations, lifecycle, and governance.

Independence means:

- Recording does not require Admin to be open or complete
- Historical truth does not depend on current UI state
- Investigation does not require direct access to production debugging
- Enrichment can arrive after the initial Record without rewriting it

The layer must remain conceptually distinct from:

- Admin Operations Center
- Marketplace presentation
- Billing and entitlement logic
- Owner verification workflows
- Factory orchestration

Independence protects truth from operator convenience and product refactors.

---

## 4. Record → Explain → Evidence Architecture

The Black Box is organized around three architectural layers that must never collapse into one another.

**Record**  
The immutable assertion that a material event occurred. Records enter the layer at the moment of recognition.

**Explain**  
The interpretive layer that makes Records intelligible to humans reviewing disputes, audits, or incidents. Explanation is bound to Records and may mature additively.

**Evidence**  
The corroboration layer that links Records to proof: receipts, documents, external confirmations, or related supporting events. Evidence may arrive after the Record.

Architectural rule: intake creates Records; enrichment adds Explain and Evidence; nothing rewrites the original assertion.

---

## 5. Event Intake

Event intake is the architectural entry point where platform domains emit consequential facts into the Black Box.

Intake must occur as close as possible to the place where truth is decided:

- identity and session outcomes
- entitlement and role changes
- purchase and payment results
- marketplace classification changes
- owner submissions and verification decisions
- admin overrides
- factory and enrichment outcomes
- security and integrity signals

Intake is selective. Not every user action belongs in the Black Box. Only events with accountability, legal, security, or business consequence enter the layer.

Intake must be fail-soft for the product: if recording fails, the product may continue, but the failure itself may become a record-worthy signal.

---

## 6. Event Normalization

Normalization is the architectural process of turning heterogeneous domain signals into constitutionally classifiable events.

Normalization answers:

- Which category does this belong to?
- What is the primary actor?
- What is the primary consequence?
- What severity or trust posture applies?
- What provisional status applies if explanation or evidence is incomplete?

Normalization does not mean erasing domain detail. It means translating domain-specific activity into a shared investigable language without losing the original meaning.

The same real-world outcome may produce multiple related Records across domains. Normalization must preserve distinction rather than forcing false unity.

---

## 7. Event Correlation

Correlation is how the architecture connects separate Records into a reconstructible story.

Correlation groups events that share:

- a user or owner journey
- a purchase and entitlement path
- a Stripe or payment sequence
- a verification case
- an admin intervention chain
- a factory or pipeline run
- a security incident
- a system outage window

Correlation is a relationship layer, not a merge operation. Each Record remains distinct. Investigators see both the events and the narrative links between them.

---

## 8. Event Storage Philosophy

The Black Box stores **events and their lineage**, not product snapshots dressed up as history.

Storage philosophy:

- append-only memory of Records
- additive overlays for Explain and Evidence
- durable identity for every Record
- visible lineage for corrections and clarifications
- governed retention rather than silent disappearance
- separation between institutional memory and live application state

The Black Box is not the live operational state layer. It must never become the place where current marketplace or account state is edited for convenience.

Storage must favor reconstructibility over compactness. Investigators should be able to rebuild what mattered without needing to infer history from present conditions alone.

---

## 9. Event Retrieval Philosophy

Retrieval serves **investigation**, not casual browsing.

Retrieval must support:

- chronological reconstruction
- actor-centered views
- case-centered views
- category filtering
- trust-level filtering
- correlation traversal
- export-scoped assembly

Retrieval must not optimize for vanity metrics, marketing funnels, or real-time operator dashboards. Those belong elsewhere.

The architecture assumes that reading sensitive history is itself a governed act and may require its own audit trail.

---

## 10. Evidence Reconstruction

Evidence reconstruction is the architectural capability to rebuild a defensible case from Records, Explanations, and linked proof.

Reconstruction proceeds from a bounded question:

- What did the investor experience?
- What did the owner submit and what decision followed?
- What did Stripe report versus what the platform granted?
- What did the admin change and when?

Reconstruction assembles:

- the relevant timeline
- the linked Records
- the attached Explanations
- the available Evidence
- the visible gaps and provisional areas

The architecture must make uncertainty visible. A reconstructed case without evidence must still be useful, but it must not pretend to be fully verified.

---

## 11. Admin Viewer Relationship

Admin is a **viewer and future investigation surface**, not the Black Box itself.

Architectural relationship:

- Admin may read Black Box outputs when authorized
- Admin must not be the only place where recording happens
- Admin must not be required for an event to exist in memory
- Admin modules may summarize, filter, and present history for operators
- Admin must not rewrite or replace immutable Records

The Audit and Security Black Box module in Admin is a viewport into this layer, not the definition of it. The architecture treats Admin as a consumer of truth, not the owner of truth.

---

## 12. Marketplace Relationship

The marketplace is one of the highest-value sources of Black Box events because it defines what investors could see and under what classification.

The Black Box must record marketplace-significant changes such as:

- deal visibility and classification changes
- premium and diamond eligibility changes
- enrichment and pricing outcomes
- marketplace integrity warnings
- material shifts in deal quality or availability

The marketplace continues to own live presentation and filtering. The Black Box owns the memory of what the marketplace state was when decisions mattered.

This separation prevents future disputes from being argued only against current deal lists.

---

## 13. Owner Portal Relationship

The Owner Portal is the entry point for ownership intent, submissions, and verification-related activity.

The Black Box must preserve:

- owner submissions
- verification requests and outcomes
- document handling events
- review escalations and rejections
- communications with material legal or trust impact

The Owner Portal owns workflow progression. The Black Box owns the durable trail of what was submitted, reviewed, and decided.

This relationship is especially important for property disputes, fraud review, and chain-of-custody questions around documents.

---

## 14. Factory Relationship

Factory is the machine-driven producer of marketplace and enrichment outcomes.

The Black Box must record factory-significant events such as:

- runs started, completed, or failed
- engine degradation or rejection
- pipeline stage transitions
- outputs published to marketplace-facing state
- duplicate, backlog, or integrity warnings

Factory owns orchestration and transformation. The Black Box owns the memory of how automated change entered the platform.

This matters when no human clicked a button but the product changed anyway.

---

## 15. Stripe Relationship

Stripe is an external financial authority. The Black Box must treat Stripe as a **parallel system of record** for money, not as a substitute for platform entitlement memory.

Architecturally, the Black Box must preserve:

- payment initiation and payment outcomes
- external callback receipt and validation results
- refund and dispute signals
- mismatches between financial reality and platform grants

Platform purchase Records and Stripe payment Records may both be necessary in the same case. The architecture must keep them distinguishable while making reconciliation possible.

---

## 16. Live Datastore Relationship

The live datastore holds the platform's operational state, but the Black Box must not be architecturally dependent on any single operational store as if they were the same thing.

Architectural stance:

- The live datastore may hold current product state and operational services
- The Black Box preserves institutional event memory according to its own obligations
- Infrastructure health events may be recorded
- The Black Box must remain conceptually separable from any one operational store or vendor

The architecture avoids confusing what live state currently shows with what the platform recorded as having happened.

---

## 17. Security Boundary

The security boundary defines what the Black Box protects and from whom.

Inside the boundary:

- immutable Records
- linked Explanations
- linked Evidence references
- correlation and lineage
- investigation and export history

Outside routine access:

- unrestricted operator browsing
- unlogged sensitive review
- uncontrolled export
- silent modification of past truth

The Black Box must assume that its contents are high-value targets. The architecture therefore treats reading, exporting, and governing the layer as security-sensitive operations in their own right.

---

## 18. Access Boundary

The access boundary defines who may see which parts of Black Box history and under what justification.

Access must be:

- role-aware
- case-aware
- purpose-aware
- minimally sufficient
- auditable

Different actors require different visibility:

- platform leadership needs summary and incident reconstruction
- security needs actor and integrity trails
- legal review needs defensible packages
- operations needs bounded operational context
- external auditors need scoped disclosure without production intimacy

The architecture rejects all-or-nothing visibility. It also rejects unbounded internal access by default.

---

## 19. Future Implementation Phases

Implementation must follow the constitution and this architecture in phases. The order below is conceptual, not technical.

**Phase 1 — Constitutional alignment**  
Finalize principles, taxonomy, lifecycle, and trust guarantees. No product coupling required.

**Phase 2 — Intake design**  
Define which domains emit which event classes and at what authoritative points. Still no dependency on Admin completeness.

**Phase 3 — Record layer**  
Establish durable append-only Records with category, actor, time, and trust posture.

**Phase 4 — Explain layer**  
Attach human-readable meaning to Records without rewriting them.

**Phase 5 — Evidence layer**  
Link corroborating material and cross-system proof to Records and cases.

**Phase 6 — Correlation and reconstruction**  
Enable case timelines and cross-domain narratives for disputes and audits.

**Phase 7 — Governed access and export**  
Introduce authorized viewing and scoped disclosure with auditability.

**Phase 8 — Admin viewport**  
Connect Admin modules as read-oriented investigation surfaces, not as the source of truth.

Each phase must preserve independence, immutability, and additive enrichment. No phase may skip straight to dashboards before recording truth reliably.

---

## Core Components

This section defines the **conceptual components** that compose the Black Box architecture. Components are responsibilities, not products or modules. They describe how accountability is divided inside the layer.

---

### Event Producers

**Purpose**  
Emit consequential platform facts at the place where truth is decided.

**Responsibility**  
Identify when a material event has occurred in a domain such as identity, marketplace, purchases, owner verification, factory, admin action, or security. Signal that fact to the Black Box without owning storage, investigation, or presentation of history.

**What it must NOT do**  
Must not write immutable history directly. Must not depend on Admin being open. Must not emit noise without investigable meaning. Must not block product flows when emission fails.

---

### Event Intake Layer

**Purpose**  
Serve as the controlled entry point for all Black Box events.

**Responsibility**  
Receive domain signals, acknowledge intake, preserve arrival context, and hand events forward for validation and normalization. Tolerate delayed or out-of-order arrival without corrupting prior truth.

**What it must NOT do**  
Must not decide final category meaning alone. Must not discard failed attempts silently. Must not merge unrelated events for convenience. Must not require a viewer or dashboard to exist before accepting events.

---

### Event Validator

**Purpose**  
Ensure only coherent, attributable, constitutionally valid events enter durable memory.

**Responsibility**  
Check structural coherence, actor plausibility, category fit, timing credibility, and source authority. Admit provisional events when needed. Reject or quarantine invalid events with recorded reason rather than silent drop.

**What it must NOT do**  
Must not rewrite events to force validity. Must not censor inconvenient truth. Must not act as business rule engine. Must not replace downstream normalization or correlation.

---

### Event Normalizer

**Purpose**  
Translate heterogeneous domain activity into a shared investigable event language.

**Responsibility**  
Assign constitutional category, primary actor, primary consequence, severity, and provisional trust posture. Preserve domain meaning while making events comparable across marketplace, billing, owner, factory, and admin domains.

**What it must NOT do**  
Must not collapse distinct events into one ambiguous record. Must not erase source context needed for investigation. Must not infer facts beyond what the source legitimately asserts.

---

### Event Correlator

**Purpose**  
Link separate events into reconstructible narratives.

**Responsibility**  
Establish relationships across user journeys, payment flows, verification cases, admin chains, factory runs, incidents, and external callbacks. Keep each Record distinct while exposing shared story context.

**What it must NOT do**  
Must not merge events into a single mutable case aggregate. Must not invent causality without basis. Must not hide contradictions between related events.

---

### Immutable Event Store

**Purpose**  
Preserve append-only institutional memory of Records and their lineage.

**Responsibility**  
Retain immutable Records, additive Explain overlays, additive Evidence links, correction lineage, and trust posture history. Support reconstructibility over compactness.

**What it must NOT do**  
Must not overwrite historical Records. Must not become the live operational state layer. Must not store secrets unnecessarily. Must not delete truth silently to satisfy retention discomfort.

---

### Evidence Builder

**Purpose**  
Attach and govern corroboration for Records.

**Responsibility**  
Link receipts, documents, external confirmations, redacted artifacts, and supporting events to Records. Upgrade or downgrade confidence visibly. Preserve chain-of-custody thinking.

**What it must NOT do**  
Must not replace the Record with evidence. Must not embed sensitive material recklessly. Must not present inference as proof. Must not break custody by untracked duplication.

---

### Timeline Builder

**Purpose**  
Reconstruct meaningful chronological views of events.

**Responsibility**  
Order Records by when facts occurred, when they were recorded, and when enrichment arrived. Support actor, case, payment, admin, and incident scopes. Make delay and concurrency visible.

**What it must NOT do**  
Must not pretend ingestion order equals truth order. Must not hide provisional or disputed entries. Must not optimize for marketing funnels or vanity analytics.

---

### Investigation Layer

**Purpose**  
Support human review from question to bounded finding.

**Responsibility**  
Enable scoped gathering of Records, Explanations, Evidence, correlations, and gaps. Support internal audit, legal review, dispute reconstruction, and incident analysis without granting unbounded access by default.

**What it must NOT do**  
Must not alter immutable history. Must not issue legal conclusions. Must not expose full platform memory without purpose. Must not depend on production debugging intimacy.

---

### Export Layer

**Purpose**  
Enable governed disclosure of truth outside the normal investigation interface.

**Responsibility**  
Assemble scoped packages for counsel, auditors, partners, or dispute review. Apply redaction, authorization, traceability, and explicit omission rules. Record export as its own auditable act.

**What it must NOT do**  
Must not become a bulk backup tool. Must not transfer ownership of truth. Must not bypass access principles. Must not mutate source Records during export.

---

### Admin Viewer

**Purpose**  
Provide operators an authorized read-oriented viewport into Black Box history.

**Responsibility**  
Present summaries, filters, timelines, and case views for authorized roles. Help operators understand what happened without making Admin the source of recording or truth.

**What it must NOT do**  
Must not be the Black Box itself. Must not be required for intake or persistence. Must not rewrite or replace Records. Must not become the only investigation path for sensitive review.

---

### Security Boundary

**Purpose**  
Protect the Black Box from unauthorized access, tampering, and uncontrolled disclosure.

**Responsibility**  
Enforce separation between recording, reading, exporting, and governing history. Treat sensitive review, package assembly, and export as security-relevant operations.

**What it must NOT do**  
Must not assume internal users are implicitly trusted. Must not allow silent modification of past truth. Must not confuse monitoring dashboards with institutional memory.

---

### Access Control Boundary

**Purpose**  
Govern who may see which history, for what purpose, and with what justification.

**Responsibility**  
Apply role-aware, case-aware, and purpose-aware visibility. Support least-privilege review for leadership, security, legal, operations, and external auditors.

**What it must NOT do**  
Must not offer all-or-nothing visibility by default. Must not let convenience override privacy or legal restriction. Must not hide that access itself occurred when sensitivity requires it.

---

### Retention Layer

**Purpose**  
Govern how long event memory remains actively available under policy.

**Responsibility**  
Apply retention rules by category, sensitivity, and legal need. Prefer governed restriction over silent erasure. Document when material history moves from active to archived availability.

**What it must NOT do**  
Must not rewrite Records to match retention comfort. Must not destroy lineage without legal authority. Must not treat retention as an excuse to erase inconvenient truth.

---

### Recovery Layer

**Purpose**  
Restore investigability after delay, partial loss, or system failure.

**Responsibility**  
Detect missing expected sequences where possible. Mark reconstructed or replayed truth clearly. Add recovery Records that explain what was restored and from what source.

**What it must NOT do**  
Must not fabricate certainty. Must not silently backfill history as if live-witnessed. Must not overwrite existing Records during recovery.

---

## Event Flow Architecture

This section describes the **conceptual journey of an event** from the moment something meaningful happens in RealEstateSniper until it becomes part of an investigable, exportable body of truth.

The flow is linear in principle but non-linear in time: enrichment, evidence, and correlation may arrive after persistence.

---

### Event Origin

Every Black Box event begins with a **material platform fact** at the source of truth.

Origin may be human action, automated processing, external confirmation, or system recognition of a consequential condition. Origin is not intake and not storage. It is the real-world or platform moment that makes recording necessary.

Examples of origin thinking: a purchase completes, an admin overrides a deal, an owner submits verification material, a factory publishes output, a Stripe dispute opens, a security block triggers.

If nothing material happened, there is no Black Box event.

---

### Event Capture

Capture is the moment the platform recognizes that an origin event must enter the Black Box path.

Capture preserves the fact that the event was noticed near the source of truth, along with enough arrival context to support later validation and normalization. Capture must not depend on Admin visibility or operator attention.

Capture may be immediate or delayed, but delayed capture must not silently erase the origin moment.

---

### Event Validation

After capture, the event passes through validation before it earns durable trust.

Validation asks whether the event is coherent, attributable, categorically plausible, and authoritative enough to enter institutional memory. Events that fail validation are not silently discarded when they represent real attempts or failures. They are rejected with reason or admitted provisionally.

Validation protects the Black Box from noise, malformed assertions, and false certainty.

---

### Event Enrichment

Enrichment adds meaning after the core fact is recognized.

Enrichment includes Explain: why the event matters in platform language. It may also include preliminary trust posture, severity framing, and references to related context. Enrichment is additive. It does not rewrite the original captured fact.

An event may persist before enrichment is complete. Incomplete enrichment must remain visible.

---

### Event Correlation

Correlation places the event in relation to other events that belong to the same story.

A purchase may correlate to an external payment callback, an entitlement change, and a marketplace visibility shift. An owner submission may correlate to document intake, verification review, and admin decision. Correlation creates narrative structure without merging separate facts into one undifferentiated record.

Correlation may happen at intake, after persistence, or during investigation.

---

### Event Persistence

Persistence is when the event becomes part of immutable institutional memory.

At persistence, the Record layer accepts the event into append-only history with durable identity and lineage. Persistence is the point of no rewrite. Later clarification must come through additive Records, Explain overlays, or Evidence links.

Persistence must survive loss of UI, temporary Admin unavailability, and non-critical downstream failure.

---

### Timeline Integration

Once persisted, the event becomes available to timeline reconstruction.

Timeline integration places the event in meaningful time: when the fact occurred, when it was captured, when it was persisted, and when enrichment or evidence arrived. Timeline integration makes sequence, delay, and concurrency visible to investigators.

A persisted event that never enters a meaningful timeline is architecturally incomplete.

---

### Evidence Integration

Evidence integration attaches corroboration to the persisted event.

Evidence may arrive at persistence time or much later. It may include receipts, documents, external confirmations, related Records, or redacted artifacts. Evidence integration upgrades or downgrades confidence visibly and preserves custody thinking.

An important event without evidence may still exist, but it must not pretend to be fully verified.

---

### Investigation Availability

Investigation availability means the event can be discovered within bounded review workflows.

An investigator must be able to find the event through actor scope, case scope, category scope, correlation scope, or timeline scope according to access rules. Investigation availability does not mean public visibility. It means the event is structurally usable in case reconstruction.

The Black Box is unsuccessful if truth is persisted but not discoverable under governance.

---

### Export Availability

Export availability means the event can be included in governed disclosure packages when authorized.

Not every event will be exported, but every consequential event must be exportable in principle within a scoped package with redaction, traceability, and explicit omissions. Export availability completes the lifecycle: the event is not only remembered and investigable, but also disclosable under control.

Export itself becomes a new auditable event in the Black Box story.

---

## Cross-System Event Flow

RealEstateSniper truth is produced across multiple domains. The Black Box must understand how events originate in each domain and how those events travel into shared institutional memory.

The flows below are conceptual. They describe **where truth is born** and **what the Black Box must preserve**, not how any system is built.

---

### Authentication

Authentication events originate at identity boundaries: sign-in, sign-out, failed access, session changes, and elevated access challenges.

Flow concept:

- Origin: identity decision at the authentication boundary
- Capture: authentication outcome recognized as security- or accountability-relevant
- Validation: actor and session context checked for coherence
- Enrichment: security meaning and severity attached
- Correlation: linked to later purchases, role changes, admin access, or security incidents
- Persistence: immutable Record of who accessed or failed to access the platform
- Downstream use: timelines, security review, dispute attribution, audit reconstruction

Authentication does not own entitlement memory. It owns access truth.

---

### Marketplace

Marketplace events originate where deal visibility, classification, and eligibility change.

Flow concept:

- Origin: deal published, hidden, reclassified, enriched, or removed from eligible visibility
- Capture: marketplace-significant change recognized near authoritative deal state
- Validation: deal identity and classification change confirmed as material
- Enrichment: investor-facing meaning and business consequence explained
- Correlation: linked to enrichment, factory output, admin overrides, and purchase entitlement
- Persistence: immutable Record of what the marketplace was at the time
- Downstream use: investor dispute reconstruction, marketplace integrity review, operational audit

The marketplace shows current opportunity. The Black Box remembers what opportunity meant then.

---

### Owner Portal

Owner Portal events originate where ownership intent, submissions, and owner-managed actions occur.

Flow concept:

- Origin: owner enters portal, submits property information, uploads material, or withdraws participation
- Capture: owner action recognized as trust-relevant
- Validation: owner identity and case context checked
- Enrichment: verification and legal meaning attached
- Correlation: linked to documents, property verification, admin review, and notifications
- Persistence: immutable Record of owner assertions and platform receipt
- Downstream use: owner disputes, verification audit, chain-of-custody review

The Owner Portal progresses cases. The Black Box preserves what was asserted and when.

---

### Factory

Factory events originate in automated generation, sync, and transformation workflows.

Flow concept:

- Origin: factory run, engine action, pipeline stage, or publish-to-marketplace outcome
- Capture: machine-driven change recognized as materially affecting product truth
- Validation: run identity, source process, and outcome coherence confirmed
- Enrichment: operational meaning and downstream consequence explained
- Correlation: linked to marketplace changes, enrichment results, warnings, and errors
- Persistence: immutable Record of how automated change entered the platform
- Downstream use: incident review, duplicate analysis, marketplace integrity audit

Factory explains machine causality. The Black Box prevents invisible automation from becoming invisible history.

---

### Stripe

Stripe events originate in external payment authority and callback reality.

Flow concept:

- Origin: payment initiation, payment result, refund, dispute, or sync signal from the external payment authority
- Capture: financial outcome or callback recognized as materially affecting money truth
- Validation: external signal checked for plausibility and alignment with platform context
- Enrichment: financial meaning separated from entitlement meaning
- Correlation: linked to purchase Records, entitlement changes, and investor disputes
- Persistence: immutable Record of financial fact as received or recognized
- Downstream use: Stripe dispute support, reconciliation review, refund audit

Stripe and the platform may both be right about different layers of truth. The Black Box must preserve both without collapsing them.

---

### Admin

Admin events originate where privileged human action changes users, deals, access, or platform configuration.

Flow concept:

- Origin: admin opens sensitive panel, approves, rejects, overrides, suspends, or corrects state
- Capture: privileged action recognized as accountability-relevant
- Validation: admin actor and authority context confirmed
- Enrichment: governance and business consequence explained
- Correlation: linked to affected user, deal, owner case, marketplace state, or security incident
- Persistence: immutable Record of administrative power exercised
- Downstream use: internal audit, abuse review, dispute defense, executive accountability

Admin may view history later, but Admin action must be recorded at the moment authority is used.

---

### Background Jobs

Background Jobs events originate outside immediate user interaction, often after asynchronous processing.

Flow concept:

- Origin: queued work begins, completes, fails, retries, or produces side effects
- Capture: asynchronous outcome recognized as changing or confirming platform truth
- Validation: job context and material effect confirmed
- Enrichment: delayed consequence and operational meaning attached
- Correlation: linked to user journey, marketplace update, enrichment, or system warning
- Persistence: immutable Record of what changed while no one was watching the screen
- Downstream use: incident reconstruction, support escalation, integrity review

Background work must not become invisible merely because it happened later.

---

### Platform Boundary Execution

Platform boundary execution events originate at platform boundaries where external input becomes internal action.

Flow concept:

- Origin: boundary process invoked by external trigger or internal handoff
- Capture: invocation outcome recognized as trust-relevant
- Validation: boundary input authority and outcome coherence assessed
- Enrichment: boundary meaning and downstream consequence explained
- Correlation: linked to external payment callbacks, integrations, authentication, or system warnings
- Persistence: immutable Record of boundary crossing and result
- Downstream use: security review, integration audit, failure analysis

Platform boundary execution is often the moment outside reality enters the platform. That moment must be remembered.

---

## Investigation Architecture

This section defines how an investigation **moves through the Black Box** from an initial question to a bounded, defensible understanding of what happened.

Investigation is read-oriented. It reconstructs truth; it does not create product state or rewrite history.

---

### Investigation Entry Points

**Purpose**  
Define the legitimate starting points from which an investigator enters Black Box history.

**How it conceptually works**  
An investigation may begin from an actor, a deal, a property case, a payment dispute, an admin action, a security signal, a factory run, a user complaint, or an audit request. The entry point sets initial scope: who or what is at the center of the question and which constitutional categories are likely relevant.

**Why it exists**  
Without defined entry points, investigators either search too broadly and drown in noise, or start from current product state and reconstruct history incorrectly.

---

### Case Creation

**Purpose**  
Open a bounded investigatory container around a specific question.

**How it conceptually works**  
Case creation turns a raw concern into a formal review matter with stated purpose, initial scope, relevant actors, time window, and suspected domains such as marketplace, billing, owner verification, or admin override. The case does not contain truth itself. It organizes the search for truth.

**Why it exists**  
Investigation without case boundaries becomes endless browsing. Cases make review purposeful, auditable, and exportable.

---

### Case Context

**Purpose**  
Preserve the framing information that gives meaning to everything discovered later.

**How it conceptually works**  
Case context includes the triggering complaint or audit matter, the investigator role, the review purpose, the initial hypothesis if any, the known constraints such as legal sensitivity or partner involvement, and the categories expected to matter. Context travels with the case so later findings are interpreted correctly.

**Why it exists**  
The same events can look different depending on why they are being reviewed. Context prevents misinterpretation and unsupported leaps.

---

### Timeline Reconstruction

**Purpose**  
Rebuild the sequence in which material facts occurred and were recognized.

**How it conceptually works**  
The investigator assembles Records in meaningful time: when the fact happened, when it was captured, when it was persisted, when Explain arrived, and when Evidence linked. Timeline reconstruction exposes delay, concurrency, reversal, and provisional status without pretending that history was simpler than it was.

**Why it exists**  
Most disputes are arguments about sequence. Timeline reconstruction is the primary human path to causality.

---

### Cross-System Correlation

**Purpose**  
Unite events from separate domains into one investigable story.

**How it conceptually works**  
The investigator follows correlation links across authentication, marketplace, purchases, Stripe, owner verification, factory output, admin action, and system warnings. Each system retains its own Records, but the case reveals how they relate. The platform said one thing; Stripe said another; the owner submitted a third.

**Why it exists**  
RealEstateSniper truth is never confined to one module. Disputes fail when investigators cannot see the cross-system triangle.

---

### User Journey Reconstruction

**Purpose**  
Rebuild what a specific user experienced and what the platform recorded about their account over time.

**How it conceptually works**  
The investigator gathers Records tied to the user across authentication, account changes, founder status, subscription state, purchases, marketplace access, and support-relevant warnings. The journey shows what the platform knew about the user at each step and what changed.

**Why it exists**  
User disputes often claim unfair access, lost entitlement, or unauthorized change. Journey reconstruction tests those claims against institutional memory.

---

### Property Journey Reconstruction

**Purpose**  
Rebuild the life of a property-related case from submission through verification and outcome.

**How it conceptually works**  
The investigator follows owner assertions, document events, verification decisions, enrichment changes, admin review if any, and resulting marketplace or case status. The journey shows what was submitted, what was reviewed, what was decided, and what evidence supported those decisions.

**Why it exists**  
Owner and property disputes hinge on whether the platform handled a claim fairly and with adequate proof.

---

### Purchase Journey Reconstruction

**Purpose**  
Rebuild the commercial path from purchase intent to entitlement outcome.

**How it conceptually works**  
The investigator traces purchase attempts, completed purchases, payment outcomes, entitlement grants or revocations, related deal access, and any later refund or dispute signals. Purchase journey separates what the user tried to buy, what money did, and what access resulted.

**Why it exists**  
Investor and billing disputes are usually journey disputes. Current entitlement alone cannot answer what happened at purchase time.

---

### Admin Decision Reconstruction

**Purpose**  
Rebuild how administrative authority was exercised in a matter.

**How it conceptually works**  
The investigator gathers Records of admin access, approvals, rejections, overrides, suspensions, and manual corrections linked to the case. The reconstruction shows who acted, what they changed, what reason class applies, and what consequences followed.

**Why it exists**  
Privileged action is the highest governance risk. Admin reconstruction protects both the platform and its operators.

---

### Factory Execution Reconstruction

**Purpose**  
Rebuild how automated processing affected a case or marketplace outcome.

**How it conceptually works**  
The investigator follows factory runs, engine behavior, pipeline stages, published outputs, warnings, and failures connected to the matter. The reconstruction shows whether a human decision or machine process caused the outcome under review.

**Why it exists**  
Automation can change the product without a visible human actor. Factory reconstruction prevents machine causality from disappearing.

---

### Security Incident Reconstruction

**Purpose**  
Rebuild the timeline and impact of a security-relevant event or pattern.

**How it conceptually works**  
The investigator assembles authentication anomalies, blocked actions, role changes, suspicious access, tamper signals, incident containment steps, and related admin or system Records. The reconstruction emphasizes actor attribution, severity, and consequence.

**Why it exists**  
Security response depends on sequence and attribution. Incident reconstruction must be possible without production debugging access.

---

### Legal Investigation

**Purpose**  
Support counsel in determining what the platform knew, did, and recorded at the time.

**How it conceptually works**  
Legal investigation emphasizes contemporaneous Records, legal acceptance history where relevant, actor attribution, visible uncertainty, document and payment chains, and export-bounded packages. It avoids legal conclusions inside the Black Box and instead supplies defensible factual substrate.

**Why it exists**  
Legal review requires memory, not current-state inference. The platform must be explainable to counsel without insider reconstruction.

---

### Internal Investigation

**Purpose**  
Enable leadership, security, and operations to determine whether the platform behaved as intended.

**How it conceptually works**  
Internal investigation may be broader than legal review and may include factory behavior, warning patterns, admin accountability, role integrity, and completeness of recording in sensitive paths. It remains governed by access principles and case scope.

**Why it exists**  
The company must be able to review itself without improvising history from live systems or operator memory.

---

### External Investigation

**Purpose**  
Support partners, regulators, payment institutions, or professional auditors who do not operate inside the product.

**How it conceptually works**  
External investigation relies on scoped packages, minimum necessary disclosure, clear boundaries, traceable export, and plain explanation of what is known, provisional, omitted, or disputed. External reviewers should not need intimate production access to understand material events.

**Why it exists**  
Trust with partners and regulators depends on controlled transparency, not ad hoc screen sharing.

---

### Evidence Consolidation

**Purpose**  
Bring Records, Explanations, and linked proof into one coherent review body.

**How it conceptually works**  
The investigator gathers all corroborating material for the case: receipts, documents, external confirmations, related Records, and trust posture changes. Consolidation makes gaps visible. It upgrades or leaves provisional those claims that remain unsupported.

**Why it exists**  
Scattered truth is not investigable truth. Consolidation turns architecture into a usable case.

---

### Final Case Package

**Purpose**  
Produce the bounded output of an investigation for decision, export, or archival.

**How it conceptually works**  
The final case package contains the question, the scope, the timeline, the key Records, the Explanations, the consolidated Evidence, the known gaps, the disputed areas, and the investigator findings at the level of factual reconstruction. It is curated, not exhaustive. It is sufficient for its purpose without exposing irrelevant platform memory.

**Why it exists**  
Investigation must end in something usable: a leadership decision, a legal handoff, a dispute response, an audit answer, or a governed export. The package is the architectural deliverable of the Black Box review process.

---

## Closing Note

The Black Box architecture turns RealEstateSniper from a product that merely works into a platform that can **remember, explain, and defend** what it did.

Implementation will come later. This document defines the shape that implementation must serve.
