# Product Roadmap

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** April 21, 2026
**Version:** 1.0
**Sprint Arc:** April 24 to June 11 2026 (4 sprints, 8 weeks)

---

## MVP Scope

### What We Are Building

A mobile-first web application that provides KIU students with reliable, honest real-time bus arrival information for Bus #3. The product addresses the core problem identified in 12 interviews: students lose 5-12 hours per week to fear-based early departure because the existing tracking system provides misleading information. Our product delivers confirmed bus status information that students can trust to make informed commute decisions.

### North Star Metric

> Weekly reliable arrival confirmations received per active user per commute week

### In Scope (Sprints 1 to 4)

Features a user needs to reach the activation moment and return. Every item here must be buildable within the sprint arc.

| Feature | Sprint | Interview Evidence |
|---------|--------|--------------------|
| User sign-up with bus stop selection | Sprint 1 | Interview P01: "I need to know which stop I am waiting at" |
| Real-time bus status query | Sprint 1 | Interview P04: "I stopped using it after it told me the bus was two minutes away for thirty minutes straight" |
| CONFIRMED/ESTIMATED status display | Sprint 1 | Interview P06: "I just need it to be honest" |
| Crowding level indicator | Sprint 1 | Interview P07: "I physically could not breathe" |
| Departure time recommendation | Sprint 2 | Interview P03: "I wake up at least three hours before my lecture" |
| Push notification for status changes | Sprint 2 | Interview P08: "I waited for an hour" |
| Favorite stops saved | Sprint 2 | Interview P11: "I have to catch a marshrutka to get into Kutaisi" |
| Bus history/frequent route memory | Sprint 3 | Interview P10: "I've started leaving Terjola way too early" |
| Share status with friends | Sprint 3 | Interview P02: "My friend also takes the same bus" |
| Mock driver feedback submission | Sprint 3 | Interview P09: "The tableau is a suggestion, not a fact" |

### Out of Scope (MVP Phase)

Desirable features that do not affect the activation moment. These go on the post-course backlog.

| Feature | Reason Out of Scope |
|---------|---------------------|
| Mobile push notifications (native) | Requires app store submission, complexity beyond MVP |
| Real-time GPS tracking visualization | Requires operator data access we cannot get |
| Chat/community feature | Adds moderation overhead, not core to activation |
| Gamification/badges | Distracts from core value proposition |

### Explicitly Rejected

Features considered and removed from all planning. Document why -- auditors at Checkpoint 2 check this.

| Feature | Why Rejected |
|---------|-------------|
| Timetable-only fallback mode | Interview evidence showed students prefer "no data" over "misleading data" |
| Advertising-supported free tier | Interview evidence showed students would pay for reliability (P03, P11) |
| Professor-only announcements feed | Does not match the problem we are solving |

---

## Sprint Overview

| Sprint | Dates | Theme | Key Deliverable | Checkpoint |
|--------|-------|-------|-----------------|-----------|
| Sprint 1 | Apr 24 to May 7 | Foundation | Core user flow working end to end, deployed URL |
| Sprint 2 | May 8 to May 21 | Instrumentation | Analytics live, usability tested | Checkpoint 3 May 21 |
| Sprint 3 | May 22 to Jun 4 | Growth | Experiments running, share feature | Peer Assessment Jun 4 |
| Sprint 4 | Jun 5 to Jun 11 | Demo Prep | Pitch-ready, repo complete | Demo Day Jun 11 |

---

## Sprint 1: Foundation

**Dates:** April 24 to May 7 2026
**Sprint Goal:** A user can sign up, select a bus stop, and receive a confirmed bus arrival status — end to end in a deployed application.
**Demo:** Live web app showing the full core flow from signup to confirmed status display.

### Capacity

| Team Member | Available Hours (excl. midterm prep) | Story Points Max |
|-------------|--------------------------------------|-----------------|
| Nikoloz Kvirikashvili | 15 hours | 13 points |
| Nikoloz Modebadze | 15 hours | 13 points |
| Giorgi Mikaberidze | 15 hours | 13 points |
| Besik Meskhia | 15 hours | 13 points |
| **Total** | | **52 points** |

**Sprint 1 commitment:** 21 story points (40% of maximum -- target 60% or below)
**Rationale for commitment level:** Midterm exam (Apr 30) overlaps Sprint 1. Conservative commitment allows async standup maintenance during exam week.

### Stories Allocated to Sprint 1

| Story ID | Story (summary) | Points | Assignee | AI Tool |
|----------|----------------|--------|----------|---------|
| S1-01 | User sign-up with email/password | 3 | Nikoloz Kvirikashvili | Stitch |
| S1-02 | Bus stop selector on home screen | 3 | Nikoloz Modebadze | Stitch |
| S1-03 | Status query and loading UI | 3 | Giorgi Mikaberidze | Stitch |
| S1-04 | CONFIRMED/ESTIMATED status display | 5 | Besik Meskhia | Stitch |
| S1-05 | Crowding level indicator | 3 | Nikoloz Kvirikashvili | Stitch |
| S1-06 | Deployment to Vercel | 3 | Giorgi Mikaberidze | Claude Code |
| **Sprint 1 Total** | | **21** | | |

### Sprint 1 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Midterm overlap reduces available hours | H | H | Conservative commitment, async standups |
| Stitch output requires significant iteration | M | M | Buffer one story point margin |
| Backend API for bus data unavailable | H | H | Use mock data for MVP |

