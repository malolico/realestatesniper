# RealEstateSniper Black Box — Event Catalog: Enrichment

Fourteenth functional catalog of **conceptual Enrichment events** for the Black Box.

This document defines **which event types exist when the Factory enrichment process increases the quality, confidence, and utility of knowledge about a governed entity**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Enrichment Domain).  
For staged flow truth, see `BLACK_BOX_EVENT_CATALOG_PIPELINE.md`.  
For factory orchestration truth, see `BLACK_BOX_EVENT_CATALOG_FACTORY.md`.  
For formal cross-domain review, see `BLACK_BOX_EVENT_CATALOG_VERIFICATION.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Enrichment Event Catalog exists to make **knowledge-improvement memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- What did the platform know about an entity before and after enrichment?
- How was new knowledge discovered, validated, and committed?
- When did classification, pricing, qualification, or confidence posture change?
- How can investigators explain why a deal, property, or opportunity looked one way and later another?

Enrichment is the fourteenth functional catalog because **investors and operators dispute qualification, not only existence**. Pipeline memory shows how work moved. Enrichment memory shows how available knowledge about an entity became richer, more trustworthy, or more useful.

---

## 2. Scope

**Inside scope**

- Discovery of enrichment opportunities and knowledge gaps on governed entities
- Validation of enrichment sources and claims before knowledge commitment
- Application of classification, pricing, qualification, and attribute improvement
- Confidence and trust-tier posture changes affecting entity knowledge
- Quality gates, deferral, and hold posture on enrichment outcomes
- Material failure, partial application, and governed recovery
- Evidence references that support enrichment causality review

**Materiality standard**

An enrichment event exists only when **available knowledge about an entity changes, is blocked from changing, or is explicitly deferred** with investigatory value. Internal calculations, intermediate scores, and subroutine arithmetic do not qualify.

**Outside scope**

- Internal calculation steps, formula traces, and model inference logs — not institutional memory
- Staged movement of work through connected pipeline steps — Pipeline domain
- Factory-wide orchestration runs and factory-level publication — Factory domain
- Single-engine component processing at worker boundary — Engine domain
- Formal cross-domain verification review process — Verification domain, correlatable
- Original entity creation or first publication — native domain of the entity, correlatable
- Privileged operator override — Admin domain, correlatable
- Marketplace investor visibility rules — Marketplace domain, correlatable at presentation
- Generic system infrastructure signals — System domain

**Pipeline versus Enrichment**

- **Pipeline** owns staged flow truth: how work moved through connected steps and where the sequence advanced or failed.
- **Enrichment** owns knowledge-improvement truth: how quality, confidence, classification, pricing, and utility of information about an entity changed.

The layers correlate when pipelines deliver work to enrichment, but must remain **separate event vocabularies**.

---

## 3. Enrichment Event Philosophy

Enrichment events record **entity knowledge change**, not every internal computation along the way.

Philosophy principles:

1. **Knowledge delta, not math trace** — Memory exists when what the platform can say about an entity changes, not when a model recomputed silently.
2. **Improvement separate from movement** — Pipeline handoff is not the same fact as classification applied.
3. **Before-and-after legibility** — Enrichment must help investigators separate original truth from later refinement.
4. **Source conflict is visible** — Competing enrichment sources must not collapse into one unexplained outcome.
5. **Confidence is memory** — Trust tier and uncertainty posture matter when they affect how knowledge may be used.
6. **Deferral is explicit** — Choosing not to enrich yet is a fact when material to availability or pricing disputes.
7. **No layer smuggling** — Enrichment events must not encode pipeline stage truth, factory publication, or verification verdict.

Enrichment memory answers how entity knowledge improved. It does not replace the native history of how that entity first entered the platform.

---

## 4. Enrichment Event Families

Enrichment events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Enrichment Discovery** — recognizing gaps, sources, and opportunities to improve entity knowledge
- **Enrichment Verification** — validating enrichment sources and claims before commitment
- **Enrichment Improvement** — applying classification, pricing, qualification, and attribute augmentation
- **Enrichment Confidence** — trust tier, uncertainty, and confidence posture on entity knowledge
- **Enrichment Quality** — gates, deferral, flags, and hold posture affecting enrichment advance
- **Enrichment Failure** — material breakdown or partial application of enrichment work
- **Enrichment Recovery** — governed retry, revert, and restoration after enrichment failure

Families may correlate tightly in one enrichment episode but must remain **separate event classes**. Discovery of a gap and commitment of improved knowledge are related but not one merged fact.

---

## 5. Enrichment Discovery Events

Enrichment Discovery events assert **when the platform recognized that entity knowledge could or should be improved**.

**Enrichment Opportunity Recognized**  
A governed entity was identified as eligible for knowledge improvement.

**Enrichment Gap Detected**  
Missing, thin, or stale knowledge was recognized on a governed entity.

**Enrichment Source Identified**  
A candidate source of improving knowledge was found for the entity.

**Enrichment Candidate Accepted**  
A discovered source or improvement path was accepted into governed enrichment work.

**Enrichment Scope Defined**  
The boundaries of what enrichment would attempt to improve were established.

**Enrichment Discovery Completed**  
The discovery phase closed with a recorded posture for next steps.

**Unpriced Lead Detected**  
A marketplace-relevant entity lacked governed pricing knowledge and enrichment was required.

Discovery events mark **recognition of improvement need**. They do not record every data scan or heuristic ping without entity effect.

---

## 6. Enrichment Verification Events

Enrichment Verification events assert **when enrichment sources and claims were validated or rejected before knowledge commitment**.

This family records **enrichment-layer validation truth**. It does not replace the cross-domain Verification catalog when formal review process applies.

**Enrichment Source Verified**  
A contributing source was accepted as fit for knowledge improvement.

**Enrichment Source Rejected**  
A contributing source was refused for enrichment use.

**Enrichment Claim Validated**  
A proposed knowledge improvement passed enrichment-layer validation.

**Enrichment Claim Invalidated**  
A proposed knowledge improvement failed enrichment-layer validation.

**Enrichment Cross-Source Conflict Detected**  
Competing sources proposed incompatible knowledge about the same entity aspect.

**Enrichment Source Conflict Resolved**  
A governed rule chose or merged standing knowledge from conflicting sources.

**Enrichment Awaiting External Confirmation**  
Commitment was blocked pending external or upstream confirmation.

Enrichment Verification keeps **source and claim truth** visible before improvement is committed.

---

## 7. Enrichment Improvement Events

Enrichment Improvement events assert **when available knowledge about an entity was materially augmented or changed**.

**Enrichment Started**  
Governed improvement work on entity knowledge began.

**Enrichment Completed**  
Improvement work concluded with a recorded completion posture.

**Enrichment Classification Applied**  
A governed classification was attached to the entity for the first time through enrichment.

**Enrichment Classification Changed**  
A standing classification was altered through enrichment.

**Enrichment Pricing Applied**  
Governed pricing knowledge was attached or updated on the entity.

**Enrichment Qualification Applied**  
Governed qualification or tier posture was attached or updated on the entity.

**Enrichment Attribute Augmented**  
Material descriptive or structural knowledge about the entity was added or corrected.

**Enrichment Knowledge Committed**  
Improved knowledge became part of standing entity truth available to downstream consumers.

Improvement events are the **core knowledge-delta memory** of the Enrichment domain. Original publish facts remain in their native domains.

---

## 8. Enrichment Confidence Events

Enrichment Confidence events assert **when trust, uncertainty, or confidence posture on entity knowledge changed**.

**Enrichment Confidence Posture Established**  
A governed confidence stance was first set for enriched entity knowledge.

**Enrichment Confidence Increased**  
Standing confidence in entity knowledge rose materially.

**Enrichment Confidence Decreased**  
Standing confidence in entity knowledge fell materially.

**Enrichment Uncertainty Recognized**  
The platform explicitly recorded unresolved uncertainty on enriched knowledge.

**Enrichment Trust Tier Changed**  
The governed trust tier associated with entity knowledge shifted.

**Enrichment Confidence Conflict Recognized**  
Confidence signals from different sources could not be reconciled without explicit handling.

Confidence events mark **how strongly the platform stands behind enriched knowledge**, not internal model scores.

---

## 9. Enrichment Quality Events

Enrichment Quality events assert **when quality posture changed whether enrichment could advance or commit**.

**Enrichment Quality Gate Passed**  
Entity knowledge improvement met criteria to proceed or commit.

**Enrichment Quality Gate Failed**  
Improvement failed criteria and was blocked or redirected.

**Enrichment Deferred**  
Improvement was intentionally postponed under policy.

**Enrichment Output Flagged**  
Improved knowledge was marked for elevated scrutiny before full use.

**Enrichment Stale Knowledge Recognized**  
Standing enriched knowledge was identified as outdated relative to source freshness rules.

**Enrichment Duplicate Prevented**  
Redundant enrichment applying equivalent knowledge was blocked.

**Enrichment Hold Applied**  
Commitment or use of enriched knowledge was paused pending further conditions.

Quality events mark **gating truth at the enrichment layer**. Formal Verification domain review may correlate when flagged.

---

## 10. Enrichment Failure Events

Enrichment Failure events assert **material breakdown or incomplete success in improving entity knowledge**.

**Enrichment Failed**  
Improvement work ended in failure without achieving governed completion posture.

**Enrichment Partially Applied**  
Some knowledge improved while the episode overall did not achieve full success posture.

**Enrichment Source Unavailable**  
Required contributing source could not be obtained.

**Enrichment Timeout Recognized**  
Governed time limits for improvement work were exceeded.

**Enrichment Integrity Warning Issued**  
Trust break or corruption risk was detected in the enrichment path.

**Enrichment Abandoned**  
Improvement work was left incomplete without active recovery.

**Enrichment Commitment Blocked**  
Validated improvement could not be committed due to downstream or policy constraint.

Failure events require **materiality**. Failed internal retries that do not change entity knowledge posture are not institutional memory.

---

## 11. Enrichment Recovery Events

Enrichment Recovery events assert **governed restoration after enrichment failure, stale knowledge, or unsafe commitment**.

**Enrichment Recovery Initiated**  
A governed recovery path began after failure, stale posture, or unsafe knowledge.

**Enrichment Retried**  
All or part of improvement work was re-executed under recovery policy.

**Enrichment Prior Knowledge Reverted**  
Standing enriched knowledge was returned to a prior governed posture.

**Enrichment Compensating Update Applied**  
A corrective knowledge change neutralized harmful partial enrichment.

**Enrichment Quarantined**  
Suspect enriched knowledge was isolated from normal downstream use.

**Enrichment Quarantine Released**  
Isolation ended after review or repair.

**Enrichment Recovery Completed**  
The recovery path closed with a recorded restoration posture.

Recovery pairs with Failure and Improvement families. Silent knowledge rollback without recovery memory is disallowed conceptually.

---

## 12. Enrichment Evidence

Enrichment Evidence describes **what supporting material makes entity knowledge change defensible** without turning the Black Box into a calculation archive.

Evidence principles:

1. **Entity knowledge focus** — Record what changed about the entity, not every intermediate numeric step.
2. **Source lineage** — Contributing sources and conflict resolution should remain reconstructible.
3. **Before-and-after correlation** — Link enrichment commits to prior standing knowledge without rewriting origin facts.
4. **Confidence explainability** — Posture changes should remain explainable without publishing model internals.
5. **No calculation dump** — Formula traces and inference logs stay outside unless material to integrity breach.

Typical evidence attachments conceptually include:

- entity identity as correlation context, not merged domain record
- discovery gap or opportunity reason when material to dispute
- source verification or conflict resolution trail
- classification, pricing, and qualification change chain
- confidence and trust-tier posture at commitment
- deferral, hold, and quality gate outcomes
- recovery and revert sequence relative to prior improvement events
- references to pipeline or factory handoff when enrichment was triggered by flow

Enrichment evidence strengthens pricing, qualification, and investor-trust disputes. It does not replace Marketplace, Property, or Pipeline domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Enrichment truth relates to neighboring catalogs** without collapse.

**Pipeline domain**  
Owns staged flow movement between connected steps. Pipeline may deliver entities to enrichment; sequence truth remains there.

**Factory domain**  
Owns global orchestration and factory-level publication handoff. Factory may trigger enrichment batches; orchestration truth remains there.

**Engine domain**  
Owns single-unit processing. Engines may perform enrichment calculations; component facts remain at engine boundary unless knowledge commitment occurs at enrichment layer.

**Marketplace domain**  
Owns investor-visible opportunity presentation. Enrichment changes what may be shown; marketplace visibility rules remain native there.

**Property domain**  
Owns property subject truth. Property-targeted enrichment correlates without merging property identity.

**Verification domain**  
Owns formal cross-domain review process. Enrichment flags and enrichment-layer validation correlate; verification owns review path and verdict when process applies.

**Admin domain**  
Owns privileged human override. Operator correction of enriched knowledge correlates without absorbing enrichment history.

**Integration domain**  
Owns external boundary authority. External sources feeding enrichment correlate at enrichment verification layer.

**Purchase and Payment domains**  
Own commercial and financial truth. Pricing enrichment correlates; capture and entitlement remain in payment memory.

**Legal domain**  
Owns binding policy acceptance. Enrichment affecting legally gated presentation may correlate at commitment moments.

Boundary discipline keeps **one knowledge-improvement story** without making Enrichment the catch-all for all automation layers.

---

## 14. Governance

Enrichment catalog governance defines **how Enrichment event classes remain trustworthy** as knowledge-improvement rules evolve.

Governance principles:

1. **Knowledge materiality** — New classes must prove entity knowledge truth, not model observability fashion.
2. **Layer separation** — Enrichment vocabulary must not absorb pipeline movement or factory orchestration facts.
3. **Calculation exclusion** — Internal scores and formula traces require explicit materiality review before any class approval.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Additive discipline** — Enrichment improves knowledge; it must not silently rewrite original domain facts conceptually.
6. **Amendment caution** — Retroactive relabeling when enrichment logic is redesigned requires governance review.

**Governance questions for every proposed enrichment event class**

- Does this assert entity knowledge change that existing classes do not?
- Would absence of this class leave qualification or pricing disputes unexplained?
- Is it free of internal calculation traces and subroutine noise?
- Does it preserve separation from Pipeline, Factory, and Verification domains?
- Can investigators correlate it with entity origin without merging vocabularies?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Model verbosity is not sufficient justification.

---

## 15. Future Evolution

Enrichment catalog evolution may add new event classes only when **new entity knowledge truth** must be preserved.

**Allowed evolution**

- Finer partial-application and revert classes when dispute review exposes ambiguity
- Additional source-conflict classes as enrichment inputs diversify
- Clearer confidence and trust-tier classes as risk rules mature
- Distinct deferral and hold classes as availability policies grow

**Evolution requirements**

Every proposed enrichment event class must answer:

1. What entity knowledge truth does it assert that existing classes do not?
2. Does it meet the materiality standard — real change to available knowledge about an entity?
3. Does it avoid internal calculation and inference trace noise?
4. Can it correlate with Pipeline and native entity domains without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every model inference or formula step as institutional memory
- Merging discovery, verification, and improvement into one convenience class
- Using enrichment events as pipeline stage or factory publication shortcuts
- Collapsing enrichment-layer validation into cross-domain Verification vocabulary
- Silent knowledge revert without revert or recovery classes
- Making enrichment implementation detail a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Model output volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Enrichment domain**.

Enrichment Discovery marks when improvement was needed. Enrichment Verification marks when sources and claims were validated. Improvement marks what knowledge changed. Confidence marks how strongly the platform stands behind it. Quality marks when enrichment could advance. Failure and Recovery mark breakdown and restoration of knowledge improvement. Evidence and boundaries keep entity knowledge change legible without calculation noise or layer smuggling.

Technical representation comes later. Knowledge-improvement truth begins here.
