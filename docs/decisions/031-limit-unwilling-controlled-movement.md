# ADR-031: Limit unwilling controlled movement to 3 metres per round

## Status

Accepted

## Date

2026-10-12

## Context

Active control lets a Shaper direct another subject's granted movement mode at
that subject's normal Movement. An unwilling target given magical flight could
be lifted 15 metres per round and released, so two rounds produced a 30-metre
fall: `10D6` damage that ignores armour, from a Magnitude 5 Shaping. Height,
not Intensity, set the damage.

Pushing a foe into an existing hazard such as lava or over a cliff edge remains
a legitimate natural consequence.

## Decision

An unwilling subject under active control moves at most 3 metres per round, in
any direction. This matches the Intensity 2 forced-movement benchmark. Active
control still costs the Shaper's Combat Action each round and ends on a failed
Persistence test after damage or serious distraction. The subject may retry its
defence each round under the ordinary ongoing-condition rule.

## Consequences

- Building a lethal height takes several rounds, during which allies can
  interrupt the Shaper and the target gets repeated escape attempts.
- Falling damage itself is unchanged.
- Shoves into existing hazards remain natural consequences.
