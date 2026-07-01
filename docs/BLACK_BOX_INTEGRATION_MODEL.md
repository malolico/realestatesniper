# RealEstateSniper Black Box — Integration Model

Conceptual model for how every RealEstateSniper domain integrates with the Black Box as institutional memory.

This document defines **where truth is born, who emits it, and how domains participate without coupling product logic to memory internals**. It does not define transport, storage, permissions implementation, or concrete interfaces.

For constitutional integration rules, see `BLACK_BOX_CONSTITUTION.md`.  
For cross-system flow and intake architecture, see `BLACK_BOX_ARCHITECTURE.md`.  
For event meaning and naming, see `BLACK_BOX_EVENT_MODEL.md` and `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For governance and security boundaries, see `BLACK_BOX_GOVERNANCE.md` and `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Integration Model exists so that every platform domain knows **how to participate in accountability memory** without becoming dependent on it for product behavior.

Its purpose is to answer:

- Where must each domain emit material facts?
- What must domains never delegate to the Black Box?
- How do domains remain loosely coupled while still enabling correlation?
- How is integration governed as the platform grows?

Integration is not adoption of a logging library. It is adoption of a **shared accountability contract** across RealEstateSniper.

---

## 2. Integration Philosophy

The Black Box integrates with RealEstateSniper as **infrastructure for truth**, not as a feature added after product decisions are made.

Integration philosophy rests on seven commitments:

1. **Emit at the source of truth** — Recognition happens where authoritative decisions occur, not only where outcomes are displayed.
2. **Loose coupling** — Domains participate without understanding Black Box internals.
3. **Additive enrichment** — Explanation and evidence may arrive later without rewriting the original assertion.
4. **Distinct domain facts** — Each domain preserves its own layer of truth; integration links stories without merging facts.
5. **Graceful degradation** — If enrichment or downstream handling fails, the core assertion should still survive where recognition succeeded.
6. **Cross-domain correlation** — Related journeys remain linkable through shared investigatory context.
7. **Human investigation first** — Integration serves reviewers, counsel, and dispute reconstruction before it serves charts or convenience.

The Black Box observes and remembers. Product domains decide and act.

---

## 3. Loose Coupling Principles

Loose coupling keeps product evolution **independent from memory evolution**.

**Domains emit; they do not own memory**  
Each domain recognizes material facts and hands them to governed intake. Domains do not store, rewrite, or adjudicate institutional history.

**No reverse dependency**  
The Black Box must not become a prerequisite for core product flows. Product behavior must not block on memory availability in ways that corrupt user experience or invent silent omission.

**Thin participation surface**  
Domains need only understand: what is material, when to recognize it, which category owns it, and how to provide correlation context. They do not need schema, investigation, or export knowledge.

**Registry, not negotiation**  
Canonical event classes are registered centrally. Domains propose and emit under registry authority; they do not invent local dialects.

**Read consumption is separate**  
Authorized review surfaces may read memory later. Reading history must not define whether history was recorded.

**Failure isolation**  
Intake failure in one domain must not corrupt prior memory or block unrelated domains from emission where safe.

Loose coupling ensures the Black Box can mature without holding product releases hostage, and product can evolve without fragmenting accountability language.

---

## 4. Event Producer Principles

An event producer is **any domain or boundary that authoritatively recognizes a material fact** and initiates governed intake.

Producer principles:

**Recognition at authority**  
Producers emit at the moment the fact is decided or credibly detected, not when a downstream observer notices side effects.

**One fact, one primary emission**  
Each material recognition should map to one governed event class. Duplicate meaning from replay must be prevented by intent, not by hope.

**Category honesty**  
Producers emit under the primary constitutional category that owns the fact. Financial receipt is not purchase entitlement. Authentication success is not role grant.

**Correlation generosity**  
Producers supply enough shared context for later correlation across domains without embedding entire foreign stories.

**Provisional admission**  
When full validation is unavailable, producers still signal material attempts and failures rather than staying silent.

**No presentation emission**  
Producers must not emit because a screen rendered or a summary refreshed. Emission follows truth, not visibility.

**Producer accountability**  
Each domain remains steward of its emission quality even though platform governance owns the registry.

Producers are the mouth of institutional memory. Integration fails when everyone assumes someone else will speak.

