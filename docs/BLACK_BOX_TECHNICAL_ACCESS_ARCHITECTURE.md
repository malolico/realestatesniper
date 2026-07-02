# RealEstateSniper Black Box — Technical Access Architecture

Technology-independent access architecture for the Black Box — **how institutional memory may be reached** before any authentication product, authorization engine, or interface is chosen.

This document defines **logical access layers, access responsibilities, and access discipline** at high technical level. It does not define authentication mechanisms, authorization policies, row-level rules, tokens, APIs, endpoints, schemas, or code.

For technical system layers, see `BLACK_BOX_TECHNICAL_ARCHITECTURE.md`.  
For logical entities accessed, see `BLACK_BOX_TECHNICAL_DATA_MODEL.md`.  
For storage reachability posture, see `BLACK_BOX_TECHNICAL_STORAGE_ARCHITECTURE.md`.  
For event admission paths, see `BLACK_BOX_TECHNICAL_EVENT_PIPELINE.md`.  
For investigation method, see `BLACK_BOX_INVESTIGATION_MODEL.md`.  
For export discipline, see `BLACK_BOX_EXPORT_MODEL.md`.  
For access governance rules, see `BLACK_BOX_GOVERNANCE.md`.  
For memory protection, see `BLACK_BOX_SECURITY_MODEL.md`.

---

## 1. Purpose

The Technical Access Architecture exists so that future access implementation **serves accountability memory rather than turning it into ambient internal data**.

Its purpose is to answer:

- How should Black Box memory be reached through distinct access responsibilities?
- Which access paths are operational, investigatory, export-oriented, governance, or administrative?
- How do separation of duties, least privilege, emergency posture, and auditability apply at the technical layer?
- What rules must any future access design obey?

This document describes **access shape at the architectural level**. It does not name identity providers, permission models, query interfaces, or enforcement products.

---

## 2. Access Philosophy

Access philosophy treats Black Box memory as **governed witness under purpose binding**, not as a shared operational datastore.

Philosophy principles:

1. **Deny by default** — No standing right to institutional memory exists without governed grant.
2. **Purpose before reach** — Access begins from accountability need, not from role convenience.
3. **Read paths are secondary** — Admission and persistence precede investigation, export, and review convenience.
4. **Layer honesty** — Operational, investigatory, export, governance, and administrative access remain distinguishable.
5. **Minimum necessary visibility** — Access grants the narrowest slice sufficient for stated purpose.
6. **Access is accountable** — Sensitive reach into memory must remain associable with authorization facts where policy requires.
7. **Technology agnosticism** — This architecture must remain valid across any compliant access substrate.
8. **Decades horizon** — Access design must support long dispute reconstruction, not only near-term operator convenience.

Access exists to make **truth reachable under discipline**, not to make memory easy to browse.

---

## 3. Access Layers

The Black Box organizes access into **five logical access layers** plus cross-cutting governance and administrative control.

- **Operational Access Layer** — bounded reach for live product accountability without memory browsing
- **Investigation Access Layer** — scoped reconstruction and timeline assembly for authorized review
- **Export Access Layer** — governed disclosure package composition and handoff
- **Governance Access Layer** — policy, authorization accountability, and control over memory operations
- **Administrative Access Layer** — authorized presentation and operational support over memory surfaces

Layers are **logical access zones**. A future physical system may unify identity infrastructure, but access responsibilities must not blur.

**Read versus control posture**

- Operational access may trigger emission and observe bounded outcomes; it does not imply institutional memory browsing
- Investigation access is read-oriented reconstruction within scope
- Export access assembles derived disclosure artifacts; it does not mutate source memory
- Governance access governs grants, restrictions, and policy accountability
- Administrative access presents authorized views; it does not define admission or rewrite assertions

**Relationship to storage layers**

Access layers map to storage layers in `BLACK_BOX_TECHNICAL_STORAGE_ARCHITECTURE.md` without collapsing them. Reachability to Immutable Memory, Evidence, Correlation, Investigation, Export, Governance, and Retention storage zones is governed separately according to access layer purpose.

---

## 4. Operational Access

Operational Access covers **how live product domains and bounded operator workflows interact with the Black Box without treating memory as a general datastore**.

**Access responsibility**

