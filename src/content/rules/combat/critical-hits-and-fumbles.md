---
type: rule
id: combat.critical-hits-and-fumbles
chapter: combat
title: Critical Hits and Fumbles
slug: critical-hits-and-fumbles
order: 70
summary: Critical attacks overpower ordinary Reactions, while only a critical Reaction stops them completely.
aliases:
  - critical matrix
  - combat results
  - fumble
---

An attack is critical when it succeeds and its `D100` result is at or below the skill's integer tens digit: skill 59 has a critical range of 01–05, while skill 100 has 01–10. Below skill 100, rolls of 99 or 00 fumble; at skill 100, only 00 fumbles. A fumble overrides success.

## Combat Result Matrix

| Attack           | Reaction                 | Result                                                                             |
| ---------------- | ------------------------ | ---------------------------------------------------------------------------------- |
| Ordinary success | None, failure, or fumble | Roll damage, then apply armour.                                                    |
| Ordinary success | Ordinary Dodge           | No damage.                                                                         |
| Ordinary success | Ordinary Parry           | Reduce damage by Size, then apply armour.                                          |
| Ordinary success | Critical Dodge or Parry  | No damage.                                                                         |
| Critical         | None, failure, or fumble | Maximum weapon damage plus maximum positive DM when normally added; ignore armour. |
| Critical         | Ordinary Dodge or Parry  | Roll damage and apply armour; the Reaction neither stops nor reduces the hit.      |
| Critical         | Critical Dodge or Parry  | No damage; a critical Parry ignores Size.                                          |

A critical hit grants no free manoeuvre, attack, or Talent. If a Talent was declared before the roll and replaces damage with another effect, follow that Talent; the critical adds no further effect.

For the unopposed Critical result above, ignore negative Damage Modifier. That result replaces normal damage, so do not add other bonus dice or fixed damage from an action or Talent.

On a fumble, the Gamemaster applies one immediate consequence suited to the risk: fall prone, drop or damage equipment, expose the character, or endanger someone nearby. Avoid consequences that decide an entire fight without regard to the situation. Firing into a crowd has its own concise fumble rule.
