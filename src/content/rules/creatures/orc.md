---
type: creature
id: creatures.orc
chapter: creatures
title: 'Orc'
slug: orc
order: 370
category: monster
summary: 'Tall, powerfully built people found in settled communities and travelling clans alike; their loyalties, ambitions, and temperaments vary as widely as those of humans.'
image: '/assets/images/creatures/orc.webp'
image320: '/assets/images/creatures/orc-320.webp'
imageAlt: 'An orc fighter advancing through ruined streets behind a round shield.'
tags:
  - 'living'
  - 'corporeal'
plunder: 2
characteristics:
  str: 14
  con: 11
  dex: 12
  siz: 14
  int: 10
  pow: 10
  cha: 11
characteristicDice:
  str: 4D6
  con: 3D6
  dex: 4D6 drop lowest
  siz: 3D6+3
  int: 2D6+3
  pow: 2D6+3
  cha: 3D6
derived:
  hp: 13
  mwl: 7
  pp: 10
  movement: '15 m'
  combatOrder: 8
  ap: '2 leather'
  dm: '+1D4'
skills:
  - 'Dodge 35%'
  - 'Persistence 35%'
  - 'Resilience 35%'
  - 'Athletics 35%'
  - 'Deception 45%'
  - 'Perception 45%'
  - 'Craft 40%'
  - 'Close Combat 40%'
  - 'Ranged Combat 50%'
attacks:
  - 'Scimitar — Close Combat 40%, `1D8 + 1D4`, Medium'
  - 'Medium Shield — Close Combat 40%, `1D6 + 1D4`, Heavy'
  - 'Shortbow — Ranged Combat 50%, `1D8`, 75 m'
talents: 'None'
---

**Adrenaline Surge:** Once per combat, immediately after becoming Wounded or Fatigued, the Orc ignores the test, Movement, and Combat Order penalties caused by Wounded and Fatigued until the end of their next turn. They also ignore the first 1 HP they would lose from Bleeding during that time. Bleeding is not removed and continues normally afterwards. Exhausted, unconscious, and Dying are unaffected.

Individual Orcs may learn any appropriate Shaping cells.
