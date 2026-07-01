# RealEstateSniper Black Box — Event Naming Standard

Official rules for how every Black Box event is named before any catalog of concrete names is defined.

This document defines **the naming grammar, constraints, and evolution rules** that all future event names must follow. It does not define storage, transport, permissions, implementation, or a registry of actual event names.

For what an event is, see `BLACK_BOX_EVENT_MODEL.md`.  
For constitutional taxonomy and category meaning, see `BLACK_BOX_CONSTITUTION.md`.

---

## 1. Purpose

The Event Naming Standard exists so that every Black Box event can be **identified consistently, understood by humans, and distinguished unambiguously by systems** — without relying on tribal knowledge or ad hoc labels.

Its purpose is to answer, at the rule level:

- How should an event name express domain, action, and subject?
- What makes a name valid for institutional memory?
- What patterns must never appear in official names?
- How do names evolve when taxonomy matures without rewriting history?

The standard serves investigators reading case timelines, architects defining intake boundaries, and future authors registering new events. Rules come first. The catalog comes later.

---

## 2. Naming Philosophy

A Black Box event name is a **stable identifier for a material fact**, not a log message, not a UI label, and not a developer convenience string.

Naming philosophy rests on five commitments:

1. **One name, one meaning** — Each official name identifies exactly one class of platform-significant assertion. Synonyms and aliases are not allowed at the canonical level.
2. **Domain before decoration** — The name must reveal which area of platform meaning the event belongs to before optional qualifiers.
3. **Past-tense truth** — Names describe what was recognized as having occurred or been confirmed, not what the platform hopes will happen next.
4. **Institutional durability** — A name chosen for an event class is expected to outlive product surfaces, refactors, and operator workflows.
5. **Separation from presentation** — Names belong to accountability memory, not to screens, routes, or internal module labels.

The naming standard is conservative by design. Clarity and longevity matter more than brevity or fashion.

---

## 3. Consistency Rules

All official event names must obey the same structural and semantic rules across the entire Black Box.

**Single canonical form**  
Every event class has exactly one canonical name. Informal shorthand may exist in conversation but must not replace the official identifier in records or investigation exports.

**Structural uniformity**  
All names follow the same ordered grammar defined by this standard: domain scope, action verb, and object or subject scope, with optional qualifiers only where the standard allows.

**Category alignment**  
Every name must map clearly to one primary constitutional category. If a name could reasonably belong to two categories, the name is ambiguous and must be revised before registration.

**Tense uniformity**  
All action verbs use the same temporal convention: completed recognition of a fact, not in-progress intention.

**Case and separator uniformity**  
One casing convention and one separator convention apply platform-wide. Mixed conventions within the same namespace are forbidden.

**Locale neutrality**  
Canonical names are language-neutral tokens. Human-readable meaning lives in explanation layers, not in translated or localized name variants.

**No implicit context**  
A name must be intelligible without requiring knowledge of which screen was open, which release was live, or which internal team coined it.

**Registration before emission**  
No domain may emit events under names that have not been registered under this standard. Ad hoc naming at intake is a governance failure.

Consistency makes correlation, search, and cross-domain investigation possible years after the original fact was recorded.

---

## 4. Human Readability

Event names must remain **legible to qualified human reviewers** who may not have written the emitting domain.

**Parseable on sight**  
A reviewer should be able to separate domain, action, and subject mentally without a lookup table for every token.

**Plain vocabulary**  
Prefer ordinary platform vocabulary over abbreviations, acronyms, and internal project codenames. When acronyms are unavoidable, they must be defined once in the registry glossary, not embedded opaquely in names.

**No cryptic compression**  
Names must not sacrifice clarity for byte length. Investigators read names under dispute pressure; obscurity is a defect.

**Action clarity**  
The verb portion must answer what kind of change or recognition occurred: granted, rejected, detected, received, opened, revoked, and similar plain past-tense forms — never ambiguous generic tokens that could mean several outcomes.

**Subject clarity**  
The object portion must answer what domain entity the action applied to: account, deal, purchase, verification case, entitlement, callback, and similar stable platform nouns — not transient UI constructs.

**Readable in sequence**  
When names appear in a timeline, their shared grammar should make narrative scanning possible without verbal translation on every line.

Human readability does not mean prose sentences. It means disciplined tokens that still read as intentional institutional language.

