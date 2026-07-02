# RealEstateSniper Black Box — Investigation Model

Conceptual model for how **authorized investigation reconstructs truth** using events already defined across the Black Box corpus.

This document defines **how investigations are formed, scoped, correlated, evaluated, and closed** from existing institutional memory. It does not define new event classes, repeat functional catalogs, or prescribe implementation.

For constitutional investigation obligations, see `BLACK_BOX_CONSTITUTION.md`.  
For investigation governance rules, see `BLACK_BOX_GOVERNANCE.md`.  
For event meaning, correlation, and timeline thinking, see `BLACK_BOX_EVENT_MODEL.md`.  
For evidence custody and retention posture, see `BLACK_BOX_RETENTION_AND_EVIDENCE_POLICY.md`.  
For domain event meaning, see the functional catalogs and `BLACK_BOX_EVENT_CATALOG.md`.

---

## 1. Purpose

The Investigation Model exists so that RealEstateSniper can **answer hard questions about what happened** without improvising a new memory language each time trust is challenged.

Its purpose is to answer:

- How does an investigation begin from a question rather than from a screen?
- Which existing events from which domains must be gathered to reconstruct truth?
- How do timeline, correlation, causality, contradiction, and trust posture combine into a defensible finding?
- How does investigation end without rewriting history or confusing review with product correction?

Investigation is not a new event domain. It is the **governed method of reading** what the Black Box already preserves.

---

## 2. Investigation Philosophy

Investigation philosophy treats institutional memory as **a witness under governance**, not as a database to browse.

Philosophy principles:

1. **Question before collection** — Investigation starts from accountability need, not from ambient access to memory.
2. **Events are atoms** — Each registered event class asserts one layer of truth. Investigation composes stories from atoms; it does not melt them together.
3. **Reconstruction, not editing** — Investigators interpret and correlate; they do not correct live state or rewrite accepted assertions.
4. **Parallel truth preserved** — Platform facts, external authority facts, communication facts, and operator actions remain distinguishable in the same story.
5. **Gaps are visible** — Missing emission, delayed enrichment, or provisional posture must remain explainable rather than papered over.
6. **Minimum necessary disclosure** — Investigation gathers what the question requires, not everything the platform ever recorded.
7. **Closure without certainty theater** — A closed investigation may conclude with bounded confidence, unresolved contradiction, or need for further domain fact — not forced false completeness.

Investigation serves users, owners, investors, operators, counsel, auditors, and regulators by making **composed truth legible** from domain-separated memory.

---

## 3. Investigation Lifecycle

Investigation lifecycle describes **the conceptual stages** from opening accountability review to governed closure.

**Recognition**  
A material question arises: dispute, audit request, incident review, support escalation, legal inquiry, or internal governance concern. Recognition does not require a technical case identifier; it requires a stated accountability need.

**Authorization**  
An authorized role confirms that investigation may proceed under governed purpose, sensitivity expectations, and access boundaries.

**Scoping**  
Investigators define what the question concerns — actor, property, purchase, owner case, admin action, security incident, factory output, external boundary episode, or cross-domain journey — and which domain layers may be relevant.

**Collection**  
Existing events and linked evidence from relevant functional catalogs are gathered within scope. Collection follows domain boundaries; it does not invent unified records.

**Correlation**  
Separate events are linked into a narrative without merging their classes. Correlation expresses shared journey, shared subject, shared episode, or shared external sequence.

**Timeline construction**  
Events are ordered by occurred time, recorded time, and enrichment arrival where timing affects interpretation. Concurrency and delay are made visible.

**Evaluation**  
Investigators assess causality cautiously, surface contradictions, and apply trust posture thinking to what the composed story supports.

**Packaging**  
When disclosure outside the review boundary is required, a governed evidence package is assembled with redaction and explicit omission rules.

**Closure**  
The investigation episode ends with a bounded finding, documented unresolved areas, or referral to another governed process. Closure does not alter source events.

