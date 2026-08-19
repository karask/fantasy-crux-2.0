---
type: creature
id: creatures.elemental
chapter: creatures
title: 'Elemental'
slug: elemental
order: 230
category: monster
summary: 'Raw elemental substance embodied as water, darkness, flame, stone, or storm.'
image: '/assets/images/creatures/elemental.webp'
image320: '/assets/images/creatures/elemental-320.webp'
imageAlt: 'A stone elemental formed from interlocking rock slabs.'
tags:
  - 'corporeal'
  - 'elemental'
  - 'soulless'
  - 'mindless'
plunder: 0
characteristics:
  str: '—'
  con: '—'
  dex: '—'
  siz: 'by rank'
  int: '—'
  pow: '—'
  cha: '—'
derived: 'Use the rank table; Combat Order 10 is an explicit profile value because Elementals have no DEX or INT'
skills:
  - 'Perception 80%'
  - 'Deception 80% while merged with a substantial quantity of its own element'
  - 'rank-table combat skills'
attacks:
  - 'Engulf — Attack by rank, rank damage, every other creature within the listed radius'
attackNotes:
  - 'subtype sets resistance and damage kind'
talents: 'Small: Exceptional Skill (Dodge) I. Large: Exceptional Skill (Attack) I. Huge: Exceptional Skill (Persistence) I. Medium: none'
---

| Rank   | SIZ |  HP | MWL |  PP | Move |  CO |  AP | DM  | Damage | Area | Attack | Dodge | Persistence | Resilience |
| ------ | --: | --: | --: | --: | ---: | --: | --: | :-: | -----: | ---: | -----: | ----: | ----------: | ---------: |
| Small  |   3 |   3 |   2 |   0 | 15 m |  10 |   0 |  —  |  `1D6` |  1 m |    15% |  100% |         30% |       100% |
| Medium |   9 |   9 |   5 |   0 | 23 m |  10 |   0 |  —  |  `2D6` |  3 m |    45% |   90% |         60% |       100% |
| Large  |  21 |  21 |  11 |   0 | 30 m |  10 |   0 |  —  |  `3D6` |  7 m |   100% |   60% |         90% |       100% |
| Huge   |  50 |  50 |  25 |   0 | 45 m |  10 |   0 |  —  |  `4D6` | 16 m |      — |   30% |        100% |       100% |

**Engulf:** Spend one Combat Action, centred on the Elemental; complete barriers block it. Roll damage once. Small through Large roll Attack once, which must succeed and win against each target's listed resistance separately.

**Overwhelming Engulf:** Huge rolls no Attack. Critical resistance negates damage, Success takes half, and Failure or Fumble takes full damage.

- **Undine — Drown:** Resilience; HP damage; ignores AP.
- **Shade — Fear:** Persistence; PP damage; ignores AP; normal 0-PP unconsciousness applies.
- **Salamander — Burn:** Resilience; HP damage; AP applies.
- **Gnome — Crush:** Resilience; HP damage; AP applies.
- **Sylph — Buffet:** Resilience; HP damage; AP applies.

**Elemental Nature:** Immune to poison, disease, and its own element.

**Elemental Sense:** Perception 80% detects invisible, Spirit, and magical targets regardless of light or invisibility; a solid barrier blocks it. Ordinary darkness still affects ordinary, nonmagical targets. Oppose concealment with Deception.

**Camouflage:** Deception 80% while merged with matching water, fire, stone, darkness, or cloud.
