# Bandersnatch Pitch Deck Outline

**Team:** Bandersnatch  
**Product:** Bus #3 Real-Time Tracker  
**Date:** June 10, 2026  
**Live product:** https://product-capstone-2026.vercel.app/en

This source outline adapts the Lab 12 pitch deck template to the Bandersnatch project. The judge-facing export is `05-fundraising/pitch-deck.pdf`.

---

## Slide 1: Problem

**ICP:** KIU undergraduate students in years 2-4 who live off campus, carry 5+ courses, and rely on municipal Bus #3 for morning classes.

**Problem statement:** KIU Bus #3 commuters lose 5-12 hours per week because official tracking tools show misleading arrival information.

**Pain intensity evidence:** 12 of 12 discovery interviews confirmed the problem. Students report 1.5-3 hour early-departure buffers, 6-10 GEL emergency taxi spend, missed quizzes, GPA damage, and sleep disruption.

**Interview quote:** "Honestly, just tell me the truth. Not 'three minutes' when you mean twenty. I do not need it to be perfect. I just need it to be honest."  
**Source:** `01-discovery/synthesis/final-problem-statement.md`, P06 Nino, collected March 31-April 8, 2026.

---

## Slide 2: Solution

**Solution statement:** Bandersnatch helps KIU Bus #3 commuters make an honest pre-departure decision before they waste time at the stop.

**Core user action:** A student opens the app, selects their stop and direction, checks the current Bus #3 status, sees CONFIRMED or ESTIMATED context, and decides whether to leave, wait, or choose a fallback.

---

## Slide 3: Why Now

**Specific change:** In Spring 2026, KIU commuters shifted from trusting the official timetable to peer-verified real-time status sharing, documented across 12 discovery interviews and student Messenger/WhatsApp behavior.

**Why it matters:** The official tracking system has trained students to distrust confident countdowns. At the same time, every target user already carries a smartphone and uses student chats for commute coordination. A lightweight mobile web app can turn fragmented peer reports into structured, pre-departure decision support without waiting for the city operator to expose reliable GPS data.

---

## Slide 4: Market Size

**SOM, 24-month target:** 400 KIU Bus #3 commuters x $1/month x 8 academic months = $3,200 annual subscription potential, plus one KIU sponsorship at about 1,000 GEL/year.

**SAM, Georgian campus-commuter model:** 20 comparable university commute cohorts x 400 route-dependent students x $1/month x 8 months = $64,000/year before institutional sponsorship.

**TAM, broader student commute decision-support model:** 100 campus-route commuter cohorts x 500 students x $1/month x 8 months = $400,000/year, excluding institutional analytics and operator partnerships.

**Rationale:** This is intentionally bottom-up and starts with the single validated route before expanding to other universities and route-constrained commuter populations. Tbilisi already proves that Georgian riders understand live bus visibility when the city provides usable infrastructure; the opportunity is to bring the same expectation to smaller cities where riders still lack a reliable pre-departure layer.

---

## Slide 5: Product

**Screenshot description:** The deployed app shows a mobile-first Bus #3 status flow with stop selection, route context, live-map/navigation surfaces, boarding reporting, crowding state, and English/Georgian support.

**Live URL:** https://product-capstone-2026.vercel.app/en

**Presenter demo track:** Open the live product on a phone. Select a Bus #3 stop, check status, show the confirmation/ETA surface, then move to the map or feedback flow to show how the community report loop improves trust over time.

---

## Slide 6: Traction

**Primary metric:** 20 seven-day active users as of May 21, 2026.  
**Source:** `04-gtm/traction/waitlist-signups.md` and Firebase Analytics export.

**Supporting metrics:**

| Metric | Value | Source | Date |
|--------|-------|--------|------|
| 30-day active users | 21 | Firebase overview export | May 21, 2026 |
| Core status checks | 15 of 20 observed users, 75% | Manual rapid-test tracking | May 19-21, 2026 |
| Boarding completed | 12 of 15 status checkers, 80% | Manual rapid-test tracking | May 19-21, 2026 |
| Signup events recorded | 2 | Firebase Analytics | May 21, 2026 |

**Honest caveat:** Signup analytics undercounted activity before a Firebase SDK initialization fix on May 20. The deck uses the observed session data and discloses the instrumentation caveat.

---

## Slide 7: Business Model

