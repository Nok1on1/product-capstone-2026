# Experiment Plan

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date launched:** May 19, 2026
**Owner:** Nikoloz Kvirikashvili

---

## 1. Hypothesis

We believe KIU students who commute via Bus #3 lose 5–12 hours per week to fear-based early departure because they cannot trust the existing tracking system. If they use the Bandersnatch app to check bus status before leaving home, at least 40% of weekly active users will reduce their self-reported departure buffer by 10 or more minutes within two weeks of first use, because honest and clearly labelled status information restores rational departure decisions.

---

## 2. Assumption Being Tested

Students who receive a clearly labelled bus status — whether CONFIRMED or ESTIMATED — will trust the information enough to actually change when they leave home, rather than defaulting to the same fear-based buffer they used before.

---

## 3. Top 3 Riskiest Assumptions

| Rank | Assumption | Why risky | Why this experiment addresses it |
|------|------------|-----------|----------------------------------|
| 1 | Students will change departure behaviour based on app information | All 12 interviewees have been burned by inaccurate trackers before — distrust may be too deep to overcome with a new app alone | Exit survey directly asks whether departure time changed and by how much; GA4 events cross-reference app usage with time-of-day patterns |
| 2 | The CONFIRMED/ESTIMATED badge distinction is understood and meaningful to users | If users treat both badges the same way or ignore them entirely, the core UI mechanism fails even if the data is good | Exit survey asks "did you trust the status information?" and separates responses by badge type shown |
| 3 | 20–30 recruits from Telegram groups and campus posters represent actual Bus #3 commuters | Sample may skew toward tech-comfortable early adopters who behave differently from the average commuter | Onboarding records default bus stop and typical first lecture time — anyone not commuting via Bus #3 at a regular time is excluded from analysis |

---

## 4. Experiment Method

**Method chosen:** Concierge MVP

The app is fully deployed and functional. This is not a smoke test — users interact with the real product. The team personally recruits participants, onboards them, monitors their usage, and conducts the exit survey, acting as a concierge layer around the automated product.

