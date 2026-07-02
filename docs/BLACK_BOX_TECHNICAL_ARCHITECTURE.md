# RealEstateSniper Black Box — Technical Architecture

High-level technical architecture for translating the **conceptual Black Box corpus** into a buildable system shape without prescribing implementation.

This document defines **layers, boundaries, flows, and technical responsibilities** that future implementation must honor. It does not define storage schemas, interfaces, transport, infrastructure products, or code.

For conceptual system shape, see `BLACK_BOX_ARCHITECTURE.md`.  
For event meaning and lifecycle, see `BLACK_BOX_EVENT_MODEL.md`.  
For investigation method, see `BLACK_BOX_INVESTIGATION_MODEL.md`.  
For export discipline, see `BLACK_BOX_EXPORT_MODEL.md`.  
For build order, see `BLACK_BOX_IMPLEMENTATION_ROADMAP.md`.  
For memory protection, see `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Technical Architecture exists to bridge **design corpus and future implementation** without collapsing them into one another.

Its purpose is to answer:

- What technical layers compose the Black Box as a system?
- How do responsibilities separate between product domains and institutional memory?
- How do events, evidence, investigation, and export move through the architecture?
- What trust boundaries and scalability constraints must implementation respect from day one?

This document translates meaning into **system structure**. It does not choose databases, languages, or deployment shapes.

---

## 2. Technical Architecture Philosophy

Technical architecture philosophy treats the Black Box as **infrastructure for accountability memory**, parallel to but separate from live product operation.

Philosophy principles:

1. **Concept leads structure** — The thirty-document design corpus defines what the system must express; technical layers express how capability is divided.
2. **Append-only core** — Accepted assertions enter durable memory without in-place rewrite.
3. **Loose coupling inward** — Product domains signal truth; they do not own memory internals.
4. **Read paths are secondary** — Investigation and export consume memory; they do not define admission.
5. **Layer honesty** — Domain-separated truth remains separated in technical structure, not only in documentation.
6. **Failure isolation** — Intake, enrichment, or read-path failure must not corrupt accepted memory.
7. **Evolution without erasure** — Technical change may add capability; it may not launder historical meaning.

Technical architecture serves investigators, auditors, counsel, and regulators by making **reconstructible truth technically possible** — not by maximizing data volume.

---

## 3. Architectural Layers

The Black Box composes **ten high-level technical layers**. Each layer is a responsibility zone, not a product module name.

**Layer 1 — Platform Domain Emission**  
Authoritative recognition of material facts inside RealEstateSniper product domains.

**Layer 2 — Emission Boundary**  
Controlled handoff from domain truth to institutional memory intake.

**Layer 3 — Intake and Admission**  
Reception, validation, and decision to accept, hold provisional, or reject governed signals.

**Layer 4 — Normalization and Classification**  
Translation into shared investigable event language while preserving domain meaning.

**Layer 5 — Immutable Memory Core**  
Durable append-only preservation of accepted assertions and lineage.

**Layer 6 — Enrichment and Evidence Attachment**  
Additive explanation, trust posture evolution, and linked corroboration.

**Layer 7 — Correlation and Relationship**  
Cross-event linkage without event merger.

**Layer 8 — Investigation Services**  
Scoped reconstruction, timeline assembly, and bounded review workflows.

**Layer 9 — Export Services**  
Governed package composition and disclosure control.

**Layer 10 — Access and Governance Control**  
Authorization, policy enforcement, and accountability over read and export paths.

Layers are **logical**. Physical deployment may colocate responsibilities later; logical separation must remain intelligible.

---

## 4. Responsibility Separation

Responsibility separation defines **who owns what** across platform and Black Box boundaries.

**Platform domains own**

- business decisions and live state transitions
- authoritative recognition that a material fact occurred
- emission of governed signals at decision points
- correlation context sufficient for later investigation

**Black Box layers own**

- admission discipline and immutable preservation
- shared event language across domains
- enrichment, evidence linkage, and relationship structure
- investigation, export, and access governance over memory

**Admin and operator surfaces own**

- authorized presentation of memory
- never the definition, mutation, or prerequisite of recording

**External systems own**

- parallel authority at integration boundary
- not internal product semantics

**Forbidden merges**

- live operational state treated as historical truth
- investigation views treated as correction mechanisms
- export treated as backup or analytics extraction
- monitoring telemetry treated as institutional events without materiality review

Separation keeps product agility and memory integrity from destroying each other.

---

## 5. Data Flow Principles

Data flow principles describe **how information moves** without specifying transport or storage.

Flow principles:

1. **Inward at authority** — Material facts cross into memory at recognition points, not at display points.
2. **One primary assertion per admission** — Duplicate meaning from replay must be prevented by design intent.
3. **Additive downstream** — Explanation and evidence may arrive after core assertion without rewriting it.
4. **Outward only through governance** — Memory leaves the protected boundary only via authorized investigation or export paths.
5. **Reference over duplication** — Sensitive corroboration prefers linkage to external custody where possible.
6. **Visible rejection** — Invalid or ungoverned signals are blocked or quarantined with accountability, not silently dropped.
7. **No reverse dependency** — Product flows must not block on read-path availability; emission failure must not invent silent omission where materiality demands signal.

Data flow is **directional and purposeful**, not omnidirectional browsing.

---

## 6. Event Flow Principles

Event flow describes **the technical path of a material fact** from recognition to investigability.

**Recognition**  
A platform domain identifies that a registry-aligned event class should be signaled.

**Emission**  
The domain passes a governed signal across the emission boundary with attribution and correlation context.

**Intake**  
The Black Box receives the signal, preserves arrival context, and acknowledges reception without yet treating it as fully mature memory.

**Validation**  
Structural coherence, category fit, actor plausibility, and source authority are checked. Provisional admission is allowed when policy requires preservation before full validation.

**Normalization**  
The signal receives shared investigable classification while retaining domain-native identity.

**Persistence**  
Accepted assertion enters immutable memory core with occurred time, recorded time, and initial trust posture.

**Enrichment eligibility**  
The assertion becomes eligible for additive explanation, evidence links, correlation, investigation views, and export packaging.

Event flow must tolerate **delay, out-of-order arrival, and provisional posture** without corrupting prior truth.

---

## 7. Evidence Flow Principles

Evidence flow describes **how corroboration attaches** to accepted assertions.

Evidence flow principles:

1. **Assertion precedes proof** — Evidence links to existing memory; it does not create substitute assertions silently.
2. **Late arrival is normal** — Proof may follow the core fact by seconds or months.
3. **Custody preserved** — Evidence movement through review and export remains traceable conceptually.
4. **Sensitivity-aware path** — High-sensitivity material receives stricter minimization in movement and packaging.
5. **Confidence evolution visible** — Trust posture may change when evidence strengthens or weakens defensibility.
6. **Absence representable** — Missing expected proof must remain investigable as gap, not as false certainty.

Evidence flow strengthens memory; it does not replace the event catalogs' domain-specific evidence posture.

---

## 8. Investigation Flow Principles

Investigation flow describes **how authorized review consumes memory** without mutating it.

Investigation flow stages:

**Authorization** — purpose and role validated  
**Scoping** — domains, actors, episodes, and time boundaries selected  
**Collection** — relevant assertions and evidence links retrieved within scope  
**Correlation assembly** — relationships materialized as narrative context without class merger  
**Timeline construction** — occurred, recorded, and enrichment ordering applied  
**Evaluation** — causality, contradiction, and trust posture assessed  
**Closure** — bounded finding or referral recorded as review outcome, not as source-memory edit

Investigation flow may cycle when scope expands under new authorization. It must never write back corrections into immutable core except through **new governed assertions** in product domains, not through investigation tooling.

---

## 9. Export Flow Principles

Export flow describes **how disclosure artifacts are composed** from investigation-ready memory.

Export flow stages:

**Authorization** — recipient class, purpose, and scope approved  
**Selection** — assertions and evidence links chosen under minimum necessary disclosure  
**Composition** — domain-native facts assembled with optional bounded findings  
**Redaction** — minimization applied to disclosure artifact only  
**Integrity packaging** — custody and assembly accountability attached to the output  
**Transfer** — governed handoff to authorized recipient context  
**Restriction enforcement** — withheld or delayed disclosure remains policy-visible where required

Export flow consumes investigation discipline. It does not bypass scope, redaction, or source-memory immutability.

---

## 10. Trust Boundaries

Trust boundaries define **where technical trust changes character**.

**Boundary A — Product domain to emission**  
Domain asserts truth; emission must be honest to registry classes.

**Boundary B — Emission to intake**  
Untrusted or malformed signals stop here or enter provisional/quarantine posture.

**Boundary C — Admission to immutable core**  
Only governed accepted assertions cross into durable memory.

**Boundary D — Memory core to enrichment**  
Enrichment may deepen meaning; it may not overwrite assertion.

**Boundary E — Memory to investigation**  
Read authorization required; investigation cannot mutate core.

**Boundary F — Investigation to export**  
Broader disclosure requires explicit re-authorization beyond review scope.

**Boundary G — Memory to external recipient**  
Disclosure artifact leaves platform control under custody rules.

**Boundary H — Platform security to memory security**  
Platform protection and memory protection align but remain distinguishable responsibilities.

Trust boundary failure occurs when any layer **skips inward validation** or **treats outward copies as new source truth**.

---

## 11. Cross-Domain Relationships

Cross-domain relationships describe **how technical correlation respects catalog boundaries**.

Relationship types:

- **Journey linkage** — shared actor or participant across authentication, account, marketplace, and purchase flows
- **Case linkage** — owner, property, document, and verification participation in one trust episode
- **Commercial linkage** — purchase, payment, and integration authority sequences
- **Automation linkage** — factory, engine, pipeline, and enrichment production chains
- **Governance linkage** — admin action correlated with domain outcomes affected
- **Communication linkage** — notification corroboration of awareness
- **Protection linkage** — security and system conditions contextualizing other facts
- **Boundary linkage** — integration signals parallel to platform assertions

Technical correlation stores **relationships as first-class structure**, not as merged documents. Each endpoint event retains independent identity and domain classification.

---

## 12. Scalability Principles

Scalability principles guide **growth without accountability collapse**.

Scalability principles:

1. **Volume is not virtue** — Materiality gates admission; scale strategies must not incentivize noise.
2. **Append-only favors reconstruction** — Write patterns should favor durable insertion over mutable churn.
3. **Read scaling is separate** — Investigation and export scale independently from admission path.
4. **Domain rollout is incremental** — High-trust domains first; breadth follows proven discipline.
5. **Correlation laziness is acceptable** — Some relationships may materialize at investigation time if admission integrity is preserved.
6. **Retention shapes scale** — Archival and restriction are part of scalability, not afterthoughts.
7. **Hot versus cold memory** — Recent dispute-prone memory may receive different availability posture than archived memory without erasing lineage.

Scalability serves **decades-long investigability**, not real-time dashboard vanity.

---

## 13. Security Principles

Security principles translate **memory security** into technical posture without defining controls implementation.

Security principles:

1. **Integrity of accepted core** — Highest protection target is immutable assertion layer.
2. **Least privilege on read** — Investigation and export authorized by purpose, not by role alone.
3. **Separation of duties** — Operators of live state do not gain unchecked memory dominion by default.
4. **Sensitive path isolation** — Evidence attachment, review, and export are security-relevant operations.
5. **No silent suppression** — Security blocks and quarantine remain representable where policy requires.
6. **Provenance preservation** — Technical paths must support answering how a fact entered memory.
7. **Export is exfiltration class** — Disclosure receives scrutiny comparable to high-risk data movement.

Security protects the **witness function** of the Black Box, not merely its servers.

---

## 14. Technical Evolution Principles

Technical evolution principles govern **how the architecture may change** after initial build.

Evolution principles:

1. **Registry before runtime drift** — New event classes require governed registry change before broad emission.
2. **Additive extension preferred** — New layers or capabilities extend memory; they do not rewrite old assertions.
3. **Backward investigability** — Changes must not destroy ability to read prior memory fairly.
4. **Interface independence** — Presentation and export mechanisms may evolve without changing admitted meaning.
5. **Migration is conceptual discipline** — Moving between technical substrates must preserve assertion lineage and identity.
6. **Phase respect** — Implementation roadmap order remains binding; tooling must not skip recording discipline.
7. **Design corpus supremacy** — Technical choices that contradict constitutional or catalog meaning are invalid regardless of convenience.

Technical evolution serves **long institutional memory**, not sprint-local optimization.

---

## 15. Closing Principles

The Technical Architecture rests on a small set of enduring principles:

**Structure serves meaning**  
Layers exist to protect the design corpus, not to impress with complexity.

**Write path is sacred**  
Admission and immutable core deserve the strictest architectural care.

**Read path is governed**  
Investigation and export are powerful because memory is real, not because access is easy.

**Domains stay domains**  
Technical correlation must not become semantic collapse.

**Evidence enriches; it does not replace**  
Proof links to truth; it does not silently become truth.

**Boundaries are features**  
Trust boundaries are architectural assets, not inconveniences.

**Implementation comes later**  
This document defines shape and flow discipline — not the machinery that will eventually express them.

---

## Closing Note

This document is the **first artifact of the technical architecture phase**.

The conceptual corpus defines what the Black Box must mean. The Implementation Roadmap defines in what order capability should arrive. This Technical Architecture defines **how responsibilities and flows should be arranged** so that future implementation has a coherent system to build. Storage, interfaces, and runtime choices belong to later technical documents — not to this one.

Technical architecture begins here. Implementation detail follows only when this shape is accepted.
