---
type: creature
id: creatures.troll
chapter: creatures
title: 'Troll'
slug: troll
order: 390
category: monster
summary: 'A large, solitary predator whose body repairs wounds with terrifying speed.'
image: '/assets/images/creatures/troll.webp'
image320: '/assets/images/creatures/troll-320.webp'
imageAlt: 'A long-armed troll carrying a wooden club in a rocky ravine.'
tags:
  - 'living'
  - 'corporeal'
plunder: 1
characteristics:
  str: 26
  con: 20
  dex: 7
  siz: 26
  int: 6
  pow: 11
  cha: 7
characteristicDice:
  str: 4D6+12
  con: 3D6+9
  dex: 2D6
  siz: 4D6+12
  int: 1D6+3
  pow: 3D6
  cha: 2D6
derived:
  hp: 23
  mwl: 12
  pp: 11
  movement: '23 m'
  combatOrder: 7
  ap: '3 hide'
  dm: '+2D6'
skills:
  - 'Dodge 25%'
  - 'Persistence 25%'
  - 'Resilience 60%'
  - 'Athletics 20%'
  - 'Deception 20%'
  - 'Perception 20%'
  - 'Natural Lore 40%'
  - 'Close Combat 40%'
  - 'Unarmed Combat 40%'
attacks:
  - 'Club — Close Combat 40%, `1D6 + DM`, Light'
  - 'Claw — Unarmed Combat 40%, `1D6 + DM`, Heavy'
talents: 'None'
---

**Regeneration:** At the start of its turn, even at 0 HP, recover `1D6` HP unless it has taken fire damage since the start of its previous turn. This bypasses Wounded's recovery lock and removes Bleeding and Dying; Wounded remains. If HP rises above 0, the Troll wakes and may act that turn.

**Blind Sight (heat):** Thermoception perceives heat-contrasting targets regardless of illumination. Solid barriers, heavy insulation, and ambient-temperature targets defeat it.
