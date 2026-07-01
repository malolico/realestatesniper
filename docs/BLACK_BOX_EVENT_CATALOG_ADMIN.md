# RealEstateSniper Black Box — Event Catalog: Admin

Tenth functional catalog of **conceptual administrative action events** for the Black Box.

This document defines **which event types exist when privileged human authority alters platform truth**, with operational, security, legal, or business consequence. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Admin Domain).  
For separation of operator interface from institutional memory, see `BLACK_BOX_CONSTITUTION.md`.  
For privileged security posture, see `BLACK_BOX_SECURITY_MODEL.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Admin Event Catalog exists to make **privileged human authority memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did an operator exercise elevated power, and over what subject?
- What approval, rejection, override, configuration change, or emergency action did the platform take on behalf of governance?
- Who is accountable when live state was changed manually?
- How can investigators reconstruct administrative consequence without depending on operator screens or navigation logs?

Admin is the tenth functional catalog because **unreviewable privileged power is the highest governance risk** on a trust-sensitive platform. Administrative events defend the institution when operators correct deals, suspend participation, bypass automation, or act under emergency.

---

## 2. Scope

**Inside scope**

- Consequential exercises of privileged human authority
- Administrative approvals and rejections with material effect
- Overrides of automated, policy, or domain-default outcomes
- Configuration changes with operational, security, legal, or business impact
- Emergency containment, freeze, suspension, and rollback actions
- Accountability signals for who acted, who reviewed, and who challenged
- Evidence references that support administrative defensibility

**Materiality standard**

An administrative event exists only when the action **changes or could change** operational posture, security posture, legal exposure, or business outcome. Routine operator convenience does not qualify.

**Outside scope**

- Admin portal navigation, screen views, tab changes, and search activity — not institutional memory
- Generic authentication and routine sign-in — Authentication domain
- User account lifecycle facts without privileged intervention — User Account domain
- Role and permission changes as participation truth — correlatable; primary ownership follows governance classification elsewhere
- Verification process mechanics — Verification domain, correlatable when admin affirms or overrides review outcome
- Owner authorization finale — Owner domain, correlatable when admin is the deciding actor
- Marketplace publication truth — Marketplace domain, correlatable when admin forces visibility change
- Payment capture and external financial authority — Purchase and Payment domains
- Security incident taxonomy as threat signal — Security domain, correlatable
- Black Box registry definition and governance amendments — Governance layer, not admin action catalog

This catalog owns **privileged action truth**. The Admin Operations Center is a viewport for operators; it is not the source of administrative memory.

---

## 3. Admin Event Philosophy

Admin events record **consequential exercise of elevated authority**, not how an operator moved through a console.

Philosophy principles:

1. **Power must be visible** — Meaningful override, approval, and rejection are first-class facts, not implied by downstream state.
2. **Navigation is not governance** — Opening a panel or viewing a list creates no institutional obligation; acting with consequence does.
3. **Decision separate from domain outcome** — Admin approval of owner participation correlates with Owner domain authorization without merging event classes.
4. **Override is explicit** — Bypassing automation, policy, or prior outcome requires visible administrative memory.
5. **Emergency is bounded** — Break-glass and containment actions are recorded distinctly from routine decisions.
6. **Accountability travels with action** — Who exercised authority and under what governance context must remain reconstructible.
7. **No Black Box smuggling** — Admin events must not silently encode verification steps, document bytes, or payment capture.

Administrative memory answers what privileged humans did to the platform. It does not replace native domain histories.

---

## 4. Admin Event Families

Admin events group into **seven families** plus cross-cutting accountability, evidence, and boundary guidance.

- **Administrative Access** — activation and scope of privileged capability before or during consequential action
- **Administrative Decision** — recording, deferral, referral, and governance of a pending administrative judgment
- **Administrative Approval** — affirmative administrative decisions with material effect
- **Administrative Rejection** — negative administrative decisions with material effect
- **Administrative Override** — deliberate bypass or correction of non-administrative outcomes
- **Administrative Configuration** — material changes to platform behavior, thresholds, or exposure
- **Administrative Emergency** — containment, freeze, suspension, and break-glass under acute risk

Families may correlate tightly in one intervention but must remain **separate event classes**. Emergency access and emergency freeze are related but not one merged fact.

---

## 5. Administrative Access Events

Administrative Access events assert **when privileged capability became available or was constrained** for consequential work.

**Administrative Privilege Activated**  
An operator entered a governed elevated posture suitable for material administrative action.

**Administrative Privilege Expired**  
Elevated posture ended by policy, timeout, or explicit release.

**Administrative Sensitive Scope Access Granted**  
An operator received authority to act on a protected subject class or high-risk scope.

**Administrative Sensitive Scope Access Revoked**  
Authority to act on a protected scope was removed before or after action.

**Administrative Act-As Authorized**  
The platform permitted an operator to act in a governed on-behalf-of posture for investigation or support.

**Administrative Act-As Ended**  
The on-behalf-of posture was closed and normal attribution boundaries restored.

**Administrative Break-Glass Access Invoked**  
Emergency elevation occurred outside normal scope under explicit break-glass policy.

**Administrative Cross-Subject Access Authorized**  
An operator was permitted to reach across normal segregation boundaries for a governed reason.

Administrative Access events do not record console navigation. They record **governance-relevant capability**, not which screen loaded.

---

## 6. Administrative Decision Events

Administrative Decision events assert **how a pending administrative judgment was formed, held, or governed** before final approval, rejection, or override.

**Administrative Decision Initiated**  
A governed administrative review or judgment process was opened on a subject.

**Administrative Decision Recorded**  
The platform captured a definitive administrative judgment ready for effect or communication.

**Administrative Decision Deferred**  
A required administrative judgment was intentionally postponed under policy.

**Administrative Decision Referred**  
Judgment responsibility moved to another operator, tier, or governance body.

**Administrative Decision Recalled Before Effect**  
A recorded judgment was withdrawn before it altered live posture.

**Administrative Dual-Control Required**  
Policy demanded a second authorized operator before effect.

**Administrative Dual-Control Satisfied**  
The second authorization requirement was met.

**Administrative Decision Rationale Declared**  
The operator supplied a governed explanation material to accountability or audit.

Decision events mark **judgment process truth**. Final affirmative or negative effect may additionally appear in Approval or Rejection families.

---

## 7. Administrative Approval Events

Administrative Approval events assert **affirmative privileged decisions** with operational, security, legal, or business consequence.

**Administrative Approval Granted**  
A general affirmative administrative decision took effect on a governed subject.

**Administrative Conditional Approval Issued**  
Approval was granted with explicit conditions that must be satisfied or monitored.

**Administrative Approval Scope Limited**  
Affirmative decision applied only to a narrowed scope rather than full requested effect.

**Administrative Participation Approved**  
An operator affirmatively approved a participation path such as owner or elevated user standing.

**Administrative Case Approved**  
An operator affirmatively closed an administrative case in favor of the subject or request.

**Administrative Commercial Exception Approved**  
An operator approved departure from standard commercial or pricing posture.

**Administrative Verification Outcome Affirmed**  
An operator upheld or affirmed a verification posture as administratively final.

**Administrative Appeal Approved**  
A prior negative administrative or domain outcome was overturned on appeal.

Approval events correlate with domain-specific authorization facts. They do not replace Owner, Marketplace, or Verification domain classes when those domains own the native outcome layer.

---

## 8. Administrative Rejection Events

Administrative Rejection events assert **negative privileged decisions** with operational, security, legal, or business consequence.

**Administrative Rejection Issued**  
A general negative administrative decision took effect on a governed subject.

**Administrative Rejection With Remediation Required**  
Rejection included explicit required corrections before reconsideration.

**Administrative Participation Rejected**  
An operator denied a participation path such as owner or elevated standing.

**Administrative Case Rejected**  
An operator closed an administrative case against the subject or request.

**Administrative Submission Rejected**  
An operator rejected material submitted for administrative review.

**Administrative Commercial Exception Denied**  
An operator refused departure from standard commercial or pricing posture.

**Administrative Appeal Denied**  
A request to overturn a prior outcome was refused.

**Administrative Request Dismissed**  
A pending administrative request was closed without affirmative effect.

Rejection events must remain distinct from Verification rejection when verification process owns the review path. Correlation applies when both truths exist.

---

## 9. Administrative Override Events

Administrative Override events assert **deliberate bypass, restoration, or correction** of outcomes that would otherwise stand without privileged intervention.

**Administrative Override Applied**  
An operator replaced or superseded a standing outcome with privileged authority.

**Administrative Automated Outcome Overridden**  
A machine-produced decision or state was manually superseded.

**Administrative Policy Exception Granted**  
Standard policy enforcement was explicitly waived for a governed reason.

**Administrative Restriction Bypassed**  
A hold, block, or limit was removed or circumvented through privileged action.

**Administrative State Restored**  
Live state was manually returned to a prior governed posture.

**Administrative Manual Correction Applied**  
Incorrect live state was corrected without pretending the error never occurred.

**Administrative Override Reversed**  
A prior override was itself undone under governance.

**Administrative Forced Transition Applied**  
A subject was moved to a target lifecycle state by operator authority rather than native domain flow.

Override is among the highest-risk administrative memory. It must never be implied by silent state drift.

---

## 10. Administrative Configuration Events

Administrative Configuration events assert **material changes to how the platform behaves**, not cosmetic operator preferences.

**Administrative Platform Setting Changed**  
A governed platform setting with consequential effect was altered.

**Administrative Risk Threshold Adjusted**  
A threshold affecting approval, blocking, or escalation behavior was changed.

**Administrative Workflow Rule Changed**  
A rule governing how cases progress or auto-route was altered.

**Administrative Integration Behavior Changed**  
How the platform relates to an external boundary was manually reconfigured with material effect.

**Administrative Feature Exposure Changed**  
User, owner, or investor-facing capability exposure was manually changed with business effect.

**Administrative Retention Or Evidence Posture Changed**  
Governed handling of evidence or retention-sensitive behavior was manually adjusted.

**Administrative Configuration Rollback Applied**  
A prior configuration posture was deliberately restored after harmful or mistaken change.

Configuration events require **materiality**. Changing a personal dashboard layout is not administrative institutional memory.

---

## 11. Administrative Emergency Events

Administrative Emergency events assert **acute containment, suspension, or break-glass** when normal flow is insufficient for risk.

**Administrative Emergency Declared**  
The platform recognized an acute administrative emergency context.

**Administrative Emergency Freeze Applied**  
A subject, case, or surface was frozen to stop further harmful change.

**Administrative Emergency Suspension Applied**  
Participation, access, or commercial activity was suspended under emergency authority.

**Administrative Emergency Rollback Initiated**  
An emergency reversal of recent harmful change was started.

**Administrative Emergency Access Elevated**  
Break-glass or emergency-only capability was activated for containment.

**Administrative Emergency Containment Completed**  
The immediate harm-containment phase ended with recorded outcome.

**Administrative Emergency Cleared**  
Emergency posture was formally lifted and normal governance resumed.

Emergency events pair naturally with Security and System domain signals. They record **operator emergency action**, not every monitoring alert.

---

## 12. Administrative Accountability

Administrative Accountability defines **how privileged action remains attributable and reviewable** after the fact.

Accountability principles:

1. **Actor visibility** — Consequential administrative events must remain tied to the governing operator identity, not anonymous console action.
2. **Segregation of duties** — High-risk actions should show when dual control or referral was required and satisfied.
3. **Post-action review** — Sensitive interventions remain open to retrospective governance review without rewriting history.
4. **Challenge path** — Disputed administrative action must be distinguishable from undisputed action in memory.
5. **No retroactive silence** — Removing UI access does not remove the obligation to preserve what was done.

**Administrative Actor Attributed**  
Responsibility for a consequential action was bound to a governed operator identity.

**Administrative Action Review Scheduled**  
A post-action governance review was required by policy.

**Administrative Action Review Completed**  
A retrospective review of a privileged action concluded.

**Administrative Action Challenged**  
A governed party or internal reviewer formally disputed a prior administrative fact.

**Administrative Action Upheld On Review**  
Challenge or review confirmed the original administrative fact.

**Administrative Action Corrected After Review**  
Review produced a new corrective administrative fact rather than silent erasure.

**Administrative Segregation Violation Prevented**  
Policy blocked an action because required separation of duties was not met.

Accountability events supplement action families. They do not replace Approval, Rejection, or Override classes.

---

## 13. Administrative Evidence

Administrative Evidence describes **what supporting material makes privileged action defensible** without turning the Black Box into an operator file dump.

Evidence principles:

1. **Reference over duplication** — Prefer governed references to case material, tickets, or domain artifacts when full content is stored elsewhere.
2. **Rationale when material** — Declared rationale is memory when policy or dispute risk requires it; it is not an invitation to log casual notes.
3. **Before-and-after posture** — Investigators should reconstruct what changed, not only that someone clicked approve.
4. **Emergency proportionality** — Break-glass should remain explainable without publishing sensitive operational detail unnecessarily.
5. **Correlation with domain evidence** — Owner submissions, documents, and verification artifacts correlate; admin evidence does not absorb them.

Typical evidence attachments conceptually include:

- governed operator identity and elevation context at time of action
- subject identifiers as correlation keys, not merged domain records
- declared rationale or remediation requirements when policy demands
- dual-control or referral trail when applicable
- references to appealed or overridden prior events
- emergency declaration context and clearance record
- timestamps and sequence relative to neighboring domain events

Administrative evidence strengthens governance disputes. It does not replace Documents, Verification, or Security domain memory.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how administrative action relates to neighboring catalogs** without collapse.

**Authentication domain**  
Owns sign-in and session establishment for all participants. Administrative privilege activation correlates when elevation is distinct from routine auth.

**User Account domain**  
Owns account participation truth. Administrative correction of account standing correlates; native account lifecycle remains there.

**Owner domain**  
Owns owner journey and authorization finale. Administrative participation approval correlates without merging classes.

**Property and Documents domains**  
Own subject and custody truth. Administrative rejection of submission correlates with native intake facts.

**Verification domain**  
Owns review process and outcomes. Administrative affirmation or override correlates when operator authority is the deciding layer.

**Marketplace domain**  
Owns investor-visible opportunity truth. Administrative forced publication or retraction correlates here.

**Purchase and Payment domains**  
Own commercial and financial truth. Administrative commercial exception correlates; capture remains in payment memory.

**Legal domain**  
Owns binding policy acceptance. Administrative waiver of legal gate correlates at high risk.

**Security domain**  
Owns threat, abuse, and incident signals. Emergency administrative action correlates when containment follows risk.

**Notification domain**  
Owns delivery taxonomy. Administrative decisions may trigger notices elsewhere without encoding delivery here.

**Factory, Engine, Pipeline, and Enrichment domains**  
Own automated causality. Administrative override of machine output correlates without absorbing run history.

**Governance layer**  
Owns catalog and constitutional amendment. Changing Black Box rules is governance, not routine admin action catalog memory.

Boundary discipline keeps **one clear trail of privileged power** without making Admin the catch-all for every platform story.

---

## 15. Future Evolution

Admin catalog evolution may add new event classes only when **new privileged action truth** must be preserved.

**Allowed evolution**

- Finer emergency and break-glass classes as incident playbooks mature
- Additional dual-control and referral classes when governance structure grows
- Clearer conditional approval classes when dispute review exposes ambiguity
- Distinct configuration classes when new integration or risk surfaces appear

**Evolution requirements**

Every proposed admin event class must answer:

1. What privileged action truth does it assert that existing classes do not?
2. Does it meet the materiality standard — operational, security, legal, or business impact?
3. Does it avoid navigation, telemetry, and operator convenience noise?
4. Can it correlate with domain catalogs without merging them?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging admin screen views, menu navigation, or search activity as institutional memory
- Merging approval, override, and emergency into one convenience class
- Using admin events as a substitute for Verification or Owner domain outcomes
- Silent state correction without override or correction event classes
- Recording every micro-toggle in the console without materiality review
- Making Admin UI existence a prerequisite for defining administrative event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Operator convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Admin domain**.

Administrative Access marks when elevated capability was in play. Decision, Approval, and Rejection mark how judgment formed and concluded. Override and Configuration mark when operators changed outcomes or platform behavior. Emergency marks containment under acute risk. Accountability and Evidence mark who remains answerable and why the action is defensible.

Technical representation comes later. Privileged power truth begins here.
