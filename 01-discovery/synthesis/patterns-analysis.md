# Pattern Analysis

**Team:** Bandersnatch
**Date:** April 8, 2026
**Based on:** 12 interviews across March 31 to April 8, 2026

---

## Frequency Table

| Rank | Pattern Name                                 | Interviews Mentioning | Percentage | Pain Intensity (1–5) | Combined Score |
| ---- | -------------------------------------------- | --------------------- | ---------- | -------------------- | -------------- |
| 1    | Fear-based early departure as daily norm     | 12 / 12               | 100%       | 5                    | 5.0            |
| 2    | Tracking tools are actively misleading       | 10 / 12               | 83%        | 5                    | 4.2            |
| 3    | Financial penalty when the bus fails         | 10 / 12               | 83%        | 4                    | 3.3            |
| 4    | Direct academic harm (quizzes, grades, GPA)  | 9 / 12                | 75%        | 4                    | 3.0            |
| 5    | Overcrowding as a physical and health burden | 5 / 12                | 42%        | 3                    | 1.3            |

---

## Pattern 1: Fear-Based Early Departure as Daily Norm (Rank #1)

**Frequency:** 12 of 12 interviews (P01–P12)

**Pain Intensity:** 5 / 5

**Supporting quotes:**

1. "I think I have to get early like if I have a seminar on 9 a.m. I have to get early at 7 a.m. so this is frustrating." (P01 — Dachi)
2. "I wake up at least three hours before my lecture. So if I have it on 9am, I get up at 6am. It is actually very terrible because it is kind of troubling on my sleep schedule." (P03 — Dimitri)
3. "I've started leaving Terjola way too early. Like, I arrive in Kutaisi at 8:30 even if my class is at 11:00. I spend so much time sitting in the KIU lobby because I'm scared to trust the schedule." (P10 — Nikoloz K.)

**Emotional language observed:** "scared," "gamble," "frustrating," "terrible," "hope," "just in case"

**Consequences reported:**

- Time impact: 1.5 to 2.5 hours of buffer per day — approximately 5 to 12 hours of wasted time per week (P01, P02, P10)
- Sleep impact: early wake-ups disrupting rest cycles, compounding fatigue before the academic day begins (P03)
- Wellbeing impact: students arrive drained or defeated before a single lecture (P07, P09, P11)

### Five Whys for Pattern 1

**Surface problem:** Every interviewed student departs significantly earlier than their commute distance requires, treating the buffer as a non-negotiable daily cost.

**Why #1:** Why do students leave so much earlier than needed?
Answer: They do not trust the bus to arrive when scheduled. Past failures have conditioned them to expect the worst. (P01, P04, P06)

**Why #2:** Why don't they trust the schedule?
Answer: The bus frequently arrives 10–30 minutes late, skips stops entirely, or is cancelled — often with no advance warning. (P02, P03, P08)

**Why #3:** Why is there no advance warning when buses are late or cancelled?
Answer: The tracking system (tableau and app) does not reflect real-time bus position accurately — it counts down and then resets, or disappears from the screen entirely. (P01, P03, P08, P09)

**Why #4:** Why does the tracking system fail to reflect reality?
Answer: The digital infrastructure appears to show scheduled departure times rather than actual GPS-based positions. When a bus is cancelled or delayed, the system does not update correctly. (P03, P08)

**Why #5:** Why was the system built this way?
Answer: The tracking system was likely designed around published timetables, not live vehicle data. The infrastructure was built for compliance display, not operational honesty.

**Root cause:** The tracking and scheduling infrastructure operates as a timetable broadcaster, not a real-time information system. Students have learned this through repeated failure, and have responded by substituting their own costly buffer strategy for the reliability the system should provide.

### Current Workarounds

