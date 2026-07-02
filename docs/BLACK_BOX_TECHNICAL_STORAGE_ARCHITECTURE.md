# RealEstateSniper Black Box — Technical Storage Architecture

Technology-independent storage architecture for the Black Box — **how institutional memory should be organized at rest** before any database or infrastructure is chosen.

This document defines **logical storage layers, storage responsibilities, and storage discipline** at high technical level. It does not choose storage products, define schemas, partitions, policies, interfaces, or code.

For technical system layers, see `BLACK_BOX_TECHNICAL_ARCHITECTURE.md`.  
For logical entities stored, see `BLACK_BOX_TECHNICAL_DATA_MODEL.md`.  
For event pipeline stages, see `BLACK_BOX_TECHNICAL_EVENT_PIPELINE.md`.  
For retention and custody posture, see `BLACK_BOX_RETENTION_AND_EVIDENCE_POLICY.md`.  
For memory protection, see `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Technical Storage Architecture exists so that future physical storage choices **serve accountability memory rather than dictating its meaning**.

Its purpose is to answer:

- How should Black Box memory be organized in distinct storage responsibilities?
- Which layers require immutability, which allow derivation, and which govern access?
- How do retention, recovery, scalability, and integrity apply to stored truth?
- What rules must any future physical storage design obey?

This document describes **storage shape at the architectural level**. It does not name databases, files, buckets, or query languages.

---

## 2. Storage Philosophy

Storage philosophy treats Black Box memory as **layered witness preservation**, not as a product data cache.

Philosophy principles:

1. **Append-only core** — Accepted assertions are preserved without in-place rewrite.
2. **Layer separation** — Immutable memory, evidence, correlation, investigation, export, governance, and retention are distinguishable responsibilities.
3. **Reference over hoarding** — Storage carries investigatory sufficiency, not indiscriminate duplication of sensitive material.
4. **Availability is not exposure** — Retention and restriction change who may reach memory, not what was asserted.
5. **Derivation is rebuildable** — Investigation views and export packages can be reconstructed from primitives.
6. **Technology agnosticism** — This architecture must remain valid across any compliant physical substrate.
7. **Decades horizon** — Storage choices must support long dispute reconstruction, not only near-term access patterns.

Storage exists to keep **truth durable, separable, and governable**.

---

## 3. Logical Storage Layers

The Black Box organizes stored memory into **seven logical storage layers** plus cross-cutting retention discipline.

- **Immutable Memory Layer** — append-only core assertions
- **Evidence Storage Layer** — corroboration and resource linkage
- **Correlation Layer** — relationship storage without endpoint merger
- **Investigation Layer** — bounded review containers and derived assemblies
- **Export Layer** — governed disclosure package storage
- **Governance Layer** — authorization and policy accountability over memory operations
- **Retention Layer** — availability, archival, and restriction posture over time

Layers are **logical storage zones**. A future physical system may map multiple layers to shared infrastructure, but responsibilities must not blur.

**Read versus write posture**

- Immutable Memory and Evidence core links are write-once in assertion terms
- Correlation may grow additively as relationships are recognized
- Investigation and Export layers store derived and authorized outputs
- Governance and Retention layers store control facts affecting reachability

---

## 4. Immutable Memory Layer

The Immutable Memory Layer stores **accepted Event assertions** and their non-rewritable core lineage.

**Storage responsibility**

- preserve canonical event identity permanently
- store occurred-time, recorded-time, domain classification, and initial trust posture
- retain admission lineage for provisional, superseding, or clarifying additive facts
- anchor actor and subject references without absorbing their native domain stores

**Write discipline**

- inserts only for new accepted assertions and additive lineage records
- no in-place mutation of core assertion meaning after persistence
- corrections appear as new additive stored facts, not silent overwrites

**Read discipline**

- broadly readable only under governance authorization
- investigability does not imply universal internal visibility

**What this layer must not store**

- live operational product state as substitute for history
- investigation findings as if they were domain events
- full sensitive payloads when reference linkage suffices

The Immutable Memory Layer is the **heart of the witness**. All other storage layers orbit it.

---

## 5. Evidence Storage Layer

The Evidence Storage Layer stores **corroboration entities, resource references, and trust-evolution linkage** to events.

**Storage responsibility**

- link Evidence logical entities to one or more persisted events
- store custody class and sensitivity posture
- preserve reference handles to external or separately custodied material
- record visible absence or withheld proof posture where policy requires

**Write discipline**

- additive attachment after event persistence
- trust posture evolution stored as additive history, not assertion rewrite
- redaction in later export does not delete source linkage accountability

**Read discipline**

- heightened protection for sensitive corroboration classes
- minimum necessary disclosure begins at storage design intent

**Separation rule**

Evidence storage supports proof paths. It does not become an undifferentiated file dump replacing domain-specific custody systems.

---

## 6. Correlation Layer

The Correlation Layer stores **relationships between events, subjects, actors, and episodes** without merging endpoints.

**Storage responsibility**

- persist Correlation logical entities with typed relationship meaning
- preserve endpoint references to distinct stored events or entities
- support incremental relationship growth as new events arrive or investigation authorizes links
- represent contested or unresolved relationship posture when needed

**Write discipline**

- additive relationship creation
- relationship correction through new correlation facts or explicit invalidation records, not silent graph rewrite

**Read discipline**

- optimized for narrative reconstruction across domains
- must not present merged pseudo-events

Correlation storage enables **story structure** while Immutable Memory Layer retains atomic assertions.

---

## 7. Investigation Layer

The Investigation Layer stores **bounded review containers and rebuildable derived assemblies**.

**Storage responsibility**

- persist Investigation logical entities with purpose, scope, authorization, and closure posture
- store references to collected events, evidence, correlations, and timelines
- retain bounded findings as review outcomes separate from domain assertions
- optionally cache timeline assemblies for performance without making cache authoritative over primitives

**Write discipline**

- investigation state may evolve through lifecycle
- findings and scope metadata may update within investigation container
- must not write back into Immutable Memory Layer assertion content

**Read discipline**

- scoped to authorized reviewers
- cross-domain collection allowed only within authorized investigation boundary

Investigation storage is **read-path memory about review**, not a second source of platform truth.

---

## 8. Export Layer

The Export Layer stores **governed disclosure packages and their assembly accountability**.

**Storage responsibility**

- persist Export logical entities with recipient class, purpose, and scope snapshot
- store references to selected events, evidence, correlations, timelines, and optional findings
- retain redaction and omission posture applied to the package artifact
- preserve assembly and transfer accountability

**Write discipline**

- new package versions for new disclosure acts
- redacted artifacts stored separately from source memory where required
- no mutation of source layers during package creation

**Read discipline**

- tightly governed; often narrower than investigation read scope
- recipient-bound where policy requires

Export storage holds **disclosure artifacts**, not authoritative replacements for institutional memory.

---

## 9. Governance Layer

The Governance Layer stores **authorization, policy, and accountability facts** governing memory operations.

**Storage responsibility**

- record access grants, revocations, and purpose bindings where policy requires
- store investigation and export authorization references
- retain registry and taxonomy change accountability at storage-relevant level
- link restriction and legal hold posture to affected reachability without erasing assertions

**Write discipline**

- governance facts are appendive with clear supersession lineage when policy changes
- sensitive governance events stored with appropriate protection

**Read discipline**

- meta-access highly restricted
- audit of who governed memory is as sensitive as memory itself

Governance storage protects **the control plane of the witness**.

---

## 10. Retention Layer

The Retention Layer stores **availability, archival, and restriction posture** over time across other layers.

**Storage responsibility**

- apply category-aware retention rules to reachability
- move memory to archived posture without destroying assertion lineage where policy allows
- enforce restriction, anonymization markers, and legal hold without silent erasure
- document retention policy changes as reviewable stored facts when required

**Write discipline**

- retention actions change availability metadata and access paths
- retention does not rewrite Immutable Memory core assertions

**Read discipline**

- archived or restricted material visible only under authorized scope
- investigators must see restriction posture when it affects interpretation

Retention storage implements **proportionality over time**. It is not a license to delete inconvenient truth silently.

---

## 11. Recovery Principles

Recovery principles define **how storage behaves after failure, corruption risk, or partial loss**.

Recovery principles:

1. **Core first** — Immutable Memory Layer integrity takes priority in recovery ordering.
2. **Lineage preserved** — Recovery must not fabricate history as if uninterrupted live witness occurred.
3. **Additive repair** — Corrections enter as new stored facts with visible repair lineage.
4. **Orphan prevention** — Evidence and correlation without resolvable event anchors must be detectable.
5. **Rebuildable derivation** — Investigation and export caches may be rebuilt from primitives after recovery.
6. **Governance continuity** — Authorization and restriction posture must be recoverable or conservatively re-established.
7. **No silent merge** — Recovered duplicates must not collapse into ambiguous single records.

Recovery protects **investigability after harm**, not appearance of perfect uptime.

---

## 12. Scalability Principles

Scalability principles guide **growth of stored memory** without accountability collapse.

Scalability principles:

1. **Write path priority** — Admission and persistence scalability precede read convenience optimization.
2. **Layer-specific scaling** — Immutable core, evidence, and derived read layers may scale independently in physical design.
3. **Hot and cold posture** — Recent dispute-prone memory may remain more reachable than archived memory without losing lineage.
4. **Materiality gates volume** — Storage growth strategies must not incentivize low-value signal admission.
5. **Correlation laziness permitted** — Some relationships may be computed at read time if write integrity is preserved.
6. **Export isolation** — Disclosure package generation must not starve core persistence paths.
7. **Retention as scale control** — Archival and restriction are part of sustainable growth, not afterthoughts.

Scalability serves **long-horizon memory**, not infinite hoarding.

---

## 13. Integrity Principles

Integrity principles define **how stored memory remains trustworthy**.

Integrity principles:

1. **Immutable core guarantee** — Accepted assertions cannot be silently altered in storage.
2. **Identity permanence** — Canonical event identity survives moves between physical substrates.
3. **Three-time fidelity** — Occurred, recorded, and enrichment timing remain distinguishable in storage.
4. **Referential honesty** — Stored relationships resolve or declare broken posture explicitly.
5. **Tamper awareness** — Unauthorized modification must be detectable in principle across layers.
6. **Consistency of layers** — Evidence and correlation must not contradict core assertions without visible dispute posture.
7. **Governance traceability** — Sensitive reads and exports remain associable with stored authorization facts where required.

Integrity makes storage **worthy of dispute reliance**.

---

## 14. Future Physical Storage Rules

Future physical storage rules constrain **technology selection and mapping** when implementation begins. They still do not name products or schemas.

**Selection rules**

1. Must support append-only core semantics for Immutable Memory Layer.
2. Must support logical layer separation or equivalent enforceable boundaries.
3. Must support durable identity and migration without meaning drift.
4. Must support retention, restriction, and archival posture without assertion rewrite.
5. Must support governed read paths with purpose binding.
6. Must support additive evidence and correlation growth.
7. Must support rebuild of derived investigation and export artifacts.

**Forbidden physical patterns**

- using live product database as Black Box authoritative store without layer discipline
- treating analytics warehouse as immutable memory core
- storing investigation findings as overwrite updates to event core
- storing export redactions as mutations to source evidence
- choosing technology that cannot represent provisional, disputed, or restricted posture visibly

**Mapping rule**

Any physical design must publish an explicit mapping from logical storage layers in this document to physical components, demonstrating compliance with the data model and event pipeline before production admission begins.

**Technology neutrality reaffirmed**

Databases, object stores, ledger systems, and hybrid approaches may all qualify if they honor these rules. None is chosen here.

---

## 15. Closing Principles

The Technical Storage Architecture rests on a small set of enduring principles:

**Store by responsibility, not by convenience**  
Layers exist to protect meaning, not to minimize document count.

**Core is sacred**  
Immutable Memory Layer integrity outweighs read-path optimization.

**Proof links; it does not replace**  
Evidence storage supports assertions.

**Relationships narrate; they do not merge**  
Correlation storage preserves endpoints.

**Review and disclosure are derived**  
Investigation and Export layers consume; they do not redefine truth.

**Governance and retention bound power**  
Reachability changes; witness lineage remains.

**Physical choice comes last**  
This architecture must outlive any particular storage fashion.

---

## Closing Note

This document defines the **technology-independent storage architecture of the Black Box**.

Logical layers separate immutable assertions, corroboration, relationships, review containers, disclosure packages, governance control, and retention posture. Recovery, scalability, and integrity principles protect stored truth across time and failure. Future physical mapping must prove compliance before implementation proceeds. Storage technology is not chosen here. Storage discipline begins here.
