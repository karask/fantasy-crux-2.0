---
type: creature
id: creatures.harpy
chapter: creatures
title: 'Harpy'
slug: harpy
order: 300
category: monster
summary: 'A filthy, winged scavenger whose claws and missiles spread disease.'
image: '/assets/images/creatures/harpy.webp'
image320: '/assets/images/creatures/harpy-320.webp'
imageAlt: 'A winged harpy holding a stone on a bare cliff ledge.'
tags:
  - 'living'
  - 'corporeal'
plunder: 3
characteristics:
  str: 11
  con: 11
  dex: 18
  siz: 7
  int: 11
  pow: 11
  cha: 4
characteristicDice:
  str: 3D6
  con: 3D6
  dex: 5D6
  siz: 2D6
  int: 3D6
  pow: 3D6
  cha: 1D6
derived:
  hp: 9
  mwl: 5
  pp: 11
  movement: '15 m ground, 30 m fly'
  combatOrder: 15
  ap: 0
  dm: '+0'
skills:
  - 'Dodge 50%'
  - 'Persistence 25%'
  - 'Resilience 60%'
  - 'Athletics 60%'
  - 'Deception 60%'
  - 'Perception 75%'
  - 'Natural Lore 60%'
  - 'Ranged Combat 40%'
  - 'Unarmed Combat 75%'
attacks:
  - 'Claw — Unarmed Combat 75%, `1D6 + DM`, Medium'
  - 'Dropped Stone — Ranged Combat 40%, `1D6` per full 3 m fallen, maximum `10D6`, Light, directly below'
  - 'Dung — Ranged Combat 40%, no damage, Light, directly below'
talents: 'None'
---

**Dropped Missile:** Choose a target directly below the Harpy, no more than 30 m down. Dropping a stone or dung is a Ranged Combat attack; an aware target may React normally.

**Filth:** A damaging Claw, dung hit, or dung-coated stone exposes the victim to the Shakes. **Type:** Touch. **Delay:** `1D2` days. **Potency:** 50. **Effect:** DEX remains halved while active; lose `1D6` HP after each Delay. **Duration:** Until the victim wins a repeated Resilience-versus-Potency test.

**Stench:** A dung hit gives `-1P` to Influence and Deception until the victim and equipment are washed for one hour. Harpies are immune to disease. Some know Bend·Force/Motion or Alter·Flesh.
