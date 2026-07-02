# RealEstateSniper Black Box — Implementation Roadmap

Conceptual roadmap for **the order in which the Black Box should be built in the future**, after design is established.

This document defines **implementation strategy by phases**, not technical architecture, storage, interfaces, or code. It describes what capability must exist before the next phase may responsibly begin.

For constitutional obligations, see `BLACK_BOX_CONSTITUTION.md`.  
For system shape and component responsibilities, see `BLACK_BOX_ARCHITECTURE.md`.  
For investigation method, see `BLACK_BOX_INVESTIGATION_MODEL.md`.  
For export discipline, see `BLACK_BOX_EXPORT_MODEL.md`.  
For governance authority, see `BLACK_BOX_GOVERNANCE.md`.

---

## 1. Purpose

The Implementation Roadmap exists so that future Black Box work **proceeds in a defensible order** rather than jumping to viewers, dashboards, or convenience features before memory is reliable.

Its purpose is to answer:

- What must exist before event recording is trustworthy?
- When may evidence, investigation, and export responsibly begin?
- How does platform integration roll out without fragmenting accountability language?
- What does done mean for each phase before the next begins?

The roadmap is strategic sequencing only. It does not prescribe how any phase is built.

---

## 2. Roadmap Philosophy

Roadmap philosophy treats the Black Box as **institutional memory infrastructure**, not as a feature bolted onto the product after launch pressure.

Philosophy principles:

1. **Design before build** — Constitutional, architectural, catalog, and model documents establish meaning before implementation choices.
2. **Recording before reading** — Truth must enter memory reliably before investigation or export matter.
3. **Assertion before enrichment** — Core facts must survive even when explanation or evidence arrives later.
4. **Domain honesty first** — Emit under correct domain layers before optimizing cross-domain views.
5. **Governance travels with capability** — Each phase opens new power; each phase must bring matching accountability discipline.
6. **Admin is last in dependency, not first in priority** — Operator viewports consume memory; they do not define it.
7. **No phase skips accountability** — Dashboards, alerts, and summaries are not substitutes for durable event truth.

The roadmap assumes the **design corpus** — constitution, architecture, event model, naming, schema principles, governance, security, integration, retention, master catalog, functional catalogs, investigation model, and export model — is the foundation for all implementation phases below.

---

## 3. Phase 1 — Foundation

Phase 1 establishes **shared meaning and authority** before any runtime Black Box capability exists.

**Objective**  
Align the platform on what the Black Box is, what it is not, which domains exist, and how event classes are governed.

**Conceptual outcomes**

- Constitutional and architectural commitments are accepted as binding.
- Event model, naming standard, and schema principles guide all future emission and intake decisions.
- Master catalog and functional catalogs define domain boundaries and conceptual event families.
- Investigation and export models define how memory will later be read and disclosed.
- Governance, security, integration, and retention policies set non-negotiable constraints.

**What Phase 1 is not**  
Foundation is not product coupling, storage choice, or operator UI. It is the **meaning layer** implementation will obey.

**Exit posture**  
The platform can answer what must be recorded, under which domain, with what boundaries — without yet recording at scale.

---

## 4. Phase 2 — Event Recording

Phase 2 establishes **reliable admission and preservation of material facts**.

**Objective**  
Material events enter institutional memory at authoritative recognition points and remain durable, attributable, and immutable in assertion.

**Conceptual outcomes**

- Domain producers recognize facts where truth is decided, not where screens render.
- Intake admits governed event classes without requiring Admin or investigation tooling.
- Records preserve occurred time, recorded time, actor attribution, domain classification, and initial trust posture.
- Failed or provisional admissions remain visible rather than silently dropped.
- High-trust domains begin first — typically authentication, account, legal acceptance, purchase and payment, and admin action — before automation-heavy domains expand.

**Dependency**  
Phase 1 meaning must be stable enough that emission uses registry-aligned classes and domain boundaries.

**Exit posture**  
Investigators could reconstruct basic timelines from recorded facts alone, even without rich evidence or export tooling.

---

## 5. Phase 3 — Evidence

Phase 3 establishes **linked corroboration** without replacing core assertions.

**Objective**  
Evidence attaches to events and cases with custody thinking, proportionality, and visible absence when proof is missing or delayed.

**Conceptual outcomes**

- Evidence links support dispute defensibility without embedding sensitive material recklessly.
- Additive enrichment and explanation deepen meaning without rewriting original assertions.
- Cross-references to documents, external confirmations, and related events become investigable.
- Retention and restriction posture for evidence aligns with event retention policy.
- Trust posture may evolve visibly as evidence arrives.

