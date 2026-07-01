# RealEstateSniper Black Box — Event Catalog: Factory

Eleventh functional catalog of **conceptual Factory 2.0 events** for the Black Box.

This document defines **which event types exist when the Factory produces, transforms, synchronizes, or publishes platform knowledge** through governed automated orchestration. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Factory Domain).  
For factory integration posture, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For separation from privileged human authority, see `BLACK_BOX_EVENT_CATALOG_ADMIN.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Factory Event Catalog exists to make **automated knowledge-production memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did Factory 2.0 orchestration run, pause, or complete?
- What knowledge did the Factory commit, reject, supersede, or publish?
- How did scheduling, quality gates, sync, failure, and recovery shape what entered product truth?
- How can investigators reconstruct machine causality without inferring it from marketplace symptoms alone?

Factory is the eleventh functional catalog because **machine-driven change often has no human click behind it**. Factory memory explains how coordinated automation entered the platform and when batch or orchestrated work altered trust-relevant knowledge.

---

## 2. Scope

**Inside scope**

- Factory 2.0 run lifecycle and orchestration checkpoints
- Scheduling and triggering of governed factory work
- Production, acceptance, rejection, supersession, and publication of factory output
- Quality gates and confidence posture affecting factory knowledge
- Synchronization and reconciliation of factory-produced truth with neighboring state
- Material failures, partial completions, and governed recovery
- Evidence references that support factory causality review

**Materiality standard**

A factory event exists only when the Factory **produces, changes, gates, syncs, or withdraws knowledge** with real effect on platform truth. Internal debug traces, verbose step logs, and developer diagnostics do not qualify.

**Outside scope**

- Internal debug logging, trace spam, and developer-only instrumentation — not institutional memory
- Individual engine registration, health, and component-level worker truth — Engine domain
- Staged multi-step pipeline choreography between workers — Pipeline domain
- Post-publish classification, pricing, and qualification refinement — Enrichment domain
- Privileged operator override of factory outcome — Admin domain, correlatable
- Verification review of factory output — Verification domain, correlatable
- Marketplace investor visibility as native publication layer — Marketplace domain, correlatable when factory hands off
- Owner assertions and human submissions — Owner and Documents domains
- External payment or webhook authority — Integration and Payment domains
- Generic system uptime telemetry without knowledge effect — System domain

The Factory is a **producer of facts**, not an administrator. It orchestrates automated knowledge work; it does not exercise privileged human governance.

---

## 3. Factory Event Philosophy

Factory events record **orchestrated knowledge production**, not every internal subroutine whisper.

Philosophy principles:

1. **Causality over noise** — Memory exists when knowledge changed or was blocked from changing, not when a worker printed a debug line.
2. **Orchestration separate from component** — Factory owns coordinated run truth; engines and pipelines own their native layers.
3. **Output is explicit** — Produced, accepted, rejected, superseded, and published are distinct facts.
4. **Quality is visible** — Gates, flags, and confidence posture are memory when they affect what knowledge may flow forward.
5. **Sync is not silent merge** — Reconciliation and conflict handling must remain reconstructible.
6. **Failure and recovery are paired truth** — Partial completion and compensating recovery are not hidden behind a single failed flag.
7. **No admin smuggling** — Factory events must not encode operator override, owner authorization, or verification verdict.

Factory memory answers how automated orchestration changed platform knowledge. It does not replace domain histories that consume factory output.

---

## 4. Factory Event Families

Factory events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Factory Execution** — run lifecycle and orchestration progression
- **Factory Scheduling** — planning, triggering, deferral, and priority of factory work
- **Factory Result** — knowledge artifacts produced and their disposition
- **Factory Quality** — gates, flags, and confidence affecting factory output
- **Factory Synchronization** — alignment and reconciliation with neighboring truth
- **Factory Failure** — material breakdown in factory orchestration or output path
- **Factory Recovery** — governed restoration, retry, rollback, and quarantine release

Families may correlate tightly in one run but must remain **separate event classes**. A scheduled trigger and a published result are related but not one merged fact.

---

## 5. Factory Execution Events

Factory Execution events assert **how a governed Factory 2.0 run progressed** through orchestration.

**Factory Run Started**  
A coordinated factory run began under governed scope.

**Factory Run Completed**  
The run finished its orchestration path with a recorded completion posture.

**Factory Run Paused**  
Orchestration was intentionally halted while run context remained open.

**Factory Run Resumed**  
A paused run continued under governed conditions.

**Factory Run Cancelled**  
The run was terminated before normal completion without treating cancellation as success.

**Factory Work Unit Accepted**  
A governed unit of factory work entered orchestration.

**Factory Work Unit Dispatched**  
Orchestration assigned work to a downstream execution path.

**Factory Orchestration Checkpoint Reached**  
A material milestone in the run sequence was achieved.

**Factory Run Scope Finalized**  
The boundaries of what the run would process were locked for execution.

Execution events mark **orchestration progression**. They do not replace Engine or Pipeline domain records of component behavior.

---

## 6. Factory Scheduling Events

Factory Scheduling events assert **when and why factory work was planned, triggered, deferred, or reprioritized**.

**Factory Schedule Created**  
A governed recurrence or planning rule for factory work was established.

**Factory Schedule Updated**  
A scheduling rule changed with material effect on future runs.

**Factory Schedule Disabled**  
Scheduled factory work was stopped from future triggering.

**Factory Run Scheduled**  
A specific run was placed on the governed execution calendar or queue.

**Factory Run Triggered**  
A run began because a schedule, signal, or dependency condition fired.

**Factory Run Deferred**  
Planned work was postponed under capacity, dependency, or policy constraint.

**Factory Priority Escalated**  
Waiting work was elevated in orchestration priority.

**Factory Backlog Threshold Recognized**  
Accumulated pending work crossed a governed attention threshold.

**Factory Capacity Constraint Recognized**  
Orchestration acknowledged insufficient capacity to proceed immediately.

Scheduling events record **intent and timing of knowledge production**, not cron implementation detail or debug scheduler ticks.

---

## 7. Factory Result Events

Factory Result events assert **what knowledge the Factory produced and how that output was disposed**.

**Factory Output Produced**  
Orchestration generated a knowledge artifact ready for gate or handoff.

**Factory Output Accepted**  
Produced knowledge passed initial factory acceptance and may proceed.

**Factory Output Rejected At Gate**  
Produced knowledge was blocked from forward flow at a factory gate.

**Factory Output Published**  
Accepted knowledge was released into a governed product-truth consumer path.

**Factory Output Superseded**  
Newer factory knowledge replaced a prior output as the standing artifact.

**Factory Output Withdrawn**  
Previously released knowledge was pulled back from forward use.

**Factory Knowledge Artifact Committed**  
The Factory recorded a durable knowledge fact as its authoritative output for a scope.

**Factory Batch Outcome Recorded**  
A multi-item run concluded with a summarized production posture.

Result events own **factory output disposition**. Marketplace publication or property truth may correlate without merging classes.

---

## 8. Factory Quality Events

Factory Quality events assert **when quality posture changed what factory knowledge could advance**.

**Factory Quality Gate Passed**  
Output met governed quality criteria for the next step.

**Factory Quality Gate Failed**  
Output failed quality criteria and was blocked or redirected.

**Factory Output Flagged For Review**  
Knowledge was marked for human or verification scrutiny before forward use.

**Factory Consistency Check Failed**  
Output conflicted with standing knowledge or internal consistency rules.

**Factory Confidence Posture Changed**  
The Factory recognized a material shift in trust or completeness confidence for output.

**Factory Duplicate Output Prevented**  
Orchestration blocked redundant knowledge from entering standing truth.

**Factory Stale Output Recognized**  
Knowledge was identified as outdated relative to source or dependency freshness rules.

Quality events mark **gating truth**. Verification or Admin review may correlate when output awaits or receives external judgment.

---

## 9. Factory Synchronization Events

Factory Synchronization events assert **how factory-produced knowledge aligned with neighboring state**.

**Factory Sync Started**  
A governed synchronization pass began to align factory knowledge with a target context.

**Factory Sync Completed**  
Synchronization finished with a recorded alignment posture.

**Factory Sync Conflict Detected**  
Standing knowledge and incoming factory truth could not be merged without explicit handling.

**Factory Sync Reconciliation Applied**  
A governed reconciliation rule resolved a detected conflict.

**Factory External Source Aligned**  
Factory knowledge was brought into alignment with an external or upstream source of truth.

**Factory Downstream Handoff Completed**  
Orchestration successfully passed knowledge to the next governed consumer domain or stage.

**Factory State Reconciled**  
Factory run state and product-truth posture were brought back into coherent alignment after drift.

Synchronization events preserve **merge and handoff truth**. Integration domain records external boundary facts; Factory records orchestrated alignment work.

---

## 10. Factory Failure Events

Factory Failure events assert **material breakdown in factory orchestration or the output path**.

**Factory Run Failed**  
The run ended in failure without completing its governed success posture.

**Factory Stage Failure Propagated**  
A failure in a subordinate stage caused orchestration to record failure consequence.

**Factory Timeout Recognized**  
Governed time limits were exceeded and failure posture was recorded.

**Factory Input Rejected**  
Orchestration refused to process supplied input under factory rules.

**Factory Dependency Unavailable**  
A required upstream or sibling dependency blocked progress.

**Factory Integrity Breach Detected**  
Orchestration recognized corruption, mismatch, or trust break in factory path data.

**Factory Partial Completion Recorded**  
Some knowledge advanced while the run overall did not achieve full success posture.

Failure events require **materiality**. Transient retry noise inside a single attempt does not become institutional memory unless it changes outcome posture.

---

## 11. Factory Recovery Events

Factory Recovery events assert **governed restoration after factory failure or unsafe output**.

**Factory Recovery Initiated**  
A governed recovery path began after failure, quarantine, or unsafe publication.

**Factory Run Retried**  
Orchestration repeated all or part of a failed run under recovery policy.

**Factory Failed Output Rolled Back**  
Knowledge released or partially released was reversed from forward standing use.

**Factory Compensating Action Applied**  
Orchestration performed a corrective action to neutralize harmful partial effect.

**Factory Quarantine Applied**  
Suspect output or run context was isolated from normal flow.

**Factory Quarantine Released**  
Isolated context was cleared for normal orchestration after review or repair.

**Factory Recovery Completed**  
The recovery path closed with a recorded restoration posture.

Recovery pairs with Failure and Result families. Silent rollback without recovery memory is disallowed conceptually.

---

## 12. Factory Evidence

Factory Evidence describes **what supporting material makes automated knowledge production defensible** without turning the Black Box into a factory log dump.

Evidence principles:

1. **Outcome over verbosity** — Prefer recording what knowledge changed, not every internal step echo.
2. **Correlation keys** — Runs, outputs, and handoffs should link to neighboring domain facts without absorbing them.
3. **Gate visibility** — Quality and rejection posture should remain explainable after publication disputes.
4. **Source lineage** — When output depends on upstream sources, lineage should be reconstructible at evidence level.
5. **No debug archive** — Stack traces and developer diagnostics stay outside institutional memory unless material to integrity breach.

Typical evidence attachments conceptually include:

- run identity and scope as correlation context
- scheduling trigger reason when material to dispute
- output disposition chain from produced through published or withdrawn
- quality gate outcome and flag-for-review posture
- sync conflict and reconciliation trail
- failure classification and partial completion boundary
- recovery and rollback sequence relative to prior result events
- references to superseded outputs when standing knowledge changed

Factory evidence strengthens causality review in duplicate-publish, stale-data, and automation-integrity disputes. It does not replace Marketplace, Property, or Enrichment domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Factory 2.0 relates to neighboring catalogs** without collapse.

**Engine domain**  
Owns individual worker registration, health, and component-level production. Factory orchestration correlates when runs dispatch work to engines.

**Pipeline domain**  
Owns staged multi-step flow between connected steps. Factory may initiate or consume pipeline stages; stage truth remains in Pipeline memory.

**Enrichment domain**  
Owns refinement, classification, and pricing after initial knowledge exists. Factory production precedes or hands off; enrichment does not retroactively own factory causality.

**Marketplace domain**  
Owns investor-visible opportunity truth. Factory publication correlates at handoff; marketplace visibility rules remain native there.

**Property domain**  
Owns property subject truth. Factory-generated property knowledge correlates without merging identities.

**Verification domain**  
Owns review process when factory output requires scrutiny. Factory may flag for review; verification owns the review path.

**Admin domain**  
Owns privileged human override. Operator correction of factory output correlates without absorbing factory run history.

**Integration domain**  
Owns external boundary truth from webhooks and third-party systems. Factory sync may align with external sources; authority remains at the boundary layer.

**System domain**  
Owns platform operational context such as deployments and infrastructure signals. Factory failure may correlate when system outage caused orchestration stop.

**Security domain**  
Owns abuse and incident signals. Integrity breach in factory path may correlate with security investigation.

Boundary discipline keeps **one orchestration story** without making Factory the catch-all for every automated subsystem.

---

## 14. Governance

Factory catalog governance defines **how Factory 2.0 event classes remain trustworthy** as automation evolves.

Governance principles:

1. **Materiality review** — New event classes require proof that knowledge truth, not operator or developer convenience, demands them.
2. **Producer not administrator** — Factory classes must not drift into recording privileged human decisions.
3. **Layer separation** — Engine, Pipeline, and Enrichment catalogs absorb component and stage truth; Factory resists absorbing their vocabulary.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Cross-catalog correlation** — Factory may correlate with downstream domains; it must not merge their native outcomes.
6. **Amendment caution** — Retroactive relabeling of factory classes when Factory 2.0 is redesigned requires governance review, not silent rename.

**Governance questions for every proposed factory event class**

- Does this assert orchestration or knowledge-production truth that existing classes do not?
- Would absence of this class leave machine causality unexplained in a real dispute?
- Is it free of debug, trace, and internal subroutine noise?
- Does it preserve separation from Engine, Pipeline, Enrichment, and Admin domains?
- Can investigators correlate it without collapsing downstream publication truth?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Factory team convenience or observability fashion is not sufficient justification.

---

## 15. Future Evolution

Factory catalog evolution may add new event classes only when **new orchestration or knowledge-production truth** must be preserved.

**Allowed evolution**

- Finer batch and partial-completion classes when dispute review exposes ambiguity
- Additional sync and reconciliation classes as Factory 2.0 integrates new source types
- Clearer confidence and stale-output classes as quality rules mature
- Distinct quarantine and compensating-action classes as recovery playbooks grow

**Evolution requirements**

Every proposed factory event class must answer:

1. What knowledge-production truth does it assert that existing classes do not?
2. Does it meet the materiality standard — real effect on generated knowledge?
3. Does it avoid debug logs and internal instrumentation noise?
4. Can it correlate with Engine, Pipeline, and Enrichment catalogs without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every orchestration subroutine or debug checkpoint as institutional memory
- Merging execution, result, quality, and publication into one convenience class
- Using factory events as admin override or verification verdict shortcuts
- Silent supersession of prior output without supersede or withdraw classes
- Absorbing engine health telemetry as factory orchestration truth
- Making Factory 2.0 implementation detail a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Observability volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Factory 2.0 domain**.

Factory Execution and Scheduling mark how orchestration ran and was planned. Result and Quality mark what knowledge was produced and whether it could advance. Synchronization marks alignment and handoff. Failure and Recovery mark breakdown and restoration. Evidence and boundaries keep machine causality legible without debug noise or admin smuggling.

Technical representation comes later. Automated knowledge-production truth begins here.
