# Unit Economics Analysis

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 13, 2026
**Version:** 1.0

---

## Revenue Model

The app is currently free with no paid tier. Future monetisation options under consideration:

| Option | Model | Est. Price | Source |
|---|---|---|---|
| **Premium subscription** | Departure recommendations, ride history export, priority support | 3 GEL/month ($1) | Interview P03, P11 — unprompted willingness to pay signals |
| **University sponsorship** | KIU purchases campus-wide access for student welfare budget | ~500 GEL/semester ($140) | Industry benchmark: student transit passes at comparable institutions |
| **Phase 3 MVP** | No revenue during MVP. All metrics assume $0 ARPU until a monetisation decision is made post-checkpoint. | $0 | Decision deferred |

**Current ARPU:** $0/month (MVP)
**Projected ARPU (with premium tier):** $1/month

---

## CAC by Channel

### Channel 1 — Bus Stop QR Code Flyers

| Item | Cost | Notes |
|---|---|---|
| 100 A5 flyers (color, local print shop) | 10 GEL ($2.80) | Local print shop quote |
| Lamination (weatherproofing) | 5 GEL ($1.40) | Prevents rain damage at outdoor stops |
| Tape + staples | 5 GEL ($1.40) | Mounting at 5 bus stops |
| Design (in-house, Canva) | $0 | Team member time |
| Total campaign cost | **~$5.60** | |

**Expected signups:** 50–300 (conservative: 1% scan-to-signup from 5,000 impressions at 5 stops over 2 weeks)

**CAC:** $5.60 / 50 = **$0.11/user** (conservative)
**CAC:** $5.60 / 300 = **$0.02/user** (optimistic)

**Calculation shown:**
```
CAC = Total campaign cost / Number of new users acquired
CAC_conservative = $5.60 / 50 = $0.11
CAC_optimistic   = $5.60 / 300 = $0.02
```

### Channel 2 — Student Telegram & WhatsApp Groups

| Item | Cost | Notes |
|---|---|---|
| Post creation | $0 | Written in-house |
| Distribution | $0 | Posted by team members in existing groups |
| Total campaign cost | **$0** | |

**Expected signups:** 40+ (5% conversion from 800 group members across 6 groups)

**CAC:** $0 / 40 = **$0.00/user**

### Channel 3 — Referral (Share Status)

| Item | Cost | Notes |
|---|---|---|
| Feature development | $0 | Already in Sprint 3 roadmap (story S3-01) |
| Distribution | $0 | In-app, organic |
| Total campaign cost | **$0** | |

**Expected signups:** ~4/week (20% share rate × 20% conversion × 100 WAUs)

**CAC:** $0 / 4 = **$0.00/user**

### Blended CAC

| Channel | Cost | Expected Users (4 weeks) | CAC |
|---|---|---|---|
| QR Flyers | $5.60 | 50 | $0.11 |
| Student Groups | $0 | 40 | $0.00 |
| Referral | $0 | 16 | $0.00 |
| **Blended** | **$5.60** | **106** | **$0.05** |

```
Blended CAC = Total spend across all channels / Total new users
            = $5.60 / 106
            = $0.05
```

**Note on blended CAC:** The blended CAC will increase as the QR flyer reach saturates (same students see the same flyer repeatedly) and we need to add paid channels. We estimate blended CAC stays below $0.50 for the first 500 users.

---

## LTV Calculation

### Assumptions

| Assumption | Value | Source |
|---|---|---|
| ARPU (current) | $0/month | MVP — no paid tier |
| ARPU (projected, post-MVP) | $1/month | P03: "I would pay good money for a bus app that just told the truth" (unprompted). P11: "If it saved me one taxi fare, it would pay for itself." Benchmark: comparable transit apps charge $1–3/month. |
| Gross margin | 100% | Digital product. Firebase Spark plan is free. Vercel free tier covers MVP. No COGS per user. |
| Monthly retention (conservative) | 50% | Students commute ~5 days/week during semester. After initial curiosity, we estimate half of signups open the app in any given month. |
| Monthly retention (optimistic) | 70% | Habit-forming: if students check before every commute, they open the app 20+ times per month. The 70% figure assumes the app becomes part of the morning routine. |
| Customer lifespan (conservative) | 2 months | `1 / (1 - 0.50) = 2` |
| Customer lifespan (optimistic) | 3.3 months | `1 / (1 - 0.70) = 3.3` |

