---
type: rule
id: characters.character-creation
chapter: characters
title: Character creation
slug: character-creation
order: 10
summary: Turn a one-sentence concept into characteristics, attributes, skills, starting Improvement Points, equipment, and Hero Points by working the steps in order.
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

Write one sentence that states who the character is, what they are good at, and what drives them.
Use it to guide later choices, but change it if a better character emerges during creation.

Compare concepts with the other players and confirm that each belongs in the planned campaign.
A varied group usually has more ways to solve problems.

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

Start every characteristic at 8, then distribute 30 points among them.
The maximum during creation is 18.

You may lower characteristics to reclaim points.
`INT` and `SIZ` cannot start below 7; every other characteristic cannot start below 3.

### Random characters {#characters-random-characteristics}

As an alternative, roll `4D6` and discard the lowest die for `STR`, `CON`, `DEX`, `POW`, and `CHA`.
For `INT` and `SIZ`, roll `3D6`, discard the lowest die, and add 6.
After all seven rolls, swap one pair if desired.

## Attributes {#characters-attributes}

Calculate attributes after assigning characteristics.

| Attribute                   | Value                                  |
| --------------------------- | -------------------------------------- |
| Maximum Hit Points (`HP`)   | `(SIZ + CON) / 2`                      |
| Major Wound Level (`MWL`)   | `maximum HP / 2`                       |
| Maximum Power Points (`PP`) | `POW`                                  |
| Movement                    | 15 metres per Combat Round for a human |
| Combat Order                | `(DEX + INT) / 2` minus armour ENC     |

Round to the nearest whole number; round exact halves up, as in [D100 Percentile](/rules/start-here/#d100-percentile).

### Hit Points and Major Wounds {#characters-hit-points}

Hit Points measure how much injury a character can sustain.
Use maximum HP when calculating MWL, even after losing HP.
A single post-armour hit that equals or exceeds MWL causes a [Major Wound](/rules/characters/#character-creation--characters-major-wounds).

### Power Points {#characters-power-points}

Power Points fuel [Shaping](/rules/magic/) and other abilities that state a PP cost.
They cannot exceed maximum PP.

Recover a quarter of maximum PP after each complete two hours of rest, up to the maximum.
Eight hours of rest restores all PP.
At 0 PP, living characters fall unconscious until regaining PP; nonliving characters stay active unless stated otherwise.

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

Every character has all general skills.
Skills with a parenthetical subject, such as `Craft (type)`, are separate skills for each chosen subject.

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
| Engineering      |  `INT + 10` |
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

Add the relevant pool to skills in that category.
You may add no more than 30 points to a single skill during creation, and no skill can exceed 100%.

You may also remove up to 20 points from each of the Resistance, Combat, and Practical pools to gain starting Improvement Points.
For every 5 points removed, gain 1 IP, to a maximum of 4 IP per category and 12 IP in total.
These bonus IP may raise characteristics or buy Talents, but may not raise skills.

## Starting Improvement Points {#characters-starting-ip}

Begin with 10 Improvement Points.
Spend them on [improvements](/rules/characters/#improvement) or available Talents, including [Shaping](/rules/talents/#shaping) for a character who begins play as a Shaper.
Characteristics remain capped at 18 during creation.

## Equipment and details {#characters-equipment-details}

Begin with `4D6 × 10` Silver Pieces and choose one package:

- leather armour, a ranged weapon, a two-handed close-combat weapon, and a dagger; or
- leather armour, a shield, a ranged weapon, a one-handed close-combat weapon, and a dagger.

Every character also has a backpack, 10 metres of rope, two weeks of travelling provisions, flint and tinder, and a waterskin.
The Gamemaster may allow purchases from starting money before play.

### Finishing details {#characters-finishing-details}

Name the character and note their appearance, background, personality, loyalties, and immediate goal.
A few concrete details are enough to begin play.

Human characters normally begin between 18 and 28 years old.
Roll `2D6 + 16` for a random starting age.

## Hero Points and wounds {#characters-hero-points}

Player Characters begin with 2 Hero Points.
Spend a Hero Point when its effect is declared; spent points are gone.
The Gamemaster awards Hero Points for major achievements and genuinely heroic play.

### Major Wounds {#characters-major-wounds}

When one post-armour hit deals damage equal to or greater than MWL, apply the damage and both conditions below:

- **Wounded:** suffer `-1P` on every test.
- **Bleeding:** lose 1 HP at the end of every Combat Round.

These conditions do not stack. Further Major Wounds still deal damage and can restart Bleeding after it has been stopped, but do not create wounds that must be tracked separately.

At 0 HP, the character falls unconscious and gains **Dying**.
A Dying character dies after 3 Combat Rounds unless stabilised.
Do not make a Resilience test or roll on an injury table.

### Treatment {#characters-wound-treatment}

A character can spend a full Combat Round and pass a Healing test to remove Bleeding and Dying from a patient.
This restores no HP; a patient at 0 HP remains unconscious.

A Major Wound cannot recover until successful Surgery or an equivalent treatment. Successful Surgery restores 1 HP and unlocks normal recovery. Wounded ends after that treatment once the character's current HP is greater than MWL.

### Spending Hero Points {#characters-spending-hero-points}

Spend 1 Hero Point for one of these effects:

- **Reroll:** reroll a failed test and use the new result.
- **Downgrade a Major Wound:** keep the full HP loss but do not gain Wounded or Bleeding from that hit.
- **Avoid Death:** when reduced to 0 HP, fall stably unconscious instead of Dying.
  The character is not Bleeding, awakens after the scene with 1 HP, and remains Wounded if that condition already applied.
- **Story benefit:** with the Gamemaster's approval, establish a plausible favourable detail or coincidence.
  Larger changes may require several Hero Points, including points contributed by other characters.

Downgrading a Major Wound does not cancel the 0 HP rule.
If the retained damage reduces the character to 0 HP, Avoid Death requires another Hero Point.
