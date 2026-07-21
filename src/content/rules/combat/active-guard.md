---
type: rule
id: combat.active-guard
chapter: combat
title: Active Guard
slug: active-guard
order: 30
summary: An aware character can actively Parry thrown weapons with a ready item and arrows, bolts, or sling projectiles with a ready shield.
aliases:
  - missile Parry
  - shield against arrows
  - active shield defence
quickReference:
  group: combat
  order: 30
---

## Using Active Guard

Active Guard is a Reaction declared after a ranged attack hits but before damage is resolved. The defender must be aware of the attack and have the parrying item ready.

| Incoming attack                    | Eligible Parry    | Modifier |
| ---------------------------------- | ----------------- | -------: |
| Thrown weapon                      | Ready weapon      |    `-1P` |
| Thrown weapon                      | Ready shield      |     None |
| Bow, crossbow, or sling projectile | Ready shield only |    `-1P` |

Roll Close Combat and use the normal [critical matrix](/rules/combat/critical-hits-and-fumbles/) and [Parry Size rules](/rules/combat/attacks-and-reactions/). A thrown weapon keeps its listed Size; arrows, bolts, and sling projectiles are Light. Small, medium, and large shields are Medium, Heavy, and Huge respectively.

Therefore, an ordinary successful shield Parry blocks all damage from a bow, crossbow, or sling projectile. Against a thrown weapon, compare the shield with that weapon's listed Size as normal.

A shield grants no passive cover or attack penalty by default. Terrain cover applies separately. The [Shield Cover](/rules/talents/shield-cover/) Talent creates a passive penalty, and the [Missile Guard](/rules/talents/missile-guard/) Talent removes Active Guard's `-1P` against bows, crossbows, and slings.

A strapped shield that is unavailable while wielding a two-handed item is not ready and cannot provide Active Guard.
