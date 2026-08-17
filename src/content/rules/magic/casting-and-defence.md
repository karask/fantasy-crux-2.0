---
type: rule
id: magic.casting-and-defence
chapter: magic
title: Casting and Defence
slug: casting-and-defence
order: 50
summary: Spend one Combat Action, test Shaping, resolve Counter and one eligible defence, pay PP, and apply the effect.
aliases:
  - cast magic
  - resist magic
  - magic Backlash
  - magical shields
---

## Safe Magnitude and overreach {#magic-overreach}

Normal casting reaches at most Safe Magnitude + 2.

| Magnitude compared with Safe | Casting modifier |
| ---------------------------- | ---------------: |
| No greater                   |             None |
| 1 higher                     |            `-1P` |
| 2 higher                     |            `-2P` |
| 3+ higher                    |  Ritual required |

Bonus dice cancelling the Penalty do not remove overreach. [Shaping expertise](/rules/magic/#building-a-shaping--magic-intensity) also caps Intensity.

## Cast {#magic-cast}

1. Declare the cell and outcome; set Intensity, Range, Duration, Reach, and adjustments.
2. The Gamemaster confirms Magnitude, modifiers, defence, armour, and consequences.
3. Confirm current PP can cover full Magnitude, or ritual pledges can cover its cost. An indefinite ritual instead requires the leader to cover full Magnitude in current and available maximum PP. Confirm the active limit remains legal.
4. Spend one Combat Action and test Shaping; retain the Movement Action and eligible Reactions.
5. Resolve Counter and defence, pay PP, then apply the effect.

Practice, Tell, a valid target, and line of effect are required unless Scry, Indirect, or ritual Range says otherwise. Casting cannot begin while its Practice is prevented.

| Casting result                    | Outcome                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| **Critical**                      | Success; pay half Magnitude. Critical grade applies, but effect dice are not maximised. |
| **Success**                       | Pay full Magnitude.                                                                     |
| **Failure within Safe Magnitude** | No effect; lose 1 PP.                                                                   |
| **Failed overreach**              | No effect; lose half Magnitude and suffer Backlash.                                     |
| **Fumble**                        | No intended effect; lose full Magnitude and suffer Backlash.                            |

A stopped successful Shaping still pays. Resolve Hero Point rerolls before PP loss or Backlash. Effects begin before 0-PP unconsciousness; concentration then ends.

## Defence {#magic-defence}

Use one defence per hostile outcome and one Shaping roll throughout.

| Effect                                                         | Defence        |          Reaction? |
| -------------------------------------------------------------- | -------------- | -----------------: |
| Self, willing subject, unattended object, empty point          | None           |                 No |
| Visible projectile, beam, wave, burst, or avoidable area       | Dodge at `-1P` | Base Reaction only |
| Direct bodily alteration, restraint, or physical control       | Resilience     |                 No |
| Thought, emotion, memory, identity, soul, or spiritual control | Persistence    |                 No |

Outcomes sharing a defence share its roll. One Dodge answers every dodgeable outcome in the Shaping; different defences resolve separately.

Resilience and Persistence are [opposed tests](/rules/skills/#opposed-tests): the Shaper must succeed and win. Neither spends a Reaction; two failures create no effect.

Dodge uses the Shaping result and [combat matrix](/rules/combat/#critical-hits-and-fumbles). A magical Critical gives the normal effect, not maximum damage or ignored armour. Dodge remains once per round and uses the base Reaction.

A hostile Touch Shaping first requires a no-damage Unarmed Combat delivery attack—the sole defence exception. It cannot use a Talent or trigger an off-hand attack. The target may React; contact succeeds unless the combat matrix stops the hit, and a partial Parry does not. Failed contact spends the Combat Action but causes no Shaping roll or PP loss; success proceeds to casting and resistance. Contact Criticals add nothing.

Roll Shaping once for an area; unwilling subjects defend separately. An aware subject may Dodge a visible area at `-1P` through the combat matrix, gaining neither movement nor prone. Attended objects use their bearer's defence.

Each unwilling subject defends when an ongoing area first affects them. Store that outcome for the Shaping's Duration: leaving suspends an effect already suffered; re-entry grants no new defence.

## Cover and shields {#magic-cover-shields}

When terrain interrupts a projected Shaping, partial cover gives `-1P`, substantial cover `-2P`, and complete cover prevents casting unless another route or Indirect applies. Individually selected targets use the greatest cover penalty among them for the single roll. An area tests cover to its chosen point; occupants' shields do not alter the shared roll.

The [Shield Cover Talent](/rules/talents/#shield-cover) penalises plausibly obstructed projected Shapings; use the better shield or terrain penalty. Internal Flesh, Mind, and Spirit gain none.

Tangible magical projectiles are Light for [Active Guard](/rules/combat/#active-guard)—existing objects retain Size—and count as thrown weapons for it only. A full-block Parry stops projectile and outcome; a lesser Parry reduces damage only. Flame, wind, lightning, pure Force, Flesh, Mind, and Spirit cannot be Parried.

[Counter](/rules/talents/#counter) resolves before target defence. A character cannot Counter, then Dodge or use Active Guard against the same Shaping; another character's Counter does not consume the target's Reaction. Each target gets at most one eligible defensive Reaction.

## Backlash {#magic-backlash}

Roll `1D4` or let the Gamemaster choose:

| `1D4` | Result                                                                                                                                                                                     |
| ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|     1 | Take Magnitude damage ignoring armour; it can cause a Major Wound.                                                                                                                         |
|     2 | Lose another Magnitude PP, to a minimum of 0.                                                                                                                                              |
|     3 | An immediate Reach-0 related effect at one lower Intensity strikes the Shaper, nearest valid subject, or surroundings. It gains no beneficial adjustment; Intensity 0 is cosmetic trouble. |
|     4 | Become Fatigued; if Fatigued, become Exhausted; if Exhausted, fall unconscious `3D6` minutes and awaken Fatigued.                                                                          |

Backlash follows the attempted Form and situation, not a rewritten character concept. Counter or Dispel spills use the target's Form at one lower Intensity; Intensity 0 is cosmetic trouble.
