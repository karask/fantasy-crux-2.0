---
type: rule
id: combat.critical-hits-and-fumbles
chapter: combat
title: Critical Hits and Fumbles
slug: critical-hits-and-fumbles
order: 70
summary: A critical attack beats an ordinary Reaction; only a critical Reaction stops it completely. A fumble brings one fitting setback.
aliases:
  - critical matrix
  - combat results
  - fumble
---

An attack is **critical** when it succeeds with a `D100` roll at or under the tens digit of your skill. Skill 59 is critical on 01–05 and skill 100 on 01–10; any skill above 0% is critical on at least 01. See [exact critical ranges](/rules/skills/#basic-tests--skills-critical-ranges).

A roll of 99 or 00 is a **fumble** if your skill is below 100%; at 100%, only 00 fumbles. A fumble overrides success.

[Deadly Precision](/rules/talents/#deadly-precision) doubles your normal critical range for one declared, eligible damaging attack each round. Use that wider range when grading Bonus or Penalty dice candidates; the result still uses the matrix below.

## Combat Result Matrix

Compare the original attack and defence as an [opposed test](/rules/skills/#opposed-tests). The one special case is an ordinary defence against a critical attack, which demotes the hit.

### Against an ordinary hit {#against-an-ordinary-hit}

| Defence                                  | Result                                            |
| ---------------------------------------- | ------------------------------------------------- |
| None, failed, or losing ordinary defence | Normal damage with eligible bonuses, then armour. |
| Winning ordinary Dodge                   | No damage.                                        |
| Winning ordinary Parry                   | Reduce damage by Size, then armour.               |
| Critical Dodge or Parry                  | No damage. A critical Parry ignores Size.         |

### Against a critical hit {#against-a-critical-hit}

| Defence                                  | Result                                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| None, failed, or losing critical defence | Maximum weapon damage, plus maximum positive DM when it applies. Ignore armour and other damage bonuses.                |
| Ordinary successful Dodge or Parry       | Demoted to an ordinary hit: normal damage with eligible bonuses, then armour. The defence neither stops nor reduces it. |
| Winning critical Dodge or Parry          | No damage. A critical Parry ignores Size.                                                                               |

## Critical damage {#critical-damage}

A hit that stays critical:

- deals maximum weapon damage, plus the maximum of a positive Damage Modifier when DM normally applies;
- ignores armour;
- gains no extra damage dice or fixed damage bonuses from Actions or Talents; and
- ignores a negative Damage Modifier.

A critical demoted to an ordinary hit uses all the normal damage rules instead, including eligible bonuses and a positive or negative Damage Modifier. The demotion only decides the damage: do not resolve the Reaction again, and grant no extra attack or manoeuvre.

A critical hit grants no free manoeuvre, attack, or Talent. If a Talent declared before the roll replaces damage with another effect, follow the Talent; the critical adds nothing.

## Fumbles {#fumbles}

On a fumble, the Gamemaster applies one immediate consequence that fits the risk, such as falling prone, dropping or damaging equipment, being exposed, or endangering someone nearby. Avoid consequences that decide a whole fight regardless of the situation. [Firing into a crowd](/rules/combat/#ranged-combat--firing-into-a-crowd) has its own fumble rule.
