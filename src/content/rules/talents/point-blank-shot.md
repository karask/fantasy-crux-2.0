---
type: talent
id: talent.point-blank-shot
chapter: talents
title: Point-Blank Shot
slug: point-blank-shot
order: 175
summary: Ignore the engagement penalty from one enemy when making a ranged attack at Close range.
aliases:
  - shoot in melee
  - close range shot
cost: 3
prerequisites: Ranged Combat 51%
activation: passive
tags:
  - ranged
  - offence
---

## Effect

At the time of each attack, let N be the number of enemies engaging you. Before ordinary cancellation and the final cap, those N enemies impose `-2P × max(0, N − 1)`: ignore one enemy's entire `-2P`, while every additional enemy still applies `-2P`.

Nothing else changes: cover, movement, and every other situational Penalty die apply normally.
