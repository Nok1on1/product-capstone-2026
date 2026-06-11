# Bandersnatch Case Study

**Product:** Bus #3 Real-Time Tracker  
**Team:** Bandersnatch  
**Course:** CS-PD-2026 Product Development for Software Engineers  
**Date:** June 2026

---

## Executive Summary

Bandersnatch is a mobile-first web application for KIU students who rely on municipal Bus #3. The product gives students an honest pre-departure status check before they leave for the stop, combining stop selection, route context, crowding information, and peer-powered reporting.

The problem is not simply that Bus #3 is late. The validated problem is that existing tracking tools provide confident but misleading information. Students see countdowns reset, freeze, or disappear, which causes them to wait too long before choosing an alternative. Across 12 interviews, KIU commuters described 5-12 hours per week lost to early buffers, 6-10 GEL emergency taxi spend, missed quizzes, GPA harm, sleep disruption, and stress.

The MVP is deployed at https://product-capstone-2026.vercel.app/en. It uses Next.js, TypeScript, Tailwind CSS, Firebase Auth, Firestore, Leaflet, and Vercel.

## Problem Discovery

The team began with the daily commute experience of off-campus KIU students. The strongest validated segment is undergraduate students in years 2-4 who carry heavy course loads, live in Kutaisi or surrounding towns, and depend on Bus #3 for early morning classes.

The discovery evidence is unusually consistent. All 12 interviews confirmed the pain. Students described the official tracker as actively misleading rather than merely absent. One participant summarized the need clearly: "I do not need it to be perfect. I just need it to be honest." This reframed the opportunity from "make the bus arrive faster" to "help students make a rational departure decision with honest uncertainty."

Key findings:

| Finding | Evidence |
|---------|----------|
| Tracking tools mislead students | 10 of 12 participants reported false countdowns, freezes, or missing buses |
| Early departure is normalized | 12 of 12 participants use large buffers |
| The cost is measurable | 5-12 hours lost weekly; 6-10 GEL emergency taxi spend |
| Academic harm is real | 9 of 12 reported missed quizzes, late seminars, or GPA impact |
| Students value honesty | One participant gave unprompted willingness-to-pay for a tool that "told the truth" |

## Solution Design

The product is designed around one core user question: "Should I leave for the bus stop now?"

The MVP flow keeps that question central:

1. The student opens the mobile web app.
2. They choose their stop and route direction.
3. The app shows Bus #3 status with clear confidence language.
4. The student can view route context, crowding information, and peer/community signals.
5. Riders can contribute reports that improve trust for the next user.

The team chose a mobile-first PWA-style experience because the use case happens while students are standing, commuting, or deciding whether to leave home. The design favors fast status checks, clear labels, accessible controls, and English/Georgian support.

## Build and Validation

The app is implemented as a Next.js 16 application under `bandersnatch_app/`, deployed on Vercel. Firebase Auth handles accounts, Firestore stores user profiles and reports, and Leaflet/OSM supports route mapping. The architecture deliberately avoids a separate backend service so the team can ship and maintain the MVP within the capstone timeline.

Validation combined analytics and direct observation. Firebase Analytics was instrumented, but early event tracking undercounted signups due to an SDK initialization timing issue fixed on May 20. The team therefore documents both the dashboard numbers and the observed rapid-test data.

Validation signals:

| Metric | Result | Source |
|--------|--------|--------|
| 7-day active users | 20 | Firebase overview export, May 21 |
| 30-day active users | 21 | Firebase overview export, May 21 |
| Core status check rate | 15 of 20 observed users, 75% | Rapid test, May 19-21 |
| Boarding completion after status check | 12 of 15, 80% | Rapid test, May 19-21 |
| Signup events recorded | 2 | Firebase Analytics, undercount caveat disclosed |

The team chose to persevere with minor UI and instrumentation improvements because the core status-check behavior showed strong early engagement.

## Market and Strategy

The first market is intentionally narrow: roughly 400 KIU students per semester who rely on Bus #3. This niche is valuable because the pain is frequent, local, and urgent. Existing alternatives are weak: the official app and stop display lack trust, taxis are expensive, walking is physically costly, Messenger groups are noisy, and fallback routes do not answer the pre-departure decision.

The go-to-market strategy starts with high-intent channels:

| Channel | Why it fits |
|---------|-------------|
| Bus stop QR flyers | Reaches students at the exact moment of pain |
| Student Telegram/WhatsApp groups | Uses existing commute coordination behavior |
| Share-status referral loop | Lets active riders help friends make the same departure decision |

The business model remains pre-revenue during validation. The post-MVP model is a $1/month student premium tier plus university sponsorship of about 500 GEL per semester. Unit economics estimate a blended CAC of $0.05 and conservative LTV of $2.00 if the paid tier is validated.

The growth economics improve after the first route because the product is simple by design. The same stop, direction, ETA, confidence, and rider-report workflow can be reused across other Georgian cities and bus routes. Tbilisi already demonstrates that live bus visibility is a familiar expectation in Georgia; the gap is that smaller cities do not consistently give riders a reliable pre-departure experience. If a city or bus operator shares built-in vehicle GPS data, Bandersnatch can use exact official bus positions while keeping peer reports as an added trust layer for crowding, disruptions, and stale-data checks.

The primary moat claim is Switching Costs, with Network Effects emerging. As students save stops, schedules, and trust history, switching to a generic tool becomes less attractive. As more students report status, the community signal becomes stronger.

## Lessons Learned

The biggest lesson was that product value came from honest uncertainty, not perfect prediction. Students were not asking for a magical GPS feed. They wanted the app to stop lying to them. That insight affected the interface, the language, the analytics schema, and the roadmap.

The second lesson was that analytics instrumentation must be treated as product infrastructure, not an afterthought. The signup undercount made traction harder to explain even though observed user behavior was strong. Future work should prioritize event QA, cohort tracking, and clean source attribution.

The third lesson was to keep scope anchored to the validated route while designing the model so it can travel. A broader city transit app is tempting, but the evidence supports a focused tool for KIU Bus #3 commuters first. Winning that route gives the team a credible path to other campus commute routes later, especially if a municipal GPS partnership reduces the need to rely on peer-collected location data in each new city.

## Next Steps

1. Tie CONFIRMED/ESTIMATED status to real freshness thresholds.
2. Improve Firebase event reliability and document event QA.
3. Run a two-week QR flyer experiment with UTM links.
4. Add personalized departure recommendations.
5. Pursue a KIU institutional pilot and bus operator data conversation.
6. Package the route configuration model for a second Georgian city pilot.
