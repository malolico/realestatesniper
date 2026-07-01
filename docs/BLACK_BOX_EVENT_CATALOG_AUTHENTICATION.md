# RealEstateSniper Black Box — Event Catalog: Authentication

First functional catalog of **conceptual authentication events** for the Black Box.

This document defines **which event types exist within the Authentication domain**, what each type asserts, and how they group for investigation. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries, see `BLACK_BOX_EVENT_CATALOG.md` (Authentication Domain).  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.  
For naming grammar when events are registered, see `BLACK_BOX_EVENT_NAMING_STANDARD.md`.  
For integration at the identity boundary, see `BLACK_BOX_INTEGRATION_MODEL.md`.

---

## 1. Purpose

The Authentication Event Catalog exists to make **identity access memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- Which classes of authentication fact must the Black Box be able to record?
- How are those classes grouped for investigators and architects?
- What does each event type assert — and what does it deliberately not assert?
- How does authentication memory support attribution across the rest of the platform?

Authentication is the first functional catalog because almost every downstream dispute depends on knowing who reached the platform, when, and with what outcome.

---

## 2. Scope

**Inside scope**

- Identity access attempts and outcomes at the authentication boundary
- Session establishment, continuation, refresh, expiry, and invalidation
- Multi-factor challenges and outcomes
- Password and credential change flows at the authentication layer
- Email verification steps that gate access
- Account recovery flows that re-establish access
- Security-relevant authentication blocks, challenges, and abuse signals

**Outside scope**

- Account lifecycle creation, suspension, or closure — User Account domain
- Role grants, permission elevation, or entitlement changes — User Account, Admin, or related domains
- Purchase, marketplace, owner, or verification facts — respective domains
- General security incidents without authentication boundary relevance — Security domain
- Live session state as product convenience — not institutional memory

Authentication owns **access truth at the identity boundary**. Other domains own what the authenticated party was allowed to do afterward.

---

## 3. Authentication Event Philosophy

Authentication events record **recognition at the door**, not the entire house.

Philosophy principles:

1. **Outcome clarity** — Success, failure, block, and challenge must never share one ambiguous event class.
2. **Attribution ambition** — Every material authentication event should support actor or session attribution with appropriate confidence.
3. **Failure is memory** — Failed, blocked, and abandoned authentication attempts matter for security and dispute reconstruction.
4. **Session is distinct from login** — Establishing a session, using it, and ending it are separate assertions.
5. **Recovery is not ordinary login** — Regaining access after loss uses its own event classes.
6. **Security signals are first-class** — Suspicious or policy-driven authentication outcomes are not secondary noise.
7. **No entitlement smuggling** — Authentication events must not silently encode purchase, role, or marketplace truth.

Authentication memory makes later institutional facts attributable. It does not replace those facts.

---

## 4. Authentication Event Families

Authentication events group into **nine families** plus cross-cutting evidence. Each family owns a distinct layer of access truth.

- **User Identity** — who was presented or recognized at the boundary
- **Login** — entry attempts and immediate outcomes
- **Logout** — intentional or forced end of authenticated use
- **Session** — life of an authenticated context after entry
- **MFA** — additional factor challenges and results
- **Password** — credential change and reset at the auth layer
- **Email Verification** — proof-of-email steps gating access
- **Account Recovery** — re-establishing access after loss
- **Security Authentication** — abuse, policy blocks, and suspicious access signals

Families may correlate tightly in one user journey but must remain **separate event classes**. A login success followed by session establishment is two facts, not one merged story.

---

## 5. User Identity Events

User Identity events assert **who or what identity was presented or recognized** at the authentication boundary before or during an access attempt.

**Identity Presented**  
The platform received an identity claim through an authentication path. The claim may be email, linked identity provider, or other supported identifier. This asserts presentation, not success.

**Identity Recognized**  
The platform matched the presented identity to a known account or authentication record with sufficient confidence to proceed in the flow.

**Identity Unrecognized**  
The platform could not match the presented identity to a known account or record. This is distinct from wrong password or failed factor.

**Identity Mismatch Detected**  
Signals presented in the same flow conflict in a way material to trust — for example, inconsistent identifiers across steps.

**Anonymous Context Established**  
A pre-authentication or unauthenticated context was recognized where the platform permits bounded activity without a signed-in user. This asserts only that unauthenticated context existed, not what was done in it.

**Service Identity Recognized**  
An automated or service actor authenticated through a non-human path where such access is material to accountability.

User Identity events support attribution. They do not create accounts or change account lifecycle state.