Lifecycle may revisit earlier stages when new material facts enter memory or when scope was too narrow. Reopening is a governance-visible act, not informal re-browsing.

---

## 4. Investigation Scope

Investigation scope defines **what the question includes and excludes** before collection begins.

**Scope anchors**

Scope may anchor on:

- a participant or actor journey
- an owner or property participation case
- a purchase, payment, or entitlement sequence
- a marketplace or opportunity episode
- a verification or document review path
- an administrative intervention chain
- a security or system incident episode
- a factory, pipeline, or enrichment production chain
- an external integration boundary sequence
- a communication or legal notice episode

**Scope discipline**

- Scope must be **narrow enough** to prevent unbounded memory exposure.
- Scope must be **broad enough** to include domains that materially participated in the outcome under review.
- Scope must name **excluded domains** when the question does not require them, to prevent accidental over-collection.
- Scope must distinguish **the triggering question** from **adjacent curiosity**.

**Scope expansion**

When collection reveals that the original scope cannot answer the question, expansion requires explicit authorization. Silent scope creep is a governance failure.

**Scope and catalogs**

Each functional catalog owns a layer of truth. Scope tells investigators **which layers to read**, not which layer replaces the others.

---

## 5. Evidence Correlation

Evidence correlation connects **event assertions to corroborating material** without turning investigation into a file dump.

Evidence correlation principles:

1. **Assertion first** — The event remains the primary institutional fact; evidence strengthens or weakens defensibility around it.
2. **Linkage, not replacement** — Documents, receipts, external confirmations, and communication references support events; they do not silently become the event.
3. **Per-domain evidence posture** — Each catalog describes what evidence may attach conceptually to its families. Investigation respects those boundaries.
4. **Custody awareness** — Evidence correlation must remain traceable from origin through review and any export.
5. **Visible absence** — When expected evidence is missing, delayed, redacted, or withheld under policy, investigation records that gap as part of the story.

Investigators correlate evidence to answer whether an assertion is **defensible**, not merely whether a screen once showed a value.

---

## 6. Timeline Reconstruction

Timeline reconstruction orders **how truth unfolded as it mattered**, not merely how records arrived.

Timeline principles:

**Three time layers**

- **Occurred time** — when the platform believes the fact happened in the world
- **Recorded time** — when the fact entered institutional memory
- **Enrichment time** — when explanation, evidence, or trust posture arrived later

**Ordering rules**

- Timelines may present multiple valid orderings when timing is uncertain; uncertainty must be visible.
- Delay between occurrence and recording may change how earlier facts should be interpreted.
- Late-arriving enrichment must not be presented as if it existed at occurrence unless investigation explicitly states that dependency.
- Concurrent events in different domains may appear parallel when they genuinely overlapped.

**Timeline scopes**

Timelines may be built for actor, case, payment flow, admin chain, incident episode, factory run, or full cross-domain dispute. Scope determines which events enter the timeline.

**Timeline limits**

A timeline is an investigator view. It must not hide provisional assertions, superseded outputs, withdrawn publications, or reversed overrides that remain in memory.

Timeline reconstruction turns scattered domain facts into **readable sequence** without collapsing them into one timestamped blob.

---

## 7. Cross-Domain Correlation

Cross-domain correlation links **separate catalog truths** that participated in the same real-world outcome.

Correlation patterns include:

- authentication and account posture preceding marketplace or purchase action
- owner journey events correlating with property, document, and verification events
- purchase and payment events correlating with external integration authority signals
- factory, pipeline, engine, and enrichment events correlating with marketplace publication
- admin override correlating with domain outcome it affected
- notification events corroborating that a participant was informed
- security or system conditions contextualizing whether other facts were fairly possible
- legal acceptance correlating with participation or commercial gates

**Correlation rules**

- Each event keeps its native class and domain identity.
- Correlation expresses relationship, not merger.
- Investigators state **why** events are linked — shared subject, shared episode, shared handoff, or shared external trigger.
- Correlation must not invent facts that no event class asserts.

