# RealEstateSniper Black Box — Event Model

Official conceptual specification for how events exist, behave, and relate within the Black Box.

This document defines **what an event is in the Black Box, how it is classified, and how it moves through institutional memory**. It does not define storage schemas, transport, permissions, or implementation.

For constitutional principles and full category taxonomy, see `BLACK_BOX_CONSTITUTION.md`.  
For system positioning and flow, see `BLACK_BOX_ARCHITECTURE.md`.

---

## 1. Purpose

The Event Model exists to give the Black Box a **shared language for platform-significant facts** before any technical representation is chosen.

Its purpose is to answer, at the conceptual level:

- What counts as an event worth remembering?
- How does an event differ from noise, state, or opinion?
- How do events relate to one another across time and domain?
- How does trust in an event mature without rewriting history?

The model serves investigators, architects, and future implementers equally. It defines meaning first. Representation comes later.

---

## 2. Event Philosophy

Events are the **atoms of accountability** in RealEstateSniper.

The Black Box does not primarily remember screens, queries, or current state. It remembers **that something materially happened** — or was authoritatively recognized — and preserves that fact for later explanation and proof.

Event philosophy rests on five commitments:

1. **Meaning over volume** — An event must carry investigable significance. Not every signal is an event.
2. **Recognition at the source** — Events arise where truth is decided, not where truth is displayed.
3. **Distinct facts, shared stories** — Events remain separate even when they belong to the same journey.
4. **Additive maturity** — Explanation, evidence, and trust posture may evolve; the original assertion does not.
5. **Visible uncertainty** — Provisional, observed, or disputed events are first-class citizens, not embarrassments to hide.

The Event Model is not a logging standard. It is an institutional memory standard.

---

## 3. What is an Event

An event is a **recognized platform-significant fact** that the Black Box accepts into durable memory.

An event is not:

- Current product state
- A dashboard metric
- An operator summary
- A guess about what probably happened
- A merged narrative replacing multiple underlying facts

An event is:

- A durable assertion that something consequential occurred or was confirmed
- Classifiable within the constitutional taxonomy
- Attributable to an actor, system, or external authority where possible
- Capable of receiving explanation and evidence over time
- Immutable once accepted into institutional memory

Every event in the Black Box ultimately becomes a **Record** — the immutable assertion layer described in the constitution. The Event Model describes the conceptual life of that fact before, during, and after it becomes a Record.

---

## 4. Event Characteristics

Every event in the Black Box model is understood through shared characteristics. These are conceptual qualities, not data fields.

**Materiality**  
The event changes or confirms something that matters to trust, access, money, ownership, security, or governance.

**Attribution**  
The event can be associated with who or what caused or recognized it: a person, a privileged operator, an automated process, or an external authority.

**Temporal authority**  
The event has a moment when the fact occurred or was recognized, distinguishable from when it was recorded or enriched.

**Domain placement**  
The event belongs primarily to one category of platform meaning, even if it touches several domains secondarily.

**Classifiability**  
The event can be typed, prioritized, and severity-scored without collapsing into generic noise.

**Explainability**  
The event can be described in human language to a qualified reviewer without insider folklore.

**Corroborability**  
The event may stand alone initially but must be capable of receiving evidence that strengthens or challenges trust.

**Immutability after acceptance**  
Once the event enters durable memory, its core assertion is not rewritten. Later knowledge arrives additively.

**Traceability**  
The event can be followed from origin through consequence, enrichment, and investigation use.

An event missing materiality does not belong in the Black Box. An event missing attribution may still be admitted provisionally if its significance demands preservation.

---

## 5. Event Types

Event type describes **what kind of assertion** the Black Box is receiving, independent of domain category.

**Primary assertion**  
A new material fact recognized for the first time: a purchase completed, an owner submitted verification material, a deal became visible, a security block triggered.

