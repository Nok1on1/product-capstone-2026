# AI Usage Log

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker

All AI-assisted work must be logged here before raising a PR. Format follows the process map specification.

---

Date: 2026-04-24
Story: S1-01 — User sign-up with email/password
Tool: Google Stitch
Task: Generate signup page UI with email/password form, bus stop selector, and validation
Prompt summary: "Create a signup form with fields for display name, email, password (min 8 chars), and bus stop selector dropdown. Include form validation error states."
Files changed: src/app/[lang]/signup/page.tsx
Result: Modified
Review notes: Generated basic form structure. Added Firebase Auth integration and Firestore profile creation manually. Changed the form layout to match Tailwind v4 conventions.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-04-24
Story: S1-01 — User sign-up with email/password
Tool: Google Stitch
Task: Generate login page UI with email/password form
Prompt summary: "Create a login page with email and password fields, error message area, and link to signup page."
Files changed: src/app/[lang]/login/page.tsx
Result: Accepted
Review notes: Straightforward form. Added email verification check redirect manually after generation.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-04-25
Story: S1-02 — Bus stop selector on home screen
Tool: Claude Code
Task: Implement StopSelect component using Headless UI Listbox with route data integration
Prompt summary: "Create a bus stop selector component using @headlessui/react Listbox. Populate options from src/data/route3.ts stops. Support search/filter. Style with Tailwind."
Files changed: src/components/StopSelect.tsx, src/app/[lang]/page.tsx
Result: Modified
Review notes: Generated the Listbox wrapper and stop data mapping. Had a bug where stop IDs from toStation direction were used for display labels without direction context. Fixed by merging both direction stops into a deduplicated display set.
Reviewer: Nikoloz Modebadze

---

Date: 2026-04-26
Story: S1-03 — Status query and loading UI
Tool: Google Stitch
Task: Generate status query button with loading spinner and error states
Prompt summary: "Create a 'Check Status' button component with three states: idle, loading (spinner shown within 200ms), and error (with Try Again button). Include a 'Still checking...' message after 3 seconds."
Files changed: src/app/[lang]/page.tsx
Result: Accepted
Review notes: Loading state UI was clean. Integrated with timetable ETA calculations manually. Added the timeout detection for "Still checking..." message.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-04-26
Story: S1-04 — CONFIRMED/ESTIMATED status display
Tool: Google Stitch
Task: Generate CONFIRMED (green) and ESTIMATED (yellow) badge components
Prompt summary: "Design a status badge component with two variants: a green CONFIRMED badge and a yellow ESTIMATED badge. Show estimated arrival time in minutes prominently. Use large font for the minutes display."
Files changed: src/app/[lang]/page.tsx
Result: Modified
Review notes: Badge visuals were good but needed accessibility improvements — added aria-labels for screen readers. Changed the color contrast to meet WCAG AA standards.
Reviewer: Besik Meskhia

---

Date: 2026-04-27
Story: S1-05 — Crowding level indicator
Tool: Google Stitch
Task: Generate crowding level indicator with Low/Medium/High states
Prompt summary: "Create a crowding indicator with three levels: Low (green), Medium (yellow), High (red). Show as horizontal bar segments. Hide entirely when no data available."
Files changed: src/app/[lang]/page.tsx
Result: Accepted
Review notes: Simple visual component. No changes needed.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-04-28
Story: S1-06 — Deployment to Vercel
Tool: Claude Code
Task: Configure Vercel deployment with environment variables and CI/CD
Prompt summary: "Set up Vercel project linked to GitHub repo. Configure environment variables for Firebase. Set up auto-deploy on PR merge to main."
Files changed: next.config.ts, .env.local, vercel.json (created)
Result: Modified
Review notes: Initial attempt used an invalid vercel.json format. Fixed by removing it and using Vercel dashboard config instead. Environment variable names documented.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-04-28
Story: S1-03 — Status query and loading UI
Tool: Claude Code
Task: Implement timetable utility functions for ETA calculation
Prompt summary: "Write a timetable module that calculates ETA between bus stops on Route #3. Include functions: getETAtoDestination, getNext3Stops, getNextScheduledBus, getTimetableETAFromNow. Operating hours 07:30-22:00, frequency 30 min, 7 min between stops."
Files changed: src/lib/timetable.ts
Result: Accepted
Review notes: Generated all utility functions correctly. Added edge case handling for end-of-day (next-day bus) and invalid stop IDs manually. Logic was sound.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-04-29
Story: S1-04 — CONFIRMED/ESTIMATED status display (continued)
Tool: Claude Code
Task: Integrate timetable ETA with home page status display
Prompt summary: "Connect the timetable utility to the home page status flow. On 'Check Status' click: read bus_data/current_status, compute ETA, display CONFIRMED badge with minutes."
Files changed: src/app/[lang]/page.tsx, src/lib/timetable.ts
Result: Accepted
Review notes: Integration was clean. Added loading timeout and error handling. The current implementation always shows CONFIRMED — need to wire ESTIMATED fallback when a real GPS source is available.
Reviewer: Besik Meskhia

