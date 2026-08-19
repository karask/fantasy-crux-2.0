---
type: rule
id: magic.casting-and-defence
chapter: magic
title: Casting and Defence
slug: casting-and-defence
order: 50
summary: Spend one Combat Action, test Shaping, resolve Counter and one opposed defence, pay PP, and apply the effect.
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

Bonus dice cancelling the Penalty do not remove overreach. [Shaping expertise](/rules/magic/#building-a-shaping--magic-intensity) also caps every outcome's Intensity.

## Cast {#magic-cast}

1. Declare the cell and outcomes; set each outcome's Intensity, then shared Range, Duration, Reach, and adjustments.
2. The Gamemaster confirms Magnitude, modifiers, defence, armour, and consequences.
3. Confirm PP or ritual pledges cover Magnitude. For an indefinite ritual, the leader needs that much current and available maximum PP. Confirm the active limit.
4. Spend one Combat Action and test Shaping; retain the Movement Action and eligible Reactions.
5. Resolve Counter and defence, pay PP, then apply the effect.

Casting requires Practice, Tell, a valid target, and line of effect unless Scry, Indirect, or ritual Range says otherwise; prevented Practice prevents casting.

| Casting result                    | Outcome                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| **Critical**                      | Success; pay half Magnitude. Critical grade applies, but effect dice are not maximised. |
| **Success**                       | Pay full Magnitude.                                                                     |
| **Failure within Safe Magnitude** | No effect; lose 1 PP.                                                                   |
| **Failed overreach**              | No effect; lose half Magnitude and suffer Backlash.                                     |
| **Fumble**                        | No intended effect; lose full Magnitude and suffer Backlash.                            |

A successful casting that a defence stops still pays its full cost. Resolve any Hero Point reroll before applying PP loss or Backlash. A casting that drops the Shaper to 0 PP resolves its effect before unconsciousness; any concentration then ends.

## Harm delivery {#magic-harm-delivery}

Declare delivery before Magnitude: Projected Harm and Direct Harm are mutually exclusive, whatever their description.

| Delivery                              | Cost   | Opposed defence              | Protection                         |
| ------------------------------------- | ------ | ---------------------------- | ---------------------------------- |
| **Projected Harm**                    | —      | Dodge or shield Active Guard | Cover and nonmagical AP            |
| **Direct bodily or material Harm**    | `+1 M` | Resilience                   | Magical Wards and named resistance |
| **Direct mental or spiritual Harm**   | `+1 M` | Persistence                  | Magical Wards and named resistance |
| **Direct Harm to unattended objects** | `+1 M` | None                         | Magical protection only            |

Projected crosses space; Direct arises within its target. A successful resistance that wins the opposed test negates the entire Direct outcome; it does not reduce damage. Direct Harm permits selected-target Reach, never a radius. Each Direct target needs a valid Range route; a complete barrier requires [Indirect](/rules/talents/#indirect). Other hostile outcomes use the Defence table without the Direct adjustment.

## Defence {#magic-defence}

Each hostile outcome receives exactly one defence against the original Shaping result.

| Other effect                                                  | Opposed defence       |
| ------------------------------------------------------------- | --------------------- |
| Self, willing subject, unattended object, point               | None                  |
| Individually targeted Projected Shaping                       | Dodge or shield guard |
| Projected or otherwise avoidable area                         | Dodge                 |
| Bodily or material alteration, restraint, or physical control | Resilience            |
| Thought, emotion, memory, identity, soul, or control          | Persistence           |

When Dodge, shield Active Guard, Resilience, or Persistence resists a Shaping, compare that defence roll with the Shaper's original Shaping result as an [opposed test](/rules/skills/#opposed-tests). The original Shaping result is the attacker's skill roll. The Shaper must succeed and win against Dodge, Resilience, or Persistence for that subject to be affected. If shield Active Guard wins, apply Parry Size; if Shaping wins, the guard has no effect.

Dodge and shield guard take `-1P`; Dodge spends only the base Reaction and remains once per round. Resilience and Persistence spend no Reaction. Shared defences share one roll; different defences resolve separately. A magical Critical keeps its grade for the opposed test; if Shaping wins, use normal effect dice and armour, not weapon-critical benefits.

The defender chooses one eligible Reaction: Counter, Dodge, or Active Guard. [Counter](/rules/talents/#counter) precedes target defence and opposes the Shaping. A character who Counters cannot then Dodge, Active Guard, or oppose with Resilience or Persistence. Another character's Counter does not consume the target's defence.

A hostile Touch Shaping first needs a no-damage Unarmed Combat delivery attack—the sole defence exception. No Talent or off-hand attack applies. The target may React; contact succeeds unless the [combat matrix](/rules/combat/#critical-hits-and-fumbles) stops the hit, and partial Parry does not. Failure spends the Combat Action without Shaping roll or PP loss. Contact then proceeds to casting and resistance; its Critical adds nothing.

Areas share one Shaping roll; unwilling subjects defend separately. An aware subject may Dodge a projected area at `-1P`, gaining no movement or prone. Attended objects use their bearer's defence. In ongoing areas, defend when first affected and store the outcome: leaving suspends it; re-entry grants no new defence.

## Cover and shields {#magic-cover-shields}

Terrain interrupting a Projected Shaping gives partial cover `-1P`, substantial cover `-2P`, or prevents casting at complete cover without another route or Indirect. Selected targets use their greatest cover penalty for the one roll. Areas test cover to the chosen point; occupants' shields do not alter the area's shared roll.

[Shield Cover](/rules/talents/#shield-cover) affects every individually targeted Projected Shaping, regardless of Form or whether solid or non-solid. Apply it before Active Guard and use only the better Shield Cover or terrain penalty.

Any such projection may be [Active Guarded](/rules/combat/#active-guard) at `-1P` with a ready shield; weapons cannot Active Guard magical projections. Areas cannot be Active Guarded. Direct Harm and Spirit Harm cannot be Active Guarded. [Missile Guard](/rules/talents/#missile-guard) removes the penalty.

Each Projected outcome uses its own Intensity to determine **Impact Size**. When several outcomes share one winning shield guard roll, apply Parry Size to each outcome separately.

| Intensity | Damage | Impact Size |
| --------: | ------ | ----------- |
|         1 | `1D6`  | Light       |
|         2 | `2D6`  | Medium      |
|         3 | `3D6`  | Heavy       |
|         4 | `4D6`  | Huge        |
|         5 | `5D6`  | Beyond Huge |

After a winning shield guard, apply [Parry Size](/rules/combat/#attacks-and-reactions) to each outcome. The same Size or larger blocks that outcome's damage and attached effects; if it deals no damage, it blocks the outcome. One Size smaller blocks half that outcome's damage; a separately paid non-damage outcome remains unless its own Size comparison blocks it. Two or more Sizes smaller reduce no damage. A Critical shield Parry that wins blocks everything regardless of Size. If Shaping wins the opposed test, the guard has no effect; even a Critical Shaping rolls normal magical damage, then armour. Shields suffer no item damage merely for guarding.

| Shield     | Size   | I1  | I2  | I3   | I4   | I5   |
| ---------- | ------ | --- | --- | ---- | ---- | ---- |
| **Small**  | Medium | All | All | Half | None | None |
| **Medium** | Heavy  | All | All | All  | Half | None |
| **Large**  | Huge   | All | All | All  | All  | Half |

A separate mundane object attack uses ordinary weapon Size; one resolved as Shaping uses Impact Size.

## Backlash {#magic-backlash}

For Backlash, use the attempted Shaping's highest outcome Intensity. If several outcomes tie, the Gamemaster chooses the one that best fits its Form and situation.

Roll `1D4` or let the Gamemaster choose:

| `1D4` | Result                                                                                                                                                                 |
| ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     1 | Take Magnitude damage ignoring armour; it can cause a Major Wound.                                                                                                     |
|     2 | Lose another Magnitude PP, to a minimum of 0.                                                                                                                          |
|     3 | An immediate Reach-0 effect one Intensity lower strikes the Shaper, nearest valid subject, or surroundings; no beneficial adjustment. Intensity 0 is cosmetic trouble. |
|     4 | Become Fatigued; if Fatigued, become Exhausted; if Exhausted, fall unconscious `3D6` minutes and awaken Fatigued.                                                      |

Backlash follows the attempted Form and situation, not a rewritten concept. Counter or Dispel spills use the target's Form and highest outcome Intensity, reduced by one; Intensity 0 is cosmetic trouble.
