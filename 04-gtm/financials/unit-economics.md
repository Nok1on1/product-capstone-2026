# Unit Economics Analysis

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 18, 2026
**Version:** 2.0

---

## Formulas Used

```
CAC = total spend on acquiring users through this channel / number of users acquired

LTV = ARPU x gross margin percentage x average customer lifetime in months

LTV:CAC ratio = LTV / CAC

Payback period = CAC / (ARPU x gross margin percentage)  expressed in months
```

For free products where ARPU is zero, substitute monetisable value per user per month (see note below).

---

## Free Product Monetisable Value Note

The app is currently free (MVP ARPU = $0). For LTV calculations we use a monetisable value substitute.

**Our monetisable value per user per month:** $1.00 USD

**Justification:** Interview P03 (unprompted willingness to pay) and P11 ("If it saved me one taxi fare, it would pay for itself"). Median stated WTP ~$1.85/month; we use $1.00 conservatively vs planned premium tier at 3 GEL/month (~$1).

**Source:** Interview data (P03, P11); benchmark — Citymapper Premium ~$3/month (App Store, Apr 2026).

**Gross margin:** 85% — Vercel/Firebase free tier now; 15% reserved for future infra (matches Lab 9 worked example).

**Average customer lifetime:** 6 months — academic semester / year proxy (students who adopt during commute season use through term end).

**LTV (shared across channels):**
```
LTV = $1.00 x 0.85 x 6 = $5.10
```

---

## Channel 1: Bus Stop QR Flyers

**Channel type:** Organic

### Customer Acquisition Cost

| Input | Value | Source |
|-------|-------|--------|
| Total spend this month | $5.60 | Team budget — print + lamination at 5 stops |
| Customers acquired (Retained D30, M1) | 8.5 | Growth projection Expected Case M1 |
| **CAC** | **$0.66** | |

**Arithmetic shown:**
```
CAC = $5.60 / 8.5 = $0.66
```

**Conversion funnel for this channel:**

| Stage | Rate | Source |
|-------|------|--------|
| Impression to visitor (scan) | 2% of foot-traffic impressions | Assumption — HubSpot campus QR benchmark; will replace with UTM scan data |
| Visitor to signup | 22% | Assumption — landing-page proxy until QR-specific data |
| Signup to activation | 31% | Assumption — `bus_status_confirmed` within 24h; benchmark 25–40% |
| Activated to D30 retained | 50% | Assumption — commute utility apps 40–60% D30 |

---

### Lifetime Value

| Input | Value | Source |
|-------|-------|--------|
| ARPU (monetisable value substitute) | $1.00/month | Interviews P03, P11 |
| Gross margin | 85% | Assumption — future infrastructure |
| Average customer lifetime | 6 months | Assumption — semester length |
| **LTV** | **$5.10** | |

**Arithmetic shown:**
```
LTV = $1.00 x 0.85 x 6 = $5.10
```

---

### Ratio and Payback

| Metric | Value | Assessment |
|--------|-------|------------|
| LTV:CAC ratio | 7.7:1 | Above 3:1 healthy benchmark |
| Payback period | 0.78 months (~23 days) | Well under 12-month SaaS benchmark |

**Payback arithmetic:**
```
Payback = $0.66 / ($1.00 x 0.85) = $0.66 / $0.85 = 0.78 months
```

---

## Channel 2: KIU Telegram & WhatsApp Groups

**Channel type:** Organic

### Customer Acquisition Cost

| Input | Value | Source |
|-------|-------|--------|
| Total spend this month | $0.00 | Free — team-written posts |
| Customers acquired (Retained D30, M1) | 6.2 | Growth projection Expected Case M1 |
| **CAC** | **$0.00** | |

**Arithmetic shown:**
```
CAC = $0.00 / 6 = $0.00
```

**Conversion funnel for this channel:**

| Stage | Rate | Source |
|-------|------|--------|
| Group reach to link click | 8% | Assumption — will track with UTM in Sprint 2 |
| Visitor to signup | 5% | Team estimate from student group behaviour |
| Signup to activation | 31% | Assumption — same activation definition |
| Activated to D30 retained | 50% | Assumption — same as Channel 1 |

---

### Lifetime Value

Same LTV as Channel 1 — user quality not materially different.

| Input | Value | Source |
|-------|-------|--------|
| ARPU or substitute | $1.00/month | Interviews P03, P11 |
| Gross margin | 85% | Assumption |
| Average lifetime | 6 months | Assumption |
| **LTV** | **$5.10** | |

