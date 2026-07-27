---
type: rule
id: combat.attacks-and-reactions
chapter: combat
title: Attacks and Reactions
slug: attacks-and-reactions
order: 20
summary: Roll the relevant combat skill to hit; an aware defender may spend a Reaction to Dodge, Parry, or make an Opportunity Attack.
aliases:
  - attack roll
  - Dodge
  - Parry
  - Opportunity Attack
---

Roll `D100` against **Close Combat** for a held weapon, **Unarmed Combat** for an unarmed or natural attack, or **Ranged Combat** for a weapon used at distance. A roll at or below the relevant skill hits; a higher roll misses. Bonus and Penalty dice alter the roll, not the skill.

After a hit, an aware defender may spend an eligible Reaction before damage is resolved. A failed Reaction changes nothing. Only one Reaction may answer a single attack or trigger, even when a character has more than one available. Compare critical results using the [combat result matrix](/rules/combat/#critical-hits-and-fumbles).

## Reactions

- **Dodge:** roll Dodge. An ordinary success avoids an ordinary hit. Ranged attacks impose `-1P`. A character may Dodge no more than once per round, and only with their base Reaction.
- **Parry:** roll Close Combat with a ready weapon or shield, or Unarmed Combat against an unarmed attack. A successful Parry reduces an ordinary hit according to item Size. Ranged attacks require [Active Guard](/rules/combat/#active-guard).
- **Opportunity Attack:** make one Close Combat attack when an adjacent enemy disengages or creates another clear opening. It does not trigger an extra off-hand attack.

## Parry Size

Compare the attacking weapon with the ready item used to Parry. Unarmed attacks and projectiles from bows, crossbows, and slings are Light. Natural weapons use their listed Size, or Medium when none is listed. Thrown weapons retain their listed Size.

| Parrying item             | Effect on an ordinary hit                                    |
| ------------------------- | ------------------------------------------------------------ |
| Same Size or larger       | Block all damage.                                            |
| One Size smaller          | Block half the total damage, rounding the amount blocked up. |
| Two or more Sizes smaller | Reduce no damage.                                            |
| Critical Parry            | Block all damage, regardless of Size.                        |

Apply armour only after a Parry has changed the damage.

Special techniques are not available by default. A character must buy the relevant [Talent](/rules/talents/) to disarm, trip, subdue, rush with a shield, or trade defence for extra attacks.