- permit domain emission at authoritative recognition points
- permit bounded observation of admission outcomes where product accountability requires
- permit operational correlation context sufficient for later investigation
- deny ambient browsing of institutional memory from product runtime paths

**Permitted reach**

- signal handoff across the emission boundary
- status visibility for provisional, rejected, or accepted admission where product must respond
- narrow lookup of correlation handles already authorized for operational need

**Forbidden reach**

- full timeline reconstruction from operational surfaces
- investigation-grade assembly without investigation access layer authorization
- export package generation from operational paths
- direct mutation of accepted assertions through operational convenience

**Technical posture**

- operational paths are write-oriented at emission boundary and read-minimal inward
- operational failure must not expand access as workaround
- operational access does not inherit investigatory scope by default

Operational access keeps **product agility separate from memory archaeology**.

---

## 5. Investigation Access

Investigation Access covers **how authorized review reconstructs truth from stored primitives without editing history**.

**Access responsibility**

- permit scoped read across Immutable Memory, Evidence, and Correlation storage as investigation scope requires
- permit assembly into Investigation logical entities and timeline views
- permit bounded cross-domain correlation within stated accountability question
- deny write-back of findings as if they were domain events

**Scope binding**

- investigation access binds to stated purpose, sensitivity class, and subject matter
- scope narrows actor, subject, resource, time window, and domain layers — not universal memory
- provisional, disputed, restricted, and redacted posture must remain visible in reconstruction

**Read discipline**

- investigators receive read-oriented access unless a separate governed process authorizes otherwise
- investigation containers are derived; they do not replace source assertions
- gaps, contradictions, and unresolved trust posture remain explainable

**Forbidden patterns**

- treating investigation access as permanent standing visibility
- using investigation paths to correct live product state
- merging parallel truth layers into undifferentiated narrative
- expanding scope silently as investigation proceeds without re-authorization where required

Investigation access makes **composed truth legible** without laundering meaning.

---

## 6. Export Access

Export Access covers **how governed disclosure packages are composed and handed across the platform boundary**.

**Access responsibility**

- permit read assembly from source memory under export authorization
- permit creation and custody of Export logical entities as derived artifacts
- permit redaction and minimization choices visible in package posture
- deny mutation of source memory as consequence of export preparation

**Authorization binding**

- export access requires lawful purpose, recipient category, and sensitivity alignment
- export scope may be narrower than investigation scope
- investigation linkage may be required before export proceeds where policy demands

**Disclosure discipline**

- minimum necessary disclosure governs package composition
- parallel truth layers remain distinguishable in disclosed material
- export creates new accountability trail; custody does not end at boundary

**Forbidden patterns**

- export as backup or analytics extraction
- silent omission of inconvenient source facts from institutional record
- permanent export rights detached from purpose
- using export paths to bypass investigation scope discipline

Export access is **privileged outward reach**, not convenient download.

---

## 7. Governance Access

Governance Access covers **how policy, authorization accountability, and control facts over memory operations are reached and recorded**.

**Access responsibility**

- permit governed grant, narrow, revoke, and expire access entitlements
- permit visibility into authorization lineage affecting memory reachability
- permit policy interpretation actions with attributable accountability
- permit retention and restriction posture changes under constitutional bounds

**Control versus content**

- governance access governs who may reach memory; it is not a substitute for investigation or export access
- governance actors may require meta-visibility into access patterns without inheriting full memory content
- constitutional and registry changes follow separation and review discipline

**Sensitive operations**

- access grant elevation
- export authorization override where permitted
- retention restriction and archival reachability changes
- emergency access activation and closure

**Forbidden patterns**

- self-approved expansion of governance power without review
- governance access used as standing investigation shortcut
- policy changes that silently widen operational or administrative reach

Governance access **bounds power over memory**, not memory itself.

---

## 8. Administrative Access

Administrative Access covers **how authorized operator surfaces present memory without owning admission or definition**.

**Access responsibility**

- permit presentation of governed investigation and export views to authorized operators
- permit support workflows that depend on bounded memory visibility
- permit operational tooling that does not redefine event meaning or admission rules
- deny administrative surfaces as authoritative writers to Immutable Memory core

**Presentation versus authority**

- admin and operator surfaces display; they do not define taxonomy, admission, or correction of accepted assertions
- administrative visibility follows least privilege and purpose binding like other layers
- elevated presentation rights do not imply governance or investigatory ownership