**Dependency**  
Phase 2 must record assertions reliably. Evidence without assertions is orphan material.

**Exit posture**  
A material dispute can be supported with assertion-plus-proof chains, not assertion alone.

---

## 6. Phase 4 — Investigation

Phase 4 establishes **governed reconstruction** of truth from recorded memory.

**Objective**  
Authorized reviewers can scope, correlate, timeline, evaluate causality, surface contradiction, and close bounded investigations without rewriting history.

**Conceptual outcomes**

- Investigation proceeds through bounded cases with stated purpose and scope.
- Cross-domain correlation preserves layer discipline established by catalogs.
- Timelines express occurred, recorded, and enrichment time where interpretation requires it.
- Contradictions and gaps remain visible in findings.
- Investigation closure produces bounded outcomes without mutating source events.

**Dependency**  
Phases 2 and 3 must provide enough memory density for reconstruction to be meaningful. Investigation without records is theater.

**Exit posture**  
Internal audit, support escalation, and dispute preparation can be conducted as governed review, not as ad hoc database browsing.

---

## 7. Phase 5 — Export

Phase 5 establishes **governed disclosure** outside the normal review boundary.

**Objective**  
Authorized packages may be composed for counsel, auditors, regulators, formal dispute parties, and governed support paths without betraying immutability or proportionality.

**Conceptual outcomes**

- Export requires explicit authorization, scope, and recipient discipline.
- Composition preserves domain-native assertions and parallel truth.
- Redaction and omission follow minimum necessary disclosure.
- Chain of custody and export integrity remain defensible if challenged.
- Export does not mutate source memory or become bulk backup behavior.

**Dependency**  
Phase 4 investigation method should be mature enough to know what belongs in a package. Export without investigation discipline invites dumps.

**Exit posture**  
The platform can hand off defensible accountability material externally under control.

---

## 8. Phase 6 — Governance

Phase 6 establishes **operating governance** over memory, access, taxonomy change, and sensitive review.

**Objective**  
Black Box power is stewarded through ownership, registry discipline, access rules, investigation oversight, legal alignment, and auditability of governance itself.

**Conceptual outcomes**

- Registry changes follow governed proposal and review, not local dialect drift.
- Access, investigation, and export operate under least-privilege purpose binding.
- Legal, retention, and restriction rules are applied consistently across domains.
- Significant review and export leave appropriate governance-visible traces.
- Constitutional non-negotiables cannot be bypassed by operational urgency.

**Dependency**  
Phases 2 through 5 create the capabilities governance must constrain. Governance is not a substitute for them.

**Exit posture**  
The Black Box behaves as platform infrastructure under institutional control, not as an informal internal tool.

---

## 9. Phase 7 — Platform Integration

Phase 7 expands **domain participation** across RealEstateSniper until accountability memory covers the full designed surface.

**Objective**  
Remaining domains emit material facts at authoritative points with loose coupling to product behavior.

**Conceptual outcomes**

- Owner, property, document, verification, marketplace, and founder paths participate where trust-sensitive.
- Factory, engine, pipeline, enrichment, notification, security, system, and integration domains emit machine and boundary truth without telemetry noise.
- Integration model principles are honored: emit at source, correlate generously, fail without silent omission where material.
- Cross-domain journeys become reconstructible end to end.
- Product flows never depend on Black Box availability in ways that corrupt user experience or hide omission.

**Dependency**  
Phases 2 through 6 must be stable enough that expanding emission does not fragment taxonomy or overwhelm immature review capability.

**Exit posture**  
The platform's designed accountability surface is represented in memory, not only its highest-risk subset.

---

## 10. Phase 8 — Operational Hardening

Phase 8 establishes **long-term resilience** of institutional memory under production pressure.

**Objective**  
The Black Box remains trustworthy through scale, incident, personnel change, and external challenge.

**Conceptual outcomes**

- Security model protections for memory integrity, confidentiality, and probative value are operationalized conceptually through process and control, not merely documented.
- Retention, restriction, archival, and legal hold behavior remain coherent under stress.
- Failure isolation prevents intake or enrichment problems from corrupting prior truth.
- Recovery after outage or compromise preserves investigability of what occurred.
- Operational metrics do not replace institutional events or dilute materiality standards.

**Dependency**  
All prior phases must exist in meaningful form. Hardening an empty or dishonest memory layer is meaningless.

**Exit posture**  
The Black Box remains defensible years later — in dispute, audit, regulatory inquiry, and leadership review.

---

## 11. Phase Dependencies

Phase dependencies express **what must not be skipped**.

**Strict sequence**