---

Date: 2026-04-30
Story: S1-01 — User sign-up with email/password (continued)
Tool: Claude Code
Task: Implement Firebase Auth context provider with Firestore profile sync
Prompt summary: "Create an AuthProvider that listens to onAuthStateChanged, reads the Firestore users/{uid} document, and exposes user/profile/loading/updateProfile. Handle the case where the Firestore doc doesn't exist yet (return default profile)."
Files changed: src/context/AuthContext.tsx, src/lib/firebase.ts
Result: Modified
Review notes: Good provider structure. Had a race condition where the profile state could be stale after signup — the Firestore write hadn't completed before onAuthStateChanged fired. Fixed by adding a delay for profile read after signup. Added error handling for missing Firestore doc.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-01
Story: S1-01 — User sign-up with email/password (continued)
Tool: GitHub Copilot
Task: Write type definitions for user profile, roles, and Firestore documents
Prompt summary: N/A (ambient completion — types filled in as context)
Files changed: src/types/user.ts
Result: Accepted
Review notes: Generated UserProfile and UserRole types inline while writing auth context. Correct shape matching Firestore document schema.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-01
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement location utility functions (haversine, nearest stop, route proximity)
Prompt summary: "Write a geospatial utility module with haversine distance, findNearestStop (scans both route directions), point-to-segment distance, isNearRoute (threshold 50m), and isInCenterArea. Coordinates for Kutaisi: Colchis Fountain at 42.271544, 42.705447."
Files changed: src/lib/location-utils.ts
Result: Modified
Review notes: Haversine formula was correct. The findNearestStopOnRoute function initially only searched toStation stops — had to add toCityCentre direction scan. Added edge case for empty stop arrays.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-02
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement bus state context with boarding, disembarking, location sharing, and reporting actions
Prompt summary: "Create a BusStateContext that manages on/off bus state, direction, current/next stop, location sharing (5-second Firestore writes), and reporting actions (board, disembark, not here, bus is here, crowding). Persist isOnBus to localStorage. Write to bus_reports collection and update trust scores."
Files changed: src/context/BusStateContext.tsx
Result: Modified
Review notes: Complex context with ~20 state properties and 6 action methods. Had a bug where location sharing interval was not cleaned up on disembark — added clearInterval. The Firestore writes use silent catch handlers which may hide security rule failures (see risk R1). Added trust score increment/decrement calls.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-03
Story: S1-00 — Core infrastructure
Tool: GitHub Copilot
Task: Write trust score utility functions (increment, decrement, set, role management)
Prompt summary: N/A (ambient completion — utility functions filled in from context)
Files changed: src/lib/trust-utils.ts
Result: Accepted
Review notes: Generated all Firestore atomic update functions correctly using Firestore increment() operator. No changes needed.
Reviewer: Besik Meskhia

---