| Workaround                              | Who Uses It                                      | How Well It Works            | Why It Falls Short                                                                 |
| --------------------------------------- | ------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------------------- |
| Leaving 1.5–3 hours before class        | P01, P02, P03, P04, P05, P07, P08, P09, P10, P11 | Prevents most late arrivals  | Consumes hours of productive time daily; still fails in worst-case cancellations   |
| Coordinating with friends who have cars | P12                                              | Works occasionally           | Unreliable; depends on a friend having class at the same time                      |
| Walking the full route to campus        | P05                                              | Guarantees arrival           | Physically exhausting; student arrives sweating and unable to participate normally |
| Sitting in KIU lobby for hours          | P10                                              | Eliminates bus risk entirely | 2.5 hours of daily dead time for a working student losing billable hours           |

---

## Pattern 2: Tracking Tools Are Actively Misleading (Rank #2)

**Frequency:** 10 of 12 interviews (P01, P02, P03, P04, P06, P07, P08, P09, P10, P12)

**Pain Intensity:** 5 / 5

**Supporting quotes:**

1. "I arrived at a stop, usually I arrive at stop, when I see that number three is coming in five minutes. Five minutes pass and countdown starts again and it says 59 minutes." (P01 — Dachi)
2. "At first, it said like 16 minutes... then those 16 minutes went by really slowly, and then another 16 minutes appeared. I waited for an hour. It was not 16 minutes." (P08 — Mariam P.)
3. "The tableau is a suggestion, not a fact. Last Tuesday, it counted down from 5 minutes to 1 minute, stayed at 1 minute for ten minutes, and then just disappeared from the screen entirely." (P09 — Davit)
4. "I stopped using it after it told me the bus was two minutes away for thirty minutes straight. I just stood there like an idiot. Now I just go early and hope." (P04 — Mariam)

**Emotional language observed:** "stood there like an idiot," "suggestion not a fact," "fiction," "just tell me the truth," "misleading," "disappeared"

**Consequences reported:**

- Behavioural: all participants who tried the app eventually abandoned it; "going early and hoping" becomes the rational response (P04, P06)
- Strategic: students can't make real-time decisions (call a taxi, take an alternative route) because they can't distinguish a real delay from a display error (P03, P08)
- Trust: the app's failure erodes trust in all official transit communication, including the physical tableau boards (P12)

### Five Whys for Pattern 2

**Surface problem:** The tracking display shows countdowns that reset, freeze, or disappear, causing students to wait for buses that will not come.

**Why #1:** Why does the countdown reset or disappear?
Answer: The system appears to lose contact with the bus or revert to scheduled time when no live signal is available. (P01, P09)

**Why #2:** Why does it show a countdown at all if it has no live signal?
Answer: The system defaults to timetable data rather than displaying a "no signal" state — it presents fiction as fact rather than acknowledging uncertainty. (P08)

**Why #3:** Why isn't the absence of a signal communicated to users?
Answer: The interface was not designed with an honest "unknown" state. It shows what it has, even when what it has is wrong. (P03, P09)

**Why #4:** Why was it designed without an honest fallback state?
Answer: The system was built to show a schedule, not to communicate operational reality. User trust and decision-making were not design requirements.

**Why #5:** Why hasn't it been fixed despite widespread knowledge of the failure?
Answer: The university advisor acknowledged it as a "known issue" with no action. Institutional inertia has allowed a broken tool to persist. (P04)

**Root cause:** The tracking system was built to display timetables, not to communicate real-time ground truth. Its failure mode — showing confident false data instead of uncertainty — is worse than showing nothing, because it keeps students standing at stops instead of taking alternative action.

### Current Workarounds

| Workaround                                    | Who Uses It | How Well It Works                  | Why It Falls Short                                          |
| --------------------------------------------- | ----------- | ---------------------------------- | ----------------------------------------------------------- |
| Abandoned the app entirely                    | P04, P06    | Removes false expectations         | Student is left with no information at all                  |
| Check Messenger group chats                   | P11         | Occasional real reports from peers | Groups are "echo chambers of complaints," not reliable data |
| Screenshot the app to track changes over time | P06         | Provided some insight for a while  | Eventually stopped working as trust eroded                  |
| Ask locals at the stop                        | P12         | Sometimes yields a real answer     | Depends on someone nearby having current knowledge          |

