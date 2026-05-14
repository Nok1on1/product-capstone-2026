# Loops and Moats Narrative

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 1.0

---

## Growth Loop Analysis

### Primary Loop: Share Bus Status → Invite → Onboard → Share

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    ▼                                      │
    ┌──────────┐        ┌──────────┐       ┌──────────┐    │
    │  User A  │ ────── │  User A  │ ───── │  User B  │    │
    │  checks  │  share │  sends   │  tap  │  opens   │    │
    │  status  │  btn   │  link to │  link │  app for │    │
    │          │        │  User B  │       │  teaser  │    │
    └──────────┘        └──────────┘       └──────────┘    │
         ▲                                      │          │
         │                                      ▼          │
         │                              ┌──────────┐       │
         │                              │  User B  │       │
         │                              │  signs   │ ──────┘
         │                              │  up      │
         │                              └──────────┘
         │                                   │
         └───────────────────────────────────┘
                                       User B shares
                                       with User C
```

### K-Factor Estimate

A viral loop's K-factor is the average number of new users each existing user recruits:

```
K = i × c

Where:
i = number of invites sent per user (shares)
c = conversion rate of invite to signup
```

| Parameter | Estimate | Source |
|---|---|---|
| **i (invites/user)** | 1.0 | Bus #3 commuters travel in social groups. Interview P02: "My friend also takes the same bus." In a semester of shared commute, 1 share per user across the product's lifespan is a conservative floor. |
| **c (conversion rate)** | 0.20 | 20% of students who receive a bus status link will download the app. Source: 12/12 interview participants confirmed the problem exists — there is unmet demand. A utility link from a trusted classmate converts higher than a generic ad. |

```
K = 1.0 × 0.20 = 0.20
```

**Interpretation:** K = 0.20 means every 100 users generate 20 new users through referral. This is below the viral threshold of K = 1.0 (where growth becomes self-sustaining). The loop contributes to growth but does not replace acquisition channels. At K = 0.20, the referral channel adds ~17% to the user base per cycle.

**How K could improve:**

| Change | New K | Realistic? |
|---|---|---|
| Add incentive for sharing (trust score bonus) | 0.30 | Yes — +1 trust score per successful referral |
| Improve teaser page with live bus ETA | 0.35 | Yes — non-users can see real value before signup |
| WhatsApp/Tenor GIF integration for share cards | 0.40 | Possible — richer share payload drives curiosity |
| Viral threshold (K = 1.0) | Not realistic without network-effect product change | The app's value is individual (finding bus ETA), not inherently social. K will never exceed ~0.5 without adding multiplayer features (group rides, etc.) |

**Honest assessment:** The share loop is helpful but not transformative. The product does not have a natural viral mechanic because the core value — bus arrival time — is individual, not collaborative. Users share because they are helpful, not because the product forces it. We accept K = 0.20 as a background growth channel and focus acquisition effort on the two non-viral channels (QR flyers and student groups).

---

## Network Effects

### Type: Data Network Effect (Weak)

The app exhibits a **data network effect**: more users sharing their location produces better crowding data, which makes the app more useful for everyone.

| User Count | Crowding Data Quality | Value to Individual User |
|---|---|---|
| 0–10 | No real-time crowding data | Uses timetable only. Same as existing tools. |
| 10–50 | Sporadic crowding reports (1–3 per day) | Occasionally useful — can spot crowded buses |
| 50–200 | Regular reports during peak hours (5–10 per day) | Consistently useful — crowding informs departure decisions |
| 200+ | High-density coverage across all stops and times | High value — rarely need to guess about crowding |

**Network effect threshold:** Estimated at **50 active daily users** in a single commute corridor (e.g., KIU-bound direction during 8:00–10:00 AM). Below this threshold, crowding data is too sparse to drive decisions. Above it, the data becomes reliable enough that users factor it into their departure planning.

### Type: Direct Network Effect (None)

The product does not have a direct network effect — User A does not become more valuable to User B simply because User B joins. Two students on the same bus do not interact through the app. The peer location feature ("who else is on my bus?") adds mild curiosity value but does not create a meaningful network effect. A bus tracker with 1 user and a bus tracker with 1,000 users provide the same ETA information.

### Network Effect Summary

| Network Effect Type | Present? | Strength | Threshold |
|---|---|---|---|
| Direct (Metcalfe's Law) | No | None | N/A |
| Data | Weak | Low — crowding data is a nice-to-have, not core | ~50 daily active users in one corridor |
| Personal (profile/status) | No | None | N/A |
| Platform (ecosystem) | No | None | N/A |

**Conclusion:** The product does not depend on network effects to deliver its core value (bus arrival time). This is a strength for early adoption (value is immediate, not contingent on crowd size) but a weakness for defensibility (competitors can replicate the core feature without scaling a user base first).

---

## Defensibility Assessment

### Current Moat: None (MVP Phase)

Honest assessment: the product currently has no meaningful competitive moat. Any team with basic web development skills could build a bus status app in 2–3 weeks. The features we have (ETA display, crowding reports, peer locations) are implementation details, not defensible advantages.

### Potential Moats (Require Time + Scale)

| Moat Type | Can We Build It? | Time to Build | Strength If Built |
|---|---|---|---|
| **Data moat** — 6+ months of commute habit data, route preferences, peak-hour crowding patterns | Yes — collects naturally as users use the app | 1–2 semesters | Medium — data about *when* and *where* students commute is valuable for route optimization, university transit planning, and potential operator negotiations |
| **Trust / brand moat** — reputation for honest information | Yes — earned through consistent accuracy | 1+ semesters | Medium — the incumbent tracker lost trust through repeated failure. Rebuilding trust is the whole product thesis, and a brand that owns "honest bus info" in Kutaisi would be hard to displace |
| **Switching costs** — saved stops, ride history, trust score, badge progress | Moderate — users build these over time | 2+ semesters | Low — users can screenshot their ride history and recreate it elsewhere. Trust score is vanity, not switching cost |
| **Integration moat** — tied into university transit data feeds or operator GPS | Low — depends on external parties | 6+ months | High — if we become the official student-facing interface for Bus #3 data, the university and operator are unlikely to switch to a competitor |
| **Technology moat** — superior algorithm, unique features | None | N/A | None — everything we build can be copied |

### Defensibility Score: 2/10

```
Current score: 2/10
  +1 for first-mover advantage at KIU (no competing student-built app exists)
  +1 for existing interview data (12 interviews = early customer understanding)
  -4 for zero barriers to entry (any student can build a web app)
  -2 for no proprietary data or technology
  -1 for no network effects
  -1 for no integration with university systems
  -1 for no brand recognition
