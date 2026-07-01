# RealEstateSniper Black Box — Event Catalog: Marketplace

Fourth functional catalog of **conceptual marketplace events** for the Black Box.

This document defines **which event types exist within the Marketplace domain**, what each type asserts, and how they group for investigation. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries, see `BLACK_BOX_EVENT_CATALOG.md` (Marketplace Domain).  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For naming grammar when events are registered, see `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For purchase and entitlement separation, see `BLACK_BOX_INTEGRATION_MODEL.md`.

---

## 1. Purpose

The Marketplace Event Catalog exists to make **deal marketplace memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which classes of marketplace fact must the Black Box be able to record?
- How are visibility, classification, access, and availability grouped for investigators?
- What does each event type assert — and what belongs to other domains?
- How does marketplace memory support fairness, access, and investor dispute reconstruction?

Marketplace is the fourth functional catalog because investor disputes often turn on **what opportunities existed, how they were classified, and who could see them** at the time they mattered.

---

## 2. Scope

**Inside scope**

- Deal discovery and surfacing with accountability impact
- Deal visibility, publication, hiding, and removal
- Deal classification, tier, scoring, and eligibility posture
- Investor access to deals and marketplace views governed by entitlement or rules
- Watchlist actions with business or dispute significance
- Search and filter conditions that materially change visible opportunity
- Marketplace-wide availability, emptiness, and integrity conditions
- Restrictions that limit marketplace participation or visibility

**Outside scope**

- Purchase completion and commercial entitlement grant — Purchase domain
- Payment capture and financial outcomes — Payment domain
- Enrichment, pricing, and classification pipeline mechanics — Enrichment, Pipeline, and Factory domains
- Owner property assertions — Owner and Property domains
- Privileged manual deal overrides — Admin domain, correlatable but not owned here
- Routine browsing telemetry without trust or access consequence — not institutional memory
- Authentication and account state — respective domains

Marketplace owns **what opportunity meant on the product surface**. Purchase owns what the user paid for. Other domains own how data was produced or overridden.

---

## 3. Marketplace Event Philosophy

Marketplace events record **material opportunity truth**, not every scroll or click.

Philosophy principles:

1. **Visibility is memory** — If investors could or could not see a deal, that fact must be reconstructible.
2. **Classification is distinct from visibility** — A deal may exist but be classified differently from what the user ultimately saw.
3. **Access is entitlement-aware** — Marketplace access events describe governed visibility, not generic page loads.
4. **Integrity conditions matter** — Empty, stale, or unavailable marketplace states affect trust and must be recordable.
5. **Restriction is explicit** — Blocks and limits on marketplace use are first-class facts.
6. **No purchase smuggling** — Marketplace events must not silently encode payment capture or refund truth.
7. **No enrichment smuggling** — Score or tier changes driven by enrichment pipelines correlate with Enrichment domain; marketplace records the outcome visible to investors.

Marketplace memory answers what the opportunity landscape looked like. It does not replace memory of how that landscape was built.

---

## 4. Marketplace Event Families

Marketplace events group into **eight families** plus cross-cutting evidence and boundary guidance. Each family owns a distinct layer of marketplace truth.

- **Deal Discovery** — surfacing and highlighting opportunities to participants
- **Deal Visibility** — whether and how deals appear in the marketplace
- **Deal Classification** — tier, score, and eligibility labeling of deals
- **Deal Access** — governed investor access to specific deals or views
- **Watchlist** — participant tracking of deals with accountability significance
- **Search and Filter** — material changes to visible opportunity through query posture
- **Marketplace Availability** — whole-marketplace readiness and integrity conditions
- **Marketplace Restriction** — limits on marketplace use or visible scope

Families may correlate in one investor journey but must remain **separate event classes**. A deal may be reclassified and re-surfaced as two facts, not one merged narrative.

---

## 5. Deal Discovery Events

Deal Discovery events assert **when and how deals were surfaced or highlighted** to participants in accountability-relevant ways.

**Deal Surfaced To Participant**  
A specific deal became visible or emphasized to a participant through a governed discovery mechanism.

**Sniper Deal Surfaced**  
A deal was surfaced through sniper or high-priority discovery logic material to investor opportunity.

**Featured Deal Surfaced**  
A deal was elevated into a featured or promoted discovery position with marketplace meaning.

**Discovery Recommendation Presented**  
A governed recommendation or match presentation placed a deal into the participant's discovery path.

**Discovery Result Empty**  
A material discovery query or mechanism returned no eligible visible deals when that emptiness is accountability-relevant.

**Discovery Path Blocked**  
Discovery could not proceed because eligibility, restriction, or marketplace condition prevented results.

Discovery events assert surfacing truth. They do not assert purchase or payment completion.

---

## 6. Deal Visibility Events

Deal Visibility events assert **whether a deal existed in visible marketplace opportunity** and how that visibility changed.

**Deal Published To Marketplace**  
A deal became available for governed marketplace visibility.

**Deal Hidden From Marketplace**  
A deal was removed from active visible opportunity while still existing in platform memory elsewhere.

**Deal Removed From Marketplace**  
A deal ceased to be a marketplace opportunity in a material, governed way.

**Deal Visibility Restored**  
A previously hidden or removed deal returned to governed marketplace visibility.

**Deal Visibility Pending**  
A deal exists but visibility remains blocked pending required conditions.

**Deal Visibility Changed For Market**  
Visibility changed for a geographic or market scope in a material way.

Visibility events own presentation truth. They do not assert owner verification approval or factory publish causality — those domains correlate.

---

## 7. Deal Classification Events

Deal Classification events assert **how a deal was labeled, scored, or tiered** for marketplace meaning.

**Deal Tier Changed**  
The governed tier classification of a deal changed — for example, movement among standard, premium, or diamond presentation classes where the platform uses them.

**Deal Score Changed Materially**  
A deal's score or ranking input changed enough to affect marketplace meaning or investor perception.

**Deal Classification Applied**  
An initial or renewed classification label was applied to a deal at marketplace relevance.

**Deal Classification Removed**  
A classification label was removed or reset with material effect.

**Deal Premium Eligibility Changed**  
Whether a deal was eligible for premium treatment or visibility changed.

**Deal Diamond Eligibility Changed**  
Whether a deal was eligible for diamond treatment or visibility changed.

**Deal Unclassified Warning Recognized**  
The platform recognized that a visible or publishable deal lacked required classification under integrity rules.

Classification records outcome visible to marketplace logic. Enrichment causality may correlate separately.

---

## 8. Deal Access Events

Deal Access events assert **governed investor access to deals or marketplace views** based on rules and entitlement posture.

**Deal Access Granted To Participant**  
A participant gained governed access to view or interact with a specific deal under active rules.

**Deal Access Denied To Participant**  
A participant was refused governed access to a specific deal.

**Deal Access Revoked From Participant**  
Previously granted deal access was removed under governed conditions.

**Marketplace View Access Granted**  
A participant gained access to a governed marketplace view or collection scope.

**Marketplace View Access Denied**  
A participant was refused a governed marketplace view or collection scope.

**Access Gated Pending Entitlement**  
Deal or view access remained blocked pending purchase or program entitlement not yet satisfied.

Deal Access describes visibility permission on the marketplace surface. Purchase domain owns commercial grant of entitlement.

---

## 9. Watchlist Events

Watchlist events assert **participant tracking of deals** where such tracking has dispute or business significance.

**Deal Added To Watchlist**  
A participant added a deal to a governed watchlist.

**Deal Removed From Watchlist**  
A participant removed a deal from a governed watchlist.

**Watchlist Limit Reached**  
A participant could not add further watched deals because governed limits were exceeded.

**Watchlist Cleared**  
A participant's watchlist was cleared under governed conditions.

**Watchlist Item Became Inaccessible**  
A watched deal later became inaccessible while still on the watchlist, recognized as material.

Watchlist events are not general favorites telemetry. They record tracking actions with marketplace accountability relevance.

---

## 10. Search & Filter Events

Search and Filter events assert **material changes to visible opportunity** through governed query or filter posture — not every keystroke.

**Search Executed With Material Empty Result**  
A governed search returned no visible deals in conditions where emptiness is accountability-relevant.

**Filter Applied With Material Visibility Change**  
A filter changed the set of visible deals in a way material to investor opportunity reconstruction.

**Market Filter Changed Visibility**  
A city, region, or market filter changed which deals a participant could see.

**Saved Search Or Filter Activated**  
A stored search or filter profile materially altered visible opportunity when activated.

**Search Or Filter Blocked**  
A search or filter path could not execute because of restriction, eligibility, or marketplace condition.

**Default Marketplace Scope Changed**  
The platform changed the default visible scope for marketplace browsing in a material way affecting many participants.

Routine low-significance queries are not institutional memory. This family records searches and filters that change reconstructible opportunity truth.

---

## 11. Marketplace Availability Events

Marketplace Availability events assert **whole-marketplace conditions** that affect trust in what investors could see.

**Marketplace Became Ready**  
The marketplace reached a governed ready state for investor opportunity.

**Marketplace Became Empty**  
No eligible deals were available in the marketplace under active rules.

**Marketplace Became Partially Available**  
The marketplace operated under degraded or partial availability with material investor impact.

**Marketplace Data Stale Warning Recognized**  
The platform recognized that marketplace presentation relied on stale data.

**Marketplace Load Failed**  
The marketplace could not present governed opportunity because load or dependency failure blocked it.

**Marketplace Recovered After Unavailability**  
The marketplace returned to governed availability after prior failure or emptiness.

Availability events explain the state of the opportunity environment itself, not a single deal lifecycle.

---

## 12. Marketplace Restriction Events

Marketplace Restriction events assert **limits on marketplace participation or visible scope** imposed by rules, program status, or integrity controls.

**Marketplace Access Restricted For Participant**  
A participant's marketplace use was limited under governed conditions.

**Marketplace Access Restriction Lifted**  
A prior marketplace restriction on a participant ended.

**Deal Visibility Restricted By Rule**  
A deal's visibility was limited by program, legal, verification, or integrity rule.

**Deal Visibility Restriction Lifted**  
A prior deal visibility restriction ended.

**Marketplace Feature Restricted**  
A marketplace capability — such as advanced filters or premium views — was restricted for a participant or segment.

**Marketplace Integrity Hold Applied**  
Marketplace presentation was held or frozen because of integrity review or risk posture.

Restrictions make limits visible. They do not replace Admin or Security domain causes — those may correlate.

---

## 13. Marketplace Evidence

Marketplace events may be supported by **linked evidence** without embedding full deal payloads or investor behavior unnecessarily.

Evidence types appropriate to this domain include:

- References to deal identity and classification state at time of visibility change
- Entitlement or program references when access was gated
- Enrichment or factory run references when outcome visibility is disputed
- Admin override references when manual correction correlates with visibility change
- Marketplace integrity check references for empty or stale warnings
- Purchase references when access gating depended on commercial entitlement — linked, not merged

Evidence principles for marketplace:

- Evidence corroborates marketplace assertions; it does not replace them.
- Deal presentation need not be fully duplicated in unrestricted memory.
- Provisional classification or visibility must be representable before corroboration arrives.
- Contradictory sources — for example, enrichment output versus visible tier — must remain visible.

Marketplace evidence strengthens dispute reconstruction. It does not turn the Black Box into a listing datastore.

---

## 14. Marketplace Boundaries

Marketplace Boundaries clarify **which neighboring truths correlate but are not owned here**.

**Purchase domain**  
Owns commercial entitlement grant, revocation, and purchase journey outcome. Marketplace may record access gated pending entitlement but not payment captured.

**Payment domain**  
Owns whether money moved. Marketplace does not record financial capture.

**Enrichment, Pipeline, and Factory domains**  
Own how deal data was transformed or produced. Marketplace records visible classification and visibility outcome.

**Admin domain**  
Owns privileged manual overrides. Marketplace records the resulting visible state; admin records the exercise of power.

**Owner, Property, and Verification domains**  
Own assertions and review of off-market participation. Marketplace records whether resulting deals became visible opportunity.

**Authentication and User Account domains**  
Own entry and participation existence. Marketplace records what opportunity that participant could see afterward.

**Security and System domains**  
Own incidents and platform conditions unless the fact is specifically marketplace opportunity truth — then Availability or Restriction families apply.

Boundary discipline prevents marketplace memory from becoming a catch-all product log.

---

## 15. Future Evolution

Marketplace catalog evolution may add new event classes only when **new opportunity truth** must be preserved.

**Allowed evolution**

- New discovery or surfacing classes as investor product mechanics mature
- Finer access and restriction distinctions when disputes expose ambiguity
- Additional classification labels as monetization tiers evolve
- Clearer availability warnings when integrity patterns repeat

**Evolution requirements**

Every proposed marketplace event class must answer:

1. What opportunity or visibility truth does it assert that existing classes do not?
2. Is it primary in the Marketplace domain, not Purchase, Enrichment, or Admin?
3. Does it follow materiality over browsing telemetry?
4. Can it correlate without merging with neighboring families?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every search, scroll, or render as institutional memory
- Encoding purchase or payment truth inside marketplace events
- Merging visibility, classification, and access into one convenience class
- Silent relabeling of past marketplace classes when UI is redesigned
- Using marketplace events as marketing analytics warehouses

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Marketplace domain**.

Discovery, Visibility, Classification, and Access mark what investors encountered. Watchlist and Search and Filter mark how opportunity was narrowed or tracked. Availability and Restriction mark the health and limits of the marketplace environment. Evidence and boundaries keep memory investigable without absorbing foreign domains.

Technical representation comes later. Opportunity truth begins here.
