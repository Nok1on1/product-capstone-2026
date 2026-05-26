# Privacy Notice

**Product:** Bus #3 Real-Time Tracker
**Team:** Bandersnatch
**Version:** 1.0
**Date:** 22 May 2026
**Effective from:** 22 May 2026

---

## 1. Who We Are

Bus #3 Real-Time Tracker is a live bus tracking application for KIU students that provides real-time status, location sharing, and crowding information for Bus #3. It is developed by Team Bandersnatch, a student team at Kutaisi International University as part of CS-PD-2026.

**Data controller contact:**
Name: Besik Meskhia
Email: besik.meskhia@kiu.edu.ge

---

## 2. What Personal Data We Collect and Why

### 2.1 Account and Identity Data

| Data category | Specific fields | Why we collect it | Lawful basis | Who can access it |
|---------------|----------------|-------------------|--------------|------------------|
| Account credentials | Email address, hashed password | To create and authenticate your account | Contract: necessary to provide the service | Firebase Auth team (Google) |
| Profile information | Display name, profile picture, role, trust score | To personalise your experience and manage gamification | Contract: necessary to provide the service | Firebase Auth team (Google), Firestore |
| Email verification status | emailVerified boolean | To ensure only verified users access full features | Contract: necessary to provide the service | Firebase Auth team (Google) |

### 2.2 Usage and Behavioural Data

| Data category | Specific fields | Why we collect it | Lawful basis | Third-party processor |
|---------------|----------------|-------------------|--------------|----------------------|
| Event data | user_signup_completed, app_opened, bus_status_confirmed, departure_decision_made, user_session_started, bus_status_queried_again | To understand how users use the product and improve it | Legitimate interest | Firebase Analytics (Google) |
| Session data | session_id, timestamp, platform (web), device type, language | To maintain your session, diagnose errors, and provide i18n | Legitimate interest | Firebase (Google) |

### 2.3 Location Data

| Data category | Specific fields | Why we collect it | Lawful basis | Third-party processor |
|---------------|----------------|-------------------|--------------|----------------------|
| Bus stop preference | defaultStop (stop ID) | To show relevant bus status for your stop | Contract: necessary to provide the service | Firestore (Google) |
| Peer location | Latitude/longitude, timestamp | To show your live location to other users on the map | Legitimate interest | Firestore (Google) |
| Approximate location | City-level from IP address | To load the correct map region | Legitimate interest | Vercel, Leaflet/OSM |

### 2.4 Transaction and Activity Data

| Data category | Specific fields | Why we collect it | Lawful basis | Third-party processor |
|---------------|----------------|-------------------|--------------|----------------------|
| Bus tracking reports | stop_id, bus_line, direction, timestamp, userId | To provide and verify bus arrival data | Contract: necessary to provide the service | Firestore (Google) |
| Boarding reports | userId, stop, bus_line, timestamp, direction | To report who is on the bus and trust scoring | Contract: necessary to provide the service | Firestore (Google) |
| Ride history | userId, report timestamps, trust score changes | To display ride history and compute trust | Contract: necessary to provide the service | Firestore (Google) |

### 2.5 Push Notification Data

| Data category | Specific fields | Why we collect it | Lawful basis | Third-party processor |
|---------------|----------------|-------------------|--------------|----------------------|
| FCM push tokens | FCM device token | To send push notifications about bus status | Legitimate interest | Firebase Cloud Messaging (Google) |

---

## 3. Third-Party Processors

| Processor | Service type | Data they receive | Their privacy policy |
|-----------|-------------|-------------------|---------------------|
| Firebase (Google) | Authentication, database, analytics, push notifications | Account credentials, all stored user data, event data, FCM tokens | firebase.google.com/support/privacy |
| Vercel | Hosting and serverless functions | Server logs, IP addresses, request metadata | vercel.com/legal/privacy-policy |
| Google Analytics / Firebase Analytics | Product analytics | Event data, session data, device info | policies.google.com/privacy |
| OpenStreetMap (OSM) | Map tiles | IP address (for tile requests) | osm.org/privacy |
| OSRM (Open Source Routing Machine) | Route polyline data | IP address (for routing requests) | project-osrm.org |

---

## 4. How Long We Keep Your Data

| Data category | Retention period | What triggers deletion |
|---------------|-----------------|----------------------|
| Account data | Until account deletion request + 30 days | User submits deletion request via email |
| Event analytics data | 12 months rolling | Automatic deletion on a schedule |
| Server logs (Vercel) | 30 days | Automatic deletion |
| Peer location data | Deleted after 5 minutes of inactivity | Automatic cleanup on disconnect |
| FCM push tokens | Until user logs out or token rotates | Token refresh or account deletion |
| Bus reports | Retained for service quality; deleted on account deletion | Account deletion request |

---

## 5. Your Rights

Under GDPR, you have the following rights. For each right, we describe how to exercise it and our response time.

| Right | What it means | How to exercise it | Our response time |
|-------|--------------|-------------------|------------------|
| Right to access | You can request a copy of all personal data we hold about you | Email besik.meskhia@kiu.edu.ge with subject "Data Access Request" | Within 30 days |
| Right to erasure | You can request deletion of your personal data | Email besik.meskhia@kiu.edu.ge with subject "Erasure Request" | Within 30 days |
| Right to rectification | You can request correction of inaccurate data | Email besik.meskhia@kiu.edu.ge with subject "Rectification Request" | Within 30 days |
| Right to restriction | You can request we stop processing your data in certain ways | Email besik.meskhia@kiu.edu.ge with subject "Processing Restriction" | Within 30 days |
| Right to portability | You can request your data in a machine-readable format | Email besik.meskhia@kiu.edu.ge with subject "Data Portability Request" | Within 30 days |
| Right to object | You can object to processing based on legitimate interest | Email besik.meskhia@kiu.edu.ge with subject "Processing Objection" | Within 30 days |

If you believe we are processing your data unlawfully, you have the right to lodge a complaint with the supervisory authority in Georgia or your country of residence.

---

## 6. Data Breach Procedure

In the event of a personal data breach, we will:

1. Assess the breach within 24 hours of becoming aware of it
2. Notify the relevant supervisory authority within 72 hours if the breach is likely to result in a risk to the rights and freedoms of natural persons
3. Notify affected users without undue delay if the breach is likely to result in a high risk to their rights and freedoms

**Person responsible for breach response:** Besik Meskhia (besik.meskhia@kiu.edu.ge)

---

## 7. Cookies and Tracking Technologies

| Cookie or tracker | Purpose | Duration | Can you opt out? |
|-------------------|---------|----------|-----------------|
| Firebase session token | Maintains your login session | Session | No, required for the product to function |
| Firebase Analytics cookies | Tracks product usage events | 12 months | Yes — opt out via browser settings or use the product without analytics consent |
| Firebase Cloud Messaging token | Enables push notifications | Until rotated | Yes — revoke notification permissions in browser settings |
| Theme preference (localStorage) | Remembers dark/light mode preference | Persistent | N/A (local storage, not a cookie) |

---

## 8. Changes to This Notice

We will update this notice when our data practices change. We will notify users of material changes by in-app notification and an updated date at the top of this document. Continued use of the product after a change constitutes acceptance of the updated notice.

---

## 9. Contact

For any question related to this privacy notice or to exercise your rights:

**Name:** Besik Meskhia
**Email:** besik.meskhia@kiu.edu.ge
**Response time:** Within 5 business days for general questions, within 30 days for formal rights requests

---

*This privacy notice was last updated on 22 May 2026. Version 1.0.*
