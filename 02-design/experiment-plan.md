# Experiment Plan

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 1.0

---

## Experiment 1: Trust Verification

### Assumption Under Test

Students who receive a CONFIRMED bus status will trust the information enough to reduce their pre-commute buffer time by at least 10 minutes.

### Hypothesis

> If KIU students use the Bandersnatch app to check Bus #3 status before leaving for the stop, then at least 40% of weekly active users will reduce their self-reported departure buffer by 10+ minutes within two weeks of first use.

### Why This Assumption

The core product promise is that honest information restores rational departure decisions. All 12 interviewees reported using 1.5–3 hour buffers because they couldn't trust the existing tracker. If the app does not change this behaviour, the product has not delivered its primary value.

---

### Thresholds

| Outcome | Definition | Action |
|---|---|---|
| **Strong success** | ≥40% of weekly active users reduce buffer by ≥10 min | Continue buildout. Invest in growth channels. Plan GPS integration. |
| **Weak success** | 20–39% of users reduce buffer | Iterate on UI clarity and trust signals (badge design, data source labels). Run a second experiment with a different method. |
| **No effect** | <20% of users show buffer reduction OR users report the same distrust as the existing app | Pivot the CONFIRMED/ESTIMATED distinction. User interviews to diagnose why trust wasn't restored. Consider a live data source before further feature work. |

**Pre-registered before launch:** Yes. Thresholds are defined before the first user is onboarded.

---

### Method

**Approach:** In-app measurement + exit survey

**Why this method:** The app is already deployed on Vercel and can log events through the GA4 event schema (planned). An exit survey captures the behavioural change that events alone cannot measure (how early did they leave? how did they decide?). This is the cheapest credible test because it requires no additional infrastructure, no paid ads, and no manual recruitment beyond posting in campus groups.

**Step-by-step:**

