# RealEstateSniper Black Box — Event Catalog: Integrations

Eighteenth functional catalog of **conceptual external integration events** for the Black Box.

This document defines **which event types exist when material facts occur at the boundary between RealEstateSniper and external systems, partners, or authorities**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Integration Domain).  
For integration participation model, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For purchase and payment platform truth, see `BLACK_BOX_EVENT_CATALOG_PURCHASE_AND_PAYMENT.md`.  
For global operational condition, see `BLACK_BOX_EVENT_CATALOG_SYSTEM.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Integrations Event Catalog exists to make **external boundary memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did an external system connect, disconnect, or change standing posture at the platform boundary?
- What did an external authority say, and did the platform accept or reject it?
- How did sync, handoff, drift, failure, and recovery unfold across the boundary?
- How can investigators reconstruct parallel external truth without collapsing it into internal product semantics?

Integrations is the eighteenth functional catalog because **outside reality enters RealEstateSniper at boundaries**. Payment authorities, partners, identity providers, and data sources each speak parallel truth. Integration memory preserves what they said and what the platform did with it.

---

## 2. Scope

**Inside scope**

- External connection, authorization, and disconnection at integration boundaries
- Synchronization and reconciliation between external and platform-standing truth
- Reception, acceptance, and rejection of external authority signals
- Material integration failure, drift, and unavailable partner posture
- Governed recovery and reconnection after boundary breakdown
- External state changes material to platform accountability
- Integration governance facts affecting boundary trust and scope
- Evidence references that support boundary causality review

**Materiality standard**

An integration event exists only when a fact **materially occurs at the external boundary** and affects how platform accountability relates to outside systems. Internal traffic, technical call logs, telemetry, and routine retry noise do not qualify.

**Outside scope**

- Internal service-to-service calls within RealEstateSniper — not boundary memory
- HTTP request logs, API call traces, and webhook payload dumps — not institutional memory
- Infrastructure telemetry and provider metric streams — not institutional memory
- Platform purchase entitlement meaning — Purchase domain, correlatable
- Payment capture and commercial semantics — Purchase and Payment domains, correlatable
- Marketplace publication truth — Marketplace domain
- Factory, engine, pipeline internal sync — respective automation domains
- Security threat and abuse taxonomy — Security domain, correlatable
- Global platform availability — System domain, correlatable when dependency fails
- Notification delivery mechanics — Notification domain, correlatable

**Boundary principle**

Integration owns **what crossed the frontier** and **how the platform treated external parallel truth**. Internal product domains own what the platform decided that truth meant.

---

## 3. Integration Event Philosophy

Integration events record **boundary facts**, not every packet that moved near a frontier.

Philosophy principles:

1. **Parallel truth preserved** — External authority and platform assertion remain correlatable, not merged.
2. **Boundary, not interior** — Facts must occur at the crossing between RealEstateSniper and outside systems.
3. **Rejection is memory** — Invalid, untrusted, or incompatible external input blocked at the boundary is a first-class fact.
4. **Drift is visible** — When external and platform-standing truth diverge materially, that divergence must be reconstructible.
5. **Authority is explicit** — External confirmations, disputes, and reversals are boundary facts distinct from internal entitlement.
6. **Recovery is paired** — Connection loss and restoration are both memory; silent realignment is insufficient.
7. **No call-log smuggling** — Integration events must not encode internal API traffic, debug traces, or telemetry.

Integration memory answers what outside systems contributed at the frontier. It does not replace purchase, payment, or marketplace histories.

---

## 4. Integration Event Families

Integration events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **External Connection** — connect, authorize, validate, and disconnect external integrations
- **External Synchronization** — align, conflict, reconcile, and hand off external truth
- **External Authority** — receive, accept, and reject authoritative external signals
- **Integration Failure** — material breakdown, rejection, drift, and unavailability at the boundary
- **Integration Recovery** — governed restoration, retry, and reconciliation after failure
- **External State Change** — material standing-state changes reported by or detected at partners
- **Integration Governance** — boundary policy, scope, trust posture, and accountability facts

Families may correlate tightly in one boundary episode but must remain **separate event classes**. Signal received and signal accepted are related but not one merged fact.

---

## 5. External Connection Events

External Connection events assert **when an external integration relationship was established, validated, or ended**.

**Integration Connected**  
A governed external integration became active at the platform boundary.

**Integration Disconnected**  
A governed external integration ceased active boundary participation.

**External Partner Recognized**  
An external partner or authority was identified as a governed boundary participant.

**External Endpoint Authorized**  
The platform authorized communication with a governed external endpoint.

**External Endpoint Deauthorized**  
Authorization to communicate with an external endpoint was removed.

**External Connection Validated**  
The platform confirmed the external connection met governed trust prerequisites.

**External Handshake Completed**  
Initial boundary establishment concluded with recorded posture.

**External Connection Posture Changed**  
Standing connection trust or capability posture changed with material boundary effect.

Connection events mark **relationship truth at the frontier**. Internal credential storage mechanics are not institutional memory.

---

## 6. External Synchronization Events

External Synchronization events assert **when external and platform-standing truth were aligned through governed sync work**.

**External Sync Started**  
A governed synchronization pass began across the boundary.

**External Sync Completed**  
Synchronization finished with a recorded alignment posture.

**External Sync Deferred**  
Synchronization was intentionally postponed under policy or dependency constraint.

**External Sync Conflict Detected**  
External truth and platform-standing truth could not align without explicit handling.

**External Sync Reconciliation Applied**  
A governed rule resolved detected boundary conflict.

**External Data Aligned**  
Standing knowledge was brought into governed alignment with external source truth.

**External Handoff Scheduled**  
A future boundary transfer of truth was placed on governed calendar or condition.

**External Handoff Completed**  
Truth successfully crossed the boundary to or from the external system under governance.

Synchronization events preserve **alignment work at the frontier**. Factory and pipeline sync remain in automation domains when work stays internal.

---

## 7. External Authority Events

External Authority events assert **when authoritative external signals were received and how the platform treated them**.

**External Authority Signal Received**  
A governed authoritative signal arrived at the platform boundary.

**External Authority Signal Accepted**  
The platform recognized the external signal as valid for boundary processing.

**External Authority Signal Rejected**  
The platform refused the external signal at the boundary.

**External Confirmation Received**  
An external system confirmed a fact material to platform accountability.

**External Reversal Signal Received**  
An external authority reported reversal, refund, dispute, or cancellation posture.

**External Authority Drift Recognized**  
Standing external authority truth diverged materially from platform expectation.

**Platform External Posture Reconciled**  
The platform brought its boundary posture back into coherent relation with external authority.

**External Validation Failed At Boundary**  
Incoming external material failed governed validation before acceptance.

External authority events own **parallel witness truth**. Purchase and payment catalogs own commercial meaning; they correlate without vocabulary collapse.

---

## 8. Integration Failure Events

Integration Failure events assert **material breakdown, rejection, or unavailability at the integration boundary**.

**Integration Failed**  
A governed boundary operation ended in failure posture.

**External Payload Rejected**  
Incoming external material was refused at the boundary.

**External API Unavailable**  
The external system could not be reached for governed boundary work.

**External Authentication Failed At Boundary**  
Boundary authentication with the external system failed.

**External Timeout Recognized**  
Governed time limits for boundary operation were exceeded.

**Integration Drift Detected**  
External and platform-standing truth remained materially misaligned.

**External Signal Integrity Warning Issued**  
Trust break or tampering risk was detected in boundary traffic.

**Partial External Sync Recorded**  
Some boundary alignment succeeded while overall sync did not achieve full posture.

Failure events require **materiality**. Transient internal retries without boundary posture change are not institutional memory.

---

## 9. Integration Recovery Events

Integration Recovery events assert **governed restoration after integration failure or unsafe boundary posture**.

**Integration Recovery Initiated**  
A governed recovery path began after boundary failure or drift.

**External Connection Restored**  
Previously unavailable external connection returned to usable posture.

**External Sync Retried**  
All or part of boundary synchronization was re-executed under recovery policy.

**External Authority Reconciled**  
Platform and external authority truth were realigned after drift or failure.

**Failed External Handoff Rolled Back**  
Partial boundary transfer was reversed to prior coherent posture.

**Integration Quarantined**  
Suspect boundary traffic or partner scope was isolated from normal flow.

**Integration Quarantine Released**  
Isolation ended after review or repair.

**Integration Recovery Completed**  
The recovery path closed with recorded restoration posture.

Recovery pairs with Failure and Synchronization families. Silent realignment without recovery memory is disallowed conceptually.

---

## 10. External State Change Events

External State Change events assert **material standing-state changes originating from or detected at external partners**.

**External State Changed**  
A governed external partner reported material change in its standing state.

**External Partner Status Changed**  
Partner availability, certification, or trust standing changed with boundary effect.

**External Catalog Drift Recognized**  
External reference data diverged materially from platform expectation.

**External Configuration Changed At Boundary**  
A material external configuration affecting boundary behavior changed.

**External Subscription State Changed**  
An external recurring or entitlement state at the partner changed with accountability effect.

**External Account Posture Changed**  
An external account or customer standing state material to platform truth changed.

**External Incident Affecting Integration Recognized**  
The platform recognized an external incident with material boundary consequence.

External state change marks **what the outside world reported**. Platform response to that change may correlate in other families without merge.

---

## 11. Integration Governance Events

Integration Governance events assert **material boundary policy, scope, and accountability facts**.

**Integration Policy Activated**  
A governed integration rule took effect at the boundary.

**Integration Policy Deactivated**  
A standing integration rule ceased to govern boundary behavior.

**Integration Exception Granted**  
A temporary departure from standard boundary policy was authorized.

**Integration Governance Review Completed**  
A scheduled or triggered integration governance review concluded with recorded outcome.

**External Partner Trust Posture Changed**  
Governed trust standing for an external partner changed materially.

**Integration Scope Expanded**  
Additional external systems or data classes entered governed boundary scope.

**Integration Scope Restricted**  
Boundary scope was narrowed under policy or risk posture.

Integration governance marks **standing boundary rule truth**. Admin privileged override may correlate when operator authority drove the change.

---

## 12. Integration Evidence

Integration Evidence describes **what supporting material makes boundary facts defensible** without turning the Black Box into an API log warehouse.

Evidence principles:

1. **Boundary outcome over hops** — Record acceptance, rejection, sync posture, and drift, not every relay.
2. **Parallel truth linkage** — External signals should correlate to internal domain facts without merging them.
3. **Partner identity visibility** — Which external authority participated should remain explainable.
4. **Conflict trail** — Sync conflict and reconciliation should remain reconstructible.
5. **No payload dump** — Full external payloads stay outside unless material to integrity warning facts.

Typical evidence attachments conceptually include:

- external partner or authority identity at time of boundary fact
- connection or authorization posture when material
- signal received, accepted, or rejected chain
- sync conflict and reconciliation sequence
- drift and recovery relative to prior alignment events
- references to purchase, payment, or marketplace facts when domains correlate
- correlation keys for handoff without absorbing internal semantics

Integration evidence strengthens reconciliation and partner-dispute review. It does not replace Purchase, Payment, or System domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Integration truth relates to neighboring catalogs** without collapse.

**Purchase and Payment domains**  
Own commercial and entitlement truth. External payment authority signals correlate at boundary layer; capture meaning remains in payment memory.

**Authentication domain**  
Owns identity access journeys. External identity provider boundary facts may correlate when material.

**Marketplace domain**  
Owns investor-visible opportunity truth. External listing or partner catalog signals correlate; publication remains native there.

**Factory, Engine, Pipeline, and Enrichment domains**  
Own internal automated causality. External data feeding automation correlates at boundary intake.

**System domain**  
Owns global operational condition. External API unavailability may correlate when platform dependency fails.

**Security domain**  
Owns threat and protection response. Boundary integrity warnings may correlate with security investigation.

**Admin domain**  
Owns privileged human authority. Operator-driven integration exception correlates without absorbing boundary history.

**Notification domain**  
Owns communication delivery truth. Partner outage notices to participants correlate; delivery mechanics remain there.

**Legal domain**  
Owns binding policy acceptance. Regulatory data exchange obligations may correlate at material moments.

**Verification domain**  
Owns formal review process. External verification signals correlate; review path remains in Verification memory.

Boundary discipline keeps **one frontier story** without making Integrations the catch-all for every external mention in the platform.

---

## 14. Governance

Integration catalog governance defines **how Integration event classes remain trustworthy** as external partnerships evolve.

Governance principles:

1. **Boundary materiality** — New classes must prove frontier truth, not API observability fashion.
2. **Parallel truth discipline** — Integration vocabulary must not absorb purchase, payment, or marketplace native outcomes.
3. **Log exclusion** — Call traces, webhook dumps, and telemetry require explicit materiality review.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Partner accountability** — Trust posture and scope changes must remain correlatable across events.
6. **Amendment caution** — Retroactive relabeling when partner models change requires governance review.

**Governance questions for every proposed integration event class**

- Does this assert boundary truth that existing classes do not?
- Would absence of this class leave external reconciliation unexplained?
- Is it free of internal traffic logs, call traces, and telemetry noise?
- Does it preserve separation from Purchase, Payment, and System domains?
- Can investigators correlate parallel external and internal truth without merge?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. API call volume is not sufficient justification.

---

## 15. Future Evolution

Integration catalog evolution may add new event classes only when **new boundary accountability truth** must be preserved.

**Allowed evolution**

- Finer partial-sync and drift classes when dispute review exposes ambiguity
- Additional external authority classes as new partners or regulators appear
- Clearer quarantine and recovery classes as boundary playbooks mature
- Distinct scope and trust-posture classes as partner risk models grow

**Evolution requirements**

Every proposed integration event class must answer:

1. What boundary truth does it assert that existing classes do not?
2. Does it meet the materiality standard — real effect at the external frontier?
3. Does it avoid internal traffic, call logs, and telemetry noise?
4. Can it correlate with Purchase, Payment, and domain catalogs without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every HTTP request, webhook receipt, or retry as institutional memory
- Merging connection, sync, and authority into one convenience class
- Using integration events as purchase entitlement or payment capture shortcuts
- Absorbing internal factory sync as external boundary truth
- Silent reconciliation after drift without reconciliation or recovery classes
- Making partner SDK implementation a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Boundary traffic volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Integrations domain**.

External Connection marks when the frontier relationship stood. Synchronization marks alignment work across the boundary. External Authority marks what outside systems said and whether the platform accepted it. Failure and Recovery mark breakdown and restoration. External State Change marks partner-reported standing shifts. Integration Governance marks boundary rules and trust posture. Evidence and domain boundaries keep parallel truth legible without call-log noise or semantic collapse.

Technical representation comes later. External boundary truth begins here.
