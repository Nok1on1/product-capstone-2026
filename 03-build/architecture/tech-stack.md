# Tech Stack Selection

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 2.0

---

## 1. Decision Summary

For Sprint 1, the team is optimising for speed of delivery and demo reliability over architectural completeness. The single most important constraint is a 6-week sprint arc with a 4-person team, which means every layer of the stack must reduce setup overhead rather than add it. We chose Firebase as the backbone because a single project handles auth, real-time data, and push notifications without a separate API server — eliminating an entire layer of infrastructure to maintain. We are optimising for real-time reactivity (peer locations, alert banners, crowding status) because that is the core product promise, and Firestore's `onSnapshot` delivers this without polling logic. We are willing to defer real bus GPS integration, a production trust score algorithm, and a live CONFIRMED badge threshold in exchange for a working, deployable product that demonstrates the end-to-end flow. The team accepted Next.js and TypeScript as a baseline because prior familiarity means zero ramp-up cost on tooling that would otherwise consume sprint time.

---

## 2. Stack by Layer

| Layer | Chosen Technology | Justification | Alternatives Considered & Rejected |
|---|---|---|---|
| **Frontend Framework** | Next.js 16 (App Router) | File-based routing maps directly to our page structure. React Server Components allow the layout shell to be server-rendered while interactive features (auth, map) stay client-side. Middleware for locale detection is a built-in feature, not an add-on. Team has prior Next.js experience. | **Create React App** — rejected because it lacks SSR, file-based routing, and middleware. Would require extra libraries for routing and i18n. **Remix** — rejected because team has no Remix experience and the loader/action model adds complexity beyond what we need. |
| **Language** | TypeScript 5 | Strict mode catches null-reference errors at compile time. Type definitions for Firestore documents, route data, and user profiles prevent a class of runtime bugs that would be hard to debug on a phone screen. | **JavaScript** — rejected. Without types, the 4-person team would need more manual coordination on data shapes. TypeScript's `strict` mode paid for itself within the first week. |
| **Styling** | Tailwind CSS v4 | Utility-first approach keeps styles co-located with components — no context-switching to CSS files. v4's `@custom-variant dark` makes theme support a one-liner. Responsive design is expressed inline without media query fragments scattered across files. | **CSS Modules** — rejected because dark mode would require duplicated styles or CSS custom properties spread across modules. **Styled Components** — rejected because runtime CSS-in-JS adds bundle overhead and has no Tailwind-equivalent design system. |
| **UI Components** | Headless UI 2 | The `Listbox` component provides a fully accessible bus stop selector with keyboard navigation, ARIA attributes, and screen reader support out of the box. Unstyled — we apply Tailwind classes. | **Radix UI** — comparable but heavier dependency. **Material UI** — rejected because its opinionated design system conflicts with Tailwind and would add ~100KB of component CSS we would fight against. **shadcn/ui** — considered but rejected because the copy-paste model makes version upgrades manual. |
| **Auth** | Firebase Auth (email/password) | Serverless — no auth infrastructure to maintain. Email/password is the simplest path for MVP (no OAuth provider setup). `onAuthStateChanged` gives us real-time session reactivity with 3 lines of code. Built-in email verification removes a feature we would otherwise have to build. | **Auth0** — rejected because the free tier limits active users (7,000) and the setup is heavier than Firebase for email-only auth. **Clerk** — rejected because it requires a paid plan past 5,000 users. **Supabase Auth** — considered but rejected because we already chose Firestore as our database, and using two different BaaS providers would split our backend context. |
| **Database** | Firestore | Real-time document sync via `onSnapshot` is the key enabler for live peer locations and alert banners. Server-timestamps (`serverTimestamp()`) eliminate clock skew issues. Security rules are enforceable per document, letting us lock trust scores and roles to admin-only writes. Single Firebase project handles both auth and data. | **Supabase** — rejected because its real-time features require a Postgres replication setup with a Pro plan ($25/mo). **MongoDB Atlas** — rejected because it has no built-in real-time subscriptions and requires a separate API layer. **PostgreSQL (direct)** — rejected because we would need to build and maintain an API server, which is scope creep for a 4-person team with a 6-week sprint arc. |
| **Maps** | Leaflet + React-Leaflet + OSM tiles | Open source, no API key required for OSM tile usage. React-Leaflet provides declarative component wrappers (`MapContainer`, `TileLayer`, `Marker`, `Polyline`). The `leaflet-polylineoffset` plugin solves the visual overlap of two route directions. Works with our service worker's tile caching strategy for offline-capable maps. | **Google Maps API** — rejected because the free tier is $200/month credit which would be exhausted by a campus-sized user base. Requires an API key and billing account. **Mapbox** — rejected because the free tier limits to 50,000 map loads/month, and exceeding that requires a paid plan. **Azure Maps** — rejected because it offers no advantage over OSM for our use case and requires Azure subscription setup. |
| **Routing API** | OSRM (Open Source Routing Machine) | Returns road-following polylines for bus routes. Free public instance available — no API key. Accepts `geojson` output format that Leaflet consumes directly. | **Mapbox Directions API** — rejected because it requires a paid token for production use. **Google Directions API** — rejected for the same billing reason as Google Maps. |
| **Animations** | Framer Motion 12 | `AnimatePresence` + `motion.div` provide page transition animations that make the app feel native — a stated user need (the app needs to feel trustworthy, and smooth transitions contribute to that perception). The API is declarative and colocated with components. | **React Spring** — rejected because its imperative API adds boilerplate for simple enter/exit animations. **CSS animations** — rejected because managing shared animation variants across pages requires a global CSS file and class name coordination. **GSAP** — rejected because it is overkill for our animation surface (page transitions and icon toggles). |
| **Icons** | Lucide React | Tree-shakeable — only imported icons end up in the bundle. Consistent 24px stroke-based design. TypeScript support with named exports. | **Heroicons** — comparable but Tailwind ecosystem tie-in is a weak reason alone. **React Icons** — rejected because it bundles multiple icon sets and makes tree-shaking unreliable. **Custom SVGs** — rejected because maintaining a custom set for a 4-person team is wasteful when Lucide covers every icon we need. |
| **Push Notifications** | Firebase Cloud Messaging | Bundled with Firebase — no extra dependency. `getToken()` + `onMessage()` handle the full lifecycle. Integrates with our custom service worker's `push` event handler. | **OneSignal** — rejected because it adds a third-party dependency for a feature Firebase already provides. **Web Push API (direct)** — rejected because it requires a backend to manage subscriptions, which Firebase handles for us. |
| **Internationalization** | Custom middleware + dictionary | Middleware detects locale from the URL and redirects. A single `dictionaries.ts` file holds all translations (EN + KA). The `useDictionary` hook reads the pathname locale and returns the correct strings. Total implementation: ~20 lines of middleware + 370 lines of dictionary. | **next-intl** — rejected because for two languages with simple key-value translation, a full i18n library adds unnecessary abstraction. **react-i18next** — rejected because it requires provider wrapping and has a complex configuration surface. |
| **Theme** | Custom ThemeProvider | 60-line implementation that persists to localStorage, listens to `prefers-color-scheme`, and toggles a `dark` class on `<html>` — exactly matches Tailwind's dark mode strategy. An inline script prevents flash of unstyled theme. | **next-themes** — listed in `package.json` but rejected during implementation because the wrapper interfered with our Tailwind v4 `@custom-variant dark` setup. Building our own was simpler than debugging the mismatch. |
| **Analytics** | Google Analytics 4 | Free for web apps (500K events/month). Integrates with our event schema, which already defines 7 events with snake_case naming. Direct GA4 measurement protocol for server-side events. Implementation deferred to post-Sprint 1 but the choice is locked. | **Mixpanel** — rejected because the free tier limits to 20M events/month but requires SDK integration. **PostHog** — rejected because self-hosting adds operational overhead for a 6-week project. **Amplitude** — rejected because the free tier is 10M events/month but the SDK is heavier than GA4. |
| **Deployment** | Vercel | One-command deploy from GitHub. Automatic CI/CD on PR merge to `main`. Built-in environment variable management for Firebase secrets. Zero-config HTTPS and CDN. | **Netlify** — comparable but Next.js edge functions have tighter Vercel integration. **Firebase Hosting** — rejected because Cloud Functions for Next.js SSR requires a Blaze plan and manual configuration. **Railway** — rejected because the team has no experience with it and the free tier is more restrictive. |
| **AI Tool (UI prototyping)** | Google Stitch | Fastest path from acceptance criteria to working UI. The text-to-prototype pipeline produced our 4-screen prototype in one session. Stitch outputs functional React components, not static mockups — the prototype directly informed production code. | **v0.dev** — rejected because it requires a paid plan for exportable code. **Claude Artifacts** — used for some individual components but cannot produce multi-screen flows as quickly. **Figma → code plugins** — rejected because they generate CSS, not React components with state. |
| **AI Tool (complex logic)** | Claude Code | Full codebase context awareness lets it scaffold cross-cutting features (Firestore integration, trust utilities, auth flow) that span multiple files. Handles configuration (ESLint, TypeScript, PostCSS) without manual file hunting. | **Cursor** — comparable but Claude Code's project-level understanding is stronger for refactoring. **GitHub Copilot** — better for inline completion but lacks the context window for multi-file feature generation. **Google AI Studio** — better for prompt prototyping but not designed for codebase-wide edits. |
| **AI Tool (ambient completion)** | GitHub Copilot | Always-on inline suggestions for boilerplate (Firestore queries, type definitions, event handlers). No context switching — it completes the line you are typing. | **Tabnine** — comparable but Copilot's training data is larger and its TypeScript support is more accurate. **SuperMaven** — rejected because the team has existing Copilot licenses. |

