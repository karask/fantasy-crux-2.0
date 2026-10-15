---
type: rule
id: characters.character-creation
chapter: characters
title: Character creation
slug: character-creation
order: 10
summary: Work through the steps in order, turning a one-sentence concept into characteristics, attributes, skills, Improvement Points, equipment, and Hero Points.
aliases:
  - character concept
  - create a character
  - STR CON DEX SIZ INT POW CHA
  - characteristic points
  - HP MWL PP
  - damage modifier
  - Combat Order
  - skill points
  - base skills
  - starting skill allocation
  - starting equipment
  - starting money
  - character age
  - Hero Points
  - Major Wound
  - Wounded Bleeding Dying
  - avoid death
---

## Concept {#characters-concept}

Write one sentence that says who the character is, what they are good at, and what drives them. Let it guide later choices, but change it if a better character emerges.

Compare concepts with the other players, and check that each fits the planned campaign. A varied group has more ways to solve problems.

> **Examples.** A foolhardy veteran seeking glory; an observant caravan scout paying an old debt; a disgraced courtier surviving by wit.

## Characteristics {#characters-characteristics}

Every character has seven characteristics.

| Characteristic       | Measures                                          |
| -------------------- | ------------------------------------------------- |
| Strength (`STR`)     | Physical power, lifting, and force.               |
| Constitution (`CON`) | Health, endurance, and resistance to bodily harm. |
| Dexterity (`DEX`)    | Agility, coordination, and reactions.             |
| Size (`SIZ`)         | Height, mass, and physical bulk.                  |
| Intelligence (`INT`) | Reasoning, memory, and analysis.                  |
| Power (`POW`)        | Will, presence of mind, and inner reserves.       |
| Charisma (`CHA`)     | Personal magnetism and leadership.                |

### Point allocation {#characters-characteristic-points}

Start every characteristic at 8, then distribute 30 points among them. The maximum during creation is 18.

You can lower characteristics to reclaim points. `INT` and `SIZ` cannot start below 7, and every other characteristic cannot start below 3.

### Random characters {#characters-random-characteristics}

Instead, you can roll. For `STR`, `CON`, `DEX`, `POW`, and `CHA`, roll `4D6` and drop the lowest die. For `INT` and `SIZ`, roll `3D6`, drop the lowest die, and add 6. After all seven rolls, you can swap one pair.

## Attributes {#characters-attributes}

