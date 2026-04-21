# Sprint 1 Plan

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Sprint:** 1 of 4
**Dates:** April 24 to May 7 2026
**Product Owner:** Nikoloz Modebadze
**Scrum Master:** Nikoloz Kvirikashvili
**Version:** 1.0

---

## Sprint Goal

A user can sign up with their email, select a bus stop, and receive a confirmed bus arrival status — end to end in a deployed application.

---

## Sprint Ceremonies

| Ceremony | When | Where | Who Facilitates |
|----------|------|-------|----------------|
| Sprint Planning | Lab 8, Apr 24/25 | In person | Scrum Master |
| Daily Standup | 10:00 AM every weekday | GitHub Issues | Async -- each member posts |
| Sprint Review | Week 10, May 7 (Google Meet) | Google Meet | Product Owner |
| Retrospective | May 7 or 8 | In person | Scrum Master |

**Async standup format:**
```
Yesterday: [what I completed]
Today: [what I am working on]
Blocker: [anything stopping me -- or "none"]
AI note: [what AI generated yesterday and whether it was accepted/modified/discarded]
```

**Blocker escalation:** If a blocker is not resolved within 24 hours, the Scrum Master pings the team in Slack.

---

## Definition of Done

A story is Done when all of the following are true:

- [ ] Code reviewed by at least one other team member (not the original author)
- [ ] Pull request merged to `main` via GitHub PR -- no direct pushes to main
- [ ] Acceptance criteria confirmed as met by the Product Owner
- [ ] If AI-generated: code annotated with comments explaining the logic
- [ ] If AI-generated: entry added to `docs/ai-usage-log.md` (tool, task, files changed, review notes)
- [ ] Feature works in the deployed environment, not just locally
- [ ] No known bugs introduced into the main branch

---

## Calibration Anchors

Agree these before estimating any stories.

| Points | What It Looks Like for Our Team |
|--------|--------------------------------|
| 1 | A single, obvious change. One file. No logic complexity. Example: change a button label. |
| 3 | A clear feature with a defined path. Some edge cases. Example: add a form with validation. |
| 5 | A non-trivial feature requiring multiple components or a third-party integration. |
| 8 | A complex feature with significant uncertainty. Consider splitting before committing. |

---

## Sprint 1 Backlog

### Story S1-01

**User Story:**
As a KIU student, I want to sign up with my email and select my primary bus stop so that I always see accurate information for my commute.

**Interview Evidence:**
Source: Interview P01 (student, Kutaisi, April 2026) -- "I need to know which stop I am waiting at so I don't look at the wrong information."

**Story Points:** 3
**Assignee:** Nikoloz Kvirikashvili
**AI Tool:** Google Stitch
**AI Tool Rationale:** Fastest path from AC to working signup form UI with validation.

**Acceptance Criteria:**

```
AC1:
Given a new user,
When they enter a valid email and password (min 8 chars) and select a bus stop,
Then their account is created and they are logged in automatically.

AC2:
Given a new user with an invalid email,
When they submit the signup form,
Then an error message displays and they are not logged in.

AC3:
Given a user who just signed up,
When they log out and log back in with the same credentials,
Then they see their selected bus stop pre-filled.
```

**Notes:** Use Firebase Auth for authentication. Store bus stop preference in user profile.

---

### Story S1-02

**User Story:**
As a user, I want to see a bus stop selector on the home screen so that I can quickly switch between my frequent stops.

**Interview Evidence:**
Source: Interview P02 (student, Kutaisi, April 2026) -- "My stop is KIU Main Gate but sometimes I go to the city center."

**Story Points:** 3
**Assignee:** Nikoloz Modebadze
**AI Tool:** Google Stitch
**AI Tool Rationale:** Dropdown selector UI is straightforward — rapid generation.

**Acceptance Criteria:**

```
AC1:
Given a logged-in user on the home screen,
When they see the bus stop dropdown,
Then their currently selected bus stop is pre-selected by default.

AC2:
Given a user,
When they change the bus stop in the dropdown,
Then the new selection is saved immediately.

AC3:
Given a user,
When they view the list of available stops in the dropdown,
Then they see: KIU Main Gate, Kutaisi Central, Terjola, Samtredia, Khoni.
```

**Notes:** Pre-populate with the bus stops identified in interviews.

---

### Story S1-03

**User Story:**
As a user, I want to see a loading indicator when I query bus status so that I know the app is working.

**Interview Evidence:**
Source: Interview P08 (student, Kutaisi, April 2026) -- "I waited for an hour. I didn't know if it was working or not."

**Story Points:** 3
**Assignee:** Giorgi Mikaberidze
**AI Tool:** Google Stitch
**AI Tool Rationale:** Simple loading spinner UI — fast to generate.

**Acceptance Criteria:**

