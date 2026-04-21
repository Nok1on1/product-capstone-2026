# Event Schema

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** April 21, 2026
**Version:** 1.0
**Status:** Blueprint (instrumentation code written in Lab 6)

---

## Naming Convention

All events follow this rule without exception:

```
object_action (snake_case, past tense)
```

Examples of correct names: `user_signup_completed`, `booking_created`, `space_search_started`
Examples of incorrect names: `UserSignupCompleted`, `create_booking`, `search`, `click_button`

---

## North Star Metric

> Weekly reliable arrival confirmations received per active user per commute week

**Activation event that drives NSM:** `bus_status_confirmed`

---

## Universal Properties

Every event automatically includes these properties. Do not repeat them in individual event definitions.

| Property | Type | Description |
|----------|------|-------------|
| `user_id` | string (UUID) | System-generated user identifier. Never an email address. |
| `timestamp` | ISO 8601 datetime | When the event fired. Always include timezone (Z for UTC). |
| `session_id` | string (UUID) | The session in which the event occurred. |
| `platform` | enum: web, ios, android | The platform the event was fired on. |

---

## Event Definitions

### ACQUISITION

---

#### `user_signup_completed`

**AARRR Stage:** Acquisition
**Description:** User completes account registration
**Fires when:** User successfully submits signup form with email and password
**NSM connection:** None -- acquisition only

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `signup_method` | enum | Yes | Method used to sign up | `"email"` |
| `initial_bus_stop` | string | Yes | The bus stop the user initially selects | `"KIU Main Gate"` |

**Example payload:**
```json
{
  "event_name": "user_signup_completed",
  "user_id": "user_abc123",
  "timestamp": "2026-04-09T14:23:45Z",
  "session_id": "sess_xyz789",
  "platform": "web",
  "signup_method": "email",
  "initial_bus_stop": "KIU Main Gate"
}
```

---

#### `app_opened`

**AARRR Stage:** Acquisition
**Description:** User opens the application for the first time in a session
**Fires when:** User loads the web app or opens the mobile app
**NSM connection:** None -- acquisition only

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `referral_source` | string | No | How the user found the app | `"direct"`, `"friend_share"`, `"campus_post"` |

---

### ACTIVATION

---

#### `bus_status_confirmed` ← THIS IS YOUR ACTIVATION EVENT

**AARRR Stage:** Activation
**Description:** User receives a confirmed bus arrival status at their selected stop. This is the aha moment — the user gets reliable information they can trust to make a commute decision.
**Fires when:** User queries a bus stop and receives a status that is marked as "CONFIRMED" (real-time data available)
**NSM connection:** This event directly drives the NSM. Each firing of this event increments the weekly reliable arrival confirmation count for that user_id.

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `bus_line` | string | Yes | The bus line queried | `"#3"` |
| `bus_stop` | string | Yes | The stop where user is waiting | `"KIU Main Gate"` |
| `estimated_arrival_minutes` | integer | Yes | Estimated minutes until arrival | `8` |
| `status_confidence` | enum | Yes | Whether this is confirmed or estimated | `"confirmed"` |
| `crowd_level` | enum | No | Estimated crowding level | `"low"`, `"medium"`, `"high"` |

**Example payload:**
```json
{
  "event_name": "bus_status_confirmed",
  "user_id": "user_abc123",
  "timestamp": "2026-04-09T14:23:45Z",
  "session_id": "sess_xyz789",
  "platform": "web",
  "bus_line": "#3",
  "bus_stop": "KIU Main Gate",
  "estimated_arrival_minutes": 8,
  "status_confidence": "confirmed",
  "crowd_level": "medium"
}
```

---

#### `departure_decision_made`

**AARRR Stage:** Activation
**Description:** User makes a decision about when to leave for the bus stop based on the information received
**Fires when:** User confirms their departure time after receiving a confirmed status
**NSM connection:** This event validates that the confirmed status led to action. Connects to NSM as a secondary indicator that the information drove real behavior.

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `departure_time_selected` | integer | Yes | Minutes until departure user selected | `5` |
| `reliable_information_received` | boolean | Yes | Whether user had confirmed info when deciding | `true` |

