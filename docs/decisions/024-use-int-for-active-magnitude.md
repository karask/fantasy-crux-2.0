# ADR-024: Use INT for Active Magnitude

## Status

Accepted

## Date

2026-09-07

## Context

INT and POW both contribute to the initial `INT + POW` Shaping skill. POW also
set maximum PP, PP recovery, Active Magnitude, and Enchantment Capacity. For two
Shapers with the same skill base, moving characteristic points from INT to POW
therefore improved magical endurance and sustained capacity at no direct cost
to casting ability. INT had no continuing role after the skill was established.

## Decision

Active Magnitude cannot exceed permanent, unmodified INT. INT represents how
much ongoing magical complexity a Shaper can keep organised. POW continues to
set maximum PP and PP recovery, while `INT + POW` establishes the Shaping skill.

Temporary changes to INT do not alter Active Magnitude. Permanent changes
recalculate the limit but do not recalculate the existing Shaping skill, under
the ordinary characteristic-improvement rule.

Enchantment Capacity remains permanent, unmodified POW. PP commitment and
ordinary casting costs also remain POW-based resources.

## Consequences

- Shapers with the same `INT + POW` can favour sustained complexity through INT
  or casting endurance through POW.
- The change redistributes an existing limit rather than increasing Shaping's
  total power.
- Raising INT after becoming a Shaper increases Active Magnitude without
  changing the Shaping skill.
- Current Shaper examples and generated character material use INT when stating
  an active limit.
