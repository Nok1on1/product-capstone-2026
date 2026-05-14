# Risk Register

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 2.0

---

## Risk Assessment Scale

| Dimension | Low (1) | Medium (2) | High (3) |
|---|---|---|---|
| **Likelihood** | Unlikely to occur during Sprint arc | Could occur, has happened before | Almost certain or already present |
| **Impact** | Minor inconvenience, quick fix | Blocks a feature, requires rework | Breaks core flow, loses user trust |

---

## Top Technical Risks

| Risk ID | Risk statement | Likelihood | Impact | Earliest detection point | Mitigation or spike | Owner | Status |
|--------|----------------|------------|--------|--------------------------|---------------------|-------|--------|
| R1 | `firestore.rules` denies all writes to `bus_data/{document=**}` but the Feedback page calls `setDoc` on `bus_data/current_status` — every crowding report fails silently in production | High | High | First feedback submission test against deployed rules | Add a specific `match /bus_data/current_status` rule allowing authenticated writes above the wide-deny catch-all | Giorgi Mikaberidze | Open |
| R2 | App displays CONFIRMED status for all queries but ETA is calculated from a static timetable, not live GPS — users who discover this will lose trust in the app | High | High | First user test or demo where bus doesn't arrive at predicted time | Default to ESTIMATED; only show CONFIRMED when a live data source is connected | Besik Meskhia | Open |
| R3 | Each user sharing location writes to `peer_locations/{uid}` every 5 seconds — 17,280 writes/day/user — exhausting the Spark plan's 20K daily write limit with just 2 active users | High | Medium | Firebase console usage dashboard approaching 20K/day | Reduce write frequency from 5s to 15s; upgrade to Blaze plan if needed | Nikoloz Kvirikashvili | Open |
| R4 | Free public OSRM API (`router.project-osrm.org`) has no SLA — if it goes down, route polylines disappear from the Live Map | Medium | Medium | Console errors on map page load; HTTP 429 or 503 from OSRM | Cache OSRM response in a local constant or Firestore document after first successful fetch | Giorgi Mikaberidze | Open |
| R5 | Base64 profile pictures stored in `users/{uid}.profilePicture` may push the document past Firestore's 1MiB limit, causing silent save failures | Medium | Medium | Profile picture save fails in console with no user-facing error | Enforce 200KB client-side limit; compress via `canvas.toBlob()` before encoding | Nikoloz Modebadze | Open |
| R6 | Service worker tile cache (500-entry LRU) may churn on a full route view (~56 tiles), evicting useful tiles and negating offline benefit | Medium | Low | Chrome DevTools Cache Storage showing high churn | Increase cache limit to 2,000 entries; add tile expiry | Giorgi Mikaberidze | Open |
| R7 | Pages added after the i18n dictionary was created may use hard-coded English strings, producing mixed EN/KA text for Georgian users | Medium | Medium | Manual QA pass with `ka` locale active | Lint scan for hard-coded strings in `.tsx` files; QA checklist item for Sprint Review | Nikoloz Modebadze | Open |
| R8 | Boarding state stored only in `localStorage` — cleared on private browsing or device switch, leaving stale `peer_locations` documents in Firestore | Low | Medium | User reports seeing on-bus banner after disembarking | Detect stale state on app start; add Force Disembark button in user menu | Besik Meskhia | Open |
| R9 | Next.js middleware on Vercel Edge Runtime may cold-start (500ms–2s) after inactivity, adding latency to first page load for infrequent users | Medium | Low | Page load time monitoring; user complaints about slow first load | Middleware is lightweight (locale string comparison only) — monitor via Vercel Analytics | Giorgi Mikaberidze | Open |
| R10 | Admin panel grants full trust score and role editing to any `role === "admin"` user with no audit log — a compromised admin account could corrupt the gamification system | Low | High | Unexpected trust score or role changes in Firestore | Add `admin_actions/{autoId}` audit log; restrict role assignment to a break-glass mechanism | Nikoloz Kvirikashvili | Open |

---

## Notes on the Top 3

### R1 — Firestore Rules Block Feedback Submission

- **Why this matters to Sprint 1:** Crowding reports are the primary data input that makes the app useful — if they fail silently, the product has no live data at all and the feedback page is broken in production without the team knowing
- **What evidence would show the risk is real:** Deploy to production and submit a crowding report on the Feedback page; check the Firebase Console to confirm no document was written to `bus_data/current_status`
- **What you will do first:** Open `firestore.rules`, add `match /bus_data/current_status { allow read: if true; allow write: if request.auth != null; }` above the wide-deny catch-all, redeploy, and retest