---

### RETENTION

---

#### `user_session_started`

**AARRR Stage:** Retention
**Description:** User returns and starts a new session in the app
**Fires when:** User logs in and opens the app after 24+ hours of inactivity
**NSM connection:** Tracks return usage. Users who return and query status regularly are retained.

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `days_since_last_session` | integer | Yes | Days since last app open | `2` |
| `total_sessions` | integer | Yes | Cumulative sessions for this user | `12` |

---

#### `bus_status_queried_again`

**AARRR Stage:** Retention
**Description:** User returns and queries bus status again within the same day
**Fires when:** User makes a second or subsequent status query in a 24-hour period
**NSM connection:** This event tracks repeat usage. Users who query multiple times show the product is valuable enough to check repeatedly.

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `queries_today` | integer | Yes | Number of queries in current day | `3` |
| `time_since_last_query_minutes` | integer | Yes | Minutes since last query | `15` |

---

### REFERRAL

---

#### `invite_sent`

**AARRR Stage:** Referral
**Description:** User sends an invite to a friend
**Fires when:** User shares the app via invite link or code
**NSM connection:** None -- referral only

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `invite_method` | enum | Yes | How the invite was sent | `"link"`, `"code"`, `"share"` |
| `recipient_count` | integer | Yes | Number of people invited | `1` |

---

### REVENUE (if applicable)

---

#### N/A

**AARRR Stage:** Revenue
**Description:** Not applicable for MVP — no paid tier yet
**Fires when:** N/A
**NSM connection:** Not applicable for MVP -- no paid tier yet

| Property | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| N/A | N/A | N/A | N/A |

---

## Event Summary Table

| Event Name | AARRR Stage | Priority | NSM Driver |
|-----------|-------------|----------|-----------|
| `user_signup_completed` | Acquisition | Must | No |
| `app_opened` | Acquisition | Must | No |
| `bus_status_confirmed` | Activation | Must | Yes |
| `departure_decision_made` | Activation | Should | Indirect |
| `user_session_started` | Retention | Must | Indirect |
| `bus_status_queried_again` | Retention | Should | Indirect |
| `invite_sent` | Referral | Should | No |

**Total events:** 7
**Must-have events:** 5
**Should-have events:** 2

---

## Privacy Confirmation

Confirm that no event in this schema captures PII:

- [x] No email addresses in any event property
- [x] No user names or display names in any event property
- [x] No phone numbers in any event property
- [x] No physical addresses in any event property
- [x] No payment card details in any event property
- [x] All user identification uses system-generated UUIDs only

**Schema reviewed by:** Team Bandersnatch on April 21, 2026

---

## Instrumentation Notes for Lab 6

This is the blueprint only. In Lab 6, you will write the actual code to fire these events in your Google AI Studio app.

For each event, note where in the application flow it fires:

| Event Name | Where in Code | Frontend or Backend |
|-----------|--------------|-------------------|
| `user_signup_completed` | On successful signup form submission | Frontend |
| `app_opened` | On app load, first paint | Frontend |
| `bus_status_confirmed` | After receiving confirmed status from API | Frontend |
| `departure_decision_made` | On user confirming departure time | Frontend |
| `user_session_started` | On user login after 24h inactivity | Backend |
| `bus_status_queried_again` | On status query API call (2nd+ in 24h) | Backend |
| `invite_sent` | On invite share action | Frontend |

---

## Analytics Tool Selection

Which tool will you use to receive and store your events?

- [ ] Mixpanel (best for funnel analysis)
- [ ] Amplitude (best for retention curves)
- [ ] PostHog (best for self-hosted, privacy-conscious products)
- [x] Google Analytics 4 (best for web-only MVPs)
- [ ] Custom backend event store

**Our choice:** Google Analytics 4
**Reason:** Free for web apps, integrates well with Google ecosystem, sufficient for MVP event tracking needs.
**Free tier limit:** GA4: 500K events per month (generous for MVP)

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| April 21, 2026 | 1.0 | Initial schema blueprint | Team Bandersnatch |

---

*Event Schema | Bandersnatch | CS-PD-2026 | Spring 2026*