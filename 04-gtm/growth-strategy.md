# Growth Strategy Document

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Market:** KIU students commuting via Bus #3
**Date:** May 13, 2026
**Version:** 1.0

---

## Channel Overview

| Rank | Channel | Type | Fit | Speed | Cost | Target Users |
|---|---|---|---|---|---|---|
| 1 | Bus Stop QR Code Flyers | Direct / Outbound | High | Medium | Low (~$15) | Students waiting at Bus #3 stops |
| 2 | Student Telegram & WhatsApp Groups | Organic / Community | High | Fast | Free | Existing student group chats |
| 3 | Referral — Share Status with Friends | Viral / Product-Integrated | High | Slow | Free | Existing users inviting classmates |

---

## Channel 1 — Bus Stop QR Code Flyers

**Type:** Direct / Outbound

**Description:** Print A5 flyers with a QR code linking to the deployed app URL. Post at the 5 highest-traffic Bus #3 stops: KIU Main Gate, KIU K Building, Colchis Fountain, Railway Station, and Tsereteli Uni.

### Fit

The target user is physically present at these stops 2–5 times per day. They are standing idle, waiting for a bus, with their phone in hand — the exact moment of peak relevance. A student who scans the QR code at 8:30 AM while waiting for a delayed bus is the highest-intent user possible. The channel reaches users at the point of pain, not through an abstract ad.

Interview evidence: P08 said "I waited for an hour. I was just standing there scrolling TikTok." The flyer intercepts that scrolling moment.

### Speed

Medium — flyers can be printed and posted within 2 days of design approval. First users can onboard the same day. However, flyers degrade in weather and may be removed by cleaners, requiring weekly replenishment. Reach is limited to students who pass through those specific stops.

### Cost

Approximately $15 total for the MVP experiment:

| Item | Cost |
|---|---|
| 100 A5 flyers (color, local print shop) | ~10 GEL ($3) |
| Lamination (weatherproofing) | ~5 GEL ($1.50) |
| Tape + staples | ~5 GEL ($1.50) |
| Design time (in-house, Canva) | Free |
| **Total** | **~$6** |

### Expected Reach

Each flyer at a busy stop (KIU Main Gate) is seen by an estimated 200–400 students per day. With 5 stops over 2 weeks: estimated 5,000–10,000 impressions. Expected conversion rate: 1–3% scan-to-signup = **50–300 new users** over 2 weeks.

---

## Channel 2 — Student Telegram & WhatsApp Groups

**Type:** Organic / Community

**Description:** Post a formatted announcement in existing KIU student Telegram and WhatsApp groups where Bus #3 commuters already coordinate. Include a short description of the problem, the value proposition ("honest bus status — no more guessing"), and the app link.

### Fit

The user is already in these groups. Interview P11 mentioned relying on "Messenger group chats" as a coping strategy. The groups are an existing distribution channel with zero acquisition cost — students are already asking "is the bus here yet?" in these chats. The product replaces that conversation with a direct answer.

The 12 interview participants are already part of these groups and can be the first wave of seed users. Their testimonials ("I used to leave 2 hours early, now I check the app") are authentic promotion material.

### Speed

Fast — a single post in a group with 200+ members can generate 20–50 signups within 24 hours. No design or printing needed. However, group admins may flag repeated posts as spam, so this is a one-shot channel per group per semester.

### Cost

Free. Requires only writing a post and having 2–3 team members share it in their respective groups.

### Expected Reach

| Group | Estimated Members | Est. Signups (5% conversion) |
|---|---|---|
| KIU Student Council Telegram | 400+ | 20 |
| Bus #3 Commuter Chat Telegram | 200+ | 10 |
| Year-group WhatsApp groups (4 groups × 50) | 200+ | 10 |
| **Total** | **800+ students** | **40+ signups** |

---

## Channel 3 — Referral (Share Status with Friends)

**Type:** Viral / Product-Integrated

**Description:** An in-app "Share bus status" button that generates a link or screenshot the user can send to a friend via any messaging app. The link opens the app with the sender's bus stop and ETA pre-filled. The friend sees the same status information without needing to sign up (teaser view), with a "Get the app" call-to-action.

### Fit

The product has a natural viral mechanic: if you are at the bus stop and your friend is still at home, you share your status so they know when to leave. Interview P02 said "My friend also takes the same bus" — users already coordinate departures. The share feature makes that coordination one tap instead of a text message conversation.

### Speed

