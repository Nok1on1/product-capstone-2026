# Checkpoint 4 Rubric Audit

**Audit date:** June 13, 2026
**Rubric source:** `Lab-12/GRADING-RUBRIC.md`  
**Product:** Bandersnatch, Bus #3 Real-Time Tracker

---

## Part A: Live Pitch and Q&A

| Criterion | Target | Current readiness | Risk |
|-----------|--------|-------------------|------|
| A1 Problem clarity | ICP, one-sentence problem, quantified pain, real quote | Ready. Pitch deck cites KIU Bus #3 commuters, 5-12 hours lost, 12 interviews, and P06 quote. | Low |
| A2 Product demonstrated live | Live product on real device, core flow end-to-end, URL stated | Ready for rehearsal. Live URL is documented. Day-of app check still required. | Medium |
| A3 Traction and business model | Real usage numbers, engagement/retention, CAC and LTV | Mostly ready. Uses Firebase active users plus observed rapid-test engagement; CAC/LTV sourced from unit economics. | Medium because signup analytics undercount needs clear explanation |
| A4 Competitive moat | 5+ competitors, 7+ dimensions, Helmer power, 2 repo evidence points | Ready. Deck includes 6 competitors, 7 dimensions, Switching Costs, and repository evidence. | Low |
| A5 Q&A fluency | Direct answers, numbers owned, honest caveats | Prep material added in `07-operations/demo-day-checklist.md`. | Medium until rehearsed |

## Part B: Repository Review

| Criterion | Target | Current readiness | Risk |
|-----------|--------|-------------------|------|
| B1 Folder completeness | `00-foundation` through `09-final` present and non-empty | Ready after adding rubric-required `07-team` contribution logs plus supplemental `07-operations` prep. | Low |
| B2 README/documentation quality | Product name, tagline, problem, live URL, demo video link, team, stack, setup, license | Ready. README includes final demo video link, live product URL, setup, architecture links, team, stack, and MIT license declaration. | Low |
| B3 Investor materials | `05-fundraising/pitch-deck.pdf` and `05-fundraising/one-pager.pdf` valid PDFs | Ready after PDF generation. | Low |

## Automatic Deduction Watchlist

| Issue | Current status | Action |
|-------|----------------|--------|
| Repository private | Unknown from local checkout | Confirm public visibility on GitHub before Demo Day |
| Live URL returns 404/error | Not browser-tested per repo instruction; production build passes locally | Day-of manual team check only |
| `pitch-deck.pdf` missing | Resolved | Confirm file exists |
| No open-source license | Resolved by root `LICENSE` | Confirm file exists |
| README has no live product URL | Resolved by README update | Confirm link present |

## Remaining Human-Owned Items

1. Confirm repository is public from GitHub web UI.
2. Create and push the `cp4-submission` tag before Sunday June 14, 2026 at 23:59.
3. Rehearse the analytics caveat so it sounds honest and controlled.
