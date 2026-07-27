---
type: rule
id: gm-tools.ships-and-sailing
chapter: gm-tools
title: Ships and Sailing
slug: ships-and-sailing
order: 20
summary: Ships are rated by crew, speed, structure, and cargo; the captain's Sailing skill drives travel, storms, and every naval manoeuvre.
aliases:
  - naval combat
  - boarding
  - sea travel
  - structure points
---

## Ship types {#gm-ship-types}

There are three broad classes of sailing ship: **sloops**, small and fast but fragile with one mast; **brigs**, fast and manoeuvrable with two; and **ships** proper, cargo vessels or warships with three masts or more.

| Type of ship | Crew | Cost (SP) | Manoeuvrability | Speed | Structure | Cargo   |
| ------------ | ---: | --------: | --------------: | ----: | --------: | ------- |
| One-masted   |   10 |     5,000 |           `+1B` |     6 |        20 | 8 tons  |
| Two-masted   |   20 |    15,000 |               — |     5 |        40 | 15 tons |
| Three-masted |   30 |    50,000 |           `-1P` |     4 |        60 | 30 tons |

Speed is in knots. Manoeuvrability applies to every Sailing test made aboard.

Ship weapons are abstract: many shots are loosed for each roll, so a vessel's armament is a single percentage chance to hit. A hit deals `1D8` damage to the target's structure points. Every 10% of weapons costs two tons of cargo and needs two more crew, and armament cannot exceed 100%.

## Special features {#gm-ship-features}

Every ship has one special feature. A ship may carry more than one; each additional feature adds 50% of the original cost.

- **Armoured:** 2 AP against every attack.
- **Fast:** add one knot to speed.
- **Heavy weapons:** hits deal `1D12` rather than `1D8`.
- **High capacity:** increase cargo by 40%.
- **Manoeuvrable:** improve manoeuvrability by one step, to a maximum of `+1B`.
- **Marines:** the ship can carry and quarter marines equal to its crew.
- **Ram:** the ship rams without suffering damage in return.
- **Reduced crew:** halve the crew needed to run the ship.

## Sailing tests {#gm-sailing-tests}

Manoeuvres are governed by the captain's Sailing skill, modified by the vessel's manoeuvrability and by the crew's average Sailing skill.

| Average crew Sailing | Modifier |
| -------------------- | -------: |
| 25% or less, no idea |    `-1P` |
| 26–50%, competent    |        — |
| 51–75%, veteran      |    `+1B` |
| 76% or more, expert  |    `+2B` |

## Travel and storms {#gm-sea-travel}

In normal conditions a vessel covers 20 miles per day for each knot of speed. Listed speeds are averages. A strong favourable wind, perhaps magically arranged, can double them, as can a rowing crew whose Sailing test is a Critical. Becalmed with no wind at all, a ship does not move.

Each day out of sight of land carries a 5% chance of a storm. A storm deals `2D6` structure points. A ship at 0 structure points begins to sink, and one reduced past the negative of its original total sinks almost at once. Sailors on deck must Dodge to stay aboard; anyone swept overboard and not immediately recovered must make an Athletics test to survive.

The captain may make a Sailing test to halve a storm's damage. Better still, a storm detected in time can be sailed around.

## Naval combat {#gm-naval-combat}

Ships hold one of two distances.

**Contact.** The vessels can see one another. If both want to close or both want to part, it happens automatically and takes about an hour. If they want different things, roll opposed Sailing tests.

**Combat range.** Combat runs as it does on land, except that Combat Order belongs to the ship rather than the crew: the faster vessel acts first. One test fires a ship's weapons, and no defence is rolled against it. A character appointed weapons officer may make a Ranged Combat test; on a success the ship's attack gains `+1B`.

Hand weapons are too small to trouble a hull, though they reach anyone on deck. Fire is the exception, and takes hold in sails and decking.

## Manoeuvres {#gm-naval-manoeuvres}

One manoeuvre per round, each requiring a Sailing test from the captain.

- **Broadside:** on a success, fire the ship's weapons twice instead of once.
- **Evade:** on a success, the opponent cannot broadside, ram, or board. The vessel may also break to contact range if the other allows it or the opposed Sailing test succeeds.
- **Ram:** on a successful opposed Sailing test, deal `1D6` damage per mast. A ship without a ram takes half that damage itself.
- **Board:** on a successful opposed Sailing test the vessels are roped together and boarding begins. A successful ram grants an immediate free boarding attempt, and if both crews want to board it happens automatically.