---

## 3. Approved AI Tools for Sprint 1

| Tool | Approved use | Not for | Review rule | Owner |
|------|--------------|---------|-------------|-------|
| Stitch | UI scaffolding for signup, login, stop selector, and status display screens | Backend logic, auth policy, database design | Acceptance criteria checked item by item before merge | Nikoloz Kvirikashvili |
| Claude Code | Multi-file feature scaffolding (Firestore integration, trust utilities, auth flow), configuration, refactor, debug | Blind end-to-end generation without human reading | Human read every line, local test, then PR review | Giorgi Mikaberidze |
| AI Studio | Future AI feature experimentation only — not used in Sprint 1 runtime | General app coding in Sprint 1 | Prompts versioned; no output merged to main without review | Besik Meskhia |
| Copilot | Always-on inline completion for boilerplate (Firestore queries, type definitions, event handlers) | Architecture decisions, feature design, security-sensitive logic | Never accept a suggestion without reading it; reviewed again at PR | Whole team |

---

## 4. Deployment Target

- **Public deployment target:** Vercel production URL, auto-deployed on merge to `main`
- **Database region or environment:** Firestore on a single Firebase project; one shared environment for Sprint 1 (no staging/production split yet)
- **How local and production differ:** Local uses `.env.local` for all Firebase secrets; production reads the same variables from Vercel environment variable settings
- **What gets deployed first:** Auth flow (signup, login, email verification) plus the home page bus status check — the minimum path to demonstrate the core user request
- **What will stay local for now, if anything:** Seed scripts, the AI usage log, and any experimental Firestore rule drafts before they are reviewed and promoted

