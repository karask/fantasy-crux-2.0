# ADR-022: Remove characteristic modification from Shaping

## Status

Accepted

## Date

2026-09-06

## Context

Temporary characteristic modifiers did not recalculate attributes or derived
values. Their remaining direct uses were too narrow and uneven to justify a
general Shaping outcome.

## Decision

Remove numeric characteristic modification from the Shaping effects catalogue.
Use the existing benchmarks for the practical outcome a Shaping produces.

## Consequences

- Shaping no longer increases or decreases STR, CON, DEX, SIZ, INT, POW, or
  CHA numerically.
- Skill modifiers, protection, movement, senses, adaptations, conditions, and
  transformations continue to price their own outcomes.