---

## Pattern 3: Financial Penalty When the Bus Fails (Rank #3)

**Frequency:** 10 of 12 interviews (P01, P02, P03, P04, P05, P07, P08, P09, P10, P11)

**Pain Intensity:** 4 / 5

**Supporting quotes:**

1. "I had to call taxi — not just regular taxi but also express taxi which costed me extra funds and as a university student I don't have that kind of funds to expand upon on daily basis." (P03 — Dimitri)
2. "If I spend 6 or 7 lari on a taxi, that's my lunch money gone. I'll be eating 'semichka' for dinner." (P11 — Tsira B.)
3. "If the bus is more than 20 minutes late, I have to choose between spending my lunch money on a taxi or being marked absent. It's not really a choice; it's a penalty for living off-campus." (P09 — Davit)
4. "Since I work online, my time is literally money. I'm standing at the stop for 30 minutes waiting for the #3, I can't open my laptop on the street." (P10 — Nikoloz K.)

**Emotional language observed:** "penalty," "don't have that kind of funds," "embarrassing," "zero-sum," "literally money," "lunch money gone"

**Consequences reported:**

- Direct cost: taxi fares of 6–10 GEL per incident — a significant sum relative to student budgets (P03, P04, P11)
- Food security: taxi spend comes directly out of meal budgets for multiple participants (P09, P11)
- Income loss: for working students, wait time is billable time lost (P10)
- Emotional: borrowing money from parents described as "embarrassing," not a financial crisis but a dignity issue (P04)

### Five Whys for Pattern 3

**Surface problem:** When Bus #3 fails, students pay for taxis or walk — costs they cannot always absorb.

**Why #1:** Why do students pay for taxis when the bus fails?
Answer: The taxi is the only alternative that guarantees arrival in time. Walking takes too long; no mid-cost option exists. (P05, P08, P09)

**Why #2:** Why is there no mid-cost alternative?
Answer: University shuttles only serve the campus itself, not the city commute. Ride-sharing (Maxim) prices from distant stops are comparable to a full taxi. (P08, P11)

**Why #3:** Why don't students budget for taxis in advance?
Answer: The frequency of failure is unpredictable. Students cannot plan for a cost that strikes randomly — it functions as a fine, not a fee. (P03, P09)

**Why #4:** Why can't students predict when failure will occur?
Answer: Because the tracking system is unreliable (Pattern 2) and there is no advance cancellation notice. The failure arrives without warning. (P01, P08)

**Why #5:** Why is there no cancellation notice?
Answer: The system doesn't know — or doesn't communicate — when a bus is cancelled. Operational data isn't surfaced to passengers. (P03, P12)

**Root cause:** The financial penalty is a downstream consequence of the information failure. Because students receive no warning of cancellations, they cannot prepare alternatives in advance. The taxi becomes an emergency tax on the poorest decision window — the moment of no return at the bus stop.

### Current Workarounds

| Workaround                              | Who Uses It        | How Well It Works            | Why It Falls Short                                   |
| --------------------------------------- | ------------------ | ---------------------------- | ---------------------------------------------------- |
| Call a Maxim / taxi as emergency rescue | P03, P04, P09, P11 | Gets them to campus          | Costs 6–10 GEL; often eats into food or daily budget |
| Borrow money from parents via transfer  | P04                | Solves the immediate problem | Humiliating; unsustainable as a daily fallback       |
| Walk the full route                     | P05                | Free                         | 40+ minutes; student arrives physically exhausted    |
| Skip the session entirely               | P11                | Avoids the cost              | Academic consequence replaces financial one          |

---

## Pattern 4: Direct Academic Harm — Quizzes, Grades, GPA (Rank #4)

