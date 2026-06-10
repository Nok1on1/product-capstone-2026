# Bandersnatch

**Honest Bus #3 status before KIU students leave for the stop.**

Bandersnatch is a mobile-first web app for KIU students who rely on municipal Bus #3. It helps commuters make a pre-departure decision using clearer status, route context, crowding signals, and peer-powered reports.

**Live demo:** https://product-capstone-2026.vercel.app/en  
**Demo video:** [Planned video script and upload slot](09-final/demo-video.md)  
**License:** MIT, see [LICENSE](LICENSE)

---

## Problem

KIU students who commute via Bus #3 lose an average of 5-12 hours per week to excessive time buffers because the official tracking tools show misleading information: countdowns reset, freeze, or display buses that never arrive. Discovery interviews also documented 6-10 GEL emergency taxi spend, missed quizzes, GPA harm, sleep disruption, and overcrowding stress.

## Solution

Bandersnatch gives students an honest mobile status check before they leave. A commuter selects their stop, checks the current Bus #3 status, sees confidence context, and can use route, crowding, and reporting surfaces to decide whether to leave, wait, or choose a fallback.

## Team

| Name | Role | GitHub |
|------|------|--------|
| Nikoloz Kvirikashili | Program Lead | [RonchegLemoncheg](https://github.com/RonchegLemoncheg) |
| Nikoloz Modebadze | Discovery Lead | [NW0RK](https://github.com/NW0RK) |
| Giorgi Mikaberidze | Tech Lead | [Nok1on1](https://github.com/Nok1on1) |
| Besik Meskhia | Flexible | [Besika40k](https://github.com/Besika40k) |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS v4, Headless UI, Lucide React, Framer Motion |
| Auth and data | Firebase Auth, Firestore, Firebase Cloud Messaging |
| Maps | Leaflet, React-Leaflet, OpenStreetMap, OSRM |
| Analytics | Firebase Analytics / GA4 event schema |
| Deployment | Vercel |

See [03-build/architecture/tech-stack.md](03-build/architecture/tech-stack.md) for the full stack rationale.

## Repository Structure

| Directory | Contents |
|-----------|----------|
| `00-foundation/` | Team contract, problem statements, ICP |
| `01-discovery/` | Interview scripts, logs, outreach, synthesis |
| `02-design/` | High-fidelity prototype and usability findings |
| `03-build/` | Architecture, analytics, experiments, reliability, roadmap |
| `04-gtm/` | Growth strategy, traction, unit economics, financial model |
| `05-fundraising/` | Lab 12 pitch deck, one-pager, feedback form |
| `06-strategy/` | Competitive analysis, ecosystem map, moat statement |
| `07-operations/` | Demo Day operating checklist and Q&A prep |
| `08-legal/` | Privacy notice and legal/privacy artifacts |
| `09-final/` | Demo video plan, case study, rubric audit |
| `bandersnatch_app/` | Deployed Next.js application source |
| `docs/` | AI usage log and standup log |

## Setup

### Prerequisites

- Node.js 20+
- npm
- Firebase project values for local development

### Install

```bash
npm run setup
```

This installs dependencies inside `bandersnatch_app/` and runs the production build.

### Environment

```bash
cp bandersnatch_app/.env.example bandersnatch_app/.env.local
```

Fill the Firebase values in `bandersnatch_app/.env.local`.

### Run Locally

```bash
npm run dev
```

The app runs from the nested Next.js project. You can also run commands directly:

```bash
npm --prefix bandersnatch_app run dev
npm --prefix bandersnatch_app run build
npm --prefix bandersnatch_app run lint
```

## Architecture Overview

The app is a Next.js mobile web application deployed on Vercel. Firebase Auth manages accounts and email verification. Firestore stores user profiles, reports, alerts, crowding state, and peer locations. The frontend uses a provider chain for theme, auth, and bus state, while route and map surfaces use Leaflet with OpenStreetMap/OSRM.

Read more:

- [System design](03-build/architecture/system-design.md)
- [Architecture diagram](03-build/architecture/architecture-diagram.md)
- [Risk register](03-build/architecture/risk-register.md)
- [Event schema](03-build/analytics/event-schema.md)

## Key Deliverables

| Artifact | Link |
|----------|------|
| Live application | https://product-capstone-2026.vercel.app/en |
| Demo video plan | [09-final/demo-video.md](09-final/demo-video.md) |
| Case study | [09-final/case-study.md](09-final/case-study.md) |
| Pitch deck | [05-fundraising/pitch-deck.pdf](05-fundraising/pitch-deck.pdf) |
| One-pager | [05-fundraising/one-pager.pdf](05-fundraising/one-pager.pdf) |
| Financial model | [04-gtm/financials/12-month-model.xlsx](04-gtm/financials/12-month-model.xlsx) |
| Traction evidence | [04-gtm/traction/](04-gtm/traction/) |
| Rubric audit | [09-final/checkpoint-4-rubric-audit.md](09-final/checkpoint-4-rubric-audit.md) |

## Troubleshooting

**Build fails because Firebase environment variables are missing.**  
Copy `bandersnatch_app/.env.example` to `bandersnatch_app/.env.local` and fill the `NEXT_PUBLIC_FIREBASE_*` values.

**The app runs locally but auth or Firestore calls fail.**  
Check that the Firebase project allows the local development origin and that Firestore rules match the expected collections in [system-design.md](03-build/architecture/system-design.md).

**Analytics numbers appear inconsistent.**  
Early Firebase event counts undercount signups because event logging was fixed after initial rapid testing. See [experiment results](03-build/experiments/experiment-results.md) and [waitlist signups](04-gtm/traction/waitlist-signups.md).

**Map tiles or route lines do not load.**  
Confirm network access and check the Leaflet/OSRM configuration in the app. The product can still demonstrate the core status flow without map tiles.

## Status

MVP deployed. Lab 12 fundraising and final-submission materials are integrated. The remaining human-owned task is replacing the pending demo video slot with the final uploaded video link.
