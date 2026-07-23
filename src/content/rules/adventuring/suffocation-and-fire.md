---
type: rule
id: adventuring-suffocation-fire
chapter: adventuring
title: Suffocation and Fire
slug: suffocation-and-fire
order: 70
summary: 'After CON rounds without air, test Resilience each round; the first failure deals immediate suffocation damage, which repeats until breathable air returns.'
aliases:
  - drowning
  - smoke
  - burning
  - heat
quickReference:
  group: adventuring
  order: 70
---

## Suffocation {#adventuring-suffocation}

A character can hold their breath for CON Combat Rounds. After that, make a Resilience test each round with a cumulative `-1P`, subject to the normal `-3P` cap.

On the first failure, the character inhales the substance and immediately suffers its effect. Apply that effect again at the end of every following round until the character reaches breathable air; do not make further breath tests. Armour does not reduce this damage.

| Inhaled substance | Effect per round                                                    |
| ----------------- | ------------------------------------------------------------------- |
| Water             | `2D6` damage                                                        |
| Vacuum            | `2D6` damage                                                        |
| Thick smoke       | `1D6` damage                                                        |
| Poison gas        | Exposure to the poison; also `1D6` damage if the gas is thick smoke |

After reaching breathable air, make a Resilience test. On a failure, the character can only retch or gasp for `1D4` rounds.

## Fire and heat {#adventuring-fire-heat}

Apply damage each round of direct exposure. Metal armour does not reduce fire or heat damage; other protection applies only when it plausibly insulates against the source.

[Created magical hazards](/rules/magic/ongoing-and-magical-actions/#magic-created-hazards) use their fixed Shaping damage until they become mundane hazards.

| Intensity   | Example                               | Damage per round |
| ----------- | ------------------------------------- | ---------------: |
| Flame       | Candle                                |                1 |
| Large flame | Torch                                 |              1D4 |
| Small fire  | Campfire                              |              1D6 |
| Large fire  | Scalding steam, bonfire, burning room |              2D6 |
| Inferno     | Lava, blast furnace                   |              3D6 |
