---
type: rule
id: characters.starting-skills
chapter: characters
title: Starting skills
slug: starting-skills
order: 40
summary: Calculate every base skill, spend each category's points, add no more than 30 points to one skill during creation, and cap every skill at 100%.
aliases:
  - skill points
  - base skills
  - starting skill allocation
---

Every character has all general skills.
Skills with a parenthetical subject, such as `Craft (type)`, are separate skills for each chosen subject.

## Expertise {#characters-skill-expertise}

|  Skill | Expertise  |
| -----: | ---------- |
|  0–25% | Novice     |
| 26–50% | Apprentice |
| 51–75% | Veteran    |
| 76–99% | Expert     |
|   100% | Master     |

## Base skills {#characters-base-skills}

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
| Lore (type)      |      `INT` |

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

## Access-gated skill {#characters-shaping-skill}

A character with [Shaping access](/rules/magic/#becoming-a-shaper) adds **Shaping** to Knowledge at base `INT + POW`. Declare and reserve access before allocating Knowledge points. Other characters do not have Shaping and cannot allocate points to it.

## Allocate points {#characters-allocate-skills}

| Category    | Points |
| ----------- | -----: |
| Resistances |     50 |
| Combat      |     50 |
| Knowledge   |     50 |
| Practical   |     75 |

Add the relevant pool to skills in that category.
You may add no more than 30 points to a single skill during creation, and no skill can exceed 100%.

You may move up to 20 points from Combat to Knowledge, gaining 2 Knowledge points for each Combat point removed.

You may also remove up to 10 points from each of the Resistance, Combat, and Practical pools to gain starting Improvement Points.
For every 5 points removed, gain 1 IP, to a maximum of 2 IP per category and 6 IP in total.
These bonus IP may raise characteristics or buy Talents, but may not raise skills.
