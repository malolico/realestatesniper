# RealEstateSniper Black Box — Event Catalog: Pipeline

Thirteenth functional catalog of **conceptual Pipeline events** for the Black Box.

This document defines **which event types exist when a staged processing flow connects multiple Engines and moves governed work toward product-truth outcomes**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Pipeline Domain).  
For factory orchestration truth, see `BLACK_BOX_EVENT_CATALOG_FACTORY.md`.  
For component processing truth, see `BLACK_BOX_EVENT_CATALOG_ENGINE.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Pipeline Event Catalog exists to make **staged flow memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which pipeline carried work through connected stages?
- Where did the flow advance, stall, branch, merge, or fail in sequence?
- What handoffs occurred between stages and engines?
- How can investigators reconstruct process truth when a deal, property, or knowledge artifact is stuck, duplicated, or partially processed?

Pipeline is the thirteenth functional catalog because **many platform changes traverse multiple steps**. Outcome alone cannot explain where the flow broke. Pipeline memory preserves the sequence story that factory orchestration and single-engine facts cannot replace alone.

---

## 2. Scope

**Inside scope**

- Pipeline definition, registration, and governed route establishment
- Pipeline run lifecycle and execution checkpoints
- Stage entry, completion, skip, block, and handoff between connected steps
- Synchronization, branch merge, and cross-stage reconciliation
- Quality gates, stalls, and backlog posture at pipeline level
- Material failure, abandonment, partial completion, and governed recovery
- Evidence references that support staged-flow causality review

**Materiality standard**

A pipeline event exists only when the flow **advances, blocks, merges, fails, or completes staged work** with real investigatory value. Internal logs, step-level debug traces, and routine scheduler chatter do not qualify.

**Outside scope**

- Internal debug logging and subroutine trace spam — not institutional memory
- Factory-wide orchestration runs, scheduling, and factory-level publication — Factory domain
- Single-engine registration, processing, and output at component boundary — Engine domain
- Post-flow enrichment and qualification refinement — Enrichment domain
- Privileged operator intervention — Admin domain, correlatable
- Verification review of pipeline output — Verification domain, correlatable
- Marketplace investor visibility — Marketplace domain, correlatable at terminal handoff
- Generic system infrastructure signals — System domain

**Engine versus Pipeline**

- **Engine** owns specialized processing truth: what one governed worker accepted, processed, and emitted at its boundary.
- **Pipeline** owns staged flow truth: how work moved through connected steps, where it handed off, and where the sequence succeeded, stalled, or failed.

The layers correlate tightly in production but must remain **separate event vocabularies**.

---

## 3. Pipeline Event Philosophy

Pipeline events record **staged flow facts**, not every internal step echo inside a stage.

Philosophy principles:

1. **Process truth, not component truth** — Entering a pipeline stage is not the same fact as an engine starting.
2. **Sequence is memory** — Order, stall, branch, and merge must remain reconstructible.
3. **Handoff visibility** — Movement between stages and engines must be explicit, not inferred from final output.
4. **Partial flow is real** — Work may complete some stages while failing others; that asymmetry must be visible.
5. **Quality at flow level** — Pipeline gates and backlog posture matter when they change what may advance through the sequence.
6. **Failure is locatable** — Investigators must identify which stage or transition broke without collapsing all layers.
7. **No layer smuggling** — Pipeline events must not encode factory publication, engine internals, or admin override.

Pipeline memory answers how work moved through connected stages. It does not replace engine or factory histories.

---

## 4. Pipeline Event Families

Pipeline events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Pipeline Creation** — definition, registration, route, and standing flow posture
- **Pipeline Execution** — run lifecycle and progression of a pipeline instance
- **Pipeline Transition** — stage entry, completion, handoff, branch, and convergence
- **Pipeline Synchronization** — alignment, merge, and reconciliation across stages or branches
- **Pipeline Quality** — gates, stalls, backlog, and hold posture affecting flow advance
- **Pipeline Failure** — material breakdown, abandonment, or partial completion of the flow
- **Pipeline Recovery** — governed retry, reroute, rollback, and restoration after failure

Families may correlate tightly in one flow episode but must remain **separate event classes**. Pipeline start and stage entry are related but not one merged fact.

---

## 5. Pipeline Creation Events

Pipeline Creation events assert **when a governed staged flow was established or changed in standing posture**.

**Pipeline Defined**  
A governed multi-stage flow was specified as a processing route.

**Pipeline Registered**  
The flow was recognized as an active participant in the Factory ecosystem.

**Pipeline Deregistered**  
The flow was removed from active governed participation.

**Pipeline Version Activated**  
A specific pipeline definition version became the standing route for new work.

**Pipeline Route Established**  
The ordered or branched connection between stages was fixed for governed execution.

**Pipeline Scope Declared**  
The boundaries of what work the pipeline may carry were established.

**Pipeline Stage Map Established**  
The governed mapping between pipeline stages and their engine responsibilities was set.

Creation events mark **standing flow posture**. They do not record every diagram edit without material effect on future processing.

---

## 6. Pipeline Execution Events

Pipeline Execution events assert **how a pipeline instance progressed through its governed run lifecycle**.

**Pipeline Started**  
A pipeline instance began carrying governed work through its route.

**Pipeline Completed**  
The instance finished its route with a recorded completion posture.

**Pipeline Paused**  
Flow progression halted while the instance remained open.

**Pipeline Resumed**  
A paused instance continued under governed conditions.

**Pipeline Cancelled**  
The instance was terminated before normal route completion.

**Pipeline Work Accepted**  
Governed work entered the pipeline at its intake boundary.

**Pipeline Run Scope Finalized**  
The boundaries of what this instance would process were locked for execution.

**Pipeline Checkpoint Reached**  
A material milestone in the pipeline run sequence was achieved.

Execution events mark **instance lifecycle truth**. They correlate with Factory runs when orchestration launched the pipeline, without merging vocabularies.

---

## 7. Pipeline Transition Events

Pipeline Transition events assert **how work moved between stages and handoff points**.

**Pipeline Stage Entered**  
Work entered a governed stage in the flow sequence.

**Pipeline Stage Completed**  
Work exited a stage with recorded completion posture.

**Pipeline Stage Skipped**  
A stage was bypassed under explicit governed policy.

**Pipeline Stage Blocked**  
Work could not enter or leave a stage due to gating or dependency posture.

**Pipeline Handoff Initiated**  
Work began transfer from one stage or engine responsibility to the next.

**Pipeline Handoff Completed**  
Transfer to the next stage or engine responsibility succeeded.

**Pipeline Branch Taken**  
Work followed a governed branch in a non-linear route.

**Pipeline Convergence Reached**  
Separate branches reunited at a governed merge point.

Transition events are the **core sequence memory** of the Pipeline domain. Engine output delivery correlates at handoff without absorbing stage truth.

---

## 8. Pipeline Synchronization Events

Pipeline Synchronization events assert **how parallel or divergent flow paths were aligned**.

**Pipeline Sync Started**  
A governed synchronization pass began across stages or branches.

**Pipeline Sync Completed**  
Synchronization finished with a recorded alignment posture.

**Pipeline Stage Alignment Required**  
The flow recognized that stages or branches were out of coherent posture.

**Pipeline Parallel Branch Merged**  
Work from parallel paths was united under governed merge rules.

**Pipeline Cross-Stage Conflict Detected**  
Standing stage outputs could not advance without explicit reconciliation.

**Pipeline Cross-Stage Reconciliation Applied**  
A governed rule resolved conflict between stage outputs.

**Pipeline State Reconciled**  
Pipeline instance posture and stage states were brought back into coherent alignment.

Synchronization events preserve **merge and alignment truth** at flow level. Factory sync and engine dependency events may correlate without vocabulary collapse.

---

## 9. Pipeline Quality Events

Pipeline Quality events assert **when flow-level quality or capacity posture changed advance**.

**Pipeline Quality Gate Passed**  
Work met governed criteria to proceed to the next stage or terminal handoff.

**Pipeline Quality Gate Failed**  
Work failed flow-level criteria and was blocked or redirected.

**Pipeline Stall Recognized**  
Work stopped advancing through the route for a material period or reason.

**Pipeline Backlog Threshold Crossed**  
Accumulated waiting work in the flow crossed a governed attention threshold.

**Pipeline Duplicate Flow Prevented**  
The pipeline blocked redundant parallel processing of equivalent work.

**Pipeline Output Held For Review**  
Terminal or intermediate flow output was withheld pending external scrutiny.

**Pipeline Capacity Constraint Recognized**  
The flow acknowledged insufficient throughput to advance immediately.

Quality events mark **flow gating truth**. Verification or Admin review may correlate when output awaits judgment elsewhere.

---

## 10. Pipeline Failure Events

Pipeline Failure events assert **material breakdown, abandonment, or incomplete success in the staged flow**.

**Pipeline Failed**  
The instance ended in failure without achieving governed completion posture.

**Pipeline Stage Failed**  
A specific stage ended in failure and propagated consequence to the flow.

**Pipeline Abandoned**  
The instance was left incomplete without governed recovery path active.

**Pipeline Timeout Recognized**  
Governed time limits for stage or instance progression were exceeded.

**Pipeline Deadlock Recognized**  
Stages or branches could not advance due to circular dependency or unresolved wait.

**Pipeline Dependency Unavailable**  
A required upstream stage, engine, or external input blocked flow progress.

**Pipeline Partial Completion Recorded**  
Some stages completed while the instance overall did not achieve full success posture.

Failure events require **materiality**. Transient internal retries inside a stage do not become pipeline memory unless flow posture changes.

---

## 11. Pipeline Recovery Events

Pipeline Recovery events assert **governed restoration after pipeline failure, stall, or unsafe partial advance**.

**Pipeline Recovery Initiated**  
A governed recovery path began for a failed, stalled, or unsafe instance.

**Pipeline Retried**  
All or part of the flow was re-executed under recovery policy.

**Pipeline Rerouted**  
Work was moved to an alternate governed route after failure or blockage.

**Pipeline Failed Stage Bypassed Under Policy**  
A failed stage was skipped through explicit recovery authorization.

**Pipeline Compensating Rollback Applied**  
Partially advanced work was reversed to a prior coherent stage posture.

**Pipeline Quarantined**  
A suspect instance or branch was isolated from normal forward flow.

**Pipeline Quarantine Released**  
Isolation ended after review or repair.

**Pipeline Recovery Completed**  
The recovery path closed with a recorded restoration posture.

Recovery pairs with Failure and Transition families. Silent reroute without recovery memory is disallowed conceptually.

---

## 12. Pipeline Evidence

Pipeline Evidence describes **what supporting material makes staged-flow causality defensible** without turning the Black Box into a pipeline log dump.

Evidence principles:

1. **Sequence over verbosity** — Record which stages advanced, blocked, or failed, not every internal loop iteration.
2. **Handoff chain** — Stage entry, handoff, and convergence should link into a reconstructible path.
3. **Correlation keys** — Pipeline instances should link to factory run and engine episodes without absorbing them.
4. **Partial flow clarity** — Investigators must see which stages completed when the instance did not fully succeed.
5. **No debug archive** — Internal step logs stay outside institutional memory unless material to integrity failure.

Typical evidence attachments conceptually include:

- pipeline identity and active version at time of run
- instance correlation to factory orchestration when applicable
- stage sequence from entry through completion or failure
- handoff and branch merge trail
- sync conflict and reconciliation posture
- stall, backlog, and quality gate outcomes
- recovery, reroute, and rollback sequence relative to prior transitions
- references to terminal output handoff when flow reached a consumer domain

Pipeline evidence strengthens stuck-work, duplicate-flow, and partial-publish disputes. It does not replace Factory, Engine, or Marketplace domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Pipeline truth relates to neighboring catalogs** without collapse.

**Factory domain**  
Owns global orchestration, factory runs, scheduling, factory-level gates, sync, and publication handoff. Factory may launch pipelines; pipeline events record staged sequence truth.

**Engine domain**  
Owns single-unit processing at input and output boundaries. Engines execute stages; engine events record component facts without replacing stage progression.

**Enrichment domain**  
Owns refinement after initial knowledge exists. Pipeline may deliver work to enrichment; qualification truth remains there.

**Marketplace domain**  
Owns investor-visible opportunity truth. Terminal pipeline handoff may correlate with marketplace publication without merging classes.

**Property domain**  
Owns property subject truth. Pipeline carrying property work correlates without absorbing property identity.

**Verification domain**  
Owns formal review process. Pipeline-held output correlates; verification owns review path and verdict.

**Admin domain**  
Owns privileged human override. Operator reroute or stage bypass correlates without absorbing pipeline history.

**Integration domain**  
Owns external boundary authority. Pipeline waiting on external input correlates at flow level.

**System domain**  
Owns deployment and infrastructure context. Pipeline stall may correlate when platform outage caused halt.

**Security domain**  
Owns abuse and incident signals. Deadlock or duplicate-flow prevention may correlate with integrity investigation.

Boundary discipline keeps **one sequence story** without making Pipeline the catch-all for all automation layers.

---

## 14. Governance

Pipeline catalog governance defines **how Pipeline event classes remain trustworthy** as staged flows evolve.

Governance principles:

1. **Flow materiality** — New classes must prove staged-sequence truth, not observability or diagram convenience.
2. **Layer separation** — Pipeline vocabulary must not absorb factory orchestration or engine component facts.
3. **Log exclusion** — Internal step logs and debug traces require explicit materiality review before any class approval.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Route accountability** — Pipeline version and route changes that affect sequence trust must remain correlatable.
6. **Amendment caution** — Retroactive relabeling when flows are redesigned requires governance review.

**Governance questions for every proposed pipeline event class**

- Does this assert staged-flow truth that existing classes do not?
- Would absence of this class leave sequence causality unexplained in a real dispute?
- Is it free of internal logs, trace noise, and subroutine chatter?
- Does it preserve separation from Factory and Engine domains?
- Can investigators correlate it with orchestration and components without merging vocabularies?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Flow observability volume is not sufficient justification.

---

## 15. Future Evolution

Pipeline catalog evolution may add new event classes only when **new staged-flow truth** must be preserved.

**Allowed evolution**

- Finer branch and convergence classes when dispute review exposes ambiguity
- Additional sync and reconciliation classes as parallel flows multiply
- Clearer stall and partial-completion classes as throughput rules mature
- Distinct reroute and compensating-rollback classes as recovery playbooks grow

**Evolution requirements**

Every proposed pipeline event class must answer:

1. What staged-flow truth does it assert that existing classes do not?
2. Does it meet the materiality standard — real effect on flow progression or outcome?
3. Does it avoid internal logs and debug instrumentation noise?
4. Can it correlate with Factory and Engine catalogs without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every internal stage loop or debug checkpoint as institutional memory
- Merging creation, execution, and transition into one convenience class
- Using pipeline events as factory publication or engine output shortcuts
- Absorbing engine failure as pipeline stage failure without distinct classes where both truths exist
- Silent reroute or rollback without recovery or transition memory
- Making pipeline implementation detail a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Observability volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Pipeline domain**.

Pipeline Creation marks when a governed route existed. Execution marks how an instance ran. Transition marks how work moved through stages. Synchronization marks alignment across branches. Quality marks when the flow could or could not advance. Failure and Recovery mark breakdown and restoration in sequence. Evidence and boundaries keep staged-flow causality legible without internal log noise or layer smuggling.

Technical representation comes later. Staged processing truth begins here.