**Provisional assertion**  
A fact recorded before full validation or corroboration is available. The platform acknowledges uncertainty explicitly.

**Corrective assertion**  
A later event that clarifies or corrects understanding without erasing the original assertion. History moves forward; it is not rewritten.

**Enrichment assertion**  
An additive layer of explanation or interpretive context bound to an earlier event. Enrichment deepens meaning; it does not replace the original fact.

**Evidence assertion**  
A record that a corroborating artifact, external confirmation, or supporting fact became available and was linked to an existing event or case.

**Rejection or failure assertion**  
A recognized attempt that did not succeed: failed authentication, failed payment, rejected verification, blocked action. Failures are often as investigable as successes.

**Recovery assertion**  
A record that missing, delayed, or reconstructed truth was restored with explicit marking of how reconstruction occurred.

**Governance assertion**  
A record about how the Black Box itself was accessed, exported, restricted, or reviewed under investigation authority.

Type and category work together. Category answers *which domain*; type answers *what kind of memory operation* the event represents.

---

## 6. Event Categories

Event category describes **which domain of platform meaning** an event primarily belongs to.

Categories are conceptual domains, not product modules and not storage partitions. Every event has one primary category. Secondary domain touchpoints may appear in explanation or correlation, but classification must remain clear for investigation.

The Black Box must be able to represent events across the full constitutional taxonomy, including:

- Authentication
- User Account
- Legal Acceptance
- Marketplace
- Purchases
- Payments
- External Payment Authority
- Founder
- Owner Portal
- Property Verification
- Documents
- Administrative Actions
- Role Changes
- Factory
- Engines
- Pipelines
- Enrichment
- Notifications
- Security
- System
- Platform Boundary
- Integrations
- Background Jobs
- Scheduled Tasks
- Errors
- Warnings
- Data Changes
- Audit Events

Category choice affects how investigators frame questions, how severity is judged, and how correlation expectations are set. A payment event and a purchase event may describe the same user journey but must remain categorically distinct when they assert different layers of truth.

The constitution defines each category's purpose and typical scope in full. This model treats category as a **classification obligation**, not as a catalog of implementation emitters.

---

## 7. Event Origin

Event origin describes **where the recognized fact came from** in the platform's causal reality.

**Human origin**  
A person acted directly: signed in, purchased, submitted property information, accepted legal terms.

**Privileged human origin**  
An authorized operator exercised governance power: approved, rejected, suspended, overrode, or corrected platform state.

**Automated origin**  
An internal process acted without immediate human intent: enrichment completed, eligibility recalculated, scheduled task ran, pipeline published output.

**External authority origin**  
An outside system confirmed or altered platform truth: payment authority callback, integration sync, partner signal, document delivery confirmation.

**System recognition origin**  
The platform detected a consequential condition without a single user gesture: integrity warning, empty marketplace, suspicious pattern, degraded performance affecting trust.

Origin is not the same as ownership or responsibility. Origin answers *what kind of reality produced the fact*. Ownership and responsibility answer *who must ensure the event is remembered faithfully*.

Late origin is acceptable. An external confirmation may arrive after the user experience moved on. The Event Model prefers honest delay over silent omission.

---

## 8. Event Ownership

Event ownership describes **who holds the institutional obligation** for an event's existence in memory, not who caused the underlying fact.

**Domain ownership**  
Each platform domain owns the obligation to recognize and emit its material facts at the source of truth. Authentication owns sign-in outcomes. Marketplace owns visibility changes. Purchases own entitlement grants. External payment flows own financial confirmations received at the boundary.

**Black Box ownership**  
The Black Box owns the obligation to preserve accepted events as immutable institutional memory, govern their enrichment, and make them reconstructible for investigation. It does not own the business decision that created the fact.

**Investigation ownership**  
Authorized reviewers own the obligation to use events responsibly: scoped access, minimum necessary disclosure, and traceable export. Investigation consumes memory; it does not author it.

