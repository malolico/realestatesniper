# RealEstateSniper Black Box — Technical Data Model

Logical data model for the Black Box — **what institutional memory must be able to represent** before any physical storage is chosen.

This document defines **core logical entities, their responsibilities, and relationship discipline** at the technical-logical layer. It does not define databases, tables, columns, indexes, policies, interfaces, or code.

For technical system layers, see `BLACK_BOX_TECHNICAL_ARCHITECTURE.md`.  
For event meaning and lifecycle, see `BLACK_BOX_EVENT_MODEL.md`.  
For schema constraints on future representation, see `BLACK_BOX_EVENT_SCHEMA_PRINCIPLES.md`.  
For Record, Explain, and Evidence layering, see `BLACK_BOX_CONSTITUTION.md`.  
For investigation and export method, see `BLACK_BOX_INVESTIGATION_MODEL.md` and `BLACK_BOX_EXPORT_MODEL.md`.

---

## 1. Purpose

The Technical Data Model exists so that future physical design **cannot accidentally merge distinct accountability concepts** into one undifferentiated blob.

Its purpose is to answer:

- What logical entities compose Black Box memory?
- What does each entity own, and what must it never absorb from another?
- How do events, actors, subjects, evidence, correlation, investigation, and export relate without collapse?
- What rules must any future physical model obey to remain faithful to the design corpus?

This document is **logical structure only**. It names entity responsibilities, not storage shapes.

---

## 2. Data Model Philosophy

Data model philosophy treats logical entities as **accountability primitives**, not as convenience mirrors of product tables.

Philosophy principles:

1. **Event is the atomic assertion** — Institutional memory centers on governed facts, not on screen state.
2. **Identity is durable** — Each logical entity that must be referenced across time has stable identity within its layer.
3. **Separation over normalization** — Distinct concepts remain distinct even if physical storage later colocates them.
4. **Derivation is explicit** — Timelines, packages, and views are built from primitives; they do not replace them.
5. **Additive maturity** — Enrichment, evidence, and trust posture evolve without rewriting core assertions.
6. **Minimum necessary capture** — Logical entities carry investigatory sufficiency, not product-wide duplication.
7. **Physical independence** — This model must remain valid regardless of database, file, or document technology chosen later.

The logical model serves **decades-long reconstruction**, not short-term query convenience alone.

---

## 3. Core Logical Entities

The Black Box logical model composes **ten primary entity families** plus cross-cutting relationship discipline.

- **Event** — immutable assertion of a material fact
- **Actor** — originator or accountable party for an assertion or action
- **Subject** — participant, asset, or case focus the assertion concerns
- **Resource** — governed reference to external or linked material without becoming the assertion
- **Evidence** — corroboration entity with custody linkage to events
- **Correlation** — relationship between separate events or entities without merger
- **Timeline** — derived temporal assembly for investigation scope
- **Investigation** — bounded review container over memory
- **Export** — governed disclosure package container
- **Governance** — authorization, policy, and accountability facts over memory operations

These families map to technical architecture layers but are **data responsibilities**, not module names. One physical store might hold multiple entity types; logical separation must still be intelligible.

---

## 4. Event Entity

The Event entity represents **an accepted assertion that a material fact occurred** under a registry-aligned event class.

**Logical responsibility**

- preserve canonical event identity for the lifetime of the platform
- bind assertion to primary domain classification and event class meaning
- carry occurred-time, recorded-time, and initial trust posture
- remain immutable in core assertion after acceptance
- support linkage to actors, subjects, resources, evidence, and correlations

**What Event owns**

- the fact that a governed event class was recognized
- admission posture at acceptance: asserted, provisional, or disputed initial state where applicable
- lineage reference when assertion supersedes or clarifies prior posture additively

**What Event must not own**

- live product state
- full evidentiary payload when linkage suffices
- merged multi-domain stories
- investigation conclusions or export redaction rules

**Lifecycle posture**

Events are admitted once in core assertion sense. Corrections appear as **new additive events or overlays**, not silent in-place mutation.

---

## 5. Actor Entity

The Actor entity represents **who or what originated an assertion or governed action** with investigable identity.

**Logical responsibility**

- distinguish human participants, privileged operators, automated processes, and external authorities at appropriate confidence
- support attribution across emission, admission, investigation, and export when policy requires
- remain stable enough to correlate journeys without conflating distinct participants

**What Actor owns**

- identity class and attribution confidence posture
- role or capacity context at time of relevance when material to accountability
- distinguishability between service actors, user actors, operator actors, and boundary authority actors

**What Actor must not own**

- full account biography — User Account domain events correlate
- permissions entitlement state — authentication and account layers correlate
- investigation reviewer identity as if it were the historical fact under review unless the review itself is the asserted event

