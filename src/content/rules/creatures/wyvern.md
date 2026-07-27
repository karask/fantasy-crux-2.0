---
type: creature
id: creatures.wyvern
chapter: creatures
title: 'Wyvern'
slug: wyvern
order: 410
category: monster
summary: 'A lean, two-legged draconic predator armed with jaws, claws, and a venomous tail.'
image: '/assets/images/creatures/wyvern.webp'
image320: '/assets/images/creatures/wyvern-320.webp'
imageAlt: 'A two-legged winged wyvern standing on a rocky mountain shelf.'
tags:
  - 'living'
  - 'corporeal'
plunder: 1
characteristics:
  str: 26
  con: 19
  dex: 13
  siz: 26
  int: 7
  pow: 11
  cha: 6
characteristicDice:
  str: 4D6+12
  con: 2D6+12
  dex: 2D6+6
  siz: 4D6+12
  pow: 3D6
derived:
  hp: 23
  mwl: 12
  pp: 11
  movement: '23 m ground, 30 m fly'
  combatOrder: 10
  ap: '5 scales'
  dm: '+2D6'
skills:
  - 'Dodge 50%'
  - 'Persistence 35%'
  - 'Resilience 50%'
  - 'Athletics 50%'
  - 'Deception 10%'
  - 'Perception 60%'
  - 'Unarmed Combat 60%'
attacks:
  - 'Bite — Unarmed Combat 60%, `1D10 + DM`, Heavy'
  - 'Claw — Unarmed Combat 60%, `1D6 + DM`, Heavy'
  - 'Sting — Unarmed Combat 60%, `1D6 + DM`, Heavy'
attackNotes:
  - 'a damaging Sting injects venom'
talents: 'None'
---

**Bite/Claw/Sting 3 (Multiattack):** Make all three attacks; Bite is normal, while Claw and Sting each suffer `-1P` under Multiattack.

**Wyvern Venom:** **Type:** Injected. **Delay:** `1D2` rounds. **Potency:** 60. **Effect:** `1D6` HP and `-4 CON`. **Duration:** `6D10` minutes.