**No single viewport ownership**  
No operator interface, dashboard, or presentation layer owns events. Viewports may read history when authorized; they do not define whether history exists.

Ownership prevents the common failure mode where accountability memory depends on whichever surface happened to be open when the fact occurred.

---

## 9. Event Responsibility

Event responsibility divides **who must do what** across the life of an event.

**Recognition responsibility**  
The authoritative domain must recognize when a material fact occurs and initiate recording without waiting for downstream convenience.

**Emission responsibility**  
The source of truth must signal the event to the Black Box in a form faithful to what was decided. Emission must not depend on presentation layers being complete.

**Validation responsibility**  
The intake path must assess plausibility, category fit, and source authority before an event is treated as trusted history. Validation is quality control, not censorship of inconvenient truth.

**Persistence responsibility**  
The Black Box must accept durable memory obligations once an event passes recognition. Non-critical downstream failure must not erase the assertion.

**Enrichment responsibility**  
Domains, reviewers, or automated explainers may attach meaning and proof later. Enrichment must remain additive and visibly bound to the original event.

**Correlation responsibility**  
The architecture must link related events without merging them. Investigators should not have to manually rediscover obvious journeys.

**Governance responsibility**  
Access, export, retention restriction, and recovery must be deliberate, auditable, and visible when they affect how an event can be seen or used.

Responsibility is shared. No single team owns the entire lifecycle, but the Black Box owns the guarantee that accepted events remain trustworthy witnesses.

---

## 10. Event Immutability

Immutability is the guarantee that **accepted historical assertions are not rewritten for convenience**.

Once an event enters durable Black Box memory:

- Its core fact remains visible as originally asserted
- Corrections arrive as new events or additive overlays
- Interpretation may mature without erasing first impressions
- Disputes are preserved, not smoothed away

Immutability protects:

- Investigators reviewing old disputes
- Users challenging past treatment
- Operators defending governance decisions
- External reviewers evaluating platform conduct

Immutability does not mean nothing ever changes. Trust posture, explanation depth, and evidence availability may evolve. What must not evolve silently is the record that a particular fact was asserted at a particular time.

The Event Model treats immutability as a **moral and architectural constraint**, not as a technical trick. If the platform needs to change forward, it may. The Black Box remembers what was true when the event was accepted.

---

## 11. Event Correlation

Correlation expresses that **separate events belong to the same story** without becoming a single event.

Correlation links events that share:

- A user or owner journey
- A purchase and payment sequence
- A property verification case
- An administrative intervention chain
- A factory or pipeline run
- A security incident
- An external callback sequence

Correlation is a relationship layer. Each event keeps its own identity, category, and trust posture. Investigators see both the individual facts and the narrative context connecting them.

Correlation must not:

- Merge distinct facts into one undifferentiated record
- Invent causality without basis
- Hide contradiction between related events
- Collapse platform truth and external authority truth into one ambiguous assertion

Correlation succeeds when an investigator can reconstruct how separate domains participated in the same real-world outcome.

---

## 12. Event Timeline

A timeline is the **ordered reconstruction of events as they mattered** to the platform, an actor, or a case.

Timelines are investigator views, not raw chronology alone. They must express:

- When facts occurred
- When facts were recorded
- When enrichment arrived
- Where delay or concurrency changed interpretation
- Which events were provisional at a given moment

The Event Model supports timelines at multiple scopes:

- Single actor
- Single deal or property case
- Single purchase and payment flow
- Single administrative action chain
- Single system incident
- Single cross-domain dispute

Timelines must tolerate delayed events, out-of-order recognition, and provisional assertions without breaking narrative integrity. A timeline that hides timing uncertainty is worse than one that exposes it.

---

## 13. Event Relationships

Relationships describe **how one event stands relative to another** in meaning, not merely in time.

**Caused by**  
One event materially led to another.

**Confirmed by**  
A later event or evidence source independently supports an earlier assertion.