Date: 2026-05-03
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement email verification hook with polling and route guard logic
Prompt summary: "Create a useEmailVerification hook that: (1) polls user.emailVerified every 3 seconds via reload(), (2) redirects unverified users to /verify-email, (3) redirects unauthenticated users to /login. Exempt public routes: /login, /signup, /verify-email."
Files changed: src/hooks/useEmailVerification.ts
Result: Modified
Review notes: Good polling logic. Had to adjust the redirect logic — initial implementation redirected on every render before auth state was resolved. Added a loading state check to prevent false redirects on first render.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-04
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate account page UI with profile picture upload, trust score gauge, and badge display
Prompt summary: "Design a user account page showing: profile picture with upload button, display name, email, trust score as a circular gauge, report count, badge name with progress to next tier, default stop selector, and logout button."
Files changed: src/app/[lang]/account/page.tsx
Result: Modified
Review notes: Generated page layout. The trust score gauge SVG was pixel-based — converted to a responsive SVG viewBox. Added profile picture size validation (max 500KB) and Base64 conversion manually.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-04
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate admin panel UI with trust score and role management tabs
Prompt summary: "Create an admin panel with three tabs: Trust Score (search user, increment/decrement/set score, increment report count), Role Management (set user role: student/admin/driver/null), and Batch Metrics (pre-set combinations). Show status messages on action completion."
Files changed: src/app/[lang]/admin/page.tsx
Result: Modified
Review notes: Tab layout was good. Added role-gating (redirect non-admins to home) and error handling manually. The batch metrics combinations were adjusted to match our specific trust score business rules.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-05
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Scaffold project, configure Next.js 16 with Tailwind v4, set up Firebase, create middleware structure
Prompt summary: "Initialize a Next.js 16 project with TypeScript strict mode, Tailwind CSS v4, Firebase 12, and folder structure for App Router with [lang] dynamic segment. Set up ESLint flat config with Next.js presets."
Files changed: bandersnatch_app/ (entire scaffold), package.json, next.config.ts, tsconfig.json, postcss.config.mjs, eslint.config.mjs, src/app/globals.css, src/app/[lang]/layout.tsx, src/app/[lang]/template.tsx, src/middleware.ts
Result: Modified
Review notes: Initial structure was correct. Had to update Tailwind v4 configuration — the generated postcss.config used an older Tailwind v3 plugin format. Updated to use @tailwindcss/postcss plugin. ESLint flat config used deprecated rules; removed them.
Reviewer: AI Self-Log

---

