# Growth Strategy Document

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 18, 2026
**Version:** 2.0

---

## Activation Metric

State your activation metric precisely. A vague definition is not gradeable.

**Activated user definition:**
A user is activated when they receive **one confirmed bus status** (`bus_status_confirmed`) at their selected Bus #3 stop within **24 hours** of completing signup (`user_signup_completed`).

**Activation number:** One confirmed bus status.

**Time window:** Within 24 hours of signup.

**Why this action indicates real value delivered:**
From our 12 user interviews, every participant described guessing when to leave and compensating by leaving 30+ minutes early. The aha moment is replacing that guess with a reliable number — e.g., "Bus #3 arriving in 8 minutes — CONFIRMED" — so the user can time their departure. This maps to our north star metric (weekly reliable arrival confirmations) and fires only when real-time data is available, not on a generic page view.

**Current activation rate (from your data or benchmark):**
We do not yet have live cohort data. **Assumption: 31% of signups** reach `bus_status_confirmed` within 24 hours — aligned with marketplace activation benchmarks (25–40%; source: Lab 9 worked example). **Team target: 70%** by end of Sprint 2 after onboarding improvements; we will replace the assumption with GA4 D1 cohort data by Jun 19.

---

## Acquisition Channel Strategy

### Primary Channel

**Channel name:** Bus stop QR flyers at 5 Route #3 stops (KIU Main Gate, K Building, Colchis Fountain, Railway Station, Tsereteli Uni)

**Channel type:** Organic

**Why this channel fits our product and audience:**
The target user is physically at these stops 2–5 times per day, phone in hand, at peak pain. A student scanning at 8:30 AM while waiting for a delayed bus is the highest-intent user possible. Interview P08: "I waited for an hour. I was just standing there scrolling TikTok." The flyer intercepts that moment. We go deep on this channel in Sprint 2 — our only paid-out-of-pocket spend (~$5.60).

**How we will use it in Sprint 2:**
Print 100 A5 laminated flyers with UTM-tagged QR codes; post at all 5 stops by Week 1; replenish weekly; measure scan-to-signup via GA4 `referral_source=qr_flyer`.

**Estimated CAC via this channel:**
See `04-gtm/financials/unit-economics.md` — Channel 1: **$0.66** (Month 1, Expected Case).

**Scale ceiling:**
Limited by foot traffic at five stops and flyer decay (~2,500 unique visitors/month before saturation). Cannot scale beyond Kutaisi Bus #3 corridor without adding stops or channels.

---

### Secondary Channel

**Channel name:** KIU student Telegram and WhatsApp groups (Bus #3 commuter chat, Student Council, year-group groups)

**Channel type:** Organic

**Why this channel fits our product and audience:**
Students already coordinate "is the bus here yet?" in these groups (Interview P11). Zero acquisition cost; peers are the trusted recommendation source. All 12 interview participants are in overlapping groups — authentic testimonials available.

**How we will use it in Sprint 2:**
One formatted post per group (6 groups, ~800 reachable members) in Week 1; UTM links per group; no repeat posts (spam risk). Seed users before QR flyers peak.

**Estimated CAC via this channel:**
See unit economics — Channel 2: **$0.00** (non-scalable; one-shot per group per semester).

**Scale ceiling:**
~800 students across known groups. One post per group per semester — channel exhausts after initial blast (~40 signups estimated).

---

### Tertiary Channel

**Channel name:** In-app "Share bus status" link (Sprint 3 story S3-01)

**Channel type:** Viral

**Why this channel fits our product and audience:**
Users already coordinate departures with friends on the same route (Interview P02: "My friend also takes the same bus"). Share sends a teaser link with live ETA; friend signs up to get the same status. Compounds as user base grows but requires product feature shipped.

**How we will use it in Sprint 2:**
Model at K = 0.20 in growth projection; ship share feature mid-Sprint 2 if capacity allows; track `invite_sent` and signup attribution in GA4. $0 spend.

**Estimated CAC via this channel:**
See unit economics — Channel 3: **$0.00** direct spend; effective CAC reduction via viral coefficient.

**Scale ceiling:**
K = 0.20 (below viral threshold of 1.0) — supplements organic channels but cannot replace them. ~4 new users/week at 100 WAUs until base grows.

---

## Channel Priority Ranking

| Priority | Channel | Type | Rationale |
|----------|---------|------|-----------|
| 1 | Bus stop QR flyers | Organic | Highest contextual fit — captures users at the exact moment of pain; only channel with deliberate Sprint 2 spend and measurable UTM. |
| 2 | Telegram & WhatsApp groups | Organic | Fastest time-to-first-user (hours) and $0 cost, but one-shot per group — seed only, not scalable. |
| 3 | Share bus status referral | Viral | Compounds over time at $0 spend but slowest to start and weakest magnitude (K = 0.20); deferred until feature ships and base exists. |

---

## Channels We Are Not Pursuing in Sprint 2 and Why

| Channel type | Reason not pursuing now |
|-------------|------------------------|
| Paid | $0 marketing budget. Instagram/Facebook targeting "Kutaisi, 18–25, KIU" yields ~$20/user vs ~$0.11 QR (CPM $8–12, 0.5% CTR, 10% signup). Bus #3 commuters cannot be targeted separately from non-commuters. Timing mismatch: ad at 10 PM vs need at 7:30 AM bus stop. Revisit after PMF evidence and grant budget. |
| Sales | B2C student utility with no supply-side or institutional buyer in Sprint 2. No facility managers or operators to outbound to until university transit dashboard is built post-traction. |

---

## Connection to Growth Projection

The channels above feed directly into `04-gtm/growth-projection.xlsx` (Expected, Best, Worst tabs). Conversion rates and cost inputs are documented in `04-gtm/financials/unit-economics.md` and sourced in the spreadsheet **Assumptions** tab. Scenario sensitivity: **signup-to-activation rate** ±50% (31% expected, 46.5% best, 15.5% worst) — our highest product risk is whether students trust and act on confirmed status after prior tracker failures.

---

## Assumptions That Would Invalidate This Strategy

| Assumption | If False, Fallback |
|---|---|
| Students will scan a QR code at a bus stop | Coffee-coupon incentive experiment; hand out flyers in person at peak hours if scan rate &lt; 1%. |
| Group admins will allow the post | Contact admins first; individual DMs if blocked. |
| Students will share bus status without incentive | User interviews on friction; one-tap share if share rate &lt; 10%. |
| App provides reliable ETAs | Fix data source first (Risk R2) — no channel compensates for broken product. |

---

## Open Questions

1. Actual QR scan-to-signup rate at KIU stops (benchmark: 1–3%, HubSpot campus QR).
2. Group post conversion vs 5% assumption.
3. Referral share rate vs 20% assumption.
4. Acquisition drop during exam weeks and semester breaks.

---

## Sign-off

All team members have reviewed and agreed on this strategy:

| Name | Role | Date |
|------|------|------|
| Nikoloz Modebadze | Discovery Lead | May 18, 2026 |
| Nikoloz Kvirikashvili | Program Lead | May 18, 2026 |
| Giorgi Mikaberidze | Tech Lead | May 18, 2026 |
| Besik Meskhia | Flexible | May 18, 2026 |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial growth strategy | Team Bandersnatch |
| May 14, 2026 | 1.1 | Added activation metric, channel ranking | Team Bandersnatch |
| May 18, 2026 | 2.0 | Lab 9 alignment: activation format, Organic/Organic/Viral types, template sections | Team Bandersnatch |

---

*Growth Strategy Document | Bandersnatch | CS-PD-2026 | Spring 2026*
