# Analytics Dashboard

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Last updated:** May 21, 2026

---

## Dashboard Link

[Firebase Analytics Console](https://console.firebase.google.com/project/bandersnatch123/analytics)

Access requires the Firebase project owner to grant Viewer role to the grader's Google account.

---

## Event Schema

The following 7 events are defined in [event-schema.md](event-schema.md) and instrumented in the app:

| Event | AARRR Stage | Priority | Status |
|---|---|---|---|
| `user_signup_completed` | Acquisition | Must | ✅ Instrumented |
| `app_opened` | Acquisition | Must | ✅ Instrumented |
| `bus_status_confirmed` | Activation | Must | ✅ Instrumented |
| `departure_decision_made` | Activation | Should | ✅ Instrumented |
| `user_session_started` | Retention | Must | ✅ Instrumented |
| `bus_status_queried_again` | Retention | Should | ✅ Instrumented |
| `invite_sent` | Referral | Should | ✅ Instrumented |

---

## Core Flow Event Sequence

The core user flow fires these events in order:

1. **app_opened** — User lands on the app
2. **user_signup_completed** — User completes email/password signup
3. **bus_status_confirmed** — User selects a stop and checks bus status (activation event)
4. **departure_decision_made** — User confirms departure time

**Verification:** Open Firebase Analytics DebugView, perform the flow above on a device not logged into any team account, and confirm each event appears in the realtime dashboard.

---

## Real User Sessions

| Metric | Value | Date Range |
|---|---|---|
| Total unique users | 15 | May 21, 2026 |
| `user_signup_completed` events | 2 | May 21, 2026 |

---

## Instrumentation Notes

Analytics is implemented via **Firebase Analytics** (`firebase/analytics`), which
is bundled with the existing Firebase SDK. Events fire from client-side page
components using `logEvent()` calls mapped to the event schema definitions.

---

*Analytics Dashboard Link | Bandersnatch | CS-PD-2026 | Spring 2026*
