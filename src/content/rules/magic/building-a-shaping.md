---
type: rule
id: magic.building-a-shaping
chapter: magic
title: Building a Shaping
slug: building-a-shaping
order: 20
summary:
  - Before you roll, choose a known cell and price each outcome.
  - Outcome Intensities + Range + Duration + Reach + adjustments = Magnitude.
aliases:
  - Magnitude
  - magic formula
  - Shaping dials
  - Shaping limits
  - rules for every Shaping
---

Build a Shaping before you roll:

1. **Choose a [known cell](/rules/magic/#becoming-a-shaper).** Every outcome must use that cell unless you apply [Confluence](/rules/talents/#confluence) to combine exactly two known cells.
2. **Rate each outcome's Intensity.** An outcome is one thing the Shaping does, such as damage or healing.
3. **Rate the shared Range, Duration, and Reach** once.
4. **Add adjustments**, such as Direct Harm, and total the **Magnitude**.

> **Core formula:** `sum of outcome Intensities + Range + Duration + Reach + adjustments = Magnitude.`

![A Shaping's Magnitude is the sum of its outcome Intensities, Range, Duration, Reach, and adjustments. Example: a 2D6 firebolt within 15 metres is Intensity 2 plus Range 1, Magnitude 3. Magnitude sets the PP cost, the casting risk against Safe Magnitude, the load against INT while it lasts, and Dispel strength.](../../../assets/diagrams/shaping-formula.svg)

Intensity sets each effect; Magnitude sets PP, difficulty, active load, and Dispel strength. Your casting result sets what you pay. Declare the Shaping in one sentence for the Gamemaster to confirm:

> Using **[Technique]·[Form]**, I cause **[outcome]** at **[Range]**, affecting **[Reach]**, for **[Duration]**.

For immediate Unmake damage, declare its delivery before calculating Magnitude: [Projected or Direct](/rules/magic/#casting-and-defence--magic-harm-delivery).

## Intensity {#magic-intensity}

For each outcome, choose the lowest row that covers it; [Effects](/rules/magic/#effects) gives exact benchmarks. Practical effects need Intensity 1 or more.

| Intensity | Degree  | Benchmark                                                                                                   |
| --------: | ------- | ----------------------------------------------------------------------------------------------------------- |
|         0 | Trick   | Cosmetic; no practical benefit.                                                                             |
|         1 | Minor   | Ordinary action or tool: small change, hindrance, clue, or movement.                                        |
|         2 | Potent  | Specialist: harm, restraint, `+1B`/`-1P`, useful creation, or moving a person.                              |
|         3 | Major   | Superhuman: flight, lost Combat Action, essential transformation, distant observation, or competent summon. |
|         4 | Greater | Encounter-changing: control, `+2B`/`-2P`, impossible transformation, or major threat.                       |
|         5 | Mythic  | Break a fundamental boundary; ritual and lasting price required.                                            |

**Tricks.** A calm Magnitude-0 Trick is free and automatic. Under pressure, a failed Trick does nothing, and a fumble causes only an inconvenient Tell: no PP loss or Backlash. Other Tricks cast normally.

## Your limits {#magic-limits}

Your Shaping expertise limits both maximum Intensity and Safe Magnitude. No individual outcome can exceed maximum Intensity. Casting above Safe Magnitude is [overreach](/rules/magic/#casting-and-defence--magic-overreach): harder, and dangerous if it fails.

| Shaping | Expertise  | Maximum Intensity | Safe Magnitude | Highest Magnitude without a ritual | Highest Magnitude with a ritual |
| ------: | ---------- | ----------------: | -------------: | ---------------------------------: | ------------------------------: |
|   0–25% | Novice     |                 1 |              1 |                                  3 |                               3 |
|  26–50% | Apprentice |                 2 |              2 |                                  4 |                               4 |
|  51–75% | Veteran    |                 3 |              3 |                                  5 |                               6 |
|  76–99% | Expert     |                 4 |              4 |                                  6 |                               8 |
|    100% | Master     |                 5 |              5 |                                  7 |                              10 |

The last two columns follow from the [overreach](/rules/magic/#casting-and-defence--magic-overreach) and [ritual](/rules/magic/#rituals-and-examples--magic-rituals) rules. Normal casting reaches Safe Magnitude + 2; a ritual reaches Safe Magnitude + 2 or twice Safe Magnitude, whichever is greater.

Rituals and contributed PP cannot raise maximum Intensity, and the [Shaping Expertise Talent](/rules/talents/#shaping-expertise) raises neither limit. Lasting magic has a third limit: total [Active Magnitude](/rules/magic/#ongoing-and-magical-actions--magic-ongoing) cannot exceed INT.

## Range {#magic-range}

| Rating | Range                                                                   |
| -----: | ----------------------------------------------------------------------- |
|      0 | Self or touch                                                           |
|      1 | Within 15 metres                                                        |
|      2 | Within 50 metres                                                        |
|      3 | Any visible point                                                       |
|      4 | Familiar, marked, or mystically linked target in the same realm; ritual |
|      5 | Another realm or plane; mythic ritual                                   |

Range 1–3 needs an unobstructed route. **Indirect** crosses a barrier when the Form permits.

## Duration {#magic-duration}

| Rating | Duration                                                     |
| -----: | ------------------------------------------------------------ |
|      0 | Instant or until the end of the affected subject's next turn |
|      1 | One scene or 10 minutes                                      |
|      2 | Until the target next fully rests, maximum 8 hours           |
|      3 | One week; ritual                                             |
|      4 | Indefinite until dismissed or Dispelled; ritual              |
|      5 | Permanent; mythic ritual                                     |

Duration sustains a state, sense, or observation, not repeated damage, healing, lost Actions, discrete answers, or other one-use outcomes. Concentration beyond your next turn requires Duration 1 or more.

## Reach {#magic-reach}

Use the highest rating that the number of targets, the area, or the largest subject requires.

| Rating | Targets or area               | Largest subject                     |
| -----: | ----------------------------- | ----------------------------------- |
|      0 | One                           | Person, door, or human-sized object |
|      1 | Up to 2 or 3-metre radius     | Wagon or large tree                 |
|      2 | Up to 5 or 10-metre radius    | Room-sized structure                |
|      3 | Up to 20 or 50-metre radius   | Building or ship; ritual            |
|      4 | Up to 100 or 500-metre radius | Settlement; ritual                  |
|      5 | Army, city, or region         | Landscape-scale; mythic ritual      |

- An area includes everyone in it, allies too. Leaving out chosen subjects requires [Selective](/rules/talents/#selective).
- Reach cannot let a low Intensity demolish or transform beyond its benchmark.

## Adjustments {#magic-adjustments}

Anything beyond Intensity, Range, Duration, and Reach is an adjustment that adds Magnitude. Shared Range, Duration, and Reach count once, however many outcomes there are.

| Adjustment                                                            | Magnitude                          | Effect                                                   |
| --------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| [Additional outcome](#magic-additional-outcomes)                      | + its Intensity                    | A second, different outcome from the same cell.          |
| [Direct Harm](/rules/magic/#casting-and-defence--magic-harm-delivery) | `+1`                               | Harm arises inside the target instead of crossing space. |
| [Selective](/rules/talents/#selective)                                | `+1`                               | Leave chosen subjects out of an area. Talent.            |
| [Indirect](/rules/talents/#indirect)                                  | `+1` per barrier                   | Cross a barrier, where the Form permits. Talent.         |
| [Trigger](/rules/talents/#trigger)                                    | `+1`, plus a Duration for the wait | Wait for an observable event, then fire once. Talent.    |
| [Confluence](/rules/talents/#confluence)                              | `+1`                               | Combine exactly two known cells. Talent.                 |
| [Veiled](/rules/talents/#veiled)                                      | `+1`, and `-1P` on the test        | Conceal the Tell. Talent.                                |

### Additional outcomes {#magic-additional-outcomes}

An additional outcome within the same known cell needs no training. Price each outcome at its own lowest applicable Intensity, then sum each outcome's Intensity.

- Outcomes must be distinct and permitted by the cell.
- One Shaping cannot repeat damage, healing, movement, restraint, control, or another cumulative outcome on one subject. Use a higher Intensity for a stronger effect.

> **Example.** Healing at I3 plus a Resilience bonus at I2, at touch with no other dials, is M5. `Alter·Flesh` can combine those outcomes, but cannot buy healing twice.

### Trigger {#magic-trigger}

A Trigger fixes its target, cell, outcomes, Range, Reach, and all other dials when it is armed; it cannot defer those choices until it fires. The [Trigger Talent](/rules/talents/#trigger) covers weapon hits and enchanted items.

## Rules for every Shaping {#magic-shaping-rules}

1. **Price outcomes, not descriptions.** Use the lowest Intensity that covers each outcome. Magic can rival a specialist through PP and risk, but not erase skills, equipment, or preparation.
2. **Duration never repeats.** One-use outcomes, such as damage, healing, lost Actions, and answers, happen once; see [Duration](#magic-duration).
3. **Damage is dealt once.** It never recurs each round, adds to every weapon hit, or retaliates when a protected subject is attacked or harmed; see [Damage](/rules/magic/#effects--magic-damage).
4. **Consequences are real, not free.** A pushed foe can fall, but no consequence can hide free damage, modifiers, conditions, or resources.
5. **Same-kind magic does not stack.** Use only the strongest same-kind magical modifier, armour, or protection. Mundane circumstances still combine under the `+3B`/`-3P` cap.
6. **No extra actions or resources.** Shaping never widens a critical range or grants extra Combat Actions, Movement Actions, Reactions, Dodges, PP, IP, Hero Points, Talents, skills, or memories.
7. **Only Dispel ends active magic.** Unmake can damage a manifestation or exploit a genuine natural counter, but only [Dispel](/rules/magic/#ongoing-and-magical-actions--magic-dispel) directly ends an active Shaping.
8. **Created matter is temporary.** It vanishes when its Duration ends; see [temporary matter](/rules/magic/#ongoing-and-magical-actions--magic-temporary-matter).