```
AC1:
Given a user who clicks "Check Status",
When the app is fetching data,
Then a loading spinner is displayed within 200ms.

AC2:
Given a user,
When the status query takes longer than 3 seconds,
Then a "Still checking..." message appears.

AC3:
Given a user,
When the status query fails,
Then an error message displays with a "Try Again" button.
```

**Notes:** Handle timeout gracefully. Use mock data for MVP.

---

### Story S1-04

**User Story:**
As a user, I want to see a CONFIRMED or ESTIMATED badge on the bus status so that I know whether to trust the information.

**Interview Evidence:**
Source: Interview P06 (student, Kutaisi, April 2026) -- "I just need it to be honest. Not 'three minutes' when you mean twenty."

**Story Points:** 5
**Assignee:** Besik Meskhia
**AI Tool:** Google Stitch
**AI Tool Rationale:** Badge UI with color coding — design-heavy story best suited for visual tool.

**Acceptance Criteria:**

```
AC1:
Given a user with confirmed real-time data,
When the status query returns,
Then a green "CONFIRMED" badge is displayed.

AC2:
Given a user with estimated timetable data,
When the status query returns,
Then a yellow "ESTIMATED" badge is displayed.

AC3:
Given a user,
When the status is displayed,
Then the estimated arrival time in minutes is clearly shown.
```

**Notes:** This is the core differentiator. Mock data returns "CONFIRMED" for MVP.

---

### Story S1-05

**User Story:**
As a user, I want to see crowding level so that I can decide whether to catch an earlier bus.

**Interview Evidence:**
Source: Interview P07 (student, Kutaisi, April 2026) -- "I physically could not breathe. There were so many people packed in there."

**Story Points:** 3
**Assignee:** Nikoloz Kvirikashvili
**AI Tool:** Google Stitch
**AI Tool Rationale:** Visual indicator UI — fast generation with design tool.

**Acceptance Criteria:**

```
AC1:
Given a user viewing status results,
When the crowding level is available,
Then a crowd indicator shows: Low (green), Medium (yellow), or High (red).

AC2:
Given a user,
When no crowding data is available,
Then no indicator is shown (optional field).
```

**Notes:** Mock data for MVP crowding levels.

---

### Story S1-06

**User Story:**
As a team, we need the app deployed to Vercel so that real users can test it.

**Interview Evidence:**
Source: Lab 5 requirement -- must have deployed URL for user testing.

**Story Points:** 3
**Assignee:** Giorgi Mikaberidze
**AI Tool:** Claude Code
**AI Tool Rationale:** Vercel deployment requires backend configuration and environment setup — complex multi-file task best suited for full codebase context.

**Acceptance Criteria:**

```
AC1:
Given a merged PR to main,
When the CI completes,
Then the app is deployed to Vercel automatically.

AC2:
Given a user,
When they visit the Vercel URL,
Then they see the deployed app working.

AC3:
Given a user,
When they perform the core flow in production,
Then events are tracked in GA4.
```

**Notes:** Configure Vercel with environment variables. Connect GA4.

---

## Sprint 1 Summary

| Story ID | Summary | Points | Assignee | AI Tool | Status |
|----------|---------|--------|----------|---------|--------|
| S1-01 | User sign-up with email/password | 3 | Nikoloz Kvirikashvili | Stitch | Not started |
| S1-02 | Bus stop selector on home screen | 3 | Nikoloz Modebadze | Stitch | Not started |
| S1-03 | Status query and loading UI | 3 | Giorgi Mikaberidze | Stitch | Not started |
| S1-04 | CONFIRMED/ESTIMATED status display | 5 | Besik Meskhia | Stitch | Not started |
| S1-05 | Crowding level indicator | 3 | Nikoloz Kvirikashvili | Stitch | Not started |
| S1-06 | Deployment to Vercel | 3 | Giorgi Mikaberidze | Claude Code | Not started |
| **Total** | | **21** | | | |

**Capacity check:** 21 points committed out of approximately 52 maximum (40% -- target 60% or below)

---

## Sprint Review Criteria

At Sprint Review (May 7, Google Meet), the team will demo:

1. User can sign up and log in
2. User can select a bus stop
3. User can query status and see CONFIRMED/ESTIMATED badge
4. User can see crowding level
5. App is live on Vercel URL

The demo must be live. No screenshots. No pre-recorded video. The application runs in front of the reviewer.

---

## AI Usage Log Reference

All AI-assisted work in Sprint 1 must be logged in `docs/ai-usage-log.md`.

Entry format:
```
Date: [YYYY-MM-DD]
Story: [Story ID and summary]
Tool: [Tool name]
Task: [What AI was asked to do]
Files changed: [List of files]
Accepted / Modified / Discarded: [Which]
Review notes: [What was checked, what was changed from the AI output]
Reviewer: [Name]
```

---

## Change Log

| Date | Changes | Author |
|------|---------|--------|
| April 21, 2026 | Sprint 1 plan created | Team Bandersnatch |

---

*Sprint 1 Plan | Bandersnatch | CS-PD-2026 | Spring 2026*