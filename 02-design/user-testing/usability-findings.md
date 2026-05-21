# Usability Findings

**Team:** Bandersnatch
**Product:** Bus #3 Real-Time Tracker
**Date:** May 2026
**Version:** 1.0

---

## Prototype Tested

**Tool:** Google Stitch
**Link:** https://stitch.withgoogle.com/projects/2218021865639894004
**Covers:** Home screen → bus stop selection → status display → departure decision
**Fidelity:** High-fidelity, mobile-first, navigable without explanation

---

## Participants

| Code | Recruitment | Device | Session format |
|------|-------------|--------|----------------|
| P01 | KIU student, Bus #3 commuter | Mobile (Android) | In-person walkthrough |
| P02 | KIU student, Bus #3 commuter | Mobile (iOS) | In-person walkthrough |
| P03 | KIU student, Bus #3 commuter | Mobile (Android) | In-person walkthrough |
| P04 | KIU student, Bus #3 commuter | Mobile (Android) | In-person walkthrough |
| P05 | KIU student, Bus #3 commuter | Mobile (iOS) | In-person walkthrough |

All five participants are KIU students who commute via Bus #3 regularly. None are team members.

---

## Session Structure

Each session followed the same structure:

1. Participant opens the prototype link on their own phone in incognito mode
2. Facilitator says: "Try to find out when your bus is arriving and decide when to leave. Think out loud."
3. No further guidance given until the task is complete or the participant is stuck for more than 60 seconds
4. Post-task questions:
   - "What did you expect to see when you tapped Check Status?"
   - "Did you understand the difference between CONFIRMED and ESTIMATED?"
   - "Was there anything confusing or missing?"
   - "Would you use this instead of the existing tracker?"

---

## Findings by Participant

### P01 — Nini M.

**Task completion:** Completed without assistance

**Observations:**
- Completed the core flow in under 45 seconds on first attempt
- Paused on the status screen and read the CONFIRMED badge aloud — "so this means it's actually confirmed, not just a guess?"
- Asked immediately after seeing the status: "where does it show how crowded the bus is going to be?"
- Did not notice the crowding indicator on first pass — only spotted it after scrolling slightly
- Post-task: "I like that it says CONFIRMED. The existing one always says the bus is coming and it never does. But I want to see my stop on a map, not just a name."
- Suggested the profile tab should show something — "right now it feels empty, I don't know what my account is even for"

**Key finding:** Crowding indicator placement was below the fold on her device. Profile tab felt purposeless without visible data.

---

### P02 — Giorgi Z.

**Task completion:** Completed without assistance

**Observations:**
- Went directly to the stop selector without reading the home screen text
- Selected his stop confidently, tapped Check Status immediately
- On the status screen, pointed at the ESTIMATED badge (shown for a second stop he tested) and said: "what's the difference between this yellow one and the green one? Is yellow bad?"
- Did not read the badge label text — only registered the colour
- Tried to tap the map area that was shown as a static image — expected it to be interactive
- Post-task: "The map doesn't move. I want to see where the bus actually is, not just a picture of a map."
- Also noted the bus route shown on the static map did not match the actual Bus #3 route he knows from daily use — "this road doesn't go there, the bus goes the other way around near the university"

**Key finding:** Badge distinction relies too heavily on colour alone — label text not being read. Static map created strong expectation of interactivity. Bus route drawn incorrectly (shortest path algorithm, not real road route).

---

### P03 — Levani K.

**Task completion:** Completed with one hesitation

**Observations:**
- Hesitated on the stop selector — "does this show all the stops or just the main ones? I get on near the back entrance not the main gate"
- Eventually selected KIU Main Gate as closest option and continued
- On the status screen, immediately understood CONFIRMED vs ESTIMATED after reading the labels
- Noticed the crowding indicator and said "low crowding, good" — engaged with it without prompting
- Tried to swipe between screens — expected swipe navigation rather than tap
- Post-task: "It's much cleaner than what we have now. But I want to know how you know it's confirmed. Like, is someone reporting it or is it from a GPS?"
- Asked whether there was a way to see his past rides — "I'd want to know how many times I've used it"

**Key finding:** Stop list coverage felt incomplete to a user who boards at a non-primary stop. Users want transparency about the data source behind the CONFIRMED badge. Ride history and usage data were expected features.

---

### P04 — Nino A.

**Task completion:** Completed without assistance

**Observations:**
- First thing she said after opening the app: "oh it's in English, is there a Georgian version?"
- Completed the core flow quickly but kept switching back to the home screen
- On the profile tab: "there's nothing here. I want to see my points or something — like is there a score for reporting?"
- When shown the CONFIRMED badge: "I trust this more than the other app already just because it says confirmed clearly"
- Pointed out that the bus icon on the map was very small and hard to see outdoors — held phone up toward the window to simulate outdoor light
- Post-task: "The bus on the map was moving way too fast. I couldn't tell which direction it was going. It just jumped around."
- Specifically requested: "show me my trust score on the profile page, I want to know if my reports are doing anything"

