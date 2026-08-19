---
type: rule
id: combat.rounds-and-actions
chapter: combat
title: Rounds and Actions
slug: rounds-and-actions
order: 10
summary: Each five-second round grants one Combat Action, one Movement Action, and one base Reaction.
aliases:
  - action economy
  - Combat Round
  - Combat Order
  - Withdraw
  - Set Weapon
  - Intimidate
  - surrender
---

**Close** means within 2 metres. Anything farther away is **Ranged**.

At the start of combat, every participant rolls `1D10 + Combat Order`. Act from highest total to lowest; a tied character with higher DEX acts first. If DEX also ties, reroll `1D10` between them.

Each five-second round grants:

- **one Combat Action**, usually an attack or skill use;
- **one Movement Action**; and
- **one base Reaction**, used when its trigger occurs.

Combat and Movement Actions happen in Combat Order. A Reaction interrupts that order only long enough to resolve its trigger. Unspent actions do not carry into the next round.

A character cannot choose an option that forfeits or restricts an Action or Reaction they have already used in a way incompatible with that option.

## Common Combat Actions

- Make one standard Close Combat, Unarmed Combat, or Ranged Combat attack.
- Start or escape a grapple.
- Aim a ranged weapon.
- Set a weapon against a Charge.
- Use a skill or object that can reasonably be handled in about five seconds.
- Cast or maintain [Shaping](/rules/magic/#casting-and-defence) when its rule requires a Combat Action.
- Intimidate an enemy or a whole group into surrendering or fleeing.
- Delay: act after a chosen participant later in the round. To interrupt an action already beginning, make an opposed test using the relevant skills; the winner acts first.

## Common Movement Actions

- Move up to Movement in metres.
- Stand up or drop prone.
- Disengage and move away. An enemy who can reach you may spend a Reaction on an Opportunity Attack.
- Ready one item or nock an arrow while moving no more than half Movement. Stowing one item and drawing another, or readying two items, consumes the whole Movement Action.

Reloading crossbows uses its own rule and is never shortened by a generic Ready action.

## Withdraw

Spend the Combat and Movement Actions to move up to normal Movement without triggering Opportunity Attacks caused by that movement. The character retains their base Reaction.

## Set Weapon

Spend the Combat Action to set a ready weapon with the **Set** tag. If an opponent Charges into its reach before the wielder's next turn, the wielder makes one Close Combat attack at `+1B` before the Charge attack resolves. This spends no further Action or Reaction, works once, and then the weapon is no longer set. It is not a standard attack and cannot trigger an extra off-hand attack. Taking any Action, Movement Action, or Reaction before the trigger also unsets it.

## Sprint

Spend the Combat and Movement Actions to move up to twice Movement. The character retains only their base Reaction, and it may only be used to Dodge. No other Reaction is available that round.

## Charge

Spend the Combat and Movement Actions and forfeit all Reactions. Move at least 5 metres and no more than twice Movement along a straight, unobstructed, passable route, ending adjacent to the target; then make one Close Combat attack. A hit gains `+1D6` damage. A Charge allows no other movement and is not a standard Close Combat attack for extra off-hand attacks.

## Intimidate

Spend the Combat Action to demand surrender or drive an enemy off. Declare a single target or the whole group, then oppose the character's Influence against the target's Persistence. A group rolls once on its leader's Persistence, or on the leader's Influence when that is higher.

Apply the one modifier that best describes the enemy to their resisting roll; the modifiers are not cumulative.

| Enemy's condition                                                  | Modifier |
| ------------------------------------------------------------------ | -------: |
| At full strength, or carrying no more than minor wounds            |    `+2B` |
| Outnumbers your side but has lost 20% of its numbers or Hit Points |    `+1B` |
| Fewer than your side and already wounded                           |    `-1P` |
| Has lost over half its Hit Points, or half the group is down       |    `-2P` |

While the enemy is at full strength or outnumbers the characters, only a Critical Influence against a failed Persistence forces a surrender. A fumbled Persistence routs them outright.

A shared language is not needed, but the character must be able to make themselves understood by sign, gesture, or bearing. The Gamemaster decides who can be targeted and whether the attempt is possible at all.
