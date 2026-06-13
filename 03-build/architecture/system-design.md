# System Design Document

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 1.0

---

## 1. System Overview

A mobile-first web application that provides KIU students with reliable, honest real-time bus arrival information for Bus #3. The product addresses the core problem identified in 12 interviews: students lose 5-12 hours per week to fear-based early departure because the existing tracking system provides misleading information.

### Sprint 1 Boundary

| In Scope (Sprint 1) | Deferred (Post-Sprint 1) |
|---|---|
| User sign-up with email/password | Live map with Leaflet |
| Bus stop selector | Ride history |
| Status query with CONFIRMED/ESTIMATED badges | Admin panel & trust score system |
| Crowding level indicator | Onboarding wizard |
| Vercel deployment | Push notifications (FCM) |
| Firebase Auth + Firestore integration | i18n (English/Georgian) |
| Basic loading/error states | PWA / Service Worker |
| Email verification | Profile pictures |
| Bus boarding/disembark reporting | Driver feedback |
| Peer location sharing | Split-a-ride |

**Note:** The team built beyond Sprint 1 scope during development. This document describes the full system as implemented, with Sprint 1 scope explicitly marked.

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | Next.js 16.2.9 (App Router) | Server components, file-based routing, middleware |
| UI Language | TypeScript 5 | Type safety across the codebase |
| Styling | Tailwind CSS v4 | Utility-first responsive design |
| UI Components | Headless UI 2 | Accessible listbox (StopSelect) |
| Animations | Framer Motion 12 | Page transitions, AnimatedIcon |
| Icons | Lucide React | Consistent icon set |
| Authentication | Firebase Auth (email/password) | User management, email verification |
| Database | Firestore | Real-time document store |
| Push Notifications | Firebase Cloud Messaging | Web push notifications |
| Maps | Leaflet + React-Leaflet + OSRM | Route polylines, markers, tile layers |
| Map Tile Caching | Custom Service Worker | Offline map support |
| Theme | Custom ThemeProvider | Dark/light/system mode |
| Internationalization | Custom middleware + dictionary | English / Georgian |
| Deployment | Vercel | CI/CD, environment variables |
| Analytics (planned) | Google Analytics 4 | Event tracking |

---

## 2. Component Architecture

### 2.1 Provider Chain (Outermost to Innermost)

```
<html>                          — Server-rendered shell
  <ThemeProvider>               — Dark/light/system mode (class-based)
    <AuthProvider>               — Firebase onAuthStateChanged + Firestore profile
      <BusStateProvider>         — Boarding state, location sharing, bus reports
        <TopNav />               — Sticky header: nav links, theme/lang toggles, account
        <AlertBanner />          — Firestore onSnapshot for live alerts
        <AnimatePresence>        — Framer Motion exit animations
          {template + page}      — Page content with enter animations
        </AnimatePresence>
        <BottomNav />            — Mobile tab bar (Home, Map, Schedule, Feedback)
      </BusStateProvider>
    </AuthProvider>
  </ThemeProvider>
```

### 2.2 Frontend Components

| Component | Responsibility | Auth Required | Data Source |
|---|---|---|---|
| **TopNav** | Navigation header, theme toggle, language switch, account link | No | `useDictionary` |
| **BottomNav** | Mobile tab navigation with active indicator | No | Pathname |
| **AlertBanner** | Live dismissible alerts (info/warning/critical) | No | Firestore `bus_data/alert` onSnapshot |
| **StopSelect** | Bus stop dropdown (Headless UI Listbox) | No | Static `route3.ts` data |
| **LiveMap** | Full Leaflet map with routes, buses, peers | No | Firestore `peer_locations` onSnapshot, OSRM API |
| **RouteMap** | Static route timeline with stops and travel times | No | Static `route3.ts` data |
| **OnBusBanner** | Green sticky banner when user is on bus | Yes | `BusStateContext` |
| **OnBusButton** | Floating FAB for board/disembark | Yes | `BusStateContext` |
| **ReportButton** | Floating FAB + modal for issue reporting | Yes | Firestore `alerts` collection |
| **Skeleton** | Loading skeleton UI (Box, Circle, Text, Card, Map, etc.) | No | — |

### 2.3 State Management