### R2 — Simulated Data Undermines Trust Promise

- **Why this matters to Sprint 1:** The entire product exists to solve the problem of misleading bus tracking — shipping a CONFIRMED badge backed only by a static timetable recreates the exact problem interviews identified, which means the core value proposition fails at first real use
- **What evidence would show the risk is real:** A user selects a stop, the app shows CONFIRMED with a specific ETA, and the bus does not arrive within that window — even once is enough to damage trust
- **What you will do first:** Change the badge logic so ESTIMATED is the default state and CONFIRMED is only displayed when `updatedAt` on `bus_data/current_status` is within a defined freshness window (e.g. 10 minutes)

### R3 — Firestore Write Limits Exceeded by Location Sharing

- **Why this matters to Sprint 1:** If the daily write quota is hit, all Firestore writes fail for the remainder of the day — this takes down boarding reports, crowding updates, and peer location sharing simultaneously, making the app appear broken to all users
- **What evidence would show the risk is real:** Firebase Console usage dashboard shows writes approaching 20K/day; Firestore begins throwing quota errors caught silently by `.catch(() => {})`
- **What you will do first:** Increase the peer location write interval from 5 seconds to 15 seconds in `BusStateContext`, reducing per-user writes from 17,280/day to 5,760/day, then monitor the console dashboard over a 24-hour active test

---

## Spike Plan

| Spike | Question to answer | Timebox | Owner | Output |
|------|--------------------|---------|-------|--------|
| Spike 1 | Can the CONFIRMED badge be gated on a data freshness timestamp without breaking the existing status check flow? | 60 minutes | Besik Meskhia | Decision note: either a working freshness check implementation or a documented reason to defer to Sprint 2 |
| Spike 2 | Does caching the OSRM route response in a local GeoJSON constant eliminate the external dependency entirely for Sprint 1? | 45 minutes | Giorgi Mikaberidze | One tested implementation: either a hardcoded route constant committed to the codebase or a confirmed Firestore caching approach |
| Spike 3 | Does reducing peer location writes from 5s to 15s meaningfully degrade the live map experience for users on the bus? | 30 minutes | Nikoloz Kvirikashvili | Observation note from a manual test ride: acceptable or unacceptable marker update frequency |

---

## Risk Matrix

```
                    Impact
             Low (1)   Med (2)   High (3)
        ┌─────────────────────────────────
High    │           R3         R1, R2
(3)     │           (6)        (9, 9)
        │
Likeli- │                         
hood    │  R6, R9   R4, R5,    R10
Med (2) │  (2)      R7 (4)     (3)
        │
Low     │           R8         
(1)     │           (2)        
```

| Priority | Risk ID | Risk Score | Risk Name |
|---|---|---|---|
| Critical | R1 | 9 | Firestore rules block feedback |
| Critical | R2 | 9 | Simulated data undermines trust |
| High | R3 | 6 | Firestore write limits |
| Medium | R4 | 4 | OSRM API availability |
| Medium | R5 | 4 | Base64 image size limits |
| Medium | R7 | 4 | Mixed-language UI |
| Medium | R10 | 3 | Admin panel abuse |
| Low | R6 | 2 | SW tile cache churn |
| Low | R8 | 2 | Boarding state on localStorage clear |
| Low | R9 | 2 | Vercel cold start |

---

## Risk Burndown (Sprint 1)

| Sprint Week | Target |
|---|---|
| Week 1 (Apr 24) | Mitigate R1 (fix Firestore rules) and R3 (reduce peer write frequency) |
| Week 2 (May 1) | Mitigate R4 (cache OSRM response) and R5 (add client-side image compression) |
| Week 3 (May 7) | Test all mitigations in production. R2 is accepted pending external GPS data. |

---

## Individual Risk Details

### R1 — Firestore Write Rules Block Feedback Submission

