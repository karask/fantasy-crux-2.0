---
type: rule
id: adventuring-fatigue-survival
chapter: adventuring
title: Fatigue and Deprivation
slug: fatigue-and-survival
order: 30
summary: 'Fatigued applies -1P, three-quarter Movement, and -3 Combat Order; Exhausted applies -2P, half Movement, and -6 Combat Order.'
aliases:
  - exhaustion
  - exposure
  - starvation
  - thirst
---

After strenuous activity such as a long fight, sprint, hard climb, or strong-current swim, the GM may call for a **Fatigue test**: a Resilience test. Test after the activity unless exhaustion could prevent its completion.

| State     | Skill tests |       Movement | Combat Order |
| --------- | ----------: | -------------: | -----------: |
| Fatigued  |       `-1P` | Three-quarters |           -3 |
| Exhausted |       `-2P` |           Half |           -6 |

- A failed Fatigue test makes a fresh character Fatigued.
- Strenuous activity while Fatigued calls for another Fatigue test at `-1P`; failure makes the character Exhausted.
- A fumbled Fatigue test causes unconsciousness for `3D6` minutes. The character awakens Fatigued.
- `max(1, 20 − CON)` hours of complete rest removes Fatigued or Exhausted.

Fractions of Movement are rounded down, to a minimum of 1 metre.

## Exposure, starvation, and thirst {#adventuring-deprivation}

| Deprivation                       |                                                               Grace period |
| --------------------------------- | -------------------------------------------------------------------------: |
| Exposure without adequate shelter |                                                                  CON hours |
| Starvation                        |                                                                   CON days |
| Thirst                            | CON × 2 hours; CON hours in arid conditions; CON ÷ 2 hours in extreme heat |

After three days without food, Fatigue tests suffer `-1P` even if the starvation grace period has not ended.

Once a grace period ends, make one Fatigue test at `-1P` for that deprivation each day. The character also takes `1D6` damage per day **for each** active deprivation. This damage cannot recover naturally until adequate shelter, food, or water remedies its cause.
