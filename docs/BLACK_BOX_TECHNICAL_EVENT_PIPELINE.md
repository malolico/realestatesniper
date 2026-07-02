# RealEstateSniper Black Box — Technical Event Pipeline

Technical architecture of the **end-to-end event pipeline** from domain recognition to investigation and export availability.

This document defines **pipeline stages, stage boundaries, and flow discipline** at high technical level. It does not define storage, interfaces, transport, infrastructure products, or code.

For technical layers and boundaries, see `BLACK_BOX_TECHNICAL_ARCHITECTURE.md`.  
For logical entities in the pipeline, see `BLACK_BOX_TECHNICAL_DATA_MODEL.md`.  
For event meaning and lifecycle, see `BLACK_BOX_EVENT_MODEL.md`.  
For conceptual event journey, see `BLACK_BOX_ARCHITECTURE.md`.  
For investigation and export method, see `BLACK_BOX_INVESTIGATION_MODEL.md` and `BLACK_BOX_EXPORT_MODEL.md`.

---

## 1. Purpose

The Technical Event Pipeline exists so that every material fact follows **one intelligible technical path** through institutional memory.

Its purpose is to answer:

- What happens after a domain recognizes a fact?
- Where does admission end and persistence begin?
- When may evidence, correlation, timelines, investigation, and export consume the event?
- How does the pipeline preserve immutability, domain honesty, and failure visibility?

The pipeline is **flow architecture**, not implementation design. It names stages and responsibilities future systems must express.

---

## 2. Pipeline Philosophy

Pipeline philosophy treats event movement as **governed progression**, not as logging.

Philosophy principles:

1. **Origin is domain truth** — Recognition happens where the platform decides a material fact exists.
2. **Admission is gatekept** — Not every signal becomes memory.
3. **Persistence is the point of no rewrite** — Core assertion immutability begins at persistence, not at recognition.
4. **Enrichment follows assertion** — Explanation and evidence may lag; they must not replace the core fact.
5. **Derivation is downstream** — Timelines and packages are built from persisted primitives.
6. **Read paths never define write truth** — Investigation and export availability do not control admission.
7. **Failure is a first-class outcome** — Rejection, provisional hold, and quarantine are pipeline facts when material.

The pipeline serves **reconstructible accountability**, not maximum throughput of signals.

---

## 3. Event Recognition

Event Recognition is the **first pipeline stage**: a platform domain identifies that a registry-aligned material fact occurred.

**Stage responsibility**

- detect materiality under catalog and constitutional rules
- identify primary domain ownership of the fact
- bind recognition to authoritative decision point, not presentation layer
- prepare emission with actor, subject, and correlation context sufficient for later stages

**Inputs**

- domain business outcome
- registry-aligned event class intent
- attribution and subject anchors known at source

**Outputs**

- governed emission signal crossing the emission boundary
- recognition context preserved for admission

**Stage boundaries**

Recognition ends when the domain hands responsibility to the Black Box intake path. Recognition does **not** imply acceptance into immutable memory.

**Failure posture**

If materiality is uncertain, domain policy decides whether to signal provisionally or withhold emission. Silent omission of material facts is a domain governance failure, not a pipeline shortcut.

---

## 4. Event Admission

Event Admission is the **controlled entry** of a governed signal into the Black Box intake path.

**Stage responsibility**

- receive signal at emission boundary
- acknowledge intake with arrival context
- preserve out-of-order and delayed arrival without corrupting prior memory
- route signal toward validation or provisional hold

**Inputs**

- domain emission signal
- arrival timing and source path metadata at logical level

**Outputs**

- admitted-to-intake posture: received, held provisional, or rejected at boundary

**Stage boundaries**

Admission accepts **custody of the signal**, not final truth status. Admission success means the Black Box accepted responsibility to process the signal, not that the event is yet persisted.

**Failure posture**

Malformed or untrusted boundary signals stop here with accountable rejection or quarantine posture when policy requires visibility.

---

## 5. Event Validation

Event Validation determines **whether a received signal may progress** toward classification and persistence.

**Stage responsibility**