---

## 5. Machine Readability

Event names must also work as **stable machine identifiers** across intake, correlation, retention policy, and investigation tooling that has not been invented yet.

**Fixed token boundaries**  
Separators must make automatic parsing reliable. Spaces, ambiguous punctuation, and visually similar characters are forbidden in canonical names.

**Character set discipline**  
Only characters from the approved canonical alphabet may appear. Characters that break parsing, sorting, or cross-system exchange are forbidden.

**No embedded dynamic values**  
Names must not include variable fragments such as identifiers, timestamps, counts, hashes, or user-supplied text. Dynamic values belong in event body and correlation context, not in the name.

**Sortable namespace hierarchy**  
Domain prefixes must create a predictable ordering and grouping behavior so related events cluster without custom logic per domain.

**Collision resistance by design**  
Grammar rules must make accidental duplicate names unlikely. When two teams need similar events, the standard forces explicit differentiation through domain or object scope, not through suffix improvisation.

**Version independence**  
The canonical name of an event class does not change when surrounding product version numbers change. Versioning is handled by the rules in this document, not by embedding release markers in names.

Machine readability protects automated integrity checks, policy application, and long-term registry hygiene.

---

## 6. Verb Principles

The verb is the **action of recognition** — what the platform asserts happened or was confirmed.

**Past tense only**  
Verbs describe completed recognition: accepted, failed, granted, revoked, detected, received, published, hidden, opened, closed, synchronized, rejected, recovered. Future or imperative mood is forbidden.

**Outcome-oriented**  
Verbs name the outcome class, not the mechanism. Prefer the business or security fact over the internal procedure that produced it.

**Single verb core**  
Each name contains one primary verb token. Chaining multiple verbs into a single name is forbidden except where the standard defines a fixed compound approved for one specific meaning.

**No vague verbs**  
Tokens such as generic “changed,” “updated,” or “handled” are forbidden unless qualified by an object and domain scope so specific that ambiguity is removed. When in doubt, choose the more precise outcome verb.

**Failure is explicit**  
Failed, rejected, blocked, and denied outcomes require verbs that state failure directly. Success and failure must never share the same name with inferred polarity elsewhere.

**External recognition verbs**  
Events arising from external authority use verbs that signal receipt or confirmation, not verbs that imply the platform initiated the action.

**Governance verbs**  
Events about investigation, export, restriction, or constitutional amendment use governance verbs distinct from product-domain verbs so they never masquerade as user or marketplace facts.

Verbs are the moral center of the name. They tell the investigator what kind of truth was asserted.

---

## 7. Object Principles

The object is **what the action applied to** — the stable subject of platform meaning.

**Platform nouns only**  
Objects must refer to durable concepts in the constitutional taxonomy: account, session, purchase, payment, entitlement, deal, verification case, document, role, cohort, pipeline run, callback, notification, export package, and similar institutional nouns.

**No interface nouns**  
Objects must not name buttons, panels, tabs, modals, routes, components, or layout regions. Interface elements are not accountability subjects.

**No storage nouns**  
Objects must not name tables, collections, buckets, queues, caches, or vendor-specific resource types. Memory technology is not domain language.

**Singular conceptual focus**  
Each name has one primary object token. If an event truly concerns two equally primary subjects, the name is wrongly scoped and should split into two event classes or move secondary subject into correlation context.

**Specific over generic**  
Prefer the narrowest object that remains stable over time. “Entitlement” is better than “thing” when entitlement is what changed.

**Object must not smuggle state**  
Objects name the entity class, not its current value. State belongs in the event assertion body and explanation, not in the identifier.

**Cross-domain objects**  
When the same noun appears in multiple domains, domain prefix disambiguates. Shared nouns without domain scope are forbidden.

Objects anchor the name in platform reality. They tell the investigator what part of the world moved.

---

## 8. Domain Principles

The domain prefix is **the primary constitutional home** of the event.

**One domain per canonical name**  
Every name begins with exactly one primary domain prefix aligned to the event model categories. Secondary touchpoints do not earn secondary prefixes in the same name.

**Domain vocabulary stability**  
Domain tokens use the constitutional domain language, normalized for naming: authentication, account, marketplace, purchase, payment, external payment authority, founder, owner portal, property verification, document, administrative action, role, factory, engine, pipeline, enrichment, notification, security, system, platform boundary, integration, background job, scheduled task, error, warning, data change, audit, governance.

