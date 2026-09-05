---
type: creature
id: creatures.vampire
chapter: creatures
title: 'Vampire'
slug: vampire
order: 560
category: undead
summary: 'An intelligent undead predator sustained by stolen blood and life force.'
image: '/assets/images/creatures/vampire.webp'
image320: '/assets/images/creatures/vampire-320.webp'
imageAlt: 'A pale armored vampire carrying a sword and round shield in a stone hall.'
tags:
  - 'corporeal'
  - 'undead'
  - 'soulless'
plunder: 4
characteristics:
  str: 23
  con: 23
  dex: 11
  siz: 13
  int: 13
  pow: 0
  cha: 11
characteristicDice:
  str: 3D6+12
  con: 3D6+12
  dex: 3D6
  siz: 2D6+6
  int: 2D6+6
  cha: 3D6
derived:
  hp: 18
  mwl: 9
  pp: 0
  movement: '15 m'
  combatOrder: '5 in chainmail or 3 in platemail'
  ap: '5/6'
  dm: '+1D6'
derivedNotes:
  - 'Blood Reserve 0/18'
skills:
  - 'Close Combat 50%'
  - 'Unarmed Combat 60%'
  - 'Dodge 40%'
  - 'Persistence 80%'
  - 'Resilience 80%'
  - 'Culture (Local) 80%'
  - 'Athletics 50%'
  - 'Deception 80%'
  - 'Perception 80%'
attacks:
  - 'Arming Sword — Close Combat 50%, `1D8 + 1D6`, Medium'
  - 'Medium Shield — Close Combat 50%, `1D6 + 1D6`, Heavy'
  - 'Bite — Unarmed Combat 60%, `1D6 + 1D6`, Medium'
talents: 'None'
---

**Night Vision:** Natural surface night counts as Illuminated. It does not overcome sealed, underground, or supernatural darkness or obscurity.

**Blind Sight (life):** Detects living beings regardless of illumination. Walls and complete solid cover block it; it grants no colour, writing, fine visual detail, or eye contact.

**Blood Reserve:** Maximum 18, current 0. Use current Reserve as PP and maximum Reserve instead of POW for the active Shaping limit. It pays costs, Counter, rituals, and commitments, but never recovers naturally; 0 does not incapacitate the Vampire. It also recovers no HP naturally.

**Clinging Bite:** If Bite deals HP damage, establish a grapple with that target without another Action or test.

**Drain:** While grappling a Living target, spend a Combat Action and roll `1D6`. If the target began above 0 PP, drain actual PP up to its current PP; only if it began at 0 PP, drain HP instead. Drain ignores AP and never spills from PP to HP. Allocate the actual amount between Vampire HP and Blood Reserve within their maxima; excess is lost.

**Mist Form:** Spend a Combat Action to become mist with carried nonliving equipment. It is immune to mundane physical attacks and can only use its Movement Action or a Combat Action to reform. Magic and sunlight work normally.

**Death Mist:** At 0 HP, the Vampire is disabled until the start of its next turn, then enters Mist Form at 1 HP. Before then, an adjacent creature can spend a full round to stake and decapitate it, destroying it permanently.

**Sunlight:** Direct natural sunlight deals 2 HP at each round's end, ignoring AP; complete opaque covering prevents exposure.

**Holy Aversion:** Choose a sacred symbol. Presenting it within sight spends a Combat Action and opposes the bearer's Persistence with the Vampire's Resilience. If the bearer wins, the Vampire loses `1D4` HP ignoring AP and cannot attack the bearer until the bearer's next turn while the symbol remains visible.

Individual Vampires may learn Shaping cells and pay for them from Blood Reserve.
