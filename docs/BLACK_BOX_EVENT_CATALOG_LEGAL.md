# RealEstateSniper Black Box — Event Catalog: Legal

Third functional catalog of **conceptual legal and consent events** for the Black Box.

This document defines **which event types exist within the Legal domain**, what each type asserts, and how they group for investigation. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries, see `BLACK_BOX_EVENT_CATALOG.md` (Legal Domain).  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For naming grammar when events are registered, see `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For retention and lawful handling, see `BLACK_BOX_RETENTION_AND_EVIDENCE_POLICY.md`.

---

## 1. Purpose

The Legal Event Catalog exists to make **consent and legal acceptance memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which classes of legal fact must the Black Box be able to record?
- How are acceptance, withdrawal, and version change grouped for investigators?
- What does each event type assert — and what belongs to other domains?
- How does legal memory support defensibility when access, monetization, or data use is challenged?

Legal is the third functional catalog because participation and commerce disputes often turn on **what was accepted, by whom, under which policy version, and when** — not only on what the product did afterward.

---

## 2. Scope

**Inside scope**

- Terms, privacy, and policy acceptance or rejection
- General and scoped consent grant, denial, and permitted withdrawal
- Marketing and communication consent where legally meaningful
- Owner disclosures, representations, and participation authorizations
- Investor and founder agreement acceptance
- Acceptance of legal documents presented for binding effect
- Publication, supersession, and reacceptance of legal text versions

**Outside scope**

- Account creation, suspension, or deletion — User Account domain
- Authentication and email verification at the access gate — Authentication domain
- Property verification decisions — Verification domain
- Operational document intake for proof — Document domain, correlatable with legal acceptance
- Purchase and payment facts — Purchase and Payment domains
- Privileged operator legal overrides — Admin domain
- Legal conclusions, counsel opinions, or court outcomes — outside product memory

Legal owns **contemporaneous acceptance and consent truth**. It does not replace proof of identity, account state, or commercial entitlement.

---

## 3. Legal Event Philosophy

Legal events record **what was knowingly accepted or refused under governed legal text**, not every checkbox interaction.

Philosophy principles:

1. **Contemporaneous truth** — Acceptance must be recorded as it was recognized when participation or monetization depended on it.
2. **Version binding** — Acceptance is meaningless without the legal version in force at the moment of acceptance.
3. **Attribution discipline** — Legal events must support who accepted or refused, with appropriate confidence.
4. **Withdrawal is memory** — Permitted consent withdrawal is as investigable as grant.
5. **Refusal is explicit** — Rejection and blocked participation are distinct from mere non-completion.
6. **Separation from proof storage** — Legal events assert acceptance; they do not embed full document bodies recklessly.
7. **No legal conclusion smuggling** — The Black Box records platform-recognized acceptance facts, not judicial determinations.

Legal memory defends what the platform can show was agreed. It does not invent compliance by omission.

---

## 4. Legal Event Families

Legal events group into **eight families** plus cross-cutting evidence and compliance considerations. Each family owns a distinct layer of legal acceptance truth.

- **Terms and Conditions** — platform terms governing use
- **Privacy Policy** — data and privacy posture acceptance
- **Consent** — general legally meaningful consent actions
- **Marketing Consent** — communication and marketing permission
- **Owner Authorization** — owner disclosures and participation authority
- **Investor Agreement** — investor and founder binding agreements
- **Document Acceptance** — acceptance of presented legal documents
- **Legal Version** — lifecycle of legal text versions and reacceptance

Families may correlate in one onboarding journey but must remain **separate event classes**. Accepting terms and accepting privacy policy are related facts, not one undifferentiated legal event.

---

## 5. Terms & Conditions Events

Terms and Conditions events assert **recognition of platform use terms** and participation gating tied to them.

**Terms Presented**  
Governed terms text was presented to the participant in a context material to acceptance.

**Terms Accepted**  
The participant accepted the terms version in force at that moment.

**Terms Rejected**  
The participant explicitly refused the presented terms.

**Terms Acceptance Required**  
The platform blocked further participation until terms acceptance occurred.

**Terms Acceptance Incomplete**  
A terms flow was started but left incomplete in an accountability-relevant way.

**Terms Participation Blocked**  
Participation remained blocked because required terms acceptance had not occurred.

Terms events bind use of the platform. They do not assert privacy, marketing, or investor-specific agreements unless those are separately recorded in their families.

---

## 6. Privacy Policy Events

Privacy Policy events assert **recognition of data and privacy posture** binding on participation or data use.

**Privacy Policy Presented**  
The governed privacy policy was presented in a context material to acceptance.

**Privacy Policy Accepted**  
The participant accepted the privacy policy version in force at that moment.

**Privacy Policy Rejected**  
The participant explicitly refused the presented privacy policy.

**Privacy Policy Reacceptance Required**  
A new or changed privacy policy required renewed acceptance before continued governed participation or data use.

**Privacy Policy Acceptance Incomplete**  
A privacy acceptance flow was started but left incomplete in an accountability-relevant way.

Privacy events own data-use acceptance truth. They do not record every analytics configuration change in the product.

---

## 7. Consent Events

Consent events assert **general legally meaningful permission** not better owned by a more specific legal family.

**Consent Granted**  
The participant granted a governed consent scope under applicable legal rules.

**Consent Denied**  
The participant explicitly refused a governed consent request.

**Consent Withdrawn**  
The participant withdrew previously granted consent where withdrawal is permitted.

**Consent Scope Changed**  
The governed scope of an existing consent materially changed through participant action.

**Consent Renewal Completed**  
A time-bound or renewable consent was affirmatively renewed.

**Consent Expired**  
A governed consent reached the end of its validity period under applicable rules.

**Consent Required But Missing**  
The platform recognized that required consent had not been obtained before a consequential action proceeded or was blocked.

General consent events must not swallow marketing, owner, or investor-specific consent that belongs in dedicated families.

---

## 8. Marketing Consent Events

Marketing Consent events assert **permission to communicate for marketing or promotional purposes** where legally distinct from core platform terms.

**Marketing Consent Granted**  
The participant opted in to governed marketing communication.

**Marketing Consent Withdrawn**  
The participant opted out or withdrew marketing permission where permitted.

**Marketing Consent Updated**  
Marketing permission changed in scope, channel, or category in a legally meaningful way.

**Marketing Channel Preference Recorded**  
A channel-specific marketing permission with legal effect was recorded.

**Marketing Consent Required**  
A marketing action was blocked pending required permission.

Transactional or legally mandatory service communications are not marketing consent merely because they use a notification channel.

---

## 9. Owner Authorization Events

Owner Authorization events assert **owner disclosures, representations, and authority to participate** in off-market or owner-facing flows.

**Owner Disclosure Presented**  
A governed owner disclosure was presented before participation continued.

**Owner Disclosure Accepted**  
The owner accepted the disclosure version in force at that moment.

**Owner Disclosure Rejected**  
The owner refused required disclosure.

**Owner Representation Confirmed**  
The owner affirmed a representation material to platform use — for example, authority to discuss or list a property.

**Owner Authorization Granted**  
The platform recognized owner authority to proceed in a governed owner flow.

**Owner Authorization Revoked**  
Previously recognized owner authority was withdrawn under governed conditions.

**Owner Listing Authority Accepted**  
The owner accepted terms specific to listing or submission authority.

Owner Authorization events assert legal posture for owner participation. Property facts and verification outcomes belong elsewhere.

---

## 10. Investor Agreement Events

Investor Agreement events assert **binding agreements specific to investor or founder participation** beyond general terms.

**Investor Agreement Presented**  
A governed investor agreement was presented in a material context.

**Investor Agreement Accepted**  
The participant accepted the investor agreement version in force.

**Investor Agreement Rejected**  
The participant refused the investor agreement.

**Founder Agreement Presented**  
A governed founder-specific agreement was presented.

**Founder Agreement Accepted**  
The participant accepted the founder agreement version in force.

**Founder Agreement Rejected**  
The participant refused the founder agreement.

**Program Agreement Reacceptance Required**  
A changed investor or founder agreement required renewed acceptance.

Investor agreements concern participation and program rules. Commercial entitlement grants remain in Purchase domain.

---

## 11. Document Acceptance Events

Document Acceptance events assert **binding acceptance of legal documents** presented for explicit agreement, distinct from operational document proof intake.

**Legal Document Presented**  
A document with legal acceptance effect was presented to the participant.

**Legal Document Accepted**  
The participant accepted the presented legal document under governed rules.

**Legal Document Rejected**  
The participant refused a required legal document.

**Legal Document Acceptance Expired**  
An acceptance window or authorization tied to the document ended without completion.

**Required Legal Document Missing**  
A consequential action was blocked or flagged because a required legal document had not been accepted.

**Legal Document Superseded For Acceptance**  
A previously accepted legal document version was replaced by a new version requiring fresh acceptance.

Operational upload of verification documents is Document domain unless the upload itself is a governed legal acceptance act.

---

## 12. Legal Version Events

Legal Version events assert **changes to the legal text baseline** that affect what acceptance means over time.

**Legal Text Version Published**  
A new governed version of legal text became effective for future acceptance.

**Legal Text Version Superseded**  
A prior legal text version ceased to be the active version for new acceptance.

**Participant Notified Of New Legal Version**  
The platform recognized that a participant was notified of a material legal version change where notification itself is accountability-relevant.

**Reacceptance Required For New Legal Version**  
Continued participation or use required acceptance of a new legal version.

**Reacceptance Completed For New Legal Version**  
The participant accepted the new legal version under governed rules.

**Reacceptance Declined For New Legal Version**  
The participant refused reacceptance with material consequence to participation.

Version events preserve the policy timeline. They do not rewrite what was accepted under older versions.

---

## 13. Legal Evidence

Legal events may be supported by **linked evidence** without embedding full legal text or personal data unnecessarily.

Evidence types appropriate to this domain include:

- References to the legal text version identifier sufficient for reconstruction
- Presentation surface or flow references where material to dispute
- Timestamp and actor corroboration from authentication or account context
- Signature or acknowledgment mechanism references without storing raw signature images unless policy requires
- Notification delivery references when reacceptance notice is disputed
- External counsel or policy publication references for version publication events

Evidence principles for legal:

- Evidence corroborates acceptance; it does not replace the acceptance assertion.
- Full policy text may be referenced or archived under governed retention, not duplicated recklessly in unrestricted memory.
- Provisional acceptance states must be visible when confirmation is pending.
- Contradictory claims about acceptance require visible tension, not narrative smoothing.

Legal evidence strengthens defensibility. It does not turn the Black Box into a general document repository.

---

## 14. Compliance Considerations

Compliance considerations guide how legal events must behave **conceptually** across jurisdictions and policy change.

**Lawful purpose**  
Legal memory exists to demonstrate due diligence in consent and acceptance, not to collect agreement artifacts without accountability need.

**Proportionality**  
Record the acceptance fact, version, and attribution necessary for dispute — not every UI hover or scroll event.

**Withdrawal and restriction**  
When law requires limiting use of prior consent memory, governed restriction records are preferred over silent erasure of audit lineage unless law explicitly mandates otherwise.

**Version integrity**  
Investigators must be able to reconstruct which legal text applied at acceptance time even after newer versions publish.

**Minor and incapacity boundaries**  
Where participation rules exclude certain actors, refusal or block events must be representable without fabricating acceptance.

**Cross-domain correlation**  
Legal acceptance often correlates with account creation, purchase, or owner submission. Correlation must not merge distinct facts.

**No legal advice by memory**  
The catalog preserves platform-recognized legal facts. Interpretation of law remains outside the Black Box.

Compliance considerations constrain design. They do not replace counsel, regulators, or formal legal process.

---

## 15. Future Evolution

Legal catalog evolution may add new event classes only when **new legally meaningful acceptance truth** must be preserved.

**Allowed evolution**

- New event classes for new agreements, disclosures, or consent models
- Finer version and reacceptance distinctions when policy change repeatedly confuses investigation
- Additional owner or investor agreement classes as programs mature
- Clearer marketing consent channel classes when regulations require them

**Evolution requirements**

Every proposed legal event class must answer:

1. What acceptance or consent truth does it assert that existing classes do not?
2. Is it primary in the Legal domain, not Account, Document, or Purchase?
3. Is it bound to legal version and attribution discipline?
4. Can it correlate without merging with neighboring families?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Recording checkbox clicks without investigable legal meaning
- Merging terms, privacy, and marketing consent into one generic acceptance class
- Encoding purchase or entitlement truth inside legal events
- Silent relabeling of past acceptance when legal text is reorganized
- Using legal events as marketing analytics or funnel telemetry

Amendments to this catalog require governance review alongside the master catalog, retention policy, and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Legal domain**.

Terms, Privacy, Consent, and Marketing Consent mark general platform permission. Owner Authorization and Investor Agreement mark participation-specific binding acts. Document Acceptance and Legal Version mark presented instruments and the timeline of legal text. Evidence and compliance considerations keep memory defensible without over-collection.

Technical representation comes later. Consent truth begins here.
