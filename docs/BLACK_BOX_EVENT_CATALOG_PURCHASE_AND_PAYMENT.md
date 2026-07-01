# RealEstateSniper Black Box — Event Catalog: Purchase and Payment

Fifth functional catalog of **conceptual purchase, subscription, payment, and external payment authority events** for the Black Box.

This document defines **which event types exist across commercial entitlement and money truth**, what each type asserts, and how Purchase, Payment, and external authority layers remain distinct. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries, see `BLACK_BOX_EVENT_CATALOG.md` (Purchase and Payment domains).  
For integration separation, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For marketplace access gating, see `BLACK_BOX_EVENT_CATALOG_MARKETPLACE.md`.

---

## 1. Purpose

The Purchase and Payment Event Catalog exists to make **commercial and financial memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which classes of purchase fact assert entitlement and commercial decision?
- Which classes of payment fact assert platform-recognized money movement?
- Which classes of external authority fact assert parallel financial truth?
- How do investigators reconstruct disputes when platform, user, and external authority disagree?

This is the fifth functional catalog because investor fairness disputes routinely require **three separable layers**: what was sold, what money did, and what the external authority reported.

---

## 2. Scope

**Inside scope**

- Subscription lifecycle with commercial entitlement effect
- Premium and diamond purchase journeys and entitlement grants
- Renewals and continuation of commercial access
- Platform-recognized payment attempts and outcomes
- Failed payments and declined financial paths
- Refunds and entitlement reversal correlates
- External payment authority signals and reconciliation-relevant callbacks

**Outside scope**

- Marketplace visibility and deal classification — Marketplace domain
- Founder cohort capacity beyond purchase outcome — Founder domain
- Account existence and suspension — User Account domain
- Legal acceptance of terms — Legal domain
- Privileged manual billing corrections — Admin domain
- General integration signals unrelated to money — Integration domain

Purchase owns **commercial entitlement truth**. Payment owns **platform-recognized money truth**. External payment authority owns **parallel financial truth received from outside**.

---

## 3. Purchase vs Payment Philosophy

Purchase and Payment are **adjacent but not interchangeable**. External payment authority is a **third witness**, not a substitute for either.

**Purchase truth** answers: What did the platform decide the user was entitled to acquire, retain, or lose?

**Payment truth** answers: What did the platform recognize about money movement, failure, or reconciliation on its side?

**External payment authority truth** answers: What financial fact arrived from the outside authority and how was it received or rejected?

Philosophy principles:

1. **Three layers, three event classes** — Never merge purchase completion, payment capture, and external callback into one ambiguous event.
2. **Entitlement is not capture** — Granting premium access and capturing funds are correlatable, not identical.
3. **Failure on one layer does not erase another** — A failed payment may coexist with an abandoned purchase; an external refund may coexist with delayed entitlement revocation.
4. **Reconciliation is explicit** — Mismatch between layers must be representable without smoothing.
5. **Refund spans layers** — Refund memory may require purchase, payment, and external authority events linked in one journey.
6. **Renewal is commercial rhythm** — Renewal events describe continuation of entitlement, not every background billing tick unless materially consequential.
7. **Dispute-ready correlation** — Investigators must see the triangle: platform purchase, platform payment, external authority.

The Black Box preserves all three voices. It does not pick a winner silently.

---

## 4. Purchase Event Families

Purchase-side events group into **four primary families** before payment and external authority layers are considered.

- **Subscription** — recurring commercial participation and entitlement lifecycle
- **Premium Purchase** — premium tier or deal access acquisition
- **Diamond Purchase** — diamond tier or highest-tier acquisition
- **Renewal** — continuation, extension, or lapse of purchased access

Purchase families describe **commercial decisions and entitlement outcomes**. They do not assert that money moved successfully unless the event class is explicitly purchase-layer truth about abandonment or duplicate prevention, not financial capture.

Payment families and external authority families follow in later sections as separate layers.

---

## 5. Subscription Events

Subscription events assert **recurring commercial participation and entitlement lifecycle** at the purchase layer.

**Subscription Purchase Initiated**  
A user began a governed subscription acquisition path.

**Subscription Purchase Completed**  
The platform recognized successful subscription acquisition under active commercial rules.

**Subscription Purchase Abandoned**  
A subscription acquisition path was left incomplete in an accountability-relevant way.

**Subscription Activated**  
A subscription became active for entitlement purposes.

**Subscription Entitlement Granted**  
Subscription-based access or tier entitlement was granted.

**Subscription Changed**  
The subscription commercial posture changed — for example, plan category or included benefits.

**Subscription Cancelled**  
The user or governed process cancelled future subscription continuation.

**Subscription Suspended**  
Subscription entitlement was suspended under governed conditions.

**Subscription Reactivated**  
A suspended subscription returned to active entitlement posture.

**Subscription Lapsed**  
Subscription entitlement ended because renewal did not continue under rules in force.

