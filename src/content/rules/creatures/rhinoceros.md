---
type: creature
id: creatures.rhinoceros
chapter: creatures
title: 'Rhinoceros'
slug: rhinoceros
order: 150
category: animal
summary: 'A thick-skinned herbivore whose charge can tear through a battle line.'
tags:
  - 'living'
  - 'corporeal'
plunder: 0
characteristics:
  str: 26
  con: 11
  dex: 7
  siz: 26
  int: 3
  pow: 11
  cha: 3
characteristicDice:
  str: 2D6+21
  con: 3D6
  dex: 2D6
  siz: 2D6+21
  pow: 3D6
derived:
  hp: 19
  mwl: 10
  pp: 11
  movement: '23 m'
  combatOrder: 5
  ap: '5 hide'
  dm: '+2D6'
skills:
  - 'Dodge 21%'
  - 'Persistence 33%'
  - 'Resilience 33%'
  - 'Unarmed Combat 50%'
attacks:
  - 'Bite — Unarmed Combat 50%, `1D6 + DM`, Heavy'
  - 'Gore — Unarmed Combat 50%, `1D8 + DM`, Heavy'
  - 'Trample — Unarmed Combat 50%, `1D12 + DM`, Heavy'
talents: 'None'
---

**Horn Charge:** Use Gore for a normal Charge attack and add the Charge's `+1D6` damage.
