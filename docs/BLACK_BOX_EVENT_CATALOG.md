# RealEstateSniper Black Box — Event Catalog

Conceptual master catalog of **event domains** the Black Box must be able to represent.

This document defines **which domains of platform meaning exist** in the accountability memory model. It does not define final event names, fields, technical structure, storage, or implementation. Concrete event names will be registered later under `BLACK_BOX_EVENT_NAMING_STANDARD.md`.

For category philosophy and lifecycle, see `BLACK_BOX_EVENT_MODEL.md`.  
For constitutional taxonomy context, see `BLACK_BOX_CONSTITUTION.md`.  
For domain integration obligations, see `BLACK_BOX_INTEGRATION_MODEL.md`.

Every future event belongs to **one primary domain** from this catalog. Related domains may appear in explanation, correlation, or evidence links, but classification must remain clear for investigation.

---

## 1. Authentication Domain

**Purpose**  
Preserve truth about identity access to the platform: who attempted to enter, whether access succeeded, and whether identity signals were trusted or rejected.

**Scope**  
Sign-in and sign-out outcomes, session establishment and expiry, credential recovery flows, multi-factor challenges, blocked or suspicious access attempts, and other identity-boundary recognitions that affect attribution. This domain owns access truth, not entitlement or role truth.

**Why events exist in this domain**  
Authentication is the front door to accountability. Without durable memory of identity access, downstream events across purchases, marketplace, owner participation, and privileged action cannot be attributed confidently to a person, service, or session.

---

## 2. User Account Domain

**Purpose**  
Capture lifecycle changes to a participant's account as a durable identity on the platform.

**Scope**  
Account creation, activation, suspension, reactivation, closure, identity-affecting profile changes, merge or split decisions, and account states that determine whether someone may participate. This domain owns who exists on the platform as an account, not what they purchased or verified.

**Why events exist in this domain**  
User account memory answers whether a person was allowed to exist and participate at a given time. It is central to support, billing disputes, access restoration, and any investigation that begins with who the platform recognized as a user.

---

## 3. Legal Domain

**Purpose**  
Record legally meaningful consent, acknowledgment, and policy-bound acceptance by users, owners, or other participants.

**Scope**  
Terms of service acceptance, privacy policy acceptance, founder or owner disclosures, policy version acknowledgments, and permitted withdrawal of optional consent. This domain owns contemporaneous legal acceptance truth, not general product preference.

**Why events exist in this domain**  
Access, monetization, and data use are challenged in dispute. Legal domain events support defensibility by showing what was accepted, by whom, and under which policy context at the time it mattered.

---

## 4. Marketplace Domain

**Purpose**  
Document changes to the deal marketplace that affect what opportunities exist, how they are classified, and who may see them.

**Scope**  
Deal visibility, publication and removal, tier and classification changes, material scoring shifts, marketplace-wide integrity conditions, and eligibility changes that affect what investors could perceive as available. This domain owns marketplace presentation truth, not payment capture or owner assertions.

**Why events exist in this domain**  
The marketplace is the core product surface. Its history explains what investors could see, when, and under what classification — the central question in fairness, access, and investor dispute reconstruction.

---

## 5. Purchase Domain

**Purpose**  
Record business-level commercial actions that grant, change, or revoke product entitlement to deals or tiers.

**Scope**  
Completed or abandoned purchase journeys, entitlement grants and revocations, duplicate-prevention decisions, and purchase binding to specific deals or product tiers. This domain owns commercial entitlement meaning, not whether money physically moved.

**Why events exist in this domain**  
Purchases define what the platform decided a user was entitled to access. They are often the first question in refund, access, and fairness disputes, separate from raw financial fact.

---

## 6. Payment Domain

**Purpose**  
Capture payment attempts and financial outcomes as platform-recognized money truth, independent of product entitlement meaning.

**Scope**  
Payment initiation, authorization, capture, failure, cancellation, retry, partial outcomes, and internal reconciliation mismatches between financial expectation and recognized result. This domain owns platform-side payment truth, not external authority callbacks unless recognized at the same boundary.

