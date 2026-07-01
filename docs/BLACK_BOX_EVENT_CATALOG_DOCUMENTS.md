# RealEstateSniper Black Box — Event Catalog: Documents

Eighth functional catalog of **conceptual document and managed file lifecycle events** for the Black Box.

This document defines **which event types exist for documents as platform-managed subjects**, independent of any single owner or property actor. It does not define fields, storage, transport, canonical registered names, or implementation.

For domain boundaries in the master catalog, see `BLACK_BOX_EVENT_CATALOG.md` (Document Domain).  
For retention and custody principles, see `BLACK_BOX_RETENTION_AND_EVIDENCE_POLICY.md`.  
For owner submission journeys, see `BLACK_BOX_EVENT_CATALOG_OWNER.md`.  
For event meaning and trust posture, see `BLACK_BOX_EVENT_MODEL.md`.

---

## 1. Purpose

The Document Event Catalog exists to make **document and managed file memory explicit** before any technical representation is chosen.

Its purpose is to answer:

- When did a document enter platform custody and in what condition?
- How was it validated, reviewed, versioned, and accessed over time?
- What retention, restriction, and lifecycle rules applied to it?
- How does document history support disputes when proof, authenticity, or disclosure is challenged?

Documents is the eighth functional catalog because owner, property, and verification disputes often turn on **whether a file existed, what happened to it, and who could see it** — independent of who uploaded it or which case it supported.

---

## 2. Scope

**Inside scope**

- Upload and intake of documents into governed custody
- Validation and integrity checks on received files
- Review, acceptance, rejection, and return for correction
- Version creation, replacement, and supersession
- Access, viewing, and governed export of document material
- Retention, archival scheduling, and legal hold posture on documents
- Restriction, redaction, and minimum-necessary disclosure controls
- Lifecycle linking, expiry, disposal, and closure of document subjects

**Outside scope**

- Owner claim or submission journey as participant action — Owner domain, correlatable
- Property subject identity and status — Property domain
- Final verification or authorization verdict on a case — Verification and Owner domains
- Legal acceptance of binding policy text — Legal domain, correlatable when upload is acceptance act
- Marketplace or deal presentation — Marketplace domain
- Privileged manual document handling by operators — Admin domain, correlatable

Documents owns **the lifecycle of the file as a managed subject**. Owner and property own the participation stories documents support.

---

## 3. Document Event Philosophy

Document events record **custody and handling truth**, not the substantive legal conclusion of a case.

Philosophy principles:

1. **Document is the subject** — Events attach to the document identity across versions and case links.
2. **Custody over content** — Memory emphasizes intake, handling, and access; not unrestricted embedding of sensitive bytes.
3. **Validation before trust** — A received file is not automatically a trusted document.
4. **Version is explicit** — Replacement and supersession are distinct from silent overwrite.
5. **Access is accountable** — Sensitive viewing and export are material when policy requires.
6. **Retention is governed** — Availability changes through retention, hold, and disposal are event-visible.
7. **No verdict smuggling** — Document acceptance supports review; it does not alone replace case authorization truth.

Document memory defends chain-of-custody thinking. It does not become a general file repository log.

---

## 4. Document Event Families

Document events group into **eight families** plus cross-cutting evidence and boundary guidance.

- **Document Upload** — entry into platform custody
- **Document Validation** — technical and policy validation of received material
- **Document Review** — human or governed review outcomes on document fitness
- **Document Version** — versioning, replacement, and supersession
- **Document Access** — viewing, export, and permission posture
- **Document Retention** — retention clocks, archival, and legal hold on documents
- **Document Restriction** — redaction, suppression, and disclosure limits
- **Document Lifecycle** — linking, expiry, disposal, and closure

Families may correlate in one intake journey but must remain **separate event classes**. Upload completion and review acceptance are related but not one merged fact.

---

## 5. Document Upload Events

Document Upload events assert **entry of material into governed document custody**.

**Document Upload Initiated**  
An upload or intake path for a document began.

**Document Upload Completed**  
The platform recognized successful receipt of the file into governed custody.

**Document Upload Failed**  
An upload attempt ended without successful custody receipt.

**Document Upload Abandoned**  
An upload path was left incomplete in an accountability-relevant way.

**Document Intake Received At Boundary**  
The platform recognized receipt at the governed intake boundary, distinct from internal processing completion if timing differs.

