# ADR-013: Give every skill above 0% a minimum critical range of 01

## Status

Accepted

## Date

2026-08-20

## Context

The critical range was the skill's integer tens digit alone, so skills of 1–9% could never critically succeed. The designer chose to guarantee some chance of an exceptional result on any possible test: a roll of `01` should always be special for a character who can succeed at all.

## Decision

The critical range is `01` through the skill's integer tens digit, with a minimum of `01` for any skill above 0%. A 0% skill still has no critical range. Fumbles are unchanged.

The rule is stated in Start Here, Basic skill tests, and Critical Hits and Fumbles; `criticalCeiling` in `src/lib/rules-contract.mjs`, its locked tests, and the Talent audit's grade model implement it.

## Consequences

- Only skills of 1–9% change: they gain a 1% critical chance, and a roll of `01` at those skills was already a success.
- Every published probability table is unaffected, because the audit's calibration skills of 25% and above already had a tens digit of at least 2.
- This supersedes the tens-digit-only wording wherever earlier records state it.
