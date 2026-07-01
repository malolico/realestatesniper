# RealEstateSniper Black Box — Event Schema Principles

Architectural principles that any future event schema for the Black Box must satisfy.

This document does **not** define a database, persistence technology, transport format, or concrete representation. It defines **what properties a schema must express and protect** so that institutional memory remains truthful, investigable, and durable.

For what an event is, see `BLACK_BOX_EVENT_MODEL.md`.  
For naming rules, see `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For constitutional obligations, see `BLACK_BOX_CONSTITUTION.md`.

---

## 1. Purpose

The Event Schema Principles exist so that when a technical representation is eventually chosen, it **cannot accidentally betray the Black Box** through omission, mutability, or convenience-driven design.

Its purpose is to answer, at the principle level:

- What must every recorded event be able to express?
- What guarantees must the schema embed by structure, not by policy alone?
- How can representation evolve without rewriting historical truth?
- How little is enough — and how much is too much — for accountability memory?

These principles sit between the event model and any future physical schema. They constrain design. They do not prescribe it.

---

## 2. Canonical Event Identity

Every event accepted into Black Box memory must have **one durable identity** that survives enrichment, investigation, and export.

Identity principles:

- Each occurrence is uniquely distinguishable from every other occurrence across the lifetime of the platform.
- Identity is assigned at acceptance, not inferred later from surrounding context alone.
- Identity does not change when explanation, evidence, or trust posture matures.
- Identity is independent of presentation layer, operator session, or investigation package.
- Identity binds permanently to the canonical event name defined under the naming standard.
- Identity must remain resolvable even when related events are correlated, disputed, or archived.

Canonical identity is how the platform points to a specific witness without ambiguity. A schema that cannot anchor identity reliably cannot support institutional memory.

---

## 3. Minimum Information Principle

A schema must carry **enough information to make the event investigable**, and **no more than accountability requires**.

**Sufficiency**  
Every accepted event must make it possible to answer, at minimum: what class of fact was asserted, which domain primarily owns it, who or what originated it, when the fact was recognized, and with what initial trust posture.

**Proportionality**  
Not every event class requires the same expressive depth. The schema must allow lean representation for simple facts and richer representation for consequential flows without forcing uniform bloat.

**No narrative dumping**  
The schema is not a substitute for explanation layers. It holds assertions and bounded context, not long-form storytelling.

**No secret hoarding**  
Sensitive material must not be embedded recklessly because the schema allows it. Minimum necessary disclosure begins at design time.

**No state mirroring**  
The schema must not duplicate live product state as if it were history. It records what was asserted at recognition time, not a snapshot of everything the platform currently believes.

Minimum information protects privacy, cost, and clarity while preserving investigability.

---

## 4. Traceability Principle

A schema must support **end-to-end traceability** from origin through consequence and review.

Traceability requires the representation to support questions such as:

- Where did this assertion enter institutional memory?
- Which domain accepted responsibility for emission?
- What later enrichments attached to it?
- What evidence strengthened or challenged it?
- What other events were linked through correlation?
- Who accessed or exported it under investigation authority?

Traceability is not optional metadata decoration. It is how the Black Box remains accountable for its own role as witness. A schema that records facts without trace paths creates dead ends in dispute resolution.

---

## 5. Temporal Principle

Time is a first-class architectural concern. A schema must distinguish **when the fact occurred**, **when it was recognized**, and **when enrichments arrived** when those moments differ.

Temporal principles:

- Event ordering must be reconstructible across delay, retries, and asynchronous recognition.
- Clock ambiguity must be visible, not hidden behind a single undifferentiated timestamp.
- Late-arriving facts must be placeable on a timeline without pretending they were known earlier.
- Concurrent events must be representable without forcing false linear causality.
- Temporal authority belongs to the fact, not merely to processing convenience.

A schema that collapses all time into one moment will break dispute reconstruction whenever reality and ingestion diverge.

---

## 6. Accountability Principle

A schema must make **actors and authorities visible** with appropriate confidence.

Accountability principles:

- Human actors, privileged operators, automated processes, and external authorities must be distinguishable.
- The schema must express who or what asserted the fact, not only that something happened.
- Service and automated actors must not hide behind anonymous generic origins when attribution matters.
- Authority context must be representable where governance, security, or financial facts require it.
- Absence of attribution must itself be representable when facts are admitted provisionally.

Accountability memory without accountable origins is incomplete memory. The schema must not make attribution an afterthought.

---

## 7. Correlation Principle

A schema must express **relationships between events** without merging them into one undifferentiated assertion.

Correlation principles:

- Each event retains its own identity and primary meaning.
- Relationships are explicit, typed, and navigable in both directions where meaningful.
- Shared journey context must be linkable without duplicating full event bodies.
- Contradiction between related events must be representable, not smoothed away.
- Correlation must work across domains, time delay, and external authority boundaries.

The schema supports graphs of meaning, not flattened logs. Investigators must be able to follow a purchase, payment, entitlement, and dispute path without losing individual facts.

---

## 8. Evidence Principle

A schema must separate **the assertion** from **the proof that supports or challenges it**.

Evidence principles:

- An event may exist before corroborating material is available.
- Evidence links are additive and bound to the event they support.
- Multiple evidence sources may attach to one event; one artifact may support multiple events.
- Evidence must be referencable without necessarily inlining sensitive content.
- Trust posture must be able to change as evidence matures without rewriting the original assertion.

A schema that conflates claim and proof will either over-collect sensitive data or make uncertainty invisible. Separation is architectural, not cosmetic.

---

## 9. Integrity Principle

A schema must be designed so that **accepted assertions resist silent alteration**.

Integrity principles:

- Historical assertions are append-only at the semantic level: corrections arrive as new material, not hidden edits.
- Enrichment layers must not overwrite or replace original meaning in place.
- Integrity posture must be auditable: investigators can detect whether an assertion still reads as originally accepted.
- Gaps, provisional status, and disputed status must be representable without fabricating completeness.
- Recovery and reconstruction must be distinguishable from originally recognized facts.

Integrity is the schema's promise that memory behaves like a witness, not like editable product state.

---

## 10. Provenance Principle

A schema must preserve **where knowledge came from** in the platform's causal and authority landscape.

Provenance principles:

- Source domain and recognition path must be expressible.
- External authority origin must be distinguishable from internal product origin.
- Automated inference must be distinguishable from authoritative decision.
- Replayed, reconstructed, or recovered assertions must carry visible provenance distinct from first-pass recognition.
- Provenance must survive export and long-term archiving without being stripped for convenience.

Provenance answers whether the platform knew a fact because it decided it, because a user acted, because an external authority confirmed it, or because it reconstructed missing truth later.

---

## 11. Versioning Principle

A schema must support **evolution of expressive capacity** without redefining past events.

Versioning principles:

- Schema capability may mature forward; historical events remain valid under the meaning they held when accepted.
- Taxonomy and naming evolution must not require retroactive relabeling of old assertions.
- When new expressive dimensions are added, old events must remain intelligible with explicit defaults or visible absence, not silent reinterpretation.
- Version markers belong to schema capability and registry governance, not to individual occurrences as casual suffixes.
- Additive overlays handle interpretive maturity; versioning handles structural maturity.

Versioning protects the past from the vocabulary of the future.

---

## 12. Extensibility Principle

A schema must be **extensible under governance**, not improvisational under pressure.

Extensibility principles:

- New event classes, categories, and relationship types must be addable without breaking existing identity or retrieval expectations.
- Extension must follow constitutional and naming review, not local convenience.
- Optional expressive depth must not fracture core investigability across domains.
- Extensions that increase sensitivity must increase governance, not decrease it.
- The schema must resist becoming a general-purpose warehouse through uncontrolled optional baggage.

Extensibility is allowed when it strengthens truth, trust, or defensibility. It is forbidden when it becomes an excuse for unstructured accumulation.

---

## 13. Validation Philosophy

Validation is the schema's gate between **recognized fact** and **trusted institutional memory**.

Validation philosophy:

- Validation assesses plausibility, category fit, source authority, and temporal credibility — not whether the fact is politically convenient.
- Rejected attempts that matter for investigation must be representable; silent discard is a schema failure.
- Provisional admission must be expressible when omission would be worse than uncertainty.
- Validation outcomes must be durable when they themselves constitute material facts.
- Validation rules may differ by domain without breaking global identity, time, and integrity principles.

The schema must support validation as quality control on truth entry, not as censorship of inconvenient history.

---

## 14. Backward Compatibility

Any future schema change must preserve **readability and identity of what was already accepted**.

Backward compatibility principles:

- Older events must remain retrievable by canonical identity without manual reinterpretation folklore.
- New expressive dimensions must not break investigators' ability to reconstruct timelines and relationships for legacy material.
- Deprecation affects future emission and registry guidance, not the meaning of historical occurrences.
- Export and external review packages must remain interpretable across schema generations.
- Compatibility is measured by investigability, not by identical physical layout over time.

Backward compatibility is how institutional memory earns long horizons. A schema that orphanates its own past is unfit for the Black Box.

---

## 15. Future Schema Evolution

Schema evolution may proceed only when it **strengthens truth, trust, or defensibility** without violating these principles.

**Allowed evolution**

- Richer correlation and provenance expression when cross-domain cases expose gaps
- Clearer temporal modeling when delayed recognition repeatedly breaks reconstruction
- Stronger integrity and validation representation when dispute review reveals ambiguity
- Governed extension for new constitutional categories
- Better separation of assertion, explanation, and evidence when conflation risks appear

**Evolution requirements**

Every proposed schema change must answer:

1. Which principle deficiency does this address?
2. Does it preserve canonical identity and backward compatibility?
3. Does it avoid turning the Black Box into live product state?
4. Does it keep minimum necessary disclosure intact?
5. Can it be introduced additively for new material without rewriting old truth?

**Disallowed evolution**

- Mutable historical assertions for operator convenience
- Schema designs that require presentation layers to exist before memory can form
- Representations that hide uncertainty, contradiction, or provisional status
- Unbounded optional payloads that encourage secret leakage or noise collection
- Coupling schema shape to a single vendor, UI release, or analytics fashion

Amendments to these principles require explicit review alongside the constitution, architecture, event model, and naming standard. Convenience is not sufficient justification.

Physical representation will be chosen later. These principles define the obligations that representation must meet.

---

## Closing Note

The Event Schema Principles define **what any future schema must be able to express and protect**.

Identity anchors each witness. Minimum information keeps memory lean and lawful. Traceability, time, and accountability make events usable in dispute. Correlation and evidence preserve structure without conflation. Integrity and provenance keep memory honest. Versioning, extensibility, validation, and backward compatibility keep memory alive across change.

No database is defined here. Only the architectural constraints that a database — or any other durable representation — must honor to deserve the name Black Box.
