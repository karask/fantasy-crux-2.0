---
type: creature
id: creatures.viper
chapter: creatures
title: 'Viper'
slug: viper
order: 170
category: animal
summary: 'A fast venomous snake whose bite can bring down much larger prey.'
image: '/assets/images/creatures/viper.webp'
image320: '/assets/images/creatures/viper-320.webp'
imageAlt: 'A patterned viper resting in a compact coil on a rock.'
tags:
  - 'living'
  - 'corporeal'
plunder: 0
characteristics:
  str: 13
  con: 6
  dex: 27
  siz: 7
  int: 3
  pow: 13
  cha: 3
characteristicDice:
  str: 2D6+6
  con: 2D6
  dex: 3D6+18
  siz: 2D6
  pow: 2D6+6
derived:
  hp: 7
  mwl: 4
  pp: 13
  movement: '30 m'
  combatOrder: 15
  ap: '1 scales'
  dm: '+0'
skills:
  - 'Dodge 81%'
  - 'Persistence 39%'
  - 'Resilience 18%'
  - 'Unarmed Combat 60%'
attacks:
  - 'Bite — Unarmed Combat 60%, `1D6 + 0`, Medium'
talents: 'None'
---

**Viper Venom:** A Bite dealing HP damage exposes the target. **Type:** Injected. **Delay:** 1 round. **Potency:** 48. **Effect:** `-3 CON` for the Duration and `1D4` HP at each minute's end; CON 0 causes death. **Duration:** `6D10` minutes.