- verify structural coherence and registry class fit
- assess actor plausibility and source authority
- evaluate timing credibility and duplicate-risk
- decide: accept for progression, admit provisionally, reject with reason, or quarantine

**Inputs**

- admitted signal
- registry and schema principle constraints at logical level

**Outputs**

- validation outcome with accountability
- provisional flag when preservation precedes full confidence

**Stage boundaries**

Validation may block persistence but must not **rewrite** the signal to force validity. Invalid remains invalid; provisional remains visible.

**Failure posture**

Rejected signals remain investigable as boundary failures when material. Silent drop is forbidden for accountability-relevant attempts.

---

## 6. Event Classification

Event Classification assigns **shared investigable meaning** while preserving domain-native identity.

**Stage responsibility**

- bind signal to canonical event class and primary domain category
- assign initial trust posture
- attach actor and subject logical references
- prepare normalized event logical entity for persistence eligibility

**Inputs**

- validated or provisionally validated signal

**Outputs**

- classification-ready logical event with domain honesty intact

**Stage boundaries**

Classification translates; it does not merge distinct facts. One signal yields one primary classified assertion unless policy explicitly decomposes legitimately separable facts.

**Failure posture**

Classification ambiguity must surface as provisional or disputed initial posture, not as silent miscategorization.

---

## 7. Event Persistence

Event Persistence is the **commitment of accepted assertion** into immutable memory core.

**Stage responsibility**

- assign durable canonical event identity
- record occurred time and recorded time distinctly where they differ
- freeze core assertion immutably
- make event eligible for downstream enrichment, correlation, and read paths

**Inputs**

- classification-ready logical event

**Outputs**

- persisted Event logical entity in append-only core

**Stage boundaries**

Persistence is the **point of no rewrite** for core assertion. This stage ends when the event exists as institutional memory.

**Failure posture**

Persistence failure must not pretend success. Partial persistence must be visible and recoverable without corrupting adjacent memory.

---

## 8. Evidence Attachment

Evidence Attachment is the **additive linking** of corroboration to persisted events.

**Stage responsibility**

- create Evidence logical entities linked to events
- attach Resource references where handles suffice
- evolve trust posture visibly when proof strengthens or weakens defensibility
- tolerate late arrival without reordering core assertion truth

**Inputs**

- persisted events
- corroborating material or references from domains, integrations, or review

**Outputs**

- evidence links with custody posture
- optional trust posture updates on defensibility, not on assertion rewrite

**Stage boundaries**

Evidence attachment never substitutes for missing Event admission. Proof links to facts; it does not silently become the fact.

**Failure posture**

Missing expected evidence remains a representable gap. Attachment failure does not delete or alter core assertion.

---

## 9. Correlation

Correlation establishes **relationships** between persisted events and related logical entities.

**Stage responsibility**

- create Correlation logical entities between endpoints
- support journey, case, commercial, automation, governance, communication, protection, and boundary relationship types
- preserve endpoint identity and surface contested relationships

**Inputs**

- persisted events
- actor and subject anchors
- emission-time correlation hints and investigator-authorized links

**Outputs**

- correlation relationship set without merged endpoints

**Stage boundaries**

Correlation may occur after persistence, during investigation assembly, or incrementally as related events arrive. It never replaces Event entities.

**Failure posture**

Broken or ambiguous correlation must remain visible rather than forcing narrative merge.

---

## 10. Timeline Construction

Timeline Construction builds **derived temporal assemblies** over scoped event sets.

**Stage responsibility**

- select events within investigation or analytic scope
- order by occurred, recorded, and enrichment relevance
- expose concurrency, delay, and uncertainty
- produce Timeline logical entities as rebuildable views

**Inputs**

- persisted events
- correlations and evidence timing
- scope definition from investigation or authorized review

**Outputs**

- timeline assemblies for interpretation

**Stage boundaries**

Timelines are **derived**, not authoritative over source events. Multiple timelines may coexist for the same events.

**Failure posture**

Timeline construction must not hide provisional, superseded, withdrawn, or contradictory events within scope.

---

## 11. Investigation Availability

Investigation Availability marks when persisted memory becomes **consumable under governed review**.

**Stage responsibility**

