---
type: creature
id: creatures.giant-spider
chapter: creatures
title: 'Giant Spider'
slug: giant-spider
order: 160
category: animal
summary: 'A horse-sized ambush predator that traps prey in venomous webs.'
tags:
  - 'living'
  - 'corporeal'
plunder: 0
characteristics:
  str: 19
  con: 17
  dex: 16
  siz: 26
  int: 8
  pow: 11
  cha: 2
derived:
  hp: 22
  mwl: 11
  pp: 11
  movement: '15 m ground, 23 m on web'
  combatOrder: 12
  ap: '4 chitin'
  dm: '+1D6'
skills:
  - 'Dodge 48%'
  - 'Persistence 33%'
  - 'Resilience 51%'
  - 'Unarmed Combat 50%'
attacks:
  - 'Bite — Unarmed Combat 50%, `1D6 + DM`, Heavy'
  - 'Web — Unarmed Combat 50%, no damage, Heavy, 15 m'
talents: 'None'
---

**Web:** Spend a Combat Action and oppose Unarmed Combat against the Athletics of one target within 15 m. If the spider wins, the target cannot take Movement Actions and suffers `-1P` on physical tests until the web is destroyed. Each web has 22 HP and 0 AP.

**Giant Spider Venom:** A Bite dealing HP damage exposes the target. **Type:** Injected. **Delay:** `1D3` rounds. **Potency:** 51. **Effect:** `-6 DEX` for the Duration and `1D3` HP at each minute's end; DEX 0 causes paralysis. **Duration:** `6D10` minutes.