**Support posture**

- support access may be narrower and more transient than investigation access
- escalation to investigation or export layers follows explicit authorization, not UI convenience

**Forbidden patterns**

- admin browsing of full institutional memory as default operator perk
- administrative action recorded as domain truth without emission discipline
- using admin paths to bypass export or investigation authorization

Administrative access is **authorized window**, not memory authority.

---

## 9. Separation of Duties

Separation of duties defines **which access capabilities must not collapse into a single unreviewed actor**.

**Core separations**

- those who change live product state must not unreviewed-own how history is accessed or interpreted
- those who admit or classify events must not unreviewed-own investigation conclusions used to justify their own actions
- those who authorize export must not be sole beneficiary of undisclosed material where policy forbids
- those who grant governance access must not be only reviewers of their own grants where independence is required

**Path separations**

- operational emission paths remain distinct from investigation reconstruction paths
- investigation access remains distinct from export disclosure paths
- governance control remains distinct from administrative presentation convenience

**Review separations**

- high-risk access elevation requires independent review capability in principle
- emergency access activation and closure must not be same-actor-only where policy requires

**Forbidden merges**

- product engineer standing access to full memory for debugging without governed scope
- investigator who is also unreviewed exporter and governance approver for same matter
- admin operator with permanent investigatory and export rights by default role

Separation keeps **power over memory from becoming personal convenience**.

---

## 10. Least Privilege Principles

Least privilege principles define **how access grants stay proportionate to purpose**.

**Grant discipline**

1. **Narrowest sufficient scope** — Actor, subject, domain layer, time window, and sensitivity class bind every grant.
2. **Shortest necessary duration** — Access expires when purpose ends unless formally renewed under review.
3. **No inheritance by adjacency** — Operational role does not inherit investigation scope; investigation scope does not inherit export rights.
4. **Sensitivity-aware narrowing** — Money, identity, ownership, privileged action, and legal dispute material receive stricter default posture.
5. **Additive elevation only** — Broader reach requires explicit elevation, not ambient accumulation of permissions.
6. **Derived artifact isolation** — Access to investigation containers does not automatically grant equal access to all underlying evidence custody classes.
7. **Revocation readiness** — Architecture must support prompt narrow and revoke without corrupting stored truth.

**Volume discipline**

- least privilege applies to internal actors with same logic as external disclosure proportionality
- broad internal browsing is architecturally incompatible with default posture

Least privilege protects **people, platform, and probative value**.

---

## 11. Emergency Access Principles

Emergency Access principles define **how break-glass reach may exist without becoming permanent backdoor**.

**Legitimacy**

- emergency access serves identifiable continuity, security response, or harm-reduction need
- emergency activation requires governed authorization where time allows; retrospective review where immediacy required

**Scope discipline**

- emergency reach is time-bounded and purpose-bounded
- emergency access does not imply full memory visibility by default
- emergency paths must not mutate accepted assertions

**Closure discipline**

- emergency grants auto-expire or require explicit closure
- post-emergency review examines scope used, material accessed, and policy compliance
- repeated emergency use without structural fix is governance signal

**Accountability**

- emergency access events must be capable of institutional trace where policy requires
- emergency actors must not be sole reviewers of their own emergency actions where independence is required

**Forbidden patterns**

- permanent emergency role with standing full access
- unaudited break-glass paths for operator convenience
- emergency access used to bypass export or legal disclosure discipline

Emergency access is **exception architecture**, not shadow operations.

---

## 12. Auditability Principles

Auditability principles define **how access itself remains witness where accountability requires**.

**Traceability targets**

- access grant, elevation, narrow, revoke, and expire
- investigation scope open, expand, and close where governed
- export authorization, package creation, and handoff
- governance policy changes affecting reachability
- emergency access activation, use, and closure
- sensitive read into restricted or high-sensitivity memory where policy requires

**Audit posture**

1. **Attributed action** — Access operations associate with accountable actor identity in principle.
2. **Purpose binding visible** — Authorization facts remain linkable to stated purpose.
3. **Non-repudiation of control** — Governance and export authorization cannot disappear silently.
4. **Meta-memory proportionality** — Sensitive access logging depth matches sensitivity class expectations.
5. **Read without laundering** — Audit records describe access; they do not rewrite source assertions.
6. **Investigator independence** — Audit trails support external review without exposing unrelated memory.
7. **Long-horizon retention** — Access accountability traces survive long enough for dispute reconstruction where policy requires.