**Why events exist in this domain**  
Money disputes require knowing whether the platform recognized that money moved, failed, or conflicted with expectation. Payment memory separates financial fact from purchase entitlement fact.

---

## 7. Founder Domain

**Purpose**  
Record truth about the founder program, cohort capacity, and founder-specific entitlements.

**Scope**  
Founder spot claims, cohort capacity conditions, trial boundaries, founder benefit grants and removals, and gating decisions unique to the founder growth mechanism. This domain owns scarce founder access truth, not general subscription or marketplace truth.

**Why events exist in this domain**  
The founder program is a controlled growth mechanism with limited capacity. Its history explains who received scarce access, when limits were reached, and whether founder treatment was applied consistently.

---

## 8. Owner Domain

**Purpose**  
Document owner-facing actions that assert property interest, initiate off-market participation, or change owner participation on the platform.

**Scope**  
Owner entry into participation flows, submission initiation and completion, owner profile changes with trust impact, invitation acceptance, withdrawal from participation, and owner-side preference changes that affect accountability. This domain owns owner intent and participation truth, not verification conclusions.

**Why events exist in this domain**  
Owner disputes begin with what the owner asserted and when the platform received it. Owner domain memory establishes participation intent separate from whether the platform later verified or approved it.

---

## 9. Property Domain

**Purpose**  
Preserve truth about property-related claims, listings, and property identity within owner and marketplace participation flows.

**Scope**  
Property assertion, association to owner participation, property withdrawal, property identity changes material to trust, and property-linked conditions that affect marketplace or verification journeys. This domain owns property subject truth, not the review decision itself.

**Why events exist in this domain**  
Property is the subject of many ownership and marketplace disputes. Separating property truth from owner action and verification outcome allows investigators to reconstruct what was claimed about a property without collapsing distinct layers of meaning.

---

## 10. Document Domain

**Purpose**  
Track document intake, validation outcomes, replacement, expiry, and restriction in trust-sensitive flows.

**Scope**  
Document submission received, acceptance and rejection, replacement, missing required material, expiry, access restriction, and linkage of documents to cases. This domain owns document handling truth, not the substantive verification verdict.

**Why events exist in this domain**  
Documents are often the strongest corroboration in owner and compliance disputes. Their history must be preserved with custody thinking while avoiding unnecessary exposure of sensitive content inside the assertion itself.

---

## 11. Verification Domain

**Purpose**  
Record the review and decision path for whether an owner or property claim is credible enough for platform use.

**Scope**  
Verification request and assignment, approval and rejection, escalation, expiry, reverification requirement, and material risk posture changes in the verification lifecycle. This domain owns review outcome truth, not raw document bytes or owner submission receipt.

**Why events exist in this domain**  
Verification protects marketplace integrity and reduces fraud, misrepresentation, and broker risk. Investigators must reconstruct who reviewed what, what decision was reached, and when trust posture changed.

---

## 12. Admin Domain

**Purpose**  
Record deliberate exercises of privileged human authority that alter users, deals, access, configuration, or governance outcomes.

**Scope**  
Manual approvals and rejections, overrides, suspensions, emergency corrections, and other consequential uses of elevated platform power. This domain owns privileged action truth, not the Black Box itself or registry definition.

**Why events exist in this domain**  
Privileged action without memory becomes unreviewable power. Administrative events make governance visible and defendable when operators change live state on behalf of the platform.

---

## 13. Factory Domain

**Purpose**  
Record orchestration truth from the platform's automated factory layer that coordinates generation, sync, or transformation work.

**Scope**  
Factory run lifecycle, pause and resume, configuration changes with material effect, and publication of automated output into product truth. This domain owns orchestration causality, not the behavior of every subordinate worker.

**Why events exist in this domain**  
Machine-driven change often has no human click behind it. Factory domain memory explains how coordinated automation entered the platform and when batch or orchestrated work altered trust-relevant state.

---

## 14. Engine Domain

**Purpose**  
Document behavior and health of individual engines within the factory ecosystem.

**Scope**  
Engine registration, start and stop, degradation, output production, input rejection, version change, and health warnings with material consequence. This domain owns component-level worker truth, not full pipeline choreography.