---

## 6. Login Events

Login events assert **entry attempts and their immediate outcomes** at the authentication boundary.

**Sign-In Succeeded**  
The platform recognized a successful authentication completion for the attempted identity under the rules in force at that moment.

**Sign-In Failed**  
The platform rejected the attempt because credentials, factors, or flow conditions were not satisfied. Failure reason class may be refined in explanation without merging all failures into one undifferentiated type.

**Sign-In Blocked**  
The platform refused the attempt before or during completion because policy, security control, or account condition prevented entry. Distinct from mere credential mismatch.

**Sign-In Abandoned**  
A material authentication flow was started but left incomplete in a way the platform recognizes as accountability-relevant — for example, abandonment after identity presentation but before completion.

**Sign-In Redirected To Additional Factor**  
The platform accepted partial progress but required further authentication before completion. This marks the handoff to MFA or equivalent challenge, not ultimate success.

**Sign-In Redirected To Email Verification**  
The platform required email verification before authentication could complete.

Login events mark the doorway outcome. They do not assert session lifetime or post-login entitlement.

---

## 7. Logout Events

Logout events assert **how authenticated use ended**.

**Sign-Out Initiated By User**  
The authenticated party deliberately ended the session through a governed sign-out action.

**Sign-Out Forced By Platform**  
The platform ended the session because of policy, security action, account condition, or administrative intervention at the authentication layer.

**Sign-Out Caused By Session Invalidation**  
The session ended because the underlying session record was invalidated, including global sign-out from all devices where recognized.

**Sign-Out Failed**  
A sign-out attempt did not complete successfully in a material way — for example, when the platform cannot confirm session termination and that uncertainty matters for investigation.

Logout events end authenticated context. They do not describe account suspension or deletion.

---

## 8. Session Events

Session events assert **the life of an authenticated context** after entry or between access uses.

**Session Established**  
A new authenticated session context became active after successful completion of the governing authentication path.

**Session Continued**  
An existing session was recognized as still valid for continued authenticated use at a material checkpoint.

**Session Refreshed**  
The platform extended or renewed session validity without requiring full re-authentication.

**Session Expired**  
The session reached its governed end of validity through time or inactivity rules.

**Session Invalidated**  
The session was actively ended by platform logic, security response, or credential change that broke prior validity.

**Concurrent Session Limit Reached**  
The platform recognized that session creation or continuation was denied because concurrent session rules were exceeded.

**Session Context Rejected**  
A request presented session credentials that failed validation — distinct from login failure at the credential step.

Session events describe authenticated presence over time. They do not grant or revoke product entitlements.

---

## 9. MFA Events

MFA events assert **additional factor challenges and outcomes** within authentication flows.

**MFA Challenge Issued**  
The platform required an additional factor before authentication could complete.

**MFA Challenge Succeeded**  
The additional factor was satisfied under governing rules.

**MFA Challenge Failed**  
The additional factor was presented but not accepted.

**MFA Challenge Expired**  
The challenge window ended without successful completion.

**MFA Challenge Abandoned**  
The user left the challenge flow in a way recognized as material before completion.

**MFA Enrollment Completed**  
A user completed enrollment of an additional factor for future authentication.

**MFA Enrollment Removed**  
An enrolled additional factor was removed under governed conditions.

**MFA Required But Unavailable**  
The platform required MFA but the user could not complete it because of configuration, device, or account state.

MFA events own factor truth. They do not replace login success; they refine the path to it.

---

## 10. Password Events

Password events assert **credential change and reset activity** at the authentication layer.

**Password Change Succeeded**  
The authenticated user changed password under governing rules.

**Password Change Failed**  
A password change attempt failed because validation, policy, or verification requirements were not met.

**Password Reset Requested**  
A reset flow was initiated for recovering credential access.

**Password Reset Completed**  
A reset flow successfully established a new credential.

**Password Reset Rejected**  
A reset attempt was denied because verification, policy, or security conditions failed.

**Password Reset Expired**  
A reset authorization window ended without completion.

**Password Compromise Response Triggered**  
The platform recognized conditions requiring credential invalidation or forced reset as a security response.

Password events own credential truth at the boundary. They do not assert email ownership changes beyond what the authentication flow itself recognized.

---

## 11. Email Verification Events

Email Verification events assert **proof-of-email steps that gate authentication or credential recovery**.

**Email Verification Sent**  
The platform initiated delivery of a verification step to the presented email address in an authentication-related flow.

**Email Verification Succeeded**  
The verification step was completed successfully.

