---
type: creature
id: creatures.ghoul
chapter: creatures
title: 'Ghoul'
slug: ghoul
order: 530
category: undead
summary: 'An intelligent corpse-eater driven by endless hunger.'
tags:
  - 'corporeal'
  - 'undead'
  - 'soulless'
plunder: 1
characteristics:
  str: 14
  con: 11
  dex: 11
  siz: 13
  int: 11
  pow: 11
  cha: 4
characteristicDice:
  str: 4D6
  con: 3D6
  dex: 3D6
  siz: 2D6+6
  int: 3D6
  pow: 3D6
  cha: 1D6
derived:
  hp: 12
  mwl: 6
  pp: 11
  movement: '15 m'
  combatOrder: 11
  ap: 0
  dm: '+1D4'
skills:
  - 'Unarmed Combat 60%'
  - 'Dodge 40%'
  - 'Persistence 30%'
  - 'Resilience 40%'
  - 'Lore (Undead) 75%'
  - 'Athletics 40%'
  - 'Deception 60%'
  - 'Perception 30%'
attacks:
  - 'Claw — Unarmed Combat 60%, `1D4 + DM`, Medium'
  - 'Bite — Unarmed Combat 60%, `1D6 + DM`, Medium'
attackNotes:
  - 'a damaging Bite exposes the target to Ghoul Venom'
talents: 'None'
---

**Ghoul Howl:** Freely at the start of its turn, affect every Living listener within 11 m. A howl remains audible until the Ghoul's next turn. Oppose the highest-Persistence audible Ghoul with each listener's Persistence. Defeat gives `-1P` on attacks and Reactions while any howl is audible; victory grants immunity for this combat. A listener tests once per round and multiple howls do not stack. The Ghoul retains its normal actions.

**Ghoul Venom:** **Type:** Injected, ingested, or smeared. **Delay:** `1D3` rounds. **Potency:** 22. **Effect:** Paralysed. **Duration:** `1D10` hours or until healing restores at least 1 HP.
