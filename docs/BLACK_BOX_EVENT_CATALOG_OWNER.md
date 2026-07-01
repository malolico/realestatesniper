# RealEstateSniper Black Box — Event Catalog: Owner

Sixth functional catalog of **conceptual owner lifecycle events** for the Black Box.

This document defines **which event types exist across the owner journey**, from first contact through final authorization or rejection. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Owner, Property, Document, and Verification domains).  
For owner legal acceptance, see `BLACK_BOX_EVENT_CATALOG_LEGAL.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For integration at the owner boundary, see `BLACK_BOX_INTEGRATION_MODEL.md`.

---

## 1. Purpose

The Owner Event Catalog exists to make **owner participation memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- How do invited owners and organic owners enter the platform differently, and where do those paths converge?
- What did the owner assert about property interest, and when did the platform receive it?
- How did verification and review progress before final authorization or rejection?
- What communications and decisions shaped the case along the way?

Owner is the sixth functional catalog because off-market participation is a **trust-critical spine** of RealEstateSniper. Disputes about fraud, misrepresentation, broker risk, and fair treatment begin with what the owner did, what the platform recognized, and what was ultimately authorized.

---

## 2. Scope

**Inside scope**

- Invited owner entry, invitation lifecycle, and onboarding
- Organic owner entry and self-initiated registration
- Property interest claims and submission journeys
- Owner-side verification progression and review posture
- Final authorization, conditional authorization, or rejection of owner participation
- Owner communications material to the case
- Owner-initiated withdrawals, declines, and acknowledgments

**Outside scope**

- Generic user account lifecycle unrelated to owner participation — User Account domain
- Legal text acceptance as binding policy fact — Legal domain, correlatable
- Operational document bytes and custody mechanics — Document domain
- Property subject identity separate from owner action — Property domain, correlatable
- Verification domain review mechanics when owned elsewhere — correlatable, not merged
- Marketplace publication of resulting deals — Marketplace domain
- Privileged operator overrides — Admin domain
- Authentication and routine sign-in — Authentication domain

This catalog owns the **owner participation journey** as an investigable story. Neighboring domains own specialized layers that correlate without collapse.

---

## 3. Owner Event Philosophy

Owner events record **participation intent, submission truth, review progression, and final outcome** — not every portal page view.

Philosophy principles:

1. **Two entry paths, one accountability standard** — Invited Owner and Organic Owner must both be reconstructible without blurring origin.
2. **Assertion before approval** — What the owner claimed is recorded before the platform approves or rejects it.
3. **Authorization is the finale** — Final authorization or rejection is a distinct event class, not implied by earlier steps.
4. **Verification is progressive** — Review milestones are memory, not a single opaque outcome.
5. **Communication matters** — Notices that affect awareness or timely response are first-class where consequential.
6. **Owner decisions are memory** — Withdrawals and declines are as investigable as platform rejections.
7. **No marketplace smuggling** — Owner events must not silently encode deal publication or investor visibility.

Owner memory defends the platform in property-trust disputes. It must remain legible years later.

---

## 4. Owner Event Families

Owner events group into **eight families** plus cross-cutting evidence and boundary guidance.

- **Owner Invitation** — invited owner entry and invitation lifecycle
- **Owner Registration** — owner onboarding and participation establishment
- **Property Claim** — assertion of property interest or authority
- **Property Submission** — structured submission of property participation material
- **Owner Verification** — review progression for owner credibility and case readiness
- **Authorization** — final platform decision to authorize or reject participation
- **Owner Communication** — consequential notices and responses in the owner journey
- **Owner Decision** — owner-initiated choices that change or end participation

Families may correlate tightly in one case but must remain **separate event classes**. An organic owner may claim property, submit material, pass verification, and receive authorization as distinct facts — not one merged story.

---

## 5. Owner Invitation Events

Owner Invitation events assert **how an invited owner entered the journey** through a governed invitation path.

**Owner Invitation Created**  
The platform or a governed actor initiated an invitation for a specific owner participation path.

**Owner Invitation Sent**  
The invitation was dispatched through a governed delivery channel.

**Owner Invitation Delivery Failed**  
The invitation could not be delivered in a material way.

**Owner Invitation Opened**  
The invited party engaged with the invitation entry point in an accountability-relevant way.

**Owner Invitation Accepted**  
The invited party accepted the invitation and began the invited owner path.

**Owner Invitation Declined**  
The invited party explicitly refused the invitation.

**Owner Invitation Expired**  
The invitation window ended without acceptance.

**Owner Invitation Revoked**  
The invitation was withdrawn before completion under governed conditions.

**Invited Owner Path Recognized**  
The platform recognized ongoing participation as originating from invitation rather than organic entry.

Invitation events establish invited origin. They do not create final authorization on their own.

---

## 6. Owner Registration Events

Owner Registration events assert **establishment of owner participation** after entry, for both invited and organic paths.

**Organic Owner Path Entered**  
A participant began owner participation without a preceding invitation.

**Owner Registration Initiated**  
An owner onboarding path began under governed rules.

**Owner Registration Completed**  
The platform recognized completion of owner registration requirements.

**Owner Registration Abandoned**  
An owner registration path was left incomplete in an accountability-relevant way.

**Owner Registration Rejected**  
The platform refused owner registration because eligibility or validation failed.

**Invited Owner Onboarding Completed**  
An invited owner finished onboarding distinct from generic registration completion where material.

**Organic Owner Onboarding Completed**  
An organic owner finished onboarding distinct from invited path where material.

**Owner Profile Established For Participation**  
The owner participation profile reached a governed ready state for case work.

**Owner Participation Role Recognized**  
The platform recognized the participant as an owner-class participant for off-market flows.

Registration events mark participation birth. They do not assert property claim, verification approval, or final authorization.

---

## 7. Property Claim Events

Property Claim events assert **owner statements of property interest or authority** before or outside full structured submission.

**Property Interest Claimed**  
The owner asserted interest in a specific property or property case.

**Property Authority Asserted**  
The owner claimed authority to act for the property — for example, ownership, control, or listing authority.

**Property Claim Amended**  
A prior property claim was materially changed by the owner.

**Property Claim Withdrawn**  
The owner withdrew a property claim before or after submission.

**Multiple Property Claim Conflict Detected**  
The platform recognized conflicting claims affecting trust.

**Property Claim Scope Narrowed**  
The owner reduced or clarified the scope of a prior claim.

**Property Claim Scope Expanded**  
The owner broadened the scope of a prior claim in a material way.

Property Claim events own assertion truth. Verification approval and marketplace publication belong elsewhere.

---

## 8. Property Submission Events

Property Submission events assert **structured progression of property participation material** supplied by the owner.

**Property Submission Initiated**  
The owner began a governed property submission path.

**Property Submission Step Completed**  
A material step in the submission path was completed — recorded only where step truth is accountability-relevant, not for every UI transition.

**Property Submission Completed**  
The owner completed the governed submission path.

**Property Submission Abandoned**  
A submission path was left incomplete in an accountability-relevant way.

**Property Submission Returned For Correction**  
The platform required the owner to correct submission material before proceeding.

**Property Information Amended After Submission**  
The owner materially amended submitted property information.

**Property Submission Resubmitted**  
The owner submitted corrected or renewed material after return or lapse.

**Required Submission Element Missing**  
The platform recognized that required submission content was absent at a material checkpoint.

Submission events record what the owner supplied and when the platform received it. Document custody details correlate with Document domain.

---

## 9. Owner Verification Events

Owner Verification events assert **review progression for owner and case credibility** along the owner journey.

**Owner Verification Requested**  
The platform opened or recognized need for owner verification review.

**Owner Verification Materials Required**  
The platform identified missing materials required before review could continue.

**Owner Verification Review Started**  
Governed review of the owner case began.

**Owner Verification Review Paused**  
Review paused for material reason — for example, awaiting owner response or external fact.

**Owner Verification Review Resumed**  
Paused review continued under governed conditions.

**Owner Identity Credibility Confirmed**  
The platform recognized sufficient owner identity credibility for the case stage.

**Owner Identity Credibility Failed**  
Owner identity credibility did not meet requirements for the case stage.

**Owner Verification Escalated**  
The case moved to higher scrutiny because of risk, conflict, or complexity.

**Owner Reverification Required**  
Earlier verification posture expired or was invalidated, requiring renewed review.

**Owner Verification Expired**  
Verification validity ended under governed rules before authorization.

Owner Verification events describe review progression on the owner journey. Final authorization remains a separate family.

---

## 10. Authorization Events

Authorization events assert **final or governing platform decisions** to permit or deny owner participation and property use.

**Owner Participation Authorized**  
The platform authorized the owner to participate in governed off-market flows.

**Property Participation Authorized**  
The platform authorized a specific property case for continued participation or next-stage use.

**Owner Authorization Conditionally Granted**  
Authorization was granted with explicit conditions that remained in force.

**Owner Authorization Rejected**  
The platform rejected owner or property participation after review.

**Owner Authorization Revoked**  
Prior authorization was withdrawn under governed conditions.

**Owner Authorization Suspended Pending Review**  
Authorization was temporarily suspended while review continued.

**Owner Authorization Reinstatement Granted**  
Suspended or conditional authorization returned to active governed standing.

**Final Owner Case Decision Recorded**  
The platform recognized closure of the authorization decision path for the case.

Authorization is the finale of the owner journey for investigation purposes. It must be explicit, not inferred from earlier steps.

---

## 11. Owner Communication Events

Owner Communication events assert **consequential communication** during the owner journey.

**Owner Notified Of Status Change**  
The owner was sent a governed notice of material status change in the case.

**Owner Information Request Sent**  
The platform requested additional information or action from the owner.

**Owner Response Received**  
The platform recognized receipt of a material owner response to a request or notice.

**Owner Communication Delivery Failed**  
A consequential owner notice failed to deliver.

**Owner Reminder Sent**  
A governed reminder was sent for pending action or expiring step.

**Owner Outcome Notice Sent**  
The owner was notified of verification or authorization outcome.

**Owner Communication Suppressed By Policy**  
A notice was intentionally not sent because policy blocked delivery.

Communication events prove awareness efforts. They do not replace the underlying authorization or verification fact.

---

## 12. Owner Decision Events

Owner Decision events assert **choices the owner made** that changed or ended participation.

**Owner Declined To Proceed**  
The owner explicitly chose not to continue the participation path.

**Owner Participation Withdrawn**  
The owner withdrew from owner participation broadly.

**Owner Listing Withdrawn**  
The owner withdrew a property listing or submission from participation.

**Owner Authorization Decision Acknowledged**  
The owner acknowledged receipt of a final or interim platform decision where that acknowledgment is material.

**Owner Requested Case Closure**  
The owner asked to close the case or end review.

**Owner Requested Case Reopening**  
The owner asked to reopen a closed or rejected case under governed rules.

**Owner Accepted Conditional Authorization**  
The owner accepted authorization subject to explicit conditions.

**Owner Rejected Conditional Authorization**  
The owner refused offered conditional authorization.

Owner decisions are participant truth. They do not override platform authorization events; they correlate with them.

---

## 13. Owner Evidence

Owner events may be supported by **linked evidence** without embedding sensitive property or identity material unnecessarily.

Evidence types appropriate to this domain include:

- Invitation delivery and acceptance references
- Submission receipt references tying owner action to platform recognition time
- Document linkage references when material supported verification — without inlining content
- Communication delivery references for outcome or request notices
- Review case references for escalation or authorization decisions
- Legal acceptance references when owner disclosures were required before proceeding

Evidence principles for owner:

- Evidence corroborates; it does not replace owner assertions or platform decisions.
- Property and identity material should be referenced or redacted where possible.
- Provisional verification or conditional authorization must be visibly qualified.
- Contradiction between owner assertion and review outcome must remain visible.

Owner evidence strengthens chain-of-custody thinking in property-trust disputes. It does not turn the Black Box into a document warehouse.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how owner journey memory relates to neighboring truth**.

**Property domain**  
Owns property subject identity and property-level assertions separate from owner actor truth. Owner claim and submission events correlate with property facts.

**Document domain**  
Owns intake, acceptance, and rejection of documentary proof. Owner submission correlates; document custody remains there.

**Verification domain**  
Owns formal verification taxonomy when maintained as a separate master domain. This catalog records owner-journey verification progression; specialized verification catalogs may extend without merge.

**Legal domain**  
Owns binding acceptance of disclosures and owner authorizations as legal fact. Owner journey correlates at acceptance moments.

**User Account and Authentication domains**  
Own participant existence and access. Owner registration correlates when an account becomes owner-class.

**Marketplace domain**  
Owns resulting deal visibility if a property later enters investor opportunity. Authorization precedes but does not equal publication.

**Admin domain**  
Owns privileged manual intervention. Authorization or rejection may correlate with admin action without absorbing it.

**Notification domain**  
Owns generic notification taxonomy. Owner Communication records owner-journey consequential notices.

Boundary discipline keeps the owner story investigable without becoming a catch-all case log.

---

## 15. Future Evolution

Owner catalog evolution may add new event classes only when **new owner journey truth** must be preserved.

**Allowed evolution**

- Finer invited versus organic distinctions if entry models multiply
- Additional submission checkpoint classes when dispute review exposes ambiguity
- Clearer conditional authorization classes as risk rules mature
- New communication classes for legally required owner notices

**Evolution requirements**

Every proposed owner event class must answer:

1. What owner participation truth does it assert that existing classes do not?
2. Does it preserve invited versus organic origin where relevant?
3. Does it keep assertion, verification, and authorization separable?
4. Can it correlate with property, document, and legal domains without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Merging invitation, submission, verification, and authorization into one convenience class
- Logging every portal navigation as institutional memory
- Encoding marketplace publication inside authorization events
- Silent relabeling of past owner classes when onboarding is redesigned
- Using owner events as generic CRM activity tracking

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Owner journey**.

Invited Owner and Organic Owner enter through different families but converge toward the same accountability standard. Property Claim and Property Submission record what was asserted and supplied. Owner Verification records review progression. Authorization records the final platform decision. Communication and Owner Decision record notices and participant choices along the way.

Technical representation comes later. Owner trust truth begins here.