---

## 5. Authentication Integration

Authentication integrates at **identity boundaries** where access is granted, denied, challenged, or ended.

**What authentication owns**  
Who attempted to access the platform, whether access succeeded, whether identity signals were trusted or rejected, and when sessions materially changed.

**What authentication does not own**  
Entitlements, purchases, marketplace visibility, owner verification outcomes, or privileged governance decisions.

**Integration stance**  
Authentication emits at the identity decision point. Later domains may correlate to the same actor journey, but authentication remains the authority for access truth.

**Why it matters**  
Without authentication integration, downstream events cannot be attributed confidently to a person, service, or session.

Authentication is the front door to accountability. Integration here is attribution infrastructure.

---

## 6. Marketplace Integration

Marketplace integrates where **deal visibility, classification, and eligibility** materially change.

**What marketplace owns**  
What opportunities existed, how they were classified, who could see them, and when meaningful visibility or tier truth changed.

**What marketplace does not own**  
Payment capture, external financial confirmation, owner verification decisions, or automated factory causality — though all may correlate.

**Integration stance**  
Marketplace emits near authoritative deal state changes. Investor-facing summaries are not substitutes for emission at truth.

**Why it matters**  
Marketplace history explains what investors could see, when, and under what classification — central to fairness and access disputes.

The marketplace shows current opportunity. The Black Box remembers what opportunity meant then.

---

## 7. Owner Portal Integration

Owner Portal integrates where **ownership intent, submissions, and owner-managed participation** occur.

**What the owner domain owns**  
Owner entry into participation, property assertions, material uploads, withdrawals, and owner-side preference changes with trust impact.

**What the owner domain does not own**  
Verification decisions, document custody conclusions, marketplace publication outcomes, or payment facts — though all may correlate.

**Integration stance**  
Owner Portal emits when the owner asserts or withdraws participation and when the platform credibly receives that action.

**Why it matters**  
Owner disputes hinge on what was submitted, when, and what the platform acknowledged receiving.

The portal progresses cases. The Black Box preserves assertions and receipt truth.

---

## 8. Admin Integration

Admin integrates where **privileged human action** changes users, deals, access, configuration, or governance outcomes.

**What administrative action owns**  
Approvals, rejections, overrides, suspensions, manual corrections, and other exercises of elevated platform power.

**What administrative action does not own**  
The Black Box itself, registry definition, or the right to rewrite historical assertions through operator tools.

**Integration stance**  
Administrative power emits at the moment authority is used, not when history is reviewed later. Review surfaces may read memory, but they are not the source of emission.

**Why it matters**  
Privileged action without memory becomes unreviewable power. Administrative integration makes governance visible.

Administration acts on live state. The Black Box remembers how that power was used.

---

## 9. Factory Integration

Factory integrates where **automated generation, sync, transformation, and publish outcomes** materially alter product truth.

**What factory owns**  
Machine-driven runs, pipeline stages, engine outcomes, and automated changes that affect marketplace, enrichment, or trust-relevant availability.

**What factory does not own**  
Human approvals, owner assertions, or external payment confirmation — though outputs may trigger or correlate with them.

**Integration stance**  
Factory emits when automated processes change or confirm truth that would otherwise be invisible after the fact.

**Why it matters**  
Invisible automation becomes invisible history. Factory integration preserves machine causality for integrity review.

Factory explains how automated change entered the platform. The Black Box prevents silent machine edits to truth.

---

## 10. Stripe Integration

Stripe integrates as the **external payment authority** parallel to platform purchase and entitlement memory.

**What external payment authority owns**  
Payment initiation outcomes, financial capture or failure, refunds, disputes, synchronization signals, and external financial confirmations received at the platform boundary.

**What it does not own**  
Product entitlement meaning, marketplace visibility, or internal purchase business semantics — though all three layers may appear in one user journey.

**Integration stance**  
Financial facts emit from boundary recognition of external authority signals and from platform-side payment truth where internally authoritative. Platform purchase memory and external payment memory remain distinguishable and correlatable.

**Why it matters**  
Money disputes require reconstructing both what the platform granted and what the external authority reported.

Stripe and the platform may each be right about different layers. Integration must preserve both without collapse.

---

## 11. Notification Integration