**Document Intake Rejected At Boundary**  
Material was refused at intake because policy, size, type, or security rules failed.

**Duplicate Document Intake Prevented**  
The platform blocked intake because an equivalent document already existed under rules in force.

Upload events mark custody entry. They do not assert review acceptance or case authorization.

---

## 6. Document Validation Events

Document Validation events assert **technical and policy fitness checks** on received documents.

**Document Validation Started**  
Governed validation of the received file began.

**Document Validation Passed**  
The document passed required validation for its intended use stage.

**Document Validation Failed**  
The document failed required validation.

**Document Format Rejected**  
The file format or type was unacceptable for the intended document class.

**Document Integrity Check Passed**  
Integrity checks — for example, completeness or tamper-evident controls where applicable — succeeded.

**Document Integrity Check Failed**  
Integrity checks failed in a material way.

**Document Required Type Mismatch Detected**  
The received document did not match the required document class for the case stage.

**Document Malware Or Security Risk Detected**  
The platform refused or quarantined material because of security risk.

Validation events describe whether the file was fit to proceed. Review acceptance is a separate family.

---

## 7. Document Review Events

Document Review events assert **governed review outcomes** on whether the document satisfies case or policy requirements.

**Document Review Requested**  
Review of the document was opened or queued.

**Document Review Started**  
Governed review of the document began.

**Document Accepted**  
The document was accepted as satisfying requirements for its stage.

**Document Rejected**  
The document was rejected as insufficient or unsuitable.

**Document Returned For Correction**  
The document was sent back for replacement or amendment before acceptance.

**Document Review Escalated**  
Document review moved to higher scrutiny because of risk or conflict.

**Document Review Completed**  
The review path for the document reached a governed completion point.

**Required Document Missing For Stage**  
A required document class was absent when a case stage required it.

Review events own document fitness conclusions. Case authorization remains outside this family.

---

## 8. Document Version Events

Document Version events assert **how document identity evolved through versions** without silent overwrite.

**Document Version Created**  
A new version of a document subject was recognized.

**Document Replaced By New Version**  
A prior version was superseded by a newer governed version.

**Document Version Superseded**  
An earlier version ceased to be the active version while remaining historically addressable.

**Document Version Restored**  
A prior version became active again under governed conditions.

**Document Version Comparison Required**  
Review required explicit comparison between versions because of material change.

**Document Version Integrity Warning Recognized**  
The platform recognized inconsistency between versions material to trust.

Version events preserve lineage. They do not delete historical version existence silently.

---

## 9. Document Access Events

Document Access events assert **who or what process encountered the document under governed permission**.

**Document Access Granted**  
Governed permission to access the document was given for a stated purpose.

**Document Access Denied**  
Access to the document was refused under policy or role rules.

**Document Access Revoked**  
Previously granted access ended before natural expiry.

**Document Viewed Under Investigation**  
The document was accessed within a bounded investigation context where such access is memory-relevant.

**Document Exported Under Governance**  
The document left normal custody through a governed export path.

**Document Access Attempt Blocked**  
An access attempt failed because permission or restriction prevented it.

**Sensitive Document Access Recorded**  
Access occurred to a document class requiring heightened accountability memory.

Access events support custody and disclosure disputes. They do not replace authentication or account events.

---

## 10. Document Retention Events

Document Retention events assert **time-based and policy-based availability posture** for document subjects.

**Document Retention Period Started**  
A governed retention interval for the document began or was recognized.

**Document Retention Policy Applied**  
A specific retention policy posture was bound to the document.

**Document Retention Extended**  
Retention availability was lengthened under governed rules.

**Document Retention Expired**  
The active retention period ended under policy.

**Document Archival Scheduled**  
The document was scheduled to move to archival posture.

**Document Archived**  
The document moved to governed archival availability.

**Document Legal Hold Applied**  
Ordinary retention or disposal changes were suspended because of legal hold.

**Document Legal Hold Released**  
Legal hold ended and ordinary retention posture resumed under governance.

Retention events govern availability over time. Disposal completion belongs in Lifecycle family.

---

## 11. Document Restriction Events

Document Restriction events assert **limits on exposure and use** of document material.

**Document Access Restricted**  
The document became available only under narrower governed scope.

**Document Restriction Lifted**  
A prior document restriction ended.

**Document Redacted For Disclosure**  
A redacted form or disclosure-safe reference was created for export or review.