Slow — the share feature is built (Sprint 3 item in the roadmap) but requires users to be active first. Viral coefficient depends on existing user base. With an estimated K-factor of 0.2 (20% of users share, 1 in 5 recipients sign up), the channel compounds slowly but sustainably.

### Cost

Free — the share feature is already in the roadmap as story S3-01. No additional spend.

### Expected Reach

| Metric | Estimate |
|---|---|
| Weekly active users | 100 (after Channels 1+2) |
| Share rate (% of active users who share per week) | 20% |
| Shares per week | 20 |
| Conversion rate (recipient to signup) | 20% |
| New users from referral per week | 4 |
| Cumulative referral users after 4 weeks | ~16 |

---

## Channel Comparison

| Dimension | Channel 1 (QR Flyers) | Channel 2 (Groups) | Channel 3 (Referral) |
|---|---|---|---|
| **Type** | Direct / Outbound | Organic / Community | Viral / Product |
| **Time to first user** | 2 days | 1 hour | 2–4 weeks |
| **Cost per user** | ~$0.02 | $0 | $0 |
| **Scalability** | Limited by stop foot traffic | Limited by group size and admin tolerance | Compounds with user base |
| **User quality** | High (captured at pain point) | Medium (passive group member) | High (trusted invite from friend) |
| **Measurement** | QR scan events + signup source | UTM link + signup source | `invite_sent` event in GA4 |

### Recommended Phasing

| Phase | Week | Channels Active | Goal |
|---|---|---|---|
| 1 | May 19–25 | Channel 2 (Groups) + Channel 1 (Flyers) | Reach 50 signups |
| 2 | May 26–Jun 1 | Channel 1 + Channel 2 + Channel 3 (if built) | Reach 150 signups |
| 3 | Jun 2–8 | All three + iterate based on CAC data | Reach 300 signups |

---

## Rejected Channel: Paid Social Media Ads (Instagram / Facebook)

**Type:** Paid / Digital Advertising

**Why rejected:**

1. **Cost:** KIU students are a narrow demographic within a small geographic area (Kutaisi). Instagram's targeting can narrow to "located in Kutaisi, aged 18–25, interested in KIU" but the audience size is too small for the platform's delivery algorithm to optimize effectively. Estimated CPM: $8–12. With a $50 budget, we would reach ~5,000 impressions with an estimated 0.5% CTR = 25 clicks. At a generous 10% signup conversion = 2.5 users. **Cost per user: ~$20.** Compare to Channel 1 ($0.02/user) and Channel 2 ($0/user).

2. **Targeting precision:** The people who need this app are specifically Bus #3 commuters. Instagram cannot distinguish Bus #3 riders from students who live on campus and never take the bus. We would waste budget reaching irrelevant users.

3. **Timing mismatch:** Paid ads work best for products with a clear purchase intent (e-commerce, SaaS). Our product is a free utility that requires behaviour change. A student who sees an ad at 10 PM is unlikely to remember it at 7:30 AM the next morning when they are at the bus stop. The QR flyer captures them at exactly that 7:30 AM moment.

4. **Budget:** The team has $0 marketing budget. Channel 1 costs $6 out-of-pocket. Channels 2 and 3 cost nothing. Paid ads would require external funding or personal expense with no guarantee of return.

**When it would make sense:** After we have product-market fit evidence (40%+ buffer reduction from Experiment 1) and a budget from a grant or university sponsorship. At that point, Instagram/Facebook ads targeting KIU students with testimonial content could scale acquisition beyond the organic ceiling.

---

## Assumptions That Would Invalidate This Strategy

| Assumption | If False, Fallback |
|---|---|
| Students will scan a QR code at a bus stop | Run a QR usage experiment: offer a small incentive (coffee coupon) for scanning. If scan rate is below 1%, switch to handing out flyers in person during peak hours. |
| Group admins will allow the post | Contact admins directly before posting. Offer a value exchange (early access, direct feedback channel). If denied, individual DMs instead of group posts. |
| Students will share bus status with friends | If share rate is below 10% after 4 weeks, run a user interview sprint to understand friction. Add a friction-reducing feature (one-tap share, pre-filled message). |
| The app works reliably enough to earn referrals | This is the core product risk (see Risk R2 in risk register). If the app provides wrong ETAs, no growth channel can compensate — users will not refer a broken product. Fix the data source first. |

---

## Change Log

| Date | Version | Changes | Author |
|---|---|---|---|
| May 13, 2026 | 1.0 | Initial growth strategy | Team Bandersnatch |

---

*Growth Strategy Document | Bandersnatch | CS-PD-2026 | Spring 2026*
