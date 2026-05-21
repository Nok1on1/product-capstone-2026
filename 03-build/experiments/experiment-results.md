# Experiment Results

## Interim Data Synthesis
*(Note: As the full experiment window runs from May 19 to June 2, this section contains rapid-test interim data gathered between May 19 and May 21 to validate our riskiest assumptions.)*

**Objective:** Validate that students value real-time bus tracking by engaging with the core flow (checking bus ETA) and relying on community features (submitting crowd reports), proving a reduction in commute uncertainty.

**Interim Metrics (May 19 - May 21):**
* **Total Unique Visitors (`app_opened`):** 20 users
* **Core Action (`bus_status_confirmed` / `bus_status_estimated`):** 15 users (75.0% of visitors checked a route)
* **Secondary Action (`crowd_report_submitted`):** 5 users 
* **Completion Rate (`boarding_confirmed`):** Of the 15 users who checked a route status, 12 successfully tracked and boarded their bus (80.0% conversion).

**Qualitative Feedback from Rapid Test:**
* Users found the UI intuitive and checking the status helped them avoid extreme early departures.
* Several users noted they appreciate the community crowding reports to know if they will actually fit on the bus.

## Pivot or Persevere Decision
**Decision:** Persevere (with minor UI iterations)

**Justification:**
Based on the interim data, we are choosing to **persevere**. The core hypothesis—that students will use an integrated, community-verified system to check bus statuses—is heavily supported by the 75.0% engagement rate with core tracking features and the strong conversion (80.0%) to actual boardings (`boarding_confirmed`). 

While this is interim data and the experiment officially runs until June 2, the initial signal is strong enough to justify our current architectural and design path. We will continue compiling data and iterating slightly on the departure confirmation screens, but no foundational pivot is required at this stage.
