# RealEstateSniper Black Box — Security Model

Architectural model for protecting the **integrity, confidentiality, and probative value** of the Black Box as institutional memory.

This document is **not** a general cybersecurity program. It does not define firewalls, endpoint protection, or application hardening for the whole platform. It defines how the Black Box itself must be protected so that accepted truth remains trustworthy, appropriately confidential, and usable as evidence when facts are challenged.

For constitutional security obligations, see `BLACK_BOX_CONSTITUTION.md`.  
For access, investigation, and evidence governance, see `BLACK_BOX_GOVERNANCE.md`.  
For schema integrity constraints, see `BLACK_BOX_EVENT_SCHEMA_PRINCIPLES.md`.

---

## 1. Purpose

The Black Box Security Model exists so that institutional memory cannot be **silently altered, casually exposed, or stripped of evidentiary value** under operational pressure, insider convenience, or external challenge.

Its purpose is to answer:

- What must the Black Box protect beyond ordinary product security?
- Where does accountability memory begin and end as a trust boundary?
- How is immutability protected as a security property, not only a design preference?
- How do access, investigation, and evidence handling preserve probative value?

The model protects the witness, not the workstation. Product security protects live operation; this model protects the durability and defensibility of what was recorded.

---

## 2. Security Philosophy

Black Box security is **memory security**: guarding truth once it has been accepted into institutional accountability.

Security philosophy rests on five commitments:

1. **Integrity before convenience** — No role, urgency, or executive request justifies silent rewrite of accepted assertions.
2. **Confidentiality by purpose** — Memory is exposed only to justified scope, not to ambient internal visibility.
3. **Probative discipline** — The Black Box must remain usable in dispute without contaminating claims through careless handling.
4. **Separation of power** — Those who operate live state must not hold unchecked dominion over historical truth.
5. **Visible failure** — Gaps, provisional status, recovery, and restriction must be representable rather than hidden to preserve appearance of safety.

The Black Box is secure when investigators, counsel, and auditors can trust that memory behaved like a witness under governance — not like editable product state.

---

## 3. Trust Boundary

The trust boundary defines **what lies inside protected accountability memory** and what lies outside it.

**Inside the boundary**

- Accepted event assertions and their canonical identity
- Additive explanation and trust posture history
- Evidence links and governed corroboration references
- Correlation and relationship structure between events
- Governance-visible traces of sensitive access, export, and investigation activity where required

**Outside the boundary**

- Live product state and current entitlements
- Operator workflows and presentation layers
- General application telemetry unrelated to accountability
- Analytics warehouses and performance monitoring not governed as institutional memory
- Unregistered or ad hoc signals not admitted through governed intake

**Boundary crossings**

Material facts cross inward at authoritative recognition points. Sensitive memory crosses outward only through governed access, scoped investigation export, or lawful disclosure processes.

The trust boundary fails when live state, casual browsing, or informal copies are treated as equivalent to institutional memory.

---

## 4. Integrity Protection

Integrity protection ensures that **accepted assertions remain authentic and uncorrupted** over time.

Integrity principles:

- Historical assertions are not modified in place after acceptance.
- Enrichment layers cannot overwrite or obscure original meaning.
- Corrections and disputes appear as additive material with visible lineage.
- Correlation must not collapse distinct facts into one ambiguous record.
- Recovery and reconstruction must be distinguishable from first-pass recognition.
- Integrity gaps and provisional status must remain visible rather than masked.

Integrity is the foundation of probative value. A record whose authenticity cannot be defended has no security worth speaking of.

---

## 5. Immutability Protection

Immutability protection treats **non-rewrite of accepted truth** as a security control, not merely a storage preference.

Immutability principles:

- No privileged pathway may silently edit accepted institutional memory.
- Retention restriction prefers governed inaccessibility over destructive erasure where policy allows.
- Taxonomy and naming evolution must not retroactively relabel past assertions.
- Investigation and export must not mutate source memory during package assembly.
- Emergency processes may accelerate review but may not exempt accepted assertions from immutability rules.

Immutability protects against the most dangerous insider threat: the belief that fixing the present requires laundering the past.

---

## 6. Access Principles

Access principles govern **who may enter the trust boundary and how much memory they may see**.