**Relationship to Event**

Events reference originating actors. Actor entities enable **who** questions without turning attribution into the entire story.

---

## 6. Subject Entity

The Subject entity represents **what an event is primarily about** in platform accountability terms.

**Logical responsibility**

- identify the focus of an assertion: participant, property, deal, case, payment episode, factory run, integration boundary episode, or other governed focus types
- support scope anchors for investigation and export without merging domain identities
- allow multiple events to reference the same subject across time

**What Subject owns**

- subject class and stable subject identity within its domain context
- investigatory anchor role for timelines, cases, and packages

**What Subject must not own**

- the assertions themselves — events remain separate
- cross-domain merged identity when catalogs require separation — correlation handles relationship
- live mutable state of the underlying product object

**Examples of subject classes at logical level**

Participant, property, commercial episode, owner case, verification case, automation run, security incident episode, integration episode. Class list follows master catalog domains; this document does not define registry entries.

---

## 7. Resource Entity

The Resource entity represents **governed reference material** linked to memory without becoming the core assertion.

**Logical responsibility**

- point to documents, receipts, external confirmations, handles, or artifacts under custody rules
- support minimum necessary linkage rather than reckless embedding
- preserve reference stability for investigation and export selection

**What Resource owns**

- reference identity and custody class
- sensitivity posture affecting linkage and disclosure
- relationship role: supporting material, external authority artifact, or contextual attachment

**What Resource must not own**

- the institutional fact being asserted — that remains Event
- full corroboration verdict — Evidence entity carries proof posture
- marketplace, document, or payment domain native truth — those domains correlate

**Distinction from Evidence**

Resource emphasizes **reference and handle**. Evidence emphasizes **corroboration role and defensibility linkage** to assertions. One physical artifact may appear as both reference and evidence in logical terms with distinct responsibilities.

---

## 8. Evidence Entity

The Evidence entity represents **corroboration attached to assertions** with explicit custody and confidence effect.

**Logical responsibility**

- link proof to one or more events without replacing them
- support arrival after core assertion
- make strengthening, weakening, or unresolved proof posture visible
- preserve chain-of-custody thinking across review and export

**What Evidence owns**

- corroboration linkage to events
- evidence class and custody posture
- trust effect on defensibility when policy assigns confidence evolution
- visible absence markers when proof is expected but unavailable

**What Evidence must not own**

- silent conversion of proof into a new assertion without governed event class
- unrestricted duplication of sensitive content across packages
- legal verdict or investigation finding — those live in review layers

**Lifecycle posture**

Evidence is **additive**. It may mature, be restricted, or be redacted in disclosure artifacts while source linkage remains accountable.

---

## 9. Correlation Entity

The Correlation entity represents **a governed relationship** between separate events, subjects, actors, or episodes.

**Logical responsibility**

- express that separate assertions belong to one reconstructible story
- preserve endpoint identity without merger
- support journey, case, commercial, automation, governance, communication, protection, and boundary linkage types

**What Correlation owns**

- relationship type and endpoint references
- optional rationale class: shared actor, shared subject, shared episode, handoff, external trigger, or investigator-assembled linkage where authorized
- visibility of unresolved or contested relationship when contradiction exists

**What Correlation must not own**

- merged replacement events
- inferred causality presented as fact without basis
- hidden contradiction between endpoints

**Design rule**

Correlation is a **relationship layer**. Endpoints remain first-class Events with domain-native meaning.

---

## 10. Timeline Entity

The Timeline entity represents **a derived temporal assembly** for a defined investigation or review scope.

**Logical responsibility**

- order member events by occurred, recorded, and enrichment relevance
- expose concurrency, delay, and uncertainty visibly
- serve investigator interpretation without altering source events

**What Timeline owns**

- scope definition and member event selection reference
- ordering posture and explicit uncertainty markers
- derived view identity separate from underlying events

**What Timeline must not own**

- authoritative replacement chronology that rewrites source timing
- hidden omission of provisional, superseded, or contradictory events within scope
- permanent mutation of member events

**Derivation rule**

Timelines are **rebuildable views**. Multiple timelines may exist over the same events for different scopes or ordering emphasis.

---

## 11. Investigation Entity

The Investigation entity represents **a bounded accountability review container** over institutional memory.

**Logical responsibility**

- bind purpose, authorization, scope, and reviewer accountability
- reference collected events, correlations, timelines, and evidence within scope
- carry closure posture: resolved finding, bounded finding with gaps, referral, or insufficient scope
- remain read-oriented relative to immutable event core

**What Investigation owns**

- case purpose and scope boundaries
- review lifecycle state at logical level
- bounded findings as review outcomes, not as replacements for domain events
- references to timelines and correlation assemblies used

