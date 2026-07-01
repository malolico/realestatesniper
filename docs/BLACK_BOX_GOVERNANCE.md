# RealEstateSniper Black Box — Governance

Official principles for who governs the Black Box, how change is controlled, and which rules cannot be relaxed.

This document defines **authority, stewardship, review, and non-negotiable constraints** for the Black Box as institutional memory. It does not define storage, transport, permissions implementation, or operational tooling.

For constitutional obligations, see `BLACK_BOX_CONSTITUTION.md`.  
For system positioning, see `BLACK_BOX_ARCHITECTURE.md`.  
For event meaning and naming rules, see `BLACK_BOX_EVENT_MODEL.md` and `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For schema constraints, see `BLACK_BOX_EVENT_SCHEMA_PRINCIPLES.md`.

---

## 1. Purpose

Black Box Governance exists so that accountability memory remains **independent, trustworthy, and defensible** even as the product, team, and technology change around it.

Its purpose is to answer:

- Who holds ultimate authority over the Black Box?
- Who stewards day-to-day integrity without owning historical truth?
- Which rules may evolve through review and which may never be softened?
- How are access, investigation, evidence, and legal use governed?

Governance protects the Black Box from convenience, urgency, and local optimization. Without governance, institutional memory becomes whatever the current operator prefers.

---

## 2. Governance Philosophy

The Black Box is governed as **platform infrastructure for truth**, not as a feature owned by a single team or surface.

Governance philosophy rests on five commitments:

1. **Constitution first** — The constitution defines non-negotiable obligations. Governance executes and protects those obligations; it does not override them informally.
2. **Separation of memory and operation** — Those who change live product state must not be the unreviewed owners of how history is defined, accessed, or amended.
3. **Additive change** — Mature understanding arrives through new records, new names, new overlays, and explicit review — not through silent rewrite.
4. **Visible authority** — Every governance action that affects taxonomy, access, export, or constitutional interpretation must be attributable and reviewable.
5. **Dispute readiness** — Governance decisions must assume facts will be challenged by users, regulators, partners, or counsel.

Governance is conservative by design. The cost of weak memory is higher than the cost of slow change.

---

## 3. Ownership

Ownership defines **who holds ultimate authority** over the Black Box as a platform institution.

**Platform ownership**  
The Black Box belongs to RealEstateSniper the platform, not to a single product squad, operator workflow, or presentation layer. Platform leadership holds accountability for ensuring the Black Box exists, remains independent, and receives constitutional protection.

**Constitutional ownership**  
The constitution is the supreme governing document for Black Box behavior. No team, role, or emergency process may claim authority above it without a formal constitutional amendment.

**Architectural ownership**  
Architecture, event model, naming, and schema principles are owned as a coherent design corpus. Changes to one document without reviewing aligned documents are governance failures.

**Registry ownership**  
The official event registry and taxonomy extensions are owned at platform level. Domains may propose; they do not unilaterally own canonical namespace.

**No vendor ownership**  
External vendors, infrastructure providers, and integration partners do not own Black Box meaning. They may supply signals; they do not define institutional memory.

Ownership answers who is accountable when the Black Box is missing, misused, or pressured to lie for convenience.

---

## 4. Stewardship

Stewardship defines **who tends the Black Box day to day** without confusing care with ownership of truth.

**Domain stewards**  
Each platform domain stewards the quality of its own emissions: recognizing material facts, proposing registry entries, maintaining category fit, and escalating ambiguity before emission.

**Memory stewards**  
A designated stewardship function maintains registry hygiene, naming consistency, correlation expectations, and cross-domain review when new event classes are proposed.

**Investigation stewards**  
Authorized investigation leads steward case boundaries, export scope, and reviewer conduct without altering historical assertions.

**No steward may rewrite history**  
Stewards improve forward behavior, documentation, and process. They do not edit, delete, or relabel accepted institutional memory for operational comfort.

**Stewardship rotation**  
Steward roles may rotate with staffing, but obligations do not. Handoffs must preserve registry knowledge and open review items.

Stewardship keeps the Black Box alive. Ownership keeps it legitimate.

---

## 5. Change Control

All material changes to Black Box governance, taxonomy, naming, schema principles, or constitutional interpretation pass through **controlled change**.

**Material change includes**

- New constitutional categories or scope expansion
- New canonical event names or deprecation of existing names
- Changes to immutable rules or trust guarantees
- Changes to access, export, or investigation policy
- Changes to evidence handling or legal disclosure posture
- Changes to schema principles that affect historical interpretability

**Change requirements**

Every material change must document: what truth is affected, why the change is necessary, what additive path protects prior records, who approved it, and when it takes effect.

**Emergency change**

Urgent security or legal pressure may accelerate review but may not bypass immutability, attribution, or audit of the governance action itself. Emergency is a faster path, not an exemption from memory.

**Rejected change patterns**

Changes pursued for dashboard completeness, analytics appetite, release pressure, or single-team convenience are out of scope unless they independently strengthen truth or defensibility.

Change control ensures the Black Box evolves deliberately, not accidentally.

---

## 6. Immutable Rules

Certain rules are **non-negotiable** within Black Box governance. They may be clarified in language but never weakened in practice.

**Memory immutability**  
Accepted historical assertions are not rewritten, deleted for convenience, or hidden because they are embarrassing or commercially sensitive.

**Append-only correction**  
Corrections, clarifications, and disputes arrive as new material. They do not erase what was originally asserted.

**Independence from presentation**  
Recording and governance do not depend on any operator viewport, product screen, or release cadence being complete.

**Separation of claim and proof**  
Assertions remain distinct from evidence. Trust posture may mature; false certainty is forbidden.

**Attribution and traceability**  
Material events remain attributable and traceable through investigation scope unless law explicitly requires a governed restriction record.

**Minimum necessary exposure**  
Access and export follow least-privilege disclosure. Broad internal browsing is not a default right.

**Governed namespace**  
Canonical event identity and naming follow the naming standard. Ad hoc emission is forbidden.

**Constitutional amendment gate**  
Scope expansion and guarantee reduction require explicit constitutional review, not informal team consensus.

Immutable rules define what governance cannot trade away under pressure.

---

## 7. Review Process

Review is how governance remains **legitimate, informed, and cross-functional**.

**Proposal**  
A change begins as a written proposal stating purpose, affected documents, affected domains, risk to historical material, and additive migration path.

**Domain review**  
Affected domains confirm emission authority, category fit, and operational truth boundaries.

**Memory review**  
Stewards confirm naming consistency, registry collision risk, correlation impact, and investigator readability.

**Security and legal review**  
Material changes affecting access, evidence, retention, or external disclosure receive security and legal review before adoption.

**Approval**  
Approval requires identified approvers with authority matching the change class. Constitutional changes require the highest approval tier.

**Publication**  
Approved changes are published with effective date, transition rules, and any dual-emission or deprecation window.

**Retrospective review**  
After significant rollout, governance conducts retrospective review: Did the change preserve truth? Did investigators remain able to reconstruct cases?

Review transforms opinion into accountable decision.

---

## 8. Version Governance

Version governance controls **how the Black Box document corpus and registry evolve** without fragmenting meaning.

**Document versions**  
Constitution, architecture, event model, naming standard, schema principles, and governance itself form a versioned corpus. Each amendment is recorded with rationale and effective scope.

**Registry versions**  
The event registry matures forward. Registry version changes describe capability and taxonomy, not individual occurrences.

**Forward-only semantic versioning**  
New understanding applies to new emission and additive overlays. Old records retain the meaning they held when accepted.

**Compatibility obligation**  
Version changes must preserve investigability of historical material unless a formal legal restriction process applies.

**No silent drift**  
Teams must not treat living documents as informal wikis. Undocumented interpretation drift is governance debt.

Version governance keeps the platform speaking one institutional language across time.

---

## 9. Deprecation Governance

Deprecation governs **retirement of names, categories, or practices from future use** without erasing the past.

**Formal deprecation only**  
A name, category guidance, or emission practice is deprecated only through registry decision with stated reason, replacement, and effective date.

**Historical permanence**  
Deprecated names continue to identify old records exactly as before. Investigators must remain able to read timelines containing them.

**Transition windows**  
When replacement names exist, governed dual-emission periods may ease migration. Transition must be time-bounded and documented.

**No deprecation by neglect**  
Stopping use without registry action is forbidden. Neglected names create investigation blind spots.

**Emergency deprecation**  
Harmful or misleading names may be fast-tracked out of future emission but cannot rewrite records already accepted.

Deprecation governs the future. It does not launder the past.

---

## 10. Access Governance

Access governance defines **who may see institutional memory, how much, and under what accountability**.

**Default posture**  
Access is denied by default and granted by purpose, role, and scope. Unbounded internal access is incompatible with governance.

**Purpose binding**  
Every access grant binds to investigation, audit, security response, legal review, or explicitly approved operational need — not curiosity.

**Sensitivity tiers**  
Material involving money, ownership, identity, privileged action, or legal dispute receives stricter scope and stronger access logging expectations.

**Separation of duties**  
Those who operate live product state should not be the sole unchecked viewers of related historical truth.

**Access is itself memorable**  
Sensitive access should be governable as its own auditable class of activity where policy requires.

**Revocation**  
Access rights expire, narrow, or revoke when purpose ends or role changes.

Access governance protects people, the platform, and the Black Box from casual exposure.

---

## 11. Investigation Governance

Investigation governance defines **how authorized review uses memory without becoming a backdoor to rewrite it**.

**Case orientation**  
Investigation proceeds through bounded cases with stated purpose, scope, and relevant domains — not endless ambient browsing.

**Read-oriented use**  
Investigation reconstructs truth. It does not correct product state, re-emit historical facts under new names, or silently patch old assertions.

**Reviewer accountability**  
Reviewers act under role authority, export rules, and minimum necessary disclosure. Misuse is a governance and security matter.

**Cross-domain obligation**  
Investigators must be able to follow correlation across domains without needing unrelated full-platform visibility.

**External review packages**  
Investigation outputs for counsel, auditors, or dispute parties are scoped, traceable, and redacted where required. Export is governed, not informal.

**Closure and record**  
Significant investigations should leave governance-visible traces that review occurred, even when conclusions remain internal.

Investigation governance ensures memory serves truth seekers, not power without oversight.

---

## 12. Legal Governance

Legal governance aligns Black Box use with **lawful, defensible, and proportionate** conduct.

**Lawful basis**  
Collection, retention, access, and disclosure occur with identifiable lawful purpose and proportionality to accountability needs.

**Retention and restriction**  
When law or policy requires restriction, governance prefers access limitation and anonymization records over silent destruction of audit lineage unless law explicitly mandates otherwise.

**Regulatory and partner inquiry**  
Responses to regulators, partners, or formal user disputes use scoped packages with traceable authorization, not ad hoc dumps of memory.

**Consent and acceptance memory**  
Legal acceptance events remain first-class institutional facts governed by their own category rules.

**Cross-border caution**  
Disclosure governance must account for jurisdiction, data sensitivity, and third-party rights without improvising at export time.

**No legal conclusion by memory**  
The Black Box preserves facts and context. It does not replace counsel, courts, or formal legal determination.

Legal governance keeps institutional memory useful in dispute without turning it into uncontrolled evidence hoarding.

---

## 13. Evidence Governance

Evidence governance defines **how corroborating material enters, links, matures, and may be disclosed**.

**Separation from assertion**  
Evidence links to events; it does not replace them. Governance forbids treating linked proof as if it were the original assertion.

**Chain-of-custody thinking**  
Evidence handling must preserve origin, linkage, and subsequent access or export where sensitivity requires.

**Minimum necessary content**  
Prefer reference, redaction, and scoped inclusion over embedding sensitive material unnecessarily.

**Trust maturation**  
Upgrading or downgrading trust based on evidence must be visible and additive, not silent.

**Disputed evidence**  
Contradictory corroboration remains visible. Governance does not permit smoothing conflict for narrative comfort.

**Retention alignment**  
Evidence retention and restriction follow the same governed thinking as events, with heightened care for documents and identity material.

Evidence governance protects both proof and the people the proof describes.

---

## 14. Audit Governance

Audit governance defines **how the Black Box accounts for itself** and how meta-audit activity is controlled.

**Self-auditability**  
Governance, registry change, sensitive access, export authorization, and constitutional amendment must be capable of leaving institutional traces appropriate to their sensitivity.

**Meta-events**  
Audit activity about the Black Box — investigation opened, export authorized, restricted material viewed, classification amended for future records — is governed as its own domain of memory.

**Independent review**  
Internal audit, security audit, and external audit must be able to evaluate whether governance rules were followed without relying on operator recollection alone.

**No audit theater**  
Logging for appearance without investigable meaning is discouraged. Audit governance favors fewer, stronger records over noisy compliance performance.

**Finding response**  
Audit findings that require governance change enter the same change control process as other material amendments.

Audit governance ensures the witness can itself be questioned credibly.

---

## 15. Future Governance Rules

Future governance may evolve only when evolution **strengthens truth, trust, or defensibility**.

**Allowed evolution**

- Clearer stewardship roles as the platform scales
- Stronger review tiers for high-risk categories
- Better investigation and export policy articulation
- Improved legal and evidence handling guidance
- Tighter namespace and registry discipline as the catalog grows

**Evolution requirements**

Every proposed governance change must answer:

1. Which constitutional or architectural obligation does this protect or clarify?
2. Does it preserve immutable rules and historical investigability?
3. Does it increase or decrease separation between operation and memory?
4. Are approvers and stewards identified with real accountability?
5. Is the change additive for existing material and records?

**Disallowed evolution**

- Informal exceptions to immutability for executive convenience
- Team-local governance dialects that break global consistency
- Access expansion without purpose binding or review
- Registry or taxonomy changes without documented approval
- Governance structures that make the Black Box subordinate to a single product roadmap

Amendments to this governance document require explicit review alongside the constitution and aligned design corpus. Convenience is not sufficient justification.

Governance matures forward. Accountability memory does not get softer with time.

---

## Closing Note

Black Box Governance defines **who may change what, what may never change, and how truth is protected under pressure**.

Ownership establishes platform authority. Stewardship tends daily integrity. Change control and review turn proposals into legitimate decisions. Immutable rules mark the boundary governance cannot cross. Version and deprecation governance manage the future without laundering the past. Access, investigation, legal, evidence, and audit governance protect memory in use. Future rules keep the framework honest as RealEstateSniper grows.

Implementation of governance mechanisms comes later. This document defines the control principles those mechanisms must serve.
