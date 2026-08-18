# ADR-008: Replace copy ceilings with editorial review

## Status

Accepted

## Date

2026-08-18

## Context

Earlier publication decisions assigned fixed word budgets to core rules, the
bestiary, and Gamemaster tools. A unit test enforced those totals and therefore
could block the production build and GitHub Pages deployment.

The limits encouraged concise copy, but they could not distinguish repetition
from a necessary clarification. As the rules approached a ceiling, adding one
missing procedure required unrelated cuts or another arbitrary increase. Word
count measured length, not usefulness at the table.

## Decision

Remove automated word and character ceilings from the content contract. No
fixed total applies to a chapter, the core rules, or a reference section. This
supersedes only the numeric budget clauses in ADR-002 through ADR-005; their
other decisions remain accepted.

Conciseness remains an editorial requirement. Prefer one authoritative
procedure, introduce terms before using them, use tables where they improve
comparison, keep examples purposeful, and remove genuine repetition. Clarity,
complete rules, accessibility, and table usability outrank a numeric target.

Formatting widths and Markdown style checks remain presentation tools, not copy
limits.

## Consequences

- A necessary rule or clarification cannot fail deployment merely for adding
  words.
- Reviewers must judge whether prose earns its place instead of relying on a
  counter.
- Content, schema, link, accessibility, and browser contracts continue to guard
  correctness and usability.
- Historical budget figures remain in earlier ADRs as context, but are no
  longer active policy.