**Frequency:** 9 of 12 interviews (P01, P02, P03, P05, P06, P09, P10, P11, P12)

**Pain Intensity:** 4 / 5

**Supporting quotes:**

1. "It affected my GPA. I mean, I was late on quizzes, seminars, so scores went down and GPA went down." (P01 — Dachi)
2. "Every morning is a gamble. I have lost maybe four or five quizzes this semester just from being late." (P05 — Giorgi)
3. "Yes, unfortunately I was going to a quiz and I was late, so I had to stay another hour to write the quiz with another group." (P12 — Saba M.)
4. "I just walked in, sat in the back, and didn't even open my laptop. What's the point?" (P11 — Tsira B.)

**Emotional language observed:** "lost quizzes," "GPA went down," "what's the point," "marked absent," "explain myself," "embarrassing"

**Consequences reported:**

- Academic: missed or partial quiz scores; GPA reduction documented by at least two participants (P01, P05)
- Bureaucratic: students must negotiate with professors to retake assessments, extending their day (P12)
- Motivational: chronic lateness leads to disengagement — students stop opening laptops in sessions they arrive to late (P11)
- Social: students must publicly "explain themselves" for systemic failures beyond their control (P12)

### Five Whys for Pattern 4

**Surface problem:** Students miss or underperform on graded assessments due to late bus arrivals.

**Why #1:** Why are students arriving late to quizzes?
Answer: The bus arrives 10–40 minutes after its scheduled time, or is cancelled entirely, with no warning. (P01, P03, P09)

**Why #2:** Why can't they compensate by leaving earlier?
Answer: Many already leave 1.5–3 hours early. In extreme failure cases (full cancellations), no buffer is sufficient. (P02, P03)

**Why #3:** Why doesn't the university account for this in assessment policy?
Answer: The academic advisor acknowledged the issue as "known" but no systemic accommodation exists. Students must negotiate retakes individually. (P04, P12)

**Why #4:** Why are retakes offered case-by-case rather than by policy?
Answer: The university does not formally recognise municipal transit failure as a force majeure event. The student bears full responsibility for their arrival. (P12)

**Why #5:** Why isn't transit reliability treated as an institutional concern?
Answer: The university and the city transit system operate entirely independently. There is no coordination mechanism and no shared accountability.

**Root cause:** The university assigns academic consequences (quiz grades, attendance) under the assumption that students control their arrival time. This assumption is structurally false for Bus #3 riders. The result is a systematic transfer of the transit system's failure onto students' academic records.

### Current Workarounds

| Workaround                            | Who Uses It   | How Well It Works           | Why It Falls Short                                                                    |
| ------------------------------------- | ------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| Negotiate a retake with the professor | P12           | Sometimes granted           | Requires individual advocacy; not always available; adds an hour to the student's day |
| Arrive 2+ hours early as insurance    | P01, P03, P09 | Prevents most late arrivals | Time cost is enormous; still fails during full cancellations                          |
| Text a classmate to sign attendance   | Not stated    | Unknown                     | Risk of academic dishonesty if formally prohibited                                    |
| Accept the absence and move on        | P11           | Avoids the argument         | Permanent grade damage; contributes to academic disengagement                         |

---

## Pattern 5: Overcrowding as a Physical and Health Burden (Rank #5)

**Frequency:** 5 of 12 interviews (P07, P08, P09, P10, P11)

**Pain Intensity:** 3 / 5

**Supporting quotes:**

1. "I physically could not breathe. There were so many people packed in there... I had to get down because I couldn't breathe and otherwise I was going to faint." (P07 — Mariam K.)
2. "It is a greenhouse on wheels. By the time we reach the campus gates, the windows are fogged up from so many people breathing in a small space. It's hard to focus on a coding lab after that." (P09 — Davit)
3. "No, it is very jam-packed. The bus is late often... There's not enough air or conditioning going on in there." (P07 — Mariam K.)