Notification integrates where **delivery or failure has business, legal, or trust consequence**.

**What notification owns**  
Meaningful send attempts, deliveries, failures, retries, and channel outcomes that affect whether parties were informed in a dispute-relevant way.

**What notification does not own**  
The underlying business fact that triggered the notice. Notification corroborates communication; it does not replace the originating domain assertion.

**Integration stance**  
Notification emits for consequential communication paths, not for every transient message. Failures with accountability impact are as important as successes.

**Why it matters**  
Disputes often ask whether a party was told something material at the time it mattered.

Notifications carry consequences. The Black Box remembers whether communication truth aligned with platform action.

---

## 12. Background Jobs Integration

Background Jobs integrate where **asynchronous work changes or confirms truth** outside immediate user interaction.

**What background work owns**  
Queued processing that begins, completes, fails, retries, or produces side effects material to trust, access, marketplace state, enrichment, or integrity warnings.

**What background work does not own**  
The user gesture that may have triggered the queue, unless the trigger itself was the authoritative fact.

**Integration stance**  
Delayed truth still emits. Late recognition is acceptable; silent omission is not.

**Why it matters**  
Many platform changes happen while no one is watching a screen. Without background integration, timelines break exactly when support and audit need them most.

Background work must not hide behind delay. Integration makes asynchronous consequence visible.

---

## 13. External Services Integration

External Services integrate at **platform boundaries** where third-party systems alter, confirm, or challenge internal truth.

**What external integration owns**  
Connection lifecycle, sync outcomes, rejected boundary input, partner signals, and external confirmations beyond payment authority where they materially affect accountability.

**What external integration does not own**  
Internal product semantics. External truth and platform truth remain correlatable but distinct.

**Integration stance**  
Boundary crossing is a first-class integration moment. Invalid or rejected external input may itself be material when trust paths fail.

**Why it matters**  
Outside reality enters the platform at boundaries. Integration records that entry so failures cannot silently break accountability.

External services are parallel witnesses. The Black Box preserves what they said and what the platform did with it.

---

## 14. Future Integrations

Future domains integrate only when they **materially affect trust, access, money, ownership, security, or governance**.

**Allowed future integration**

- New product surfaces that create authoritative facts rather than display state
- New external authorities with financial, legal, or identity consequence
- New automated pipelines that alter marketplace or verification truth
- New governance or audit classes required by constitutional expansion

**Integration requirements**

Every proposed integration must answer:

1. What authoritative fact does this domain own?
2. Where is the source of truth for emission?
3. Which primary category applies?
4. What domains must correlate without merged emission?
5. Does integration remain loosely coupled and failure-isolated?

**Disallowed integration patterns**

- Emitting from presentation layers because it is convenient
- Logging noise without investigable meaning
- Coupling memory creation to a single release surface
- Treating analytics or telemetry as institutional memory
- Using the Black Box as live state storage

Future integrations extend the accountability perimeter deliberately, not by accretion of convenience.

---

## 15. Integration Governance

Integration governance ensures **participation remains consistent, reviewable, and subordinate to constitutional memory rules**.

**Registry authority**  
New event classes and domain emission obligations enter through governed registry review, not local team decision alone.

**Domain stewardship**  
Each integrated domain stewards emission quality, category fit, and correlation context for its facts.

**Cross-domain review**  
Flows that touch money, ownership, privileged action, or external authority require memory review before broad emission begins.

**Deprecation and transition**  
Integration changes that retire or replace event classes follow governance deprecation rules without rewriting historical material.

**Security and access alignment**  
Integration design must respect trust boundary, immutability, and minimum necessary disclosure from the security model.

**Integration audit**  
Material integration rollout should be retrospectively reviewable: Did the domain emit at truth? Did correlation hold under dispute scenarios?

Integration governance connects product domains to institutional memory without letting any domain become a private archive.

---

## Closing Note

The Integration Model defines **how RealEstateSniper speaks to the Black Box**.

Philosophy and loose coupling keep domains independent. Producer principles keep emission honest. Each domain section marks what truth it owns and what it must leave to others. Future integrations and governance keep the perimeter deliberate as the platform grows.

Implementation of intake paths comes later. This document defines the conceptual contract every system must honor to participate in accountability memory.
