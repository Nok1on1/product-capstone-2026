# Prioritization Framework

**Team:** Bandersnatch  
**Product:** Bus #3 Real-Time Tracker  
**Source:** Lab 6 roadmap and Sprint 1 planning  
**Planning window:** April 24 to June 11, 2026

---

## Framework Used

Bandersnatch used a weighted RICE framework to choose MVP scope and sprint order.

| Criterion | Weight | How we scored it |
| --- | ---: | --- |
| Reach | 30% | Number of KIU Bus #3 commuters affected during a normal commute week |
| Impact | 35% | Expected reduction in uncertainty, wasted waiting time, or missed-class risk |
| Confidence | 20% | Strength of interview, usability-test, or analytics evidence |
| Effort | 15% | Engineering/design complexity relative to team capacity |

**Formula:**  
`Priority score = ((Reach x 0.30) + (Impact x 0.35) + (Confidence x 0.20)) / Effort`

Scores used a 1 to 5 scale. Higher scores were prioritized first.

---

## Ranked MVP Features

| Rank | Feature | Reach | Impact | Confidence | Effort | Priority score | Decision |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | Bus stop selection and Bus #3 status check | 5 | 5 | 5 | 2 | 1.63 | Sprint 1 |
| 2 | CONFIRMED / ESTIMATED honesty badge | 5 | 5 | 5 | 2 | 1.63 | Sprint 1 |
| 3 | Departure recommendation | 4 | 5 | 4 | 3 | 0.92 | Sprint 2 |
| 4 | Crowding indicator and reports | 4 | 4 | 4 | 3 | 0.80 | Sprint 1 / 2 |
| 5 | Favorite stop persistence | 4 | 3 | 4 | 2 | 1.03 | Sprint 2 |
| 6 | Live map and route context | 3 | 4 | 4 | 4 | 0.78 | Sprint 2 / 3 |
| 7 | Ride history and trust score | 3 | 3 | 3 | 3 | 0.65 | Sprint 3 |
| 8 | Share status with friends | 3 | 3 | 3 | 4 | 0.49 | Sprint 3 |
| 9 | Admin moderation tools | 2 | 3 | 3 | 4 | 0.41 | Sprint 3 / 4 |
| 10 | Offline runner fallback game | 2 | 2 | 2 | 3 | 0.40 | Sprint 4 polish |

---

## MVP Cut Line

The MVP cut line was the activation moment: a student must be able to open the app before leaving, select their stop, check Bus #3 status, and make a departure decision with more confidence than the official tracker provides.

Features above the cut line:

- Signup/login with stop preference
- Bus status check
- CONFIRMED / ESTIMATED status language
- Departure recommendation
- Crowding and report surfaces
- Live route context

Features below the cut line:

- Full social chat
- Native mobile application
- Paid subscription flow
- Operator-grade GPS integration
- Complex moderation dashboard

---

## Why This Order

Interview evidence showed that the most painful job was not route discovery; it was deciding whether to leave home now. That made pre-departure status, honesty labels, and departure timing higher priority than broad map features or social features. The team also kept effort conservative because the sprint arc overlapped exams and Demo Day preparation.

---

## Review Cadence

Priorities were reviewed at each sprint boundary:

| Review point | Evidence checked | Change made |
| --- | --- | --- |
| Sprint 1 planning | 12 discovery interviews | Core status flow committed as MVP |
| Sprint 2 planning | Usability testing and analytics schema | Map interactivity and crowding visibility raised |
| Sprint 3 planning | Rapid-test engagement data | Reporting/trust features retained, broad chat deferred |
| Sprint 4 planning | Demo readiness and repository checklist | Final polish and documentation moved above new features |

---

_Prioritization Framework | Bandersnatch | CS-PD-2026 | Spring 2026_
