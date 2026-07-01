# RealEstateSniper Black Box — Event Catalog: Engine

Twelfth functional catalog of **conceptual Engine events** for the Black Box.

This document defines **which event types exist when an individual specialized processing unit within the Factory ecosystem produces, withholds, or fails to produce governed knowledge**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Engine Domain).  
For factory orchestration truth, see `BLACK_BOX_EVENT_CATALOG_FACTORY.md`.  
For factory integration posture, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Engine Event Catalog exists to make **component-level processing memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which specialized engine recognized, processed, or rejected work?
- What output did a single engine produce, withhold, or discard?
- When did an engine degrade, fail, or recover in ways that affected knowledge?
- How can investigators isolate component causality without collapsing it into factory orchestration or marketplace symptoms?

Engine is the twelfth functional catalog because **automated wrongness is often a component story**. When factory output is delayed, duplicated, or untrustworthy, memory must show which specialized unit participated — not only that orchestration ran somewhere.

---

## 2. Scope

**Inside scope**

- Engine registration, version activation, and governed readiness
- Start, stop, and completion of engine-level processing work
- Output produced, delivered, withheld, corrected, or discarded by an engine
- Quality and validation outcomes at the engine boundary
- Dependency satisfaction, input receipt, and downstream handoff at engine level
- Material failure, degradation, and governed recovery of an engine
- Evidence references that support component causality review

**Materiality standard**

An engine event exists only when the engine **produces, changes, blocks, or fails to deliver knowledge** with real investigatory value. Internal telemetry, heartbeat noise, metric streams, and developer diagnostics do not qualify.

**Outside scope**

- Internal telemetry, performance counters, and routine health pings without knowledge effect — not institutional memory
- Factory-wide run orchestration, scheduling, and publication — Factory domain
- Multi-step staged flow across connected pipeline steps — Pipeline domain
- Post-publish enrichment and qualification — Enrichment domain
- Privileged operator intervention — Admin domain, correlatable
- Verification review of engine output — Verification domain, correlatable
- Marketplace visibility truth — Marketplace domain, correlatable at handoff
- Generic infrastructure and deployment signals — System domain

**Factory versus Engine**

- **Factory** owns global orchestration: coordinated runs, batch posture, factory-level gates, sync, and publication handoff.
- **Engine** owns specialized processing truth: what one governed worker accepted, how it processed, and what it emitted or refused at its boundary.

The layers correlate tightly in production but must remain **separate event vocabularies**.

---

## 3. Engine Event Philosophy

Engine events record **specialized processing facts**, not the internal life of every subroutine.

Philosophy principles:

1. **Component truth, not orchestration truth** — An engine starting is not the same fact as a factory run starting.
2. **Output at the boundary** — Memory focuses on what crossed the engine's governed input and output edges.
3. **Telemetry is not history** — CPU, memory, trace volume, and debug chatter do not create institutional obligation.
4. **Degradation is material** — Reduced capability matters when it changes what knowledge may be produced.
5. **Dependency visibility** — Missing upstream input or failed handoff must be reconstructible at engine level.
6. **Failure is localized** — Component failure should be isolatable without pretending the whole factory failed identically.
7. **No layer smuggling** — Engine events must not encode factory publication, pipeline stage truth, or admin override.

Engine memory answers what a specialized unit did at its processing boundary. It does not replace factory orchestration history.

---

## 4. Engine Event Families

Engine events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Engine Initialization** — registration, version, capability, and readiness of a specialized unit
- **Engine Execution** — start, stop, and progression of engine-level work
- **Engine Output** — knowledge artifacts emitted, withheld, or corrected at the engine boundary
- **Engine Quality** — validation, checks, and confidence at the engine edge
- **Engine Dependency** — upstream input and downstream handoff relationships
- **Engine Failure** — material breakdown or degradation of engine processing
- **Engine Recovery** — governed restoration after engine failure or unsafe posture

Families may correlate in one processing episode but must remain **separate event classes**. Registration and output production are related but not one merged fact.

---

## 5. Engine Initialization Events

Engine Initialization events assert **when a specialized processing unit became available, versioned, or ready** for governed work.

**Engine Registered**  
A specialized engine was recognized as a governed participant in the Factory ecosystem.

**Engine Deregistered**  
An engine was removed from active governed participation.

**Engine Version Activated**  
A specific engine version became the standing processing implementation for governed work.

**Engine Version Deprecated**  
A prior engine version was marked unfit for new governed work.

**Engine Capability Declared**  
The engine's governed processing scope or supported work types were established.

**Engine Configuration Applied**  
A material engine configuration posture took effect for future processing.

**Engine Readiness Achieved**  
The engine satisfied prerequisites to accept governed work.

Initialization events mark **standing component posture**. They do not record every configuration micro-change without material effect.

---

## 6. Engine Execution Events