| Field | Value |
|---|---|
| **Risk** | `firestore.rules` denies all writes to `bus_data/{document=**}`, but the Feedback page calls `setDoc(doc(db, "bus_data", "current_status"), ...)` with `{merge:true}`. In production, every crowding report will fail silently because the write is denied by security rules. |
| **Type** | Technical — Security Rules |
| **Likelihood** | High (3) |
| **Impact** | High (3) |
| **Risk Score** | 9 (Critical) |
| **Detection** | Test the feedback page in production against deployed Firestore rules. The error is swallowed by `.catch(() => {})` in the component, so it will fail silently — users won't know their report didn't save. |
| **Mitigation** | Update `firestore.rules` to explicitly allow writes to `bus_data/current_status` for authenticated users: `match /bus_data/current_status { allow read: if true; allow write: if request.auth != null; }`. Keep the wide-deny for `match /bus_data/{document=**}` as a catch-all below the specific match. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Move the current_status document to a dedicated collection (e.g., `crowding_reports/{reportId}`) with permissive write rules. Then read the latest report via a query. |

### R2 — Timetable-Only Data Undermines Trust Promise

| Field | Value |
|---|---|
| **Risk** | The app displays "CONFIRMED" status for all queries, but the ETA is calculated from a static timetable (30-min frequency, 7-min stop intervals), not from live GPS data. If users discover the information is not actually confirmed in real-time, the app will be categorised alongside the existing broken tracking tools — exactly the outcome interviews warned about. |
| **Type** | Product — Data Authenticity |
| **Likelihood** | High (3) |
| **Impact** | High (3) |
| **Risk Score** | 9 (Critical) |
| **Detection** | User feedback in app reviews or interviews: "it says CONFIRMED but the bus didn't arrive when it said." In-app "Report Issue" submissions mentioning wrong ETAs. |
| **Mitigation** | Add a transparent data source label: "Schedule-based estimate" instead of "CONFIRMED" when no live feed is connected. Wire the badge so ESTIMATED is the default and CONFIRMED only displays when a live data source is available. |
| **Owner** | Besik Meskhia (Flexible) |
| **Fallback** | If live GPS data becomes available mid-sprint (e.g., via university operator), integrate it as a secondary data source and keep the CONFIRMED badge authentic. |

### R3 — Free Firestore Tier Write Limits Exceeded

| Field | Value |
|---|---|
| **Risk** | The Firebase Spark (free) plan limits Firestore to 20K writes/day and 50K reads/day. Each user sharing their location writes to `peer_locations/{uid}` every 5 seconds — that's 17,280 writes/day per user. With just 2 active users sharing location, the daily write budget is exhausted. |
| **Type** | Technical — Infrastructure Scaling |
| **Likelihood** | High (3) |
| **Impact** | Medium (2) |
| **Risk Score** | 6 (High) |
| **Detection** | Firebase console usage dashboard shows writes approaching 20K/day. Firestore throws "Quota exceeded" errors caught silently by `.catch(() => {})`. |
| **Mitigation** | (1) Reduce peer location write frequency from 5s to 15s — 5,760 writes/day/user. (2) Only share location when user is actively on the bus (already implemented). (3) Upgrade to Blaze plan ($0.06/100K writes — negligible cost at MVP scale). |
| **Owner** | Nikoloz Kvirikashvili (Program Lead) |
| **Fallback** | Make peer location sharing opt-in with a clear data-usage warning. Default to off. |

### R4 — OSRM Public API Rate Limiting or Downtime

| Field | Value |
|---|---|
| **Risk** | The Live Map page fetches route polylines from the free public OSRM API (`router.project-osrm.org`). This is a volunteer-run instance with no SLA. If it becomes unavailable or rate-limits requests, route polylines will not render. |
| **Type** | Technical — External Dependency |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | Console errors on map page load. OSRM returns HTTP 429 or 503. Route polylines disappear from the map. |
| **Mitigation** | Cache the OSRM response in a local constant or Firestore document so route geometry is available even when the API is down. Since the route doesn't change, one successful fetch is sufficient for the app lifetime. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Hard-code the route polyline coordinates as a GeoJSON constant in the codebase. The route is fixed, so this is a one-time data entry task. |

### R5 — Base64 Profile Picture Exceeds Firestore Document Size Limit

| Field | Value |
|---|---|
| **Risk** | Firestore document maximum size is 1 MiB. Profile pictures converted to Base64 data URIs and stored in `users/{uid}.profilePicture` may push past the limit, causing silent update failures. |
| **Type** | Technical — Data Storage |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | Console errors on profile picture save. Picture fails to update with no user-facing error message. |
| **Mitigation** | (1) Enforce a 200KB client-side size limit. (2) Compress images via `canvas.toBlob()` before Base64 conversion. (3) Add a toaster error when save fails. |
| **Owner** | Nikoloz Modebadze (Discovery Lead) |
| **Fallback** | Use Firebase Storage instead of Firestore for images. Store only the download URL in the user document. |

