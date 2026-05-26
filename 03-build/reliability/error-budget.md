# Error Budget

**Product:** Bus #3 Real-Time Tracker
**Team:** Bandersnatch
**Window:** 22 May 2026 to 21 June 2026
**Date last updated:** 22 May 2026

---

## Error Budget Summary

| SLO | Target | Window | Budget (minutes) | Consumed | Remaining | Status |
|-----|--------|--------|-----------------|----------|-----------|--------|
| Availability | 99% | 30 days | 432 | 0 | 432 | Green |
| Core flow success | 98% | 30 days | 864 | 0 | 864 | Green |

**Status key:**
- Green: more than 50% of budget remaining
- Amber: 10% to 50% of budget remaining
- Red: less than 10% of budget remaining, or budget exhausted

---

## Budget Calculation

### SLO 1: Availability

```
SLO target: 99%
Allowed downtime rate: 1 - 0.99 = 0.01 = 1%

Window in minutes:
30 days x 24 hours x 60 minutes = 43,200 minutes

Error budget:
0.01 x 43,200 = 432 minutes per 30-day window

Equivalent in hours: 432 / 60 = 7.2 hours
Equivalent in days: 7.2 / 24 = 0.3 days
```

### SLO 2: Core flow success rate

```
SLO target: 98%
Allowed failure rate: 1 - 0.98 = 0.02 = 2%

Window in minutes:
30 days x 24 hours x 60 minutes = 43,200 minutes

Error budget:
0.02 x 43,200 = 864 minutes per 30-day window

Equivalent in hours: 864 / 60 = 14.4 hours
```

---

## Incident Log for This Window

No incidents this window. Budget tracking started 22 May 2026.

| Incident | Date | Duration | SLOs affected | Budget consumed | Postmortem link |
|----------|------|----------|--------------|----------------|----------------|
| (None to date) | | | | | |

**Total budget consumed this window:**

| SLO | Budget consumed | Budget remaining | % remaining |
|-----|----------------|-----------------|-------------|
| Availability | 0 min | 432 min | 100% |
| Core flow success | 0 min | 864 min | 100% |

---

## Error Budget Policy

| Budget remaining | Action |
|-----------------|--------|
| More than 50% | Normal operations. Feature development continues. |
| 10% to 50% | Amber alert. Reliability items added to next sprint. No risky deployments without rollback plan. |
| Less than 10% | Red alert. Feature freeze. Engineering effort pivots to reliability. On-call review mandatory before any production push. |
| 0% or negative | Hard freeze. No deployments. Incident review required. SLO target may need revision. |

**Who owns the budget freeze decision:** Besik Meskhia (Program Lead)

---

## Planned Maintenance

Planned maintenance consumes error budget just like unplanned incidents. Log it here.

| Maintenance activity | Date | Duration | SLOs affected | Budget consumed |
|--------------------|------|----------|--------------|----------------|
| (None planned for this window) | | | | |

---

## Next Window

**Next window:** 22 June 2026 to 21 July 2026
**Budget resets:** 22 June 2026

Budget does not roll over. A full budget on the first of the month does not compensate for an exhausted budget last month. Each window is evaluated independently.

---

*Error Budget | Bandersnatch | CS-PD-2026 | Spring 2026*
