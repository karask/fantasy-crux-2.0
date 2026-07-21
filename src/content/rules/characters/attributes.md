---
type: rule
id: characters.attributes
chapter: characters
title: Attributes
slug: attributes
order: 30
summary:
  - Maximum HP is the average of SIZ and CON, rounded up; Major Wound Level is half maximum HP, rounded up.
  - Maximum PP equals POW; recover one quarter, rounded up, per two hours of rest, and all PP after eight hours.
quickReference:
  group: characters
  order: 20
aliases:
  - HP MWL PP
  - damage modifier
  - Combat Order
---

Calculate attributes after assigning characteristics.

| Attribute                   | Value                                  |
| --------------------------- | -------------------------------------- |
| Maximum Hit Points (`HP`)   | `ceil((SIZ + CON) / 2)`                |
| Major Wound Level (`MWL`)   | `ceil(maximum HP / 2)`                 |
| Maximum Power Points (`PP`) | `POW`                                  |
| Movement                    | 15 metres per Combat Round for a human |
| Combat Order                | `round((DEX + INT) / 2) - armour ENC`  |

Unless a rule says to round up or down, round to the nearest whole number; round exact halves up.

## Hit Points and Major Wounds {#characters-hit-points}

Hit Points measure how much injury a character can sustain.
Use maximum HP when calculating MWL, even after losing HP.
A single post-armour hit that equals or exceeds MWL causes a [Major Wound](/rules/characters/hero-points-and-wounds/).

## Power Points {#characters-power-points}

Power Points fuel abilities that state a PP cost.
They cannot exceed maximum PP.

Recover `ceil(maximum PP / 4)` PP after each complete two hours of rest, up to the maximum.
Eight hours of rest restores all PP.
At 0 PP, the character falls unconscious and cannot wake until they have at least 1 PP.

## Damage Modifier {#characters-damage-modifier}

Add the Damage Modifier to close-combat, unarmed, and thrown-weapon damage.
Bows, slings, and crossbows use only their listed damage unless a Talent says otherwise.

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