**Contradicts**  
Two events assert incompatible truths pending resolution.

**Enriches**  
Explanation or proof deepens an earlier event without replacing it.

**Supersedes interpretively**  
Later understanding replaces how an event should be read, not the fact that it was originally asserted.

**Blocks**  
One event prevented another outcome from occurring.

**Depends on**  
A later event would not make sense without an earlier one.

**Exported under**  
An event became part of a governed external review package.

Relationships turn institutional memory into a **graph of meaning**. Flat chronology is insufficient for disputes where causality, conflict, and corroboration all matter.

---

## 14. Event Evidence

Evidence is **corroboration linked to an event**, not a substitute for the event itself.

Evidence may include:

- External authority confirmations
- Document intake receipts
- Notification delivery outcomes
- Related supporting events
- Redacted artifacts sufficient for review
- Recovery sources used to reconstruct missing truth

Evidence links strengthen or weaken trust. They do not erase the original assertion. An event may exist before evidence arrives; an event without evidence must be visibly less certain when certainty matters.

The evidence model follows a conceptual chain:

1. Event recognized and accepted
2. Explanation attached
3. Evidence linked
4. Trust posture updated, held provisional, or marked disputed

Evidence may branch. Multiple sources may support one event. One artifact may support multiple related events. Investigators must see what was known, when it was known, and what remained unproven.

Evidence handling must respect minimum necessary disclosure. The Event Model prefers reference and redaction thinking over reckless exposure of sensitive material.

---

## 15. Event Lifecycle

The event lifecycle describes **how an event moves from recognition to long-term investigability**.

**Recognition**  
A material fact occurs or is authoritatively detected.

**Intake**  
The fact enters the Black Box boundary from its source of truth.

**Validation**  
Plausibility, category, timing, and source authority are assessed.

**Acceptance**  
The event becomes durable institutional memory.

**Immutability**  
The core assertion is protected from rewrite.

**Enrichment**  
Explanation and evidence may arrive additively.

**Correlation**  
The event is linked to related facts across domains.

**Investigation use**  
Authorized reviewers reconstruct timelines, relationships, and cases.

**Governed availability**  
Retention, restriction, archiving, export, or recovery alter accessibility without rewriting truth.

**Traceability closure**  
The platform can answer where the event came from, what it affected, what supported it, and who reviewed it.

Lifecycle phases may overlap. Evidence may arrive long after acceptance. Recovery may occur after partial loss. The lifecycle is a conceptual map of obligations, not a rigid pipeline.

---

## 16. Event Classification

Classification is the **act of placing an event correctly within type, category, priority, severity, and trust posture**.

Classification must happen early enough that investigators can filter meaningfully and late enough that provisional truth is not discarded merely because context was incomplete.

Classification dimensions work together:

- **Type** — what kind of assertion this is
- **Category** — which domain of meaning it primarily belongs to
- **Priority** — how urgently it demands attention in investigation or intake
- **Severity** — how consequential it is to users, money, security, or governance
- **Trust level** — how confidently the platform can stand behind the assertion

Misclassification is a trust defect. The model prefers explicit provisional admission over silent miscategorization. Later corrective and enrichment events may refine classification without rewriting the original acceptance.

Classification must remain intelligible to human reviewers. Obscure taxonomies defeat the purpose of institutional memory.

---

## 17. Event Priority

Priority expresses **how urgently an event demands attention** in intake, investigation, or incident response.

Priority is not a scheduling implementation. It is a conceptual signal about investigability and risk.

**Immediate priority**  
Active security threat, ongoing financial harm, privileged abuse in progress, or integrity failure affecting live trust.

**High priority**  
Material money, access, or ownership change with dispute potential; contradictory signals across domains; missing expected sequence in a sensitive flow.

**Normal priority**  
Standard platform-significant activity that must be remembered but does not require instant escalation.

