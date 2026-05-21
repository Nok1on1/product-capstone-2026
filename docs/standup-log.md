# Standup Log — Sprint 1

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Sprint:** 1 of 4 (April 24 – May 7, 2026)
**Format:** Async daily standup on GitHub Issues — 10:00 AM every weekday

---

## Standup 1: April 25, 2026 (Friday, Sprint 1 Day 2)

**Team present:** Nikoloz Kvirikashvili, Nikoloz Modebadze, Giorgi Mikaberidze, Besik Meskhia

**Yesterday (April 24) — Sprint Planning & kickoff:**
- Team completed Sprint Planning (Lab 8 in person)
- Agreed on 21 story points across 6 stories
- AI tools assigned: Stitch for UI stories, Claude Code for deployment

**Today — First development day:**

| Member | Yesterday | Today | Blocker |
|--------|-----------|-------|---------|
| Nikoloz Kvirikashvili | Sprint Planning | S1-01: Generate signup page UI with email/password form, bus stop selector, and validation via Stitch | None |
| Nikoloz Modebadze | Sprint Planning | S1-02: Research Headless UI Listbox API for StopSelect component | None |
| Giorgi Mikaberidze | Sprint Planning | S1-03: Draft loading spinner and error state UI for status query via Stitch | None |
| Besik Meskhia | Sprint Planning | S1-04: Review badge color scheme options for CONFIRMED/ESTIMATED states | None |

**AI note:** Stitch used for S1-01 signup form generation (accepted with modifications). Claude Code queued for later stories requiring backend logic.

---

## Standup 2: April 29, 2026 (Tuesday, Sprint 1 Week 2)

**Team present:** Nikoloz Kvirikashvili, Nikoloz Modebadze, Giorgi Mikaberidze, Besik Meskhia

| Member | Yesterday | Today | Blocker |
|--------|-----------|-------|---------|
| Nikoloz Kvirikashvili | S1-01: Signup page UI merged. Login page via Stitch accepted. | S1-01: Integrate Firebase Auth — create AuthContext with onAuthStateChanged listener, Firestore profile sync | Waiting on Firebase config from Giorgi |
| Nikoloz Modebadze | S1-02: StopSelect component with search/filter merged (Claude Code, modified — fixed direction context bug) | S1-05: Crowding level indicator (Low/Medium/High) via Stitch | None |
| Giorgi Mikaberidze | S1-03: Loading states merged. S1-06: Vercel deployment configured (modified — fixed vercel.json format). Timetable utility functions written via Claude Code (accepted). | S1-03: Integrate timetable ETA with home page status display | None |
| Besik Meskhia | S1-04: CONFIRMED/ESTIMATED badges merged (modified — added WCAG AA contrast). S1-05: Crowding indicator via Stitch (accepted). | S1-04: Integrate timetable ETA with status display — wire CONFIRMED/ESTIMATED logic | None |

**AI note:** Stitch used for S1-03 loading UI, S1-04 badges, S1-05 crowding indicator. Claude Code used for S1-06 deployment config and timetable utilities. All outputs reviewed and accepted or modified before merge.

---

## Standup 3: May 5, 2026 (Tuesday, Sprint 1 Final Week)

**Team present:** Nikoloz Kvirikashvili, Nikoloz Modebadze, Giorgi Mikaberidze, Besik Meskhia

| Member | Yesterday | Today | Blocker |
|--------|-----------|-------|---------|
| Nikoloz Kvirikashvili | S1-01: AuthContext merged (modified — fixed race condition on signup). S1-05: Crowding indicator done. BusStateContext implemented with location sharing and reporting actions (modified — fixed interval cleanup). | S1-00: Email verification hook with polling, route guard logic for unverified users. UserProfile types via Copilot (accepted). | None |
| Nikoloz Modebadze | S1-00: Account page generated via Stitch (modified — responsive SVG trust gauge). Admin panel tab layout via Stitch (added role-gating). | S1-00: Verify Georgian translations in i18n dictionary, review dictionary completeness | None |
| Giorgi Mikaberidze | S1-17: Location utility functions (haversine, nearest stop, route proximity) via Claude Code (modified — added both direction scans). | S1-00: LiveMap component with Leaflet, OSRM route polylines, peer markers, bus animation | None |
| Besik Meskhia | S1-00: Trust score utilities via Copilot (accepted). | S1-00: Define Route #3 bus stops as TypeScript arrays with GPS coordinates via Claude Code (modified — verified stop order, removed duplicates) | None |

**AI note:** Claude Code used for BusStateContext, location utilities, LiveMap, and route data. Stitch used for account page and admin panel. Copilot used for types and trust utilities. All AI outputs reviewed by assigned reviewer before merging to main.

---

## Standup Format Reference

Per Sprint 1 Plan (`03-build/roadmap/sprint-1-plan.md`):
```
Yesterday: [what I completed]
Today: [what I am working on]
Blocker: [anything stopping me -- or "none"]
AI note: [what AI generated yesterday and whether it was accepted/modified/discarded]
```

---

_Standup Log | Bandersnatch | CS-PD-2026 | Spring 2026_