- enforce read authorization and case scope
- assemble collections of events, evidence, correlations, and timelines within bounds
- support evaluation without mutating immutable core
- record investigation closure outcomes separately from source events

**Inputs**

- persisted events and derived assemblies
- Governance authorization for review

**Outputs**

- Investigation logical entities with bounded findings or referrals

**Stage boundaries**

Investigation availability begins only after persistence. Review consumes memory; it does not create substitute assertions except through normal domain emission outside the pipeline read path.

**Failure posture**

Unauthorized scope expansion is blocked. Investigation tooling must not correct product state or rewrite history.

---

## 12. Export Availability

Export Availability marks when investigation-ready memory may be **composed into governed disclosure packages**.

**Stage responsibility**

- enforce export authorization beyond investigation scope where required
- select events and evidence under minimum necessary disclosure
- apply redaction to package only
- produce Export logical entities with custody and integrity posture

**Inputs**

- persisted events, evidence, correlations, timelines, optional investigation findings
- Governance export authorization

**Outputs**

- disclosure packages for authorized recipient classes

**Stage boundaries**

Export availability is downstream of persistence and typically downstream of investigation discipline. Export never mutates source memory.

**Failure posture**

Export restriction, delay, or partial release must remain policy-visible. Failed package assembly must not alter underlying events.

---

## 13. Failure Principles

Failure principles define **how the pipeline behaves when stages break**.

**Principle 1 — No silent loss**  
Material recognition, rejection, or persistence failure must be representable when accountability requires it.

**Principle 2 — Isolate blast radius**  
Intake or enrichment failure must not corrupt previously persisted core.

**Principle 3 — Provisional is visible**  
Provisional admission and incomplete enrichment must not present as final certainty.

**Principle 4 — Product independence**  
Emission and admission failure must not block product truth paths in ways that invent false omission or false success.

**Principle 5 — Recover forward**  
Recovery creates new governed facts and repair postures; it does not rewrite persisted assertions.

**Principle 6 — Quarantine is memory**  
Quarantined signals remain accountable when policy demands traceability.

**Principle 7 — Read failure is not write failure**  
Investigation or export unavailability does not excuse missing admission where material facts occurred.

Failures are **pipeline truth**, not operational embarrassment to hide.

---

## 14. Evolution Principles

Evolution principles govern **how the pipeline may change** after initial implementation.

**Allowed evolution**

- additional validation rigor as registry matures
- finer provisional and disputed posture handling
- incremental correlation strategies without endpoint merge
- improved timeline and package assembly quality

**Evolution requirements**

Every pipeline change must answer:

1. Does it preserve persistence immutability?
2. Does it keep domain classification honest?
3. Does it avoid making read paths prerequisites for write truth?
4. Does it strengthen failure visibility?
5. Does it remain expressible using logical entities in the data model?

**Disallowed evolution**

- skipping persistence while claiming investigability
- merging validation and classification into silent convenience steps
- letting export or investigation mutate core assertions
- turning pipeline stages into undifferentiated log streams
- retrofitting past events with new meaning without additive lineage

Pipeline evolution serves **long memory integrity**, not short-term delivery shortcuts.

---

## 15. Closing Principles

The Technical Event Pipeline rests on a small set of enduring principles:

**Recognition is not memory**  
Domains recognize; the pipeline admits and persists under governance.

**Persistence is the hinge**  
Everything investigable ultimately depends on disciplined persistence.

**Enrichment is additive**  
Evidence and explanation deepen memory; they do not replace it.

**Correlation narrates; it does not merge**  
Stories are built from separate facts.

**Timelines interpret time; they do not own it**  
Source events retain temporal authority.

**Investigation reads; export discloses**  
Neither stage owns admission truth.

**Failures must be visible**  
A pipeline that hides breakage cannot support institutional defensibility.

---

## Closing Note

This document defines the **technical event pipeline of the Black Box**.

Recognition begins in product domains. Admission and validation gate entry. Classification prepares honest meaning. Persistence commits immutable assertion. Evidence and correlation enrich without merge. Timelines assemble time for review. Investigation and export consume memory under governance. Implementation choices come later. Pipeline discipline begins here.