**Denied by default**  
No role inherits standing access to full institutional memory. Access requires purpose, scope, and authority.

**Purpose binding**  
Permitted access aligns to investigation, audit, security response, legal review, or explicitly approved accountability need — not curiosity or convenience.

**Scope minimization**  
Access grants the narrowest slice of memory sufficient for the stated purpose, especially for money, identity, ownership, and privileged-action material.

**Time bounding**  
Access rights expire when purpose ends or role changes unless formally renewed under review.

**Sensitive access memory**  
Where policy requires, access to highly sensitive memory is itself treated as a governable accountability event.

**No shadow copies**  
Informal exports, screenshots, or duplicate stores outside governed export paths weaken confidentiality and probative discipline.

Access security protects people and the platform as much as it protects the Black Box itself.

---

## 7. Separation of Duties

Separation of duties prevents **any single role from both shaping live outcomes and controlling historical truth without oversight**.

Separation principles:

- Product operators must not be the sole unchecked viewers of related historical truth.
- Those who emit domain events must not be the sole validators of their own accountability significance in high-risk classes.
- Registry and naming stewardship must be reviewable independently from domain emission pressure.
- Investigation leads must not unilaterally alter the assertions they review.
- Governance approvers for constitutional or access change must not be the only beneficiaries of that change.

Separation does not forbid overlap of roles in a small organization. It forbids unchecked overlap where memory could be shaped to match operational preference.

---

## 8. Confidentiality Principles

Confidentiality principles protect **sensitive material within and around institutional memory** without destroying investigability.

**Minimum necessary retention of sensitivity**  
The Black Box must not embed secrets, full identity material, or unrestricted document content when reference or redaction suffices.

**Layered exposure**  
Explanation and evidence layers may carry different sensitivity than the core assertion. Exposure rules must respect the most sensitive linked material.

**Redaction before release**  
Investigation export and external disclosure apply redaction and scoping before memory leaves governed boundaries.

**Need-to-know inside the platform**  
Internal access follows the same proportionality logic as external disclosure, not a weaker default.

**Restriction over silent deletion**  
When confidentiality law or policy requires limitation, governed restriction records are preferred over untracked destruction of audit lineage unless law explicitly mandates otherwise.

Confidentiality serves lawful accountability, not secrecy for its own sake.

---

## 9. Investigation Security

Investigation security protects **the review process** so it does not become a channel for leakage, contamination, or backdoor rewrite.

Investigation principles:

- Review proceeds through bounded cases with stated purpose and scope.
- Investigators receive read-oriented access unless a separate governed process authorizes otherwise.
- Cross-domain reconstruction must not require unrelated full-memory visibility.
- Export packages are scoped, traceable, and assembled without mutating source assertions.
- Significant investigations should leave governance-appropriate traces that review occurred.
- Provisional and disputed material must remain visibly qualified inside investigation outputs.

Investigation security ensures memory is used to find truth, not to circulate sensitive history informally.

---

## 10. Evidence Protection

Evidence protection guards **corroboration linked to events** so proof remains trustworthy and lawfully handled.

Evidence principles:

- Evidence remains distinct from the assertion it supports.
- Chain-of-custody thinking applies to origin, linkage, access, and export of corroborating material.
- Multiple evidence sources and contradictions remain visible rather than smoothed away.
- Trust maturation based on evidence is additive and auditable.
- Sensitive artifacts are referenced or redacted where possible instead of duplicated recklessly.
- Evidence retention and restriction follow governed policy with heightened care for documents and identity material.

Evidence security protects probative value. Mishandled proof can destroy a case as surely as missing proof.

---

## 11. Insider Threat Principles

Insider threat, in this model, means **any authorized actor who could damage memory integrity, confidentiality, or evidentiary credibility** — not only malicious intent, but also convenience, urgency, and unreviewed power.

Insider risk patterns include:

- Rewriting or suppressing inconvenient historical assertions
- Granting broad access without purpose or review
- Exporting memory informally outside governed paths
- Pressuring registry or taxonomy changes to match current commercial narrative
- Conflating live state edits with corrective historical memory
- Treating investigation access as operational browsing rights

Mitigation principles:

- Immutability and separation of duties as structural controls
- Attributed governance, access, and export decisions
- Independent review for high-risk changes and sensitive access
- Visible provisional, disputed, and recovery states that resist false cleanliness

