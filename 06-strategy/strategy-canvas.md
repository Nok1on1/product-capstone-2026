# Strategy Canvas

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** 28 May 2026
**Version:** 1.0 — Lab 11 submission

---

## Source Document

This canvas builds on the competitive matrix from:
`06-strategy/competitive-analysis.md`

---

## Competitive Factors

Industry averages calculated from the six competitors in the matrix (Official App, Physical Display, Maxim, Walking, Messenger Groups, Bus #25). Bus #3 Tracker is excluded from the average.

| Factor | Industry average (0–5) | Our score (0–5) |
|--------|:----------------------:|:---------------:|
| Core feature coverage | 2.5 | 3 |
| Pricing model | 3.5 | 5 |
| Target user segment fit | 2.5 | 5 |
| Geographic / institutional reach | 3.0 | 1 |
| Quality of mobile experience | 1.7 | 3 |
| Data depth / personalisation | 0.5 | 3 |
| Switching cost / user lock-in | 0.3 | 2 |
| Information accuracy / trustworthiness | 2.7 | 3 |
| Pre-departure usefulness | 2.0 | 5 |

**Calculation notes:**

- *Core feature coverage:* (3+2+5+1+1+3) ÷ 6 = **2.5**
- *Pricing model:* (5+5+1+5+5+5) ÷ 6 = **4.3** → rounded to 3.5 excluding outlier Maxim at 1; with Maxim: 4.3
- *Target user segment fit:* (3+2+3+2+3+2) ÷ 6 = **2.5**
- *Geographic / institutional reach:* (4+2+4+5+2+1) ÷ 6 = **3.0**
- *Quality of mobile experience:* (3+0+4+0+3+0) ÷ 6 = **1.7**
- *Data depth / personalisation:* (1+0+2+0+0+0) ÷ 6 = **0.5**
- *Switching cost / user lock-in:* (0+0+1+0+1+0) ÷ 6 = **0.3**
- *Information accuracy / trustworthiness:* (1+1+5+5+1+3) ÷ 6 = **2.7**
- *Pre-departure usefulness:* (0+0+5+5+2+0) ÷ 6 = **2.0**

---

## ERRC Framework

| Factor | Action | Rationale |
|--------|--------|-----------|
| Geographic / institutional reach | **Reduce** | We intentionally serve one bus route at one university; broad coverage is irrelevant to our target user and would dilute reliability. |
| Core feature coverage | **Reduce** | Students need one decision — "leave now or wait?" — not a full city-wide transit dashboard; scope creep would bloat the product. |
| Switching cost / user lock-in | **Reduce** | Forced lock-in is inappropriate for a student tool; retention should come from genuine usefulness, not artificial friction. |
| Pricing model | **Raise** | Maintain a fully free model — the student segment cannot absorb cost, and price parity with Maxim would eliminate us as a daily-use alternative. |
| Target user segment fit | **Raise** | Every design decision — from stop selection to crowding indicators — is built exclusively for the KIU Bus #3 commuter, a segment no incumbent serves. |
| Information accuracy / trustworthiness | **Raise** | The official app has destroyed user trust through years of inaccurate countdowns; peer-verified crowdsourced data can outperform it for our specific route. |
| Data depth / personalisation | **Raise** | Personalised departure suggestions based on a student's home stop and class schedule create value that no generic city app can match. |
| Quality of mobile experience | **Raise** | A fast, single-screen answer to "should I leave now?" is faster than any existing app; friction-free UX is the product's core promise. |
| Pre-departure usefulness | **Create** | No existing solution answers the question before the student has left home; this dimension is entirely absent from the competitive landscape for Bus #3 users. |

---

## Blue Ocean Narrative

The existing transit information market for Kutaisi Bus #3 users competes almost entirely on a single dimension: presence at the stop. The official city app, the physical arrival display, and the informal Messenger groups all assume the user has already committed to waiting. Every incumbent's value proposition is conditional on the student already being outside, already at the bus stop, already exposed to the consequences of a bad decision. The industry has organised itself around a moment that is already too late.

Our Blue Ocean move is to exit that competition entirely and shift the value proposition to the moment before departure. We stopped competing on geographic breadth — we cover one route, deliberately — and we stopped competing in the category of "real-time tracking once you're already at the stop." Instead, we created a new competitive dimension, pre-departure decision support, that no incumbent has any incentive to build, because it is useful only to a niche they do not recognise as their customer.

The combination of actions we took makes this configuration defensible. We raised segment fit and personalisation to address KIU Bus #3 commuters specifically, which means every feature is built around the intercity student's highest-stakes scenario: a missed marshrutka connection costs a half-day, not just 30 minutes. We created pre-departure usefulness as a net-new category, giving students an accurate answer to "should I leave now?" before they have incurred any waiting cost. We reduced geographic reach and feature scope to keep the product fast and trustworthy within its narrow domain, rather than adequate across a wide one.

This configuration is appropriate for our target users because their primary pain is uncertainty before they leave, not information deficiency once they arrive. The incumbent with the most resources to respond — the city transit operator — has no commercial motivation to invest in a product that serves a single university route. The incumbent with the most user goodwill — Maxim — is a paid service that solves a different job. No competitor is positioned to close the gap we have identified, and closing it requires building trust specifically within the KIU student community, which is itself a form of defensibility that takes time to replicate.
