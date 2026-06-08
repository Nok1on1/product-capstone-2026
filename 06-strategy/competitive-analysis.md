# Competitive Analysis

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** 28 May 2026
**Version:** 1.0 — Lab 11 submission

---

## Source Document

This analysis builds on the competitive landscape seed compiled in Lab 4:
`01-discovery/competitive-landscape-seed.md`

---

## Competitor Matrix

Score each competitor on each dimension from 0 to 5.

**Scoring guide:**
- **5** = Excellent. This is a genuine strength of this competitor.
- **4** = Good. Above the average offering in this dimension.
- **3** = Adequate. Meets the minimum expected standard.
- **2** = Weak. Present but poorly executed.
- **1** = Minimal. Barely present.
- **0** = Absent. This dimension does not exist in this product.

Score your own product honestly. A product that scores 5 on every dimension is not credible to investors or judges.

| Dimension | Official Tracking App | Physical Display at Stop | Maxim (Taxi) | Walking | Messenger Groups | Bus #25 | Bus #3 Tracker |
|-----------|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|:-----:|
| Core feature coverage | 3 | 2 | 5 | 1 | 1 | 3 | 3 |
| Pricing model | 5 | 5 | 1 | 5 | 5 | 5 | 5 |
| Target user segment fit | 3 | 2 | 3 | 2 | 3 | 2 | 5 |
| Geographic or institutional reach | 4 | 2 | 4 | 5 | 2 | 1 | 1 |
| Quality of mobile experience | 3 | 0 | 4 | 0 | 3 | 0 | 3 |
| Data depth or personalisation | 1 | 0 | 2 | 0 | 0 | 0 | 3 |
| Switching cost or user lock-in | 0 | 0 | 1 | 0 | 1 | 0 | 2 |
| Information accuracy / trustworthiness | 1 | 1 | 5 | 5 | 1 | 3 | 3 |
| Pre-departure usefulness | 0 | 0 | 5 | 5 | 2 | 0 | 5 |

---

## Competitor Profiles

### Bus Tracking Tableau (Official City App)

**Type:** Direct competitor
**Description:** The city-operated mobile application that provides estimated arrival times for all Kutaisi bus routes including Bus #3. Pre-installed or downloaded by most students.
**Primary strengths:** Free, covers all Kutaisi routes, already adopted by the student population, officially maintained by the transport operator.
**Primary weaknesses:** Consistently inaccurate arrival estimates — countdowns reset without explanation, cancelled buses show as arriving until the last moment, trust completely eroded among long-term users.
**Why users choose them:** It is the only free official option designed for this purpose. Students install it because there is no alternative. Multiple interviewees (Dachi, Mariam, Davit) described graduating from reliance to abandonment as the inaccuracies accumulated.

---

### Digital Arrival Tableau (Physical Display at Stop)

**Type:** Direct competitor
**Description:** The electronic display mounted at major Bus #3 stops that shows real-time arrival information for approaching buses.
**Primary strengths:** Visible at the stop without requiring a phone or mobile data, maintained as part of the city's official transport infrastructure.
**Primary weaknesses:** Fails at the exact critical moment — displays a bus as arriving for minutes and then shows "cancelled" (Dimitri). Provides no rerouting information during roadworks. Entirely useless for pre-departure decision-making since the user must already be at the stop.
**Why users choose them:** It is physically present at the stop and requires no action from the user. Users glance at it while waiting. Like the mobile app, it has destroyed its own credibility through repeated failure.

---

### Maxim (Taxi App)

**Type:** Indirect competitor
**Description:** A ride-hailing application operating throughout Kutaisi that connects passengers with drivers for on-demand point-to-point transport.
**Primary strengths:** Solves the reliability problem completely — guaranteed arrival time, door-to-door service, available on demand via a well-designed app.
**Primary weaknesses:** Expensive for students — 6 to 7 GEL per trip, described by TsiraB as "lunch money gone" and by Dimitri as costing "extra funds" for the express service. Not sustainable as a daily commuting solution.
**Why users choose them:** When the bus fails and the student cannot afford to be late, Maxim provides certainty. It is the paid backup option, not the primary commute method.

---

### Walking

**Type:** Substitute
**Description:** The zero-technology fallback of walking to KIU along the Bus #3 route. Used when the bus does not arrive and no other option is available.
**Primary strengths:** Free, fully reliable (the user controls their own movement), requires no external dependency or technology.
**Primary weaknesses:** Physically taxing — Giorgi described arriving "sweating." Time-consuming for students living further from campus. Not practical for intercity commuters arriving by marshrutka.
**Why users choose them:** It is the default when every other option fails. Giorgi described it as "I just start walking and hope a taxi comes by." It costs only effort, which students are willing to expend when the alternative is missing class entirely.