---

## 5. Rejected Architecture Paths

### Rejected Option 1
- **Option:** Next.js frontend with a separate Express backend API
- **Why it was attractive:** Cleaner separation of concerns; backend could be scaled or replaced independently
- **Why it was rejected now:** Two repos and two deployment targets add coordination overhead a 4-person team cannot absorb in a 6-week sprint. Next.js API routes handle our CRUD surface without a separate server.

### Rejected Option 2
- **Option:** Supabase for both auth and database (replacing Firebase entirely)
- **Why it was attractive:** Open-source, relational SQL model, good free tier, single BaaS provider
- **Why it was rejected now:** The team already had Firebase integrated in the prototype. Real-time subscriptions in Supabase require Postgres replication which is only available on the Pro plan ($25/mo). Firestore's `onSnapshot` delivers our core real-time requirement on the free tier with no additional setup.

---

## 6. Technical Debt We Are Accepting on Purpose

| Shortcut | Why accepted now | Risk created | When to revisit |
|----------|-----------------|-------------|-----------------|
| CONFIRMED badge always returns CONFIRMED regardless of data freshness | Implementing a real freshness threshold requires defining trust score weighting, which is post-Sprint 1 scope | Users see CONFIRMED even when the underlying data is stale — the exact problem the product was built to solve | Sprint 2 — gate badge on `updatedAt` within a defined window |
| Bus position on the live map is simulated, not a real GPS feed | Integrating a real vehicle tracker requires hardware access and driver coordination outside the team's control | The live map feels real in a demo but provides no operational value to actual students until a real feed is connected | Post-Sprint 1 when bus operator partnership is established |
| Single Firebase environment for both development and production | Splitting environments adds project setup overhead the team cannot absorb in Sprint 1 | A bad Firestore write during development could affect production data | Before any external pilot or public launch |
| Profile pictures stored as Base64 strings in Firestore documents | Avoids setting up Firebase Storage, which is a separate configuration surface | Large Base64 strings inflate document size and will hit Firestore's 1MB document size limit at scale | Sprint 2 — migrate to Firebase Storage with download URLs |
| No automated end-to-end test suite | Manual smoke testing after each merge is fast enough for a 4-person team in Sprint 1 | Regressions in auth or boarding flow may not be caught until demo | Before external pilot — add Playwright tests for the core booking flow |

