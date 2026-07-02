# RealEstateSniper Black Box — Export Model

Conceptual model for how the Black Box **discloses institutional memory outside the normal review boundary** under governance.

This document defines **how export is authorized, scoped, composed, protected, and delivered** for investigation handoff, legal process, audit, support, and compliance. It does not define new event classes, redefine the Investigation Model, or prescribe formats, interfaces, or implementation.

For how investigations reconstruct truth, see `BLACK_BOX_INVESTIGATION_MODEL.md`.  
For export and legal governance rules, see `BLACK_BOX_GOVERNANCE.md`.  
For evidence custody and retention posture, see `BLACK_BOX_RETENTION_AND_EVIDENCE_POLICY.md`.  
For export layer architecture, see `BLACK_BOX_ARCHITECTURE.md`.  
For confidentiality and probative protection, see `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Export Model exists so that accountability memory can **leave the platform boundary without losing discipline**.

Its purpose is to answer:

- When may institutional memory be disclosed outside authorized review?
- Who may authorize export, for what purpose, and to whom?
- What belongs inside an export package and what must be withheld or redacted?
- How does export preserve integrity, custody, and defensibility for counsel, auditors, regulators, and dispute parties?

Export is not a backup mechanism. It is **governed disclosure** of truth already preserved in the Black Box.

---

## 2. Export Philosophy

Export philosophy treats disclosure as a **privileged act with consequences**, not as downloading history.

Philosophy principles:

1. **Purpose before package** — Export serves a stated accountability need; it does not follow curiosity or convenience.
2. **Minimum necessary disclosure** — Packages include what the recipient need requires, not full platform memory.
3. **Source memory is sacred** — Export reads and assembles; it does not rewrite, replace, or mutate accepted assertions.
4. **Parallel truth preserved** — Platform facts, external authority facts, operator actions, and communication outcomes remain distinguishable in what is disclosed.
5. **Redaction is explicit** — Omission and minimization are governed choices, not silent erasure of inconvenient facts from source memory.
6. **Custody continues** — Export creates a new disclosure artifact with its own accountability trail; custody does not end at the boundary.
7. **Recipient discipline** — What may be shown to counsel may not be appropriate for a partner, user, or regulator without re-scoping.

Export serves investigation conclusions, legal process, audit answers, formal support escalation, and compliance response — each with different proportionality expectations.

---

## 3. Export Authorization

Export authorization defines **who may approve disclosure and under what legitimacy**.

Authorization principles:

**Lawful purpose**  
Every export requires an identifiable purpose: investigation handoff, legal review, regulatory inquiry, formal dispute response, audit examination, or governed support escalation with accountability consequence.

**Role authority**  
Only governed roles may authorize export. Authorization binds to purpose, sensitivity class, and recipient category — not to permanent blanket access.

**Investigation linkage**  
Export may follow a bounded investigation, but authorization remains explicit. Investigation scope does not automatically entitle unconstrained export.

**Separation of duties**  
Those who operate live product state should not be the sole unreviewed authority for sensitive export without governance oversight where policy requires.

**Traceable approval**  
Who authorized export, when, and for what stated purpose must remain accountable. Informal forwarding of memory is outside this model.

**Re-authorization**  
Expanded scope, new recipient class, or renewed disclosure after restriction requires fresh authorization rather than assumed continuity.

Export without authorization is not export under the Black Box model; it is uncontrolled disclosure.

---

## 4. Export Scope

Export scope defines **what memory may enter a package** before composition begins.

**Scope anchors**

Export scope may anchor on the same investigatory subjects defined in the Investigation Model — actor, case, payment flow, admin chain, incident episode, factory run, integration boundary sequence, or cross-domain dispute — but must be **re-stated for disclosure**, not assumed from review scope alone.

**Scope dimensions**

- **Domain layers** — which catalog truths may be included
- **Time boundaries** — which periods matter to the recipient need
- **Actor boundaries** — which participants may appear
- **Sensitivity boundaries** — which material classes require redaction or omission
- **Recipient boundaries** — what the named recipient category is entitled to receive

**Scope discipline**

- Narrow enough to protect unrelated participants and unrelated memory
- Broad enough to answer the authorized question without misleading partiality
- Explicit about excluded material when exclusion could be misread as absence of fact

**Scope expansion**

Broader disclosure requires broader authorization. Silent scope growth between review and export is a governance failure.

---

## 5. Export Composition

Export composition defines **how selected memory is assembled into a coherent disclosure artifact** without inventing new facts.

Composition principles:

1. **Events remain domain-native** — Included assertions keep their catalog identity and layer meaning; composition does not merge them into undifferentiated narrative blobs.
2. **Timeline when helpful** — Chronological reconstruction may accompany raw assertions when the recipient need requires sequence understanding.
3. **Correlation visible** — Relationships between events may be explained without collapsing event classes.
4. **Bounded findings optional** — An export may include investigator conclusions when authorized, clearly separated from source assertions.
5. **Gaps and uncertainty explicit** — Missing memory, provisional posture, and unresolved contradiction must not be hidden in composed output.
6. **No synthetic facts** — Composition must not create assertions that no event class or authorized finding contains.

Composition translates institutional memory into **recipient-legible accountability material** while preserving layer discipline established by the catalogs.

---

## 6. Evidence Packaging

Evidence packaging defines **how corroborating material accompanies exported assertions**.

Packaging principles:

**Linkage preserved**  
Evidence remains tied to the assertions it supports. Packages show which proof belongs to which fact.

**Reference over bulk**  
Prefer governed references, summaries, and redacted extracts over reckless inclusion of sensitive source material.

**Per-domain respect**  
Each functional catalog describes evidence posture conceptually. Packaging honors those boundaries during export.

**Proportionality**  
Include evidence sufficient for the recipient need — not every linked artifact the platform ever stored.

**Visible withholding**  
When evidence cannot be included due to sensitivity, policy, or legal limit, packaging should make governed withholding legible where appropriate without exposing what was withheld.

Evidence packaging strengthens defensibility. It does not turn export into an ungoverned document repository dump.

---

## 7. Redaction Principles

Redaction principles define **how minimum necessary disclosure is achieved** without corrupting source memory.

Redaction principles:

1. **Source untouched** — Redaction applies to the disclosure artifact, not to accepted institutional assertions.
2. **Purpose-driven** — Redaction serves privacy, security, legal limitation, third-party rights, and proportionality — not embarrassment avoidance.
3. **Participant protection** — Unrelated individuals must not be exposed through excessive package breadth.
4. **Tiered sensitivity** — Identity, financial, document, privileged-action, and security-sensitive material receive heightened minimization care.
5. **Explicit omission** — Material omitted for policy or legal reasons should be documentable as omission where governance requires, without fabricating placeholder facts.
6. **No false completeness** — A redacted package must not imply that memory did not exist when omission was governed.

Redaction is a **discipline of disclosure**, not a mechanism for rewriting history.

---

## 8. Chain of Custody

Chain of custody defines **how disclosure artifacts remain accountable from assembly through recipient handling**.

Custody principles:

**Assembly accountability**  
Who composed the package, under what authorization, and from what scope must remain traceable.

**Transfer accountability**  
Disclosure to a recipient category should be governable as a transfer of controlled material, not informal sharing.

**Derivative control**  
Recipients receive scoped material for stated purpose. Further redistribution expectations are a governance and legal matter outside unconstrained platform assumption.

**Integrity through transfer**  
Custody thinking requires that exported material remain attributable to the platform's governed assembly process rather than appearing as unattributed copies.

**Retention alignment**  
Exported artifacts may have their own retention and restriction obligations aligned with the sensitivity they carry.

Chain of custody protects probative value. Export that cannot be traced is weak export.

---

## 9. Export Integrity

Export integrity defines **how disclosure artifacts remain trustworthy as representations of institutional memory**.

Integrity principles:

1. **Faithful assembly** — Packages must not misrepresent included assertions, timing, or trust posture.
2. **No silent editing of facts** — Changing wording of an assertion in export in ways that alter meaning is forbidden; explanation may surround facts, not replace them.
3. **Tamper awareness** — Export processes should support recognition if a package was altered after governed assembly where policy requires.
4. **Version clarity** — When memory was enriched after an earlier review, export should not present later enrichment as if it existed at original occurrence unless explicitly framed.
5. **Contradiction preserved** — Integrity does not mean smoothing conflict; unresolved tension may remain visible.

Export integrity ensures recipients can trust that the package **represents memory honestly within its stated scope**, not that the platform guarantees a single comfortable story.

---

## 10. Export Recipients

Export recipients define **for whom disclosure is designed** and how recipient class shapes the package.

Recipient categories include:

- **Internal leadership and governance** — decision support within authorized oversight
- **Legal counsel** — dispute preparation and legal process support
- **External auditors** — control and accountability examination
- **Regulators** — lawful supervisory inquiry response
- **Formal dispute parties** — user, owner, investor, or partner dispute response where authorized
- **Governed support escalation** — support paths with material accountability consequence

**Recipient shaping**

Each category implies different scope breadth, redaction intensity, explanatory depth, and finding inclusion. The same underlying memory may produce different packages for different recipients under different authorizations.

**Recipient limits**

Recipients do not gain ownership of institutional memory. They receive scoped disclosure for stated purpose.

**Third-party rights**

Packages must respect third-party privacy and contractual boundaries that limit what one participant's dispute may expose about another.

Recipient discipline prevents one-size-fits-all dumps disguised as transparency.

---

## 11. Export Restrictions

Export restrictions define **when disclosure must be limited, delayed, or refused** despite investigative interest.

Restriction triggers include:

- lacking valid authorization or lawful purpose
- active legal hold or regulatory constraint
- security incident containment requiring isolation
- disproportionate exposure of unrelated participants
- immature provisional memory where disclosure would mislead
- jurisdictional or cross-border limitation
- recipient class incompatible with material sensitivity
- risk of destroying probative value through over-disclosure

**Restriction posture**

Restriction prefers governed delay, partial package, or redacted release over silent informal sharing or destructive source mutation.

**Restriction visibility**

Where policy allows, authorized requesters should understand that restriction occurred without exposing restricted material improperly.

Export restrictions protect people, the institution, and the probative value of memory itself.

---

## 12. Governance

Export governance ensures disclosure remains **as disciplined as recording and investigation**.

Governance principles:

1. **Authorization required** — No export without governed approval appropriate to sensitivity.
2. **Least necessary package** — Scope and redaction follow proportionality, not convenience.
3. **Auditable disclosure** — Significant export should be capable of leaving governance-visible accountability traces where policy requires.
4. **Separation from operation** — Export does not correct product state or substitute for admin action.
5. **Alignment with investigation** — Export may hand off investigation output but does not replace investigation method defined elsewhere.
6. **No taxonomy pressure** — Export discomfort must not drive retroactive renaming of event classes.

**Governance questions for export practice**

- Is purpose, recipient, and scope explicitly authorized?
- Does the package preserve domain separation and parallel truth?
- Are redaction and omission governed rather than silent?
- Does export mutate source memory in any way?
- Can custody and integrity be defended if challenged?

Export governance connects this model to `BLACK_BOX_GOVERNANCE.md` without duplicating full authority structure.

---

## 13. Compliance Considerations

Compliance considerations align export with **lawful, proportionate, and defensible** institutional conduct.

Compliance principles:

**Lawful basis**  
Disclosure must be justifiable under applicable legal, regulatory, and contractual obligations — not merely technically possible.

**Proportionality**  
Collect and disclose no more than accountability need requires.

**Retention interplay**  
Export does not override retention or restriction policy on source memory; it creates additional disclosure obligations for the package itself where applicable.

**Regulatory inquiry**  
Regulator-facing packages emphasize traceability, scope clarity, and explicit treatment of uncertainty.

**Privacy and participant rights**  
Participant protection limits what dispute-driven export may include about unrelated parties.

**Cross-border caution**  
Disclosure across jurisdictions requires governance awareness before package assembly, not improvisation at handoff.

**Audit defensibility**  
Auditors need understandable scope and faithful representation more than exhaustive internal intimacy.

Compliance considerations guide **how export behaves in the real world**, not how much memory can be maximally released.

---

## 14. Future Evolution

Export model evolution may refine **how disclosure is governed**, never by weakening source memory discipline.

**Allowed evolution**

- Clearer recipient-category package principles as legal and audit needs mature
- Finer redaction and omission guidance as sensitivity classes evolve
- Stronger custody and integrity articulation as cross-border use grows
- Better handoff patterns between investigation closure and export authorization

**Evolution requirements**

Every proposed export-model change must answer:

1. Does it improve governed disclosure without creating new event classes?
2. Does it preserve source memory immutability and domain separation?
3. Does it strengthen proportionality and recipient discipline?
4. Does it remain distinct from investigation method and product operation?
5. Does it avoid implementation leakage such as formats, endpoints, or storage design?

**Disallowed evolution**

- Defining new event classes inside the export model
- Treating export as bulk backup or analytics warehouse extraction
- Allowing export to rewrite or replace accepted assertions
- Collapsing redaction into silent source modification
- Making technical delivery mechanism a prerequisite for defining export meaning

Amendments to this model require governance review alongside the constitutional and investigation corpus. Recipient convenience is not sufficient justification.

---

## 15. Closing Principles

The Export Model rests on a small set of enduring principles:

**Export is disclosure, not duplication of power**  
Recipients receive scoped truth; they do not inherit dominion over institutional memory.

**Investigation may precede export, but does not replace authorization**  
Reconstruction and handoff are related; permission to disclose remains explicit.

**Memory stays layered**  
Packages preserve domain-separated assertions and parallel witnesses unless authorized finding explains composition.

**Redaction protects people; omission must be honest**  
Minimum necessary disclosure is a duty, not an excuse to hide institutional facts from source memory.

**Custody and integrity make export defensible**  
A package that cannot be traced or trusted wastes the Black Box's purpose.

**Compliance is a constraint, not an afterthought**  
Lawful, proportionate export begins at scope design, not at send time.

**Governance travels with every handoff**  
If disclosure is sensitive enough to matter, it is sensitive enough to govern.

---

## Closing Note

This model defines **how RealEstateSniper exports Black Box memory under control**.

The Investigation Model explains how truth is reconstructed. The Export Model explains how reconstructed truth — and the underlying assertions it depends on — may cross the platform boundary for legal, audit, support, and compliance needs without betraying immutability, proportionality, or layer discipline. Delivery mechanisms come later. Governed disclosure begins here.