**Key finding:** Bus marker too small for outdoor visibility. Animated bus movement speed was unrealistically fast and disorienting. Profile tab needed to surface trust score and report count to feel meaningful. Georgian language support expected.

---

### P05 — Nino Am.

**Task completion:** Completed without assistance

**Observations:**
- Navigated the flow smoothly and without hesitation
- On the status screen: "the arrival time is clear. I like that it tells me to leave in X minutes, that's what I actually need to know"
- Tapped the map area and said "can I move this?" — expected pan and zoom
- Noticed the bus icon on the map and tried to tap it — expected a popup with bus details
- Post-task: "the map feels fake because you can't interact with it. If it's going to show a map it should work like a real map"
- Suggested the icons on the map needed to be larger and more distinct — "the bus and the stop look similar in size, I couldn't tell which was which at first"
- Did not find the crowding indicator until prompted — "I missed that completely"

**Key finding:** Map interactivity was the strongest expectation across all participants. Bus and stop marker icons needed to be visually distinct in size and style. Crowding indicator discoverability was consistently low.

---

## Summary of Findings

| Finding | Participants | Severity |
|---------|-------------|----------|
| Bus route drawn via shortest path, does not match real Bus #3 road route | P02 | Critical |
| Map is static — all participants expected pan, zoom, and tap interaction | P02, P03, P04, P05 | High |
| Bus animation speed was unrealistically fast and disorienting | P04 | High |
| Profile tab felt empty — users expected trust score and report count | P01, P03, P04 | High |
| Bus and stop marker icons too small for outdoor visibility | P04, P05 | Medium |
| Crowding indicator below fold or missed entirely | P01, P05 | Medium |
| CONFIRMED/ESTIMATED distinction relies on colour — label text not read | P02 | Medium |
| Georgian language expected | P04 | Medium |
| Stop list felt incomplete for non-primary boarding points | P03 | Low |

---

## Design Changes Made in Response to Testing

### Change 1 — Bus Route Corrected to Real Road Path

**Finding that motivated it:** P02 identified during testing that the bus route displayed on the map followed a shortest-distance path between stops rather than the actual road route Bus #3 takes. "This road doesn't go there, the bus goes the other way around near the university."

**Before:** Route polyline generated automatically using shortest-path algorithm between stop coordinates. Did not follow actual Bus #3 road path through the university area.

**After:** Route redrawn manually by tracing the actual Bus #3 road route. Stop coordinates updated to match real boarding locations. OSRM routing replaced with hand-verified GeoJSON polyline for the KIU campus segment where the algorithm produced an incorrect path.

---

### Change 2 — Profile Tab Now Shows Trust Score and Reports Made

**Finding that motivated it:** P01 said "the profile tab feels empty, I don't know what my account is even for." P04 said "I want to see my points or something — show me my trust score on the profile page, I want to know if my reports are doing anything." P03 asked whether there was a way to see past usage data.

**Before:** Profile tab showed only display name, email, and default stop selector. No gamification data visible. Users had no feedback that their reporting activity had any effect.

**After:** Profile tab now displays trust score as a visual gauge (0–100), current badge tier (Beginner / Contributor / Reliable / Expert), total reports made count, and a link to ride history. These are derived client-side from the `users/{uid}` Firestore document fields `trustScore` and `totalReportsMade`.

---

### Change 3 — Map Made Interactive with Improved Marker Visibility

**Finding that motivated it:** P02, P04, and P05 all attempted to pan or tap the map during testing. P05 said "the map feels fake because you can't interact with it." P04 and P05 noted bus and stop markers were hard to distinguish outdoors.

**Before:** Map rendered as a static image in the Stitch prototype. Bus and stop markers were similar in size. Bus icon was small and low contrast.

**After:** Map replaced with a fully interactive Leaflet implementation supporting pan, zoom, and tap. Bus marker enlarged and changed to a distinct animated icon with a directional heading arrow. Stop markers use a different shape and colour from the bus marker. Marker sizes increased for outdoor readability. Tapping a bus marker shows a popup with direction and estimated next stop.

---

### Change 4 — Bus Animation Speed Corrected to Reflect Real Movement

**Finding that motivated it:** P04 said "the bus on the map was moving way too fast. I couldn't tell which direction it was going. It just jumped around."

**Before:** Simulated bus position updated on each animation frame without smoothing, causing the marker to jump between coordinates at an unrealistic speed.

**After:** Bus position animation uses linear interpolation (lerp) between coordinate updates via `requestAnimationFrame`. Movement speed capped to reflect realistic bus travel between stops (approximately 7 minutes per stop segment). Direction of travel shown via heading arrow on the marker.

---

## Prototype Reflects Design Changes

The live deployed app at the Vercel production URL reflects all four changes above. The Stitch prototype link covers the original four-screen flow; the production app is the updated version that incorporates all findings.

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| May 2026 | 1.0 | Initial usability findings document | Team Bandersnatch |

---

*Usability Findings | Bandersnatch | CS-PD-2026 | Spring 2026*