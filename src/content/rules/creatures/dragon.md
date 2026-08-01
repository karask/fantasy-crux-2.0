---
type: creature
id: creatures.dragon
chapter: creatures
title: 'Dragon'
slug: dragon
order: 210
category: monster
summary: 'An ancient, intelligent flying reptile whose magic and temperament vary widely.'
image: '/assets/images/creatures/dragon.webp'
image320: '/assets/images/creatures/dragon-320.webp'
imageAlt: 'A four-legged, two-winged dragon standing on a rocky upland.'
tags:
  - 'living'
  - 'corporeal'
plunder: 5
characteristics:
  str: 70
  con: 35
  dex: 14
  siz: 65
  int: 21
  pow: 26
  cha: 21
characteristicDice:
  str: 20D6
  con: 10D6
  dex: 4D6
  siz: 10D6+30
  int: 6D6
  pow: 4D6+12
  cha: 6D6
derived:
  hp: 50
  mwl: 25
  pp: 26
  movement: '30 m ground, 45 m fly'
  combatOrder: 18
  ap: '12 scales'
  dm: '+7D6'
skills:
  - 'Dodge 30%'
  - 'Persistence 100%'
  - 'Resilience 100%'
  - 'Athletics 100%'
  - 'Influence 100%'
  - 'Perception 100%'
  - 'Culture (Local) 100%'
  - 'Natural Lore 100%'
  - 'Unarmed Combat 100%'
attacks:
  - 'Bite — Unarmed Combat 100%, `1D10 + 7D6`, Huge'
  - 'Claw — Unarmed Combat 100%, `1D8 + 7D6`, Huge'
  - 'Tail — Unarmed Combat 100%, `1D20 + 7D6`, Huge'
talents: 'Mastery (Persistence) III; Mastery (Influence) II; Mastery (Resilience) I; Mastery (Athletics) I; Mastery (Perception) I; Mastery (Unarmed Combat) I'
---

**Double Claw 2 (Multiattack):** Make two Claw attacks. Mastery (Unarmed Combat) I normally removes the second attack's `-1P`.

**Breathe Flame:** Spend a Combat Action. A 26 m cone, 26 m wide at its end, deals `4D6` fire damage; roll once. An aware target may use its base Reaction to Dodge at `-1P`: success halves damage; failure takes full damage. AP applies. Afterward, another use within one hour requires Resilience, at cumulative `-1P` for each attempt that hour.

**Fire Resistance:** Reduce fire damage by 12 after other reductions.

Ancient dragons may know potent cells such as Conjure·Fire, Bend·Fire, Ward·Fire, or Scry·Fate.
