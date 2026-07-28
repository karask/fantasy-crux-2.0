---
type: rule
id: equipment-weapons
chapter: equipment
title: Weapons and Ammunition
slug: weapons
order: 20
summary: 'A weapon lists its damage, minimum STR/DEX, ENC, size, and cost; melee and thrown attacks add DM, while bows, slings, and crossbows do not.'
aliases:
  - close combat weapons
  - ranged weapons
  - ammunition
  - weapon size
---

Use Close Combat for hand-to-hand attacks and Ranged Combat for attacks made at distance. If either STR or DEX is below a weapon's listed minimum, attacks and Parries with it suffer `-1P`; being below both still applies only `-1P`.

Damage Modifier (DM) applies to melee, unarmed, and thrown attacks. Bows, slings, and crossbows use only their listed damage unless a Talent says otherwise.

## Weapon size {#equipment-weapon-size}

Weapons use four sizes: **Light, Medium, Heavy,** and **Huge**. Size determines how much damage a Parry blocks:

| Parrying item compared with the attack |          Damage blocked |
| -------------------------------------- | ----------------------: |
| Same size or larger                    |                     All |
| One size smaller                       |                    Half |
| Two or more sizes smaller              |                    None |
| Critical Parry                         | All, regardless of size |

Unarmed attacks such as punches and kicks are Light. A natural weapon uses the Size in its creature profile, or Medium when none is listed. A thrown weapon uses the Size in the ranged table when Parried.

## Close Combat weapons {#equipment-close-weapons}

| Weapon         | Type            | Damage | STR/DEX | ENC | Size   |   Cost |
| -------------- | --------------- | -----: | ------: | --: | ------ | -----: |
| Arming Sword   | 1H              |    1D8 |     9/9 |   2 | Medium | 150 SP |
| Ball and Chain | 1H              |    1D8 |     9/9 |   2 | Medium | 120 SP |
| Battleaxe      | 1H              |    1D8 |     9/9 |   2 | Medium | 120 SP |
| Club           | Flex            |    1D6 |     5/9 |   1 | Light  |  20 SP |
| Dagger         | 1H/Thrown       |  1D4+1 |       — |   — | Light  |  20 SP |
| Great Axe      | 2H              |    2D8 |    13/5 |   4 | Heavy  | 200 SP |
| Great Hammer   | 2H              |    2D8 |    13/5 |   4 | Heavy  | 200 SP |
| Greatsword     | 2H              |    2D8 |    13/9 |   4 | Heavy  | 300 SP |
| Hatchet        | 1H/Thrown       |    1D6 |     5/9 |   1 | Light  |  20 SP |
| Lance          | Flex/Set        |   1D10 |    11/9 |   3 | Heavy  | 150 SP |
| Longspear      | 2H/Set          |  1D8+1 |     9/5 |   2 | Medium |  30 SP |
| Longsword      | Flex            |    1D8 |   13/11 |   2 | Medium | 250 SP |
| Mace           | Flex            |    1D8 |     9/9 |   2 | Medium | 120 SP |
| Military Flail | 2H              |    2D8 |    13/5 |   4 | Heavy  | 200 SP |
| Polearm        | 2H/Set          |    1D8 |     9/9 |   3 | Heavy  | 200 SP |
| Quarterstaff   | 2H              |    1D8 |     5/9 |   2 | Medium |  20 SP |
| Scimitar       | 1H              |    1D8 |     9/9 |   2 | Medium | 150 SP |
| Shield, small  | 1H              |    1D4 |       — |   1 | Medium |  50 SP |
| Shield, medium | 1H              |    1D6 |     9/— |   2 | Heavy  | 150 SP |
| Shield, large  | 1H              |    1D6 |    13/— |   3 | Huge   | 300 SP |
| Shortspear     | Flex/Set/Thrown |    1D6 |     5/5 |   2 | Medium |  20 SP |
| Shortsword     | 1H              |    1D6 |     5/5 |   1 | Medium | 100 SP |
| Unarmed        | —               |    1D3 |       — |   — | Light  |      — |
| War Hammer     | 1H              |    1D8 |     9/9 |   2 | Medium | 120 SP |

**1H:** Requires one hand. **2H:** Requires two hands. **Flex:** May be used in two hands for +2 damage and a STR requirement 2 lower than listed. **Set:** May be set against a charge using the Combat rules. **Thrown:** May use its ranged profile without an improvised-weapon penalty.

Primitive or improvised versions of listed weapons deal 1 less damage, to a minimum of 1.

## Ranged weapons {#equipment-ranged-weapons}

A target within Range can be attacked normally. A target beyond Range but no farther than twice Range may be attacked at `-2P`; anything farther away cannot be hit.

| Weapon          | Type         | Damage |     Range | STR/DEX | ENC | Size   |   Cost |
| --------------- | ------------ | -----: | --------: | ------: | --: | ------ | -----: |
| Dagger          | Close/Thrown |  1D4+1 |     STR m |     —/9 |   — | Light  |  20 SP |
| Crossbow, heavy | 2H/Missile   |    2D6 |     150 m |     9/9 |   2 | —      | 350 SP |
| Dart            | Thrown       |    1D3 |     STR m |     —/9 |   — | Light  |  15 SP |
| Crossbow, light | 2H/Missile   |    1D8 |     125 m |     5/9 |   1 | —      | 150 SP |
| Hatchet         | Close/Thrown |    1D6 |     STR m |     —/9 |   1 | Light  |  20 SP |
| Improvised rock | Thrown       |    1D4 |     STR m |     5/5 |   1 | Light  |      — |
| Javelin         | Thrown       |    1D6 | STR × 2 m |     5/9 |   1 | Medium |  20 SP |
| Longbow         | 2H/Missile   |   1D10 |     150 m |    13/9 |   1 | —      | 150 SP |
| Shortbow        | 2H/Missile   |    1D8 |      75 m |     9/9 |   1 | —      |  75 SP |
| Shortspear      | Close/Thrown |    1D6 | STR × 2 m |     5/9 |   2 | Medium |  20 SP |
| Sling           | 1H/Missile   |    1D6 |      50 m |     —/9 |   — | —      |   5 SP |
| Whip            | Close        |    1D3 |       5 m |     —/9 |   — | Light  |  50 SP |

**Close:** Within 2 metres, attack with Close Combat and the listed damage. **Thrown:** The ranged attack adds DM. **Missile:** Bows, crossbows, and slings do not add DM. A weapon without Close used within 2 metres is an improvised Light club (`1D6+DM`) and attacks at `-1P`.

A small shield may be strapped to the arm while carrying a 2H ranged weapon, but it cannot attack, Parry, or provide Active Guard until the ranged weapon is no longer being wielded.

## Reloading crossbows {#equipment-crossbow-reload}

- Reloading a light crossbow spends the character's Movement Action and base Reaction.
- Reloading a heavy crossbow consumes the entire round: Combat Action, Movement Action, and all Reactions.

## Ammunition {#equipment-ammunition}

| Ammunition          | ENC | Cost |
| ------------------- | --: | ---: |
| Arrows (10)         |   — | 1 SP |
| Crossbow bolts (10) |   — | 2 SP |
| Sling bullets (10)  |   — | 5 CP |
