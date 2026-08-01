---
type: creature
id: creatures.basilisk
chapter: creatures
title: 'Basilisk'
slug: basilisk
order: 190
category: monster
summary: 'A small, many-coloured reptile created by foul alchemy; its eyes and blood are deadlier than its jaws.'
image: '/assets/images/creatures/basilisk.webp'
image320: '/assets/images/creatures/basilisk-320.webp'
imageAlt: 'A brightly colored alchemical basilisk standing on flagstones.'
tags:
  - 'living'
  - 'corporeal'
plunder: 5
characteristics:
  str: 4
  con: 13
  dex: 11
  siz: 2
  int: 3
  pow: 16
  cha: 3
characteristicDice:
  str: 2D3
  con: 2D6+6
  dex: 3D6
  siz: 1D3
  pow: 1D6+12
derived:
  hp: 8
  mwl: 4
  pp: 16
  movement: '15 m'
  combatOrder: 7
  ap: '2 scales'
  dm: '-1D6'
skills:
  - 'Dodge 40%'
  - 'Persistence 50%'
  - 'Resilience 70%'
  - 'Athletics 65%'
  - 'Deception 40%'
  - 'Natural Lore 40%'
  - 'Unarmed Combat 35%'
attacks:
  - 'Bite — Unarmed Combat 35%, `1D6 - 1D6`, Light'
attackNotes:
  - 'a damaging hit injects Basilisk Venom'
talents: 'None'
---

**Death Gaze:** Once per turn, freely choose a creature within 16 m that can see the basilisk's eyes. It may avert its gaze, preventing the Gaze; without suitable Blind Sight it then cannot attack or React against the basilisk until its next turn. If it does not avert, oppose the basilisk's Persistence with Resilience. Defeat reduces it to 0 HP and makes it Dying, subject to its type rules; victory grants immunity for this combat. Eye contact must be mutual and Blind Sight never triggers the Gaze. The basilisk may still Bite.

**Basilisk Venom:** **Type:** Injected or contact. **Delay:** Immediate. **Potency:** 65. **Effect:** `-6 CON` for the Duration and `1D4` HP at each minute's end; CON 0 causes death. **Duration:** `6D10` minutes.

**Corrosive Blood:** A mundane weapon that deals HP damage to the basilisk is destroyed after `1D4` rounds. Before the end of the wielder's next turn, a Combat Action with abundant water or a suitable neutraliser prevents this.
