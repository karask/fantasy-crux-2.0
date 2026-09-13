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

An attack is critical when it succeeds and its `D100` result is at or below the skill's integer tens digit, minimum 01 for any skill above 0%: skill 59 has a critical range of 01–05, while skill 100 has 01–10. Below skill 100, rolls of 99 or 00 fumble; at skill 100, only 00 fumbles. A fumble overrides success.

[Deadly Precision](/rules/talents/#deadly-precision) doubles the normal critical range for one declared, eligible damaging attack per round. Apply that expanded range when grading Bonus or Penalty dice candidates; the result still uses the matrix below.

## Combat Result Matrix

Compare the original attack and defence using opposed-test grades and tiebreakers. The ordinary defence against a critical is the explicit demotion exception.

| Attack           | Defence                                  | Result                                                                                                                       |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Ordinary success | None, failed, or losing ordinary defence | Roll normal damage with eligible bonuses, then armour.                                                                       |
| Ordinary success | Winning ordinary Dodge                   | No damage.                                                                                                                   |
| Ordinary success | Winning ordinary Parry                   | Reduce damage by Size, then armour.                                                                                          |
| Ordinary success | Critical Dodge or Parry                  | No damage; Parry ignores Size.                                                                                               |
| Critical         | None, failed, or losing critical defence | Maximum weapon damage plus maximum positive DM when applicable; ignore armour and other damage bonuses.                      |
| Critical         | Ordinary successful Dodge or Parry       | Demote to an ordinary hit. Roll normal damage with eligible bonuses, then armour. Defence neither stops nor reduces the hit. |
| Critical         | Winning critical Dodge or Parry          | No damage; Parry ignores Size.                                                                                               |

A critical hit grants no free manoeuvre, attack, or Talent. If a Talent was declared before the roll and replaces damage with another effect, follow that Talent; the critical adds no further effect.

A hit that remains critical deals maximum weapon damage plus maximum positive Damage Modifier when normally added, ignores armour, and gains no additional damage dice or fixed damage bonuses from Actions or Talents. Ignore negative Damage Modifier.

A critical demoted to an ordinary hit instead uses all normal damage rules, including eligible bonuses and positive or negative Damage Modifier. This demotion determines damage; do not resolve the Reaction a second time or grant an additional attack or manoeuvre.

On a fumble, the Gamemaster applies one immediate consequence suited to the risk: fall prone, drop or damage equipment, expose the character, or endanger someone nearby. Avoid consequences that decide an entire fight without regard to the situation. Firing into a crowd has its own concise fumble rule.
