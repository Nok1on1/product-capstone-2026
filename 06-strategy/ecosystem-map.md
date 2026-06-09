# Ecosystem Map

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker — honest, pre-departure bus status for KIU commuter students
**Date:** June 9, 2026

---

## Overview

This document maps every relevant party in our product's surrounding environment. It is used to identify strategic opportunities, manage threats proactively, and surface relationships that can accelerate growth.

---

## 1. Complements

Products or services that make our product more valuable when used together. Users who combine our product with these complements get more value from both.

| Complement | Description | Why it makes us more valuable |
|------------|-------------|-------------------------------|
| Google Calendar | Calendar and schedule tool used widely by students to block class time and plan their day | Students who schedule their day in Google Calendar already know what time they need to arrive. Our product converts that intention into a reliable departure decision. A student who misses the window because of false bus data loses the planned session entirely; our honest status restores their ability to act on the calendar commitment. |
| Maxim (ride-hailing app) | The primary paid alternative used by KIU students when Bus #3 fails; mentioned by TsiraB, Mariam, Dimitri, MariamP, and Davit in interviews | Our product tells students the bus is not coming early enough to order a Maxim at base rate rather than paying the premium for an express booking. Without our pre-departure signal, students stand at the stop until the last moment and then pay the most expensive option. Our product reduces their Maxim spend, which directly addresses the "lunch money" trade-off documented across five interviews. |
| KIU Student Messenger Groups | Informal Facebook Messenger groups already used by students to share bus delay updates; mentioned by TsiraB and Nino | Students are already seeking peer-sourced real-time information in these groups. Our product formalises and improves what students are already doing. Users who receive a status update from us have something concrete to share back into the group, increasing the quality of information in both channels. |
| University timetabling and class schedule system | The official or informal system students use to manage their class schedule and seminar times | Students plan commutes around class start times. Access to their schedule (even self-reported at sign-up) enables departure time recommendations calibrated to their first class, which is the Sprint 2 feature already on our roadmap. The complement relationship runs both ways: our product only adds value when the student has somewhere to be. |

---

## 2. Partners

Organisations that give us access, distribution, data, or credibility. List only parties you have a real or plausible relationship with.

| Organisation | What they provide | Relationship status | Next action |
|-------------|-------------------|--------------------|----|
| Kutaisi Bus Operator / Transit Authority | Official Bus #3 route data, schedule information, and potential access to any GPS or dispatch signals the operator currently uses | Identified | Draft an outreach letter to the Kutaisi municipal transport department requesting a meeting to discuss data access. Prepare a value exchange: we surface bus performance data to them as a public accountability signal. |
| KIU Student Services / Administration | Distribution to the full KIU student body, institutional credibility, potential on-campus promotion at orientation and notice boards | Identified | Request a meeting with the KIU Student Services office. Offer to share anonymised commute delay data that documents the academic impact of Bus #3 unreliability — data they can use when raising the issue with the municipality. |
| KIU Student Union | Direct access to enrolled students via official channels; potential co-promotion in SU newsletter or social media; credibility with the student population | Identified | Draft a partnership proposal offering SU free access to aggregate delay reports in exchange for one newsletter feature and a pinned post in official student groups. This mirrors the approach used successfully in the StudySpace Finders worked example. |
| Firebase / Google for Startups | Cloud infrastructure (already in use per roadmap), potential startup credits, technical mentorship | In discussion (Firebase in active use) | Apply to Google for Startups Campus programme after Demo Day, once live analytics are available to demonstrate traction. Firebase integration is already committed in Sprint 2. |

**Relationship status definitions:**
- **Confirmed:** A formal agreement (MOU, partnership agreement, API access) exists and is committed to the repository.
- **In discussion:** Active conversations have occurred. A contact name exists.
- **Identified:** We know this organisation is strategically relevant but have not yet made contact.

---

## 3. Threats

Parties who could decide to enter our market and compete with us. Include not just direct competitors but also platform threats, institutional threats, and technology shifts.

| Threat | Type | Likelihood | Our counter-strategy |
|--------|------|-----------|----------------------|
| The existing city/operator bus tracking app adds an honesty indicator or fixes its data accuracy | Direct competitor | Medium | The existing app has already lost the trust of its users — Mariam, Dachi, Davit, and MariamP all described full abandonment of the tool after repeated failures. Trust, once destroyed, is not recovered by a patch update. We accelerate community data collection so that our status signal is crowdsourced and independent of the operator's data feed, which the official app cannot replicate without changing its architecture entirely. |
| Kutaisi City Hall or the bus operator builds an official real-time tracking feature into a new municipal app | Institutional threat | Low | Municipal app development moves slowly. More importantly, the core insight from our research is that the problem is not technical — the operator already has a tableau and an app. The problem is that official data is actively misleading. A new official tool using the same underlying dispatch data will reproduce the same failure. Our counter-strategy is to be so deeply embedded as the student community's trusted source that an official alternative would need to earn back trust we already hold. |
| Google Maps adds Bus #3 real-time arrival data for Kutaisi | Platform threat | Low | Google Maps currently has no meaningful real-time public transit data for Kutaisi's local bus routes. Even if Google indexed the official schedule, it would inherit the same inaccuracy problem our interviewees described. Our product's value comes from community verification and honest status labelling (CONFIRMED vs ESTIMATED), which a platform solution cannot deliver without a local data network we are already building. |
| A better-funded Georgian EdTech or civic-tech startup targets the Kutaisi transit problem directly | Direct competitor | Low | The market is narrow enough to be unattractive to well-funded generalists. If a direct competitor emerges, our response is to accelerate university partnership agreements with KIU and begin expansion to Georgian Technical University, Tbilisi State University, and Ilia State University — moves already planned in our roadmap. A competitor cannot replicate our community data and student trust without repeating our 12-interview discovery process and rebuilding user relationships from zero. |