| State | Location | Persistence | Update Mechanism |
|---|---|---|---|
| Auth state | `AuthContext` | Firebase Auth session (cookies/localStorage) | `onAuthStateChanged` listener |
| User profile | `AuthContext` | Firestore `users/{uid}` | `onAuthStateChanged` → `getDoc` + `updateProfile` |
| Boarding state | `BusStateContext` | `localStorage("bandersnatch_isOnBus")` + React state | `boardBus()` / `disembark()` actions |
| Location sharing | `BusStateContext` | `localStorage` | 5-second `setInterval` writes to Firestore |
| Crowding data | `BusStateContext` | Firestore `bus_data/current_status` | `getDoc` on demand |
| Theme | `ThemeProvider` | `localStorage("theme")` | Class toggle on `<html>` |
| Language | URL path prefix | URL `/{lang}/` path | Middleware redirect + `useDictionary` |

### 2.4 Page Components

| Route | Component | Auth | Firestore Reads | Firestore Writes |
|---|---|---|---|---|
| `/[lang]` | Home | Optional | `buses`, `alerts`, `bus_data/current_status` | `updateProfile({defaultStop})` |
| `/[lang]/login` | Login | None | — | — (Firebase Auth SDK) |
| `/[lang]/signup` | Signup | None | — | `users/{uid}`, `sendEmailVerification` |
| `/[lang]/verify-email` | Verify Email | Must be logged in | `user.emailVerified` (poll) | `sendEmailVerification` (resend) |
| `/[lang]/live-map` | Live Map | None | `peer_locations` (onSnapshot), OSRM API | — |
| `/[lang]/routes` | Routes | None | — (static data) | — |
| `/[lang]/trip-details` | Trip Details | Optional | From `BusStateContext` | `bus_reports/*`, `peer_locations/{uid}` |
| `/[lang]/account` | Account | Required | `users/{uid}` | `users/{uid}` (profile pic, stop) |
| `/[lang]/admin` | Admin | Admin role | `users/{uid}` | `users/{uid}` (trust, role) |
| `/[lang]/ride-history` | Ride History | Required | `bus_reports` (query by userId) | — |
| `/[lang]/onboarding` | Onboarding | Optional | — | `users/{uid}` or `localStorage` |
| `/[lang]/feedback` | Feedback | None | — | `bus_data/current_status` |
| `/[lang]/find-ride` | Find Ride | None | — | — (MVP static/promo surface) |

---

## 3. Request Lifecycle

### 3.1 Signup Flow

```
Browser                              Firebase Auth           Firestore
-------                              -------------           ---------
1. User fills form                          
   (name, email, password, stop)         
2. POST createUserWithEmailAndPassword ──→ 3. Auth account created
                                        ←── 4. Auth tokens returned
5. setDoc(users/{uid}, {                 ──→ 6. users/{uid} created
     displayName, email, role:null,
     trustScore:50, defaultStop, ...})
7. sendEmailVerification(user)           ──→ 8. Verification email sent
9. Redirect to /verify-email
10. Poll user.emailVerified every 3s      ──→ 11. Check emailVerified
12. Once verified, redirect to home
```

### 3.2 Bus Status Check Flow

```
Browser                              Firestore
-------                              ---------
1. User selects stop + destination
2. Clicks "Check Status"
3. Loading spinner shown (200ms threshold)
4. getDoc(bus_data/current_status)     ──→ 5. Returns { crowding, updatedAt }
6. Timetable ETA calculation (client-side)
   - getETAtoDestination(currentStopId, destId, direction)
   - If direction matches: (destIdx - currentIdx) * 7 min
7. Render CONFIRMED/ESTIMATED badge
   - Always shows CONFIRMED for MVP (mock)
   - Display ETA in minutes + crowding level
```

### 3.3 Boarding Flow

