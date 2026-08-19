# ADR-010: Choose Bonus and Penalty dice by outcome

## Status

Accepted

## Date

2026-08-19

## Context

The original procedure told a player to keep the lowest complete D100 result for Bonus dice
and the highest for Penalty dice. That shortcut works when only success or failure matters,
but it conflicts with opposed tests. Within the same Critical or Success grade, the higher
roll wins an opposed test; within the same Failure or Fumble grade, the lower roll wins.
Consequently, the numeric shortcut could make a Bonus die choose the worse opposed result
or a Penalty die choose the better one.

The rule's intent is simpler than the shortcut: a Bonus die must always help the roller and
a Penalty die must always hinder them.

## Decision

Grade every candidate D100 result before choosing one. From best to worst, the grades are
**Critical, Success, Failure, and Fumble**. Within Critical or Success, the higher roll is
better; within Failure or Fumble, the lower roll is better. Bonus dice keep the best
candidate and Penalty dice keep the worst.

Candidate selection happens before participants compare opposed results. Base skill and
defender or status-quo tiebreakers compare participants only; they never select one roller's
candidate. The executable rules contract uses the same comparator for candidate selection
and opposed tests.

## Consequences

Bonus dice can no longer worsen a result, and Penalty dice can no longer improve one. The
chance of each result grade on an unopposed test is unchanged; only which number is retained
within a shared grade changes. That change matters in opposed tests because the retained
number can decide the contest.

The number of extra tens dice, cancellation, the `+3B` and `-3P` cap, critical ranges, and
fumble ranges do not change. `00` remains 100 and therefore remains a Fumble even at 100%
skill.

## Alternatives considered

### Keep lowest for Bonus and highest for Penalty

This is quicker to state, but it sometimes reverses the advertised effect in an opposed
test.

### Compare result grades only

Choosing arbitrarily when candidates share a grade preserves success probabilities but
still allows a Bonus die to keep the worse opposed result.

### Change opposed tests so lower is always better

That would preserve the numeric shortcut, but it would rewrite the established meaning of
same-grade opposed results throughout combat, resistance, and Shaping.