### Current LTV ($0 ARPU)

| Scenario | ARPU | Lifespan | Gross Margin | LTV |
|---|---|---|---|---|
| Current (any) | $0 | any | 100% | **$0.00** |

The app generates no revenue in its current MVP state. LTV is $0 regardless of retention. This is acceptable for Phase 1 — the goal is engagement and behaviour change validation, not revenue.

### Projected LTV ($1/month ARPU, post-MVP)

| Scenario | ARPU | Lifespan (months) | Gross Margin | LTV |
|---|---|---|---|---|
| Conservative | $1 | 2.0 | 100% | **$2.00** |
| Optimistic | $1 | 3.3 | 100% | **$3.30** |

**Calculation (conservative):**
```
LTV = ARPU × Average customer lifespan × Gross margin
    = $1/month × 2.0 months × 100%
    = $2.00
```

**Calculation (optimistic):**
```
LTV = $1/month × 3.3 months × 100%
    = $3.30
```

**Sensitivity:** If ARPU drops to $0.50 (student pricing), LTV becomes $1.00 (conservative) or $1.65 (optimistic). If retention drops to 40%, lifespan becomes 1.7 months and LTV becomes $1.70.

---

## LTV:CAC Ratio

### Per Channel (Projected, Post-MVP)

| Channel | CAC | LTV (conservative) | LTV:CAC | LTV (optimistic) | LTV:CAC |
|---|---|---|---|---|---|
| QR Flyers | $0.11 | $2.00 | **18.2:1** | $3.30 | **30.0:1** |
| Student Groups | $0.00 | $2.00 | ∞ | $3.30 | ∞ |
| Referral | $0.00 | $2.00 | ∞ | $3.30 | ∞ |

### Blended

| Scenario | Blended CAC | LTV | LTV:CAC |
|---|---|---|---|
| Conservative | $0.05 | $2.00 | **40:1** |
| Optimistic | $0.05 | $3.30 | **66:1** |

### Interpretation

**Current reality:** LTV:CAC is undefined (LTV = $0). The product is in validation phase, not revenue phase. Until we confirm that users reduce their buffer time by 10+ minutes (Experiment 1), monetisation is premature. A high LTV:CAC ratio at $0 ARPU does not mean the business works — it means acquisition is cheap because we are using free channels.

**Post-MVP scenario:** If the product works and users are willing to pay $1/month, the LTV:CAC ratios above 18:1 are excellent by any standard. The industry benchmark for healthy SaaS is 3:1. Ratios above 10:1 typically mean you are under-investing in growth — we should increase spend once we have product-market fit evidence.

**Caveat on free channels:** Channel 2 (student groups) has $0 CAC but a hard ceiling. Once all relevant groups have been posted in, the channel is exhausted. We cannot scale it beyond the existing group audiences. The unlimited LTV:CAC on free channels is real but non-scalable.

---

## Payback Period

Payback period measures how long it takes to recover the cost of acquiring a customer.

### Current ($0 ARPU)

**Payback period: ∞** (no revenue to recover cost)

### Projected ($1/month ARPU, Post-MVP)

| Channel | CAC | Monthly Net Revenue | Payback Period |
|---|---|---|---|
| QR Flyers | $0.11 | $1.00 | **~0.1 months (~3 days)** |
| Student Groups | $0.00 | $1.00 | **Immediate** |
| Referral | $0.00 | $1.00 | **Immediate** |
| **Blended** | **$0.05** | **$1.00** | **~0.05 months (~1.5 days)** |

```
Payback period = CAC / Monthly net revenue
QR Flyers: $0.11 / $1.00 = 0.11 months = ~3 days
Blended: $0.05 / $1.00 = 0.05 months = ~1.5 days
```

Industry benchmark for SaaS payback period: <12 months is healthy. Our projected payback period of under 1 week is extremely strong — but only if the product is good enough that users actually pay.

