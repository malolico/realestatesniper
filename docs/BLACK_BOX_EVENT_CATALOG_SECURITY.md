# RealEstateSniper Black Box — Event Catalog: Security

Sixteenth functional catalog of **conceptual platform security events** for the Black Box.

This document defines **which event types exist when material facts affect the security, trust, integrity, or protection of the platform and its participants**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Security Domain).  
For Black Box memory protection architecture, see `BLACK_BOX_SECURITY_MODEL.md`.  
For authentication and access establishment, see `BLACK_BOX_EVENT_CATALOG_AUTHENTICATION.md`.  
For privileged operator action, see `BLACK_BOX_EVENT_CATALOG_ADMIN.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Security Event Catalog exists to make **platform protection memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did the platform detect threat, abuse, or policy violation with material consequence?
- What protective action was taken to block, challenge, contain, or isolate harm?
- How did security incidents open, escalate, resolve, and recover?
- How can investigators reconstruct a credible security timeline without inferring it from infrastructure noise?

Security is the sixteenth functional catalog because **trust in the platform depends on visible protection**, not only on product features. Users, owners, investors, and regulators must be able to see that material risk was recognized and governed.

---

## 2. Scope

**Inside scope**

- Threat and anomaly recognition with material security consequence
- Access protection through block, challenge, termination, and boundary enforcement
- Abuse detection, prevention, and restriction posture
- Security incident opening, classification, containment, resolution, and closure
- Governed security response and recovery actions
- Security policy violation and material control posture changes
- Evidence references that support security investigation and accountability

**Materiality standard**

A security event exists only when a fact **materially affects security, trust, integrity, or protection** of the platform or its participants. Technical logs, infrastructure telemetry, and routine metrics do not qualify.

**Outside scope**

- Application debug logs, stack traces, and verbose error dumps — not institutional memory
- Infrastructure metrics, CPU graphs, and network telemetry without security consequence — System domain or operational monitoring
- Routine single failed sign-in without threshold or pattern consequence — Authentication domain, correlatable
- Generic application errors without security posture change — Error taxonomy outside this catalog unless material
- Black Box memory-protection mechanics as architecture — Security Model document, not platform incident taxonomy
- Privileged operator emergency containment as exercise of power — Admin domain, correlatable
- Security alert delivery mechanics — Notification domain, correlatable
- Payment fraud chargeback truth — Purchase and Payment domains, correlatable

This catalog owns **platform security response truth**. It records protection facts; it does not replace authentication journeys or admin override histories.

---

## 3. Security Event Philosophy

Security events record **material protection facts**, not every signal a monitor could emit.

Philosophy principles:

1. **Consequence gates memory** — Detection matters when it changes protection posture or opens accountability obligation.
2. **Protection is visible** — Block, challenge, containment, and restriction must remain reconstructible.
3. **Incident is bounded** — Opening, escalation, containment, and closure are distinct facts, not one opaque alert.
4. **Response separate from detection** — Recognizing threat and acting on it are correlatable but not merged.
5. **Recovery is explicit** — Restored trust after incident requires visible recovery memory.
6. **Governance when material** — Policy violation and control changes matter when they affect how the platform protects participants.
7. **No telemetry smuggling** — Security events must not encode infrastructure metrics, debug traces, or authentication routine noise.

Security memory answers what the platform recognized and how it protected. It does not replace live monitoring systems or general application logging.

---

## 4. Security Event Families

Security events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Threat Detection** — recognition of material threat, anomaly, or integrity risk
- **Access Protection** — block, challenge, termination, and boundary enforcement on access
- **Abuse Prevention** — detection and restriction of misuse, flooding, and policy-breaking behavior
- **Security Incident** — opening, classification, escalation, containment, and closure of incidents
- **Security Response** — governed actions taken to neutralize or isolate material risk
- **Security Recovery** — restoration of trust, access, and security posture after harm or containment
- **Security Governance** — material policy violation, control posture, and security accountability facts

Families may correlate tightly in one episode but must remain **separate event classes**. Threat detection and incident opening are related but not one merged fact.

---

## 5. Threat Detection Events

Threat Detection events assert **when the platform recognized material threat, anomaly, or integrity risk**.

**Threat Detected**  
A governed security threat was recognized with material consequence.

**Suspicious Pattern Recognized**  
Behavior crossed a threshold suggesting coordinated or repeated risk.

**Anomalous Access Recognized**  
Access activity diverged materially from expected participant posture.

**Credential Compromise Suspected**  
The platform recognized evidence suggesting participant credentials may be compromised.

**Tamper Attempt Detected**  
An attempt to alter protected data, records, or trust paths was recognized.

**Integrity Threat Recognized**  
Risk to data or process integrity was identified with material security effect.

**Exfiltration Risk Recognized**  
The platform recognized risk of unauthorized data removal or exposure.

**Threat Severity Escalated**  
Standing threat posture was elevated due to increased risk.

Threat detection marks **recognition truth**. Protective action may additionally appear in Access Protection or Security Response families.

---

## 6. Access Protection Events

Access Protection events assert **when access was blocked, challenged, or terminated for security reasons**.

**Unauthorized Access Attempt Blocked**  
Access was refused before or at the trust boundary.

**Access Challenged**  
Additional verification was required before access could continue.

**Access Allowed After Challenge**  
Access resumed after successful security challenge.

**Sensitive Action Challenged**  
A high-risk action was gated by additional security verification.

**Session Terminated For Security**  
An active session was ended due to security posture.

**Privilege Boundary Enforced**  
Attempted action beyond authorized scope was prevented.

**Access Restriction Applied**  
Participant access was narrowed under security policy.

**Rate Protection Applied**  
Governed rate or volume limits blocked potentially abusive access attempts.

Access protection events mark **boundary enforcement truth**. Authentication sign-in outcomes may correlate when threshold or pattern elevates to security materiality.

---

## 7. Abuse Prevention Events

Abuse Prevention events assert **when misuse, flooding, or repeated violation was recognized and constrained**.

**Abuse Detected**  
Governed misuse of platform capability was recognized.

**Abuse Pattern Recognized**  
Repeated or coordinated misuse crossed material threshold.

**Automated Abuse Blocked**  
Machine-driven abusive behavior was prevented from continuing.

**Spam Or Flooding Prevented**  
Volume or repetition attack was blocked before material harm.

**Policy Violation Detected**  
Participant behavior violated a governed security or acceptable-use policy.

**Repeated Violation Threshold Reached**  
Accumulated violations triggered elevated security posture.

**Account Restriction Applied For Abuse**  
Participant capability was limited due to abuse recognition.

**Abuse Scope Isolated**  
Affected accounts, surfaces, or flows were isolated to prevent spread.

Abuse prevention marks **misuse constraint truth**. Security incidents may open when abuse severity warrants formal incident memory.

---

## 8. Security Incident Events

Security Incident events assert **how formal security incidents were opened, progressed, and closed**.

**Security Incident Opened**  
A governed security incident record began.

**Security Incident Classified**  
The incident received a governed severity or category posture.

**Security Incident Escalated**  
Incident responsibility or urgency moved to a higher tier.

**Security Incident Contained**  
Immediate spread or ongoing harm was brought under control.

**Security Incident Resolved**  
Root cause or active harm path was addressed with recorded outcome.

**Security Incident Closed**  
The incident episode ended with final posture recorded.

**Security Incident Reopened**  
A closed incident was revived due to new material evidence or recurring harm.

Incident events provide **episode containers** for security accountability. They do not replace individual detection or response facts inside the episode.

---

## 9. Security Response Events

Security Response events assert **governed actions taken to neutralize, isolate, or communicate about material risk**.

**Security Response Initiated**  
A governed response plan began after detection or incident opening.

**Containment Action Applied**  
Active measures isolated affected scope from further harm.

**Threat Neutralized**  
The recognized threat path was stopped or removed.

**Affected Scope Isolated**  
Accounts, data paths, or surfaces were segregated under response policy.

**Security Alert Dispatched**  
A consequential security notice was sent to affected parties or operators.

**External Referral Initiated**  
Material risk was escalated to external authority or vendor under policy.

**Security Response Completed**  
The active response phase ended with recorded outcome.

Response events mark **action truth**. Notification delivery details correlate in Notification domain without merging classes.

---

## 10. Security Recovery Events

Security Recovery events assert **restoration of trust, access, and security posture after containment or harm**.

**Security Recovery Initiated**  
A governed recovery path began after incident or containment.

**Compromised Credential Invalidated**  
Suspect credentials were revoked or forced to reset.

**Affected Access Restored**  
Previously restricted access was returned under validated posture.

**Security Posture Restored**  
Platform protection settings returned to normal governed baseline.

**Service Trust Restored After Incident**  
Affected product surfaces were cleared for normal use after validation.

**Recovery Validation Completed**  
Recovery steps were verified before closure.

**Security Recovery Closed**  
The recovery episode ended with recorded restoration posture.

Recovery pairs with Incident and Response families. Silent return to normal without recovery memory is disallowed conceptually.

---

## 11. Security Governance Events

Security Governance events assert **material security policy, control, and accountability facts** beyond a single incident episode.

**Security Policy Violation Recorded**  
A standing policy breach with accountability effect was formally recorded.

**Security Control Activated**  
A governed protective control was enabled with material platform effect.

**Security Control Deactivated**  
A protective control was disabled with material security consequence.

**Security Policy Updated**  
A governed security rule changed with material protection effect.

**Security Exception Granted**  
A temporary departure from standard security policy was authorized under governance.

**Security Audit Finding Recorded**  
A formal audit or review produced a material security accountability fact.

**Security Governance Review Completed**  
A scheduled or triggered security governance review concluded with recorded outcome.

Security Governance marks **standing rule and accountability truth**. Admin privileged override may correlate when operator authority granted an exception.

---

## 12. Security Evidence

Security Evidence describes **what supporting material makes protection facts defensible** without turning the Black Box into a SIEM log warehouse.

Evidence principles:

1. **Posture over noise** — Record what protection changed, not every monitor tick.
2. **Episode linkage** — Detection, response, and recovery should chain into reconstructible incident stories.
3. **Actor and scope clarity** — Who or what was affected should remain explainable without publishing unnecessary sensitive detail.
4. **Correlation discipline** — Link to authentication, admin, and notification facts without merging vocabularies.
5. **No log dump** — Debug traces and infrastructure metrics stay outside unless material to integrity threat facts.

Typical evidence attachments conceptually include:

- threat or abuse classification at time of recognition
- access block, challenge, or restriction posture
- incident classification and escalation trail
- containment and neutralization sequence
- recovery validation relative to prior restriction events
- references to security alerts sent when notification correlates
- correlation keys to affected participants or surfaces without full data exposure

Security evidence strengthens incident credibility and regulatory inquiry. It does not replace Authentication, Admin, or Notification domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Security truth relates to neighboring catalogs** without collapse.

**Authentication domain**  
Owns sign-in, session establishment, and credential challenge routine. Security correlates when threshold, pattern, or compromise elevates materiality.

**Admin domain**  
Owns privileged human authority. Operator emergency containment and security exceptions correlate without absorbing incident taxonomy.

**Notification domain**  
Owns communication delivery truth. Security alerts correlate; delivery mechanics remain there.

**User Account domain**  
Owns account participation lifecycle. Account restriction for abuse may correlate with account facts.

**Verification domain**  
Owns formal review process. Fraud review may correlate; verification owns review path.

**Legal domain**  
Owns binding policy acceptance. Regulatory disclosure obligations may correlate at material moments.

**System domain**  
Owns platform availability and infrastructure condition. Outage may correlate when it affects security posture interpretation.

**Integration domain**  
Owns external boundary authority. Third-party breach signals may correlate at detection layer.

**Factory, Engine, Pipeline, and Enrichment domains**  
Own automated production causality. Integrity threats in automated paths may correlate without absorbing run history.

**Black Box Security Model**  
Owns protection of institutional memory itself. Platform security events recorded here must not be confused with memory-integrity architecture rules.

Boundary discipline keeps **one protection story** without making Security the catch-all for every error or metric.

---

## 14. Governance

Security catalog governance defines **how Security event classes remain trustworthy** as threat landscape and platform posture evolve.

Governance principles:

1. **Materiality review** — New classes must prove security, trust, integrity, or protection truth demands them.
2. **Telemetry exclusion** — Logs, metrics, and monitor noise require explicit materiality review before class approval.
3. **Layer separation** — Security vocabulary must not absorb authentication routine, system health, or admin override facts.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Incident discipline** — Detection, response, and recovery must remain separable event classes.
6. **Amendment caution** — Retroactive relabeling when security posture models change requires governance review.

**Governance questions for every proposed security event class**

- Does this assert protection truth that existing classes do not?
- Would absence of this class leave incident or abuse timelines unexplained?
- Is it free of technical logs, infrastructure telemetry, and metric noise?
- Does it preserve separation from Authentication, Admin, and System domains?
- Can investigators correlate it without collapsing incident episode structure?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Monitor volume is not sufficient justification.

---

## 15. Future Evolution

Security catalog evolution may add new event classes only when **new protection accountability truth** must be preserved.

**Allowed evolution**

- Finer abuse-pattern classes when dispute review exposes ambiguity
- Additional recovery validation classes as incident playbooks mature
- Clearer governance exception classes as compliance requirements grow
- Distinct integrity-threat classes as automated production attack surface expands

**Evolution requirements**

Every proposed security event class must answer:

1. What protection truth does it assert that existing classes do not?
2. Does it meet the materiality standard — security, trust, integrity, or protection impact?
3. Does it avoid technical logs, telemetry, and metric noise?
4. Can it correlate with Authentication and Admin catalogs without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every firewall deny, metric spike, or debug error as institutional memory
- Merging detection, response, and incident into one convenience class
- Using security events as authentication sign-in or admin override shortcuts
- Absorbing infrastructure outage telemetry as security incident truth
- Silent restoration of access without recovery event classes
- Making SIEM or monitoring implementation a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Alert volume is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Security domain**.

Threat Detection and Access Protection mark when risk was recognized and bounded. Abuse Prevention marks misuse constraint. Security Incident marks formal episode containers. Response and Recovery mark action and restoration. Security Governance marks standing policy and control accountability. Evidence and boundaries keep protection truth legible without log noise or domain smuggling.

Technical representation comes later. Platform protection truth begins here.