Calculate attributes after assigning characteristics. Round [as usual](/rules/start-here/#d100-percentile--measures-and-rounding): to the nearest whole number, with exact halves up.

| Attribute                   | Value                                  |
| --------------------------- | -------------------------------------- |
| Maximum Hit Points (`HP`)   | `(SIZ + CON) / 2`                      |
| Major Wound Level (`MWL`)   | `maximum HP / 2`                       |
| Maximum Power Points (`PP`) | `POW`                                  |
| Movement                    | 15 metres per Combat Round for a human |
| Combat Order                | `(DEX + INT) / 2` minus armour ENC     |

### Hit Points and Major Wounds {#characters-hit-points}

Hit Points measure how much injury a character can take. Always calculate MWL from maximum HP, even after losing HP. A single post-armour hit that equals or exceeds MWL causes a [Major Wound](/rules/combat/#damage-and-wounds--major-wounds).

### Power Points {#characters-power-points}

Power Points fuel [Shaping](/rules/magic/) and other abilities that state a PP cost. They cannot exceed maximum PP.

Each complete two hours of rest restores a quarter of maximum PP, rounded normally: POW 3 recovers 1 PP per period, and POW 9 recovers 2. Eight hours of rest restores all PP. At 0 PP, living characters fall unconscious until they regain PP; nonliving characters stay active unless stated otherwise.

### Damage Modifier {#characters-damage-modifier}

Add the Damage Modifier to close-combat, unarmed, and thrown-weapon damage.

|        `STR + SIZ` | Damage Modifier |
| -----------------: | :-------------- |
|               1–10 | `-1D6`          |
|              11–15 | `-1D4`          |
|              16–25 | `+0`            |
|              26–30 | `+1D4`          |
|              31–45 | `+1D6`          |
|              46–60 | `+2D6`          |
|              61–75 | `+3D6`          |
| Each additional 15 | another `+1D6`  |

## Starting skills {#characters-starting-skills}

Every character has all general skills. A skill with a subject in brackets, such as `Craft (type)`, is a separate skill for each chosen subject.

### Expertise {#characters-skill-expertise}

|  Skill | Expertise  |
| -----: | ---------- |
|  0–25% | Novice     |
| 26–50% | Apprentice |
| 51–75% | Veteran    |
| 76–99% | Expert     |
|   100% | Master     |

### Base skills {#characters-base-skills}

| Resistances |        Base |
| ----------- | ----------: |
| Dodge       |  `DEX + 10` |
| Persistence |  `POW + 10` |
| Resilience  | `CON + POW` |

| Combat skills  |        Base |
| -------------- | ----------: |
| Close Combat   | `DEX + STR` |
| Ranged Combat  | `DEX + INT` |
| Unarmed Combat | `DEX + STR` |

| Knowledge skills |       Base |
| ---------------- | ---------: |
| Culture (own)    | `INT + 10` |
| Culture (other)  |      `INT` |
| Language (own)   | `INT + 50` |
| Language (other) |      `INT` |
| Natural Lore     | `INT + 10` |
| Lore (own field) | `INT + 10` |
| Lore (other)     |      `INT` |

| Practical skills |        Base |
| ---------------- | ----------: |
| Athletics        | `DEX + STR` |
| Craft (type)     |  `INT + 10` |
| Deception        | `DEX + INT` |
| Driving          | `DEX + INT` |
| Healing          |  `INT + 10` |
| Influence        |  `CHA + 10` |
| Mechanisms       | `DEX + INT` |
| Perception       | `INT + POW` |
| Performance      |  `CHA + 10` |
| Riding           | `DEX + POW` |
| Sailing          | `DEX + INT` |
| Streetwise       | `CHA + POW` |
| Trade            |  `INT + 10` |

### Allocate points {#characters-allocate-skills}

| Category    | Points |
| ----------- | -----: |
| Resistances |     50 |
| Combat      |     50 |
| Knowledge   |     50 |
| Practical   |     75 |

Add each pool to skills in its category. During creation, add no more than 30 points to any one skill, and no skill can exceed 100%.

**Trading points for IP.** You can remove up to 20 points from each of the Resistance, Combat, and Practical pools. Every 5 points removed gives 1 IP, up to 4 IP per category and 12 IP in total. These bonus IP can raise characteristics or buy Talents, but cannot raise skills.

**Starting as a Shaper.** Reserve the 20 IP before allocating skill points; see [Becoming a Shaper](/rules/magic/#becoming-a-shaper--magic-at-creation).

## Starting Improvement Points {#characters-starting-ip}

Begin with 10 Improvement Points. Spend them on [improvements](/rules/characters/#improvement) or available Talents, including [Shaping](/rules/talents/#shaping) for a character who begins play as a Shaper. Characteristics stay capped at 18 during creation.

## Equipment and details {#characters-equipment-details}

Begin with `4D6 × 10` Silver Pieces and choose one package:

- leather armour, a ranged weapon, a two-handed close-combat weapon, and a dagger; or
- leather armour, a shield, a ranged weapon, a one-handed close-combat weapon, and a dagger.

Every character also has a backpack, 10 metres of rope, two weeks of travelling provisions, flint and tinder, and a waterskin. The Gamemaster can allow purchases from starting money before play.

### Finishing details {#characters-finishing-details}

Name the character and note their appearance, background, personality, loyalties, and immediate goal. A few concrete details are enough to begin.

Human characters normally begin between 18 and 28 years old. Roll `2D6 + 16` for a random starting age.

## Hero Points {#characters-hero-points}

Player Characters begin with 2 Hero Points. The Gamemaster awards more for major achievements and genuinely heroic play. Spend a Hero Point when you declare its effect; spent points are gone.

### Spending Hero Points {#characters-spending-hero-points}

Spend 1 Hero Point for one of these effects:

- **Reroll:** reroll a failed test and use the new result.
- **Downgrade a Major Wound:** keep the full HP loss, but gain no Wounded or Bleeding from that hit.
- **Avoid Death:** at 0 HP, fall stably unconscious instead of Dying. You are not Bleeding, wake after the scene with 1 HP, and stay Wounded if you already were.
- **Story benefit:** with the Gamemaster's approval, establish a plausible favourable detail or coincidence. Larger changes can need several Hero Points, including points from other characters.

**Rerolls.** Each test allows at most one reroll, whatever its source. Declare a reroll after seeing the result but before applying consequences, costs, or Backlash; the new result stands. A Fumble also counts as a failed test, so effects that apply to failed tests, such as rerolls, apply to it.

**Wounds.** Downgrading a Major Wound does not cancel the 0 HP rule: if the damage you keep takes you to 0 HP, Avoid Death costs another Hero Point. [Damage and Wounds](/rules/combat/#damage-and-wounds) covers Major Wounds, Bleeding, Dying, and treatment.
