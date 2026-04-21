# High-Fidelity Prototype: Stitch

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Tool:** Google Stitch (https://stitch.withgoogle.com)
**Created:** April 21, 2026
**Status:** Draft (Lab 5) / Final (by April 23)

---

## Prototype Link

**Stitch shareable link:**
[Paste your Stitch shareable link here after creating in Lab 5]

**Tested in incognito window:** ☐ Yes ☐ No (must be Yes before submission)

---

## What This Prototype Covers

**Core user flow prototyped:**
User opens the app, selects their bus stop, receives a confirmed bus arrival status, and makes a departure decision based on reliable information.

**Screens included:**

| Screen | Purpose | Activation Event Fired |
|--------|---------|----------------------|
| Home/Landing Screen | User opens app, sees welcome and bus stop selector | None |
| Bus Stop Selection | User selects their bus stop (e.g., KIU Main Gate) | None |
| Status Display | User sees confirmed bus arrival status | `bus_status_confirmed` (activation) |
| Departure Decision | User confirms when to leave based on info | None |

**Activation moment screen:** Status Display Screen
**What the user does at activation:** User receives "CONFIRMED" bus status — the moment where they trust the information enough to make a commute decision.
**NSM connection:** Each confirmed status displayed increments the weekly reliable arrival confirmations NSM.

---

## Stitch Brief Used

```
Product name: Bus #3 Real-Time Tracker (Bandersnatch)

Primary user: KIU university students who commute via Bus #3 and need reliable, honest real-time bus arrival information to eliminate fear-based early departure.

Most important flow: User opens app → selects bus stop → receives confirmed bus status → makes informed departure decision

Screens required:
1. Home screen with bus stop selector
2. Loading/status query screen
3. Confirmed status display screen
4. Departure confirmation screen

Activation moment: User sees "CONFIRMED" status for their bus — they can trust the information to leave on time.

Visual style: Clean, minimal, blue and white colour scheme. Clear typography. High contrast for outdoor readability.
```

---

## Key Prompts Used

**Initial prompt:**
"Build a mobile-first web app called Bandersnatch. The primary user is a KIU university student who needs to find reliable bus arrival information for Bus #3. Screen 1: a home screen with a bus stop selector dropdown (options: KIU Main Gate, Kutaisi Central, Terjola, Samtredia, Khoni) and a 'Check Status' button. Screen 2: a loading state showing 'Querying bus status...' with a spinner. Screen 3: a status display showing the bus line, estimated arrival time in minutes, a 'CONFIRMED' badge (green) or 'ESTIMATED' badge (yellow), and crowding level indicator. Screen 4: a departure confirmation showing 'Leave in X minutes?' with a 'Yes, I'm leaving now' button. Use a clean, minimal design with a blue (#2563EB) and white colour scheme. High contrast for outdoor readability."

**Iteration prompts (if any):**
[To be added after Lab 5 iteration]

---

## Design Decisions

**Decision 1: CONFIRMED vs ESTIMATED badge system**
Implemented a clear visual distinction between confirmed (real-time) and estimated (timetable-based) status because interview evidence showed students specifically need to know when the information can be trusted. P04 said "I stopped using it after it told me the bus was two minutes away for thirty minutes straight."

**Decision 2: Crowding level indicator**
Added low/medium/high crowding indicators because multiple interviews (P07, P09) mentioned overcrowding as a significant pain point. Users want to know if they need to catch an earlier bus to avoid packed conditions.

**Decision 3: Simple departure confirmation**
Kept the departure decision minimal — just "Leave in X minutes?" — because the activation moment is receiving the confirmed information, not the decision itself. Users need to see the confidence level first.

---

## What Lab 6 Will Add

This prototype is the design blueprint. Lab 6 adds:

- Backend logic (user authentication, data storage)
- Event schema instrumentation (actual tracking code)
- Real data persistence (bus status queries, user sessions actually save)
- Vercel deployment (public URL for real user testing)

**Live app URL (completed after Lab 6):**
[Paste Vercel deployment URL here after Lab 6]

---

## Export (if available)

If Stitch offered a code export option, note it here:

**Export format:** HTML/CSS/JS
**Export file location in repo:** `02-design/prototypes/high-fidelity/stitch-export/`

---

*Stitch Prototype | Bandersnatch | CS-PD-2026 | Spring 2026*