- **Channel:** KIU student Telegram and WhatsApp groups (estimated reach: 200+ students in Bus #3 commute channels); physical QR code posters at KIU Main Gate and KIU K Building bus stops (estimated daily views: 400+)
- **Asset used:** Deployed Vercel app at production URL; recruitment post with QR code; physical A4 poster at stop locations
- **Call to action:** "Track Bus #3 in real time — sign up free at [URL]"
- **Real target users are reached by:** Posting in Telegram groups where KIU students already discuss Bus #3 commute times; posters placed at the physical bus stops where the target users wait
- **What happens after a user responds:** User visits the production URL, signs up via email/password, completes onboarding (records default stop and lecture time), and uses the app normally for two weeks; exit survey sent via email at the end of week 2

---

## 5. Success, Gray Zone, Failure

- **Success threshold:** 40% or more of weekly active users self-report reducing departure buffer by 10 or more minutes
- **Gray zone:** 20–39% of users report buffer reduction
- **Failure threshold:** Fewer than 20% of users report buffer reduction, or users report the same level of distrust as the existing app

These thresholds are pre-registered before the first participant is onboarded. They will not be adjusted after launch.

---

## 6. Time Window and Sample Size

- **Experiment starts:** May 19, 2026
- **Experiment ends:** June 2, 2026 (exit survey sent); analysis complete by June 5
- **Minimum sample target:** 20 participants who complete at least 3 app sessions during the two-week window
- **What counts as one valid data point:** One participant who commutes via Bus #3 at least three times per week, completes onboarding, opens the app on at least 3 separate days, and submits the exit survey

---

## 7. Data Capture Plan

| Signal | How captured | Where recorded | Owner |
|--------|--------------|----------------|-------|
| Visits and signups | Firebase Auth signup count; GA4 `app_opened` event | GA4 dashboard + experiment tracking sheet | Nikoloz Modebadze |
| Bus status checks | GA4 `bus_status_confirmed` event with `badge_type` and `crowd_level` properties | GA4 dashboard | Nikoloz Modebadze |
| Departure behaviour change | Exit survey question: "Has your departure time changed since using the app?" with minutes field | Survey response sheet | Besik Meskhia |
| Trust rating | Exit survey question: "Did you trust the status information?" (Yes mostly / Sometimes / No) | Survey response sheet | Besik Meskhia |
| Follow-up notes | Open text field in exit survey: "Anything else you want to tell us?" | Interview extension notes | Nikoloz Kvirikashvili |

---

## 8. Live Asset Checklist

- [x] App is deployed to production Vercel URL
- [x] Recruitment post drafted for Telegram groups
- [x] QR code poster designed for bus stop locations
- [x] GA4 events defined in event schema (implementation in progress)
- [x] Exit survey drafted with departure buffer and trust questions
- [x] Success and failure thresholds frozen before participant recruitment
- [x] Nikoloz Modebadze owns GA4 monitoring throughout experiment
- [x] Decision review date set: June 6, 2026

---

## 9. Decision Rule

- If result meets success threshold (≥40% buffer reduction), we will continue buildout with confidence, invest in growth channels, and begin planning GPS integration to make the CONFIRMED badge real rather than schedule-based.
- If result falls below failure threshold (<20% buffer reduction or sustained distrust), we will pause feature work, run qualitative interviews with non-changers to diagnose why trust was not restored, and revisit the CONFIRMED/ESTIMATED distinction before any further development.

---

## 10. What Would Make This Experiment Invalid

- More than 30% of participants are teammates, friends of the team, or people who already know the app is a course project — their behaviour will not reflect genuine commuter decisions
- GA4 instrumentation is not complete before experiment launch, leaving no event data to cross-reference with survey responses
- The app experiences a production outage lasting more than 24 hours during the two-week window, disrupting usage patterns
- Exit survey response rate falls below 50% of participants, leaving the dataset too small to draw conclusions
- Participants are informed during onboarding that we are measuring their departure buffer — knowing the measurement criterion changes the behaviour being measured (Hawthorne effect)
- Page copy or badge logic changes during the experiment without logging the change and its date

---

## Secondary Experiments

### Experiment 2: Crowding Information Utility

**Assumption under test:** Students will use crowding level data to choose between buses — catching an earlier bus if crowded, waiting if not.

**Hypothesis:** At least 25% of weekly active users who see a "High" crowding level will query bus status again within 15 minutes.

**Thresholds:**

| Outcome | Threshold |
|---------|-----------|
| Success | ≥25% re-query within 15 min after seeing "High" crowding |
| Gray zone | 10–24% re-query |
| Failure | <10% re-query |

**Method:** Analyse `bus_status_confirmed` events in GA4, filtering for `crowd_level === "high"` and measuring time to next query from the same user. Cost: $0 — data already collected by Experiment 1 events.

**Owner:** Besik Meskhia

---

### Experiment 3: Referral Channel Validation

**Assumption under test:** Students will invite classmates to use the app if they find it valuable.

**Hypothesis:** Within 2 weeks of launch, at least 10% of active users will send at least one invite, and at least 5% of new signups will come through the invite flow.

**Thresholds:**

| Outcome | Threshold |
|---------|-----------|
| Success | ≥10% invite rate AND ≥5% signups from invites |
| Gray zone | One threshold met |
| Failure | Neither threshold met |

**Method:** Instrument `invite_sent` event (already defined in event schema). Add a referral query parameter to share links. Track signups with `referral_source === "invite"`. Cost: $0 — uses existing event schema.

**Owner:** Nikoloz Modebadze

---

## Experiment Risk

| Risk | Impact | Mitigation |
|------|--------|------------|
| Not enough participants recruited | Cannot draw conclusions from tiny N | Recruit in waves: Wave 1 via Telegram groups (target 20), Wave 2 in-person at bus stops with QR codes (target 30). Accept lower N with explicit limitation in analysis. |
| GA4 not yet instrumented at experiment start | No event data to analyse | Fall back to survey-only data. Self-reported behaviour change is still a valid signal. |
| App bugs during experiment corrupt data | Unusable results | Run a 2-day internal test before recruiting participants. Fix blocking bugs before experiment launch date. |
| Students stop using app after 1–2 days | Insufficient engagement data | Track day-1, day-3, day-7 retention. If retention drops below 30% by day 3, interview drop-offs to diagnose before continuing. |

---

## Experiment Log

| Date | Experiment | Status | Result |
|------|------------|--------|--------|
| — | E1: Trust Verification | Planned | — |
| — | E2: Crowding Utility | Planned | — |
| — | E3: Referral Channel | Planned | — |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| May 13, 2026 | 1.0 | Initial experiment plan | Team Bandersnatch |
| May 14, 2026 | 2.0 | Restructured to match template: added Top 3 Riskiest Assumptions, named method type, Time Window and Sample Size, Data Capture Plan table, Live Asset Checklist, Decision Rule, and What Would Make This Experiment Invalid | Team Bandersnatch |

---

*Experiment Plan | Bandersnatch | CS-PD-2026 | Spring 2026*