**What Investigation must not own**

- silent correction of product state
- re-emission of historical facts under new names
- unconstrained full-memory browsing without scope

**Relationship to Governance**

Investigation entities operate under Governance authorization. Sensitive investigations may require additional governance linkage.

---

## 12. Export Entity

The Export entity represents **a governed disclosure package** composed for an authorized recipient need.

**Logical responsibility**

- bind export authorization, recipient class, and disclosure scope
- reference selected events, evidence, correlations, timelines, and optional bounded findings
- carry redaction and omission posture applied to the package, not to source memory
- preserve assembly accountability and integrity posture

**What Export owns**

- package identity and disclosure purpose
- recipient category and scope snapshot at assembly time
- redaction minimization record where policy requires
- transfer and custody posture of the disclosure artifact

**What Export must not own**

- mutation of source events or evidence
- bulk backup of entire memory
- legal conclusions replacing counsel judgment

**Relationship to Investigation**

Export may follow investigation but requires **explicit export authorization**. Investigation scope does not automatically equal export scope.

---

## 13. Governance Entity

The Governance entity represents **authorization, policy, and accountability facts** governing memory operations.

**Logical responsibility**

- record who may read, investigate, export, or administer taxonomy under what purpose
- capture policy activations affecting retention, restriction, and access
- support separation of duties and auditability of powerful memory operations
- link governance facts to investigations and exports where required

**What Governance owns**

- access grants and revocations with purpose binding
- export and investigation authorization references
- registry change accountability at logical level when event taxonomy evolves
- restriction and legal hold posture affecting availability without erasing assertions

**What Governance must not own**

- the business facts under review — those remain domain events
- silent denial that governance action occurred when policy requires visibility

**Distinction**

Governance entities protect **memory operations**. Security domain events may correlate when platform protection facts occur; Governance entities structure Black Box control itself.

---

## 14. Relationship Principles

Relationship principles define **how logical entities may connect** without semantic collapse.

**Cardinality discipline**

- Events may reference multiple actors, subjects, and resources within proportionality limits
- Evidence links to one or more events; events do not absorb evidence identity
- Correlations always preserve distinct endpoints
- Timelines reference many events; events do not belong exclusively to one timeline
- Investigations reference many events and optional timelines; they do not subsume event identity
- Exports reference selections; they do not subsume investigations or events

**Directionality**

- Emission flows inward to Event admission
- Enrichment flows additively to Events through Evidence and explanation overlays
- Investigation and Export read outward from core memory
- Governance wraps read and export paths

**Forbidden relationships**

- Event merges another Event into undifferentiated history
- Evidence replaces Event as the asserted fact
- Timeline mutates Event timing authority
- Export overwrites Event or Evidence source
- Subject identity collapses distinct domain subjects without Correlation

**Referential integrity at logical level**

If a relationship points to an entity, investigators must be able to resolve the target or see explicit broken-link posture. Silent dangling reference is a model failure.

---

## 15. Future Physical Model Rules

Future physical model rules constrain **how logical entities may be stored** when implementation begins. They still do not define concrete schemas.

**Mapping rules**

1. **Logical separation preserved** — Physical colocation must not blur Event, Evidence, Correlation, Investigation, and Export responsibilities.
2. **Append-only core** — Physical representation of Event core assertion must not permit silent in-place rewrite.
3. **Identity stability** — Canonical event identity survives physical migration and enrichment.
4. **Three-time support** — Occurred, recorded, and enrichment arrival must remain expressible.
5. **Linkage over embedding** — Sensitive content prefers reference handles in physical design.
6. **Derivation rebuildable** — Timelines and packages must be reconstructible from primitives after physical changes.
7. **Governance traceable** — Sensitive read and export operations must remain associable with authorization facts where policy requires.

**Physical design forbidden patterns**

- one wide table mirroring live product state as history
- JSON document blobs substituting for domain-separated events without class discipline
- investigation tables that mutate event assertions
- export jobs that alter source rows
- analytics warehouses treated as authoritative memory

**Evolution rule**

Physical models may version, partition, archive, and restrict availability. They may not **reinterpret past assertions** without additive lineage visible at logical level.

**Next phase boundary**

The document following this one in technical architecture may choose storage technology and physical shapes. It must demonstrate compliance with this logical model and with `BLACK_BOX_EVENT_SCHEMA_PRINCIPLES.md` before implementation proceeds.

---

## Closing Note

This document defines the **logical data model of the Black Box**.

Events assert. Actors attribute. Subjects anchor. Resources reference. Evidence corroborates. Correlations relate without merge. Timelines assemble time for review. Investigations bound reconstruction. Exports bound disclosure. Governance bounds power over memory. Physical storage comes later. Logical accountability structure begins here.