**Pricing:** MVP is free. Post-MVP model is a $1/month student premium tier plus university sponsorship at about 500 GEL per semester.

| Metric | Value | Source |
|--------|-------|--------|
| Blended CAC | $0.05 | `04-gtm/financials/unit-economics.md` |
| Projected LTV, conservative | $2.00 | `04-gtm/financials/unit-economics.md` |
| LTV:CAC, conservative | 40:1 | Calculated |
| Payback period | about 1.5 days | `04-gtm/financials/unit-economics.md` |
| Gross margin | 100% in MVP assumptions | `04-gtm/financials/unit-economics.md` |

**Revenue to date:** Pre-revenue. Monetization is deferred until the product proves repeated commute value.

**Expansion economics:** The app is lightweight because every city route uses the same core workflow: stop, direction, ETA, confidence label, and rider report. If a city/operator shares built-in bus GPS data, Bandersnatch can use official bus position as the baseline and keep peer reports for crowding, disruption checks, and accuracy improvement. That reduces the need to bootstrap location data city by city and makes future rollouts mostly route configuration, partner onboarding, and local GTM.

---

## Slide 8: Go-to-Market

**Primary acquisition channel:** Bus Stop QR Code Flyers at KIU Main Gate, K Building, Colchis Fountain, Railway Station, and Tsereteli Uni.

**Evidence:** Growth strategy estimates $5.60 flyer campaign cost, 50 conservative signups, and $0.11 QR-flyer CAC. Student Telegram/WhatsApp groups are the zero-cost secondary channel.

**First 500 users plan:** Start from 21 active users. Acquire 479 more through QR flyers and student groups. At $0.11 CAC for paid flyer-driven users, even a fully flyer-driven push costs about $52.69. The expected path is 50-300 users from flyers, 40+ from student groups, and a referral loop from the share-status feature.

---

## Slide 9: Competition

| Competitor | Core coverage | Free/low cost | Segment fit | Mobile UX | Data depth | Trust | Pre-departure |
|------------|:-------------:|:-------------:|:-----------:|:---------:|:----------:|:-----:|:-------------:|
| Official tracking app | 3 | 5 | 3 | 3 | 1 | 1 | 0 |
| Physical stop display | 2 | 5 | 2 | 0 | 0 | 1 | 0 |
| Maxim taxi | 5 | 1 | 3 | 4 | 2 | 5 | 5 |
| Walking | 1 | 5 | 2 | 0 | 0 | 5 | 5 |
| Messenger groups | 1 | 5 | 3 | 3 | 0 | 1 | 2 |
| Bus #25 fallback | 3 | 5 | 2 | 0 | 0 | 3 | 0 |
| Bandersnatch | 3 | 5 | 5 | 3 | 3 | 3 | 5 |

**Moat statement:** Bandersnatch is building Switching Costs, with Network Effects emerging as a secondary power. The product becomes more valuable as a student configures their stops, schedule, history, and trust in the CONFIRMED/ESTIMATED signal; peer reports improve the usefulness of the system for the next commuter.

**Evidence:** `01-discovery/synthesis/affinity-map-notes.md` documents trust destruction and willingness to pay for honesty; `03-build/roadmap/product-roadmap.md` and the analytics schema document the personalized departure recommendation and event loop.

---

## Slide 10: Ask

**The ask:** We are raising 60,000 GEL at a 240,000 GEL pre-money valuation, implying 20% dilution.

**Valuation method:** VC-style milestone method: 12 months of focused runway to reach an institutional pilot, discounted for pre-revenue and single-route risk.

| Line item | Amount | Purpose |
|-----------|--------|---------|
| Engineering and reliability | 30,000 GEL | Municipal GPS/partner integration, freshness thresholds, automated tests |
| Campus expansion and GTM | 18,000 GEL | QR campaigns, student ambassador rollout, university outreach |
| Legal, privacy, and infrastructure | 12,000 GEL | Consent review, Firebase/Vercel growth costs, security hardening |

**Milestone:** By March 2027, reach 500 monthly active KIU commuters, one signed institutional pilot, one active city/operator GPS data conversation, and validated retention for the daily commute flow.

**Contact:** Team Bandersnatch, repository https://github.com/Nok1on1/product-capstone-2026, live product https://product-capstone-2026.vercel.app/en
