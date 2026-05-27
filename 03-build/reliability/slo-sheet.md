# SLO Sheet

**Product:** Bus #3 Real-Time Tracker
**Team:** Bandersnatch
**Date:** 22 May 2026
**Review cadence:** Monthly, or after every incident

---

## Overview

This document defines our Service Level Indicators, Service Level Objectives, and severity definitions. These are internal commitments, not customer-facing SLAs. They exist to make reliability visible and to give us a principled way to decide when to stop shipping features and invest in stability instead.

---

## Glossary

**SLI (Service Level Indicator):** A specific metric we measure. The raw number.
**SLO (Service Level Objective):** The target we set for an SLI over a time window. An internal commitment.
**SLA (Service Level Agreement):** A contractual commitment to a customer with consequences for breach. Our product does not have SLAs yet.
**Error budget:** The amount of unreliability the SLO allows. Budget = (1 - SLO target) x time window.

---

## SLI and SLO Definitions

### SLO 1: Availability

**SLI definition:**
- Metric: Percentage of HTTPS requests to the Next.js app that return a 2xx or 3xx response code
- Formula: `successful_requests / total_requests x 100`
- Measured by: Vercel deployment analytics dashboard
- Measurement frequency: Every 5 minutes (Vercel default)
- Current measured value: Not yet measured — Vercel analytics were set up for the app deployment but we have not established a baseline

**SLO target:**
- Target: 99% availability
- Time window: Rolling 30 days
- Why this target is achievable: Vercel hobby plan guarantees approximately 99.5% uptime for the platform. We set our SLO below the infrastructure ceiling to account for application-level errors (Firestore connection issues, client-side bugs) that are outside Vercel's control.

**Error budget:**
```
SLO target: 99%
Time window: 30 days = 30 x 24 x 60 = 43,200 minutes
Error budget = (1 - 0.99) x 43,200 = 432 minutes per 30-day window

Equivalent downtime: 7.2 hours per month
```

**Current error budget remaining this window:** 432 minutes (full budget — no incidents tracked yet this window)

---

### SLO 2: Core flow success rate — bus status check

**SLI definition:**
- Metric: Percentage of bus status check attempts that complete successfully (user queries a stop and receives a status without a 5xx or client error)
- Formula: `successful_status_checks / total_status_checks x 100`
- Measured by: Firebase Analytics events — `bus_status_confirmed` vs (`app_opened` + `user_session_started` + `bus_status_queried_again`) as a proxy. We count the ratio of successful status confirmations to total query attempts.
- Measurement frequency: Calculated daily from Firebase Analytics event data
- Current measured value: Not yet measured — analytics is instrumented but we do not have enough data to establish a baseline

**SLO target:**
- Target: 98% core flow success rate
- Time window: Rolling 30 days
- Why this target is achievable: The core flow is client-side (Firestore read + Leaflet map render). There is no external API dependency beyond Firestore, which has 99.99% uptime. The 2% error budget accounts for client-side failures (network issues, browser incompatibility) outside our control.

**Error budget:**
```
SLO target: 98%
Time window: 30 days = 43,200 minutes
Error budget = (1 - 0.98) x 43,200 = 864 minutes per 30-day window

Equivalent downtime: 14.4 hours per month
```

**Current error budget remaining this window:** 864 minutes (full budget — not yet tracked)

---

### SLO 3: Latency (monitor only, no SLO target yet)

**SLI definition:**
- Metric: p95 page load time for the home page (bus status view)
- Formula: 95th percentile of `app_opened` to first paint timing in milliseconds
- Measured by: Firebase Analytics performance monitoring (not yet set up)
- Current measured value: Not yet measured — performance monitoring is not instrumented

**SLO target:** None set — we do not have enough data. We will set a target once we have 30 days of baseline measurements.

---

## Error Budget Policy

When any SLO error budget is exhausted in a given window:

1. No new feature deployments until the window resets or the budget is partially restored through improved reliability
2. Engineering effort in the next sprint pivots to reliability improvement, not feature work
3. An incident review is mandatory before the next production push, even if no single incident caused the budget exhaustion

**Who owns the error budget decision:** Besik Meskhia (Program Lead)

---

## Severity Definitions

### SEV1: Core flow completely down — Bus tracking unavailable

**Definition for Bus #3 Real-Time Tracker:** No user can check bus status. The home page returns 5xx for more than 50% of requests, or the entire deployment is unreachable. Firestore reads fail for all authenticated users.

**Response:** All hands. Interrupt whatever you are doing.
**Communication:** Post in team Discord immediately. Inform teammates within 5 minutes.
**Target time to acknowledge:** 15 minutes
**Target time to mitigate:** 2 hours

### SEV2: Degraded experience — core flow partially affected

**Definition for Bus #3 Real-Time Tracker:** Some users cannot check bus status. Error rate above 5% on status queries. Live map is not displaying peer locations. Push notifications are not being delivered. A key feature (e.g. boarding report) is broken but core status checking still works.

**Response:** On-call team member investigates. Others notified but not interrupted.
**Communication:** Post in team Discord within 30 minutes.
**Target time to acknowledge:** 30 minutes
**Target time to mitigate:** 8 hours

### SEV3: Minor issue — no user impact or minimal impact

**Definition for Bus #3 Real-Time Tracker:** A non-critical feature is broken (e.g. email verification banner not showing, incorrect wording on a button, dark mode not persisting). Error rate elevated but below 1% on core endpoints. Performance degraded but within SLO.

**Response:** Logged and scheduled for next working session.
**Communication:** GitHub issue created with SEV3 label.
**Target time to acknowledge:** Next working day
**Target time to fix:** Next sprint

---

## On-Call Rotation

Even as a student team, assign an on-call week per person rotating. This distributes the burden and ensures every team member understands the operational side of what they have built.

| Week | On-call | Backup |
|------|---------|--------|
| 25 May — 31 May 2026 | Besik Meskhia | Giorgi Mikaberidze |
| 1 June — 7 June 2026 | Giorgi Mikaberidze | Nikoloz Kvirikashvili |
| 8 June — 14 June 2026 | Nikoloz Kvirikashvili | Nikoloz Modebadze |
| 15 June — 21 June 2026 | Nikoloz Modebadze | Besik Meskhia |

**On-call responsibilities:** Check the deployment URL once per day. Respond to SEV1 and SEV2 alerts within the target times above. Create a GitHub issue for any alert that fires, even if it resolves on its own.

---

*SLO Sheet | Bandersnatch | CS-PD-2026 | Spring 2026*