---

## Sensitivity Analysis

| Variable | Conservative | Base | Optimistic |
|---|---|---|---|
| ARPU | $0.50 | $1.00 | $2.00 |
| Monthly retention | 40% | 50% | 70% |
| Customer lifespan (months) | 1.7 | 2.0 | 3.3 |
| **LTV** | **$0.85** | **$2.00** | **$6.60** |
| Blended CAC | $0.50 (if paid channels needed) | $0.05 | $0.02 (if QR flyer efficiency improves) |
| **LTV:CAC** | **1.7:1** (lowest) | **40:1** (base) | **330:1** (best case) |

**Stress test:** If ARPU is $0.50 AND retention is 40% AND CAC rises to $0.50 (paid channels), LTV:CAC drops to 1.7:1. This is still above the 1:1 breakeven line but below the 3:1 healthy benchmark. At this point we would need to either raise prices or find cheaper channels.

---

## Assumption Sources

| Assumption | Source |
|---|---|
| Willingness to pay | Interview P03, P11 — unprompted "I would pay for this" statements |
| Bus stop foot traffic (200–400/day) | Team observation: morning peak at KIU Main Gate has 50+ students waiting per 30-min cycle, 3+ cycles per morning |
| QR scan-to-signup rate (1–3%) | Industry benchmark for QR code campaigns targeting college students (source: HubSpot QR code benchmarks, 2024) |
| Group post signup rate (5%) | Estimated based on team experience: ~5% of lurkers in student groups act on posted links |
| Referral K-factor (0.2) | Conservative estimate for a utility app with no incentive program (source: Lenny's Newsletter, B2C referral benchmarks) |
| Monthly retention (50–70%) | Estimated for a commute-frequency product. Daily-use products see 60–80% monthly retention. We use 50% conservatively since commute is 5 days/week, not 7. |
| Comparable transit app pricing | Bolt: $0.50/ride; Citymapper Premium: $3/month; Moovit: free with ads (source: respective app stores, April 2026) |

---

## Honest Uncertainty Statement

These numbers are estimates based on a small sample (12 interviews + team observation). The actual CAC, retention, and willingness to pay will be measured in Experiment 1 and the first 4 weeks of live operation.

| Unknown | Current placeholder | When we will have real data |
|---|---|---|
| Actual QR scan-to-signup rate | 1–3% (industry benchmark) | After 2 weeks of flyers (by Jun 2) |
| Actual group post conversion | 5% | After first group post (within 1 week) |
| Actual monthly retention | 50–70% | After 1 month of GA4 event tracking (by Jun 19) |
| Actual willingness to pay at $1/month | P03, P11 only | After premium tier experiment (planned for post-MVP) |
| Actual referral K-factor | 0.2 | After invite feature ships (post Sprint 3) |

We commit to updating this document with real data once available. Until then, all ratios should be treated as pre-launch estimates.

---

## Refinement Schedule

| # | Currently | Replace by | How |
|---|-----------|------------|-----|
| QR scan-to-signup rate | 1–3% (HubSpot campus benchmark) | Jun 2 | UTM-tagged QR codes on flyers; measure actual scans vs. signups from 2 weeks of flyer deployment |
| Group post conversion rate | 5% (team estimate) | May 26 | First group post within 1 week; track UTM-sourced signups from each group |
| Monthly retention (D30) | 50–70% (commute-frequency estimate) | Jun 19 | GA4 cohort analysis after 1 month of live data; plot D7, D14, D30 retention curves |
| Referral K-factor | 0.2 (Lenny's Newsletter benchmark) | After Sprint 3 | In-app `invite_sent` and `invite_signed_up` events; recalculate K from real data once referral feature ships |
| Willingness to pay at $1/month | P03, P11 only (2 unprompted signals) | Post-MVP | Premium tier experiment with 2-week free trial; measure opt-in rate at $1/month |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial unit economics | Team Bandersnatch |
| May 14, 2026 | 1.1 | Added refinement schedule for assumption validation timeline | Team Bandersnatch |

---

*Unit Economics Analysis | Bandersnatch | CS-PD-2026 | Spring 2026*