**Duplicate Subscription Prevented**  
The platform blocked a redundant subscription acquisition.

Subscription events own commercial recurrence truth. Payment capture for each billing period belongs in Payment or external authority families.

---

## 6. Premium Purchase Events

Premium Purchase events assert **acquisition of premium-tier commercial entitlement**, including deal-specific premium access where applicable.

**Premium Purchase Initiated**  
A user began a governed premium acquisition path.

**Premium Purchase Completed**  
The platform recognized successful premium acquisition.

**Premium Purchase Abandoned**  
A premium acquisition path was left incomplete in an accountability-relevant way.

**Premium Purchase Failed At Commercial Validation**  
Premium acquisition was blocked by commercial rules before entitlement grant — distinct from payment failure.

**Premium Entitlement Granted**  
Premium access or tier entitlement was granted.

**Premium Entitlement Revoked**  
Premium entitlement was removed under governed conditions.

**Premium Purchase Bound To Deal**  
Premium entitlement was tied to a specific deal in a material way.

**Duplicate Premium Purchase Prevented**  
The platform blocked redundant premium acquisition for the same scope.

Premium purchase events answer what premium access was granted. They do not replace payment captured or external checkout completed.

---

## 7. Diamond Purchase Events

Diamond Purchase events assert **acquisition of diamond-tier commercial entitlement**, the highest governed purchase class in the product model.

**Diamond Purchase Initiated**  
A user began a governed diamond acquisition path.

**Diamond Purchase Completed**  
The platform recognized successful diamond acquisition.

**Diamond Purchase Abandoned**  
A diamond acquisition path was left incomplete in an accountability-relevant way.

**Diamond Purchase Failed At Commercial Validation**  
Diamond acquisition was blocked by commercial rules before entitlement grant.

**Diamond Entitlement Granted**  
Diamond access or tier entitlement was granted.

**Diamond Entitlement Revoked**  
Diamond entitlement was removed under governed conditions.

**Diamond Purchase Bound To Deal**  
Diamond entitlement was tied to a specific deal in a material way.

**Duplicate Diamond Purchase Prevented**  
The platform blocked redundant diamond acquisition for the same scope.

Diamond and premium are separate families because disputes require precise tier truth, not a merged high-tier event.

---

## 8. Renewal Events

Renewal events assert **continuation, extension, or failure of purchased access over time** at the commercial layer.

**Renewal Initiated**  
A governed renewal of purchased access began.

**Renewal Succeeded**  
Purchased access was continued under active commercial rules.

**Renewal Failed At Commercial Layer**  
Renewal could not continue because commercial eligibility or subscription posture failed — distinct from payment failure alone.

**Renewal Skipped**  
Renewal did not occur under rules where skipping is material — for example, user cancellation already in effect.

**Renewal Entitlement Extended**  
Existing entitlement was extended because renewal succeeded commercially.

**Renewal Entitlement Not Extended**  
Entitlement was not extended because renewal did not succeed commercially.

**Renewal Grace Period Started**  
Purchased access entered a governed grace period before lapse.

**Renewal Grace Period Ended**  
Grace period ended with entitlement continued or lapsed.

Renewal events describe access continuation decisions. Billing capture belongs elsewhere unless the renewal event class is explicitly commercial-only.

---

## 9. Payment Events

Payment events assert **platform-recognized money process truth** independent of final entitlement meaning.

**Payment Initiated**  
A payment attempt began on the platform side.

**Payment Authorized**  
Funds or charge permission reached an authorized state as recognized by the platform.

**Payment Captured**  
The platform recognized successful capture of payment.

**Payment Completed**  
The platform recognized the payment process as complete for its scope.

**Payment Canceled**  
A payment attempt was canceled before completion.

**Payment Retry Initiated**  
A governed retry of a prior payment path began.

**Partial Payment Recognized**  
The platform recognized a partial financial outcome material to reconciliation.

**Payment Reconciliation Mismatch Detected**  
Platform payment truth conflicted with expected purchase or external authority state.

Payment events answer what the platform believed about money. They do not alone grant premium or diamond entitlement.

---

## 10. Failed Payment Events

Failed Payment events assert **financial path failure** as recognized by the platform, with explicit outcome classes.

**Payment Failed**  
A payment attempt ended unsuccessfully in a general material sense.

**Payment Declined**  
The payment was declined by issuer, processor, or governing financial rule.

**Payment Timed Out**  
The payment attempt expired before completion.

**Payment Blocked By Policy**  
A platform or compliance policy prevented payment processing.

**Payment Authentication Required**  
Additional payer authentication was required before completion could occur.

**Payment Authentication Failed**  
Required payer authentication did not succeed.

**Payment Failure Threshold Reached**  
Repeated payment failures accumulated to a material threshold affecting the purchase journey.

Failed payment events must not be merged with purchase abandoned unless both facts truly occurred and each remains distinct.

---

## 11. Refund Events

