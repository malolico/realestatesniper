# RealEstateSniper Black Box — Technical Integration Architecture

Technology-independent integration architecture for the Black Box — **how every RealEstateSniper domain participates in institutional memory** before any interface, transport, or messaging product is chosen.

This document defines **logical integration layers, domain responsibilities, and integration discipline** at high technical level. It does not define APIs, concrete event classes, protocols, queues, brokers, transport mechanisms, schemas, or code.

For conceptual domain participation, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For technical system layers, see `BLACK_BOX_TECHNICAL_ARCHITECTURE.md`.  
For event flow stages after handoff, see `BLACK_BOX_TECHNICAL_EVENT_PIPELINE.md`.  
For logical entities integrated, see `BLACK_BOX_TECHNICAL_DATA_MODEL.md`.  
For domain meaning, see `BLACK_BOX_EVENT_CATALOG.md` and functional catalogs where defined.  
For access over integrated memory, see `BLACK_BOX_TECHNICAL_ACCESS_ARCHITECTURE.md`.  
For governance rules, see `BLACK_BOX_GOVERNANCE.md`.  
For memory protection, see `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Technical Integration Architecture exists so that future integration implementation **binds every platform domain to accountability memory without coupling product logic to memory internals**.

Its purpose is to answer:

- How should each RealEstateSniper domain integrate with the Black Box at the technical layer?
- What integration responsibilities remain with domains versus intake, pipeline, and memory?
- How do reliability, failure, idempotency, ordering, and consistency apply across domain boundaries?
- What rules must any future integration design obey?

This document describes **integration shape at the architectural level**. It does not name message buses, webhooks, SDKs, or synchronization products.

---

## 2. Integration Philosophy

Integration philosophy treats domain participation as **authoritative truth handoff**, not as ambient logging.

Philosophy principles:

1. **Emit at authority** — Recognition occurs where the domain decides a material fact exists, not at presentation or observation layers.
2. **Loose coupling inward** — Domains signal truth; they do not own admission, storage, investigation, or export internals.
3. **One primary domain per assertion** — Every material fact has one owning domain; correlation links without merger.
4. **Additive downstream** — Enrichment, evidence, and correlation may follow emission without rewriting the core handoff.
5. **Failure visibility** — Rejection, delay, duplication risk, and provisional posture are integration facts when material.
6. **No reverse dependency** — Product flows must not block on memory read paths; emission discipline must not invent silent omission.
7. **Technology agnosticism** — This architecture must remain valid across any compliant integration substrate.
8. **Decades horizon** — Integration choices must support long dispute reconstruction, not only near-term delivery convenience.

Integration exists so **every domain can participate in witness** without becoming a memory system.

---

## 3. Integration Layers

The Black Box organizes domain integration into **five logical integration layers** plus cross-cutting governance discipline.

- **Domain Recognition Layer** — authoritative detection that a registry-aligned material fact occurred
- **Emission Boundary Layer** — controlled handoff from domain truth to Black Box intake
- **Intake Coupling Layer** — reception, acknowledgment, and routing toward pipeline stages
- **Correlation Context Layer** — shared investigatory anchors carried across domain emissions
- **External Boundary Layer** — parallel truth crossing between platform and outside systems

Layers are **logical integration zones**. A future physical system may unify delivery infrastructure, but responsibilities must not blur.

**Producer versus consumer posture**

- Platform domains are producers at Recognition and Emission Boundary layers
- Black Box intake and pipeline are consumers of governed handoff, not owners of domain decisions
- External systems speak at External Boundary Layer; internal domains interpret parallel truth separately
- Investigation, export, and access layers consume integrated memory downstream; they do not define integration contracts

**Relationship to technical architecture**

Integration layers map to Layers 1–3 of `BLACK_BOX_TECHNICAL_ARCHITECTURE.md` (Platform Domain Emission, Emission Boundary, Intake and Admission). Layers 4–10 remain Black Box-internal responsibilities that domains must not need to understand in detail.

---

## 4. Domain Integration Responsibilities

Domain integration responsibilities define **what each platform domain must own** when participating in Black Box memory.

**Universal domain obligations**

- recognize material facts at authoritative decision points
- classify primary domain ownership before handoff
- provide actor, subject, and correlation context sufficient for later investigation
- emit governed signals without depending on memory availability for core product behavior
- never write immutable memory directly or mutate accepted assertions through integration shortcuts

**Domain families and integration posture**

- **Identity and account domains** — Authentication, User Account, Legal: emit at boundary and state-transition authority; correlate to sessions and policy acceptance without merging entitlement truth.
- **Commercial domains** — Marketplace, Purchase, Payment, Founder: emit at entitlement, presentation, and financial recognition points; preserve parallel commercial layers without collapsing purchase and payment meaning.
- **Owner and property domains** — Owner, Property, Document, Verification: emit at participation, subject, custody, and review-outcome authority; keep assertion, document handling, and verification conclusion separable.
- **Privileged and operational domains** — Admin, Security, System: emit at consequential operator action, threat response, and platform condition authority; never substitute monitoring noise for materiality-governed signals.
- **Automation domains** — Factory, Engine, Pipeline, Enrichment: emit at orchestration, component, staged-flow, and enrichment authority respectively; preserve layer honesty without call-log smuggling.
- **Communication and notification domains** — Communication, Notification: emit at material delivery and accountability-relevant communication outcomes; avoid transport telemetry as institutional memory.
- **External boundary domain** — Integrations: emit at frontier crossing and external authority reception; preserve parallel external truth without absorbing it into internal product semantics.

**Black Box obligations toward domains**

- acknowledge governed handoff without requiring domain knowledge of pipeline internals
- preserve arrival context including delay and out-of-order posture
- return admission outcome visibility where product accountability requires bounded feedback
- isolate intake failure so unrelated domains may continue emission where safe

**Forbidden responsibility shifts**

- domains delegating authoritative recognition to downstream observers
- Black Box defining when a domain fact occurred
- Admin or investigation surfaces becoming integration producers for domain truth
- external callback logs treated as substitute for domain or boundary recognition

Each domain integrates as **a truth owner at the edge**, not as a memory operator at the core.

---

## 5. Event Emission Principles

Event emission principles define **how governed handoff crosses the emission boundary** without naming concrete event classes or delivery mechanisms.

**Emission discipline**

1. **Registry alignment** — Emission intent must map to governed catalog classes before broad production participation.
2. **Authority binding** — Emission occurs at the decision point that owns the fact, not at symptomatic side effects.
3. **Primary classification first** — Owning domain is explicit in handoff context; secondary domains appear through correlation, not ambiguous dual ownership.
4. **Attribution sufficiency** — Actor identity and action posture are present at emission where policy requires investigability.
5. **Subject anchoring** — User, property, deal, case, or resource anchors travel with handoff sufficient for later scoping.
6. **Correlation carry-forward** — Journey identifiers and episode anchors link related emissions without merging assertions.
7. **Provisional honesty** — When full validation is not yet possible at source, provisional posture is declared rather than implied as final.

**Emission timing**

- occurred-time reflects when the domain recognizes the fact
- recorded-time begins at intake acknowledgment, not at domain-side preparation alone
- late emission is permitted; silent omission of material facts is not

**Volume discipline**

- emission follows materiality, not observability volume
- diagnostic, metric, and routine retry noise must not cross the boundary as institutional memory

Emission is **the contract between domain truth and institutional memory**.

---

## 6. Reliability Principles

Reliability principles define **how integration remains dependable without making memory a product bottleneck**.

**Reliability posture**

1. **Recognition survives downstream strain** — Domain decision and emission attempt must remain honest even when intake is degraded.
2. **Durable handoff intent** — Governed signals must be capable of surviving transient failure between domain and intake without silent loss where materiality demands preservation.
3. **Bounded feedback loops** — Domains may observe admission outcome for accountability; they must not poll memory as operational datastore.
4. **Isolation by domain** — Failure in one domain's integration path must not corrupt unrelated domain emissions or prior memory.
5. **Graceful degradation** — Product behavior continues under defined policy when enrichment or read paths lag; emission obligation for material facts remains.
6. **Recovery without rewrite** — Replay and catch-up integrate as additive admission discipline, not as silent overwrite of prior assertions.
7. **Operational proportionality** — Reliability investment aligns to domain trust impact, not uniform over-engineering of low-materiality noise.

Reliability serves **truth survival**, not maximum signal throughput.

---

## 7. Failure Handling

Failure handling defines **how integration treats breakdown without laundering accountability gaps**.

**Failure categories**

- **Emission failure** — domain cannot complete governed handoff after recognizing material fact
- **Transport failure** — handoff does not reach intake within expected accountability window
- **Admission rejection** — intake or validation refuses signal as ungoverned, incoherent, or out of registry
- **Provisional hold** — signal preserved under incomplete validation or disputed source posture
- **Downstream processing failure** — persistence, enrichment, or correlation lag after successful admission
- **External boundary failure** — partner, authority, or frontier unavailable, rejected, or drifted

**Handling discipline**

- material emission failure must be detectable to domain accountability, not invisible to investigators later
- rejected signals remain visible as boundary outcomes where policy requires, not silently discarded
- provisional hold must remain distinguishable from final acceptance in integrated memory
- downstream failure must not retroactively negate admitted core assertion meaning
- external boundary failure preserves parallel unavailable or rejected posture without inventing internal product facts

**Product interaction**

- user-facing flows may continue under policy when handoff is delayed
- continuing product behavior must not pretend unemitted material facts never occurred
- compensation paths may emit new governed assertions; they do not edit prior memory

Failure handling keeps **gaps and breakdowns investigable**, not embarrassing secrets.

---

## 8. Idempotency Principles

Idempotency principles define **how repeated or duplicate handoff does not corrupt institutional meaning**.

**Core principles**

1. **One meaning, one primary assertion** — Duplicate recognition of the same material fact must converge to accountable posture, not parallel contradictory cores.
2. **Identity permanence** — Canonical assertion identity survives retries, replays, and recovery without meaning drift.
3. **Replay is not rewrite** — Retried handoff may produce additive lineage facts; it must not silently replace prior accepted assertion.
4. **Source deduplication honesty** — Domains should prevent naive duplicate emission at authority where possible; intake must still defend memory when duplicates arrive.
5. **Idempotency scope is semantic** — Protection applies to material fact meaning, not merely to technical duplicate packets.
6. **Cross-domain duplicates remain visible** — Related emissions from different domains may legitimately coexist; deduplication must not merge parallel truth layers.
7. **Recovery replay discipline** — Catch-up after outage must declare replay posture so investigators can distinguish original arrival from recovery arrival where timing matters.

Idempotency protects **memory from accidental multiplication**, not legitimate multi-domain truth.

---

## 9. Ordering Principles

Ordering principles define **how integration handles sequence without forcing false simultaneity**.

**Ordering posture**

1. **Occurred-time is authoritative for meaning** — When facts happened matters more than when handoff arrived.
2. **Arrival order may diverge** — Out-of-order integration is expected across domains, batch systems, and external boundaries.
3. **No global clock fantasy** — Integration architecture must tolerate partial ordering and delayed visibility without corrupting prior assertions.
4. **Causal narration is downstream** — Timeline and investigation layers assemble sequence; domains emit local truth, not global orchestration.
5. **Boundary latency is visible** — Delay between external authority and internal recognition remains investigable as gap when material.
6. **Automation ordering honesty** — Factory, engine, and pipeline emissions preserve staged sequence without pretending synchronous platform-wide commits.
7. **Ordering does not imply dependency** — Later arrival does not invalidate earlier accepted facts; it may trigger correlation and contradiction review.

Ordering principles make **time truthful under distributed reality**.

---

## 10. Consistency Principles

Consistency principles define **how integrated memory remains coherent across domains without false unity**.

**Consistency types**

- **Domain-local consistency** — Each domain's emitted facts remain internally coherent at authority.
- **Admission consistency** — Intake and validation enforce registry, structural, and attribution coherence before persistence.
- **Cross-domain referential honesty** — Correlation links resolve or declare broken, provisional, or disputed posture explicitly.
- **External parallel consistency** — Integration boundary facts and internal domain assertions remain correlatable without semantic merger.
- **Read-path consistency** — Investigation and export views reflect persisted primitives; they do not invent synchronization not present in memory.

**Consistency rules**

1. **No distributed transaction fantasy** — Platform-wide atomic consistency across all domains is not assumed or required at emission time.
2. **Eventual investigability** — Related facts may arrive at different times; investigation reconstructs coherent story from primitives.
3. **Contradiction is data** — Inconsistent parallel truth remains visible rather than silently flattened.
4. **Correction through new assertion** — Domain truth changes enter as new governed emissions, not as silent integration updates to prior core.
5. **Enrichment lag allowed** — Consistency between assertion and corroboration may strengthen over time.
6. **Governance consistency** — Registry and policy changes affect future emission; they do not retroactively redefine past accepted meaning without explicit additive governance facts.

Consistency serves **honest multi-domain reality**, not artificial single-document simplicity.

---

## 11. Cross-Domain Synchronization

Cross-domain synchronization describes **how related journeys stay linkable without shared mutable state or orchestrated coupling**.

**Synchronization mechanisms**

- **Correlation anchors** — shared episode, journey, case, or resource identifiers carried in emissions
- **Relationship linkage** — correlation layer connects endpoints without merging event identity
- **Temporal assembly** — timeline construction orders related facts by occurred, recorded, and enrichment time
- **Boundary pairing** — external authority facts linked to internal commercial, identity, or verification outcomes
- **Governance scoping** — investigation and export scope selects cross-domain slices under purpose binding

**What synchronization is not**

- not a requirement that all domains emit in one combined transaction
- not a shared operational cache of Black Box memory inside product runtime
- not automatic inference that related UI flows produced related institutional facts without explicit anchors
- not admin or analytics views defining cross-domain truth by presentation alone

**High-risk synchronization zones**

- purchase, payment, and entitlement sequences
- owner submission, document custody, and verification outcomes
- factory orchestration through pipeline to marketplace publication
- admin override correlated with affected domain outcomes
- integration authority callbacks correlated with internal recognition

**Discipline**

- synchronization preserves endpoint independence
- missing linkage is investigable as gap
- expanded cross-domain visibility requires access and investigation discipline, not broader default emission

Cross-domain synchronization enables **composed narratives without fused truth**.

---

## 12. Governance Principles

Governance principles define **how integration itself remains accountable as the platform grows**.

**Registry governance**

- new domain participation and new emission classes require governed registry change before broad production use
- domain ownership disputes resolve at catalog level, not through local integration dialects
- deprecation preserves historical interpretability; it does not erase past admissions

**Rollout governance**

- high-trust domains integrate first under proven admission discipline
- breadth follows demonstrated materiality and failure-handling maturity
- partial rollout must not create silent low-coverage zones for dispute-prone journeys

**Change governance**

- integration contract changes affecting meaning, materiality, or correlation obligations require reviewed approval
- emergency integration changes follow exception discipline with retrospective review where required

**Audit governance**

- material integration failures, duplicate storms, boundary rejections, and rollout changes remain capable of institutional trace where policy requires
- domains cannot opt out of emission obligations for dispute-prone facts through local configuration alone

**Separation governance**

- those who benefit from weakening integration discipline must not be sole approvers of that weakening
- external partner integration posture changes remain visible at boundary layer

Governance keeps integration **deliberate as RealEstateSniper grows**.

---

## 13. Future Technical Rules

Future technical rules constrain **integration technology selection and mapping** when implementation begins. They still do not name products, protocols, or interfaces.

**Selection rules**

1. Must support governed handoff from every catalog domain at emission boundary.
2. Must support logical integration layer separation or equivalent enforceable boundaries.
3. Must support durable handoff with failure visibility and recovery replay discipline.
4. Must support idempotent semantic convergence without core assertion rewrite.
5. Must support out-of-order arrival and provisional admission posture.
6. Must support correlation anchor carry-forward across domain emissions.
7. Must support external boundary parallel truth without semantic merger.
8. Must support domain isolation so one path's failure does not corrupt unrelated integration.
9. Must support mapping to pipeline stages in `BLACK_BOX_TECHNICAL_EVENT_PIPELINE.md`.

**Forbidden technical patterns**

- domain runtime directly writing immutable memory core
- product database change streams treated as automatic institutional memory without materiality gate
- shared internal message log becoming de facto Black Box substitute
- analytics or monitoring pipeline as authoritative integration source
- admin UI actions recorded only in presentation layer without domain emission discipline
- external webhook capture without boundary recognition and catalog alignment
- integration tooling that blocks core product flows on read-path or investigation availability

**Mapping rule**

Any physical integration design must publish an explicit mapping from logical integration layers and domain responsibilities in this document to delivery components, demonstrating compliance with the Integration Model, event pipeline, and governance corpus before production-scale admission.

**Technology neutrality reaffirmed**

Synchronous calls, asynchronous handoff, event-driven middleware, and hybrid approaches may all qualify if they honor these rules. None is chosen here.

---

## 14. Scalability Principles

Scalability principles define **how integration grows without sacrificing materiality or memory integrity**.

**Scale posture**

1. **Materiality gates volume** — Integration breadth and throughput strategies must not incentivize low-value signal admission.
2. **Domain-independent scaling** — High-emission domains may scale handoff paths without forcing uniform infrastructure on low-materiality domains.
3. **Write path priority** — Admission and persistence scalability precede operational analytics on integration traffic.
4. **Burst tolerance** — Factory, pipeline, and boundary recovery may produce emission bursts; intake must preserve ordering and idempotency discipline under burst.
5. **Cold domain fairness** — Long-tail domains remain first-class participants; architecture must not optimize only for commercial hot paths.
6. **Correlation cost awareness** — Cross-domain linkage may be lazy or incremental if write integrity and investigability are preserved.
7. **Rollout scaling** — New domains join under governed waves, not unbounded parallel emission without admission readiness.

Scalability serves **sustainable witness across all domains**, not integration traffic for its own sake.

---

## 15. Closing Principles

The Technical Integration Architecture rests on a small set of enduring principles:

**Domains decide; memory preserves**  
Integration carries truth across the boundary; it does not replace domain authority.

**Handoff is a contract**  
Emission boundary discipline matters as much as pipeline internals.

**Every domain participates**  
Accountability memory is incomplete if dispute-prone domains integrate late or weakly.

**Parallel truth stays parallel**  
Commercial, owner, verification, automation, and external layers link without merger.

**Failure and delay are visible**  
Integration architecture must not reward silent omission or invisible breakdown.

**Idempotency and order are semantic**  
Technical replay and arrival chaos cannot be allowed to corrupt meaning.

**Coupling stays loose**  
Product evolution and memory evolution must remain separable lifecycles.

**Mechanism comes last**  
This architecture must outlive any particular messaging or handoff fashion.

---

## Closing Note

This document defines the **technology-independent integration architecture of the Black Box**.

Logical layers separate domain recognition, emission boundary handoff, intake coupling, correlation context, and external boundary participation. Every catalog domain owns authoritative emission responsibilities without writing immutable memory directly. Reliability, failure handling, idempotency, ordering, consistency, and cross-domain synchronization preserve investigable truth across distributed platform reality. Governance and scalability principles keep integration deliberate as RealEstateSniper grows. Transport, protocols, and delivery technology are not chosen here. Integration discipline begins here.