**No nested product branding inside domains**  
Marketing names, internal codenames, and release theme names must not appear as domain tokens.

**Domain reflects source of truth**  
The prefix belongs to the domain that authoritatively recognizes the fact, not the domain that merely displays it.

**External authority isolation**  
Financial confirmations from outside the platform use the external payment authority or integration domain as appropriate — never the purchase domain alone when the asserted fact is financial receipt.

**Governance domain separation**  
Events about Black Box access, export, classification amendment, and investigation activity use the governance or audit domain, never product domains.

**Namespace flatness**  
Domain depth is limited to the approved prefix list. Arbitrary sub-domain trees invented by individual teams are forbidden unless formally added through evolution rules.

Domain first orientation ensures filters, policies, and mental models stay aligned with the constitution.

---

## 9. Event Identity

Event identity is **the permanent binding between a canonical name and the class of fact it represents**.

**Identity is not the instance**  
The name identifies the class of event. Individual occurrences are distinguished by time, actor, correlation context, and record identity elsewhere — never by altering the canonical name per occurrence.

**Immutable class identity**  
Once registered and emitted, the meaning attached to a canonical name is frozen. The same name must not later denote a different class of fact.

**Identity survives enrichment**  
Explanation, evidence, trust posture, and correlation may mature around an event. None of these alter its canonical name.

**Identity survives investigation**  
Export, review, and dispute do not rename events. Investigation packages reference canonical names unchanged.

**Registry authority**  
The official registry owns identity assignments. Domains may propose names; they do not own the namespace unilaterally.

**Collision prohibition**  
Two distinct event classes may not share one canonical name. Near-duplicate names with different meanings are equally forbidden.

**Identity trace in corrections**  
When a later corrective assertion clarifies an earlier fact, it receives its own canonical name. The original identity remains visible.

Event identity is how institutional memory stays honest across years of platform change.

---

## 10. Event Versioning Philosophy

Versioning applies to **how naming evolves**, not to individual event occurrences.

**Names are long-lived**  
Canonical names are chosen as if they will remain valid for the life of the platform unless formally deprecated.

**Taxonomy evolution is not rename by stealth**  
When constitutional categories mature, existing names remain valid under the meaning they held when registered. New understanding arrives through additive registry notes and, when necessary, new names — not silent redefinition.

**Version markers are exceptional**  
Explicit version suffixes on canonical names are disallowed by default. A version suffix is permitted only when two genuinely different event classes must coexist during a controlled transition and cannot be distinguished by domain or object scope alone.

**Transition windows**  
When a new name supersedes an old one for future emission, both may coexist during a declared transition. Historical records retain original names permanently.

**No release-based versioning**  
Product version numbers, sprint identifiers, and deployment markers must never appear in canonical names.

**Interpretive overlays are not versions**  
Explanation improvements and classification commentary are additive layers. They are not name versions.

Versioning philosophy prefers **new names forward, old names forever** over renaming the past.

---

## 11. Deprecation Rules

Deprecation retires a name from **future emission** without erasing **historical identity**.

**Deprecation is formal**  
A name is deprecated only through an explicit registry decision with stated reason, replacement guidance, and effective date for new emission.

**History remains addressable**  
Deprecated names continue to identify old records exactly as before. Investigators must still understand timelines that contain them.

**No silent deprecation**  
Stopping use of a name without registry action is forbidden. Orphaned names create investigation gaps.

**Replacement must be named**  
Every deprecation declares which canonical name or names absorb future emission of the same class of fact. If no replacement exists, deprecation is not allowed.

**Dual emission period**  
When risk warrants, old and replacement names may both be emitted for a bounded transition. Dual emission must be documented and time-limited.

**Deprecation is not deletion**  
Registry entries for deprecated names remain visible with status, rationale, and historical meaning preserved.

**Emergency deprecation**  
If a name proves misleading or harmful, emergency deprecation may accelerate transition but still cannot rewrite records already emitted under the old name.

Deprecation protects the future without laundering the past.

---

## 12. Reserved Names

Certain namespaces and tokens are **reserved** and must not be used for product-domain events without explicit constitutional approval.

**Governance namespace**  
Reserved for events about Black Box access, export, restriction, investigation activity, registry amendment, and trust posture governance.

