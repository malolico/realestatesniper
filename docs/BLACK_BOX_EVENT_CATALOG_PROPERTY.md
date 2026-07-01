# RealEstateSniper Black Box — Event Catalog: Property

Seventh functional catalog of **conceptual property lifecycle events** for the Black Box.

This document defines **which event types exist for the property as a platform subject**, independent of any single owner actor. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Property Domain).  
For owner participation journey, see `BLACK_BOX_EVENT_CATALOG_OWNER.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For marketplace visibility of resulting deals, see `BLACK_BOX_EVENT_CATALOG_MARKETPLACE.md`.

---

## 1. Purpose

The Property Event Catalog exists to make **property subject memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did a property begin to exist as a recognized subject on the platform?
- How was the property identified, classified, and verified over time?
- What status and relationships did the property hold regardless of which owner acted?
- How does property history support disputes when ownership, representation, or listing truth is challenged?

Property is the seventh functional catalog because RealEstateSniper disputes often center on **the property itself** — not only on who claimed it. Separating property truth from owner action and marketplace presentation makes reconstruction honest.

---

## 2. Scope

**Inside scope**

- Discovery and recognition of a property as a platform subject
- Creation and establishment of property identity on the platform
- Identification, deduplication, and identity correction
- Property-level verification and credibility posture
- Status changes affecting whether the property may participate or proceed
- Classification of property type, market segment, or platform treatment
- Relationships to owner cases, deals, duplicates, and related properties
- Lifecycle transitions including withdrawal, closure, merge, and archival posture

**Outside scope**

- Owner invitation, registration, and owner-initiated claims — Owner domain, correlatable
- Owner authorization or rejection of participation — Owner domain
- Document intake and custody — Document domain
- Formal verification taxonomy when maintained separately — Verification domain, correlatable
- Deal marketplace visibility and investor access — Marketplace domain
- Enrichment and factory transformation mechanics — Enrichment, Factory, and Pipeline domains
- Privileged manual property overrides — Admin domain

Property owns **the history of the property as a subject**. Owner owns who acted. Marketplace owns what investors later saw.

---

## 3. Property Event Philosophy

Property events record **subject truth over time**, not owner biography or investor browsing.

Philosophy principles:

1. **Property is the subject** — Events attach to the property identity, even when owners change or cases merge.
2. **Independent of actor** — The same property history must remain coherent across owner transitions where platform rules allow.
3. **Identification before opinion** — The platform must remember when a property was recognized and how its identity was resolved.
4. **Verification is property-layer truth** — Credibility review of the property is distinct from owner authorization and document custody.
5. **Status is explicit** — Active, restricted, withdrawn, and closed postures must be event-visible.
6. **Relationships are not merges** — Links between properties, owner cases, and deals remain distinct facts.
7. **No marketplace smuggling** — Property events must not silently encode deal publication or premium visibility.

Property memory answers what the platform believed about the property. It does not replace owner or marketplace memory.

---

## 4. Property Event Families

Property events group into **eight families** plus cross-cutting evidence and boundary guidance.

- **Property Discovery** — first recognition of a property candidate as a subject
- **Property Creation** — birth of a durable property subject on the platform
- **Property Identification** — identity resolution, deduplication, and correction
- **Property Verification** — credibility and review posture of the property subject
- **Property Status** — participation and availability posture of the property
- **Property Classification** — type, segment, and platform treatment labels
- **Property Relationship** — links to owners, deals, duplicates, and related subjects
- **Property Lifecycle** — closure, merge, split, and long-horizon state transitions

Families may correlate in one case but must remain **separate event classes**. Identification correction and verification escalation are related but not one merged fact.

---

## 5. Property Discovery Events

Property Discovery events assert **when the platform first recognized a property candidate** as worth tracking.

**Property Candidate Recognized**  
The platform identified a potential property subject through intake, matching, or external signal.

**Property Candidate Matched To Existing Subject**  
A new signal was recognized as referring to an already known property subject.

**Property Candidate Distinguished As New Subject**  
The platform determined that a signal represented a property not previously recognized.

**Property Discovery Source Recorded**  
The origin path of discovery — for example, owner intake, import, or enrichment — was recognized as accountability-relevant.

**Property Discovery Conflict Detected**  
Conflicting discovery signals suggested multiple incompatible property identities.

Discovery events mark the beginning of subject attention. They do not assert full identification completeness or verification approval.

---

## 6. Property Creation Events

Property Creation events assert **birth of a durable property subject** on the platform.

**Property Subject Created**  
The platform recognized creation of a durable property record or case subject.

**Property Case Opened**  
A governed property case began around the subject for participation or review.

**Property Subject Activated**  
The property subject became active for governed platform use.

**Property Creation Failed**  
An attempt to create a property subject failed validation or policy checks.

**Property Subject Reactivated**  
A previously inactive property subject returned to active standing.

**Property Duplicate Creation Prevented**  
The platform blocked creation because an equivalent subject already existed.

Creation events mark when the property began to exist as a platform subject. Owner claim events correlate but do not replace them.

---

## 7. Property Identification Events

Property Identification events assert **how the platform resolved what property this is**.

**Property Identity Established**  
Core identifying attributes reached a governed recognized state for the subject.

**Property Identity Amended**  
Material identifying attributes changed after initial establishment.

**Property Identity Correction Applied**  
The platform corrected a prior identification error under governed review.

**Property Deduplication Merge Proposed**  
The platform identified two subjects as potential duplicates requiring merge decision.

**Property Deduplication Merge Completed**  
Two property subjects were merged into one governed identity.

**Property Deduplication Merge Rejected**  
Duplicate merge was considered and denied.

**Property Identity Ambiguity Recognized**  
The platform marked identification as provisional because ambiguity remained.

Identification events own subject identity truth. They do not assert owner authority or marketplace classification.

---

## 8. Property Verification Events

Property Verification events assert **property-level credibility and review posture** for the subject itself.

**Property Verification Requested**  
Review of the property subject for credibility or eligibility was opened.

**Property Verification Review Started**  
Governed property review began.

**Property Verification Review Paused**  
Property review paused for material reason.

**Property Verification Review Resumed**  
Paused property review continued.

**Property Credibility Confirmed**  
The property subject met credibility requirements for its current stage.

**Property Credibility Failed**  
The property subject failed credibility requirements for its current stage.

**Property Verification Escalated**  
Property review moved to higher scrutiny because of risk or conflict.

**Property Reverification Required**  
Earlier property verification posture expired or was invalidated.

**Property Verification Expired**  
Property verification validity ended under governed rules.

Property Verification events describe the property subject review path. Owner authorization remains in Owner domain.

---

## 9. Property Status Events

Property Status events assert **participation and availability posture** of the property subject.

**Property Status Set To Active**  
The property subject became active for governed participation.

**Property Status Set To Inactive**  
The property subject became inactive without full closure.

**Property Status Set To Restricted**  
The property subject was limited under integrity, legal, or policy rules.

**Property Restriction Lifted**  
A prior property restriction ended.

**Property Withdrawn From Participation**  
The property subject was withdrawn from active participation flows.

**Property Participation Suspended**  
Property participation paused pending review or external condition.

**Property Participation Restored**  
Suspended property participation resumed under governed conditions.

**Property Status Conflict Detected**  
Incompatible status signals created a material integrity concern.

Status events describe what the property could do on the platform. Marketplace deal visibility correlates separately.

---

## 10. Property Classification Events

Property Classification events assert **how the platform classified the property subject** for treatment and routing.

**Property Type Classified**  
The property received a governed type label — for example, residential, commercial, land, or other platform category.

**Property Market Segment Classified**  
The property was assigned to a market, geography, or segment class with accountability impact.

**Property Classification Changed**  
A material classification label changed.

**Property Classification Removed**  
A classification label was removed or reset with material effect.

**Property Risk Classification Changed**  
Risk or integrity classification of the property changed materially.

**Property Treatment Tier Assigned**  
The property received a governed treatment tier affecting downstream handling.

**Property Unclassified Warning Recognized**  
The platform recognized that a participating property lacked required classification.

Classification events record how the platform treated the subject. Deal tier visibility in marketplace is a separate layer.

---

## 11. Property Relationship Events

Property Relationship events assert **links between the property subject and other platform entities** without merging them.

**Property Linked To Owner Case**  
The property subject was associated with a governed owner participation case.

**Property Unlinked From Owner Case**  
A prior owner case association ended.

**Property Linked To Deal**  
The property subject became associated with a marketplace deal or opportunity object.

**Property Unlinked From Deal**  
A prior deal association ended.

**Property Related Property Linked**  
The platform recognized a governed relationship to another property subject — for example, adjacent, portfolio, or duplicate family.

**Property Relationship Contradiction Detected**  
Linked entities asserted incompatible facts material to investigation.

**Property Ownership Representation Changed**  
The platform recognized a change in represented ownership posture for the subject without collapsing owner action into property identity.

Relationships create narrative structure. Each entity retains its own event history.

---

## 12. Property Lifecycle Events

Property Lifecycle events assert **long-horizon transitions** in the life of the property subject.

**Property Case Closed**  
The governed property case reached closure without necessarily deleting historical truth.

**Property Case Reopened**  
A closed property case resumed under governed conditions.

**Property Subject Merged Into Another**  
One property subject was absorbed into another under deduplication or governance rules.

**Property Subject Split From Another**  
A property subject was separated from a previously merged or ambiguous identity.

**Property Subject Archived**  
The property subject moved to long-term governed preservation with reduced active use.

**Property Subject Retired**  
The property subject ceased active platform use while retaining historical memory.

**Property Lifecycle Milestone Reached**  
A governed milestone — such as ready for next stage or permanently barred — was recognized.

Lifecycle events mark chapter changes in property history. They do not erase prior assertions.

---

## 13. Property Evidence

Property events may be supported by **linked evidence** without embedding sensitive location or document content unnecessarily.

Evidence types appropriate to this domain include:

- Identification source references supporting deduplication decisions
- External data or enrichment references that corroborate classification
- Document linkage references supporting property credibility — without inlining content
- Owner case references when relationship disputes arise
- Deal linkage references when property-to-opportunity truth is challenged
- Review case references for escalation or credibility failure

Evidence principles for property:

- Evidence corroborates; it does not replace property assertions.
- Location and owner-sensitive detail should be referenced or redacted where possible.
- Provisional identification or credibility must remain visibly qualified.
- Contradiction between property identity and linked deal or owner facts must remain visible.

Property evidence strengthens subject defensibility. It does not turn the Black Box into a property datastore.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how property subject memory relates to neighboring truth**.

**Owner domain**  
Owns who asserted interest, submitted material, and received authorization. Property owns the subject those actions concerned.

**Document domain**  
Owns documentary intake and custody. Property verification correlates with document proof.

**Verification domain**  
May maintain formal cross-cutting verification taxonomy. This catalog records property-subject verification progression.

**Marketplace domain**  
Owns investor-visible deal opportunity. Property links to deals; marketplace records visibility and classification on the product surface.

**Enrichment, Factory, and Pipeline domains**  
Own how property data was transformed. Property records resulting identity, classification, and status truth.

**Legal domain**  
Owns acceptance of disclosures tied to property participation. Property correlates at legal moments.

**Admin domain**  
Owns privileged manual corrections. Property status or classification may change as a result; admin records the exercise of power.

Boundary discipline keeps property history stable even when owners, deals, and marketplace presentation change around it.

---

## 15. Future Evolution

Property catalog evolution may add new event classes only when **new property subject truth** must be preserved.

**Allowed evolution**

- Finer identification and deduplication classes when merge disputes repeat
- Additional classification labels as property types or markets expand
- Clearer relationship classes for portfolio or multi-unit scenarios
- New lifecycle milestones when participation stages mature

**Evolution requirements**

Every proposed property event class must answer:

1. What property subject truth does it assert that existing classes do not?
2. Does it remain independent of any single owner actor?
3. Does it keep identification, verification, status, and classification separable?
4. Can it correlate with owner, document, and marketplace domains without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Collapsing property, owner, and deal into one subject event class
- Logging every map view or address field edit as institutional memory
- Encoding marketplace visibility inside property status events
- Silent relabeling of past property classes when data models change
- Using property events as generic real-estate CRM telemetry

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Property domain**.

Discovery and Creation mark when a property became a platform subject. Identification and Verification mark what it was and whether it was credible. Status and Classification mark how it participated and how it was treated. Relationship and Lifecycle mark how it connected to owners, deals, and time.

Technical representation comes later. Property subject truth begins here.
