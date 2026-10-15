---
type: rule
id: combat.attacks-and-reactions
chapter: combat
title: Attacks and Reactions
slug: attacks-and-reactions
order: 20
summary: Roll your combat skill to hit. If you are hit and aware of it, you can spend a Reaction to Dodge or Parry.
aliases:
  - attack roll
  - Dodge
  - Parry
  - Opportunity Attack
  - which defence works
  - does armour stop magic
---

## Attacking {#attacking}

Roll `D100` against **Close Combat** for a held weapon, **Unarmed Combat** for an unarmed or natural attack, or **Ranged Combat** for a weapon used at a distance. Roll at or under the skill to hit. Bonus and Penalty dice change the roll, not the skill.

## Defending {#defending}

When an attack hits you and you are aware of it, you can spend a Reaction to defend before damage is resolved. Only one Reaction can answer one attack or trigger, even if you have more. A missed attack needs no defence and costs no Reaction.

### Which defence works? {#which-defence-works}

| Incoming attack                                       | Dodge      | Parry with a weapon           | Parry with a shield           | Armour (AP)                  |
| ----------------------------------------------------- | ---------- | ----------------------------- | ----------------------------- | ---------------------------- |
| Close weapon or unarmed attack                        | Yes        | Yes                           | Yes                           | Yes                          |
| Thrown weapon, such as a dagger or javelin            | Yes, `-1P` | Yes, `-1P`, with Active Guard | Yes, with Active Guard        | Yes                          |
| Arrow, crossbow bolt, or sling stone                  | Yes, `-1P` | No                            | Yes, `-1P`, with Active Guard | Yes                          |
| Projected Shaping at one target, such as a firebolt   | Yes, `-1P` | No                            | Yes, `-1P`, with Active Guard | Yes                          |
| Projected Shaping over an area, such as a frost burst | Yes, `-1P` | No                            | No                            | Yes                          |
| Direct Shaping, such as searing heat                  | No         | No                            | No                            | No: only magical Wards count |

{.verdicts}

- Against **Direct Shapings**, roll Resilience or Persistence instead. This costs no Reaction. See [Harm delivery](/rules/magic/#casting-and-defence--magic-harm-delivery).
- Weapon **critical hits** ignore armour; critical Shapings do not.
- **Talents** change some answers: [Missile Guard](/rules/talents/#missile-guard) removes the shield `-1P`, [Shield Cover](/rules/talents/#shield-cover) gives ranged attacks against you `-1P`, and [Counter](/rules/talents/#counter) can stop a Shaping.

## Reactions

- **Dodge:** roll Dodge. If you win, the attack misses. Ranged attacks give you `-1P`. You can Dodge once per round, and only with your base Reaction.
- **Parry:** roll Close Combat with a ready weapon or shield, or Unarmed Combat against an unarmed attack. A winning ordinary Parry reduces damage by [Parry Size](#parry-size); a winning critical Parry blocks it all. Parrying a ranged attack needs [Active Guard](/rules/combat/#active-guard).
- **Opportunity Attack:** make one Close Combat attack when an adjacent enemy disengages or gives you another clear opening. It never gives an extra off-hand attack.

## Rolling the defence {#rolling-the-defence}

Your defence is an [opposed test](/rules/skills/#opposed-tests) against the original attack roll; the attacker never rolls again.

1. Each side applies its own Bonus and Penalty dice.
2. Compare grades: Critical beats Success.
3. With the same successful grade, the higher roll wins.
4. On equal rolls, the higher unmodified base skill wins, then the defender.

A failed defence never stops a successful attack.

**Exception: critical attacks.** An ordinary successful Dodge or Parry turns a critical attack into an ordinary hit, even though the attack wins by grade. Roll normal damage with its usual bonuses, then subtract armour; your Reaction does not avoid or reduce it. If both rolls are critical, compare them normally: a winning critical defence blocks everything, and a winning critical attack keeps its critical damage. See the [combat result matrix](/rules/combat/#critical-hits-and-fumbles).

[Grappling](/rules/combat/#grappling) and [Shaping](/rules/magic/#casting-and-defence--magic-defence) use plain opposed tests, without this exception. A Dodge or Parry against a grapple's initial seizure still spends one eligible Reaction and counts toward the normal Dodge limit. That roll is part of the grapple test, not a second roll.

## Parry Size

After a winning Parry, compare the attacking weapon's Size with your parrying item's.

| Your parrying item is…                  | Damage blocked |
| --------------------------------------- | -------------- |
| The same Size or larger than the attack | All            |
| One Size smaller                        | Half           |
| Two or more Sizes smaller               | None           |
| Any Size, when your critical Parry wins | All            |

{.verdicts}

Sizes run **Light → Medium → Heavy → Huge**. Unarmed attacks and bow, crossbow, and sling projectiles are Light. Natural weapons use their listed Size, or Medium if none is listed. Thrown weapons keep their listed Size.

A losing Parry blocks nothing, even when it demotes a critical. Subtract armour after the Parry.

## Special techniques {#special-techniques}

Disarming, tripping, subduing, shield rushing, and trading defence for extra attacks each need a [Talent](/rules/talents/).
