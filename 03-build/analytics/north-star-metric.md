# North Star Metric

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** April 21, 2026
**Version:** 1.0

---

## Our North Star Metric

```
[Number] of [action] per [user/team] per [time period]
```

**Written out:**

> Weekly reliable arrival confirmations received per active user per commute week

---

## Why This Metric

**Question 1: What is the core action a user takes that proves they got value from our product?**

The core action is when a user receives a confirmed bus status that allows them to make an informed decision about when to leave for the bus stop. This is not just opening the app — it is receiving information that eliminates the uncertainty that currently forces fear-based early departure. When a user can trust the information and arrive just on time without anxiety, they have received value.

**Question 2: Can we measure it? Is it a discrete, countable event?**

Yes. Each time a user receives a `bus_status_confirmed` event in our schema, it is logged with the user_id and timestamp. We can count the number of confirmed status queries per user per week. This directly maps to the weekly reliable arrival confirmations metric.

**Question 3: Does it change when our product gets better or worse?**

If we ship a bad release that provides false or misleading information, users will stop using the app or return to their fear-based coping strategies. The weekly confirmation count would drop. If the app provides accurate, honest information, the count increases as users trust the system more and reduce their buffer times.

---

## What Our NSM Is Not

| Alternative Metric | Why We Rejected It |
|-------------------|--------------------|
| Daily active users | Active doing what? Checking the app is not the same as receiving value. A user could open the app and see wrong info. |
| Total signups | Measures acquisition, not value. A user can sign up and never return if the information is unreliable. |
| Number of bus status queries | Activity metric, not outcome. A user could query 10 times and still not trust the information. |
| Reduction in wait time | Difficult to measure baseline. We cannot track how long they waited before using our product. |

---

## Connection to AARRR

- [ ] Acquisition
- [x] Activation (most NSMs live here)
- [ ] Retention
- [ ] Referral
- [ ] Revenue

**Stage:** Activation

**Why:** The NSM measures the moment when a user receives reliable information that allows them to make an informed commute decision — the "aha moment" where the product delivers on its promise of honest, real-time bus tracking.

---

## Connection to Prototype

Which screen in our Stitch prototype directly drives this metric?

**Screen name:** Bus Status Confirmation Screen

**What the user does on that screen:** User enters their bus stop location and receives a confirmed bus arrival status (e.g., "Bus #3 arriving in 8 minutes — CONFIRMED")

**Event that fires:** `bus_status_confirmed`

**How that event feeds the NSM:** Each `bus_status_confirmed` event increments the weekly count for that user_id. The NSM aggregates: "weekly reliable arrival confirmations per active user"

---

## Team Sign-Off

All team members reviewed and agreed on this NSM:

| Name | Role | Agreement |
|------|------|-----------|
| Nikoloz Kvirikashvili | Program Lead | ☐ Agreed |
| Nikoloz Modebadze | Discovery Lead | ☐ Agreed |
| Giorgi Mikaberidze | Tech Lead | ☐ Agreed |
| Besik Meskhia | Flexible | ☐ Agreed |

**Date agreed:** April 21, 2026

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| April 21, 2026 | Initial definition | Lab 5 |

---

*North Star Metric | Bandersnatch | CS-PD-2026 | Spring 2026*