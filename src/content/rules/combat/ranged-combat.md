---
type: rule
id: combat.ranged-combat
chapter: combat
title: Ranged Combat
slug: ranged-combat
order: 40
summary: Ranged attacks use simple range bands, terrain cover, active defence, and weapon-specific reload rules.
aliases:
  - missile combat
  - range bands
  - cover
  - crossbow reload
quickReference:
  group: combat
  order: 40
---

Make a Ranged Combat test against a target within the weapon's listed Range. Beyond Range but no farther than twice Range, attack at `-2P`. A farther target cannot be hit.

Thrown attacks add Damage Modifier. Bows, crossbows, and slings use only their listed damage unless a Talent says otherwise. A ranged weapon with the **Close** tag can instead attack within 2 metres using Close Combat. Any other ranged weapon used there becomes an improvised Light club (`1D6 + DM`) and attacks at `-1P`.

An aware target may Dodge at `-1P`. Thrown attacks and physical projectiles may also be eligible for [Active Guard](/rules/combat/active-guard/).

## Aim

Spend a Combat Action to aim at one visible target. The next ranged attack against that target gains `+1B`. The benefit is lost if the character takes any Reaction, loses sight of the target, or does not make that attack with their next Combat Action.

## Cover

Cover penalises the attack; it does not reduce damage.

| Cover                                       |         Modifier |
| ------------------------------------------- | ---------------: |
| Partial, such as a low wall                 |            `-1P` |
| Substantial, such as battlements            |            `-2P` |
| Complete: no attack line reaches the target | Attack prevented |

Use only the best penalty from terrain and the [Shield Cover](/rules/talents/shield-cover/) Talent; they do not stack with each other.

## Common Situational Modifiers

| Situation                                                 |        Modifier |
| --------------------------------------------------------- | --------------: |
| Target moved at least 10 m since the attacker's last turn |           `-1P` |
| Target moved at least 30 m since the attacker's last turn |   `-2P` instead |
| Target partly obscured by mist, smoke, or dim light       |           `-1P` |
| Target heavily obscured by fog, smoke, or darkness        |   `-2P` instead |
| Target is prone                                           |           `-1P` |
| Target is helpless                                        |           `+2B` |
| High wind                                                 |           `-1P` |
| Fierce wind                                               |           `-3P` |
| Hurricane                                                 |    Attack fails |
| Attacker is prone                                         |           `-2P` |
| Attacker is on unstable ground                            |           `-1P` |
| Attacker is engaged at Close range                        | `-2P` per enemy |

Use only the strongest version of the same condition, such as movement, obscurity, or wind. Modifiers from different causes combine under the normal `+3B`/`-3P` cap.

## Crossbows

- **Light crossbow:** reloading spends the Movement Action and base Reaction.
- **Heavy crossbow:** reloading consumes the whole round: Combat Action, Movement Action, and all Reactions.

A generic Ready action never shortens either reload.

## Firing Into a Crowd

Apply any cover normally. An ordinary failure simply misses; only a fumble may hit a fairly or randomly selected nearby target, dealing normal rolled damage after armour.
