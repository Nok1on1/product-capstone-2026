# Risk Register

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 1.0

---

## Risk Assessment Scale

| Dimension | Low (1) | Medium (2) | High (3) |
|---|---|---|---|
| **Likelihood** | Unlikely to occur during Sprint arc | Could occur, has happened before | Almost certain or already present |
| **Impact** | Minor inconvenience, quick fix | Blocks a feature, requires rework | Breaks core flow, loses user trust |

---

## Risk Register

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

---

### R2 — Timetable-Only Data Undermines Trust Promise

| Field | Value |
|---|---|
| **Risk** | The app displays "CONFIRMED" status for all queries, but the ETA is calculated from a static timetable (30-min frequency, 7-min stop intervals), not from live GPS data. If users discover the information is not actually confirmed in real-time, the app will be categorised alongside the existing broken tracking tools — exactly the outcome interviews warned about. |
| **Type** | Product — Data Authenticity |
| **Likelihood** | High (3) |
| **Impact** | High (3) |
| **Risk Score** | 9 (Critical) |
| **Detection** | User feedback in app reviews or interviews: "it says CONFIRMED but the bus didn't arrive when it said." In-app "Report Issue" submissions mentioning wrong ETAs. |
| **Mitigation** | Add a transparent data source label: "Schedule-based estimate" instead of "CONFIRMED" when no live feed is connected. This is already partially handled by the CONFIRMED/ESTIMATED badge system — wire it so that ESTIMATED is the default and CONFIRMED only displays when a live data source is available. |
| **Owner** | Besik Meskhia (Flexible) |
| **Fallback** | If live GPS data becomes available mid-sprint (e.g., via university operator), integrate it as a secondary data source and keep the CONFIRMED badge authentic. |

---

### R3 — Free Firestore Tier Write Limits Exceeded

| Field | Value |
|---|---|
| **Risk** | The Firebase Spark (free) plan limits Firestore to 20K writes/day and 50K reads/day. Each user sharing their location writes to `peer_locations/{uid}` every 5 seconds — that's 17,280 writes/day per user. With just 2 active users sharing location, the daily write budget is exhausted. The app also writes `bus_reports` and updates `users/{uid}` on every boarding/disembark/crowding action. |
| **Type** | Technical — Infrastructure Scaling |
| **Likelihood** | High (3) |
| **Impact** | Medium (2) |
| **Risk Score** | 6 (High) |
| **Detection** | Firebase console usage dashboard shows writes approaching 20K/day. Firestore throws "Quota exceeded" errors that are caught silently by `.catch(() => {})`. |
| **Mitigation** | (1) Reduce peer location write frequency from 5s to 15s — 5,760 writes/day/user. (2) Only share location when user is actively on the bus (already implemented). (3) Upgrade to Blaze plan ($0.06/100K writes, $0.06/100K reads — negligible cost at MVP scale). |
| **Owner** | Nikoloz Kvirikashvili (Program Lead) |
| **Fallback** | Make peer location sharing opt-in with a clear data-usage warning. Default to off. |

---

### R4 — OSRM Public API Rate Limiting or Downtime

| Risk | The Live Map page fetches route polylines from the free public OSRM API (`router.project-osrm.org`). This is a volunteer-run instance with no SLA. If it becomes unavailable or rate-limits requests, the route polylines will not render — leaving only stop markers and peer dots on a blank map background. |
|---|---|
| **Type** | Technical — External Dependency |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | Console errors on map page load. OSRM returns HTTP 429 or 503. Route polylines disappear from the map. |
| **Mitigation** | Cache the OSRM response in a local constant or Firestore document so the route geometry is available even when the API is down. Since the route doesn't change, one successful fetch is sufficient for the app lifetime. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Hard-code the route polyline coordinates as a GeoJSON constant in the codebase. The route is fixed (Bus #3 follows a known path), so this is a one-time data entry task. |

---

### R5 — Base64 Profile Picture Exceeds Firestore Document Size Limit

| Risk | Firestore document maximum size is 1 MiB. The account page converts user profile pictures to Base64 data URIs and stores them in `users/{uid}.profilePicture`. A moderate-resolution phone photo encoded as Base64 can easily exceed 500KB, and combined with the rest of the user document fields, may push past the 1MB limit — causing the update to fail silently. |
|---|---|
| **Type** | Technical — Data Storage |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | `firebase.storage` errors logged in console. Profile picture fails to save but user sees no error message. |
| **Mitigation** | (1) Enforce a stricter client-side size limit (e.g., 200KB). (2) Compress images client-side using `canvas.toBlob()` before Base64 conversion. (3) Add a toaster error message when save fails. |
| **Owner** | Nikoloz Modebadze (Discovery Lead) |
| **Fallback** | Use Firebase Storage instead of Firestore for images. Store only the download URL in the user document. |

---

### R6 — Service Worker Tile Cache Eviction Causes Repeated Tile Downloads