Refund events assert **return of money and correlating loss of commercial entitlement** across layers without collapsing them.

**Refund Requested**  
A refund was initiated by user, platform, or governed process.

**Refund Approved**  
A refund request passed governed approval.

**Refund Rejected**  
A refund request was denied.

**Refund Completed**  
The platform recognized refund completion for its scope.

**Refund Failed**  
A refund attempt did not complete successfully.

**Partial Refund Completed**  
A partial refund was recognized.

**Entitlement Revoked After Refund**  
Commercial entitlement was removed because refund outcome required it — purchase-layer correlate linked to refund truth.

**Refund Pending**  
Refund was initiated but not yet completed.

Refund memory often requires correlation across payment and external authority families. Each layer keeps its own event class.

---

## 12. External Payment Authority (Stripe)

External Payment Authority events assert **financial truth received from the outside payment authority** — Stripe in the current product model — without replacing platform purchase or payment memory.

**External Checkout Session Created**  
An externally governed checkout session for payment was created.

**External Checkout Completed**  
The external authority recognized checkout completion.

**External Callback Received**  
The platform received an external financial callback material to money truth.

**External Callback Validation Failed**  
A received external callback failed validation or trust checks.

**External Customer Linked**  
A platform participant became linked to an external customer identity.

**External Subscription Synced**  
Subscription state was synchronized from the external authority in a material way.

**External Dispute Opened**  
The external authority opened a dispute relevant to platform reconciliation.

**External Refund Issued**  
The external authority recognized issuance of refund.

**External Payment Configuration Mismatch Detected**  
External authority configuration conflicted with platform payment expectation.

**External Authority State Diverged From Platform**  
The platform recognized durable disagreement between external authority state and platform payment or purchase state.

External authority events are parallel financial witnesses. Investigators must see them alongside platform purchase and payment events without merge.

---

## 13. Purchase Evidence

Purchase, payment, and external authority events may be supported by **linked evidence** without embedding sensitive financial material unnecessarily.

Evidence types appropriate to this domain include:

- Receipt or invoice references tied to payment completion
- External authority callback references with validation outcome
- Purchase journey correlation references linking entitlement grant to payment timing
- Deal binding references for premium or diamond purchase scope
- Refund and dispute case references across layers
- Commercial rule references when validation blocked acquisition

Evidence principles:

- Evidence corroborates; it does not replace layer-specific assertions.
- Full payment instruments, card data, and secret tokens must not live in unrestricted memory.
- Provisional payment or entitlement states must be visible before corroboration arrives.
- Contradiction between platform and external authority must remain visible.

Financial evidence strengthens dispute defense. It does not turn the Black Box into a payment vault.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how purchase and payment memory relate to neighboring truth**.

**Marketplace domain**  
Owns visible opportunity and access gating on the product surface. Purchase grants entitlement that may unlock marketplace access; marketplace records that gating outcome.

**User Account domain**  
Owns participant existence and subscription eligibility posture on the account. Purchase owns what was acquired; account may own eligibility to acquire.

**Legal domain**  
Owns acceptance of terms governing monetization. Purchase flows may correlate with legal acceptance events.

**Founder domain**  
Owns scarce founder program truth. Purchases may interact with founder benefits but do not replace founder cohort memory.

**Admin domain**  
Owns privileged manual billing or entitlement correction. Resulting entitlement state correlates with purchase-layer events.

**Authentication domain**  
Owns who initiated payment or purchase paths. Financial events correlate for attribution.

**Integration domain**  
Owns non-payment external systems. Only financial authority signals belong in the external payment authority family.

Boundary discipline keeps the three-layer money model honest.

---

## 15. Future Evolution

Purchase and payment catalog evolution may add new event classes only when **new commercial or financial truth** must be preserved.

**Allowed evolution**

- New tier or product families if monetization expands beyond premium and diamond
- Finer failure and mismatch classes when reconciliation disputes repeat
- Additional external authority event classes if payment authority model grows
- Clearer renewal and grace-period classes as subscription rules mature

**Evolution requirements**

Every proposed event class must answer:

1. Which layer does it belong to — purchase, payment, or external authority?
2. Does it preserve separability of entitlement and money truth?
3. Can mismatch and partial outcomes remain visible?
4. Can it correlate across layers without merging them?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Single event classes that silently mean purchased, paid, and externally confirmed
- Logging every billing webhook as undifferentiated noise without investigable meaning
- Encoding marketplace visibility inside purchase events
- Silent relabeling of past purchase classes when checkout UX changes
- Using payment events as entitlement grant shortcuts

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of Purchase, Payment, and External Payment Authority**.

Purchase families — Subscription, Premium, Diamond, and Renewal — record commercial entitlement. Payment and Failed Payment families record platform money truth. Refund spans layers with explicit correlates. External Payment Authority records Stripe-side financial witness. Evidence and boundaries keep the three voices separable and dispute-ready.

Technical representation comes later. Commercial and financial truth begin here.
