# RealEstateSniper Black Box — Event Catalog: Verification

Ninth functional catalog of **conceptual verification process events** for the Black Box.

This document defines **which event types exist for verification as a cross-cutting review process**, applicable across multiple platform subjects. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Verification Domain).  
For owner journey authorization, see `BLACK_BOX_EVENT_CATALOG_OWNER.md`.  
For property and document subject lifecycles, see `BLACK_BOX_EVENT_CATALOG_PROPERTY.md` and `BLACK_BOX_EVENT_CATALOG_DOCUMENTS.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Verification Event Catalog exists to make **verification process memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When was verification requested, for what subject, and under what scope?
- How was verification executed, paused, escalated, or manually reviewed?
- What result or restriction did verification produce?
- How does verification memory support disputes when credibility, fraud, or review fairness is challenged?

Verification is the ninth functional catalog because trust decisions cut across **users, owners, properties, documents, payments, marketplace outputs, and factory results**. A single transversal process model keeps review truth coherent without collapsing domain-specific histories.

---

## 2. Scope

**Inside scope**

- Verification requests and intake for any governed verification target
- Execution and assignment of verification work
- Automated and manual verification progression
- Approval, rejection, conditional approval, and inconclusive outcomes
- Escalation to higher scrutiny
- Reverification and invalidation of prior verification posture
- Holds, blocks, and scope limits during verification
- Opening, closing, expiry, and reopening of verification cases

**Applicable verification targets**

Verification may apply to:

- Users
- Owners
- Properties
- Documents
- Payments
- Marketplace subjects such as deals or listings
- Factory or pipeline outputs

The process is transversal; the **target** is identified in each event class without merging target truth into one generic blob.

**Outside scope**

- Owner participation claims and final owner authorization — Owner domain, correlatable
- Property identification and property status — Property domain
- Document upload, version, and custody — Documents domain
- Payment capture and external authority truth — Purchase and Payment domains
- Marketplace investor visibility — Marketplace domain
- Factory run orchestration — Factory domain
- Privileged operator override as exercise of power — Admin domain

Verification owns **the review process and its outcomes**. Neighboring domains own the subjects under review and their native lifecycles.

---

## 3. Verification Philosophy

Verification events record **review process truth**, not the full biography of every subject reviewed.

Philosophy principles:

1. **Transversal process, specific target** — The same process vocabulary applies across targets; each event remains bound to what was verified.
2. **Process separate from subject** — User verification and user account lifecycle are correlatable, not identical.
3. **Outcome clarity** — Approved, rejected, conditional, inconclusive, and expired must remain distinct.
4. **Manual and automated coexist** — Automated steps and human review are both memory, not hidden behind a single outcome.
5. **Escalation is visible** — Higher scrutiny is an event path, not an informal mood change.
6. **Reverification is explicit** — Invalidating earlier posture requires visible process memory.
7. **No domain smuggling** — Verification events must not silently encode marketplace publication, payment capture, or document bytes.

Verification memory answers how the platform reviewed something. It does not replace memory of what that something was.

---

## 4. Verification Event Families

Verification events group into **eight families** plus cross-cutting evidence and boundary guidance.

- **Verification Request** — opening and scoping review
- **Verification Execution** — performing automated and assigned review work
- **Verification Result** — outcomes and trust posture changes
- **Manual Review** — human reviewer actions within the process
- **Escalation** — movement to higher scrutiny
- **Reverification** — renewal or invalidation of prior verification posture
- **Verification Restriction** — holds, blocks, and limits during review
- **Verification Lifecycle** — case opening, closure, expiry, and reopening

Families may correlate in one case but must remain **separate event classes**. Request acceptance and final approval are related but not one merged fact.

---

## 5. Verification Request Events

Verification Request events assert **opening of a governed verification process** against a identified target.

**Verification Requested**  
A governed need for review was recognized for a subject.

**Verification Scope Defined**  
The boundaries of what the verification would examine were established.

**Verification Target Recognized**  
The platform identified the verification subject class — user, owner, property, document, payment, marketplace, or factory output.

**Verification Request Accepted**  
The request entered the governed verification process.

**Verification Request Rejected At Intake**  
The request was refused before execution because policy, eligibility, or completeness failed.

**Verification Queue Entered**  
The request entered a governed queue or backlog state material to timing disputes.

**Duplicate Verification Request Prevented**  
A redundant verification request was blocked under rules in force.

Request events open the process. They do not assert approval or final trust posture.

---

## 6. Verification Execution Events

Verification Execution events assert **performance of verification work** after request acceptance.

**Verification Started**  
Governed verification execution began.

**Verification Assigned**  
Responsibility for verification work was assigned to a reviewer, team, or automated process.

**Verification Paused**  
Execution paused for material reason — for example, awaiting evidence or external fact.

**Verification Resumed**  
Paused verification continued under governed conditions.

**Automated Verification Step Completed**  
An automated review step finished successfully for its scope.

**Automated Verification Step Failed**  
An automated review step failed materially.

**Verification Evidence Gathered**  
Material evidence was collected or linked for the verification case.

**Verification Awaiting External Fact**  
Execution paused because an external authority or third-party fact was required.

**Verification Execution Timed Out**  
Execution exceeded governed time limits in a material way.

Execution events describe how review proceeded. Result events record what was concluded.

---

## 7. Verification Result Events

Verification Result events assert **conclusions and trust posture changes** from verification.

**Verification Approved**  
The subject passed verification for the scoped purpose.

**Verification Rejected**  
The subject failed verification for the scoped purpose.

**Verification Conditionally Approved**  
Approval was granted with explicit continuing conditions.

**Verification Inconclusive**  
Review ended without a definitive approve or reject conclusion under rules in force.

**Verification Risk Posture Changed**  
Material risk classification of the subject changed because of verification.

**Verification Outcome Communicated**  
A governed notice of verification outcome was recognized as sent or required.

**Verification Outcome Acknowledged**  
The subject or responsible party acknowledged outcome where that acknowledgment is material.

Result events are process conclusions. Domain-specific authorization or publication may still be required separately.

---

## 8. Manual Review Events

Manual Review events assert **human reviewer participation** inside the verification process.

**Manual Review Requested**  
Human review was determined necessary within the case.

**Manual Review Started**  
A qualified reviewer began manual examination.

**Manual Review Completed**  
Manual review reached a governed completion point.

**Manual Review Decision Recorded**  
The reviewer recorded a decision within the verification process.

**Manual Review Returned For More Evidence**  
The reviewer required additional material before deciding.

**Reviewer Conflict Recognized**  
A conflict-of-interest or assignment conflict was recognized and handled.

**Manual Review Reassigned**  
Responsibility moved to a different reviewer under governance.

Manual review events do not replace Admin domain records of privileged override unless the action is the same fact; correlation may apply.

---

## 9. Escalation Events

Escalation events assert **movement to higher scrutiny** within verification.

**Verification Escalated**  
The case moved to a higher scrutiny tier because of risk, complexity, or conflict.

**Verification Escalation Accepted**  
The escalated case was accepted into the higher tier queue or responsibility.

**Verification Escalation Completed**  
Escalated review reached a governed completion point.

**Verification Escalation Rejected**  
Escalation was denied or returned to prior tier with reason.

**Senior Review Required**  
Policy mandated senior or specialized review before conclusion.

**Escalation Outcome Recorded**  
The escalated path produced a distinct outcome recorded separately from the original tier.

Escalation preserves the story of why a case became more serious, not only the final yes or no.

---

## 10. Reverification Events

Reverification events assert **renewal or invalidation of earlier verification posture**.

**Reverification Required**  
Earlier verification was no longer sufficient under expiry, policy, or changed facts.

**Reverification Initiated**  
A new verification process began because of reverification requirement.

**Reverification Completed**  
Reverification reached a governed conclusion.

**Reverification Failed**  
Reverification did not restore or establish acceptable posture.

**Prior Verification Invalidated**  
Earlier verification posture was explicitly marked no longer valid.

**Reverification Waived Under Policy**  
Reverification was not required despite a trigger, under explicit governed exception.

Reverification events protect investigators from assuming old approval still applied when it did not.

---

## 11. Verification Restriction Events

Verification Restriction events assert **holds, blocks, and limits** affecting verification or verified subjects during review.

**Verification Hold Applied**  
The case or subject was frozen pending review outcome or external condition.

**Verification Hold Released**  
A prior hold ended under governed conditions.

**Verification Blocked By Policy**  
Verification could not proceed because policy or compliance blocked it.

**Verification Scope Limited**  
Review was narrowed to a smaller governed scope.

**Subject Use Restricted Pending Verification**  
The verified subject could not proceed in platform use until verification concluded.

**Restriction Lifted After Verification**  
A pending-use restriction ended because verification outcome allowed it.

Restriction events make interim limits visible. They do not replace final result events.

---

## 12. Verification Lifecycle Events

Verification Lifecycle events assert **case-level progression** of the verification process over time.

**Verification Case Opened**  
A durable verification case began around a subject and scope.

**Verification Case Closed**  
The verification case reached closure under governed rules.

**Verification Expired**  
The verification case or its validity window ended without renewed conclusion.

**Verification Cancelled**  
The verification process was halted before normal conclusion.

**Verification Reopened**  
A closed or expired case resumed under governed conditions.

**Verification Milestone Reached**  
A governed stage boundary — such as ready for decision or awaiting subject action — was recognized.

**Verification Case Merged**  
Two related verification cases were combined under governance without erasing distinct prior facts.

Lifecycle events frame the case container. Execution and result events fill it.

---

## 13. Verification Evidence

Verification events may be supported by **linked evidence** without embedding sensitive review material unnecessarily.

Evidence types appropriate to this domain include:

- Document references gathered during review
- Automated check output references with integrity posture
- External authority references for payment or identity corroboration
- Prior verification case references in reverification paths
- Reviewer notes or decision rationale references governed for sensitivity
- Communication references proving outcome notice

Evidence principles for verification:

- Evidence corroborates process conclusions; it does not replace them.
- Sensitive review notes and subject data should be referenced or redacted where possible.
- Provisional or inconclusive posture must remain visible before final outcome.
- Contradiction between automated and manual conclusions must remain visible.

Verification evidence strengthens fairness and fraud disputes. It does not turn the Black Box into a case management dump.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how transversal verification relates to domain-specific catalogs**.

**Owner domain**  
Records owner journey, authorization, and owner-side verification progression. This catalog records the verification process when owner is the target or case container.

**Property domain**  
Records property subject truth. Property-targeted verification correlates here without merging identities.

**Documents domain**  
Records file custody and document review acceptance. Document-targeted verification correlates when review spans cases.

**Purchase and Payment domains**  
Record commercial and financial truth. Payment-targeted verification supports reconciliation disputes without encoding capture.

**Marketplace domain**  
Records investor-visible opportunity. Marketplace-targeted verification may gate publication elsewhere.

**Factory domain**  
Records automated output causality. Factory-targeted verification reviews machine-produced truth before use.

**Admin domain**  
Records privileged override power. Manual verification is not automatically admin action; correlation depends on the fact.

**Security domain**  
Records abuse and incident signals. Verification may correlate when risk triggers review.

Boundary discipline keeps one verification language across targets while preserving native domain histories.

---

## 15. Future Evolution

Verification catalog evolution may add new event classes only when **new review process truth** must be preserved.

**Allowed evolution**

- New target classes if new subject types require governed review
- Finer inconclusive and conditional outcome classes when disputes expose ambiguity
- Additional escalation tiers as risk organization matures
- Clearer automated-versus-manual step classes when process complexity grows

**Evolution requirements**

Every proposed verification event class must answer:

1. What process truth does it assert that existing classes do not?
2. Which target types can it apply to without ambiguous merge?
3. Does it preserve separation from subject-domain lifecycles?
4. Can it correlate across domains without collapsing them?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- One generic verification outcome class for all targets and purposes
- Using verification events as marketplace publication or payment capture shortcuts
- Logging every automated score recompute as institutional memory without materiality
- Silent invalidation of prior verification without reverification or invalidation events
- Turning verification into undifferentiated operator task telemetry

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Verification domain**.

Verification Request and Execution mark how review began and proceeded. Result and Manual Review mark what was concluded and who decided. Escalation and Reverification mark when scrutiny intensified or prior posture expired. Restriction and Lifecycle mark limits and case containers over time.

Technical representation comes later. Cross-cutting review truth begins here.