Auditability makes access **defensible under challenge**, not merely logged for convenience.

---

## 13. Security Boundaries

Security boundaries define **where access must stop, split, or intensify control**.

**Primary boundaries**

- **Platform boundary** — Product domains emit; they do not own unrestricted inward memory reach.
- **Emission boundary** — Operational access ends where admission discipline begins.
- **Memory core boundary** — Immutable assertions are reachable only under governed read paths.
- **Investigation boundary** — Reconstruction scope is explicit; it does not bleed into operational runtime by default.
- **Export boundary** — Outward disclosure crosses intensified authorization and custody control.
- **Governance boundary** — Policy and grant control separated from content consumption where required.
- **Administrative presentation boundary** — UI reach does not expand technical access rights implicitly.

**Trust zone rules**

- external recipients never receive implicit internal access posture through export alone
- cross-domain investigation must preserve domain-separated truth across boundaries
- enrichment and correlation visibility follows same governance as core assertions

**Threat assumptions**

- insider curiosity and privilege abuse are expected pressure
- compromised operator credentials must not imply full memory exposure
- integration and support paths are high-risk access channels requiring architectural restraint

**Failure posture**

- access enforcement failure defaults to deny reach, not to open memory
- partial outage must not force ungoverned bypass

Security boundaries keep **reach aligned to trust zones**, not to UI layout.

---

## 14. Future Technical Rules

Future technical rules constrain **access technology selection and mapping** when implementation begins. They still do not name products, policies, or interfaces.

**Selection rules**

1. Must support deny-by-default posture with explicit governed grant.
2. Must support logical access layer separation or equivalent enforceable boundaries.
3. Must support purpose-bound, time-bound, and scope-bound entitlements.
4. Must support separation of operational, investigation, export, governance, and administrative paths.
5. Must support emergency access with bounded activation, expiry, and review.
6. Must support auditability of sensitive access, export authorization, and governance control.
7. Must support least-privilege narrow and revoke without mutating stored assertions.
8. Must support mapping to storage layer reachability in `BLACK_BOX_TECHNICAL_STORAGE_ARCHITECTURE.md`.

**Forbidden technical patterns**

- single super-role with standing full memory visibility
- product runtime with default investigatory or export reach
- administrative UI that implicitly grants technical access beyond presented scope
- access system that cannot represent provisional, restricted, or disputed read posture visibly
- unaudited break-glass channel without closure discipline
- treating analytics or backup tooling as investigation or export substitute

**Mapping rule**

Any physical access design must publish an explicit mapping from logical access layers in this document to enforcement components, demonstrating compliance with governance, security, investigation, and export models before production memory admission scales.

**Technology neutrality reaffirmed**

Identity platforms, policy engines, capability systems, and hybrid approaches may all qualify if they honor these rules. None is chosen here.

---

## 15. Closing Principles

The Technical Access Architecture rests on a small set of enduring principles:

**Reach is privilege, not default**  
Memory exists because truth mattered enough to preserve; access exists only where accountability requires it.

**Purpose binds every path**  
Operational, investigatory, export, governance, and administrative reach answer different questions and must stay separable.

**Read power is still power**  
Investigation and export paths receive the same architectural seriousness as write admission.

**Separation protects integrity**  
No single actor should comfortably own emission, admission, investigation conclusion, export, and governance grant.

**Least privilege is structural**  
Narrow scope is not a UI preference; it is a load-bearing rule.

**Emergency is exception**  
Break-glass must close, review, and remain rare.

**Access must be witness too**  
Sensitive reach leaves accountability traces where policy requires.

**Mechanism comes last**  
This architecture must outlive any particular identity or authorization fashion.

---

## Closing Note

This document defines the **technology-independent access architecture of the Black Box**.

Logical layers separate operational reach, investigation reconstruction, export disclosure, governance control, and administrative presentation. Separation of duties, least privilege, emergency discipline, auditability, and security boundaries protect memory from ambient exposure. Future physical mapping must prove compliance before access implementation proceeds. Authentication, authorization, and enforcement technology are not chosen here. Access discipline begins here.