**Document Suppressed From Active Use**  
The document remained in custody but was removed from active operational use.

**Document Minimum Disclosure Applied**  
Disclosure was limited to the minimum necessary material for the stated purpose.

**Document Confidentiality Escalated**  
The document sensitivity class increased under governed rules.

**Document Confidentiality Reduced**  
Sensitivity class decreased under governed review — not silently.

Restriction events protect people and lawful disclosure. They do not pretend documents never existed.

---

## 12. Document Lifecycle Events

Document Lifecycle events assert **linking, expiry, disposal, and closure** of the document subject.

**Document Linked To Case**  
The document was associated with a governed owner, property, or verification case.

**Document Unlinked From Case**  
A prior case association ended.

**Document Linked To Supporting Assertion**  
The document was bound as corroboration to another Black Box assertion.

**Document Expired**  
The document reached governed expiry for active use or acceptance validity.

**Document Disposal Scheduled**  
Disposal or governed destruction was scheduled under policy.

**Document Disposal Completed**  
Disposal completed under policy with lineage obligations preserved as required.

**Document Disposal Cancelled**  
Scheduled disposal was halted under governance.

**Document Lifecycle Closed**  
The document subject reached closure while historical memory remained addressable.

Lifecycle events mark chapter endings. They prefer restriction and lineage records over silent erasure.

---

## 13. Document Evidence

Document events may themselves be supported by **meta-evidence** without inlining file content.

Evidence types appropriate to this domain include:

- Intake channel references proving how the file arrived
- Validation artifact references such as checksum or integrity proof where policy allows
- Reviewer or review case references for acceptance or rejection
- Version lineage references tying versions together
- Export package references for governed disclosure
- Legal hold or retention decision references

Evidence principles for documents:

- Meta-evidence corroborates custody; it does not replace document events.
- File bytes should be referenced or stored under governed sensitivity, not duplicated recklessly.
- Provisional acceptance must remain visible until review completes.
- Contradiction between versions or review outcomes must remain visible.

Document evidence strengthens proof chains. The catalog does not encourage hoarding raw files in unrestricted memory.

---

## 14. Domain Boundaries

Domain Boundaries clarify **how document subject memory relates to neighboring truth**.

**Owner domain**  
Owns owner upload and submission actions. Documents owns what happened to the file after intake.

**Property domain**  
Owns property subject truth. Documents may link to property cases without merging identities.

**Verification domain**  
Owns case verification verdict progression. Document review correlates but does not replace verdict events.

**Legal domain**  
Owns binding acceptance of legal instruments. When upload is itself acceptance, both domains correlate at that moment.

**Retention and evidence policy**  
Owns cross-cutting retention philosophy. This catalog records document-specific retention and hold events.

**Security domain**  
Owns broader security incidents. Document malware detection may correlate with security events.

**Admin domain**  
Owns privileged manual handling. Document restriction or replacement may result from admin action recorded elsewhere.

Boundary discipline keeps document custody investigable without absorbing owner or property biographies.

---

## 15. Future Evolution

Document catalog evolution may add new event classes only when **new document custody truth** must be preserved.

**Allowed evolution**

- Finer validation classes as document types multiply
- Additional version and redaction classes when disclosure disputes repeat
- New retention or hold classes as legal posture matures
- Clearer case-linking classes for multi-case documents

**Evolution requirements**

Every proposed document event class must answer:

1. What document custody or handling truth does it assert that existing classes do not?
2. Does it remain independent of owner and property as primary subjects?
3. Does it preserve version, access, and retention separability?
4. Can it correlate with cases without merging identities?
5. Can it be registered under the naming standard without ambiguity?

**Disallowed evolution**

- Logging every download or thumbnail render as institutional memory
- Merging upload, validation, review, and access into one convenience class
- Embedding full document bodies in unrestricted event assertions
- Silent version overwrite without supersession events
- Using document events as generic cloud storage telemetry

Amendments to this catalog require governance review alongside the master catalog, retention policy, and naming standard. Convenience is not sufficient justification.

---

## Closing Note

This catalog defines the **conceptual event types of the Document domain**.

Upload and Validation mark entry and fitness. Review and Version mark acceptance and lineage. Access, Retention, and Restriction mark who could see what and for how long. Lifecycle marks linking, expiry, and closure.

Technical representation comes later. Document custody truth begins here.