**Threat type definitions:**
- **Platform threat:** A larger platform (Google, Apple, Microsoft) adds our core functionality as a feature.
- **Institutional threat:** A university, library system, or government body builds their own version of our product.
- **Direct competitor:** A startup or existing company targets the same users with a similar approach.
- **Technology shift:** A new technology makes our current approach redundant or significantly easier to replicate.

---

## 4. Complementors

Parties whose product or service increases demand for ours, even without a formal relationship. Different from complements: a complementor does not need to be used alongside our product. Their success creates the conditions that make our product more valuable.

| Complementor | How they increase demand for us | Priority for engagement |
|-------------|-------------------------------|------------------------|
| Marshrutka operators running intercity routes (Samtredia–Kutaisi, Terjola–Kutaisi) | TsiraB and NikolozK both commute into Kutaisi by marshrutka before catching Bus #3. Every student who travels this multi-leg route is a high-value user for us: a missed Bus #3 connection costs them the entire morning, not just 30 minutes. Growth in intercity student enrolment at KIU directly expands our highest-urgency user segment. | Medium — explore whether marshrutka schedule data could be integrated to give intercity commuters a full two-leg journey view, which no competing tool offers. |
| KIU itself, as it grows enrolment and recruits students from further afield | A larger and more geographically distributed student body means more students dependent on public transit and more users with acute commute uncertainty. Every new KIU enrolment from outside Kutaisi is a potential user with the same problem our interviewees described. | Low — no direct engagement needed; enrolment growth benefits us passively. |
| Organisations and lecturers who run early-morning seminars and graded assessments | Graded quizzes at 9am are the direct cause of the highest-stakes commute anxiety documented across multiple interviews. The more high-stakes early sessions KIU schedules, the stronger the motivation to trust a reliable status tool. Dachi lost GPA points because of bus unreliability; Giorgi missed four or five quizzes in a semester. The academic cost is what turns a transport frustration into a genuine problem worth solving. | Low — no direct engagement needed; academic pressure creates our demand. |
| Student wellbeing and mental health advocates at KIU | Our affinity map documented that Bus #3 unreliability has crossed from inconvenience into physiological harm: sleep disruption (Dimitri waking at 6am for a 9am class), stress, and academic disengagement after missed seminars. Wellbeing campaigns that highlight the cost of commute stress on student performance implicitly validate the problem we are solving. | Low — no direct engagement needed; their framing supports our problem narrative in any pitch or partnership conversation. |

---

## Strategic Priorities

**The partner relationship we should prioritise in the next 90 days:**

The KIU Student Union is the highest-priority partner relationship to formalise before Demo Day. The SU has direct communication access to the entire enrolled student population and is a trusted, neutral channel that is not associated with the operator or municipal infrastructure that students have already rejected. Our value exchange is clear: we give the SU access to anonymised, aggregate Bus #3 delay data that documents the scale of the commute problem — data they can use when making formal representations to the university or municipality. In return, they give us one newsletter feature and a pinned post in official student Messenger groups. The Messenger group channel is particularly important because our research showed that students are already attempting to share informal bus status updates in these groups (TsiraB: "I check the Messenger groups but everyone is just complaining"). A formal partnership gives us a distribution channel directly inside the informal system our users already rely on. The specific next step is to draft the partnership proposal and submit it to the SU president's office by June 16, with the offer framed around data access rather than promotion.

**The threat most likely to materialise and our counter-strategy:**

The most likely threat to materialise is the existing bus tracking app improving its accuracy sufficiently to recover some user trust. We rate this as medium likelihood because the operator has a visible incentive to address the public criticism the app has generated, and a basic backend improvement is lower effort than building a new product. Our counter-strategy is not to race the operator on data quality — we cannot win that race if they fix their GPS feed — but to ensure our product offers dimensions the operator's app structurally cannot: community-verified status labels (CONFIRMED vs ESTIMATED), crowding level data sourced from student reports, and departure time recommendations calibrated to the student's own schedule. These features require a user base that trusts us enough to contribute data. We will therefore prioritise growing our verified contributor user base through the SU partnership and usability testing programme in Sprint 3, so that by the time any operator improvement lands, our community data layer is too valuable to abandon. The critical milestone is reaching 50 active contributing users before Demo Day.

**The complementor we could engage for a lightweight co-promotion:**

The marshrutka operators running the Samtredia–Kutaisi and Terjola–Kutaisi intercity routes are the most strategically aligned complementor for a lightweight co-promotion. Their passengers — students like TsiraB and NikolozK — are our highest-urgency users: people who have already invested 45–90 minutes of travel before they reach the Bus #3 stop, for whom a missed connection is catastrophic. A co-promotion does not require a formal agreement: we could print a small card or QR code pointing to our product and ask marshrutka drivers informally to allow us to place it near the fare collection point. The first step is for one team member to ride the Samtredia–Kutaisi and Terjola–Kutaisi marshrutka routes in the next two weeks, identify the highest-frequency morning departures, and have an informal conversation with two or three drivers about whether a QR card placement is feasible. This costs nothing and directly reaches the segment most motivated to use our product.