---

## Sprint 2: Instrumentation

**Dates:** May 8 to May 21 2026
**Sprint Goal:** Analytics live in production. Event schema fully instrumented. Usability testing initiated.
**Checkpoint 3 due:** May 21 at 23:59

### Stories Allocated to Sprint 2

| Story ID | Story (summary) | Points | Assignee | AI Tool |
|----------|----------------|--------|----------|---------|
| S2-01 | Event schema instrumentation (all events) | 8 | Nikoloz Modebadze | Copilot |
| S2-02 | User session tracking | 3 | Giorgi Mikaberidze | Copilot |
| S2-03 | Departure time recommendation | 5 | Besik Meskhia | Stitch |
| S2-04 | Push notification setup | 3 | Nikoloz Kvirikashvili | AI Studio |
| S2-05 | Favorite stops persistence | 3 | Nikoloz Modebadze | Copilot |
| **Sprint 2 Total** | | **22** | | |

---

## Sprint 3: Growth

**Dates:** May 22 to June 4 2026
**Sprint Goal:** Share feature working, frequent routes memory, driver feedback mock.

### Stories Allocated to Sprint 3

| Story ID | Story (summary) | Points | Assignee | AI Tool |
|----------|----------------|--------|----------|---------|
| S3-01 | Share status with friends | 5 | Nikoloz Kvirikashvili | Stitch |
| S3-02 | Frequent routes memory | 3 | Nikoloz Modebadze | Copilot |
| S3-03 | Driver feedback submission | 3 | Giorgi Mikaberidze | Stitch |
| S3-04 | Usability test iterations | 5 | Besik Meskhia | N/A |
| **Sprint 3 Total** | | **16** | | |

---

## Sprint 4: Demo Prep

**Dates:** June 5 to June 11 2026
**Sprint Goal:** Demo-ready product with complete repo and venture packet.
**Demo Day:** June 11 2026

### Stories Allocated to Sprint 4

| Story ID | Story (summary) | Points | Assignee | AI Tool |
|----------|----------------|--------|----------|---------|
| S4-01 | Pitch deck | 3 | Nikoloz Modebadze | N/A |
| S4-02 | Demo script and rehearsal | 2 | Besik Meskhia | N/A |
| S4-03 | Bug fixes and polish | 5 | Team | All |
| S4-04 | Repo documentation | 3 | Nikoloz Kvirikashvili | N/A |
| **Sprint 4 Total** | | **13** | | |

---

## Full Backlog (All Stories)

| Story ID | Story (summary) | Sprint | Points | Interview Evidence |
|----------|----------------|--------|--------|--------------------|
| S1-01 | User sign-up with email/password | 1 | 3 | P01: "I need to track which bus"
| S1-02 | Bus stop selector on home screen | 1 | 3 | P02: "My stop is KIU Main Gate" |
| S1-03 | Status query and loading UI | 1 | 3 | P08: "I waited for an hour" |
| S1-04 | CONFIRMED/ESTIMATED status display | 1 | 5 | P06: "I just need it to be honest" |
| S1-05 | Crowding level indicator | 1 | 3 | P07: "I physically could not breathe" |
| S1-06 | Deployment to Vercel | 1 | 3 | Required for user testing |
| S2-01 | Event schema instrumentation | 2 | 8 | Lab 5 event schema |
| S2-02 | User session tracking | 2 | 3 | Analytics requirement |
| S2-03 | Departure time recommendation | 2 | 5 | P03: "three hours before" |
| S2-04 | Push notification setup | 2 | 3 | P08: "waited an hour" |
| S2-05 | Favorite stops persistence | 2 | 3 | P11: "Terjola commute" |
| S3-01 | Share status with friends | 3 | 5 | P02: "my friend also takes #3" |
| S3-02 | Frequent routes memory | 3 | 3 | P10: "leaving Terjola too early" |
| S3-03 | Driver feedback submission | 3 | 3 | P09: "suggestion, not fact" |
| S3-04 | Usability test iterations | 3 | 5 | Lab 5 critique |
| S4-01 | Pitch deck | 4 | 3 | Demo Day requirement |
| S4-02 | Demo script and rehearsal | 4 | 2 | Demo Day requirement |
| S4-03 | Bug fixes and polish | 4 | 5 | Final prep |
| S4-04 | Repo documentation | 4 | 3 | Checkpoint 3 requirement |

**Total story points across all sprints:** 72
**Unallocated backlog points:** 0

---

## Milestone Alignment

| Milestone | Date | What Your Product Must Be Able to Do |
|-----------|------|--------------------------------------|
| Checkpoint 2 | Wed 22 Apr | Prototype testable, event schema committed, roadmap submitted |
| Sprint 1 Review | Week 10 (May 7) | Core user flow working end to end, deployed URL |
| Checkpoint 3 | Thu 21 May | MVP functional, analytics live, financial model complete |
| Sprint 3 Review | Week 14 (Jun 4) | Experiments run, growth model drafted |
| Demo Day | Thu 11 Jun | 7-minute pitch, 5-minute live demo, Q&A ready |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| April 21, 2026 | 1.0 | Initial roadmap | Team Bandersnatch |

---

*Product Roadmap | Bandersnatch | CS-PD-2026 | Spring 2026*