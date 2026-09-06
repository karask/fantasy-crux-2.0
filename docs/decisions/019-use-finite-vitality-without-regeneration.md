# ADR-019: Use finite vitality without regeneration

## Status

Accepted

## Date

2026-09-06

## Context

Shaping could heal and grant repeatable Ward AP but had no way to represent the
protective function of temporary Hit Points. Directly changing maximum HP would
also change Major Wound Level, complicate expiry, and blur temporary magic with
advancement. Allowing Duration to repeat healing would create effectively
unlimited recovery and contradict the existing one-use outcome rule.

## Decision

A vitality-reserve outcome grants `3 × Intensity` points of finite magical
protection. It absorbs qualifying HP damage after other protection but before
actual HP, changes neither maximum HP nor Major Wound Level, cannot be healed or
replenished, and persists across damage instances until depleted. Only damage
that passes the reserve and reaches actual HP counts toward a Major Wound.

A subject can retain only one reserve: keep the reserve with more remaining
points, with the subject choosing on a tie. A reserve absorbs damage, not PP
damage, an HP cost or sacrifice, or HP loss that is not damage. Enchanted
reserves must use Activated or Charged operation rather than Continuous
operation.

Do not add regeneration to Shaping. Duration cannot distribute healing across
later turns, restore HP repeatedly, or create healing for future injuries.
Explicit creature-profile abilities remain outside this benchmark.

## Consequences

- Temporary durability never recalculates a character's derived values or
  injures them when it expires.
- Ward AP remains repeatable protection, while vitality is a finite pool.
- Continuous items cannot turn one reserve into unlimited protection.
- Future-injury healing and regeneration remain intentionally unsupported.
