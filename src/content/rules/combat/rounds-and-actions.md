---
type: rule
id: combat.rounds-and-actions
chapter: combat
title: Rounds and Actions
slug: rounds-and-actions
order: 10
summary: Each five-second round gives you one Combat Action, one Movement Action, and one base Reaction.
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

## Combat Order {#combat-order}

When combat starts, everyone rolls `1D10 + Combat Order` and acts from the highest total to the lowest. Ties go to the higher DEX. If DEX also ties, reroll `1D10` between those characters.

## Your round {#your-round}

A round lasts five seconds and gives you:

- **one Combat Action**, usually an attack or a skill;
- **one Movement Action**; and
- **one base Reaction**, used when something triggers it.

You take your Combat Action and Movement Action in Combat Order. A Reaction interrupts that order only long enough to resolve its trigger. Unused actions are lost; they do not carry into the next round.

You cannot choose an option that would give up or restrict an Action or Reaction already used in a different way. For example, after Parrying this round you cannot Sprint, because a Sprint keeps your Reaction for Dodge only.

### What each option costs {#what-each-option-costs}

| Option                                                                 | Combat Action | Movement Action | Reactions                    |
| ---------------------------------------------------------------------- | ------------- | --------------- | ---------------------------- |
| Attack, aim, cast, or use a skill                                      | Used          | Kept            | Kept                         |
| Move, stand up, or ready an item                                       | Kept          | Used            | Kept                         |
| [Withdraw](#withdraw)                                                  | Used          | Used            | Kept                         |
| [Sprint](#sprint)                                                      | Used          | Used            | Base Reaction for Dodge only |
| [Charge](#charge)                                                      | Used          | Used            | None left                    |
| [Reload a light crossbow](/rules/combat/#ranged-combat--crossbows)     | Kept          | Used            | Base Reaction used           |
| [Reload a heavy crossbow](/rules/combat/#ranged-combat--crossbows)     | Used          | Used            | None left                    |
| [Stabilise a dying character](/rules/combat/#damage-and-wounds--dying) | Used          | Used            | None left                    |

## Common Combat Actions

- Make one standard attack with Close Combat, Unarmed Combat, or Ranged Combat.
- Start or escape a grapple.
- Aim a ranged weapon.
- Set a weapon against a Charge.
- Use a skill or object that takes about five seconds.
- Cast or maintain a [Shaping](/rules/magic/#casting-and-defence) when its rules need a Combat Action.
- Intimidate one enemy or a whole group into surrendering or fleeing.
- **Delay:** act later in the round, after a participant you choose. To interrupt an action that is already starting, make an opposed test with the skills involved; the winner acts first.

## Common Movement Actions

- Move up to your Movement in metres.
- Stand up, or drop prone.
- Disengage and move away. An enemy who can reach you can spend a Reaction on an Opportunity Attack.
- Ready one item, or nock an arrow, while moving no more than half your Movement.
- Stow one item and draw another, or ready two items. This uses the whole Movement Action.

Reloading a crossbow has its [own rule](/rules/combat/#ranged-combat--crossbows); a Ready action never shortens it.

## Withdraw

Use your Combat Action and Movement Action to move up to your normal Movement without triggering Opportunity Attacks for that movement. You keep your base Reaction and any extra off-hand Reaction.

## Set Weapon

Use your Combat Action to set a ready weapon with the **Set** tag. If an opponent Charges into its reach before your next turn, you make one Close Combat attack at `+1B` before their Charge attack is resolved.

- The attack costs no further Action or Reaction and works once; then the weapon is no longer set.
- It is not a standard attack, so it gives no extra off-hand attack.
- Taking any Action, Movement Action, or Reaction before the Charge also unsets the weapon.

## Sprint

Use your Combat Action and Movement Action to move up to twice your Movement. That round, your only Reaction is your base Reaction, and you can use it only to Dodge.

## Charge

Use your Combat Action and Movement Action, and give up all your Reactions. Move in a straight line, at least 5 metres and at most twice your Movement, along a clear, passable route that ends adjacent to your target. Then make one Close Combat attack; a hit deals `+1D6` damage.

- You make no other movement that round.
- A Charge is not a standard Close Combat attack, so it gives no extra off-hand attack.

## Intimidate

Use your Combat Action to demand surrender or drive an enemy off. Choose one target or a whole group, then make an opposed test: your Influence against the target's Persistence. A group rolls once, using its leader's Persistence, or the leader's Influence if higher.

Give the enemy's roll the one modifier that best describes them; do not add modifiers together.

| Enemy's condition                                                  | Modifier |
| ------------------------------------------------------------------ | -------: |
| At full strength, or carrying no more than minor wounds            |    `+2B` |
| Outnumbers your side but has lost 20% of its numbers or Hit Points |    `+1B` |
| Fewer than your side and already wounded                           |    `-1P` |
| Has lost over half its Hit Points, or half the group is down       |    `-2P` |

If you win, the Gamemaster decides how the enemy gives way, judging its condition and numbers:

- Wounded enemies, or the wounded members of a group, might flee or surrender.
- Enemies at full strength rarely just flee. They are more likely to hesitate and lose a turn.
- While the enemy is at full strength or outnumbers your side, only a Critical Influence against a failed Persistence forces a surrender.
- If the enemy fumbles its Persistence roll, it breaks and flees at once.

You need no shared language, but you must make yourself understood by sign, gesture, or bearing. The Gamemaster decides who can be targeted and whether the attempt is possible at all.
