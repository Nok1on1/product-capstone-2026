# Security Tabletop

**Product:** Bus #3 Real-Time Tracker
**Team:** Bandersnatch
**Date:** 22 May 2026
**Audit run date:** 22 May 2026

---

## Overview

This document applies the STRIDE threat model to our five highest-traffic user flows. For every threat identified, we either name the mitigation in place or explicitly accept the risk with a written rationale. Unexamined threats are not low risks. They are unknown risks.

**STRIDE reference:**

| Letter | Category | The question |
|--------|----------|-------------|
| S | Spoofing | Can an attacker impersonate a legitimate user or system component? |
| T | Tampering | Can data be modified in transit or at rest without detection? |
| R | Repudiation | Can a user deny performing an action, with no audit trail to prove otherwise? |
| I | Information Disclosure | Can sensitive data be exposed to unauthorised parties? |
| D | Denial of Service | Can this flow be abused to make the service unavailable to legitimate users? |
| E | Elevation of Privilege | Can a user gain capabilities beyond their permission level? |

---

## Five User Flows Selected

| # | Flow name | Why selected |
|---|-----------|-------------|
| 1 | User signup and email verification | Entry point for all users. Compromise here exposes all downstream data. |
| 2 | User login and session management | Authentication is the primary attack surface for account takeover. |
| 3 | Core action: bus status check and departure decision | Highest-traffic flow. Carries stop preference, bus data, and triggers analytics events. |
| 4 | Peer location sharing on live map | Carries real-time geolocation data. Privacy-sensitive and high-harm if exposed. |
| 5 | Boarding/disembark reporting and trust scoring | Modifies trust scores which affect gamification. Admin role elevation risk. |

---

## Flow 1: User signup and email verification

**Description:** User creates an account with email/password, selects a bus stop, and receives a verification email.

| STRIDE category | Threat identified | Mitigation in place | Status |
|----------------|------------------|--------------------|---------| 
| Spoofing | Attacker could register with someone else's email address if domain ownership is not verified | Email verification required via `sendEmailVerification`. Unverified accounts cannot access full features. | Mitigated |
| Tampering | Registration form data could be tampered with in transit | HTTPS enforced on all routes. Vercel enforces HTTPS by default. | Mitigated |
| Repudiation | User could deny completing signup and claim they never agreed to terms | Signup timestamp, email, and acquisition source recorded in Firestore `users/{uid}` doc. | Mitigated |
| Information Disclosure | Error messages on failed signup could reveal whether an email is already registered, enabling enumeration | Currently error message says "Email already in use." This reveals registered emails. | NOT MITIGATED — accepted risk: low severity at current scale (KIU campus), will address before public launch |
| Denial of Service | Attacker could submit thousands of signup requests to exhaust Firestore write capacity | No rate limiting currently on signup endpoint. Firebase Auth has built-in abuse prevention for repeated auth attempts. | NOT MITIGATED — accepted risk: Firebase Auth's built-in rate limiting provides baseline protection |
| Elevation of Privilege | Newly registered user could attempt to access admin routes | Admin routes protected by role check in Firestore rules. Role is null by default, set server-side only. No client-side role assignment. | Mitigated |

---

## Flow 2: User login and session management

**Description:** Returning user signs in with email/password. Firebase Auth manages the session via onAuthStateChanged.

| STRIDE category | Threat identified | Mitigation in place | Status |
|----------------|------------------|--------------------|---------| 
| Spoofing | Attacker could brute-force another user's password to gain access | Firebase Auth enforces rate limiting on failed login attempts. No CAPTCHA on login. | Partially mitigated — accepted risk: Firebase Auth's progressive delay on repeated failures |
| Tampering | Login credentials could be intercepted in transit | HTTPS enforced. Firebase Auth uses client-side SDK with token-based auth, passwords never sent as plaintext over the wire beyond the TLS layer. | Mitigated |
| Repudiation | User could deny logging in and claim account was compromised | Login timestamps and session data are logged by Firebase Auth internally. We do not currently store login events in Firestore. | NOT MITIGATED — accepted risk: Firebase Auth keeps its own audit logs; we rely on those |
| Information Disclosure | Login error messages could distinguish "user not found" from "wrong password," enabling enumeration | Current login shows generic "Invalid email or password" for both cases. | Mitigated |
| Denial of Service | Attacker could trigger mass password reset emails to spam a user | Firebase Auth sends password reset email. Multiple requests are rate-limited by Firebase. | Mitigated |
| Elevation of Privilege | User could modify their own role field to gain admin access | Firestore security rules only allow admin users to update roles. Regular users can only update their own documents except role field. Rules checked: `request.auth.uid == userId || (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')`. | Mitigated |