---

### Ratio and Payback

| Metric | Value | Assessment |
|--------|-------|------------|
| LTV:CAC ratio | Undefined at $0 CAC | Non-scalable — channel exhausts after one post per group |
| Payback period | 0 months | Immediate — no acquisition spend |

**Note:** $0 CAC inflates LTV:CAC. Post-scale stress test at blended CAC $0.50 yields LTV:CAC **10.2:1** — still healthy.

---

## Channel 3: Share Bus Status (Referral)

**Channel type:** Viral

### Customer Acquisition Cost

| Input | Value | Source |
|-------|-------|--------|
| Total spend this month | $0.00 | In-app; Sprint 3 feature |
| Customers acquired (Retained D30, M1) | 0 | Feature ships M2 in projection |
| **CAC** | **$0.00** | M1; M2+ derived from K-factor |

**Arithmetic shown (M2 example):**
```
CAC = $0.00 / 2 retained = $0.00
```

**Conversion funnel for this channel:**

| Stage | Rate | Source |
|-------|------|--------|
| Invitations per user per month | 0.8 | Assumption — no share feature data yet |
| Invitation to signup | 25% | Proxy from landing-page conversion |
| Signup to activation | 31% | Assumption |
| Activated to D30 retained | 50% | Assumption |

**K-factor:** K = 0.8 x 0.25 = **0.20** (Lenny's Newsletter B2C referral benchmark)

---

### Lifetime Value

| Input | Value | Source |
|-------|-------|--------|
| ARPU or substitute | $1.00/month | Interviews P03, P11 |
| Gross margin | 85% | Assumption |
| Average lifetime | 6 months | Assumption |
| **LTV** | **$5.10** | |

---

### Ratio and Payback

| Metric | Value | Assessment |
|--------|-------|------------|
| LTV:CAC ratio | Undefined at $0 spend | Loop reduces blended CAC ~17% at K = 0.20 |
| Payback period | 0 months | No direct acquisition cost |

---

## Blended Summary

| Channel | CAC | LTV | LTV:CAC | Payback (months) | Weight in mix |
|---------|-----|-----|---------|------------------|---------------|
| QR Flyers | $0.66 | $5.10 | 7.7:1 | 0.78 | 58% (8.5 of 14.7 M1 retained) |
| Student Groups | $0.00 | $5.10 | — | 0 | 42% (6.2 of 14.7 M1 retained) |
| Referral | $0.00 | $5.10 | — | 0 | 0% M1 |
| **Blended** | **$0.38** | **$5.10** | **13.4:1** | **0.45** | 100% |

**Blended CAC arithmetic (Month 1):**
```
Blended CAC = Total spend / Total Retained D30
            = $5.60 / 14.7
            = $0.38
```

**Blended payback:**
```
Payback = $0.38 / ($1.00 x 0.85) = 0.45 months (~14 days)
```

**Stress test (post-scale):** If paid channels raise CAC to $0.50 and LTV stays $5.10, LTV:CAC = **10.2:1**. If ARPU falls to $0.50, retention 40%, lifetime 1.7 months (LTV $0.72) and CAC $0.50, LTV:CAC = **1.4:1** — below 3:1; we would raise price or shift to lower-CAC organic channels.

---

## Assumptions Register

| Assumption | Current value | Plan to validate | Target date |
|------------|---------------|------------------|-------------|
| Monetisable value ($1/month) | $1.00 | Premium tier experiment | Post-MVP |
| QR scan-to-signup | 22% visitor→signup | UTM-tagged QR flyers | Jun 2, 2026 |
| Group post conversion | 5% | First group post UTMs | May 26, 2026 |
| Signup→activation | 31% | GA4 `bus_status_confirmed` D1 cohort | Jun 19, 2026 |
| D30 retention | 50% M1 → 55% M6 | GA4 cohort analysis | Jun 19, 2026 |
| Referral K-factor | 0.20 | `invite_sent` / signup events | After Sprint 3 |
| Gross margin | 85% | Infrastructure cost audit | Post-checkpoint |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial unit economics | Team Bandersnatch |
| May 14, 2026 | 1.1 | Refinement schedule | Team Bandersnatch |
| May 18, 2026 | 2.0 | Lab 9 template: monetisable value, funnels, payback, blended | Team Bandersnatch |

---

*Unit Economics Analysis | Bandersnatch | CS-PD-2026 | Spring 2026*