```
Browser                              Firestore                   localStorage
-------                              ---------                   -----------
1. User taps board button
2. navigator.geolocation.watchPosition
   → currentUserLocation obtained
3. findNearestStopOnRoute(lat, lng)
   → { stop, direction } identified
4. Compute nextStop from route data
5. Set isOnBus = true, update state   ──→ 6. bandersnatch_isOnBus = "true"
7. Write bus_reports/board_{uid}_{ts} ──→ 8. { action: "boarded", direction,
                                              currentStopId, timestamp }
9. incrementTrustScore(uid, +1)       ──→ 10. users/{uid} trustScore += 1
11. incrementReportCount(uid)         ──→ 12. users/{uid} totalReportsMade += 1
13. Start 5-second interval:
14. setDoc(peer_locations/{uid}, {    ──→ 15. { lat, lng, heading, accuracy,
       lat, lng, heading, isOnBus:true,     direction, displayName,
       displayName, timestamp })            timestamp }
```

### 3.4 Live Map Data Flow

```
Browser                              Firestore                   OSRM
-------                              ---------                   ----
1. Page loads LiveMap (dynamic import)
2. Fetch OSRM route data              ──→                       ──→ 3. Return road-following polyline
4. Render route polylines (2 directions)
5. onSnapshot(peer_locations)          ──→ 6. Real-time stream of location docs
7. Render peer markers (green dots
   with heading arrows, filter < 60s)
8. Animate simulated bus markers
   (requestAnimationFrame + lerp)
9. Add user location marker
10. Add stop markers for both routes
```

### 3.5 Disembark Flow

```
Browser                              Firestore                   localStorage
-------                              ---------                   -----------
1. User taps disembark button
2. Write bus_reports/disembark_{uid} ──→ 3. { action: "disembarked",
                                              lastStopId, timestamp }
4. incrementTrustScore(uid, +1)       ──→ 5. users/{uid} trustScore += 1
6. Stop location sharing interval
7. Delete peer_locations/{uid}        ──→ 8. Document removed
9. Clear BusState                     ──→ 10. localStorage bandersnatch_isOnBus
                                               set to "false"
```

---

## 4. Data Model

### 4.1 Firestore Collections

#### `users/{userId}` — User Profiles

| Field | Type | Example | Editable By |
|---|---|---|---|
| `displayName` | string | "Dachi" | Self |
| `email` | string | "dachi@kiu.edu.ge" | System (on signup) |
| `role` | `"student" \| "admin" \| "driver" \| null` | "student" | Admin only |
| `trustScore` | number | 50 | Admin only |
| `totalReportsMade` | number | 12 | Admin only |
| `defaultStop` | string (stop ID) | "10" | Self |
| `profilePicture` | string (Base64) | "data:image/png;base64,..." | Self |
| `emailVerified` | boolean | true | System |
| `createdAt` | Timestamp | — | System (on signup) |
| `onboardingCompleted` | boolean | true | Self |

#### `users/{userId}/fcmTokens/{tokenId}` — Push Tokens

| Field | Type | Description |
|---|---|---|
| `token` | string | FCM device token |
| `preferences` | object | Notification preferences |
| `createdAt` | Timestamp | Token creation time |

#### `bus_reports/{reportId}` — User Reports

| Field | Type | Description |
|---|---|---|
| `userId` | string | Reporting user's UID |
| `action` | `"boarded" \| "disembarked"` | Boarding state change |
| `type` | `"not_here" \| "bus_is_here" \| "crowding_report"` | Report type |
| `direction` | `"station" \| "city"` | Route direction |
| `currentStopId` | string | Boarding/reporting stop |
| `lastStopId` | string | Disembark stop |
| `level` | `"low" \| "medium" \| "high"` | Crowding level |
| `timestamp` | Timestamp | Event time |

#### `peer_locations/{userId}` — Live Locations

| Field | Type | Description |
|---|---|---|
| `lat` | number | Latitude |
| `lng` | number | Longitude |
| `heading` | number | Compass heading |
| `accuracy` | number | GPS accuracy (meters) |
| `direction` | `"station" \| "city"` | Route direction |
| `isOnBus` | boolean | Whether user is on bus |
| `displayName` | string | User's display name |
| `timestamp` | Timestamp | Server timestamp (written every 5s) |

#### `buses/{busId}` — Bus Metadata

| Field | Type | Description |
|---|---|---|
| `name` | string | "Bus #1" |
| `id` | string | "bus-1" |
| `isActive` | boolean | Whether bus is active |
| `status` | string | Current status |
| `lastUpdated` | Timestamp | Last update time |

#### `alerts/{alertId}` — Issue Reports