Engine Execution events assert **how a specialized unit progressed through a processing episode**.

**Engine Started**  
The engine entered an active processing posture suitable for governed work.

**Engine Stopped**  
The engine left active processing posture under normal or governed termination.

**Engine Work Accepted**  
The engine took ownership of a governed work unit at its input boundary.

**Engine Processing Began**  
Material transformation or evaluation started on accepted work.

**Engine Processing Ended**  
Material transformation or evaluation on the work unit concluded.

**Engine Work Completed**  
The engine finished the governed work unit with a recorded completion posture.

**Engine Work Abandoned**  
Accepted work was terminated without normal completion.

Execution events mark **component processing progression**. They correlate with Factory execution when orchestration dispatched the work, without merging vocabularies.

---

## 7. Engine Output Events

Engine Output events assert **what knowledge crossed or failed to cross the engine output boundary**.

**Engine Output Produced**  
The engine generated a knowledge artifact at its output boundary.

**Engine Output Delivered**  
Produced knowledge was released to the next governed consumer path.

**Engine Output Withheld**  
The engine intentionally blocked release of produced or partial knowledge.

**Engine Output Corrected**  
The engine replaced or amended a prior emitted artifact before forward handoff.

**Engine Partial Output Recorded**  
Some knowledge was emitted while the work unit did not achieve full success posture.

**Engine Output Discarded**  
Knowledge generated internally was destroyed or excluded from forward flow under policy.

Output events own **component emission truth**. Factory result and pipeline handoff events may correlate downstream without absorbing engine facts.

---

## 8. Engine Quality Events

Engine Quality events assert **when validation or confidence at the engine edge changed processing posture**.

**Engine Quality Check Passed**  
Work or output met governed engine-level quality criteria.

**Engine Quality Check Failed**  
Work or output failed engine-level quality criteria.

**Engine Input Validation Failed**  
Supplied input was rejected before material processing began.

**Engine Output Flagged**  
Knowledge was marked for elevated scrutiny before or after delivery.

**Engine Confidence Posture Recorded**  
The engine recognized a material shift in completeness or trust confidence for its output.

**Engine Anomaly Recognized**  
The engine detected a material irregularity affecting knowledge integrity.

**Engine Duplicate Prevention Applied**  
The engine blocked redundant emission of equivalent knowledge.

Quality events mark **edge validation truth**. Factory quality gates and verification review may correlate at higher layers.

---

## 9. Engine Dependency Events

Engine Dependency events assert **how upstream inputs and downstream consumers related to engine processing**.

**Engine Upstream Input Received**  
Governed input arrived at the engine boundary from an authorized source.

**Engine Dependency Satisfied**  
A required upstream or sibling dependency was available for processing.

**Engine Dependency Missing**  
A required dependency was absent and blocked normal processing.

**Engine External Reference Required**  
Processing could not complete without resolving an external or cross-boundary reference.

**Engine External Reference Resolved**  
The required external reference was obtained and processing could continue.

**Engine Downstream Handoff Attempted**  
The engine tried to pass output to the next governed consumer.

**Engine Downstream Handoff Completed**  
Output successfully reached the next governed consumer at the engine boundary.

Dependency events preserve **local causality chains**. Integration domain owns external authority; Engine records component-level dependency truth.

---

## 10. Engine Failure Events

Engine Failure events assert **material breakdown or degradation of engine processing**.

**Engine Failed**  
The engine ended a processing episode in failure posture.

**Engine Degraded**  
The engine continued operating with materially reduced capability.

**Engine Input Rejected**  
Input was refused at the boundary under engine rules.

**Engine Timeout Recognized**  
Governed processing time limits were exceeded.

**Engine Resource Exhaustion Recognized**  
Material resource limits blocked continued processing.

**Engine Integrity Warning Issued**  
The engine detected trust break or corruption risk in its processing path.

**Engine Processing Halted**  
The engine stopped mid-episode due to failure or policy.

Failure events require **materiality**. Transient internal retries that do not change outward posture are not institutional memory.

---

## 11. Engine Recovery Events

Engine Recovery events assert **governed restoration after engine failure, degradation, or unsafe output**.

**Engine Recovery Initiated**  
A governed recovery path began for the engine or its stranded work.

**Engine Restarted**  
The engine re-entered active processing posture after failure or stop.

**Engine Retry Applied**  
All or part of failed work was reprocessed under recovery policy.

**Engine Degraded Mode Entered**  
The engine adopted a reduced-capability operating posture by policy.

**Engine Degraded Mode Exited**  
The engine returned to normal capability posture.

**Engine Quarantined**  
The engine or its output path was isolated from normal forward flow.

**Engine Quarantine Released**  
Isolation ended after review or repair.

**Engine Recovery Completed**  
The recovery path closed with a recorded restoration posture.