**Email Verification Failed**  
The verification step was attempted but not accepted.

**Email Verification Expired**  
The verification window ended without successful completion.

**Email Verification Required**  
The platform blocked further authentication progress until verification succeeded.

Email verification here is tied to **access gating**, not general marketing list confirmation or profile email change outside authentication flows — those belong elsewhere unless they gate access.

---

## 12. Account Recovery Events

Account Recovery events assert **flows that re-establish access after the user lost normal authentication ability**.

**Recovery Flow Initiated**  
The user or platform began a governed recovery path to regain access.

**Recovery Identity Confirmed**  
The platform accepted identity proof sufficient to continue recovery under policy.

**Recovery Identity Rejected**  
Identity proof in recovery was insufficient or failed validation.

**Recovery Flow Completed**  
Recovery successfully restored governed access through the recovery path.

**Recovery Flow Failed**  
Recovery ended without restoring access in a material, recognized way.

**Recovery Flow Expired**  
The recovery authorization window ended before completion.

**Recovery Flow Blocked**  
Security policy or abuse controls prevented recovery from proceeding.

Recovery is distinct from ordinary sign-in because the user begins from loss of access, not routine entry.

---

## 13. Security Authentication Events

Security Authentication events assert **abuse signals, policy enforcement, and suspicious access conditions** at the identity boundary.

**Suspicious Authentication Pattern Detected**  
The platform recognized a pattern suggesting abuse, credential attack, or implausible access behavior.

**Repeated Failed Authentication Threshold Reached**  
Failed attempts accumulated to a material threshold triggering restriction or review posture.

**Authentication Blocked By Policy**  
A governing security or account policy prevented authentication regardless of credential correctness.

**Authentication Challenge Escalated**  
The platform increased scrutiny — for example, additional verification — because risk posture warranted it.

**Authentication From Unusual Context Detected**  
Access context materially diverged from expected patterns in a way flagged as accountability-relevant.

**Authentication Rate Limit Applied**  
The platform throttled or denied attempts due to rate or volume controls.

**Known Compromised Credential Check Failed**  
The platform rejected credentials because they matched compromised-credential policy where such checks exist.

These events support security investigation and attribution. Broad security incidents without authentication boundary specificity belong primarily in the Security domain.

---

## 14. Authentication Evidence

Authentication events may be supported by **linked evidence** without embedding sensitive material in the assertion itself.

Evidence types appropriate to this domain include:

- External identity provider confirmation references
- Factor challenge delivery outcomes linked to MFA or verification events
- Device or context signals used only as corroboration, not as standalone truth
- Rate-limit or policy rule identifiers sufficient for review without exposing secret rules
- Recovery channel confirmation references
- Security scanner or abuse signal references tied to block or challenge events

Evidence principles for authentication:

- Evidence corroborates; it does not replace the authentication assertion.
- Secrets, raw tokens, and full credentials must not be preserved in unrestricted memory.
- Provisional authentication assertions may exist before corroboration arrives.
- Contradictory evidence must remain visible when identity provider and platform disagree.

Authentication evidence strengthens attribution and defensibility. It does not turn the Black Box into a credential vault.

---

## 15. Future Evolution

Authentication catalog evolution may add new event classes only when **new identity boundary truth** must be preserved.

**Allowed evolution**

- New event classes for new authentication methods or identity providers
- Finer failure distinctions when investigation repeatedly confuses materially different outcomes
- Additional security authentication classes when abuse patterns mature
- Clearer recovery path events when new recovery mechanisms gate access

**Evolution requirements**

Every proposed authentication event class must answer:

1. What access truth does it assert that existing classes do not?
2. Is it primary in the Authentication domain, not Account or Security?
3. Does it preserve outcome clarity and failure explicitness?
4. Can it correlate without merging with neighboring families?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Encoding entitlement, role, or purchase truth inside authentication events
- Merging login, session, and MFA into single combined classes for convenience
- Creating authentication events from presentation-layer activity alone
- Logging every keystroke or field edit as institutional memory
- Renaming past authentication classes silently when flows are redesigned

Amendments to this catalog require governance review alongside the master catalog and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Authentication domain**.

User Identity and Login mark who arrived and whether entry succeeded. Logout and Session mark how authenticated presence ended and persisted. MFA, Password, Email Verification, and Account Recovery mark the special paths that gate or restore access. Security Authentication marks when the boundary itself detected risk or enforced policy. Evidence links proof without replacing assertions.

Technical representation comes later. Investigation attribution begins here.
