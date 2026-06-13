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

### Expansion Economics Thesis

Bandersnatch starts with KIU Bus #3 because that route is the validated pain point, but the product is not structurally limited to one route. The underlying workflow - choose a stop, check an honest arrival signal, see confidence/freshness, and optionally add a rider report - is the same workflow needed by bus commuters in other Georgian cities.

Tbilisi already shows that Georgian riders understand and expect live bus visibility when the city has the infrastructure to support it. The gap is that students and riders in smaller cities do not consistently receive the same reliable, user-friendly pre-departure experience. This makes Kutaisi a focused proof market, not the ceiling of the opportunity.

The strongest post-MVP economics come from city or operator partnerships. If a municipality shares its built-in bus GPS feed, Bandersnatch no longer depends on peer-collected location reports as the primary location source. Peer reporting remains useful for freshness checks, crowding, delays, and rider trust, but the baseline bus position becomes official and exact. That lowers operational risk, improves user trust, and allows the same lightweight interface to expand across routes with limited additional build cost.

| Expansion lever | Economic impact | Why it matters |
|---|---|---|
| Reuse the same app flow across cities | Lower marginal product cost per new route | Most Georgian city bus systems share the same basic rider need: stop, direction, ETA, confidence, and disruption context |
| Municipal bus GPS integration | Lower data collection burden and higher accuracy | Official bus location removes the need to bootstrap every route only from peer reports |
| Peer reports retained as a trust layer | Better accuracy without high operating cost | Riders can still confirm crowding, missed buses, stale GPS, and on-the-ground disruptions |
| City/university sponsorship | Revenue can shift from individual students to institutions | Institutions benefit from reduced commute uncertainty and aggregate route-performance insight |

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

**Channel:** Bus Stop QR Code Flyers
**Total spend:** $5.60
**Customers acquired:** 50
**CAC:** total spend / customers = $5.60 / 50 = $0.11

### Channel 2 — Student Telegram & WhatsApp Groups

| Item | Cost | Notes |
|---|---|---|
| Post creation | $0 | Written in-house |
| Distribution | $0 | Posted by team members in existing groups |
| Total campaign cost | **$0** | |

**Expected signups:** 40+ (5% conversion from 800 group members across 6 groups)

**Channel:** Student Messenger Groups
**Total spend:** $0.00
**Customers acquired:** 40
**CAC:** total spend / customers = $0.00 / 40 = $0.00

### Channel 3 — Referral (Share Status)

| Item | Cost | Notes |
|---|---|---|
| Feature development | $0 | Already in Sprint 3 roadmap (story S3-01) |
| Distribution | $0 | In-app, organic |
| Total campaign cost | **$0** | |

**Expected signups:** ~4/week (20% share rate × 20% conversion × 100 WAUs)

**Channel:** Referral (Share Status)
**Total spend:** $0.00
**Customers acquired:** 4
**CAC:** total spend / customers = $0.00 / 4 = $0.00

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
| Monthly retention (conservative) | 50% | We use 50% as a working estimate until we have 4+ weeks of post-launch cohort data. |
| Monthly retention (optimistic) | 70% | We use 70% as a working estimate assuming the app becomes part of the daily morning routine. |
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
**ARPU (monthly):** $1.00
**Gross margin:** 100%
**Average lifetime:** 2.0 months
**LTV:** ARPU × margin × lifetime = $1.00 × 100% × 2.0 = $2.00

**Calculation (optimistic):**
**ARPU (monthly):** $1.00
**Gross margin:** 100%
**Average lifetime:** 3.3 months
**LTV:** ARPU × margin × lifetime = $1.00 × 100% × 3.3 = $3.30

**Sensitivity:** If ARPU drops to $0.50 (student pricing), LTV becomes $1.00 (conservative) or $1.65 (optimistic). If retention drops to 40%, lifespan becomes 1.7 months and LTV becomes $1.70.

### Partnership LTV Upside

The $1/month student subscription model is intentionally conservative because it assumes every paying user must be converted individually. A municipal or university agreement changes the economics:

| Model | Conservative contract | Users covered | Effective annual revenue per covered user |
|---|---|---|---|
| KIU sponsorship | 500 GEL/semester, 2 semesters | 400 Bus #3 commuters | 2.50 GEL/year |
| Small-city pilot | 3,000 GEL/year per city or operator | 1,000 regular route users | 3.00 GEL/year |
| Multi-route city license | 10,000 GEL/year | 5,000 regular route users | 2.00 GEL/year |

These are not included in the base LTV:CAC ratio because no partnership has been signed. They show why the product becomes more attractive after GPS access: the city already owns the location data, while Bandersnatch supplies the rider-facing layer, confidence labels, reporting loop, and analytics. In that model, CAC is concentrated into partnership development rather than one-by-one user acquisition.

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

**QR Flyers:** Payback period = CAC / (ARPU × margin) = $0.11 / ($1.00 × 100%) = 0.11 months = ~3 days
**Blended:** Payback period = CAC / (ARPU × margin) = $0.05 / ($1.00 × 100%) = 0.05 months = ~1.5 days

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

### Rollout Cost Sensitivity

The main scaling risk is not rebuilding the app for each city. It is whether we can access trustworthy live location data. Without a city agreement, each new route needs enough active riders to seed reliable peer reports. With a city GPS feed, the marginal rollout is mostly configuration: routes, stops, translations, local onboarding, and QA.

| Scenario | Data source | Rollout complexity | Economics implication |
|---|---|---|---|
| Peer-only expansion | Rider reports and schedule estimates | Medium | Cheap to launch, but slower to earn trust in a new city |
| Hybrid expansion | City GPS plus peer confirmation | Low to medium | Best case: accurate location from day one, community layer improves confidence |
| Official white-label | City/operator GPS and sponsored distribution | Medium | Higher partnership effort, but stronger recurring revenue and lower consumer CAC |

This is why the roadmap prioritizes a bus operator data conversation. A deal with the city would eliminate the largest variable cost in accuracy - collecting enough location reports - while preserving the community reporting loop that makes the app more honest than a basic official tracker.

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
| Tbilisi precedent | User-provided market observation: Tbilisi riders already have a form of live bus visibility, while comparable smaller-city experiences remain inconsistent |
| Municipal GPS expansion | Product architecture assumption: if a city/operator grants access to built-in bus GPS, peer reports become an accuracy and trust layer rather than the primary location source |

---

## Honest Uncertainty Statement

These numbers are estimates based on a small sample (12 interviews + team observation). The actual CAC, retention, and willingness to pay will be measured in Experiment 1 and the first 4 weeks of live operation.

| Unknown | Current estimate | When we will have real data |
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
| June 11, 2026 | 1.2 | Added expansion economics thesis covering Tbilisi precedent, smaller-city rollout, and municipal GPS partnership upside | Team Bandersnatch |

---

*Unit Economics Analysis | Bandersnatch | CS-PD-2026 | Spring 2026*