**Why events exist in this domain**  
Engines are specialized workers. When automated output is wrong or delayed, investigators need to isolate which component recognized the change or failure without inferring it from marketplace symptoms alone.

---

## 15. Pipeline Domain

**Purpose**  
Preserve truth about staged processing flows that move work through connected steps toward marketplace or enrichment outcomes.

**Scope**  
Pipeline stage progression, stage failure, handoff between steps, backlog or stall conditions, and pipeline-level outcomes that affect trust-relevant availability. This domain owns staged flow truth, not single-engine internals.

**Why events exist in this domain**  
Many platform changes traverse multiple steps. Pipeline memory reconstructs where work succeeded, stalled, or failed in sequence — essential for incident review and duplicate or partial-publish analysis.

---

## 16. Enrichment Domain

**Purpose**  
Record efforts to improve, classify, price, or qualify marketplace or trust-relevant data after initial creation.

**Scope**  
Enrichment start and completion, deferred enrichment, source conflict, pricing application, classification change from enrichment, and enrichment failure with material effect. This domain owns data improvement truth, not the original publish fact.

**Why events exist in this domain**  
Investors and operators often dispute not only what existed, but how it was qualified or priced. Enrichment memory separates original truth from later machine or rule-driven refinement.

---

## 17. Notification Domain

**Purpose**  
Preserve meaningful communication outcomes where delivery or failure has business, legal, or trust consequence.

**Scope**  
Consequential send attempts, deliveries, failures, retries, and channel outcomes tied to dispute-relevant communication. This domain owns communication result truth, not the underlying business fact that triggered the notice.

**Why events exist in this domain**  
Disputes frequently ask whether a party was informed when it mattered. Notification memory corroborates communication without replacing the originating domain assertion.

---

## 18. Security Domain

**Purpose**  
Record security-relevant blocks, challenges, detections, incidents, and policy violations that affect platform trust.

**Scope**  
Suspicious access blocked, abuse detection, tamper attempts, privilege misuse signals, incident opening and containment, and security policy violations with accountability impact. This domain owns security response truth, not general application error noise.

**Why events exist in this domain**  
Security events protect users, owners, and the business. They must be preserved with clear severity and attribution so incident timelines remain credible under investigation.

---

## 19. System Domain

**Purpose**  
Capture platform-wide operational and integrity conditions that affect trust in live accountability but are not owned by a single product domain.

**Scope**  
Service availability transitions, deployment and configuration load outcomes, marketplace readiness or emptiness warnings, dependency failure, recovery after outage, and integrity checks passed or failed. This domain owns systemic condition truth, not individual user journeys.

**Why events exist in this domain**  
System conditions explain why truth looked a certain way at a moment in time — empty marketplace warnings, stale data detection, and outage recovery all shape how other domain events should be interpreted.

---

## 20. Integration Domain

**Purpose**  
Preserve truth about boundary crossings with external systems, partners, and authorities that alter or confirm platform accountability.

**Scope**  
External payment authority signals, partner connections and disconnections, sync outcomes, rejected boundary input, integration drift, scheduled external handoffs, and asynchronous external confirmations material to institutional memory. This domain owns external parallel truth reception, not internal product semantics.

**Why events exist in this domain**  
Outside reality enters the platform at boundaries. Integration memory records what external authorities and partners said, what the platform accepted or rejected, and how parallel external truth relates to internal assertions without collapsing them.

---

## Closing Note

This catalog defines **twenty domains of event meaning** for the Black Box.

Each domain owns a distinct layer of platform truth. Authentication and account memory establish who participated. Legal, marketplace, purchase, and payment memory establish what was offered, accepted, bought, and paid. Founder, owner, property, document, and verification memory establish off-market and trust-sensitive participation. Admin memory makes privileged power visible. Factory, engine, pipeline, and enrichment memory preserve automated causality. Notification, security, system, and integration memory complete the institutional picture with communication, protection, operational context, and external boundary truth.

Final event names, registry entries, and technical representation will be defined later. This catalog is the domain map they must inhabit.