---

## Flow 3: Core action — bus status check and departure decision

**Description:** User selects their bus stop, views CONFIRMED/ESTIMATED arrival status, and optionally makes a departure decision. Analytics events are logged.

| STRIDE category | Threat identified | Mitigation in place | Status |
|----------------|------------------|--------------------|---------| 
| Spoofing | Attacker could submit fake bus reports to manipulate arrival data | Bus reports (`bus_reports` collection) require auth. No server-side validation of report accuracy. Trust score system penalises bad reports over time. | NOT MITIGATED — accepted risk: trust scoring is the eventual mitigation; at current scale, manual moderation is feasible |
| Tampering | Bus data stored in Firestore could be modified by an attacker | Bus data (`bus_data`) is write-protected in Firestore rules: `allow write: if false`. Only read access is public. | Mitigated |
| Repudiation | User could deny making a departure decision or claiming a bus was on time | Event analytics logged via Firebase Analytics events: `bus_status_confirmed`, `departure_decision_made`. No user-facing audit trail for these events. | NOT MITIGATED — accepted risk: analytics events are one-directional and not queryable by users |
| Information Disclosure | Bus stop preference and departure patterns could reveal a user's daily schedule | Bus stop preference stored in `users/{uid}` — read restricted to authenticated user and admins only. Analytics events do not contain PII (user_id is a UUID). | Mitigated |
| Denial of Service | Attacker could query bus status repeatedly to exhaust Firestore read quota | No rate limiting on status queries. Firestore free tier provides 50K reads/day. | NOT MITIGATED — accepted risk: at KIU scale (~500 students), normal usage is well within limits. DDoS would require coordination beyond a casual attacker |
| Elevation of Privilege | User could read other users' bus stop preferences or personal data | Firestore rules restrict `users/{userId}` reads to the document owner only: `allow read: if request.auth != null && request.auth.uid == userId`. | Mitigated |

---

## Flow 4: Peer location sharing on live map

**Description:** User's device writes lat/lng to `peer_locations/{userId}` every ~5 seconds. Other users see these locations on the live map anonymously.

| STRIDE category | Threat identified | Mitigation in place | Status |
|----------------|------------------|--------------------|---------| 
| Spoofing | Attacker could write fake locations under another user's ID | Firestore rules require `request.auth.uid == userId` for writes to `peer_locations/{userId}`. | Mitigated |
| Tampering | Location data could be tampered in transit | HTTPS enforced. Firestore validates writes server-side against security rules. | Mitigated |
| Repudiation | User could deny sharing their location at a given time | Peer location writes are timestamped with `serverTimestamp()` in Firestore. However, these are ephemeral (cleaned up after 5 min). | NOT MITIGATED — accepted risk: locations are intentionally ephemeral by design |
| Information Disclosure | Attacker could scrape all peer locations to track user movements | Peer locations are publicly readable (`allow read: if true`). Only userId (UUID) is exposed — no names or email. However, repeated scraping could correlate movement patterns. | NOT MITIGATED — accepted risk: locations are coarse (bus stop level), anonymous (UUID only), and ephemeral. Full mitigation (auth-gated reads) would break the product's core value of open peer visibility |
| Denial of Service | Attacker could flood `peer_locations` with fake entries to overwhelm clients | No rate limiting on writes. Each fake entry is small (lat + lng + timestamp). Firestore handles high-frequency writes well. | NOT MITIGATED — accepted risk: writes are lightweight; DoS via peer_locations would need to exhaust the free tier write quota, which is detectable |
| Elevation of Privilege | User could read all peer location data via Firestore client SDK | Peer locations are publicly readable by design. This is a product decision (anyone on the map sees peers). | NOT MITIGATED — accepted risk: this is the intended product behaviour. No elevation beyond what is already permitted |

---

## Flow 5: Boarding/disembark reporting and trust scoring

**Description:** User reports boarding or disembarking a bus. Reports update their trust score and contribute to crowding data and ride history.