---

### Student Messenger Groups

**Type:** Indirect competitor
**Description:** Informal Facebook Messenger groups and Facebook posts where KIU students share information about bus status, delays, and cancellations.
**Primary strengths:** Already in use by the student community, peer-to-peer information can be more current than official channels, zero cost, requires no new account or app install.
**Primary weaknesses:** Information quality is inconsistent — "everyone is just complaining" (TsiraB). No structured data, no verification mechanism, requires active monitoring of noisy chat threads. Nino's Facebook post about the bus received 40 likes with zero official response.
**Why users choose them:** Students already use Messenger daily. It is a passive information channel they monitor alongside their regular communication. It works as a last-resort signal but not as a reliable planning tool.

---

### Bus #25

**Type:** Substitute
**Description:** An alternative KIU bus route that follows a different path through Kutaisi but still reaches the university campus. Used as a backup when Bus #3 is unreliable.
**Primary strengths:** Sometimes more reliable than Bus #3 specifically because its route is not affected by the same roadworks (noted by SabaM). Runs on the same public transit system at the same price.
**Primary weaknesses:** Requires a longer walk from the bus stop to faculty buildings. Not a drop-in replacement — students must factor in the extra walking time. Availability is still uncertain; it is another bus line subject to the same systemic reliability problems.
**Why users choose them:** Students like Dimitri build it into a layered contingency plan: catch Bus #3 first, fall back to Bus #1 then Bus #25 if Bus #3 fails. It reduces worst-case exposure but does not solve the core uncertainty problem.

---

## Synthesis

**The greatest Porter force threat to our product is:**

The Threat of Substitutes. Our product does not primarily compete with other apps — it competes with behaviours that cost no money and require no adoption. The seed document reveals that extreme early arrival is universal: every single interviewee uses it as their primary strategy. It wastes 5–15 hours per week per student and causes sleep disruption, but it is free, familiar, and requires no trust in any system. Walking, carpooling with friends, and relying on parents for drop-offs are similarly entrenched substitutes. The dominance of these substitutes means our product must demonstrate enough incremental value that students choose it over a habit they have already fully normalised. This is a higher bar than competing with another app, because the switching cost is not technical — it is behavioural.

**The two dimensions that create our most defensible competitive gap are:**

**Pre-departure usefulness (we score 5, incumbents average 1.2).** Every existing solution requires the student to be at the bus stop before they learn anything useful. The official tracking app and the physical display only function once you have already committed to going to the stop and waiting. Maxim and walking work from anywhere but solve different primary jobs. Our product is the only option that answers the single most cited pain point in the interview dataset: "should I leave home now?" This dimension matters because the seed identifies the intercity commuter sub-group (Nikoloz, Tsira) as the highest-stakes segment — a failed connection costs them the entire morning, not just 30 minutes. For these users, pre-departure information is not a convenience; it is the difference between arriving on time and losing half a day.

**Target user segment fit (we score 5, incumbents average 2.5).** No existing competitor is purpose-built for KIU Bus #3 commuters. The official city app covers all Kutaisi routes generically. Maxim serves anyone in the city who needs a ride. Walking is universal. We own a niche that no incumbent has any incentive to serve: a single bus route serving a single university. An incumbent would need to invest in product differentiation for a tiny sub-segment of their user base, which offers them no return. This niche alignment also means every design decision — from the stop selection to the departure decision flow to the crowding feature — is made specifically for the student commuting context.

**What would have to change for this gap to close:**

Three scenarios threaten our gap. First, if the city transit operator significantly improved the accuracy of their official tracking app — this would close the pre-departure gap if they also added pre-departure functionality. This is unlikely in the near term: the seed evidence shows years of neglect with no competitive pressure on a free monopoly service. Second, if KIU administration built their own internal bus tracking system — plausible if the university sees student transit as a retention or accessibility issue, but unlikely to reach the specificity and honesty of a student-built tool. Third, if a platform like Google Maps added real-time Kutaisi bus data — this would undercut our pre-departure value. However, this requires the city operator to publish reliable real-time transit data through an API, which they currently do not appear to do. The most realistic near-term threat is not any single competitor improving; it is the possibility that our own user base remains too small to generate the peer-reported data that makes our pre-departure signal reliable, creating a chicken-and-egg problem that prevents us from occupying the gap we have identified.