1. **Recruit 20–30 participants** from the target ICP (KIU students who commute via Bus #3). Recruitment via:
   - KIU student Telegram/WhatsApp group announcements
   - Posters with QR code at Bus #3 stops (KIU Main Gate, KIU K Building)
   - Word of mouth from the 12 interview participants

2. **Onboard participants** through the app's onboarding flow. Record their default bus stop and typical first lecture time.

3. **Instrument the following events** in GA4:
   - `app_opened` — timestamp, referral source
   - `bus_status_confirmed` — bus stop, ETA, badge type
   - `departure_decision_made` — chosen departure delay
   - `user_session_started` — days since last session

4. **Track for 2 weeks.** At the end of week 2, send the exit survey via email (collected at signup).

5. **Exit survey questions:**
   - "On a typical morning this week, how early did you arrive at your bus stop compared to your first lecture?" (dropdown: 0–5 min / 5–10 / 10–20 / 20–30 / 30–60 / 60+)
   - "Did you check Bandersnatch before leaving home?" (Always / Sometimes / Never)
   - "Did you trust the status information?" (Yes, mostly / Sometimes / No)
   - "Has your departure time changed since using the app?" (Earlier / Same / Later — with minutes)
   - "Would you pay for this app?" (Yes / Maybe / No)

6. **Analyze:** Compare self-reported buffer times from the survey against the interview baseline (1.5–3 hours). Count users who reduced buffer by ≥10 min. Cross-reference with event data to see if behaviour change correlates with app usage frequency.

---

### Launch Path

| Step | Date | Owner |
|---|---|---|
| Deploy app to Vercel (done) | Apr 24 | Giorgi Mikaberidze |
| Instrument GA4 events | May 8–14 | Nikoloz Modebadze |
| Create recruitment post + QR poster | May 14 | Nikoloz Modebadze |
| Recruit participants (target: 20) | May 14–18 | All team members |
| Launch experiment (start tracking) | May 19 | Team |
| Mid-experiment check-in | May 26 | Nikoloz Kvirikashvili |
| Send exit survey | Jun 2 | Besik Meskhia |
| Analyze results | Jun 4–5 | Team |
| Decision gate (pivot/continue/scale) | Jun 6 | Team |

**Channel:** KIU student Telegram groups (estimated reach: 200+ students in Bus #3 commute channels). Physical posters at KIU Main Gate and KIU K Building bus stops (estimated daily views: 400+).

---

### Limitations

| Limitation | Mitigation |
|---|---|
| Self-reported buffer time may be inaccurate (recall bias) | Cross-reference with GA4 event timestamps. A user who opens the app 20 min before a lecture and whose first event of the day is 20 min before class is likely leaving later than a 2-hour buffer user. |
| Sample size (20–30) may not generalise to all 400+ Bus #3 commuters | This is a qualitative signal experiment, not a statistical significance test. A clear positive signal (40%+ behaviour change) justifies continued investment. A null result is useful even with small N. |
| Hawthorne effect — participants may change behaviour because they know they're being watched | The app is presented as a working product, not an experiment. The exit survey is framed as "help us improve." No mention of buffer measurement during onboarding. |
| 2-week window may be too short to form new habits | Interview evidence suggests students make departure decisions daily — a 2-week window covers 10+ commute cycles, enough to detect a pattern change. |

---

## Experiment 2: Crowding Information Utility

### Assumption Under Test

Students will use crowding level data to choose between buses (catch an earlier bus if crowded, wait if not).

### Hypothesis

> At least 25% of weekly active users who see a "High" crowding level will query bus status again within 15 minutes (seeking an update or earlier bus).

### Thresholds

| Outcome | Threshold |
|---|---|
| Success | ≥25% re-query within 15 min after seeing "High" crowding |
| Mixed | 10–24% re-query |
| Failure | <10% re-query |

### Method

Analyse the `bus_status_confirmed` events in GA4, looking for the `crowd_level` property. Calculate the rate of repeat queries within 15 minutes when `crowd_level === "high"` vs. `crowd_level === "low"`.

**Cost:** $0 — data already collected by Experiment 1 events.

**Owner:** Besik Meskhia

---

## Experiment 3: Referral Channel Validation

### Assumption Under Test

Students will invite classmates to use the app if they find it valuable.

### Hypothesis

> Within 2 weeks of launch, at least 10% of active users will send at least one invite, and at least 5% of new signups will come through the invite flow.

### Thresholds

| Outcome | Threshold |
|---|---|
| Success | ≥10% invite rate AND ≥5% signups from invites |
| Mixed | One threshold met |
| Failure | Neither threshold met |

### Method

Instrument the `invite_sent` event (already defined in event schema). Add a referral query parameter to share links. Track signups with `referral_source === "invite"`.

**Cost:** $0 — uses existing event schema.

**Owner:** Nikoloz Modebadze

---

## Experiment Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Not enough participants recruited | Cannot draw conclusions from tiny N | Recruit in waves. Wave 1: Telegram groups (target 20). Wave 2: In-person at bus stops with QR codes (target 30). Accept lower N with explicit limitation in analysis. |
| GA4 not yet instrumented at experiment start | No event data to analyse | Fall back to survey-only data. Survey NPS and self-reported behaviour change are still useful signals. |
| App bugs during experiment corrupt data | Unusable results | Run a 2-day internal test before recruiting participants. Fix blocking bugs before experiment launch. |
| Students stop using the app after 1–2 days | Insufficient engagement data | Track day-1, day-3, day-7 retention. If retention drops below 30% by day 3, interview drop-offs to diagnose. |

---

## Experiment Log

| Date | Experiment | Status | Result |
|---|---|---|---|
| — | E1: Trust Verification | Planned | — |
| — | E2: Crowding Utility | Planned | — |
| — | E3: Referral Channel | Planned | — |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial experiment plan | Team Bandersnatch |

---

*Experiment Plan | Bandersnatch | CS-PD-2026 | Spring 2026*