Cross-domain correlation is how investigation tells a whole story while **preserving layer discipline** established by the catalogs.

---

## 8. Causality

Causality in investigation means **reasoned explanation of how one fact may have led to another**, not automatic inference from sequence alone.

Causality principles:

1. **Sequence is not proof** — Earlier events suggest context; they do not alone prove later events were caused by them.
2. **Domain-native causality first** — Factory causality lives in factory memory; admin causality in admin memory; external authority causality at integration boundary. Investigation respects native layers before composing cross-layer claims.
3. **Visible intermediates** — When causality spans domains, intermediate handoffs, gates, overrides, and failures should appear in the chain where catalogs place them.
4. **Alternative explanations** — Investigation must tolerate multiple plausible causal paths when memory does not resolve them.
5. **No silent automation blame** — Machine output, operator action, and external authority remain distinguishable causal actors.

Investigators produce **causal hypotheses** supported by correlated events, not single-line inevitability narratives.

---

## 9. Contradictions

Contradictions occur when **related events or evidence do not align** without an explicit reconciliation fact.

Contradiction principles:

1. **Contradiction is memory, not error to hide** — Conflicting assertions, provisional versus final posture, platform versus external authority mismatch, and admin override of automated outcome are investigable tensions.
2. **Do not auto-resolve** — Investigation must not pick a winner by convenience when catalogs preserve both facts.
3. **Search for reconciliation events** — Sync reconciliation, recovery, override reversal, reverification, and external authority reconciliation may explain apparent conflict.
4. **State uncertainty explicitly** — When contradiction remains after review, closure should say so.
5. **Distinguish contradiction types** — Timing disagreement, semantic disagreement, authority disagreement, and completeness disagreement require different reading.

Contradiction handling protects investigation credibility. A story that flattens conflict is weaker than one that shows it.

---

## 10. Trust Evaluation

Trust evaluation assesses **how strongly the composed story can be relied upon** given event posture, evidence, delay, and contradiction.

Trust evaluation considers:

- whether assertions were provisional, confirmed, or disputed at the time under review
- whether enrichment or evidence arrived before or after consequential decisions
- whether external authority, admin action, or automated output was the deciding layer
- whether security, system, or integration conditions weakened reliability of concurrent facts
- whether communication events corroborate awareness where disputes require it
- whether missing emission in an expected domain creates an explainable gap or a serious blind spot

Trust evaluation is **not a new score system**. It is disciplined reading of trust posture already implied by event classes, evidence linkage, and catalog boundaries.

Investigators distinguish:

- what memory **proves**
- what memory **supports**
- what memory **suggests**
- what memory **does not establish**

Trust evaluation prevents investigation findings from sounding more certain than institutional memory allows.

---

## 11. Evidence Packages

Evidence packages are **governed outputs** of investigation for disclosure beyond the normal review boundary.

Package principles:

1. **Purpose-bound** — Every package serves a stated recipient need: counsel, auditor, regulator, partner, or formal dispute party.
2. **Scoped selection** — Packages include events and linked evidence required for the question, not full platform memory.
3. **Redaction and omission discipline** — Sensitive material is minimized, referenced, or omitted under explicit rules; omission itself may be documented.
4. **Traceable assembly** — Who authorized the package and what scope it carried must remain accountable.
5. **Non-mutation** — Package creation does not alter source events or evidence custody records.
6. **Interpretive boundary** — Packages present composed facts and bounded findings; they do not replace legal judgment or product remediation.

Evidence packages translate investigation into **shareable accountability artifacts** without turning export into bulk backup or surveillance dump.

---

## 12. Investigation Closure

Investigation closure ends an accountability episode with **governed finality**.

Closure may take several forms:

- **Resolved finding** — The question is answered within scope with stated confidence.
- **Bounded finding with open gaps** — Material uncertainty or missing memory remains explicitly documented.
- **Referral** — The question requires another governed process: legal review, admin action, security response, verification, or external authority reconciliation.
- **Scope insufficient** — The original scope could not support a fair answer; closure records that limitation rather than guessing.

