# Consent Flow Design

**Product:** Bus #3 Real-Time Tracker
**Team:** Bandersnatch
**Date:** 22 May 2026
**Related file:** `08-legal/privacy-notice.md`

---

## Overview

This document describes how our product obtains, records, and allows withdrawal of user consent under GDPR. Consent under GDPR must satisfy six requirements: freely given, specific, informed, unambiguous, withdrawable, and documented.

**Current state:**
- Our consent mechanism does not yet exist. This document describes our intended implementation and the timeline for building it.

---

## 1. What Requires Consent

Not all data processing requires consent. Processing necessary for a contract (e.g. account creation) uses the contract lawful basis. Processing based on legitimate interest does not require consent but requires a legitimate interest assessment. Consent is specifically required for:

| Processing activity | Why consent is needed (not another lawful basis) |
|--------------------|-------------------------------------------------|
| Push notification delivery | Push notifications go beyond the core service — the user should explicitly opt in to receiving alerts on their device |
| Analytics data processing beyond legitimate interest | If we ever add behavioural profiling or personalised content, that requires consent |
| Marketing communications (future) | Marketing requires explicit opt-in consent, cannot rely on legitimate interest |

**Note:** Currently, all data processing in the MVP is justified under contract (account creation, core service features) or legitimate interest (analytics, location sharing). No processing currently requires explicit consent. However, we will implement a consent mechanism proactively to prepare for future features and to be fully transparent.

---

## 2. Where Consent Is Obtained: The Consent Moment

**Current state:** No consent moment exists in the current signup flow. The signup form collects email, password, display name, and bus stop selection, then creates the account. No consent checkboxes are presented.

**Intended implementation:**

**Location in the flow:**
After the user fills in their email, password, display name, and bus stop on the signup screen, before they click the Create Account button.

**What the user will see:**

```
Below the form fields, before the submit button:

  ┌──────────────────────────────────────────────────────────┐
  │  Privacy & Notifications                                 │
  │                                                          │
  │  ☐ I agree to receive push notifications about          │
  │    bus status updates (optional)                         │
  │                                                          │
  │  ☐ I acknowledge that by creating an account,           │  
  │      I agree to Privacy Notice (hyperlink).                          │
  │      We process your data to provide the service.        │
  │                                                          │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │                  Create Account                    │  │
  │  └────────────────────────────────────────────────────┘  │
  └──────────────────────────────────────────────────────────┘
```

**Key requirements to verify in the design:**

- [x] The consent checkbox is NOT pre-ticked (a pre-ticked box is not valid consent under GDPR)
- [x] Analytics consent and marketing consent are SEPARATE checkboxes, not bundled — analytics uses legitimate interest currently
- [x] Consent to terms of service (contract) is separate from consent to marketing (consent)
- [x] The user can create an account and use the product without ticking the optional consent boxes — push notification checkbox is optional
- [x] The privacy notice is linked and accessible before the user consents

---

## 3. Consent Categories

### Category 1: Push notification delivery

**Purpose:** Sending bus status updates, arrival alerts, and crowding notifications to the user's device via Firebase Cloud Messaging
**Is it optional?** Yes
**Default state:** Unchecked by default
**UI element:** Checkbox with label "I agree to receive push notifications about bus status updates (optional)"
**What happens if the user declines:** Account is created normally. User does not receive push notifications. They can still use the app and check status manually.

### Category 2: Analytics data processing beyond legitimate interest (future)

**Purpose:** Using detailed behavioural analytics to build a profile for product personalisation or targeted features
**Is it optional?** Yes
**Default state:** Unchecked by default
**UI element:** Checkbox with label "[description]" — not yet implemented
**What happens if the user declines:** Analytics processing stays at the legitimate interest level (aggregate product improvement without profiling)

---

## 4. Withdrawal Mechanism

Consent must be as easy to withdraw as it was to give. If consent was one click, withdrawal must also be one click.

**Current state:** Withdrawal UI does not exist yet.

**Intended mechanism:**

**Where can a user withdraw consent?**
Account > Settings > Notification preferences

**What the user will see:**

```
In Account > Settings > Notification preferences:

  ┌──────────────────────────────────────────────────────┐
  │  Notification Preferences                            │
  │                                                      │
  │  Push notifications about bus status updates         │
  │  [Enabled]                          [Disable]        │
  │                                                      │
  │  Analytics profiling for personalised content        │
  │  [Disabled]                          [Enable]        │
  │                                                      │
  │  (Toggling a setting saves immediately —             │
  │   no separate Save button needed)                    │
  └──────────────────────────────────────────────────────┘
```

**How many steps does withdrawal take?**
Two steps: navigate to Account > Settings, toggle the switch. The toggle itself is the only action — no confirmation dialog required, matching the one-click nature of consent.

**What data is deleted on withdrawal?**
When a user disables push notification consent, the FCM token is removed from Firestore and no further push notifications are sent. Analytics profiling opt-out means only aggregate (non-profiling) analytics continue.

**Implementation status:** Not yet built — gap acknowledged.

**What happens to data collected before withdrawal?**
Push notification tokens already stored in Firestore remain. No new push notifications will be sent. The user can also revoke browser notification permissions at any time via the browser's site settings panel.

---

## 5. Consent Storage Record

You must be able to prove consent was given, when, to what version of the privacy notice, and what action the user took.

**Current state:** No consent record is stored.

**Intended implementation:**

**Where is the consent record stored?**
In the `users/{userId}` Firestore document, in a `consent` map field.

**Schema:**
```
consent: {
  push_notifications: {
    given: true / false,
    timestamp: ISO 8601 datetime,
    privacy_notice_version: "1.0",
    method: "checkbox on signup screen"
  },
  analytics_profiling: {
    given: true / false,
    timestamp: ISO 8601 datetime,
    privacy_notice_version: "1.0",
    method: "checkbox on signup screen"
  }
}
```

**Implementation status:** Not yet implemented — gap acknowledged.

**How long do you retain consent records?**
Consent records are retained for the life of the account plus 2 years, to handle any disputes about whether consent was given.

---

## 6. Gaps and Remediation Plan

| Gap | Owner | Target completion date |
|-----|-------|----------------------|
| No consent checkboxes on signup form | Besik Meskhia | Sprint 2 (by 5 June 2026) |
| No consent withdrawal UI in Account/Settings | Giorgi Mikaberidze | Sprint 2 (by 5 June 2026) |
| Consent record not stored in Firestore user document | Nikoloz Kvirikashvili | Sprint 2 (by 5 June 2026) |
| No privacy notice link on signup page | Nikoloz Modebadze | Sprint 2 (by 5 June 2026) |
| Push notification consent checkbox copy and styling not finalised | Besik Meskhia | Sprint 2 (by 5 June 2026) |
