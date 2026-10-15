---
type: rule
id: magic.casting-and-defence
chapter: magic
title: Casting and Defence
slug: casting-and-defence
order: 30
summary: Spend one Combat Action and roll Shaping. Resolve any Counter and the target's one defence, pay PP, then apply the effect.
aliases:
  - cast magic
  - resist magic
  - magic Backlash
  - magical shields
  - does armour stop magic
  - can a shield block a firebolt
---

## Cast {#magic-cast}

1. **Declare** the cell and outcomes. Set each outcome's Intensity, then the shared Range, Duration, Reach, and adjustments.
2. **Confirm.** The Gamemaster confirms Magnitude, modifiers, defence, armour, and consequences.
3. **Check limits.** Your PP, or ritual pledges, must cover the Magnitude; an indefinite ritual's leader needs that much current and available maximum PP. The Shaping must fit your [Active Magnitude](/rules/magic/#ongoing-and-magical-actions--magic-ongoing) limit.
4. **Roll.** Spend one Combat Action and test Shaping, keeping your Movement Action and eligible Reactions.
5. **Resolve.** Resolve any Counter and defence, pay PP, then apply the effect.

Casting requires your Practice, your Tell, a valid target, and line of effect, unless Scry, Indirect, or ritual Range says otherwise. If your Practice is prevented, you cannot cast.

## Safe Magnitude and overreach {#magic-overreach}