Closure principles:

- Closure does not delete, amend, or re-emit historical events.
- Closure does not imply product state was corrected unless a separate domain fact says so.
- Significant investigations should leave appropriate governance-visible traces that review occurred.
- Reopening requires new authorization when new facts, new scope, or failed prior closure demand it.

Investigation closure marks the end of **interpretive work**, not the end of institutional memory.

---

## 13. Governance

Investigation governance ensures that reading memory remains **as disciplined as writing memory**.

Governance principles:

1. **Authorized purpose** — Investigation requires role authority and stated accountability need.
2. **Least-privilege access** — Reviewers receive minimum necessary scope, not ambient browsing rights.
3. **Separation from operation** — Investigators reconstruct; operators act. The boundary must not blur under urgency.
4. **Export control** — Evidence packages follow authorization, redaction, and traceability rules.
5. **No retroactive taxonomy edits** — Investigation discomfort must not drive silent renaming of event classes.
6. **Auditability of review** — Sensitive investigation and export activity must remain governable and attributable where policy requires.

**Governance questions for investigation practice**

- Is the scope narrow, sufficient, and authorized?
- Are domains being correlated without merge?
- Are contradictions visible rather than flattened?
- Is trust language weaker than the evidence supports — never stronger?
- Does closure respect immutability and bounded confidence?

Investigation governance connects this model to `BLACK_BOX_GOVERNANCE.md` without duplicating its full authority structure.

---

## 14. Future Evolution

Investigation model evolution may refine **how truth is read**, never by inventing substitute memory.

**Allowed evolution**

- Clearer scope templates for recurring dispute types without becoming concrete case designs
- Finer guidance on multi-time-layer timelines as delayed enrichment grows
- Stronger package assembly principles as legal and regulatory needs mature
- Better articulation of cross-domain correlation patterns as catalogs expand

**Evolution requirements**

Every proposed investigation-model change must answer:

1. Does it improve reconstruction without creating new event classes?
2. Does it preserve domain separation established by catalogs?
3. Does it strengthen contradiction visibility and trust discipline?
4. Does it keep investigation distinct from product correction and memory mutation?
5. Does it remain usable by counsel and auditors without implementation leakage?

**Disallowed evolution**

- Defining new event classes inside the investigation model
- Treating investigation views as authoritative replacements for domain events
- Collapsing catalogs into one investigative schema for convenience
- Allowing export or review to rewrite accepted assertions
- Turning investigation into undifferentiated full-memory search

Amendments to this model require governance review alongside the constitutional and catalog corpus. Reviewer convenience is not sufficient justification.

---

## 15. Closing Principles

The Investigation Model rests on a small set of enduring principles:

**Memory is layered**  
Authentication, account, legal, marketplace, purchase, payment, founder, owner, property, document, verification, admin, factory, engine, pipeline, enrichment, notification, security, system, and integration domains each own a slice of truth. Functional catalogs express those layers where defined. Investigation composes across layers; it does not bake a new cake.

**Events are already defined**  
Investigation never needs a parallel vocabulary. It needs disciplined scope, correlation, timeline, causality, contradiction, and trust reading.

**Truth is reconstructed, not manufactured**  
If the answer is not in memory, investigation must say so. Inventing comfort is worse than reporting a gap.

**Parallel witnesses remain witnesses**  
Platform assertion, external authority, operator action, communication delivery, and machine output may all speak in one story without becoming one voice.

**Closure is honest**  
A closed investigation may be confident, cautious, or incomplete. It may not pretend history was edited to match the finding.

**Governance travels with review**  
Reading sensitive memory is a privileged act. Investigation inherits the same seriousness as emission.

---

## Closing Note

This model defines **how RealEstateSniper investigates using the Black Box**.

Functional catalogs declare what facts may exist. The Investigation Model declares how those facts are gathered, ordered, linked, tested, packaged, and closed into accountable understanding. Implementation of viewers, exporters, and case tools comes later. The method of truth reconstruction begins here.
