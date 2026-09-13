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

After a successful attack roll, an aware defender may spend an eligible Reaction before damage is resolved. Oppose Dodge or Parry against that original attack roll; never reroll the attack for defence. Each side resolves its own Bonus and Penalty dice before comparing grades, then rolls within the same successful grade. Use the normal [opposed-test tiebreakers](/rules/skills/#opposed-tests): higher roll, then higher unmodified base skill, then defender. A failed defence never stops a successful attack.

**Exception:** an ordinary successful Dodge or Parry against a critical attack demotes it to an ordinary hit, even though the attack wins by grade. Roll normal damage with eligible bonuses, then armour; the Reaction neither avoids nor reduces the hit. If both rolls are critical, compare them normally: a winning critical defence blocks everything, while a winning critical attack retains its critical damage. See the [combat result matrix](/rules/combat/#critical-hits-and-fumbles).

Only one Reaction may answer a single attack or trigger, even when a character has more than one available. A missed attack needs no defence and spends no defender Reaction.

[Grappling](/rules/combat/#grappling) uses its own opposed procedure without weapon-critical demotion. Dodge or Parry against the initial seizure still spends one eligible Reaction and follows the normal Dodge limit; the defence roll is part of the contest, not a second defence roll afterward. Shaping also retains its own opposed-defence rules without weapon-critical demotion.

## Reactions

- **Dodge:** oppose Dodge against the attack. A winning Dodge avoids the hit. Ranged attacks impose `-1P`. A character may Dodge no more than once per round, and only with their base Reaction.
- **Parry:** oppose Close Combat with a ready weapon or shield, or Unarmed Combat against an unarmed attack. A winning ordinary Parry reduces damage according to item Size; a winning critical Parry blocks everything. Ranged attacks require [Active Guard](/rules/combat/#active-guard).
- **Opportunity Attack:** make one Close Combat attack when an adjacent enemy disengages or creates another clear opening. It does not trigger an extra off-hand attack.

## Parry Size

After a winning Parry, compare the attacking weapon with the ready item used to Parry. A losing Parry grants no Size reduction, including when it demotes a critical. Unarmed attacks and projectiles from bows, crossbows, and slings are Light. Natural weapons use their listed Size, or Medium when none is listed. Thrown weapons retain their listed Size.

| Parrying item             | Effect on an ordinary hit             |
| ------------------------- | ------------------------------------- |
| Same Size or larger       | Block all damage.                     |
| One Size smaller          | Block half the total damage.          |
| Two or more Sizes smaller | Reduce no damage.                     |
| Winning critical Parry    | Block all damage, regardless of Size. |

Apply armour only after a Parry has changed the damage.

Special techniques are not available by default. A character must buy the relevant [Talent](/rules/talents/) to disarm, trip, subdue, rush with a shield, or trade defence for extra attacks.