```

### Defensibility Strategy (Post-MVP)

If the product works and achieves traction (>200 active users), the defensibility strategy is:

1. **Go deep on data (semesters 1–2):** Accumulate commute patterns — which stops are busiest at which times, which buses are most overcrowded, how actual arrival times differ from the timetable. This data becomes the product's core asset. A competitor starting from scratch would need months to collect it.

2. **Build the institutional relationship:** Offer the university a transit dashboard showing commute pain points (overcrowding hotspots, worst delays by stop). If the university adopts it as an official tool, replacement requires an institutional decision, not just a student choosing a different URL.

3. **Embed in the student routine:** Once ride history, trust score, badges, and saved stops are built up over a full semester, switching costs become real. A student with 40 logged rides and a "Reliable" badge (50+ reports) is less likely to switch to an empty competitor.

---

## Riskiest Assumption

### The Untested Assumption That Would Kill the Business

> Students trust honest bus status information enough to change their departure behaviour.

**Why this is the riskiest:** All 12 interviewees said the existing tracker is broken. But stating a problem is not the same as adopting a solution. The real risk is that students have already built coping strategies (extreme early departure, taxi fallbacks, WhatsApp coordination) that they prefer over a third option. If the app tells them "bus in 12 minutes — ESTIMATED" and they still leave 2 hours early because they don't trust any system, the product delivers zero value regardless of how well it works technically.

**What could falsify it:**
- After one week of use, fewer than 30% of signups check the app before leaving for the stop
- Users open the app, see the status, and still leave at the same time (exit survey data from Experiment 1)
- Post-experiment interviews: "I don't trust it" — even though the information is honest

**Severity if false:** Fatal. If students won't change their behaviour, there is no product. No growth channel, pricing model, or feature can compensate for a solution to a problem users won't let themselves solve.

**Early detection signal:** GA4 event `bus_status_confirmed` firing rate declines week-over-week after the first week. A drop from 5+ queries per user per day to 1–2 by week 2 indicates users are not integrating the app into their commute routine.

**Mitigation if false:** Conduct 5–10 exit interviews with early users who stopped using the app. If the reason is distrust of any system (not just ours), the product concept is invalid and we should pivot to a non-software solution (e.g., student-organized bus captain WhatsApp network). If the reason is specific (badge wrong, ETA wrong, UI confusing), iterate and re-test.

---

## Loop and Moat Summary

| Dimension | Assessment |
|---|---|
| **Viral loop** | Present but weak (K = 0.20). Contributes to growth but no replacement for acquisition channels. |
| **Network effect** | Data network effect exists but weak. Threshold: ~50 DAU in one corridor for meaningful crowding data. |
| **Defensibility** | None today. Path to moat via data accumulation (semesters 1–2) and institutional integration (semester 2+). |
| **Riskiest assumption** | Users will trust and act on honest bus status information, even though previous systems have conditioned them not to trust any tracker. |
| **Overall score** | No moat yet. Growth dependent on direct channels. Product hypothesis unvalidated. All dependent on Experiment 1 results. |

---

## Summary Statement

Bandersnatch acquires users through Bus Stop QR flyers, student Telegram and WhatsApp groups, and in-app referral sharing. CAC is under $0.11 per user across all channels because we use organic and low-cost outbound methods rather than paid advertising. Our K-factor of 0.20 means referral shares reduce effective CAC by roughly 17% but cannot drive growth alone — the product's value is individual (finding a bus ETA), not inherently social. We have a weak data network effect: crowding data becomes useful above ~50 daily active users in one commute corridor, but the core ETA feature works for a single user. Our defensibility is currently 2/10 — no meaningful moat exists. The path to defensibility runs through commute data accumulation over 1–2 semesters and institutional integration with KIU transit. Everything hinges on Experiment 1: if students do not trust and act on honest bus status information after the previous tracker's failures, no growth channel or feature can save the product.

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial loops and moats narrative | Team Bandersnatch |
| May 14, 2026 | 1.1 | Added summary statement paragraph | Team Bandersnatch |

---

*Loops and Moats Narrative | Bandersnatch | CS-PD-2026 | Spring 2026*
