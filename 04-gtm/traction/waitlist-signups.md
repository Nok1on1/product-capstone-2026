# Waitlist Signups

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Acquisition channels:** QR flyers at bus stops, KIU student Telegram groups, word-of-mouth referral

---

> **Note:** Signup data is captured via Firebase Auth + Firestore (see [schema below](#collection-method)). This document is populated from the Firebase Analytics export (`Firebase_overview.csv`). Individual user PII (names, emails) requires a Firebase Auth users export.

## Collection Method

Signups are captured via Firebase Auth on the deployed application at `https://product-capstone-2026.vercel.app/en/signup`. Each signup creates a Firebase Auth account and a Firestore user profile document. Acquisition source is tracked via hidden `?source=` or `?utm_source=` URL params.

## Signup Data

| # | Name (optional) | Email | Primary Bus Stop | Source | Signup Date |
|---|-----------------|-------|------------------|--------|-------------|
|   |                 |       |                  |        |             |

*Individual PII export pending — export Firebase Auth users + Firestore `users/{uid}` documents to populate rows. Aggregate: **2 total signups** confirmed via GA4 `user_signup_completed` event.*

## Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Total signups | 2 | From GA4 `user_signup_completed` event count |
| Date range | Apr 5 – May 21, 2026 | Earliest cohort → latest analytics data |
| Acquisition sources | QR Flyers, Telegram Groups, Referral | Per growth strategy |
| Conversion rate | 11.8% | 2 signups / 17 first visits |
| Active users (30d) | 21 | |
| Active users (7d) | 20 | |
| Active users (1d) | 20 | |
| Top countries | GE (18), BG (1), US (1) | |
| Avg engagement time | 37.8s / active user | |
| Total page views | 20 | All on "Bandersnatch - Home" |

---

_Waitlist Signups | Bandersnatch | CS-PD-2026 | Spring 2026_