| STRIDE category | Threat identified | Mitigation in place | Status |
|----------------|------------------|--------------------|---------| 
| Spoofing | Attacker could report boarding on behalf of another user | Write requires `request.auth.uid == userId` on `bus_reports`. | Mitigated |
| Tampering | Fake boarding reports could inflate crowding data or manipulate trust scores | No server-side validation of report truthfulness. Trust score algorithm penalises users whose reports are contradicted by others. Audit log not yet implemented. | NOT MITIGATED — accepted risk: manual moderation for now; admin action log (Sprint 2 item) will add audit trail |
| Repudiation | Admin could change a user's trust score with no audit trail | Admin action log (`admin_actions`) does not yet exist in the deployed Firestore rules or code. | NOT MITIGATED — accepted risk: documented in system design docs as a Sprint 2 item. Owner: Giorgi Mikaberidze, target: 5 June 2026 |
| Information Disclosure | Trust scores and admin roles could be leaked through Firestore reads | `users/{userId}` is readable only by the document owner. Admin role is stored in `users/{userId}.role` — only admins can read other users' roles. | Mitigated |
| Denial of Service | Attacker could submit thousands of fake reports to exhaust Firestore writes | No rate limiting on `bus_reports`. Each write counts against Firestore free tier (20K writes/day). | NOT MITIGATED — accepted risk: plausible denial requires many coordinated accounts; Firebase Auth rate limiting on account creation mitigates the multi-account attack vector |
| Elevation of Privilege | User could modify their own trust score or role via Firestore | Firestore rules: `allow update: if request.auth.uid == userId || (get(...).data.role == 'admin')`. Users can update their own doc but role field changes require admin status. Trust score writes are also protected by the same rule. | Partially Mitigated — users cannot set their own role or trust score to arbitrary values via direct Firestore write, but they can modify their own `displayName` and other profile fields |

---

## Dependency Audit

### Audit run

**Command used:** `npm audit`
**Date run:** 22 May 2026
**Working directory:** `bandersnatch_app/`

**Summary:**
```
found 4 vulnerabilities (3 moderate, 1 high)
```

### Three highest-priority findings

**Finding 1 (High):**
- Package: next 16.2.4
- CVE: Multiple — GHSA-8h8q-6873-q5fj (DoS via Server Components), GHSA-26hh-7cqf-hhc6 (middleware bypass), GHSA-3g8h-86w9-wvmq (cache-poisoned redirects)
- Vulnerability: Multiple high-severity vulnerabilities in Next.js including Denial of Service, middleware bypass, and cache poisoning
- Remediation: Update next to version 16.2.6. Command: `npm install next@16.2.6`
- Owner: Giorgi Mikaberidze
- Target date: 26 May 2026
- Status: In progress — 16.2.6 is outside the stated dependency range, needs testing

**Finding 2 (Moderate):**
- Package: brace-expansion (via @typescript-eslint/typescript-estree)
- CVE: GHSA-jxxr-4gwj-5jf2
- Vulnerability: Large numeric range defeats documented max DoS protection
- Remediation: `npm audit fix` — dev dependency, no production impact
- Owner: Nikoloz Kvirikashvili
- Target date: 26 May 2026
- Status: Accepted — dev-only dependency, no production exposure

**Finding 3 (Moderate):**
- Package: protobufjs 7.5.0
- CVE: GHSA-jggg-4jg4-v7c6
- Vulnerability: Denial of Service via unbounded recursive JSON descriptor expansion
- Remediation: Update protobufjs via `npm audit fix` (transitive dependency of firebase)
- Owner: Nikoloz Kvirikashvili
- Target date: 30 May 2026
- Status: Pending — requires Firebase SDK update or override

---

## Secrets Check

### Commands run

```bash
git log --all --full-history -- "**/.env"
git log -p | grep -i "api_key\|secret\|password\|token" | head -40
```

### Result

**Clean:** No secrets found in git history.

**Details:**
- `.env` and `.env.*` are listed in `.gitignore` (root and `bandersnatch_app/`)
- No `.env` file has ever been committed to the repository
- `.env.local` exists only on local development machines
- Firebase secrets (`apiKey`, `measurementId`, etc.) are served as Vercel environment variables in production
- The grep for `api_key`, `secret`, `password`, and `token` returned only code-level references (function parameter names, documentation strings), not actual secret values

**Current .env status:**
- [x] `.env` file exists locally
- [x] `.env` is listed in `.gitignore`
- [ ] `.env.example` exists in the repo with placeholder values only — not yet created, gap acknowledged
- [x] No `.env` file has ever been committed (verified by secrets check above)

---

## Top Three Vulnerabilities Summary

| Priority | Vulnerability | Flow or component | Mitigation or action | Owner | Date |
|----------|--------------|------------------|---------------------|-------|------|
| 1 | Next.js 16.2.4 — multiple high-severity vulnerabilities (DoS, middleware bypass, cache poisoning) | All flows (via Next.js framework) | Update to 16.2.6 | Giorgi Mikaberidze | 26 May 2026 |
| 2 | No rate limiting on bus reports, peer locations, or status queries | Flows 3, 4, 5 | Add rate limiting middleware for Firestore writes | Nikoloz Kvirikashvili | Sprint 2 |
| 3 | No admin action audit log for trust score/role changes | Flow 5 | Implement `admin_actions/{autoId}` collection with write rules | Giorgi Mikaberidze | 5 June 2026 |