| Field | Type | Description |
|---|---|---|
| `busId` | string | Affected bus |
| `reason` | string | Issue description |
| `timestamp` | Timestamp | Report time |
| `userId` | string | Reporting user |
| `status` | string | "open" / "resolved" |

#### `bus_data/current_status` — Crowding Status (single doc)

| Field | Type | Description |
|---|---|---|
| `crowding` | `"empty" \| "normal" \| "packed"` | Current crowding level |
| `updatedAt` | Timestamp | Last update time |

#### `bus_data/alert` — Global Alert (single doc)

| Field | Type | Description |
|---|---|---|
| `active` | boolean | Whether alert is active |
| `message` | `{ en: string, ka: string }` | Alert text in both languages |
| `severity` | `"info" \| "warning" \| "critical"` | Alert severity |
| `link` | string (optional) | Related link |
| `expiresAt` | Timestamp (optional) | Auto-expiry |

### 4.2 Firestore Security Rules Summary

| Collection | Read | Write | Special Rules |
|---|---|---|---|
| `users/{userId}` | Self only | Self (limited) or Admin | Users cannot modify own `role`, `trustScore`, `totalReportsMade` |
| `users/{userId}/fcmTokens/{tokenId}` | Self only | Self only | — |
| `users/{userId}/public/{doc}` | Anyone | Self only | — |
| `peer_locations/{userId}` | Anyone | Self only | Write must match auth UID |
| `bus_tracking/{trackingId}` | Anyone | Authenticated | — |
| `bus_reports/{reportId}` | Anyone | Authenticated | — |
| `bus_data/{document}` | Anyone | Denied (except maintanence) | Read-only for clients |
| `buses/{busId}` | Anyone | Authenticated | — |
| `alerts/{alertId}` | Anyone | Authenticated | — |
| Default `{document=**}` | Denied | Denied | Catch-all |

---

## 5. Route Data

### Direction 1 — To Station (Colchis Fountain → Rioni Railway Station)

14 stops covering the route from Kutaisi city centre through KIU campus to the railway station.

### Direction 2 — To City Centre (Rioni Railway Station → Colchis Fountain)

12 stops returning from the railway station through KIU campus to the city centre.

**Stop IDs are direction-dependent** — stop ID "1" in direction "station" is Colchis Fountain, while stop ID "1" in direction "city" is Railway Station. Direction context is required for all stop lookups.

### Timetable Constants

| Parameter | Value |
|---|---|
| Operating hours | 07:30 — 22:00 |
| Frequency | Every 30 minutes |
| Travel time between consecutive stops | 7 minutes |

---

## 6. Gamification System

### Trust Score

| Action | Score Change |
|---|---|
| Boarding bus | +1 |
| Disembarking bus | +1 |
| Reporting "Bus is Here" | +2 |
| Reporting "Not Here" | -1 |
| Reporting crowding | +1 |

Starting score: 50. Admins can set any score via admin panel.

### Badges

| Tier | Report Count | Badge Name |
|---|---|---|
| 1 | 0 — 9 | Beginner |
| 2 | 10 — 49 | Contributor |
| 3 | 50 — 99 | Reliable |
| 4 | 100+ | Expert |

Derived client-side from `totalReportsMade` field.

---

## 7. AI Touchpoints

### AI Tools Used

| Tool | Used For | Governance |
|---|---|---|
| Google Stitch | UI prototyping (4 screens), component generation | Human reads every line, checks against AC, adds comments |
| Claude Code | Complex multi-file tasks (scaffolding, project setup) | Full code review by human, annotations required |
| GitHub Copilot | Ambient code completion (boilerplate, repetitive patterns) | Always-on, reviewed at PR time |
| Google AI Studio | Prompt prototyping (not yet used in Sprint 1) | — |

### AI Review Process

1. **Generate** — Developer uses designated AI tool
2. **Read every line** — No Tab-to-accept without reading
3. **Check against AC** — Every acceptance criterion verified
4. **Security check** — No PII in logs, no vulnerabilities
5. **Annotate** — Inline comments on AI-generated logic
6. **Log** — Entry added to `docs/ai-usage-log.md`
7. **PR review** — Reviewer checks annotations + log entry

### AI Code Annotation Standard

