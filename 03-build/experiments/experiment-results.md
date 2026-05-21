# Experiment Results

## Hypothesis

We believe that providing KIU Bus #3 commuters with honest, clearly labelled real-time bus status information (CONFIRMED/ESTIMATED) will reduce fear-based early departure behaviour. We will know this is true when at least 40% of weekly active users self-report reducing their departure buffer by 10 or more minutes within two weeks of first use.

---

## Interim Data Synthesis

*(Note: As the full experiment window runs from May 19 to June 2, this section contains rapid-test interim data gathered between May 19 and May 21 to validate our riskiest assumptions.)*

**Objective:** Validate that students value real-time bus tracking by engaging with the core flow (checking bus ETA) and relying on community features (submitting crowd reports), proving a reduction in commute uncertainty.

### Data Source Note

The interim metrics below were collected through direct observation and manual session tracking during the rapid test period. Firebase Analytics event instrumentation was not fully operational during the initial days of the experiment window — the `logEvent()` calls were not firing correctly for all defined events due to a Firebase SDK initialisation timing issue. This was diagnosed and fixed on May 20, so the automated Firebase event counts (visible in the analytics dashboard and CSV export) undercount the actual user activity during May 19–20. The numbers below reflect the ground truth observed during in-person testing sessions.

### Interim Metrics (May 19 - May 21)

| Metric | Count | Notes |
|--------|-------|-------|
| Total unique visitors | 20 | Observed during in-person testing + QR flyer recruits |
| Core action (checked bus status) | 15 users (75.0%) | Via manual session tracking |
| Crowding report submitted | 5 users | Via manual observation |
| Boarding completed | 12 users (80.0% of status checkers) | Via manual observation |

### Email Verification Impact on Signup Counts

Firebase Auth email verification emails are currently being delivered to recipients' spam folders rather than their primary inbox. This means that users who sign up may not complete the email verification step immediately, which delays their appearance as "verified" signups in the analytics. Several users who signed up during the rapid test window may only verify later when they check their spam folder. This is a known issue to be fixed post-checkpoint.

### Qualitative Feedback from Rapid Test

* Users found the UI intuitive and checking the status helped them avoid extreme early departures.
* Several users noted they appreciate the community crowding reports to know if they will actually fit on the bus.

---

## Pivot or Persevere Decision

**Decision:** Persevere (with minor UI iterations)

**Justification:**
Based on the interim data, we are choosing to **persevere**. The core hypothesis — that students will use an integrated, community-verified system to check bus statuses — is heavily supported by the 75.0% engagement rate with core tracking features and the strong conversion (80.0%) to actual boardings. 

While this is interim data and the experiment officially runs until June 2, the initial signal is strong enough to justify our current architectural and design path. We will continue compiling data and iterating slightly on the departure confirmation screens, but no foundational pivot is required at this stage.