**Audit namespace**  
Reserved for meta-audit assertions about recording, validation, correlation, recovery, and integrity of the Black Box itself.

**System namespace**  
Reserved for platform-wide integrity, availability, and recognition signals that are not owned by a single product domain.

**Temporary and experimental tokens**  
Prefixes implying experiment, test, draft, sandbox, or playground are reserved and forbidden in production emission.

**Wildcard and catch-all tokens**  
Names using generic catch-all verbs or objects — anything meaning “other,” “miscellaneous,” “unknown,” or “generic” — are reserved as prohibited unless a formal exception is granted.

**External vendor tokens as domains**  
Vendor names may not appear as domain prefixes except where the constitution recognizes an external authority as its own domain of meaning. Vendor names must never stand in for platform domains.

**Future namespace**  
Prefixes designated for not-yet-assigned constitutional categories are reserved until formally allocated.

Reserved names prevent namespace pollution and protect investigators from ambiguous or privileged tokens masquerading as ordinary product facts.

---

## 13. Forbidden Patterns

The following patterns are **always invalid** in canonical event names regardless of domain.

**Dynamic interpolation**  
Any pattern that embeds variable identifiers, timestamps, serial numbers, hashes, email addresses, or user-supplied text.

**Sentence names**  
Full natural-language phrases, questions, exclamation, or punctuation meant for human log reading rather than institutional identification.

**UI and navigation leakage**  
Names derived from screen titles, route paths, click targets, or component identifiers.

**Storage and infrastructure leakage**  
Names derived from persistence technology, queue names, job identifiers, or vendor resource labels.

**Polarity smuggling**  
Names that hide success or failure in the object while using a neutral verb, or names that require external flags to know what happened.

**Duplicate meaning through suffix improvisation**  
Creating near-duplicate names by appending ad hoc suffixes such as new, final, fixed, real, or temporary.

**Abbreviation stacks**  
Multiple consecutive opaque abbreviations that require insider knowledge to decode.

**Ambiguous homographs**  
Tokens that mean different things in different domains without domain prefix disambiguation.

**Emotional or blame language**  
Tokens that judge intent or assign moral language rather than describe recognized fact.

**Mixed tense or mood**  
Present participle, infinitive, or imperative verb forms in canonical names.

**Case chaos**  
Inconsistent casing within the canonical form or mixed separator styles in one name.

**Cross-name negation tricks**  
Pairing names that differ only by a negation particle when a single explicit outcome verb is required.

Forbidden patterns exist because each one has already caused audit failure in other systems: ambiguous timelines, unsearchable history, and ungovernable namespaces.

---

## 14. Future Evolution Rules

The naming standard may evolve only when evolution **strengthens clarity, consistency, or long-term investigability**.

**Allowed evolution**

- Adding formally reviewed domain prefixes when constitutional categories expand
- Tightening forbidden patterns when new failure modes appear
- Publishing the first official event catalog under an already-approved grammar
- Clarifying verb and object vocabularies without redefining existing registered names
- Introducing registry metadata requirements that do not alter canonical names

**Evolution requirements**

Every proposed change must answer:

1. Does it reduce ambiguity for human and machine readers?
2. Does it preserve immutable identity for already-emitted names?
3. Does it align with the event model and constitutional taxonomy?
4. Does it avoid coupling names to presentation or infrastructure?
5. Is the change additive rather than retroactively redefining?

**Disallowed evolution**

- Renaming past events by changing canonical identifiers retroactively
- Expanding namespaces for dashboard or analytics convenience
- Accepting domain-local dialects that break global consistency
- Registering names before domain and category ownership is clear
- Loosening forbidden patterns to speed up short-term delivery

Amendments to this standard require explicit review alongside the constitution, architecture, and event model. Convenience is not sufficient justification.

When the grammar matures, the catalog grows forward. The rules in this document remain the gate through which every new name must pass.

---

## Closing Note

The Event Naming Standard defines **how Black Box events will be called**, not yet which events exist.

Purpose and philosophy establish why names matter. Consistency, human readability, and machine readability establish universal form. Verb, object, and domain principles establish grammar. Identity, versioning, and deprecation establish longevity. Reserved names and forbidden patterns protect the namespace. Evolution rules keep the standard honest as the platform grows.

Concrete event names will be defined later under this standard. This document defines the rules they must obey.