| Risk | The service worker caches map tiles with a 500-entry LRU cache. A user travelling the full Bus #3 route (14+ stations, 2 zoom levels, 2 tile providers = ~56 tiles per route view) may exhaust the cache in ~9 route views. Older tiles get evicted and re-downloaded, negating the offline/performance benefit. |
|---|---|
| **Type** | Technical — Caching |
| **Likelihood** | Medium (2) |
| **Impact** | Low (1) |
| **Risk Score** | 2 (Low) |
| **Detection** | Chrome DevTools > Application > Cache Storage shows high churn. Repeated tile downloads visible in Network tab. |
| **Mitigation** | Increase the cache size limit to 2,000 entries. Add a tile expiry check so frequently-used tiles are retained longer. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Remove tile caching entirely and rely on the browser's HTTP cache. Not ideal but acceptable for MVP. |

---

### R7 — Mixed-Language UI on Untranslated Strings

| Risk | The i18n dictionary (`src/i18n/dictionaries.ts`) may not cover every UI string in the application. Pages or components added after the dictionary was created may use hard-coded English strings that never get translated. Georgian users will see mixed English/Georgian text, which degrades trust and professionalism. |
|---|---|
| **Type** | Product — Internationalization |
| **Likelihood** | Medium (2) |
| **Impact** | Medium (2) |
| **Risk Score** | 4 (Medium) |
| **Detection** | Manual QA pass with `ka` locale. Any visible English text on a Georgian-language page is a gap. |
| **Mitigation** | Create a lint rule or script that scans `.tsx` files for hard-coded text strings and flags them. Add a QA checklist item for the Sprint Review: "App works fully in both locales." |
| **Owner** | Nikoloz Modebadze (Discovery Lead) |
| **Fallback** | For MVP, default all missing translations to English and document the gap for Sprint 2. |

---

### R8 — Boarding State Lost on localStorage Clear

| Risk | The boarding state (`isOnBus`) is persisted only in `localStorage("bandersnatch_isOnBus")`. If the user clears their browser data, uses private/incognito mode, or switches devices, they lose the boarding state. They appear as a regular user on the map but the app still shows the on-bus banner. |
|---|---|
| **Type** | Technical — State Persistence |
| **Likelihood** | Low (1) |
| **Impact** | Medium (2) |
| **Risk Score** | 2 (Low) |
| **Detection** | User reports "the app says I'm on the bus but I got off an hour ago." The user's `peer_locations/{uid}` document may also persist if they don't disembark properly. |
| **Mitigation** | Add a "Stale boarding?" detection: if the user hasn't written a peer location in >5 minutes but `isOnBus` is true, prompt them to confirm they're still on the bus. Clean up stale `peer_locations` docs on app start. |
| **Owner** | Besik Meskhia (Flexible) |
| **Fallback** | Add a "Force disembark" button in the user menu accessible from any page. |

---

### R9 — Vercel Cold Start Delays for Middleware

| Risk | Next.js middleware runs on Vercel's Edge Runtime. On the free plan, edge functions may experience cold starts (500ms–2s) after periods of inactivity. This adds latency to every page navigation for infrequent users — the exact population that needs the app to feel fast and trustworthy. |
|---|---|
| **Type** | Technical — Performance |
| **Likelihood** | Medium (2) |
| **Impact** | Low (1) |
| **Risk Score** | 2 (Low) |
| **Detection** | Page load time monitoring. User complaints about slow first load. |
| **Mitigation** | The middleware only does locale detection (string comparison + redirect) — it's lightweight. Cold start impact should be minimal. Monitor via Vercel Analytics. |
| **Owner** | Giorgi Mikaberidze (Tech Lead) |
| **Fallback** | Move locale detection client-side (read from cookie, set in `useDictionary`). Remove middleware entirely. |

---

### R10 — Admin Panel Trust Score Abuse

| Risk | The admin panel grants full trust score and role editing to any user with `role === "admin"`. If an admin account is compromised (weak password, shared device), an attacker could promote themselves or others to admin, modify trust scores arbitrarily, and corrupt the gamification system. There is no audit log of admin actions. |
|---|---|
| **Type** | Security — Access Control |
| **Likelihood** | Low (1) |
| **Impact** | High (3) |
| **Risk Score** | 3 (Medium) |
| **Detection** | Unexpected trust score changes or role assignments. A user appears with `role: "admin"` who shouldn't have it. |
| **Mitigation** | (1) Enforce strong passwords for admin accounts. (2) Add an admin action log to Firestore (`admin_actions/{autoId}`) that records `{ adminUid, action, targetUid, timestamp }` for every trust/role change. (3) Restrict admin role assignment to a single break-glass mechanism rather than a UI checkbox. |
| **Owner** | Nikoloz Kvirikashvili (Program Lead) |
| **Fallback** | In the event of compromise, use the Firebase Console directly to reset roles and revoke the compromised account's access. |

---

## Risk Matrix

```
                    Impact
             Low (1)   Med (2)   High (3)
        ┌─────────────────────────────────
High    │           R3         R1, R2
(3)     │           (6)        (9, 9)
        │
Likeli- │                         R5
hood    │  R9       R4, R7     R10
Med (2) │  (2)      (4, 4)     (3)
        │
Low     │  R6       R8
(1)     │  (2)      (2)
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
| Week 3 (May 7) | Test all mitigations in production. R2 is accepted (depends on external GPS data). |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial risk register | Team Bandersnatch |

---

*Risk Register | Bandersnatch | CS-PD-2026 | Spring 2026*