### R6 — Service Worker Tile Cache Eviction

| Field | Value |
|---|---|
| **Risk** | The service worker caches map tiles with a 500-entry LRU cache. A user travelling the full Bus #3 route (~56 tiles per route view) may exhaust the cache in ~9 route views, causing repeated tile downloads and negating the offline benefit. |
| **Type** | Technical — Caching |
| **Likelihood** | Medium (2) |
| **Impact** | Low (1) |
| **Risk Score** | 2 (Low) |
| **Detection** | Chrome DevTools > Application > Cache Storage shows high churn. Repeated tile downloads visible in Network tab. |
| **Mitigation** | Increase the cache size limit to 2,000 entries. Add tile expiry so frequently-used tiles are retained longer. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Remove tile caching and rely on the browser's HTTP cache. Acceptable for MVP. |

### R7 — Mixed-Language UI on Untranslated Strings

| Field | Value |
|---|---|
| **Risk** | Pages or components added after the i18n dictionary was created may use hard-coded English strings. Georgian users will see mixed EN/KA text, which degrades trust and professionalism. |
| **Type** | Product — Internationalization |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | Manual QA pass with `ka` locale. Any visible English text on a Georgian-language page is a gap. |
| **Mitigation** | Create a lint rule or script that scans `.tsx` files for hard-coded text strings and flags them. Add a QA checklist item for Sprint Review. |
| **Owner** | Nikoloz Modebadze (Discovery Lead) |
| **Fallback** | Default all missing translations to English for MVP and document the gap for Sprint 2. |

### R8 — Boarding State Lost on localStorage Clear

| Field | Value |
|---|---|
| **Risk** | Boarding state (`isOnBus`) is persisted only in `localStorage`. If the user clears browser data, uses incognito mode, or switches devices, they lose boarding state and their `peer_locations/{uid}` document may persist indefinitely. |
| **Type** | Technical — State Persistence |
| **Likelihood** | Low (1) |
| **Impact** | Medium (2) |
| **Risk Score** | 2 (Low) |
| **Detection** | User reports seeing the on-bus banner after disembarking. Stale `peer_locations` document visible in Firebase Console. |
| **Mitigation** | Add stale boarding detection: if `isOnBus` is true but no peer location has been written in >5 minutes, prompt the user to confirm. Clean up stale `peer_locations` docs on app start. |
| **Owner** | Besik Meskhia (Flexible) |
| **Fallback** | Add a Force Disembark button in the user menu accessible from any page. |

### R9 — Vercel Cold Start Delays for Middleware

| Field | Value |
|---|---|
| **Risk** | Next.js middleware on Vercel's Edge Runtime may cold-start (500ms–2s) after inactivity, adding latency to first page load for infrequent users. |
| **Type** | Technical — Performance |
| **Likelihood** | Medium (2) |
| **Impact** | Low (1) |
| **Risk Score** | 2 (Low) |
| **Detection** | Page load time monitoring. User complaints about slow first load. |
| **Mitigation** | Middleware only does locale detection (string comparison + redirect) — lightweight by design. Monitor via Vercel Analytics. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Move locale detection client-side via cookie and `useDictionary`. Remove middleware entirely. |

### R10 — Admin Panel Trust Score Abuse

| Field | Value |
|---|---|
| **Risk** | The admin panel grants full trust score and role editing to any user with `role === "admin"` with no audit log. A compromised admin account could promote arbitrary users and corrupt the gamification system. |
| **Type** | Security — Access Control |
| **Likelihood** | Low (1) |
| **Impact** | High (3) |
| **Risk Score** | 3 (Medium) |
| **Detection** | Unexpected trust score changes or role assignments. A user appears with `role: "admin"` who shouldn't have it. |
| **Mitigation** | (1) Enforce strong passwords for admin accounts. (2) Add an `admin_actions/{autoId}` audit log recording `{ adminUid, action, targetUid, timestamp }` for every change. (3) Restrict role assignment to a break-glass mechanism rather than a UI checkbox. |
| **Owner** | Nikoloz Kvirikashvili (Program Lead) |
| **Fallback** | Use Firebase Console directly to reset roles and revoke the compromised account's access. |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial risk register | Team Bandersnatch |
| May 14, 2026 | 2.0 | Added Notes on Top 3, Spike Plan, and Status column to risk table | Team Bandersnatch |

---

*Risk Register | Bandersnatch | CS-PD-2026 | Spring 2026*