Recovery pairs with Failure and Output families. Silent correction without recovery memory is disallowed conceptually.

---

## 12. Engine Evidence

Engine Evidence describes **what supporting material makes component processing defensible** without turning the Black Box into an engine telemetry warehouse.

Evidence principles:

1. **Boundary focus** — Record what entered, what exited, and what was blocked at the engine edge.
2. **Correlation over duplication** — Link to factory run and pipeline stage context without absorbing their native facts.
3. **Version visibility** — Active engine version matters when output disputes trace to implementation change.
4. **Localized failure** — Failure class and dependency missing reason should remain explainable without full stack dumps.
5. **No metric archive** — Performance telemetry stays outside unless material to integrity or resource exhaustion facts.

Typical evidence attachments conceptually include:

- engine identity and active version at time of processing
- work unit correlation to factory orchestration when applicable
- input acceptance or rejection posture
- output delivery, withhold, or discard chain
- quality check and flag posture at the engine boundary
- dependency satisfaction or missing dependency context
- degradation and recovery sequence relative to failure events
- references to corrected or partial outputs when standing knowledge changed

Engine evidence strengthens component isolation in automation disputes. It does not replace Factory, Pipeline, or Enrichment domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Engine truth relates to neighboring catalogs** without collapse.

**Factory domain**  
Owns global orchestration, factory runs, scheduling, factory-level gates, sync, and publication handoff. Factory dispatches work to engines; engine events record what the unit did locally.

**Pipeline domain**  
Owns staged multi-step choreography across connected steps. An engine may execute one stage; pipeline stage progression remains Pipeline memory.

**Enrichment domain**  
Owns refinement after initial knowledge exists. Engine output may feed enrichment; qualification truth stays there.

**Marketplace domain**  
Owns investor-visible opportunity truth. Engine output may eventually surface in marketplace through higher layers.

**Verification domain**  
Owns formal review process. Engine-flagged output correlates; verification owns review path and verdict.

**Admin domain**  
Owns privileged human override. Operator intervention on engine output correlates without absorbing engine processing history.

**Integration domain**  
Owns external boundary authority. Engine external reference resolution correlates at component level.

**System domain**  
Owns deployment and infrastructure context. Engine failure may correlate when platform outage caused halt.

**Security domain**  
Owns abuse and incident signals. Engine integrity warnings may correlate with security investigation.

Boundary discipline keeps **one component story** without making Engine the catch-all for all automation layers.

---

## 14. Governance

Engine catalog governance defines **how Engine event classes remain trustworthy** as the Factory ecosystem evolves.

Governance principles:

1. **Component materiality** — New classes must prove component-level knowledge truth, not observability fashion.
2. **Layer separation** — Engine vocabulary must not absorb factory orchestration or pipeline stage facts.
3. **Telemetry exclusion** — Health pings and metric streams require explicit materiality review before any class approval.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Version accountability** — Engine version changes that affect output trust must remain correlatable across events.
6. **Amendment caution** — Retroactive relabeling when engines are redesigned requires governance review.

**Governance questions for every proposed engine event class**

- Does this assert specialized processing truth that existing classes do not?
- Would absence of this class leave component causality unexplained in a real dispute?
- Is it free of telemetry, trace, and internal subroutine noise?
- Does it preserve separation from Factory, Pipeline, and Enrichment domains?
- Can investigators correlate it with orchestration without merging vocabularies?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Engineering observability volume is not sufficient justification.

---

## 15. Future Evolution

Engine catalog evolution may add new event classes only when **new component processing truth** must be preserved.

**Allowed evolution**

- Finer partial-output and withhold classes when dispute review exposes ambiguity
- Additional dependency and external-reference classes as engine inputs diversify
- Clearer degraded-mode classes as resilience patterns mature
- Distinct quarantine classes as unsafe-output isolation grows

**Evolution requirements**

Every proposed engine event class must answer:

1. What component processing truth does it assert that existing classes do not?
2. Does it meet the materiality standard — real effect on engine-produced knowledge?
3. Does it avoid telemetry and internal instrumentation noise?
4. Can it correlate with Factory and Pipeline catalogs without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every engine heartbeat, metric sample, or debug line as institutional memory
- Merging initialization, execution, and output into one convenience class
- Using engine events as factory publication or pipeline stage shortcuts
- Absorbing factory run lifecycle as engine truth
- Silent output correction without corrected, discarded, or recovery classes
- Making engine implementation detail a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Observability volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Engine domain**.

Engine Initialization marks when a specialized unit became ready. Execution marks how it processed work. Output and Quality mark what it emitted and whether that emission could advance. Dependency marks what it needed and where it handed off. Failure and Recovery mark localized breakdown and restoration. Evidence and boundaries keep component causality legible without telemetry noise or orchestration smuggling.

Technical representation comes later. Specialized processing truth begins here.