**Emotional language observed:** "greenhouse," "couldn't breathe," "faint," "jam-packed," "hard to focus"

**Consequences reported:**

- Physical: a participant exited a moving bus to avoid fainting (P07)
- Cognitive: students arrive on campus physically depleted and unable to engage immediately with academic work (P09)
- Behavioural: Mariam K. began walking between stops rather than boarding the most crowded bus (P07)
- Scheduling: students block out 2–3 hours after expected arrival home to recover — "waiting mode" extends into the evening (P07)

### Five Whys for Pattern 5

**Surface problem:** Bus #3 is dangerously overcrowded during peak commute hours, causing physical discomfort and health risk.

**Why #1:** Why is the bus overcrowded?
Answer: High demand from KIU students concentrates at specific times (pre-9:00 AM lectures), and infrequent service means multiple commutes' worth of passengers board the same bus. (P07, P09)

**Why #2:** Why is service so infrequent during peak times?
Answer: Buses are cancelled or delayed regularly, consolidating the load onto fewer vehicles. A single "on-time" bus carries the passengers of two or three expected buses. (P08, P09)

**Why #3:** Why does bus cancellation increase crowding so severely?
Answer: There is no passenger cap or crowd management at stops. All waiting passengers — including those stranded by the previous cancelled bus — board the next available vehicle. (P07)

**Why #4:** Why is there no crowd management?
Answer: The stop infrastructure offers no shelter, no seating, and no communication tools. It is a pavement location with a tableau board, designed for waiting, not managing. (P10, P11)

**Why #5:** Why hasn't the operator increased frequency during peak hours?
Answer: No evidence of demand data being collected or shared with the operator. Students have no formal channel to report overcrowding as a safety concern.

**Root cause:** Overcrowding is a compounding symptom of the cancellation problem. Each cancelled bus adds its passengers to the next, creating a cascade where one reliable bus must serve three times the intended load. The stop infrastructure provides no relief because it was not designed for volume management or passenger safety.

### Current Workarounds

| Workaround                                          | Who Uses It | How Well It Works                     | Why It Falls Short                                                  |
| --------------------------------------------------- | ----------- | ------------------------------------- | ------------------------------------------------------------------- |
| Walk between stops to board at a less crowded point | P07         | Slightly less crowded                 | Adds walking time; still overcrowded at any stop along a busy route |
| Schedule "recovery time" after the commute          | P07         | Protects commitments later in the day | Destroys schedule flexibility; reinforces "waiting mode"            |
| Leave earlier to board before peak crowd            | P08, P09    | Sometimes secures a seat              | Extends the daily buffer further; doesn't solve safety risk         |

---

## Cross-Pattern Analysis

Patterns 1 and 2 are the engine of the entire problem. Because the tracking system lies (Pattern 2), students cannot make informed real-time decisions and are forced to treat worst-case as baseline (Pattern 1). Solving Pattern 2 — providing honest, reliable real-time information — would directly reduce the buffer burden of Pattern 1.

Patterns 3 and 4 are the consequences. Financial harm (Pattern 3) and academic harm (Pattern 4) are both downstream of the same root failure: students receive no warning before a bus cancellation, leaving them with no time to act. A real-time information system that communicated honest uncertainty would allow students to take taxis or alternative routes before the cost becomes an emergency.

Pattern 5 (overcrowding) is partially independent but connected. Reducing cancellations would distribute passengers across more buses, directly easing the overcrowding burden without any infrastructure investment.

**The strongest product signal** is the intersection of Patterns 1, 2, 3, and 4: a solution that provides honest, real-time bus status information would simultaneously reduce wasted time, restore rational decision-making, prevent emergency taxi spend, and protect academic outcomes. Six participants across both interview rounds explicitly stated they would pay for an app that told them the truth.

---

## Team Sign-Off

- [x] Nikoloz Modebadze
- [x] Besik Meskhia
- [X] Nikoloz Kvirikashvili
- [x] Giorgi Miqaberidze
