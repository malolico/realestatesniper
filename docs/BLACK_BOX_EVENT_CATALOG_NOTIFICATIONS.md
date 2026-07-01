# RealEstateSniper Black Box — Event Catalog: Notifications

Fifteenth functional catalog of **conceptual notification and platform communication events** for the Black Box.

This document defines **which event types exist when the platform emits, delivers, fails to deliver, suppresses, or receives acknowledgement for consequential communication**. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Notification Domain).  
For notification integration posture, see `BLACK_BOX_INTEGRATION_MODEL.md`.  
For owner-journey communication, see `BLACK_BOX_EVENT_CATALOG_OWNER.md`.  
For legally binding notices, see `BLACK_BOX_EVENT_CATALOG_LEGAL.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Notification Event Catalog exists to make **platform communication memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Did the platform attempt to inform a participant when it mattered?
- Was a consequential notice delivered, suppressed, retried, or permanently failed?
- Did the recipient acknowledge or act on a material communication?
- How can investigators corroborate awareness without confusing communication with the underlying business fact?

Notifications is the fifteenth functional catalog because **disputes often ask whether a party was told something material at the time it mattered**. Authorization, payment, verification, and legal acceptance are native domain facts. Notification memory proves whether communication aligned with those facts.

---

## 2. Scope

**Inside scope**

- Creation, scheduling, and queuing of consequential platform communications
- Delivery attempts, successful delivery, and channel outcomes with accountability impact
- Acknowledgement and material recipient response to governed notices
- Delivery failure, permanent failure, and unreachable recipient posture
- Governed retry, fallback channel use, and retry exhaustion
- Suppression by policy, preference, legal hold, or duplicate prevention
- Notification lifecycle closure, expiry, supersession, and escalation
- Evidence references that support communication defensibility

**Materiality standard**

A notification event exists only when communication has **operational, contractual, legal, or business value** — or when its failure or suppression materially affects accountability. Delivery telemetry without dispute relevance does not qualify.

**Outside scope**

- Routine open-rate pings, click heatmaps, and channel metrics without accountability effect — not institutional memory
- Provider-internal SMTP trace spam and webhook noise without material outcome — not institutional memory
- Underlying business facts that triggered the notice — native domains, correlatable
- Owner-journey communication framing as participation story — Owner domain, correlatable
- Legally binding policy acceptance as legal fact — Legal domain, correlatable
- Security incident taxonomy — Security domain, correlatable for security alerts
- Marketing campaign analytics without contractual consequence — outside Black Box unless legally material
- Generic authentication one-time codes unless dispute-relevant — Authentication domain, correlatable

This catalog owns **communication result truth**. It corroborates platform action; it does not replace the originating assertion.

---

## 3. Notification Event Philosophy

Notification events record **consequential communication outcomes**, not every message the platform could have sent.

Philosophy principles:

1. **Corroboration, not substitution** — Delivery success does not mean authorization occurred; failure to deliver does not erase the underlying fact.
2. **Materiality gates memory** — Not every email attempt deserves institutional permanence.
3. **Failure is accountability** — Permanent delivery failure and policy suppression are as important as success.
4. **Acknowledgement when consequential** — Read or action receipts matter when contract, law, or dispute risk requires them.
5. **Retry is visible** — Governed resend and fallback paths must remain reconstructible.
6. **Suppression is explicit** — Choosing not to notify under policy is a fact when awareness disputes arise.
7. **No domain smuggling** — Notification events must not silently encode verification verdict, payment capture, or owner authorization.

Notification memory answers whether the platform communicated. It does not answer what was ultimately decided in another domain.

---

## 4. Notification Event Families

Notification events group into **seven families** plus cross-cutting evidence, boundary, and governance guidance.

- **Notification Creation** — formation, scheduling, and readiness of a consequential notice
- **Notification Delivery** — send attempts and successful channel outcomes
- **Notification Acknowledgement** — recipient awareness, confirmation, or material response
- **Notification Failure** — delivery breakdown with accountability impact
- **Notification Retry** — governed resend, fallback, and exhaustion posture
- **Notification Suppression** — intentional non-delivery under policy or constraint
- **Notification Lifecycle** — expiry, cancellation, supersession, and closure of a notice episode

Families may correlate tightly in one communication episode but must remain **separate event classes**. Creation and delivery are related but not one merged fact.

---

## 5. Notification Creation Events

Notification Creation events assert **when a consequential communication was formed and prepared for delivery**.

**Notification Requested**  
A governed need to inform a participant was recognized.

**Notification Composed**  
The platform finalized the consequential message content for delivery.

**Notification Scheduled**  
Delivery was placed on a governed future time or condition.

**Notification Queued**  
The notice entered the governed outbound communication queue.

**Notification Recipient Identified**  
The platform bound the notice to a governed recipient target.

**Notification Channel Selected**  
A governed delivery channel was chosen for the notice.

**Notification Priority Established**  
The notice received a governed urgency or precedence posture.

**Notification Trigger Correlated**  
The notice was linked to an originating domain fact without absorbing that fact.

Creation events mark **communication intent and readiness**. They do not record every draft edit without material effect.

---

## 6. Notification Delivery Events

Notification Delivery events assert **when the platform attempted or achieved consequential delivery**.

**Notification Sent**  
The platform released the notice to the delivery path.

**Notification Delivery Attempted**  
A governed delivery try occurred on the selected channel.

**Notification Delivered**  
The channel reported successful delivery to the recipient target.

**Notification Delivery Deferred**  
Delivery was postponed under governed conditions.

**Notification Channel Switched**  
The notice moved to an alternate governed channel before or after attempt.

**Notification Partially Delivered**  
Some channels or recipient targets succeeded while others remained pending or failed.

**Notification Handoff To Provider Completed**  
The notice reached the external or internal delivery authority boundary.

Delivery events mark **outbound communication truth**. Provider-internal hops without outcome change are not institutional memory.

---

## 7. Notification Acknowledgement Events

Notification Acknowledgement events assert **when recipient awareness or material response became known**.

**Notification Acknowledgement Requested**  
The notice required explicit recipient confirmation under policy.

**Notification Acknowledged**  
The recipient provided governed confirmation of awareness.

**Notification Material Action Taken**  
The recipient performed a governed action requested by the notice.

**Notification Acknowledgement Expired**  
Required confirmation was not received within governed time.

**Notification Read Recognized**  
Material read receipt was obtained where policy or dispute risk requires it.

**Notification Response Received**  
A material reply to the notice was recognized by the platform.

**Notification Opt-Out Recorded**  
A governed communication preference change with legal or contractual effect was recorded.

Acknowledgement events apply only when **awareness or response has accountability weight**. Routine engagement metrics do not qualify.

---

## 8. Notification Failure Events

Notification Failure events assert **delivery breakdown with material accountability impact**.

**Notification Delivery Failed**  
A delivery attempt failed on the selected channel.

**Notification Permanently Failed**  
Governed retry policy determined delivery would not succeed.

**Notification Recipient Unreachable**  
The recipient target could not be reached through available channels.

**Notification Channel Failed**  
The selected channel was unavailable or rejected the notice.

**Notification Policy Blocked Delivery**  
Delivery was refused by governed communication policy at attempt time.

**Notification Expired Before Delivery**  
The notice lost validity before successful delivery.

**Notification Integrity Warning Issued**  
The platform detected corruption, tampering risk, or trust break in the communication path.

Failure events require **materiality**. Transient provider blips that succeed on immediate retry without accountability effect are not institutional memory.

---

## 9. Notification Retry Events

Notification Retry events assert **governed resend and fallback posture after failure or deferral**.

**Notification Retry Scheduled**  
A governed resend was planned after failure or deferral.

**Notification Retry Attempted**  
A resend delivery try occurred.

**Notification Retry Succeeded**  
Resend achieved successful delivery.

**Notification Fallback Channel Used**  
Retry proceeded through an alternate governed channel.

**Notification Retry Exhausted**  
Governed resend limits were reached without success.

**Notification Retry Abandoned**  
Resend was stopped by policy before exhaustion.

Retry events preserve **resilience truth** without logging every automatic micro-retry unless posture changes.

---

## 10. Notification Suppression Events

Notification Suppression events assert **intentional non-delivery under policy, preference, or constraint**.

**Notification Suppressed By Policy**  
Governed platform policy blocked the notice from sending.

**Notification Suppressed By Preference**  
Recipient communication preference blocked the notice.

**Notification Suppressed By Frequency Cap**  
Rate or volume limits prevented delivery.

**Notification Suppressed By Legal Hold**  
Legal or compliance constraint blocked delivery.

**Notification Duplicate Prevented**  
An equivalent consequential notice was blocked to prevent redundant communication.

**Notification Suppression Lifted**  
A prior suppression constraint ended and delivery could resume.

**Notification Held For Review**  
Outbound delivery was paused pending governance or compliance review.

Suppression is **visible non-action**. It matters when disputes ask why a party was not informed.

---

## 11. Notification Lifecycle Events

Notification Lifecycle events assert **how a notice episode opened, changed standing, or closed over time**.

**Notification Episode Opened**  
A governed communication episode began for a correlated trigger.

**Notification Cancelled Before Send**  
A prepared notice was withdrawn before release to delivery.

**Notification Expired**  
The notice episode ended because validity period closed.

**Notification Superseded**  
A newer notice replaced the standing communication for the same correlated matter.

**Notification Escalated To Alternate Channel**  
Urgency rules elevated the episode to a higher-accountability channel.

**Notification Lifecycle Closed**  
The episode ended with a recorded final communication posture.

**Notification Reopened For Resend**  
A closed or failed episode was deliberately revived under policy.

Lifecycle events mark **episode containers** over time. They do not replace individual delivery or failure facts inside the episode.

---

## 12. Notification Evidence

Notification Evidence describes **what supporting material makes communication defensibility reconstructible** without turning the Black Box into a mail server log.

Evidence principles:

1. **Outcome over hops** — Record delivery, failure, or suppression posture, not every provider relay.
2. **Correlation keys** — Link notices to originating domain facts without merging vocabularies.
3. **Channel accountability** — Which channel was selected, switched, or exhausted should remain visible.
4. **Suppression explainability** — Policy or preference blocks should remain explainable in disputes.
5. **No metric archive** — Open rates and click maps stay outside unless legally or contractually material.

Typical evidence attachments conceptually include:

- recipient target and channel at time of attempt
- correlation reference to triggering domain fact
- delivery, failure, or suppression chain across the episode
- retry and fallback sequence when material
- acknowledgement or material response posture when required
- expiry, supersession, and cancellation relative to prior notices
- references to legal or owner-journey communication when domains correlate

Notification evidence strengthens awareness and timely-disclosure disputes. It does not replace Owner, Legal, or Verification domain memory.

---

## 13. Domain Boundaries

Domain Boundaries clarify **how Notification truth relates to neighboring catalogs** without collapse.

**Owner domain**  
Owns owner-journey communication as participation story. Generic notification taxonomy lives here; Owner Communication correlates with journey framing.

**Legal domain**  
Owns binding policy acceptance and legally material version change facts. Legal notice delivery correlates; acceptance remains legal memory.

**Authentication domain**  
Owns sign-in and credential flows. Security codes and access notices may correlate when dispute-relevant.

**Verification domain**  
Owns review process and outcomes. Outcome notices correlate; verification verdict remains there.

**Purchase and Payment domains**  
Own commercial and financial truth. Receipt and entitlement notices correlate; capture remains in payment memory.

**Admin domain**  
Owns privileged operator action. Operator-initiated notices correlate without absorbing admin facts.

**Security domain**  
Owns threat and incident signals. Security alerts may correlate; incident taxonomy remains in Security memory.

**Marketplace domain**  
Owns investor-visible opportunity truth. Deal alerts correlate; publication facts remain there.

**Integration domain**  
Owns external delivery provider boundary truth. Provider handoff correlates; external authority remains at integration layer.

**System domain**  
Owns platform operational context. Channel outage may correlate when delivery failed materially.

Boundary discipline keeps **one communication taxonomy** without making Notifications the catch-all for every message-like fact.

---

## 14. Governance

Notification catalog governance defines **how communication event classes remain trustworthy** as channels and policies evolve.

Governance principles:

1. **Accountability materiality** — New classes must prove communication truth matters for operational, contractual, legal, or business disputes.
2. **Corroboration discipline** — Notification vocabulary must not absorb originating domain outcomes.
3. **Telemetry exclusion** — Engagement metrics and provider hop logs require explicit materiality review.
4. **Registry discipline** — Proposed classes must survive naming-standard review before registration.
5. **Suppression visibility** — Policy blocks and preference blocks must not become silent non-events when accountability applies.
6. **Amendment caution** — Retroactive relabeling when communication policy changes requires governance review.

**Governance questions for every proposed notification event class**

- Does this assert communication truth that existing classes do not?
- Would absence of this class leave awareness or disclosure disputes unexplained?
- Is it free of delivery telemetry and engagement noise without accountability effect?
- Does it preserve separation from Owner, Legal, and originating business domains?
- Can it correlate with triggers without merging vocabularies?

**Governance authority**

Amendments to this catalog follow the Black Box governance model alongside the master catalog, naming standard, and constitutional materiality rules. Message volume is not sufficient justification.

---

## 15. Future Evolution

Notification catalog evolution may add new event classes only when **new communication accountability truth** must be preserved.

**Allowed evolution**

- Finer multi-channel partial-delivery classes when dispute review exposes ambiguity
- Additional suppression classes as compliance and preference rules mature
- Clearer acknowledgement classes where law or contract demands proof of awareness
- Distinct escalation classes as urgency playbooks grow

**Evolution requirements**

Every proposed notification event class must answer:

1. What communication truth does it assert that existing classes do not?
2. Does it meet the materiality standard — operational, contractual, legal, or business impact?
3. Does it avoid telemetry and provider noise without accountability effect?
4. Can it correlate with originating domains without merge?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every SMTP hop, webhook ping, or open event as institutional memory
- Merging creation, delivery, and acknowledgement into one convenience class
- Using notification events as verification, payment, or authorization shortcuts
- Recording marketing engagement analytics without legal or contractual materiality
- Silent suppression without suppression or lifecycle event classes
- Making delivery provider implementation a prerequisite for defining event classes

Amendments to this catalog require governance review alongside the master catalog and naming standard. Channel verbosity is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Notification domain**.

Notification Creation marks when a consequential notice was prepared. Delivery and Acknowledgement mark whether and how communication landed. Failure and Retry mark breakdown and resilience. Suppression marks intentional non-delivery. Lifecycle marks how the episode opened and closed. Evidence and boundaries keep communication truth legible without telemetry noise or domain smuggling.

Technical representation comes later. Platform communication truth begins here.