```typescript
// AI-generated: [tool name] — [brief description of what was generated]
// Reviewed by: [name] on [date]
// Notes: [what was modified from AI output]
```

All AI-assisted work is logged in `docs/ai-usage-log.md` with date, story ID, tool, task, files changed, result, and review notes.

---

## 8. Deployment & Infrastructure

### Deployment Pipeline

```
GitHub PR → Merge to main → Vercel auto-deploy → Production URL
```

### Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console | Auth + Firestore client SDK |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Console | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Console | Project identifier |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Console | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console | FCM sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Console | App identifier |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Firebase Console | FCM push key |

### PWA Support

- **Manifest**: Standalone display, theme color #3b82f6, 192x192 and 512x512 icons
- **Service Worker**: Two caches — static assets (network-first) and map tiles (500-entry LRU)
- **Push Notifications**: FCM integration with notification click handling

---

## 9. Build Readiness Summary

A developer joining Sprint 1 can start implementation from this document plus the supporting artifacts:

1. **Component Architecture** (Section 2) — Shows all components, their responsibilities, and data sources
2. **Request Lifecycle** (Section 3) — Five critical flows fully traced from browser to storage and back
3. **Data Model** (Section 4) — Complete Firestore schema with field types, examples, and security rules
4. **Sprint Boundary** (Section 1) — Clear in-scope vs. deferred features
5. **Tech Stack** (Section 1) — Every layer decided with rationale
6. **AI Governance** (Section 7) — Tool assignments, review process, annotation standard

---

## 10. Security, Privacy, and Reliability Basics

Auth risks: Email verification polling may frustrate users who don't receive the verification email promptly; Firebase's spam filters occasionally delay delivery to .edu.ge addresses.
Sensitive data handled: User email addresses, display names, GPS coordinates (written to Firestore every 5 seconds while on bus), and Base64-encoded profile pictures.
Failure mode if main service goes down: If Firestore is unavailable, bus status checks, live map, and boarding reports all fail. The app will show error states; boarding state persists in localStorage so users don't lose their on-bus status locally.
Logging and monitoring plan for Sprint 1: Vercel deployment logs cover server errors. Firestore security rule rejections are visible in Firebase Console. Manual smoke test after each merge to main.
One thing we will not promise yet: Real-time GPS tracking of the actual Bus #3 vehicle. All bus position data in Sprint 1 is either user-reported or simulated.

---

## 11. Technical Risks and Spikes

Risk: Peer location sharing writes to Firestore every 5 seconds per active user, which may hit Firestore write limits or cause noticeable latency under load.

Why it matters: Location sharing is core to the live map feature; degraded writes mean stale or missing peer markers.
Mitigation or spike: Test with 10+ simultaneous boarding sessions; consider increasing interval to 10 seconds if write costs or latency become an issue.
Owner: Team Bandersnatch


Risk: GPS accuracy on mobile browsers varies significantly; findNearestStopOnRoute may assign the wrong stop or wrong direction if accuracy is poor.

Why it matters: A wrong direction assignment means boarding reports corrupt the route data and the user sees incorrect ETA information.
Mitigation or spike: Add an accuracy threshold check (e.g. reject readings worse than 50m) and allow the user to manually confirm their stop before boarding is recorded.
Owner: Team Bandersnatch


Risk: CONFIRMED badge is currently mocked and always returns CONFIRMED regardless of actual data freshness.

Why it matters: This is the core trust problem the product was built to solve; shipping a permanently mocked badge undermines the product's stated purpose.
Mitigation or spike: Gate the CONFIRMED badge on updatedAt being within a defined freshness window (e.g. 10 minutes); fall back to ESTIMATED if stale.
Owner: Team Bandersnatch

---


## 12. Open Questions

Should the CONFIRMED/ESTIMATED badge threshold be based on report recency, number of reports, or trust score of reporters?
Does peer location sharing require explicit opt-in consent under Georgian data protection norms, or is the current implicit consent (boarding action implies sharing) sufficient?
Should the 5-second location write interval be configurable per device to save battery on older phones?

## 13. Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial system design document | Team Bandersnatch |
| May 14, 2026 | 2.0 | Added 3 other sections that were present in the template | Team Bandersnatch |

---

*System Design Document | Bandersnatch | CS-PD-2026 | Spring 2026*