Casting above your [Safe Magnitude](/rules/magic/#building-a-shaping--magic-limits) is **overreach**. Normal casting reaches at most Safe Magnitude + 2.

| Magnitude compared with Safe | Casting modifier |
| ---------------------------- | ---------------: |
| No greater                   |             None |
| 1 higher                     |            `-1P` |
| 2 higher                     |            `-2P` |
| 3+ higher                    |  Ritual required |

Cancelling or removing the Penalty does not remove overreach. [Shaping Expertise](/rules/talents/#shaping-expertise) can remove one remaining Penalty die from a casting test once per round, but failed overreach still causes its normal PP loss and Backlash.

## Results and cost {#magic-results}

| Casting result                    | Outcome                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| **Critical**                      | Success; pay half Magnitude. Critical grade applies, but effect dice are not maximised. |
| **Success**                       | Pay full Magnitude.                                                                     |
| **Failure within Safe Magnitude** | No effect; lose 1 PP.                                                                   |
| **Failed overreach**              | No effect; lose half Magnitude and suffer Backlash.                                     |
| **Fumble**                        | No intended effect; lose full Magnitude and suffer Backlash.                            |

Half Magnitude rounds up. A successful casting that a defence stops still pays its full cost. Resolve any Hero Point reroll before PP loss or Backlash. A casting that drops you to 0 PP resolves its effect before you fall unconscious; any concentration then ends.

## Harm delivery {#magic-harm-delivery}

**Projected Harm** crosses space, like a missile. **Direct Harm** arises inside its target. Declare which before calculating Magnitude; Projected Harm and Direct Harm are mutually exclusive, whatever their description.

![Projected Harm, such as a firebolt, crosses space: the target can Dodge or block it with a shield, both at -1P, and cover and worn armour apply. Direct Harm, such as searing heat, costs +1 Magnitude and arises inside the target: the target resists with Resilience or Persistence, a win negates it entirely, and only magical Wards and named resistances protect.](../../../assets/diagrams/harm-delivery.svg)

| Delivery                              | Cost   | Opposed defence              | Protection                         |
| ------------------------------------- | ------ | ---------------------------- | ---------------------------------- |
| **Projected Harm**                    | —      | Dodge or shield Active Guard | Cover and nonmagical AP            |
| **Direct bodily or material Harm**    | `+1 M` | Resilience                   | Magical Wards and named resistance |
| **Direct mental or spiritual Harm**   | `+1 M` | Persistence                  | Magical Wards and named resistance |
| **Direct Harm to unattended objects** | `+1 M` | None                         | Magical protection only            |

- A successful resistance that wins the opposed test negates the entire Direct outcome; it does not reduce the damage.
- Direct Harm permits selected-target Reach, never a radius.
- Each Direct target needs a valid Range route; a complete barrier requires [Indirect](/rules/talents/#indirect).

## Defence {#magic-defence}

Each hostile outcome receives exactly one defence against the original Shaping result. Harmful outcomes use the delivery table above. Other hostile outcomes use this table, without the Direct Harm adjustment:

| Other effect                                                  | Opposed defence              |
| ------------------------------------------------------------- | ---------------------------- |
| Self, willing subject, unattended object, point               | None                         |
| Individually targeted Projected Shaping                       | Dodge or shield Active Guard |
| Projected or otherwise avoidable area                         | Dodge                        |
| Bodily or material alteration, restraint, or physical control | Resilience                   |
| Thought, emotion, memory, identity, soul, or control          | Persistence                  |

### How the defence is rolled {#magic-defence-roll}

Dodge, shield Active Guard, Resilience, and Persistence each oppose the original Shaping result as an [opposed test](/rules/skills/#opposed-tests). That original Shaping result is the attacker's skill roll; the Shaper does not roll again.

- The Shaper must succeed and win against Dodge, Resilience, or Persistence for that subject to be affected.
- If shield Active Guard wins, apply Parry Size (see [Cover and shields](#magic-cover-shields)); if Shaping wins, the guard has no effect.
- Dodge and shield Active Guard take `-1P`. Dodge spends only the base Reaction, once per round. Resilience and Persistence spend no Reaction.
- A magical Critical keeps its grade for the opposed test. If Shaping wins, use normal effect dice and armour, not weapon-critical benefits.
- Resolve defence rolls per subject. Against one subject, outcomes using the same defence share one defence roll; outcomes using different defences resolve separately. Different subjects always defend separately.

### Counter {#magic-counter}

The defender chooses one eligible Reaction: Counter, Dodge, or Active Guard. [Counter](/rules/talents/#counter) comes before the target's defence and opposes the Shaping. A character who Counters cannot then Dodge, Active Guard, or oppose with Resilience or Persistence. Another character's Counter does not use up the target's defence.

### Touch Shapings {#magic-touch}

A hostile Touch Shaping first needs a no-damage Unarmed Combat attack to make contact. This is the sole defence exception: the target defends against the touch, then resists the Shaping as normal.

- No Talent or off-hand attack applies to the touch. The target can React; contact succeeds unless the [combat matrix](/rules/combat/#critical-hits-and-fumbles) stops the hit, and a partial Parry does not.
- A failed touch spends the Combat Action, with no Shaping roll and no PP loss. After contact, cast and resolve resistance as normal; a Critical touch adds nothing.

### Areas {#magic-areas}

Areas share one Shaping roll, but unwilling subjects defend separately.

- An aware subject can Dodge a projected area at `-1P`, gaining no movement or prone.
- Attended objects use their bearer's defence.
- In an ongoing area, a subject defends when first affected and the result is stored. Leaving suspends the effect; re-entering grants no new defence.

## Cover and shields {#magic-cover-shields}

**Cover.** Terrain between you and the target of a Projected Shaping gives partial cover `-1P` or substantial cover `-2P`; complete cover prevents casting without another route or [Indirect](/rules/talents/#indirect). Selected targets use their greatest cover penalty for the one roll. Areas test cover to the chosen point. Occupants' shields do not alter the area's shared roll.

**Shield Cover.** The [Shield Cover](/rules/talents/#shield-cover) Talent affects every individually targeted Projected Shaping, regardless of Form or whether solid or non-solid. Apply it before Active Guard, and use only the better of Shield Cover or terrain.

**Active Guard.** An individually targeted projection can be [Active Guarded](/rules/combat/#active-guard) at `-1P` with a ready shield. Weapons cannot Active Guard magical projections. Areas cannot be Active Guarded. Direct Harm and Spirit Harm cannot be Active Guarded. [Missile Guard](/rules/talents/#missile-guard) removes the penalty.

### Impact Size {#magic-impact-size}

Each Projected outcome uses its own Intensity to set its **Impact Size**. When several outcomes share one winning shield Active Guard roll, apply Parry Size to each outcome separately.

| Intensity | Damage | Impact Size |
| --------: | ------ | ----------- |
|         1 | `1D6`  | Light       |
|         2 | `2D6`  | Medium      |
|         3 | `3D6`  | Heavy       |
|         4 | `4D6`  | Huge        |
|         5 | `5D6`  | Beyond Huge |

After a winning shield Active Guard, compare the shield's Size with each outcome's Impact Size:

- **Same Size or larger:** blocks that outcome's damage and attached effects. If it deals no damage, it blocks the outcome.
- **One Size smaller:** blocks half that outcome's damage, rounded up, but a separately paid non-damage outcome remains unless its own Size comparison blocks it.
- **Two or more Sizes smaller:** reduce no damage.
- **A Critical shield Parry that wins** blocks everything regardless of Size.

If Shaping wins the opposed test, the guard has no effect. Even a Critical Shaping rolls normal magical damage, then armour. Shields suffer no item damage merely for guarding.

| Shield     | Size   | I1  | I2  | I3   | I4   | I5   |
| ---------- | ------ | --- | --- | ---- | ---- | ---- |
| **Small**  | Medium | All | All | Half | None | None |
| **Medium** | Heavy  | All | All | All  | Half | None |
| **Large**  | Huge   | All | All | All  | All  | Half |

{.verdicts}

A separate mundane object attack uses ordinary weapon Size. An attack resolved as Shaping uses Impact Size.

## Example: a firebolt {#magic-firebolt-example}

Ilyra (Shaping 55%, Safe Magnitude 3) hurls a firebolt at a bandit 10 metres away.

1. **Build:** `Unmake·Fire`, `2D6` damage is Intensity 2; within 15 metres is Range 1; Projected, so no adjustment. Magnitude 3 is safe for her.
2. **Roll:** she spends her Combat Action and rolls 31, a success.
3. **Defend:** the bandit uses Active Guard with his medium shield at `-1P` and rolls 48 against Close Combat 45: a failure, so the guard has no effect.
4. **Pay and hit:** Ilyra pays 3 PP and rolls 8 damage. Worn armour applies to Projected Harm, so his leather (2 AP) stops 2: he loses 6 HP.

Had the bandit rolled 38, both would succeed and his higher roll would win. His Heavy shield outsizes the bolt's Medium impact, so it would block everything, and Ilyra would still pay 3 PP.

## Backlash {#magic-backlash}

Failed overreach and fumbles cause **Backlash**. Roll `1D4`, or the Gamemaster chooses:

| `1D4` | Result                                                                                                                                                                 |
| ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     1 | Take Magnitude damage ignoring armour; it can cause a Major Wound.                                                                                                     |
|     2 | Lose another Magnitude PP, to a minimum of 0.                                                                                                                          |
|     3 | An immediate Reach-0 effect one Intensity lower strikes the Shaper, nearest valid subject, or surroundings; no beneficial adjustment. Intensity 0 is cosmetic trouble. |
|     4 | Become Fatigued; if Fatigued, become Exhausted; if Exhausted, fall unconscious `3D6` minutes and awaken Fatigued.                                                      |

- For Backlash, use the attempted Shaping's highest outcome Intensity. If several outcomes tie, the Gamemaster chooses the one that best fits its Form and situation.
- Backlash follows the attempted Form and situation, not a rewritten concept.
- Counter or Dispel spills use the target's Form and highest outcome Intensity, reduced by one; Intensity 0 is cosmetic trouble.
