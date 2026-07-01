# RealEstateSniper Black Box — Event Catalog: User Account

Second functional catalog of **conceptual user account events** for the Black Box.

This document defines **which event types exist within the User Account domain**, what each type asserts, and how they group for investigation. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries, see `BLACK_BOX_EVENT_CATALOG.md` (User Account Domain).  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For naming grammar when events are registered, see `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For authentication boundary separation, see `BLACK_BOX_EVENT_CATALOG_AUTHENTICATION.md`.

---

## 1. Purpose

The User Account Event Catalog exists to make **account lifecycle memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which classes of account fact must the Black Box be able to record?
- How are those classes grouped across registration, creation, profile, modification, and closure?
- What does each event type assert — and what belongs to other domains?
- How does account memory support participation, support, and dispute reconstruction?

User Account is the second functional catalog because after attribution through authentication, investigators must know **who existed on the platform, in what state, and with what participation roles** at the time facts mattered.

---

## 2. Scope

**Inside scope**

- Registration and account creation lifecycle
- Activation, reactivation, and participation state
- Profile and identity-affecting account attributes
- Email and phone changes on the account record
- Role and participation assignment on the account
- Suspension, restriction, and restoration of account participation
- Deletion, closure, and governed anonymization of account existence

**Outside scope**

- Sign-in, session, credential, and recovery flows — Authentication domain
- Legal terms and policy acceptance — Legal domain
- Purchases, payments, and commercial entitlement — Purchase and Payment domains
- Founder program capacity and cohort truth beyond account state — Founder domain
- Owner property assertions and verification outcomes — Owner, Property, Document, and Verification domains
- Privileged operator overrides of live state — Admin domain, correlatable but not owned here
- Marketplace visibility and deal access — Marketplace domain

User Account owns **who exists as a participant and in what account state**. Authentication owns how they entered. Other domains own what they did afterward.

---

## 3. User Account Philosophy

User Account events record **existence and participation state**, not every UI interaction.

Philosophy principles:

1. **Lifecycle clarity** — Registration, creation, modification, suspension, and deletion are distinct phases with distinct event classes.
2. **State over screen** — Events follow authoritative account state changes, not form renders or field focus.
3. **Identity attribute discipline** — Email, phone, and profile changes that affect trust receive explicit event classes.
4. **Role is participation truth** — Role assignment events describe what the account was allowed to be on the platform, not every permission check at runtime.
5. **Restoration is memory** — Reactivation and suspension lift are as investigable as suspension itself.
6. **Closure is not erasure by default** — Deletion and anonymization are governed assertions, not silent disappearance.
7. **No purchase smuggling** — Account events must not silently encode payment capture or deal entitlement.

Account memory answers whether someone could participate as a recognized user. It does not replace domain memory of what they purchased or verified.

---

## 4. User Lifecycle Event Families

User Account events group into **nine families** plus cross-cutting evidence. Each family owns a distinct layer of account truth.

- **Registration** — intent to join before or during account birth
- **Account Creation** — birth and activation of the account record
- **Profile** — user-visible or trust-impacting personal attributes
- **Account Modification** — broader account state and structural changes
- **Email Change** — primary and account-bound email transitions
- **Phone Change** — account-bound phone transitions
- **Role Assignment** — participation roles and account-level permission posture
- **Account Suspension** — loss or restriction of participation
- **Account Deletion** — closure, deletion, and governed anonymization

Families may correlate in one journey but must remain **separate event classes**. Registration completion and account creation may occur moments apart but are not one merged fact.

---

## 5. Registration Events

Registration events assert **participation intent and onboarding flow outcomes** before or while an account is being born.

**Registration Flow Initiated**  
A user began a governed path to create platform participation through supported signup entry.

**Registration Flow Completed**  
The registration path reached its successful completion point under rules in force at that moment.

**Registration Flow Abandoned**  
A material registration path was left incomplete in an accountability-relevant way.

**Registration Flow Rejected**  
The platform refused registration because policy, validation, or eligibility conditions failed.

**Registration Duplicate Prevented**  
The platform blocked registration because an existing account or conflicting identity already governed participation.

**Registration Eligibility Denied**  
The platform determined the applicant could not register under current program, geography, or policy rules.

Registration events describe the onboarding path. They do not by themselves assert that a durable account record already exists.

---

## 6. Account Creation Events

Account Creation events assert **birth and initial activation of the account as a platform participant**.

**Account Created**  
The platform recognized creation of a new user account record with durable identity on the platform.

**Account Activated**  
The account became eligible for governed participation under active rules.

**Account Activation Pending**  
The account record exists but participation remains blocked pending required conditions.

**Account Creation Failed**  
An attempt to create an account ended without producing a recognized participant record.

**Account Provisioned From External Identity**  
An account was created or first recognized through an external identity linkage path with material accountability impact.

**Account Linked To External Identity**  
An existing account gained a new external identity association governed at the account layer.

Account Creation events mark when someone **began to exist** as a platform account. They do not assert sign-in success or post-creation entitlement.

---

## 7. Profile Events

Profile events assert **changes to user-visible or trust-impacting personal attributes** on the account.

**Profile Updated**  
A governed profile change was applied to the account.

**Profile Update With Trust Impact**  
A profile change materially affected how the user should be trusted, displayed, or attributed in accountability-sensitive contexts.

**Display Name Changed**  
The account's governed display identity for user-facing contexts changed.

**Profile Image Changed**  
A profile image or equivalent representation changed where such change is accountability-relevant.

**Profile Preferences Changed With Accountability Impact**  
A preference change affected participation, communication, or trust posture — not mere cosmetic UI settings.

**Profile Update Rejected**  
A profile change attempt failed validation, policy, or security review at the account layer.

Profile events own attribute truth on the account. They do not assert owner verification outcomes or legal acceptance.

---

## 8. Account Modification Events

Account Modification events assert **broader account state or structural changes** beyond single profile fields.

**Account Settings Changed**  
A governed account-level setting with participation or trust impact changed.

**Account Merge Initiated**  
The platform began a process to combine two account identities under governance.

**Account Merge Completed**  
Two account identities were successfully combined under governed rules.

**Account Merge Rejected**  
A merge attempt failed or was denied.

**Account Split Initiated**  
The platform began separating previously combined or ambiguous account identity.

**Account Split Completed**  
An account separation completed under governed rules.

**Account Reactivated**  
A previously inactive, suspended, or restricted account returned to governed active participation.

**Subscription Eligibility Changed On Account**  
The account's eligibility posture for subscription participation changed at the account layer.

**Founder Trial State Changed On Account**  
Founder-related trial posture on the account changed in a way material to participation history.

**Account Marked For Review**  
The account entered a governed review posture because of risk, support, or integrity concern.

**Account Modification Rejected**  
A requested account-level change was denied before taking effect.

Account Modification events capture structural and eligibility posture changes. Commercial grant of entitlement remains in Purchase domain.

---

## 9. Email Change Events

Email Change events assert **transitions of account-bound email identity** outside routine authentication verification alone.

**Email Change Requested**  
A user or governed process initiated change of the account's primary or bound email.

**Email Change Pending**  
A new email was proposed but not yet fully accepted as the account email.

**Email Change Completed**  
The account's governed email identity successfully changed.

**Email Change Rejected**  
An email change failed validation, conflict checks, or security policy.

**Email Change Cancelled**  
A pending email change was withdrawn before completion.

**Primary Email Replaced**  
The account's primary email designation changed, distinct from adding secondary contact paths if the platform supports them.

Email change at the authentication gate during sign-in belongs to Authentication domain unless it alters the durable account record — then both may correlate.

---

## 10. Phone Change Events

Phone Change events assert **transitions of account-bound phone identity** where phone is a durable account attribute.

**Phone Change Requested**  
A governed phone change path was initiated on the account.

**Phone Change Pending**  
A new phone was proposed but not yet accepted on the account record.

**Phone Change Completed**  
The account's governed phone identity successfully changed.

**Phone Change Rejected**  
A phone change failed validation, conflict checks, or policy.

**Phone Removed From Account**  
A previously bound phone was removed under governed conditions.

**Phone Bound To Account**  
A phone became a recognized account attribute for the first time where material.

Phone verification during authentication alone is Authentication domain. Phone change here alters **account identity record**.

---

## 11. Role Assignment Events

Role Assignment events assert **participation roles and account-level permission posture** for what the user is on the platform.

**Role Granted To Account**  
A participation role was assigned to the account under governing rules.

**Role Revoked From Account**  
A participation role was removed from the account.

**Participation Role Changed**  
The account's primary participation classification changed — for example, between investor-oriented and owner-oriented participation where the platform distinguishes them.

**Owner Role Assigned To Account**  
The account gained owner-participation standing material to off-market flows.

**Owner Role Removed From Account**  
Owner-participation standing was removed from the account.

**Elevated Permission Granted On Account**  
The account received elevated permission posture material to accountability — distinct from one-time runtime authorization checks.

**Elevated Permission Reduced On Account**  
Elevated permission posture on the account was reduced.

**Unauthorized Role Change Blocked**  
An attempt to change account role or permission posture was prevented.

Privileged operator manual role changes may correlate with Admin domain events. This family owns **account participation truth** as recognized on the user record.

---

## 12. Account Suspension Events

Account Suspension events assert **loss or restriction of account participation** before deletion.

**Account Suspended**  
The account lost normal participation rights under governed conditions.

**Account Suspension Lifted**  
A suspension ended and participation restoration began or completed at the suspension layer.

**Temporary Restriction Applied**  
A time-bound or scope-bound participation restriction short of full suspension was applied.

**Temporary Restriction Removed**  
A temporary restriction ended.

**Account Locked**  
The account entered a locked posture preventing participation pending resolution.

**Account Unlocked**  
A locked posture ended under governed conditions.

**Suspension Review Required**  
The account remained suspended or restricted pending mandatory review.

Suspension events describe participation loss. They do not assert session termination alone — that is Authentication domain, though both may correlate.

---

## 13. Account Deletion Events

Account Deletion events assert **closure, removal, and governed anonymization of account existence**.

**Account Deletion Requested**  
The user or a governed process initiated account removal.

**Account Deletion Scheduled**  
Deletion was queued for future execution under policy.

**Account Deletion Completed**  
The account ceased to exist as an active participant under governed deletion rules.

**Account Deletion Cancelled**  
A pending deletion was halted before completion.

**Account Closed Without Full Deletion**  
The account ended active participation through closure that is not equivalent to full erasure.

**Account Anonymization Completed**  
Identifying account attributes were anonymized under governed policy while lineage obligations were preserved as required.

**Account Data Restriction Applied**  
Access to account-related memory was restricted under legal or policy obligation without pretending the account never existed.

Deletion events mark the end of participation existence. They do not authorize silent destruction of required audit lineage.

---

## 14. User Account Evidence

User Account events may be supported by **linked evidence** without embedding sensitive material in the assertion itself.

Evidence types appropriate to this domain include:

- External identity linkage confirmations tied to creation or merge events
- Verification outcomes that corroborate email or phone change completion
- Support or review case references tied to suspension or reactivation
- Admin action references when operator intervention correlates with account state change
- Legal or policy references when closure or restriction was law-driven
- Duplicate-detection or merge-analysis references for merge and split events

Evidence principles for user account:

- Evidence corroborates; it does not replace the account assertion.
- Personal data minimization applies — full profile payloads need not live in unrestricted memory.
- Provisional account assertions may exist before corroboration arrives.
- Contradictory evidence about identity or merge decisions must remain visible.

User Account evidence strengthens defensibility in support and dispute. It does not turn the Black Box into a profile datastore.

---

## 15. Future Evolution

User Account catalog evolution may add new event classes only when **new account lifecycle truth** must be preserved.

**Allowed evolution**

- New event classes for new signup paths or identity models
- Finer merge, split, or closure distinctions when investigation repeatedly confuses outcomes
- Additional role classes as participation models grow
- Clearer restriction and anonymization events when legal posture matures

**Evolution requirements**

Every proposed user account event class must answer:

1. What account existence or participation truth does it assert that existing classes do not?
2. Is it primary in the User Account domain, not Authentication, Purchase, or Admin?
3. Does it follow state-over-screen discipline?
4. Can it correlate without merging with neighboring families?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Encoding purchase, payment, or marketplace truth inside account events
- Creating account events from profile page loads or form views alone
- Merging registration, creation, and activation into one convenience class
- Silent relabeling of past account classes when onboarding is redesigned
- Using account events as general user analytics telemetry

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the User Account domain**.

Registration and Account Creation mark how participation began. Profile, Modification, Email Change, and Phone Change mark how the account identity evolved. Role Assignment marks what kind of participant the account was allowed to be. Suspension and Deletion mark how participation ended or was restricted. Evidence links corroboration without replacing assertions.

Technical representation comes later. Participation truth begins here.
