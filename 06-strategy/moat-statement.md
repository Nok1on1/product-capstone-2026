# Moat Statement

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker — honest, pre-departure bus status for KIU commuter students
**Date:** June 9, 2026

---

## The Power

**Primary Helmer Power claimed:** Switching Costs (primary) with Network Effects emerging as a secondary power

We are claiming Switching Costs as our primary moat because it is the power most directly evidenced by our current research and early product data. We acknowledge that Network Effects are beginning to emerge — our product becomes more accurate as more students contribute status reports — but we do not yet have the data volume to evidence this rigorously. The switching cost mechanism is active from the first week of use and is already visible in engagement patterns documented below.

---

## The Mechanism

When a student uses Bus #3 Real-Time Tracker, they configure a product to their specific commute reality: their departure stop, their class schedule, their saved routes, and — over time — their personal history of confirmed status reports for the exact trips they take. The departure time recommendation feature (Sprint 2) builds this personalisation further: it calibrates to the user's first class of the day, their typical transit window, and their historical on-time rate for their specific route. A student who has used our product for three weeks has a configured, personalised view that reflects their schedule and commute pattern. Switching to an alternative means starting over with a product that does not know their stop, their schedule, or their history. The longer a student uses our product, the greater the gap between what our product knows about them and what any alternative could offer on day one.

There is a second switching cost layer specific to our problem context: trust. Our research documented that every student in our 12-person interview cohort had already gone through a full trust decay arc with the existing tracking app — from initial reliance, through repeated disappointment, to complete abandonment. Nino's articulation — "I just need it to be honest" — captures what our users are buying when they adopt our product. A student who has learned to trust our CONFIRMED/ESTIMATED status signal over several weeks has rebuilt trust that was deliberately destroyed by a competitor. Switching to a new tool means giving up that rebuilt trust and starting a new trust formation process. The psychological cost of risking that again is a real and documented switching barrier for this specific user segment.

---

## The Evidence

**Evidence 1:**

- **Type:** User interview data demonstrating trust destruction by existing alternatives
- **Description:** Across 12 structured interviews, every participant described either full abandonment of the existing tracking app or active distrust of it. Mariam stated she stopped using it entirely after it showed a bus arriving for 30 minutes straight. Davit described the tableau as "a suggestion, not a fact." Dachi described the countdown resetting to 59 minutes. This pre-existing trust destruction means that any user who switches to our product and experiences consistent accuracy has a strongly elevated cost of switching to any tool associated with the same information infrastructure they already rejected. Our product's switching cost is amplified by how badly the alternative has already performed.
- **Repository link:** `01-discovery/synthesis/affinity-map-notes.md` (Cluster 1, 16 stickies)

**Evidence 2:**

- **Type:** User quote demonstrating willingness to pay — the only explicit payment signal in the dataset
- **Description:** Nino stated unprompted during her interview: "I would pay good money for a bus app that just told the truth." This is the only explicit willingness-to-pay signal across all 12 interviews. It directly evidences that a user who experiences accurate, honest status information will assign high personal value to maintaining access to it — the precondition for switching costs. A user who has found the tool they were willing to pay for will not switch to an unproven alternative without a strong reason.
- **Repository link:** `01-discovery/synthesis/affinity-map-notes.md` (Cluster 7, line referencing Interview 6, Nino)

**Evidence 3:**

- **Type:** Roadmap feature engagement projections grounded in interview evidence
- **Description:** Our Sprint 2 roadmap commits to building favourite stops persistence and departure time recommendations — the two features that create the deepest personalisation and therefore the most significant switching cost. The departure time recommendation feature is specifically calibrated to each user's schedule: a student who receives a recommendation that says "leave by 8:12 to reach your 9am seminar with an 8-minute buffer" is receiving a service that requires the product to know their schedule and their route. Neither the existing app nor any plausible near-term competitor offers this. Engagement with these features will be tracked via the Mixpanel event schema committed in Sprint 2.
- **Repository link:** `03-build/roadmap.md` (Sprint 2 stories S2-03 and S2-05; Analytics event schema)

---

## The Path Forward

Over the next 60 days, we will deepen our switching costs moat through two specific actions. First, we will ship the departure time recommendation feature (S2-03) and favourite stops persistence (S2-05) by May 21, and measure engagement using the Mixpanel event schema. A user who interacts with personalised departure recommendations at least three times has begun building a usage history that no competitor can replicate without asking them to start over. Second, before Demo Day on June 11, we will initiate outreach to Georgian Technical University, Tbilisi State University, and Ilia State University for beta access conversations. A student who commutes between campuses — a use case no existing tool supports — has a switching cost that spans institutions: our product is the only option that works across all three stops in their journey. This cross-campus utility creates a lock-in that a single-campus or single-city operator tool structurally cannot match.