---

## 7. Final Stack Lock

- **Frontend:** Next.js 16 App Router with TypeScript, Tailwind CSS v4, Framer Motion, and Headless UI, deployed on Vercel
- **Backend:** Next.js API routes in the same repository — no separate server
- **Database:** Firestore on a single Firebase project, using `onSnapshot` for all real-time features
- **Auth:** Firebase Auth with email/password and built-in email verification
- **Analytics:** Google Analytics 4 — choice locked, implementation deferred to post-Sprint 1
- **Hosting:** Vercel for the Next.js app; Firebase project for auth, Firestore, FCM, and the service worker tile cache

No TBD entries remain.

---

## Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  Next.js 16 App Router + Tailwind v4 + Framer Motion    │
│  Lucide Icons + Headless UI + Custom ThemeProvider       │
├─────────────────────────────────────────────────────────┤
│                    CLIENT LOGIC                          │
│  React 19 Server/Client Components  │  AuthContext       │
│  BusStateContext                     │  useUserLocation   │
│  useDictionary                       │  useNotifications  │
│  useEmailVerification                │                    │
├─────────────────────────────────────────────────────────┤
│                    SERVICES                              │
│  Firebase Auth  │  Firestore  │  FCM  │  OSRM API       │
│  Leaflet/OSM Tiles (TileCache SW)  │  GA4 (deferred)    │
├─────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                        │
│  Vercel (hosting + CI/CD)  │  Firebase Project          │
│  Custom Service Worker (PWA)  │  .env.local secrets     │
└─────────────────────────────────────────────────────────┘
```

---

## Why We Chose Each Layer: Product-Fit Logic

| Product Requirement | How the Stack Delivers |
|---|---|
| Real-time status updates | Firestore `onSnapshot` — push-based, no polling |
| Trustworthy information display | `useEmailVerification` ensures only verified users see full features; Firebase Auth provides the verified-user foundation |
| Live peer locations | `peer_locations` collection + 5-second writes + `onSnapshot` reads |
| Ride history from reports | `bus_reports` collection queries by `userId` with `orderBy("timestamp")` |
| Works offline | Service Worker caches static assets + map tiles (500-entry LRU) |
| Works on mobile browsers | Tailwind responsive utilities + PWA manifest (standalone display) |
| English + Georgian support | Middleware locale redirect + `dictionaries.ts` + `useDictionary` hook |
| Dark mode for night commuting | Custom `ThemeProvider` + `@custom-variant dark` in Tailwind |
| No API server to maintain | Firebase Auth + Firestore SDK communicates directly from the browser |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial tech stack selection | Team Bandersnatch |
| May 14, 2026 | 2.0 | Added Decision Summary, Approved AI Tools, Rejected Architecture Paths, Technical Debt, and Final Stack Lock sections; resolved analytics consistency | Team Bandersnatch |

---

*Tech Stack Selection | Bandersnatch | CS-PD-2026 | Spring 2026*