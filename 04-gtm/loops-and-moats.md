# Loop and Moat Narrative

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 18, 2026
**Version:** 2.0

---

## Part 1: Viral Loop Assessment

### Does your product have a viral loop?

**Our assessment:** Yes — in design (Sprint 3). The share mechanic is not yet live in production but is planned as story S3-01.

---

### Loop Diagram

**Step 1:** User A checks bus status and taps "Share bus status."
**Step 2:** App generates a link with User A's stop and live ETA (teaser view for non-users).
**Step 3:** User B receives the link in WhatsApp/Telegram and opens the teaser.
**Step 4:** User B signs up to get full confirmed status and can share with User C — re-entering the loop.

---

### K-Factor Estimate

```
K = invitations sent per user per month x conversion rate of invitations
```

| Input | Value | Source |
|-------|-------|--------|
| Average invitations sent per user per month | 0.8 | Assumption — no share feature built yet; will replace with `invite_sent` data |
| Conversion rate of those invitations | 25% | Proxy from landing-page signup rate (22%); assumption until invite attribution live |
| **K-factor** | **0.20** | |

**Arithmetic shown:**
```
K = 0.8 x 0.25 = 0.20
```

**What our K-factor means:**

K is less than 1: each cohort brings in fewer new users than itself. The loop slows decay but does not compound. Our loop still matters because it reduces blended CAC: at K = 0.20, each 100 retained users generate ~20 additional signups over time via referral, offsetting ~17% of paid/organic acquisition cost at zero marginal spend.

---

## Part 2: Network Effects Analysis

### Network Effect Type

| Type | Description | Does this apply? |
|------|-------------|------------------|
| Direct | Users get more value as more other users join | No |
| Two-sided | Two distinct user groups need each other | No |
| Data | Each user contributes data that improves the product for all | Yes (weak — crowding reports) |
| Local | Network matters within a specific group — university, corridor | Yes (primary) |
| None | Same value at user 1 and user 1,000,000 | No — local + data apply |

**Our network effect type:** **Local** (primary) with weak **data** overlay (crowding).

---

### Evidence for the Network Effect

**Core ETA value:** Works for a single user — bus arrival time does not require other users.

**Local effect:** Crowding and peer context matter on the KIU-bound Bus #3 morning corridor (8:00–10:00 AM). More commuters reporting = more reliable crowding signal.

| Scale | What the product can do |
|-------|-------------------------|
| At zero users | Timetable-only ETA; same as generic tools |
| At 10 users | Sporadic crowding reports (1–3/day) |
| At 50 users | Regular peak-hour reports — crowding informs decisions |
| At critical mass | Corridor feels "alive" — reliable crowding + peer presence during morning rush |

---

### Critical Mass Threshold (for local network effects)

**Our specific community:** KIU students on Bus #3, KIU-bound morning corridor (Main Gate → campus).

**Critical mass threshold:** **50 daily active users** on that corridor during 8:00–10:00 AM before crowding data feels reliable to any individual user.

**Rationale:** Below 50 DAU, we see fewer than ~5 crowding reports per peak hour — too sparse for departure decisions. Derived from commute density at KIU Main Gate (50+ students per 30-min cycle x 3 cycles) and assumption that ~1/3 would actively report.

**Current position relative to threshold:** Pre-launch / early MVP — **0 DAU** vs threshold **50** — **0%** of the way there.

---

## Part 3: Moat Narrative

### Current Moat

**What protects us:** Weak today — **trust/brand for "honest bus info"** and path to **data moat** (commute patterns, crowding by stop/time) plus **institutional integration** (university transit dashboard).

**Evidence that this moat is real at our current scale:** Incumbent tracker lost student trust (12/12 interviews). We have 12 discovery interviews and early product focus on confirmed vs estimated status — not yet a defensible data asset at scale.

**Honest assessment of moat strength right now:**
**Weak** at current scale (defensibility **2/10**). Any team could ship a bus ETA web app in weeks. "First at KIU" and interview insight are real but thin. Trajectory: at **200+ active users** over 1–2 semesters, accumulated commute and crowding data plus ride history/trust score create switching costs; university dashboard creates institutional lock-in.

---

### What a Copycat Could Do

**If a well-funded competitor launched tomorrow, they could:**
- Clone ETA UI and ship Instagram ads to all KIU students within weeks
- Undercut on marketing while we are capped at five bus stops and six group chats
- Partner with university IT before we have institutional traction

**What they could NOT easily replicate:**
- 6+ months of corridor-specific crowding and delay patterns (once we have them)
- Student trust earned after incumbent failures — requires consistent accuracy over time
- Relationships with group admins and bus-stop presence we build in Sprint 2

**Our response strategy if a major competitor enters our space:**
Accelerate acquisition in the Bus #3 corridor before they arrive — saturate QR stops and groups — while deepening accuracy and institutional outreach (transit pain-point dashboard for KIU) so we become the default honest layer for Route #3, not a generic tracker.

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial loops and moats | Team Bandersnatch |
| May 14, 2026 | 1.1 | Summary statement | Team Bandersnatch |
| May 18, 2026 | 2.0 | Lab 9 template: K-factor, network table, critical mass, moat | Team Bandersnatch |

---

*Loops and Moats Narrative | Bandersnatch | CS-PD-2026 | Spring 2026*