**Low priority**  
Recorded for completeness and sequence reconstruction, unlikely to drive immediate intervention.

**Deferred review priority**  
Known event whose full meaning depends on later enrichment before investigation should draw strong conclusions.

Priority may change as context matures. A normal event may become high priority when correlated with a dispute. Priority changes must themselves be explainable without rewriting the original event.

---

## 18. Event Severity

Severity expresses **how consequential an event is** if its asserted fact is true.

Severity considers impact on:

- User or owner access and fairness
- Money movement and entitlement
- Property claims and verification integrity
- Security and abuse potential
- Platform governance and privileged power
- Marketplace trust and visibility truth

**Critical severity**  
Wide blast radius, legal exposure, active harm, or fundamental integrity breakdown.

**Major severity**  
Significant user, financial, or governance consequence for one actor or case.

**Moderate severity**  
Material but bounded consequence; important for reconstruction and support.

**Minor severity**  
Low immediate impact but still worth remembering for sequence integrity.

**Informational severity**  
Contextual signal that helps explain a larger story without being harmful on its own.

Severity is not the same as priority. A low-severity event may become high priority if it completes a pattern. A critical-severity event may have been preventable if earlier low-severity signals had been correlated sooner.

---

## 19. Event Trust Level

Trust level expresses **how confidently the Black Box can stand behind an event** at a given moment.

**Verified**  
Corroborated by independent evidence or authoritative confirmation sufficient for the category.

**Asserted**  
Reported by a trusted internal source without external corroboration yet.

**Observed**  
Detected by monitoring, inference, or partial signal; confirmation still pending.

**Provisional**  
Admitted before validation or explanation is complete because omission would be worse than uncertainty.

**Disputed**  
Contradicted by later events, conflicting evidence, or unresolved cross-domain mismatch.

Trust level is visible uncertainty, not a quality grade to hide. False certainty corrupts investigation more than provisional admission.

Trust may mature additively:

- Observed may become asserted when internal validation completes
- Asserted may become verified when evidence arrives
- Verified may become disputed when contradictory proof appears
- Any level may remain explicitly provisional if the case demands caution

Trust level does not replace the event. It qualifies how the event should be read.

---

## 20. Future Evolution Rules

The Event Model may evolve only when evolution **strengthens truth, trust, or defensibility**.

**Allowed evolution**

- New categories when a new domain of platform meaning becomes materially significant
- Richer type distinctions when investigation repeatedly confuses distinct assertions
- Clearer relationship vocabulary when cross-domain cases expose narrative gaps
- Sharper priority and severity guidance when review practice matures
- More explicit trust posture rules when uncertainty handling proves insufficient

**Evolution requirements**

Every proposed change must answer:

1. What new truth becomes expressible?
2. Why is that truth materially important?
3. Does the change preserve immutability and additive enrichment?
4. Does the change avoid coupling memory to any single presentation layer?
5. Can existing events remain intelligible without reinterpretive erasure?

**Disallowed evolution**

- Turning events into undifferentiated telemetry
- Collapsing categories to suit dashboard convenience
- Merging financial, entitlement, and ownership assertions because journeys are hard to follow
- Redefining old events silently when taxonomy changes
- Expanding scope because empty investigation surfaces exist

Amendments to this model require explicit review alongside the constitution and architecture. Convenience is not sufficient justification.

When type, category, priority, severity, or trust guidance matures, older events remain valid under the taxonomy that accepted them. New rules apply forward and through additive clarification, not through historical rewrite.

---

## Closing Note

The Event Model defines **the shape of memory** the Black Box must hold.

Events are meaningful facts. Categories place them in platform reality. Origin, ownership, and responsibility ensure they are recognized faithfully. Immutability, correlation, timelines, relationships, and evidence make them reconstructible. Classification, priority, severity, and trust level make them usable under dispute.

Representation will be defined later. This document defines the conceptual model that representation must serve.