- Foundation precedes all implementation.
- Event recording precedes evidence, investigation, export, and broad integration.
- Evidence precedes investigation and export that claim defensibility.
- Investigation precedes export that claims composed understanding.
- Governance runs alongside capability expansion and must tighten as power grows.
- Platform integration broadens emission only after core recording discipline is proven.
- Operational hardening caps the roadmap once real memory exists.

**Parallel work allowed**

- Governance policy refinement may proceed alongside early recording design.
- Low-risk domain catalog stewardship may continue while high-trust domains record first.
- Investigation and export model refinement may precede their runtime phases.

**Forbidden shortcuts**

- Admin viewport before reliable recording
- Export before scope and redaction discipline
- Dashboards before domain-honest emission
- Full-platform emission before registry and intake maturity
- Operational metrics masquerading as institutional memory

Dependencies protect the institution from **appearance of accountability without substance**.

---

## 12. Risks

Roadmap risks describe **how implementation can fail** even with good intentions.

**Memory risks**

- Recording noise instead of material facts
- Collapsing domain layers for developer convenience
- Silent omission when intake fails
- Rewriting history instead of additive correction

**Power risks**

- Export used as surveillance or bulk backup
- Investigation without scope becoming ambient browsing
- Admin viewport mistaken for the Black Box itself
- Operator urgency bypassing governance

**Sequencing risks**

- Building viewers before assertions exist
- Integrating all domains before high-trust paths are reliable
- Treating external webhooks as platform truth without boundary discipline

**Organizational risks**

- No steward for registry hygiene
- Product teams inventing local event dialects
- Legal or security review only after harmful exposure
- Design corpus ignored under delivery pressure

**Mitigation posture**

Risks are mitigated by honoring phase order, registry discipline, governance visibility, and constitutional non-negotiables — not by adding tooling first.

---

## 13. Success Criteria

Success criteria define **when the roadmap has achieved its purpose** conceptually.

**Phase-level success**

Each phase is successful when its exit posture is true in practice — not when a feature ships for appearance.

**Program-level success**

The roadmap succeeds when:

- material platform facts are reconstructible across domains without improvising new vocabulary
- disputes can be answered with bounded confidence and visible gaps
- export can occur proportionally without mutating source memory
- governance can restrain power as memory grows
- product behavior remains independent of Black Box read paths
- counsel, auditors, and regulators can receive scoped packages without production intimacy

**Failure signal**

The roadmap fails if the platform has dashboards and summaries but cannot defend what it knew, when it knew it, and what proof supports it.

Success is **institutional defensibility**, not event volume.

---

## 14. Future Evolution

Roadmap evolution may adjust **phase emphasis or sequencing emphasis** as RealEstateSniper matures, without abandoning accountability order.

**Allowed evolution**

- Finer sub-phases within domain integration rollout
- Earlier governance hardening if regulatory exposure increases
- Parallel investigation tooling once minimum recording threshold is met
- Clearer success criteria per domain as emission begins

**Evolution requirements**

Every proposed roadmap change must answer:

1. Does it preserve recording-before-reading order?
2. Does it avoid skipping evidence or governance discipline?
3. Does it keep Admin and export subordinate to memory truth?
4. Does it strengthen rather than weaken domain separation?
5. Does it remain conceptual without smuggling implementation design?

**Disallowed evolution**

- Declaring later phases complete while core recording remains unreliable
- Replacing phased accountability with single big-bang dashboard projects
- Using roadmap changes to justify taxonomy chaos or silent rewrite
- Embedding storage, API, or schema decisions inside roadmap amendments

Roadmap amendments require governance review alongside architecture and constitutional documents.

---

## 15. Closing Principles

The Implementation Roadmap rests on a small set of enduring principles:

**Meaning first**  
The design corpus is the constitution for build order. Implementation serves meaning; it does not redefine it.

**Truth before tooling**  
Recording and preservation precede viewing, exporting, and summarizing.

**Layer discipline always**  
Domains remain separate in build order as they are in catalogs.

**Power follows proof**  
Investigation and export expand only when memory earns the right to be believed.

**Governance is continuous**  
Not a late phase checkbox — a companion to every new capability.

**Integration is breadth, not bypass**  
Platform integration spreads honest emission; it does not shortcut accountability.

**Hardening protects the witness**  
The final phase preserves memory for the long dispute, not for the next sprint demo.

---

## Closing Note

This roadmap defines **the conceptual build order for the Black Box**.

Foundation establishes meaning. Event recording establishes truth. Evidence establishes defensibility. Investigation establishes reconstruction. Export establishes governed disclosure. Governance establishes control. Platform integration establishes full participation. Operational hardening establishes longevity. Technical choices come later. Accountable sequencing begins here.