Most Black Box harm will come from insiders with good intentions and tight deadlines. The model is designed for that reality.

---

## 12. External Threat Principles

External threat, in this model, means **actors or systems outside governed accountability authority** attempting to corrupt, extract, or discredit institutional memory.

External risk patterns include:

- Forged or replayed boundary signals admitted as truth without validation
- Extraction of sensitive memory through compromised access paths
- Partner or authority callbacks that disagree with platform assertions without preserved distinction
- Legal or regulatory pressure to destroy lineage without governed restriction records
- Public dispute challenges that expose weak provenance or invisible uncertainty

Mitigation principles:

- Validation at intake before acceptance into trusted memory
- Provenance visibility for external authority origin
- Correlation without collapsing platform truth and external truth
- Governed export and disclosure rather than ad hoc response packages
- Recovery that marks reconstructed truth honestly when material is lost or delayed

External threat defense for the Black Box is about **admission discipline and disclosure discipline**, not about pretending memory is unreachable.

---

## 13. Disaster Recovery Principles

Disaster recovery for the Black Box means **restoring investigability after partial loss, delay, or outage** without inventing a cleaner past.

Recovery principles:

- Missing expected sequences should be detectable where possible.
- Reconstructed or replayed truth must be clearly marked as such.
- Recovery records must explain what was restored and from what source.
- Recovery must not fabricate certainty to restore stakeholder comfort.
- Availability restoration must not trade away integrity or confidentiality controls.
- Post-incident review must enter governance when recovery affected trust guarantees.

Disaster recovery succeeds when investigators can still defend what is known, what is uncertain, and what was rebuilt.

---

## 14. Security Governance

Security governance connects this model to **accountable decision-making** over memory protection.

Security governance principles:

- Material changes to access, export, evidence handling, or integrity guarantees require reviewed approval.
- Security and legal review participate when changes affect sensitive memory or external disclosure.
- Immutable rules in governance documents may be clarified but not informally weakened.
- Security incidents involving memory integrity, unauthorized access, or harmful export trigger investigation and governance response.
- Meta-audit traces for sensitive access and export must remain possible where policy requires.
- Security monitoring may consume Black Box outputs, but monitoring is not a substitute for the Black Box itself.

Security governance ensures protection rules outlive individual roles and urgent moments.

---

## 15. Future Security Evolution

Security evolution may proceed only when it **strengthens integrity, confidentiality, or probative value** without eroding trust guarantees.

**Allowed evolution**

- Clearer trust boundary articulation as intake domains mature
- Stronger separation-of-duties guidance as organization scale increases
- Richer investigation and export protection rules when practice exposes gaps
- Better provenance and recovery visibility when delay or loss repeatedly harms reconstruction
- Tighter evidence custody thinking as dispute classes grow

**Evolution requirements**

Every proposed security change must answer:

1. Which integrity, confidentiality, or probative risk does this address?
2. Does it preserve immutability and additive correction?
3. Does it reduce ambient access or ungoverned copying?
4. Does it strengthen or weaken separation of duties?
5. Can historical material remain investigable after the change?

**Disallowed evolution**

- Backdoors to rewrite accepted assertions for operational convenience
- Broad internal access expansions without purpose binding
- Security theater logging without investigable meaning
- Confidentiality shortcuts that embed sensitive material unnecessarily
- Recovery practices that hide uncertainty or erase lineage under pressure

Amendments to this security model require explicit review alongside the constitution and governance corpus. Convenience is not sufficient justification.

Protection of memory must mature forward. The credibility of past assertions must not be traded away.

---

## Closing Note

The Black Box Security Model protects **the witness function** of institutional memory.

Integrity and immutability keep assertions trustworthy. Access, separation of duties, and confidentiality keep memory from becoming ambient property. Investigation and evidence protection keep review lawful and probative. Insider and external threat principles assume pressure will come from both inside and outside the platform. Disaster recovery prefers honest reconstruction over false completeness. Security governance and future evolution keep protection deliberate as RealEstateSniper grows.

General platform cybersecurity remains necessary elsewhere. This document defines the security architecture specific to accountability memory — the place where truth must survive dispute.