Date: 2026-05-06
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement route data definitions for Bus #3 with GPS coordinates
Prompt summary: "Define the Route #3 bus stops in Kutaisi as TypeScript arrays with GPS coordinates. Two directions: toStation (Colchis Fountain → Rioni Railway Station, 14 stops) and toCityCentre (Railway Station → Colchis Fountain, 12 stops). Include BusStop interface with id, name, lat, lng."
Files changed: src/data/route3.ts
Result: Modified
Review notes: Generated the data file with correct coordinates. Had to verify the stop order matched the actual bus route — found that toCityCentre direction had 2 fewer stops (stops 13/14 from toStation don't have return equivalents). Removed duplicate entries.
Reviewer: Besik Meskhia

---

Date: 2026-05-07
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate navigation components (TopNav, BottomNav)
Prompt summary: "Create a responsive top navigation bar with logo, nav links (Home, Live Map, Schedule), dark mode toggle, language toggle (EN/KA), account icon. Also create a mobile bottom navigation bar with Home, Live Map, Schedule, Feedback, and Admin links with active state indicators."
Files changed: src/components/TopNav.tsx, src/components/BottomNav.tsx
Result: Modified
Review notes: Good component structure. Added admin link visibility gating (only shown for admin role) and locale-aware navigation paths. BottomNav needed layoutId for smooth indicator animation — added framer-motion shared layout animations manually.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-07
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate onboarding wizard with 6 steps
Prompt summary: "Create a 6-step onboarding wizard: Welcome → Location Permission → Primary Stop Selection → Features Overview → Notifications Permission → Complete. Include skip button, progress bar, and back/next navigation."
Files changed: src/app/[lang]/onboarding/page.tsx
Result: Modified
Review notes: Generated the multi-step UI structure. Added localStorage fallback for anonymous users and Firestore profile write for logged-in users manually. Steps reordered to put location permission earlier in the flow.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-08
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate feedback/crowding report page
Prompt summary: "Create a crowding feedback page with three large buttons: Empty (smiling face), Normal (neutral face), Packed (worried face). On selection, submit to Firestore and show success state with auto-redirect after 2 seconds."
Files changed: src/app/[lang]/feedback/page.tsx
Result: Accepted
Review notes: Simple page. Note: Firestore write target (bus_data/current_status) may be blocked by security rules — see risk R1.
Reviewer: Besik Meskhia

---

Date: 2026-05-08
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement LiveMap component with Leaflet, OSRM route polylines, peer location markers, simulated bus animations
Prompt summary: "Create a full-screen Leaflet map component with: (1) two route polylines from OSRM API, (2) simulated bus markers animated along routes with requestAnimationFrame and lerp, (3) real-time peer location markers from Firestore onSnapshot, (4) stop markers from route data, (5) user location, (6) dark/light theme support for tiles. Dynamic import with SSR disabled."
Files changed: src/components/LiveMap.tsx, src/app/[lang]/live-map/page.tsx
Result: Modified
Review notes: Large complex component (~200+ lines). OSRM fetch URL format required correction (polyline geometry param). Peer location markers initially had no heading arrows — added leaflet-rotatedmarker plugin. Bus animation timing used a hardcoded 30-second loop; adjusted to match real timetable frequency. Added cleanup for onSnapshot listener on unmount.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-09
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate alert banner component with severity-based theming
Prompt summary: "Create a dismissible alert banner that reads from Firestore bus_data/alert via onSnapshot. Support three severity levels: info (blue), warning (yellow), critical (red). Show message in current locale. Add close button."
Files changed: src/components/AlertBanner.tsx
Result: Modified
Review notes: Good component. The severity color mapping was hardcoded to specific Tailwind shades — updated to use theme-aware colors for dark mode compatibility. Added expiresAt check to auto-dismiss expired alerts.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-09
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement i18n dictionary with English and Georgian translations
Prompt summary: "Create a dictionary file with full English and Georgian translations for: navigation, home page, routes/schedule, feedback, trust/badges, common UI, on-bus state, notifications, onboarding, ride history, peer/location sharing, and trip details. Use nested objects with EN and KA keys."
Files changed: src/i18n/dictionaries.ts
Result: Modified
Review notes: Generated comprehensive dictionary (~370 lines). Verified Georgian characters render correctly. Some translations needed native speaker review — flagged for Nikoloz Modebadze (Discovery Lead) to verify. Added useDictionary hook to extract locale from pathname.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-10
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement custom ThemeProvider for dark/light/system mode
Prompt summary: "Create a ThemeProvider that: (1) reads theme preference from localStorage, (2) checks prefers-color-scheme media query, (3) toggles dark class on html element, (4) listens for system preference changes, (5) includes an inline script to prevent FOUC."
Files changed: src/components/ThemeProvider.tsx
Result: Accepted
Review notes: Implementation was clean and matched the custom approach decided after rejecting next-themes. Inline script correctly placed in template element.
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-10
Story: S1-00 — Core infrastructure
Tool: GitHub Copilot
Task: Write loading skeleton components (Box, Circle, Text, Card, Map, TripDetails, Account)
Prompt summary: N/A (ambient completion)
Files changed: src/components/Skeleton.tsx
Result: Modified
Review notes: Generated skeleton components. Added pulse animation using Tailwind's animate-pulse. Added Map and TripDetails skeletons manually since they had specific layout requirements.
Reviewer: Besik Meskhia

---

Date: 2026-05-11
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate ride history page with grouped ride display
Prompt summary: "Create a ride history page that queries bus_reports by userId, groups them into rides (boarding + disembark pairs), and displays expandable cards with ride duration, stops, and individual report details."
Files changed: src/app/[lang]/ride-history/page.tsx
Result: Modified
Review notes: Good page structure. The grouping logic for converting sequential bus_reports into rides was partially correct — had to fix edge case where a boarding report has no corresponding disembark (user is still on bus). Added auth guard manually.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-11
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate route schedule page with RouteMap timeline component
Prompt summary: "Create a route schedule page showing operating hours (07:30-22:00), frequency (every 30 min), and an interactive timeline of stops for both directions with travel times between stops."
Files changed: src/app/[lang]/routes/page.tsx, src/components/RouteMap.tsx
Result: Modified
Review notes: Timeline component was generated. Added direction toggle and travel time labels manually. Adjusted stop list to use the correct stop names from route3.ts instead of generic labels.
Reviewer: Besik Meskhia

---

Date: 2026-05-11
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement email verification page with polling and resend with cooldown
Prompt summary: "Create a verify-email page that: (1) polls user.emailVerified every 3 seconds, (2) shows verification status, (3) provides a resend button with 60-second cooldown, (4) redirects to home on verification. Also create the useEmailVerification hook separately."
Files changed: src/app/[lang]/verify-email/page.tsx, src/hooks/useEmailVerification.ts
Result: Modified
Review notes: Good implementation. Fixed a bug where the polling interval continued after component unmount — added cleanup in useEffect return. Cooldown timer reset logic was initially incorrect; fixed to respect 60s from last send time.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-11
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement notification hook with FCM token management
Prompt summary: "Create a useNotifications hook that: (1) requests notification permission, (2) gets FCM token via getToken(), (3) persists token to users/{uid}/fcmTokens/{tokenId}, (4) handles foreground messages via onMessage, (5) provides unsubscribe function that deletes token and Firestore doc."
Files changed: src/hooks/useNotifications.ts
Result: Modified
Review notes: FCM integration was correct. Added browser support detection (isSupported() check) to prevent errors on desktop Chrome. Added preference update function. Note: VAPID key in .env.local is currently a placeholder — must be set before FCM works in production.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-11
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Write custom service worker with tile caching and push notification handling
Prompt summary: "Create a service worker with: (1) static cache (bandersnatch-v1) for app shell, (2) tile cache (bandersnatch-tiles-v1) with 500-entry LRU for map tiles from openstreetmap.org, cartocdn.com, thunderforest.com, stadiamaps.com, (3) push event listener, (4) notification click handler that focuses existing window or opens new tab."
Files changed: public/sw.js
Result: Modified
Review notes: Cache-first strategy for tiles and network-first for static assets were correctly implemented. LRU eviction for tile cache uses a simple array shift — fine for MVP but may cause performance issues with many tiles. Added error handling for failed tile fetches (returns 503).
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-12
Story: S1-00 — Core infrastructure
Tool: Claude Code
Task: Implement trip details page with boarding, disembark, location sharing, and reporting actions
Prompt summary: "Create a trip details page that displays: current stop and destination ETA, board/disembark toggle button, Not Here / Bus Is Here buttons, crowding report (Seats/Standing/Full), upcoming stops timeline, location sharing toggle, and Split a Ride promo section. Use the BusStateContext for all actions."
Files changed: src/app/[lang]/trip-details/page.tsx
Result: Modified
Review notes: Generated the page layout and action buttons. Had to manually wire all BusStateContext actions (boardBus, disembark, reportNotHere, reportBusIsHere, reportCrowding). Added query param parsing for currentStop and destination from home page navigation.
Reviewer: Besik Meskhia

---

Date: 2026-05-12
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate ReportButton floating component with modal
Prompt summary: "Create a floating Report Issue button that opens a modal with: bus selector dropdown, reason text input, and submit button. On submit, write to Firestore alerts collection with busId, reason, userId, and timestamp."
Files changed: src/components/ReportButton.tsx
Result: Modified
Review notes: Modal UI was good. Added role-gating for alert visibility and status tracking in the alerts document. Added character count limit for reason field (200 chars).
Reviewer: Giorgi Mikaberidze

---

Date: 2026-05-12
Story: S1-00 — Core infrastructure
Tool: GitHub Copilot
Task: Write Firestore security rules
Prompt summary: N/A (ambient completion — rules filled in as context)
Files changed: firestore.rules
Result: Modified
Review notes: Generated initial rules structure. Added peer_locations public read rule and users/{userId}/public public read rule manually. Note: the current catch-all deny on bus_data/{document=**} may block feedback page writes — see risk R1 in risk register.
Reviewer: Nikoloz Kvirikashvili

---

Date: 2026-05-13
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate onboarding wizard location permission step
Prompt summary: "Create a location permission request screen with an illustration, explanation text (why we need location for bus stop detection), and Allow / Skip buttons."
Files changed: src/app/[lang]/onboarding/page.tsx
Result: Accepted
Review notes: Permission request UI was clear. Added iOS-specific permission prompt handling.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-13
Story: S1-00 — Core infrastructure
Tool: Google Stitch
Task: Generate account page trust score gauge SVG
Prompt summary: "Design an SVG circular gauge showing trust score from 0-100 with color zones: red (0-30), yellow (30-70), green (70-100). Display the current score as a large number in the center with 'Trust Score' label below."
Files changed: src/app/[lang]/account/page.tsx
Result: Modified
Review notes: SVG gauge was generated. The arc calculation used an incorrect stroke-dashoffset formula — fixed the SVG circle circumference math. Added score animation on page load.
Reviewer: Nikoloz Modebadze

---

Date: 2026-05-13
Story: (Documentation) — System Design Document
Tool: Claude Code
Task: Write system design document covering component architecture, request lifecycles, data model, AI governance
Prompt summary: "Write a system design document for the Bandersnatch Bus #3 Tracker app. Cover: system overview with Sprint 1 boundary, component architecture with provider chain, 5 request lifecycles (signup, status check, boarding, live map, disembark), data model with all Firestore collections, route data, gamification system, AI touchpoints with review process, and deployment infrastructure."
Files changed: 02-design/system-design.md
Result: Accepted
Review notes: Document generated from architecture analysis of the codebase. All sections align with the implemented code. AI governance section matches the process map.
Reviewer: Team Bandersnatch

---

Date: 2026-05-13
Story: (Documentation) — Tech Stack Selection
Tool: Claude Code
Task: Write tech stack document covering per-layer selection, justifications, and rejected alternatives
Prompt summary: "Write a tech stack selection document covering all technology layers in the Bandersnatch app. For each technology: explain why it was chosen (product fit and team fit) and what alternatives were considered and rejected with specific reasons. Cover: Next.js 16, TypeScript, Tailwind v4, Headless UI, Firebase Auth, Firestore, Leaflet/OSRM, Framer Motion, Lucide, FCM, custom i18n, custom ThemeProvider, GA4, Vercel, and AI tools."
Files changed: 02-design/tech-stack.md
Result: Accepted
Review notes: Document generated from the actual dependency decisions made during implementation. Rejected alternative justifications reflect real team discussions.
Reviewer: Team Bandersnatch

---

Date: 2026-05-13
Story: (Documentation) — Architecture Diagram
Tool: Claude Code
Task: Write architecture diagram using Mermaid syntax covering system architecture, data flows, and security boundaries
Prompt summary: "Create a Mermaid architecture diagram for the Bandersnatch app showing: client tier (Next.js pages, components, context providers, hooks), data tier (all Firestore collections), external services (Firebase Auth, FCM, OSRM, OSM tiles, GA4), and infrastructure (Vercel, Service Worker). Include labeled arrows showing data flow direction. Add sequence diagrams for signup, boarding, and status check flows. Add security boundary diagram."
Files changed: 02-design/architecture-diagram.md
Result: Accepted
Review notes: Mermaid syntax verified. Sequence diagrams match the actual code flow. Security boundary correctly shows public/authenticated/admin access levels.
Reviewer: Team Bandersnatch

---

Date: 2026-05-13
Story: (Documentation) — Risk Register
Tool: Claude Code
Task: Write risk register identifying technical risks with mitigations and ownership
Prompt summary: "Write a risk register for the Bandersnatch app. Identify concrete technical risks based on codebase analysis. Each risk must have: description, type, likelihood/impact scoring, detection method, mitigation plan, owner assignment, and fallback. Include a risk matrix and sprint burndown plan. Cover: Firestore rules, simulated data trust, write limits, OSRM dependency, Base64 storage, tile cache, i18n gaps, localStorage persistence, Vercel cold starts, admin panel security."
Files changed: 02-design/risk-register.md
Result: Accepted
Review notes: All 10 risks are real issues identified from codebase analysis. Risk R1 (Firestore rules blocking feedback) is a confirmed bug — will be fixed immediately. Risk scoring reviewed by team.
Reviewer: Team Bandersnatch

---

Date: 2026-05-13
Story: (Documentation) — Experiment Plan
Tool: Claude Code
Task: Write experiment plan with hypotheses, thresholds, and launch path
Prompt summary: "Write an experiment plan for the Bandersnatch app with 3 experiments: (1) Trust Verification — testing if CONFIRMED status reduces user departure buffer, (2) Crowding Utility — testing if users re-query after seeing high crowding, (3) Referral Validation — testing invite rates. Each experiment needs: specific hypothesis, pre-registered numeric success/failure thresholds, method justification (cheapest credible test), step-by-step plan, launch path with dates and owners, and limitations section."
Files changed: 02-design/experiment-plan.md
Result: Accepted
Review notes: Experiment 1 launch path uses real distribution channels (Telegram groups, bus stop posters). Thresholds defined before launch. Limitations honestly addressed.
Reviewer: Team Bandersnatch

---

## Summary

| Tool | Total Entries |
|---|---|
| Claude Code | 18 |
| Google Stitch | 14 |
| GitHub Copilot | 4 |
| **Total** | **36** |

---

*AI Usage Log | Bandersnatch | CS-PD-2026 | Spring 2026*
